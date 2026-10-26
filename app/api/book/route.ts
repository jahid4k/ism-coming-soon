import { NextResponse } from "next/server";
import { htmlPage } from "@/lib/page";
import { book } from "@/lib/site";
import { verifyBookToken } from "@/lib/token";

export const runtime = "nodejs";

// Checks the personal link, then hands off to the static PDF (served from the CDN, no size limit).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? "";
  if (!verifyBookToken(token)) {
    return htmlPage(
      "Link not valid",
      "<p>This download link isn't valid. Join the list on the home page to get your own.</p>",
      403,
    );
  }

  const res = NextResponse.redirect(new URL(book.path, url), 302);
  res.headers.set("cache-control", "private, no-store");
  return res;
}
