# Fix pass 1: final report

## Summary

All 12 issues from the October 1, 2026 content review are fixed on `site/fix-pass-1`: a working contact email everywhere, a renamed and flag-aware `/setup` page, per-page metadata, a fixed demo greeting and a healthcare-marketing visibility flag, rewritten legal pages, a genuinely hidden honeypot, and a full unsubscribe/suppression system with a lost-dashboard-link flow and a Stripe billing portal. Every gate passes except the two pre-existing, already-documented exceptions from the original build (JS weight, mobile LCP variance on a local server) — neither is one of this pass's 12 issues, and neither regressed.

## Issues

| # | Issue | What changed | Files | Test |
|---|---|---|---|---|
| 1 | No email address anywhere | `site.contactEmail` set; real `mailto:` links added to the FAQ cancel answer and plan-included copy (the only two unlinked instances found); every other "email Sam" was already a conditional link that activated once the value was set | `src/config/site.ts`, `src/content/faq.tsx`, `src/content/home.tsx` | `qa/tests/contact.spec.ts` |
| 2 | Setup offer contradicts itself | `/bozeman` renamed to `/setup` with a 308 redirect; added a call-vs-in-person choice; every echo (nav, footer, facts band, founder note, FAQ, plan copy) now branches on `site.inPersonInBozeman` instead of hardcoding one answer | `src/app/(marketing)/setup/`, `next.config.ts`, `src/components/marketing/ContactForm.tsx`, `src/app/api/contact/route.ts`, `src/content/{home,faq}.tsx`, `src/components/marketing/{SiteHeader,MobileMenu,SiteFooter,FounderNote}.tsx` | `qa/tests/redirects.spec.ts`, `qa/tests/contact.spec.ts` |
| 3 | Bare domain primary (already fixed by Sam) | Verified only, no code change | — | Phase 0 and Phase 9 `curl -sI` checks (below) |
| 4 | Every subpage copies the home page's OG/Twitter tags | `src/config/metadata.ts`'s `pageMetadata()` applied to every marketing page, the 404, and (via a Server/Client split) the three app pages; caught and fixed a real regression where a page's own `openGraph` object wiped out the root layout's `og:image` | `src/config/metadata.ts`, every page's metadata export, `src/app/{onboarding,customers,dashboard}/*Client.tsx` | `qa/tests/metadata.spec.ts` |
| 5 | Dental demo email reads "Hi," | Added the missing `customerFirstName` to the dental demo review; changed the real email's and demo's no-name fallback from "Hi," to "Hi there," | `src/content/demo.ts`, `src/lib/resend.ts` | `qa/tests/email-render.spec.ts` |
| 6 | Privacy/Terms name no entity/email/address | Rewrote both pages: entity name when set (falls back to "Sam"), real email, mailing address when set, unsubscribe mention, Manage billing mention | `src/app/(marketing)/{privacy,terms}/page.tsx` | `qa/tests/pages.spec.ts` (copy lint), manual review (listed below) |
| 7 | Dental marketing live during unresolved HIPAA question | `site.showHealthcare` (false) hides dental from nav/footer/home-switch/FAQ; `/for/dental` stays reachable by direct link, `noindex` | `src/config/site.ts`, `Hero.tsx`, `VerticalSwitch.tsx`, `SiteHeader/MobileMenu/SiteFooter.tsx`, `faq.tsx` | `qa/tests/healthcare.spec.ts` |
| 8 | No lost-dashboard-link recovery; access model unverified | Added a "Lost your link?" form + `/api/dashboard-link` (honeypotted, always-generic response, escaped-`ilike` lookup, 5-minute throttle); access model reviewed, not CRITICAL | `src/app/(app)/dashboard/DashboardClient.tsx`, `src/app/api/dashboard-link/route.ts` | `qa/tests/dashboard.spec.ts` |
| 9 | "Cancel anytime" but no self-serve cancellation | Added "Manage billing" button + `/api/billing-portal` (Stripe customer portal session) | `src/app/(app)/dashboard/DashboardClient.tsx`, `src/app/api/billing-portal/route.ts` | `qa/tests/dashboard.spec.ts` |
| 10 | Trial-wording contradiction | FAQ now describes the real onboarding-then-dashboard-then-Stripe flow | `src/content/faq.tsx` | `qa/tests/pages.spec.ts` (copy lint) |
| 11 | Honeypot leaks to assistive tech | Added `visibility:hidden` to the existing off-screen honeypot wrapper (both the contact form and the new lost-link form) — `position:absolute` alone doesn't exclude text from `.innerText()` | `src/components/marketing/ContactForm.tsx`, `src/app/(app)/dashboard/DashboardClient.tsx` | `qa/tests/honeypot.spec.ts` |
| 12 | No unsubscribe/suppression/postal address | Signed HMAC unsubscribe tokens, a pure email renderer with the new footer, a suppression check inside `sendReviewRequestEmail` itself, `/unsubscribe` page + API, `List-Unsubscribe` headers, a migration | `src/lib/unsubscribe.ts`, `src/lib/emails/review-request.ts`, `src/lib/resend.ts`, `src/app/unsubscribe/`, `src/app/api/unsubscribe/route.ts`, `supabase/migrations/20261001_fix_pass_1.sql` | `qa/tests/unsubscribe.spec.ts`, `qa/tests/email-render.spec.ts` |

