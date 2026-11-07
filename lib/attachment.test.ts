import { test } from "node:test";
import assert from "node:assert/strict";
import { validateAttachmentMeta, getExtension, sanitizeFileNamePart } from "./attachment";
test("accepts allowed extensions within size limit", () => {
  assert.equal(validateAttachmentMeta({ name: "지원서.docx", size: 1024 }), null);
  assert.equal(validateAttachmentMeta({ name: "resume.PDF", size: 1 }), null);
});
test("rejects disallowed extensions, oversized files and bad metadata", () => {
  assert.ok(validateAttachmentMeta({ name: "resume.exe", size: 1024 }));
  assert.ok(validateAttachmentMeta({ name: "resume.docx", size: 11 * 1024 * 1024 }));
  assert.ok(validateAttachmentMeta({ name: "", size: 1024 }));
  assert.ok(validateAttachmentMeta({ name: "noext", size: 1024 }));
  assert.ok(validateAttachmentMeta({ name: "resume.docx", size: 0 }));
  assert.ok(validateAttachmentMeta({ name: "resume.docx", size: NaN }));
});
test("getExtension and sanitizeFileNamePart", () => {
  assert.equal(getExtension("a.b.DOCX"), "docx");
  assert.equal(getExtension("noext"), "");
  assert.equal(sanitizeFileNamePart("홍길동/.."), "홍길동");
});
