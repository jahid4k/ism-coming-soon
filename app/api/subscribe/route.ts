import { createHash, randomBytes } from "node:crypto";
import { after, NextResponse } from "next/server";
import { ensureSchema, getSql } from "@/lib/db";
import { sendWelcome } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PER_HOUR_PER_IP = 5;

export async function POST(req: Request) {
  let body: { email?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: real people never see this field. Bots fill it; we pretend it worked.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256")
    .update(ip + (process.env.IP_HASH_SALT ?? ""))
    .digest("hex");

  try {
    await ensureSchema();
    const sql = getSql();

    const recent = await sql`
      select count(*)::int as n from subscribers
      where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'`;
    if ((recent[0]?.n as number) >= MAX_PER_HOUR_PER_IP) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    // New address: insert. Previously unsubscribed address: re-enable. Already active: no row returned.
    const token = randomBytes(16).toString("hex");
    const rows = await sql`
      insert into subscribers (email, ip_hash, unsub_token)
      values (${email}, ${ipHash}, ${token})
      on conflict (email) do update set unsubscribed_at = null
        where subscribers.unsubscribed_at is not null
      returning unsub_token`;

    if (rows.length > 0) {
      const unsubToken = rows[0].unsub_token as string;
      after(() => sendWelcome(email, unsubToken));
    }

    // Same answer whether or not the address was already on the list.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
