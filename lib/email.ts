import nodemailer from "nodemailer";
import { site } from "./site";

/**
 * Sends the welcome email. Never throws: a failed email must not break sign-up.
 * Sent through Gmail SMTP. Skipped when GMAIL_USER or GMAIL_APP_PASSWORD is empty.
 */
export async function sendWelcome(to: string, unsubToken: string): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return;

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
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: { name: site.name, address: user },
      to,
      subject: "You're on the list for 99 Names",
      text,
      html,
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  } catch (err) {
    console.error("[email]", err);
  }
}
