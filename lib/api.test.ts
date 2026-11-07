import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/apply/route";
const request = (body: string, origin = "https://club.example") =>
  new Request("https://club.example/api/apply", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body,
  });
test("rejects foreign origin before processing application", async () => {
  assert.equal(
    (await POST(request("{}", "https://other.example"))).status,
    403,
  );
});
test("rejects malformed JSON and oversized payload", async () => {
  assert.equal((await POST(request("{"))).status, 400);
  assert.equal((await POST(request("a".repeat(12001)))).status, 413);
});
test("returns field errors for invalid application", async () => {
  const response = await POST(request("{}"));
  assert.equal(response.status, 400);
  const data = await response.json();
  assert.ok(data.errors.name);
  assert.ok(data.errors.consent);
});
