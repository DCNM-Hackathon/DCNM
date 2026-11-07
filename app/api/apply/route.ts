import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";
import { applicationSchema } from "@/lib/application";
import {
  validateAttachmentMeta,
  sanitizeFileNamePart,
  getExtension,
  MAX_ATTACHMENT_SIZE,
} from "@/lib/attachment";
import { getDriveAccessToken } from "@/lib/googleDrive";
export const runtime = "nodejs";

function buildMultipartBody(
  boundary: string,
  metadata: unknown,
  mimeType: string,
  fileBytes: Buffer,
) {
  const preamble = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify(metadata)}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: ${mimeType}\r\n\r\n`,
  );
  const closing = Buffer.from(`\r\n--${boundary}--`);
  return Buffer.concat([preamble, fileBytes, closing]);
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json(
      { message: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_ATTACHMENT_SIZE + 50 * 1024)
    return NextResponse.json(
      { message: "입력 내용이 너무 깁니다." },
      { status: 413 },
    );
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "올바르지 않은 요청입니다." },
      { status: 400 },
    );
  }
  const payload = {
    ...Object.fromEntries(formData),
    consent: formData.get("consent") === "on",
  };
  const parsed = applicationSchema.safeParse(payload);
  const file = formData.get("attachment");
  const attachmentError =
    file instanceof File
      ? validateAttachmentMeta({ name: file.name, size: file.size })
      : "첨부파일을 선택해 주세요.";
  if (!parsed.success || attachmentError)
    return NextResponse.json(
      {
        message: "입력 내용을 확인해 주세요.",
        errors: {
          ...(parsed.success ? {} : parsed.error.flatten().fieldErrors),
          attachment: attachmentError ? [attachmentError] : undefined,
        },
      },
      { status: 400 },
    );
  const a = parsed.data;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key = process.env.GOOGLE_PRIVATE_KEY,
    sheet = process.env.GOOGLE_SHEETS_ID,
    folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (
    !email ||
    !key ||
    !sheet ||
    !folderId ||
    !process.env.GOOGLE_DRIVE_CLIENT_ID ||
    !process.env.GOOGLE_DRIVE_CLIENT_SECRET ||
    !process.env.GOOGLE_DRIVE_REFRESH_TOKEN
  )
    return NextResponse.json(
      {
        message:
          "현재 지원서 접수가 준비 중입니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 503 },
    );
  try {
    const driveToken = await getDriveAccessToken();
    if (!driveToken) throw new Error("Drive auth failed");
    const attachment = file as File;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const driveFileName =
      [stamp, sanitizeFileNamePart(a.name), sanitizeFileNamePart(a.studentId)]
        .filter(Boolean)
        .join("_") + `.${getExtension(attachment.name)}`;
    const boundary = `dcmboundary${crypto.randomUUID()}`;
    const fileBytes = Buffer.from(await attachment.arrayBuffer());
    const uploadRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${driveToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: buildMultipartBody(
          boundary,
          { name: driveFileName, parents: [folderId] },
          attachment.type || "application/octet-stream",
          fileBytes,
        ),
        signal: AbortSignal.timeout(20000),
      },
    );
    if (!uploadRes.ok) {
      console.error("Drive upload failed", uploadRes.status, await uploadRes.text());
      throw new Error("Drive upload failed");
    }
    const uploaded = (await uploadRes.json()) as {
      name: string;
      webViewLink: string;
    };
    const auth = new JWT({
      email,
      key: key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const token = await auth.getAccessToken();
    const range = `'${(process.env.GOOGLE_SHEETS_TAB || "Applications").replace(/'/g, "''")}'!A:M`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheet)}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [
            [
              new Date().toISOString(),
              a.name,
              a.studentId,
              a.department,
              a.phone,
              a.email,
              a.track,
              a.motivation,
              a.portfolio,
              "동의",
              "미검토",
              uploaded.name,
              uploaded.webViewLink,
            ],
          ],
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok) {
      console.error("Sheets append failed", response.status, await response.text());
      throw new Error("Sheets append failed");
    }
    return NextResponse.json(
      { message: "지원서가 접수되었습니다. 함께할 날을 기대할게요!" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Apply submission failed", err);
    return NextResponse.json(
      { message: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
