import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/apply/route";

const validFields = {
  name: "홍길동",
  studentId: "20260001",
  department: "컴퓨터공학과",
  phone: "010-1234-5678",
  email: "test@example.com",
  track: "개발",
  motivation:
    "함께 프로젝트를 만들고 새로운 기술을 공부하며 성장하고 싶습니다.",
  portfolio: "",
  consent: "on",
};

function buildForm(
  fields: Record<string, string> = {},
  file: File | null = new File(["dummy"], "resume.pdf", {
    type: "application/pdf",
  }),
) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  if (file) form.append("attachment", file);
  return form;
}

function request(form: FormData, origin = "https://club.example") {
  return new Request("https://club.example/api/apply", {
    method: "POST",
    headers: { origin },
    body: form,
  });
}

test("rejects foreign origin before processing application", async () => {
  assert.equal(
    (await POST(request(buildForm(validFields), "https://other.example")))
      .status,
    403,
  );
});

test("rejects oversized payload via content-length and malformed body", async () => {
  const bigRequest = new Request("https://club.example/api/apply", {
    method: "POST",
    headers: {
      origin: "https://club.example",
      "content-length": String(10 * 1024 * 1024),
    },
    body: "x",
  });
  assert.equal((await POST(bigRequest)).status, 413);
  const malformedRequest = new Request("https://club.example/api/apply", {
    method: "POST",
    headers: {
      origin: "https://club.example",
      "content-type": "multipart/form-data; boundary=broken",
    },
    body: "not actually multipart",
  });
  assert.equal((await POST(malformedRequest)).status, 400);
});

test("returns field and attachment errors for invalid application", async () => {
  const response = await POST(request(buildForm({}, null)));
  assert.equal(response.status, 400);
  const data = await response.json();
  assert.ok(data.errors.name);
  assert.ok(data.errors.consent);
  assert.ok(data.errors.attachment);
});

test("rejects disallowed attachment type and oversized attachment", async () => {
  const badType = await POST(
    request(
      buildForm(
        validFields,
        new File(["x"], "resume.exe", { type: "application/octet-stream" }),
      ),
    ),
  );
  assert.equal(badType.status, 400);
  const tooBig = await POST(
    request(
      buildForm(
        validFields,
        new File([new Uint8Array(5 * 1024 * 1024)], "resume.pdf", {
          type: "application/pdf",
        }),
      ),
    ),
  );
  assert.equal(tooBig.status, 400);
});

test("rejects honeypot bot field", async () => {
  const response = await POST(
    request(buildForm({ ...validFields, website: "bot" })),
  );
  assert.equal(response.status, 400);
});

test("returns 503 when Google credentials are not configured", async () => {
  assert.equal((await POST(request(buildForm(validFields)))).status, 503);
});