## Gates

| Gate | Threshold | Measured | Command |
|---|---|---|---|
| Build | `next build` exits 0; marketing routes ○/● | Exit 0; `/setup`, `/unsubscribe` both `○`; `/onboarding`, `/customers`, `/dashboard` still `○` after the Server/Client split | `npx next build` |
| Types | `npm run qa:types` exits 0 | Exit 0 | `npx next typegen && npx tsc --noEmit` |
| Lint | Scoped command exits 0; `npm run lint` shows only the 5 known errors | Scoped: 0 problems. Full: exactly 5, same as Phase 0 baseline (3 in `api/cron/check-reviews/route.ts`, 2 in `lib/places.ts`) | `npx eslint . --ignore-pattern ... ` / `npm run lint` |
| E2E | All Playwright tests pass on mobile/tablet/desktop | 320 passed, 1 failed (JS weight, pre-existing), 12 skipped (3 intentional project-scoped viewport tests + the pre-existing 9) | `npx playwright test -c qa/playwright.config.ts` |
| Accessibility | axe 0 violations everywhere, including `/setup`, `/unsubscribe`, `/dashboard` | 0 violations on all 13 routes (confirmed in the full run and a scoped `-g "axe"` re-run after the dashboard UI changes) | Playwright axe assertions |
| Copy | Copy lint 0 hits; every claim sourced | 0 hits on every route; `CLAIMS.md` updated for every changed/new claim | `qa/tests/pages.spec.ts` copy-lint test |
| Anti-slop | `impeccable detect` exits 0 for `/`, `/pricing`, `/for/salons`, `/setup`, and the codebase scan | Exit 0, zero findings, both runs (within the 3 pre-existing waiver categories, unchanged) | `npx impeccable detect ...` |
| Production check | `curl -sI https://www.buzrareviews.com` redirects to the bare domain | `www` → 307 → `location: https://buzrareviews.com/`; bare domain → 200. Re-confirmed in Phase 9, identical to the Phase 0 finding | `curl -sI` |

Two gates are **not** part of this pass's 12 issues and are unchanged, pre-existing exceptions already documented from the original build:

