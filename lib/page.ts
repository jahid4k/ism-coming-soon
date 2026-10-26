/** Small standalone HTML page in the night atmosphere, for the API routes that show a message. */
export function htmlPage(title: string, body: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;min-height:100vh;background:linear-gradient(180deg,#070B22 0%,#121842 40%,#252A62 100%);color:#E9EAF2;font-family:Georgia,'Times New Roman',serif">
<main style="max-width:440px;margin:0 auto;padding:18vh 24px 48px;font-size:19px;line-height:1.55">
<p style="margin:0 0 20px;font:700 11.5px/1 Arial,Helvetica,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#F5C77A">Tadabbur Studio</p>
<h1 style="margin:0 0 16px;font-size:34px;line-height:1.1;font-weight:600;color:#F6F0E4">${title}</h1>${body}</main></body></html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export const buttonStyle =
  "display:inline-flex;align-items:center;min-height:52px;padding:0 28px;border:0;border-radius:999px;background:#F5C77A;color:#0B1026;font:700 16px Arial,Helvetica,sans-serif;text-decoration:none;cursor:pointer";
