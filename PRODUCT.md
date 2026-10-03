# BuzraReviews

Context for anyone (human or agent) doing design, copy, or UI work on this repo. See `DESIGN.md` for the visual system and `docs/website/MASTER_PROMPT.md` for the full build spec this was generated from.

## What it is

BuzraReviews helps single-location local businesses get more Google reviews and reply to them well. The owner finds their business through a Google search during onboarding, then adds each customer's name and email after a visit. BuzraReviews immediately emails that customer a short review request from the business's name, with a "Leave a review" button that opens the business's Google review form. Once a day, BuzraReviews checks Google for new reviews and drafts a reply to each new one with AI, in the tone the owner chose. The owner copies the draft and pastes it into Google's reply box. It costs $29 a month after a 14-day free trial, with no contract. The founder, Sam, is based in Bozeman, Montana, and sets up local businesses in person.

Verify any claim against the code before writing copy: `src/lib/resend.ts` (email wording), `src/lib/anthropic.ts` (reply rules), `src/app/dashboard/page.tsx` (tone presets), `src/lib/stripe.ts` / `src/lib/pricing.ts` (price and trial), `vercel.json` (daily cron), `src/lib/places.ts` (review limits).

## Audience

Owners of single-location salons and barbershops, dental offices, restaurants and cafes (also fits auto shops, chiropractors, similar). Busy, skeptical of sales pitches, reading this on a phone between clients. They want to know, in five seconds: what does this do, who's it for, what does it cost.

## Voice rules

A friendly, plainspoken local business owner talking to another one. Short sentences. Concrete nouns ("customer," "review," "reply," "Google," "email," "$29"). Grade 6-8 reading level. "You" and "your customers." Buttons say exactly what happens ("Find my business," "Start free trial," "Copy reply").

Hard bans: em dash (—) and en dash (–) anywhere, ever. Hype words (revolutionize, supercharge, unlock, seamless, game-changer, cutting-edge, leverage, empower, robust, streamline, world-class, all-in-one, solution(s), transform(ative), magic(al), delight, "AI-powered," "powered by AI," "in today's," "fast-paced," "reputation management," "guaranteed"/"guarantee," and more — full list in `docs/website/MASTER_PROMPT.md` G3). No exclamation marks except inside demo emails/replies that mirror real product text. No "Lorem ipsum," "TBD," "Coming soon." No invented facts — every claim must trace to `docs/website/CLAIMS.md`.

## Claims (short version — full table in MASTER_PROMPT.md B2)

| Can say | Cannot say |
|---|---|
| Review requests sent by email after a customer is added | Text/SMS requests, bulk upload, CRM sync |
| Google reviews checked once a day | "Real-time," "instant," other platforms (Yelp, Facebook) |
| AI drafts a reply in the owner's chosen tone; owner copies and pastes it | "Auto-replies," "we post for you" |
| $29/month, 14-day free trial, no contract, cancel anytime, card entered via Stripe at trial start | "No credit card required," discounts, tiers, "free forever" |
| Built by Sam in Bozeman, Montana; in-person setup in/around Bozeman | Team size, funding, years in business |
| The mechanism (asking every customer produces more reviews) with a BrightLocal citation | Invented outcomes or numbers ("3x more reviews," star ratings of BuzraReviews, "trusted by") |
| "Payments are handled by Stripe" | "Bank-level security," "SOC 2," "HIPAA compliant" |

## Demos

Every product demo (business name, reviewer, review text) is fictional, tagged "Example," and never phrased as praise for BuzraReviews. Never demo a feature that doesn't exist (texting, auto-posting, analytics charts, integrations, multiple locations).
