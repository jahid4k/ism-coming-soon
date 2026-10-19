# 99 Names: coming-soon page

Single-page Next.js site with an email waitlist. Free stack: Vercel (hosting), MongoDB Atlas (emails), Gmail SMTP (welcome email).

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

## Set up the free services

1. **MongoDB Atlas.** Create a free cluster, add a database user, and copy the connection string (`mongodb+srv://...`) into `DATABASE_URL`. Under Network Access, allow `0.0.0.0/0`, because Vercel's IP addresses change. Data goes in the `ism_coming_soon` database (override with `DATABASE_NAME`). The `subscribers` collection and its indexes are created automatically on the first sign-up.
2. **Gmail.** Turn on 2-Step Verification for the Gmail account, create an App Password at myaccount.google.com/apppasswords, and set `GMAIL_USER` (the address) and `GMAIL_APP_PASSWORD`. Leave them empty to skip the welcome email: sign-ups are still saved. Gmail caps a personal account at about 500 emails a day and always sends from the authenticated address.
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

In Atlas (Browse Collections, filter) or mongosh, on the `subscribers` collection:

```js
db.subscribers.find({ unsubscribedAt: null }, { email: 1, createdAt: 1 }).sort({ createdAt: 1 })
```

When you send the launch email, skip anyone with `unsubscribedAt` set and stamp `notifiedAt` after sending. A personal Gmail account allows about 500 emails a day, so a larger list needs sending in daily batches.
