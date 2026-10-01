# Fix pass 1: build progress

Living log for the fix pass (branch `site/fix-pass-1`). Updated after every phase. See `docs/website/FIX_PASS_1.md` for the full spec.

## Phase 0: Setup, inputs, baseline — done

**Branch base deviation (logged per A3.3):** `FIX_PASS_1.md` assumes `site/v1` is merged into `main`. It isn't, literally: `git merge-base origin/main origin/site/v1` equals origin/main's own tip (83dd60c), meaning main is a strict ancestor/subset of site/v1, not the other way around — main never got the marketing site at all. Confirmed independently: the live production deployment's own alias list includes `buzrareviews-git-site-v1-samedames-projects.vercel.app`, i.e. Vercel is serving production from the `site/v1` git branch directly. Branched `site/fix-pass-1` from `origin/site/v1` instead of `main`. Nothing is lost: main's 5 most recent commits are all ancestors of site/v1.

**Inputs parsed and validated:**

```yaml
SUPPORT_EMAIL: support@buzrareviews.com   # valid email, passes validation
LEGAL_ENTITY_NAME: ""                     # empty, allowed -> null
LEGAL_MAILING_ADDRESS: ""                 # empty, allowed -> null
IN_PERSON_IN_BOZEMAN: yes                 # -> true
SHOW_HEALTHCARE: no                       # -> false
```

**Issue 3 (production redirect), verified without changing anything:**

```
$ curl -sI https://www.buzrareviews.com
HTTP/2 307
location: https://buzrareviews.com/
...

$ curl -sI https://buzrareviews.com
HTTP/2 200
...
```

Bare domain is primary and returns 200; www redirects to it. Note: the redirect status is 307, not the 301/308 the issue description expected — this is Vercel's own domain-redirect behavior (vercel.json is off-limits in this pass, and Vercel's redirect type isn't configurable from application code). Functionally correct (it is a redirect to the right place), so no code change; listed in the report as informational, not a Sam action, since there's nothing to act on.

**Baseline recorded** (dummy `.env.local` per A4, now including `UNSUBSCRIBE_SECRET`):

