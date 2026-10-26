import { createHash, randomBytes } from "node:crypto";
import { after, NextResponse } from "next/server";
import { getSubscribers } from "@/lib/db";
import { emailConfigured, sendWelcome } from "@/lib/email";
import { bookUrl } from "@/lib/token";

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

  // Honeypot: real people never see this field. Bots fill it; we pretend it worked (no book link).
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true, download: "", emailed: false });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256")
    .update(ip + (process.env.APP_SECRET ?? process.env.IP_HASH_SALT ?? ""))
    .digest("hex");

  try {
    const subscribers = await getSubscribers();

    const recent = await subscribers.countDocuments({
      ipHash,
      createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
    });
    if (recent >= MAX_PER_HOUR_PER_IP) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    // New address: insert. Previously unsubscribed address: re-enable. Already active: leave as is.
    let id: string;
    let unsubToken: string;
    let isFresh = true;
    const token = randomBytes(16).toString("hex");
    try {
      const { insertedId } = await subscribers.insertOne({
        email,
        unsubToken: token,
        ipHash,
        createdAt: new Date(),
        unsubscribedAt: null,
        notifiedAt: null,
      });
      id = insertedId.toHexString();
      unsubToken = token;
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err; // 11000 = email already on the list
      const reenabled = await subscribers.findOneAndUpdate(
        { email, unsubscribedAt: { $type: "date" } },
        { $set: { unsubscribedAt: null } },
        { returnDocument: "after" },
      );
      const existing = reenabled ?? (await subscribers.findOne({ email }));
      if (!existing) throw new Error("subscriber vanished after duplicate-key error");
      id = existing._id.toHexString();
      unsubToken = existing.unsubToken;
      isFresh = reenabled !== null;
    }

    // Everyone gets the book on the page, new or returning. Only new/re-enabled people get the email,
    // so typing someone else's address can't be used to spam them.
    const willEmail = isFresh && emailConfigured();
    if (willEmail) after(() => sendWelcome(email, id, unsubToken));

    return NextResponse.json({ ok: true, download: bookUrl(id), emailed: willEmail });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
