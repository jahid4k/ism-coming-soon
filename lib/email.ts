import nodemailer from "nodemailer";
import { book, site } from "./site";
import { bookUrl } from "./token";

/**
 * Sends through Gmail SMTP: GMAIL_USER + GMAIL_APP_PASSWORD.
 * Without them, sign-ups are still saved and the download button still works; no email goes out.
 */
export function emailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

const SUBJECT = `Your free book: ${book.title}`;

function buildMessage(downloadUrl: string, unsubUrl: string) {
  const text = [
    "Assalamu alaikum,",
    "",
    "Thank you for joining Tadabbur Studio. Here is your free book of all 99 Names of Allah, with a short description and a du'a for each, in English and Bengali:",
    "",
    downloadUrl,
    "",
    "The app isn't ready yet. We'll email you the day it is.",
    "",
    "May Allah make us among those who know Him and call on Him by His Names.",
    "",
    `No longer want these emails? Unsubscribe: ${unsubUrl}`,
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;background:#0B1026;color:#E9EAF2;font-family:Georgia,'Times New Roman',serif">
  <div style="max-width:480px;margin:0 auto;padding:36px 24px;font-size:17px;line-height:1.6">
    <p style="margin:0 0 24px;font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#F5C77A">Tadabbur Studio</p>
    <p style="margin:0 0 16px">Assalamu alaikum,</p>
    <p style="margin:0 0 24px">Thank you for joining. Here is your free book of all 99 Names of Allah, with a short description and a du'a for each, in English and Bengali.</p>
    <p style="margin:0 0 28px"><a href="${downloadUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:15px 28px;border-radius:999px;background:#F5C77A;color:#0B1026;font:700 16px Arial,Helvetica,sans-serif;text-decoration:none">Download the book</a></p>
    <p style="margin:0 0 16px">The app isn't ready yet. We'll email you the day it is.</p>
    <p style="margin:0 0 32px;color:#A9AECB">May Allah make us among those who know Him and call on Him by His Names.</p>
    <p style="margin:0;font:13px/1.5 Arial,Helvetica,sans-serif;color:#A9AECB">Button not working? Copy this link: <span style="word-break:break-all">${downloadUrl}</span><br>No longer want these emails? <a href="${unsubUrl}" style="color:#F5C77A">Unsubscribe</a>.</p>
  </div>
</body></html>`;

  return { text, html };
}

/**
 * Sends the welcome email with the personal book link. Never throws:
 * a failed email must not break sign-up, and the on-page download still works.
 */
export async function sendWelcome(to: string, subscriberId: string, unsubToken: string): Promise<void> {
  if (!emailConfigured()) return;

  const downloadUrl = bookUrl(subscriberId, site.url);
  const unsubUrl = `${site.url}/api/unsubscribe?token=${unsubToken}`;
  const { text, html } = buildMessage(downloadUrl, unsubUrl);
  const headers = {
    "List-Unsubscribe": `<${unsubUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };

  try {
    const user = process.env.GMAIL_USER as string;
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass: (process.env.GMAIL_APP_PASSWORD as string).replace(/\s+/g, "") },
    });
    await transport.sendMail({ from: `"${site.name}" <${user}>`, to, subject: SUBJECT, text, html, headers });
  } catch (err) {
    console.error("[email]", err);
  }
}
