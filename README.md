# 99 Names: coming-soon page

Single-page Next.js site with an email waitlist. Free stack: Vercel (hosting), Neon Postgres (emails), Resend (welcome email).

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

## Set up the free services

1. **Neon.** Create a project at neon.com, copy the connection string into `DATABASE_URL`. (On Vercel you can instead add Neon from the Storage / Marketplace tab and it sets `DATABASE_URL` for you.) The `subscribers` table is created automatically on the first sign-up.
2. **Resend.** Create an API key (`RESEND_API_KEY`). To email subscribers you must verify a domain you own in Resend, then set `RESEND_FROM`, for example `99 Names <hello@yourdomain.com>`. Until then, leave both empty: sign-ups are still saved, there's just no welcome email.
3. **Vercel.** Import the repo, add the env vars from `.env.example`, deploy. Set `NEXT_PUBLIC_SITE_URL` to your final domain so the unsubscribe link is correct.

## Where things are

| What | File |
| --- | --- |
| All colors, type, spacing, radius, motion (swap your v2 values here) | `app/tokens.css` |
| Layout and components | `app/globals.css` |
| Page content and copy | `app/page.tsx` |
| App preview (the Today screen) | `components/PhonePreview.tsx` |
| Logo lockup (placeholder built from text) | `components/Logo.tsx` |
| Sign-up endpoint (validation, honeypot, rate limit, upsert) | `app/api/subscribe/route.ts` |
| Unsubscribe (confirm page + one-click) | `app/api/unsubscribe/route.ts` |

## Reading the list

In the Neon SQL editor:

```sql
select email, created_at from subscribers where unsubscribed_at is null order by created_at;
```

When you send the launch email, skip anyone with `unsubscribed_at` set and stamp `notified_at` after sending. Resend's free plan allows 100 emails a day, so a list larger than that needs sending in daily batches or a paid plan.