- `npx next typegen && npx tsc --noEmit`: exits 0.
- Scoped lint (`npx eslint . --ignore-pattern "src/app/api/cron/check-reviews/route.ts" --ignore-pattern "src/lib/places.ts"`): 0 problems.
- `npm run lint`: exactly 5 errors, all `@typescript-eslint/no-explicit-any` — 3 in `src/app/api/cron/check-reviews/route.ts` (lines 71, 92, 103), 2 in `src/lib/places.ts` (lines 35, 61). Matches exactly.
- `npx next build`: exits 0, every marketing route ○ or ●.
- `npx playwright test -c qa/playwright.config.ts`: 146 passed, 1 failed (JS-weight budget on `/`, ~213KB vs 200KB — pre-existing, documented in `docs/website/DECISIONS.md` #22-23, not one of this pass's 12 issues), 6 skipped. Recorded as pre-existing baseline, not touched by this pass.

**Codebase map** (exports, tables/columns, call sites, query params):

- `supabase/schema.sql`: `businesses(id uuid default gen_random_uuid(), name, owner_email, owner_phone, google_place_id unique, google_review_link, address, created_at, last_review_check_at, last_seen_review_time, stripe_customer_id, stripe_subscription_id, subscription_status, reply_tone)`. `customers(id uuid default gen_random_uuid(), business_id fk, name, email, phone, created_at)`. `review_requests(id, business_id, customer_id, sent_at, status, resend_email_id)`. `reviews(id, business_id, google_review_id, author_name, rating, review_text, review_time, ai_draft_reply, draft_generated_at, owner_replied, created_at)`. RLS enabled on all four (service-role key bypasses it; safety net only). No `email_suppressions` table or `dashboard_link_sent_at` column yet — both added in Phase 7's migration.
- `src/lib/resend.ts`: exports `resend` client, `sendReviewRequestEmail({ to, customerName?, businessName, reviewLink })` (greeting: `` customerName ? `Hi ${customerName},` : 'Hi,' `` — issue 5's real-email fallback, line 15), `sendConfirmationEmail({ to, businessName, businessId })` (builds the dashboard link inline as `` `${appUrl}/dashboard?businessId=${businessId}&businessName=${businessName}` `` — the format Phase 8's dashboard-link-recovery email must reuse, not duplicate).
- `src/lib/stripe.ts`: exports `stripe` client, re-exports `SUBSCRIPTION_PRICE_USD_CENTS`/`TRIAL_PERIOD_DAYS` from `pricing.ts`.
- `src/lib/supabase.ts`: exports `supabaseAdmin` (service-role, bypasses RLS).
- `src/lib/pricing.ts`: exports `SUBSCRIPTION_PRICE_USD_CENTS = 2900`, `TRIAL_PERIOD_DAYS = 14`.
- API routes: `GET/POST/PATCH /api/businesses` (GET by `?id=` returns `{id,name,owner_email,subscription_status,reply_tone}`; GET by `?q=` searches Places; POST creates + sends confirmation email; PATCH updates `reply_tone`). `POST /api/customers` — **the single call site for `sendReviewRequestEmail`** (line 47), inserts the customer then sends the request, logs `review_requests` with `status`. `POST /api/checkout` — Stripe Checkout session, blocks if `subscription_status` is already `active`/`trialing`. `GET /api/reviews?businessId=`. `POST /api/preview-reply`. `POST /api/webhooks/stripe` — sets `stripe_customer_id`/`stripe_subscription_id`/`subscription_status` on `checkout.session.completed`, and `subscription_status` to Stripe's real `subscription.status` (so `trialing`/`active`/`past_due`/`canceled` etc. are all real possible values) on `customer.subscription.updated`/`.deleted`. `GET /api/cron/check-reviews` — untouched, contains the 3 baseline `any` errors. `POST /api/contact` — zod-validated, honeypot (`company`) + 3s timing check, subject currently hardcoded `` `In-person setup request: ${business}` `` (needs Phase 2's meeting-type-aware subject).
- Access model (Phase 8 finding, not CRITICAL): `businesses.id` is `uuid default gen_random_uuid()` — random, not sequential/guessable. `GET /api/businesses?id=` and `PATCH` both accept just the ID with no further auth, matching the product's intentional no-login, link-as-bearer-token design (the dashboard link doubles as the credential). Not flagged CRITICAL since IDs are unguessable UUIDs; reported as-is as instructed (review only, no redesign).
- Dental demo greeting bug (issue 5) confirmed precisely: `src/content/demo.ts`'s `VERTICAL_DEMOS.dental.primaryReview` has no `customerFirstName`, and `ReviewLoopDemo.tsx` passes exactly `demo.primaryReview.customerFirstName` to `EmailCard` (line 64) — `secondaryReview.customerFirstName` is never read anywhere. Fix is a one-field addition to `primaryReview` only.
- Honeypot (issue 11): `ContactForm.tsx`'s honeypot already has `aria-hidden="true"` on the wrapper, off-screen CSS (`absolute -left-[9999px] h-px w-px overflow-hidden`), `tabIndex={-1}`, `autoComplete="off"`, label present for bots — matches Phase 6's recipe almost exactly already. The likely real gap: `position:absolute` off-screen (unlike `display:none`/`visibility:hidden`) is still included in most browsers' `.innerText()`, so the form's rendered text likely still contains "Company". Plan: verify empirically in Phase 6, fix by adding `invisible` (Tailwind's `visibility:hidden`) to the wrapper — doesn't reduce bot-catching (bots read DOM/attributes, not computed visibility) but should exclude it from `.innerText()`, matching the same `visibility:hidden` lesson already applied to the axe contrast bug during the original build.
- Healthcare flag (issue 7) touch points, full list from a repo-wide grep: `src/components/marketing/Hero.tsx:19` (audience line), `SiteHeader.tsx`/`MobileMenu.tsx`/`SiteFooter.tsx` (`WHO_ITS_FOR` arrays), `src/content/faq.ts` ("good-fit" answer), `src/components/marketing/review-loop/VerticalSwitch.tsx` (renders `VERTICAL_ORDER`, home's switch). `src/content/verticals.ts` and `src/content/demo.ts`'s dental entries stay untouched (content kept for Sam to flip the flag later); `/for/dental` stays statically generated (it's in `VERTICAL_SLUGS`, feeding `generateStaticParams` with `dynamicParams = false` — removing it would 404 the route, contradicting "stays reachable by direct link").
- Setup-offer touch points (issue 2), full list: `SiteHeader.tsx:105`, `MobileMenu.tsx:89` (nav "Bozeman" link), `SiteFooter.tsx:56` ("In-person setup in Bozeman" under "Who it's for" — the exact contradiction the issue names), `qa/routes.ts:7` (`/bozeman` in `MARKETING_ROUTES`), `src/app/sitemap.ts:6` (`/bozeman` in the static list), `api/contact/route.ts:53` (hardcoded "In-person setup request" subject). `FounderNote`, `faq.ts`'s "whos-behind", `FACTS_BAND`, `PLAN_INCLUDED`/`PLAN_INCLUDED_DETAILED` already read "online"/"on a call" from the previous session's fix, but need the `inPersonInBozeman`-flag-aware two-branch wording Phase 2 specifies.
- Metadata (issue 4) confirmed: every marketing page (`/`, `/pricing`, vertical pages, `/bozeman`, `/privacy`, `/terms`) sets only `title`/`description`/`alternates.canonical` — none sets `openGraph`/`twitter`, so Next's metadata merging inherits the root layout's home-page values verbatim on every subpage. Home page itself has no `alternates.canonical`. No app page sets `robots`.
- FAQ answer text is a plain `string` (`FaqItem.answer: string`), rendered as plain text in `Faq.tsx` (`<p>{item.answer}</p>`) with only one optional separate `link` per item — no inline-link support. The "contract-cancel" FAQ's "Just email Sam" (issue 1's literal unlinked phrase) and Phase 5's legal-page wording both need an inline mailto link mid-sentence, which requires widening `FaqItem.answer` to `ReactNode` (plan for Phase 1, logged as a decision).
- `Faq` is shared verbatim between home (`HOME_FAQ_ORDER`) and pricing (`PRICING_FAQ_ORDER`) from the same `FAQ_ITEMS` array — a content edit automatically applies to both pages, already satisfying the "single source" requirements in Phases 2 and 4.
- `PlanCard.tsx` reads `PLAN_INCLUDED` from `content/home.ts` and is the same component instantiated on both home and `/pricing` (different `location` prop only) — same single-source guarantee already holds structurally.
- Privacy/Terms already have the `{site.contactEmail && <a href="mailto:...">}` conditional pattern built in (currently inert since `contactEmail` was `null`) — setting `contactEmail` activates them immediately. Still need Phase 5's wording rewrite (entity name, mailing address, unsubscribe mention, Manage billing mention) and the `/bozeman` → `/setup` link update.
- `qa/playwright.config.ts` projects: mobile (390x844), tablet (768x1024), desktop (1440x900), `webServer` on `:3100`, outputs to `qa-artifacts/`.

## Phase 1: Contact email + trial wording — not started
## Phase 2: Setup page — not started
## Phase 3: Metadata — not started
## Phase 4: Demo greeting + healthcare flag — not started
## Phase 5: Legal pages — not started
## Phase 6: Honeypot accessibility — not started
## Phase 7: Unsubscribe + suppression — not started
## Phase 8: Dashboard — not started
## Phase 9: Tests, gates, report, push — not started
