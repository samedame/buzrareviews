# BuzraReviews

Automated Google review request and AI-drafted reply software for single-location local businesses (salons, restaurants, auto shops, dentists/chiropractors).

## Stack
- Next.js (Vercel)
- Supabase
- Stripe
- Resend/Postmark (email)
- Claude API (Haiku) — AI-drafted review replies
- Google Places API (New) — business lookup
- Twilio A2P 10DLC (SMS, v1.5)

## v1 core loop
Places API lookup → review link → request email → new-review detection → AI-drafted reply
