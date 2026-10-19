import { ensureSchema, getSql } from "@/lib/db";

export const runtime = "nodejs";

const TOKEN_RE = /^[a-f0-9]{32}$/;

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;background:#F7F1E6;color:#1F3580;font-family:Arial,Helvetica,sans-serif">
<main style="max-width:420px;margin:15vh auto;padding:0 24px;font-size:18px;line-height:1.6">
<h1 style="font-size:26px;margin:0 0 16px">${title}</h1>${body}</main></body></html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

function readToken(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  return TOKEN_RE.test(token) ? token : null;
}

// GET only asks for confirmation, so email link scanners can't unsubscribe people by accident.
export async function GET(req: Request) {
  const token = readToken(req);
  if (!token) return page("Link not valid", "<p>This unsubscribe link isn't valid.</p>", 400);
  return page(
    "Unsubscribe",
    `<p>Stop emails from 99 Names?</p>
<form method="post" action="/api/unsubscribe?token=${token}">
<button type="submit" style="min-height:48px;padding:0 24px;border:0;border-radius:10px;background:#1F3580;color:#F7F1E6;font:inherit;font-weight:700;cursor:pointer">Unsubscribe</button>
</form>`,
  );
}

// POST does the work. Also the target of the one-click List-Unsubscribe header.
export async function POST(req: Request) {
  const token = readToken(req);
  if (!token) return page("Link not valid", "<p>This unsubscribe link isn't valid.</p>", 400);
  try {
    await ensureSchema();
    const sql = getSql();
    await sql`update subscribers set unsubscribed_at = now()
              where unsub_token = ${token} and unsubscribed_at is null`;
    return page("You're unsubscribed", "<p>You won't get any more emails from 99 Names.</p>");
  } catch (err) {
    console.error("[unsubscribe]", err);
    return page("Something went wrong", "<p>Please try again in a minute.</p>", 500);
  }
}
