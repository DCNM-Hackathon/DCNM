import { test } from "node:test";
import assert from "node:assert/strict";
import { applicationSchema } from "./application";
const valid = {
  name: "홍길동",
  studentId: "20260001",
  department: "컴퓨터공학과",
  phone: "010-1234-5678",
  email: "test@example.com",
  track: "개발",
  motivation:
    "함께 프로젝트를 만들고 새로운 기술을 공부하며 성장하고 싶습니다.",
  portfolio: "https://github.com/example",
  consent: true,
  website: "",
};
test("accepts valid application and optional empty portfolio", () => {
  assert.equal(applicationSchema.safeParse(valid).success, true);
  assert.equal(
    applicationSchema.safeParse({ ...valid, portfolio: "" }).success,
    true,
  );
});
test("rejects invalid contact, student ID, track, consent and motivation", () => {
  for (const changes of [
    { email: "bad" },
    { phone: "123" },
    { studentId: "abc" },
    { track: "기타" },
    { consent: false },
    { motivation: "짧음" },
    { motivation: "a".repeat(501) },
    { name: " " },
    { department: "" },
  ])
    assert.equal(
      applicationSchema.safeParse({ ...valid, ...changes }).success,
      false,
    );
});
test("rejects unsafe portfolio protocols and bot field", () => {
  for (const changes of [
    { portfolio: "javascript:alert(1)" },
    { portfolio: "ftp://example.com" },
    { website: "bot" },
  ])
    assert.equal(
      applicationSchema.safeParse({ ...valid, ...changes }).success,
      false,
    );
});
