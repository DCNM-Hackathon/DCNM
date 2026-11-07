import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";
import { applicationSchema } from "@/lib/application";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json(
      { message: "허용되지 않은 요청입니다." },
      { status: 403 },
    );
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 12000)
    return NextResponse.json(
      { message: "입력 내용이 너무 깁니다." },
      { status: 413 },
    );
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { message: "올바르지 않은 요청입니다." },
      { status: 400 },
    );
  }
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      {
        message: "입력 내용을 확인해 주세요.",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key = process.env.GOOGLE_PRIVATE_KEY,
    sheet = process.env.GOOGLE_SHEETS_ID;
  if (!email || !key || !sheet)
    return NextResponse.json(
      {
        message:
          "현재 지원서 접수가 준비 중입니다. 잠시 후 다시 시도해 주세요.",
      },
      { status: 503 },
    );
  try {
    const auth = new JWT({
      email,
      key: key.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const token = await auth.getAccessToken();
    const a = parsed.data;
    const range = `'${(process.env.GOOGLE_SHEETS_TAB || "Applications").replace(/'/g, "''")}'!A:K`;
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
            ],
          ],
        }),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok) throw new Error("Sheets append failed");
    return NextResponse.json(
      { message: "지원서가 접수되었습니다. 함께할 날을 기대할게요!" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
