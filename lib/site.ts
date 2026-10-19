export const site = {
  name: "99 Names",
  description:
    "A free app to memorize the 99 names of Allah, understand them, and live by them. About three minutes a day. Coming soon.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
};
