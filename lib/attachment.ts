export const ALLOWED_ATTACHMENT_EXTENSIONS = ["pdf", "doc", "docx", "hwp"];
export const MAX_ATTACHMENT_SIZE = 4 * 1024 * 1024;

export function getExtension(fileName: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName.trim());
  return match ? match[1].toLowerCase() : "";
}

const UNSAFE_FILENAME_CHARS = new RegExp(
  String.raw`[\\/:*?"<>|.]|\s`,
  "g",
);

export function sanitizeFileNamePart(value: string) {
  return value
    .normalize("NFC")
    .replace(UNSAFE_FILENAME_CHARS, "")
    .trim()
    .slice(0, 40);
}

export type AttachmentMeta = { name: string; size: number };

export function validateAttachmentMeta(meta: AttachmentMeta) {
  const ext = getExtension(meta.name);
  if (!meta.name || !ext)
    return "첨부파일 이름을 확인할 수 없습니다.";
  if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(ext))
    return `${ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")} 형식만 업로드할 수 있습니다.`;
  if (!Number.isFinite(meta.size) || meta.size <= 0)
    return "파일 용량을 확인할 수 없습니다.";
  if (meta.size > MAX_ATTACHMENT_SIZE)
    return `파일 용량은 ${MAX_ATTACHMENT_SIZE / 1024 / 1024}MB 이하여야 합니다.`;
  return null;
}