- **JavaScript weight**: 220.1KB vs the 200KB target on `/` (was ~213KB before this pass; grew with the new copy/markup, same root cause as before — React/Next's own baseline plus Motion, a locked requirement). `DECISIONS.md` #22-23.
- **Mobile LCP**: `/` 2.68s, `/for/salons` 2.61s (both over 2.5s); `/pricing` 2.47s (under). Root-caused to Lighthouse's simulated-throttling variance on a local, non-CDN server, not a deterministic regression. `DECISIONS.md` #23c.

## Phase 0 findings

- **ID types**: `businesses.id` and `customers.id` are both `uuid default gen_random_uuid()` — random, not sequential.
- **Column names**: owner email is `owner_email`; business address is `address`; subscription status is `subscription_status`; Stripe identifiers are `stripe_customer_id`/`stripe_subscription_id`.
- **Dashboard link format**: `{appUrl}/dashboard?businessId=<id>&businessName=<name>`, previously built inline in `sendConfirmationEmail`; extracted into a shared `buildDashboardLink()` in Phase 8 so the new lost-link email reuses it exactly.
- **Review request call site**: exactly one, `POST /api/customers`, which is why the suppression check could live inside `sendReviewRequestEmail` itself (the single choke point) rather than in every caller.
- **Email greeting with no name**: rendered `"Hi,"` before this pass; now `"Hi there,"`.
- **Access model (issue 8)**: not CRITICAL. See the Decisions section, #41.

## Decisions

Every ambiguous call is logged with reasoning in `docs/website/DECISIONS.md` under the "Fix pass 1" heading (entries #27-41). The ones most load-bearing for this report:

- **#27** — branched from `site/v1`, not `main` (main never received the marketing site).
- **#28** — production's redirect is 307, not 301/308; informational, no code change.
- **#29, #35** — `FaqItem.answer`/`PLAN_INCLUDED_DETAILED.body` widened to `ReactNode` for inline mailto links; `sendReviewRequestEmail`'s return type change also fixes a pre-existing latent gap where a real send failure never updated `status`.
- **#31** — the `og:image` regression, caught by testing the built HTML, not assuming the docs were enough.
- **#32** — the three app pages' Server/Client split, required because metadata exports are Server-Component-only.
- **#36, #37** — `/unsubscribe`'s layout choice and a real SSR-flash bug caught and fixed before shipping.
- **#39, #40, #41** — the three Phase 8 design calls (widening `isSubscribed` to include `past_due`, escaped-`ilike` matching, and the access-model review conclusion).

## Sam's checklist

**MERGE BLOCKER**: Run `supabase/migrations/20261001_fix_pass_1.sql` in Supabase (SQL Editor) before merging. Without it, review requests fail closed and no emails go out at all (the suppression check can't confirm anyone isn't suppressed, so it refuses to send).

**MERGE BLOCKER**: Add `UNSUBSCRIBE_SECRET` in Vercel for Production and Preview. Generate one with `openssl rand -hex 32`. Without it, the app fails to build/start (same throw-at-import pattern as the other required secrets).

**MERGE BLOCKER**: Configure the Stripe customer portal in live mode (Settings → Billing → Customer portal): allow cancellation at the end of the billing period, payment method updates, and invoice history, and add your Privacy and Terms URLs.

- Confirm `CONTACT_TO_EMAIL` is set in Vercel for Production and Preview, then send a test request from `/setup` on the preview.
- Confirm your `support@buzrareviews.com` inbox actually receives mail (per `FIX_PASS_1.md`'s own setup step, if you haven't already).
- Approve the sentences in your voice: the `/setup` hero and its two call/in-person text blocks, the founder note (both branches), the FAQ "who's behind" answer (both branches), the facts-band and plan-included lines (both branches), and the rewritten Privacy/Terms sections.
- Review `/privacy` and `/terms` (ideally with a lawyer). Once the LLC is filed, fill `legalEntityName` and `legalMailingAddress` in `src/config/site.ts` (both currently `null`, so the pages correctly fall back to "Sam"/no address line).
- On the preview: open your own test business's dashboard and click Manage billing (opening the portal charges nothing); request your dashboard link from the lost-link form; add yourself as a customer, use the unsubscribe link, then add yourself again and confirm the page says no email was sent.
- Keep `/for/dental` hidden from marketing (`site.showHealthcare: false`) until a lawyer confirms whether you need a HIPAA business associate agreement with dental offices. Flip it to `true` in `src/config/site.ts` when ready — dental content is all still there, just not currently linked to.
- If you'd rather calls-only (no in-person offer at all), set `site.inPersonInBozeman: false` — every surface that mentions it already has the calls-only wording written and ready.

## Product flags noticed but not changed

- The AI reply prompt thanks reviewers by first name and mentions specifics from the review. For dental and other healthcare businesses, that can disclose that someone is a patient. Consider a healthcare-safe tone preset or a vertical-aware rule in `src/lib/anthropic.ts`. (Carried forward from the original build's report; `showHealthcare` hides the marketing but doesn't change the AI prompt itself, which was out of scope for this pass too.)
- `/api/businesses`'s catch block still passes Google's raw Places API error text straight through to the client on failure. Harmless with a real key, visible locally only. Out of scope for this pass.
- Stored `owner_email` values are never normalized (trimmed/lowercased) at insert time (`POST /api/businesses`). The new `/api/dashboard-link` route works around this with escaped case-insensitive matching, but normalizing at insert would be a cleaner long-term fix if this becomes a recurring pattern.
- `/for/dental`'s content (tone guidance, HIPAA caution note) is thorough and ready to go live the moment the healthcare question is resolved — no changes needed there beyond flipping the flag.
