import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSubscribers } from "@/lib/db";
import { sendWelcome } from "@/lib/email";
import { bookUrl } from "@/lib/token";

export const runtime = "nodejs";
export const maxDuration = 30; // the request waits for Gmail to accept the message

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
    return NextResponse.json({ ok: true, status: "emailed", download: "" });
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

    // New address: insert. Previously unsubscribed address: re-enable. Already active: no email, book only.
    // `undo` puts the list back as it was if the email can't be sent, so a retry starts clean.
    let id: string;
    let unsubToken: string;
    let undo: () => Promise<unknown>;
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
      undo = () => subscribers.deleteOne({ _id: insertedId });
    } catch (err) {
      if ((err as { code?: number }).code !== 11000) throw err; // 11000 = email already on the list
      const before = await subscribers.findOneAndUpdate(
        { email, unsubscribedAt: { $type: "date" } },
        { $set: { unsubscribedAt: null } },
        { returnDocument: "before" },
      );
      if (!before) {
        // Already on the list: no second email (so nobody can use the form to spam an address), but the
        // book is still on the page.
        const existing = await subscribers.findOne({ email });
        if (!existing) throw new Error("subscriber vanished after duplicate-key error");
        return NextResponse.json({
          ok: true,
          status: "already",
          download: bookUrl(existing._id.toHexString()),
        });
      }
      id = before._id.toHexString();
      unsubToken = before.unsubToken;
      undo = () =>
        subscribers.updateOne({ _id: before._id }, { $set: { unsubscribedAt: before.unsubscribedAt } });
    }

    // A new or re-enabled address only gets the book once its email has gone out. If the send fails, undo
    // the sign-up and hold the book back; otherwise a retry would look like "already on the list" and
    // skip the email.
    const sent = await sendWelcome(email, unsubToken);
    if (!sent) {
      await undo().catch((err) => console.error("[subscribe] rollback failed", err));
      return NextResponse.json({ ok: false, error: "email_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, status: "emailed", download: bookUrl(id) });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
