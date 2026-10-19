import { Resend } from "resend";
import { site } from "./site";

/**
 * Sends the welcome email. Never throws: a failed email must not break sign-up.
 * Skipped when RESEND_API_KEY or RESEND_FROM is empty (e.g. before a domain is verified).
 */
export async function sendWelcome(to: string, unsubToken: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) return;

  const unsubUrl = `${site.url}/api/unsubscribe?token=${unsubToken}`;

  const text = [
    "Assalamu alaikum,",
    "",
    "Thanks for joining the list. 99 Names is a free app that helps you learn Allah's names one a day: memorize them, understand them, and live by them.",
    "",
    "It isn't ready yet. We'll email you the day it is.",
    "",
    `Changed your mind? Unsubscribe: ${unsubUrl}`,
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;background:#F7F1E6;color:#1F3580;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px;font-size:17px;line-height:1.6">
    <p style="margin:0 0 16px">Assalamu alaikum,</p>
    <p style="margin:0 0 16px">Thanks for joining the list. 99 Names is a free app that helps you learn Allah's names one a day: memorize them, understand them, and live by them.</p>
    <p style="margin:0 0 24px">It isn't ready yet. We'll email you the day it is.</p>
    <p style="margin:0;font-size:14px;color:#4B5578">Changed your mind? <a href="${unsubUrl}" style="color:#B03A22">Unsubscribe</a>.</p>
  </div>
</body></html>`;

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: "You're on the list for 99 Names",
      text,
      html,
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (error) console.error("[resend]", error);
  } catch (err) {
    console.error("[resend]", err);
  }
}
