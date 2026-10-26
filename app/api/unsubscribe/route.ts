import { getSubscribers } from "@/lib/db";
import { buttonStyle, htmlPage } from "@/lib/page";

export const runtime = "nodejs";

const TOKEN_RE = /^[a-f0-9]{32}$/;

function readToken(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  return TOKEN_RE.test(token) ? token : null;
}

const invalid = () => htmlPage("Link not valid", "<p>This unsubscribe link isn't valid.</p>", 400);

// GET only asks for confirmation, so email link scanners can't unsubscribe people by accident.
export async function GET(req: Request) {
  const token = readToken(req);
  if (!token) return invalid();
  return htmlPage(
    "Unsubscribe",
    `<p>Stop emails from Tadabbur Studio?</p>
<form method="post" action="/api/unsubscribe?token=${token}">
<button type="submit" style="${buttonStyle}">Unsubscribe</button>
</form>`,
  );
}

// POST does the work. Also the target of the one-click List-Unsubscribe header.
export async function POST(req: Request) {
  const token = readToken(req);
  if (!token) return invalid();
  try {
    const subscribers = await getSubscribers();
    await subscribers.updateOne(
      { unsubToken: token, unsubscribedAt: null },
      { $set: { unsubscribedAt: new Date() } },
    );
    return htmlPage("You're unsubscribed", "<p>You won't get any more emails from Tadabbur Studio.</p>");
  } catch (err) {
    console.error("[unsubscribe]", err);
    return htmlPage("Something went wrong", "<p>Please try again in a minute.</p>", 500);
  }
}
