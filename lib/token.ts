import { createHmac, timingSafeEqual } from "node:crypto";

// Signs the personal download link. APP_SECRET is optional: without it, the database URL
// (which already contains a password) is used as the signing key.
function secret(): string {
  return process.env.APP_SECRET ?? process.env.DATABASE_URL ?? "dev-only-secret";
}

// A MongoDB ObjectId as 24 hex characters.
const ID_RE = /^[a-f0-9]{24}$/;

function mac(id: string): string {
  return createHmac("sha256", secret()).update(`book:${id}`).digest("hex").slice(0, 32);
}

/** Link token for one subscriber: "<id>.<signature>". Needs no database lookup to verify. */
export function signBookToken(id: string): string {
  return `${id}.${mac(id)}`;
}

export function verifyBookToken(token: string): boolean {
  const [id, sig] = token.split(".");
  if (!id || !ID_RE.test(id) || !sig) return false;
  const expected = Buffer.from(mac(id));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function bookUrl(id: string, base = ""): string {
  return `${base}/api/book?t=${signBookToken(id)}`;
}
