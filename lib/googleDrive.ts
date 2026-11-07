export async function getDriveAccessToken() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    console.error("Drive token refresh failed", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { access_token?: string };
  return data.access_token || null;
}
