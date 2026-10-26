import nodemailer from "nodemailer";
import { site } from "./site";

/**
 * Sends through Gmail SMTP: GMAIL_USER + GMAIL_APP_PASSWORD.
 * Without them nothing can be sent, and a new sign-up fails (it only gets the book once its email is sent).
 */
function emailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

const SUBJECT = `Welcome to ${site.name}`;

function buildMessage(unsubUrl: string) {
  const text = [
    "Assalamu alaikum,",
    "",
    "Thank you for joining Tadabbur Studio. Your free book of all 99 Names of Allah, with a short description and a du'a for each, in English and Bengali, is ready to download on the page where you signed up.",
    "",
    "Lost the page? Enter this email address there again and the download button will show up.",
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
    <p style="margin:0 0 16px">Thank you for joining. Your free book of all 99 Names of Allah, with a short description and a du'a for each, in English and Bengali, is ready to download on the page where you signed up.</p>
    <p style="margin:0 0 24px">Lost the page? Enter this email address there again and the download button will show up.</p>
    <p style="margin:0 0 16px">The app isn't ready yet. We'll email you the day it is.</p>
    <p style="margin:0 0 32px;color:#A9AECB">May Allah make us among those who know Him and call on Him by His Names.</p>
    <p style="margin:0;font:13px/1.5 Arial,Helvetica,sans-serif;color:#A9AECB">No longer want these emails? <a href="${unsubUrl}" style="color:#F5C77A">Unsubscribe</a>.</p>
  </div>
</body></html>`;

  return { text, html };
}

/**
 * Sends the welcome email. Never throws: resolves true only once Gmail has accepted the message,
 * and false if it isn't configured or the send failed.
 */
export async function sendWelcome(to: string, unsubToken: string): Promise<boolean> {
  if (!emailConfigured()) {
    console.error("[email] GMAIL_USER / GMAIL_APP_PASSWORD are not set");
    return false;
  }

  const unsubUrl = `${site.url}/api/unsubscribe?token=${unsubToken}`;
  const { text, html } = buildMessage(unsubUrl);
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
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });
    const info = await transport.sendMail({
      from: `"${site.name}" <${user}>`,
      to,
      subject: SUBJECT,
      text,
      html,
      headers,
    });
    return info.accepted.length > 0;
  } catch (err) {
    console.error("[email]", err);
    return false;
  }
}
