# BuzraReviews

Automated Google review request and AI-drafted reply software for single-location local businesses (salons, restaurants, auto shops, dentists/chiropractors).

## Stack
- Next.js (App Router, TypeScript, Tailwind) on Vercel
- Supabase (Postgres)
- Stripe (billing -- not yet wired in)
- Resend (email)
- Claude API (Haiku) -- AI-drafted review replies
- Google Places API (New) -- business lookup + review polling
- Twilio A2P 10DLC (SMS, v1.5)

## v1 core loop
1. `GET /api/businesses?q=` -- search Google Places for a business during onboarding
2. `POST /api/businesses` -- create a business record from the confirmed place
3. `POST /api/customers` -- add a customer, immediately sends the review-request email (Resend)
4. `GET /api/cron/check-reviews` -- runs every 4 hours (see `vercel.json`), polls Places API for new reviews, generates an AI-drafted reply (Claude Haiku) for each new one
5. `GET /api/reviews?businessId=` -- lists reviews + drafts for the (future) owner dashboard

## Known limitation (v1)
The Places API only returns up to 5 reviews per business and doesn't guarantee
they're the most recent. A business that receives several reviews between
polling runs could have one fall outside that top-5 window and never get
picked up. The real fix is the Google Business Profile API (applied for,
gated, targeted for v1.5), which supports full paginated review listing.
This is the documented workaround until that access clears, not a
permanent design decision.

## Setup
1. Copy `.env.local.example` to `.env.local` and fill in the keys.
2. Run `supabase/schema.sql` in the Supabase SQL editor for your project.
3. `npm install && npm run dev`
4. Set the same env vars in Vercel's project settings for production, plus `CRON_SECRET` (Vercel Cron sends it automatically as a Bearer token).
