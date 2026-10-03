# BuzraReviews Fix Pass 1: Master Prompt for Claude Code

Version 1.0, written October 1, 2026, against the live site at https://buzrareviews.com (the `site/v1` work is merged into `main`).

---

## FOR SAM: HOW TO RUN THIS (Claude, skip to PART A)

### Step 1: Fill in your inputs

Edit this block before you run anything. Claude reads it in Phase 0.

```yaml
SUPPORT_EMAIL: support@buzrareviews.com
LEGAL_ENTITY_NAME: ""
LEGAL_MAILING_ADDRESS: ""
IN_PERSON_IN_BOZEMAN: yes
SHOW_HEALTHCARE: no
```

- `SUPPORT_EMAIL`: an inbox you actually read. It appears across the site, in the legal pages, and as the cancel and SMS help contact. If `support@buzrareviews.com` doesn't exist yet, the free route is Cloudflare Email Routing (your domain is already on Cloudflare): create `support@` and forward it to your personal inbox. Send it a test email before running this prompt.
- `LEGAL_ENTITY_NAME`: for example `BuzraReviews LLC`. Leave it empty if the Montana LLC isn't filed yet. The legal pages will say "BuzraReviews" and the report will remind you.
- `LEGAL_MAILING_ADDRESS`: optional, shown only on Privacy and Terms. A USPS PO box or a virtual mailbox works. Leave it empty to omit it. Review request emails don't need it, because they show the business's own address (Phase 7).
- `IN_PERSON_IN_BOZEMAN`: `yes` means the setup page offers a call anywhere plus an in-person visit in and around Bozeman. `no` means calls only.
- `SHOW_HEALTHCARE`: `no` hides dental and chiropractor marketing until a lawyer confirms how HIPAA applies to you. `yes` keeps it.

### Step 2: Pre-flight (Terminal, repo root)

```bash
cd ~/Desktop/buzrareviews
git checkout main && git pull
git checkout -b site/fix-pass-1
mkdir -p docs/website
mv ~/Downloads/FIX_PASS_1.md docs/website/FIX_PASS_1.md
claude --effort xhigh
```

### Step 3: Paste this one line and walk away

```text
/goal Read docs/website/FIX_PASS_1.md completely, then execute every phase in order without asking me questions. The goal is met only when the Phase 9 report is posted in this conversation with every Definition of Done item marked PASS and backed by real command output shown here (build exit 0, scoped lint and typecheck clean, all Playwright projects green with axe 0 violations and copy lint 0 hits) and branch site/fix-pass-1 is pushed with a pull request opened or a compare URL printed. If not met after 120 turns, stop and report exactly what is blocking.
```

### What you'll do after Claude finishes (the report repeats this)

Merge blockers, in this order:

1. Run the SQL migration Claude writes, in Supabase (SQL Editor).
2. Add `UNSUBSCRIBE_SECRET` in Vercel for Production and Preview. Make one with `openssl rand -hex 32`.
3. Configure the Stripe customer portal in live mode (Settings, Billing, Customer portal): allow cancellation at the end of the billing period, payment method updates, and invoice history, and add your Privacy and Terms URLs.
4. Confirm `CONTACT_TO_EMAIL` is set in Vercel, then send yourself a test request from `/setup` on the preview.

Then click through the preview on your phone and merge.

---

# PART A: MISSION AND RULES

## A1. Mission

The marketing site is live and mostly right. A content review on October 1, 2026 found the issues in A2. Fix all of them in one pass on branch `site/fix-pass-1`, leave everything else exactly as it is, prove each fix with tests, and open a pull request.

Do not redesign anything. Every change must look like it was always part of the "Main Street Gold" system in `DESIGN.md`: same tokens, components, spacing, type scale, and voice.

## A2. The issues (each maps to a phase)

| # | Issue found on the live site | Phase |
|---|---|---|
| 1 | No email address anywhere. "Just email Sam" (cancel FAQ) and "Email Sam anytime" (pricing) are not links. Privacy, Terms, and the SMS help line point only to a contact form. | 1 |
| 2 | The setup offer contradicts itself. `/bozeman` says setup happens online, while the footer says "In-person setup in Bozeman" and the nav says "Bozeman." The in-person offer is gone from the site. | 2 |
| 3 | Already fixed by Sam: the bare domain is now primary in Vercel. Verify only. | 0 |
| 4 | Every subpage copies the home page's `og:title`, `og:description`, `og:url`, and Twitter tags. The home page has no canonical tag. App pages have no `noindex`. | 3 |
| 5 | The dental demo email reads "Hi," with no name. The real email may do the same when a customer is added without a name. | 4 |
| 6 | Privacy and Terms name no legal entity, no email, and no mailing address. | 5 |
| 7 | Dental marketing is live while the HIPAA question is unresolved, and chiropractors are listed as a fit. | 4 |
| 8 | No way to recover a lost dashboard link, and the safety of the Business ID access model is unverified. | 8 |
| 9 | The site says "Cancel anytime" but there is no self-serve cancellation. | 8 |
| 10 | Every button says "Start free trial" and goes to onboarding, but the FAQ says the trial starts from the dashboard. | 1 |
| 11 | The contact form's honeypot field ("Company") shows up in the page text, so screen reader users may fill it in and have real requests silently dropped. | 6 |
| 12 | Review request emails have no unsubscribe link, no suppression list, and no postal address. | 7 |

## A3. Operating rules

1. Work autonomously. Do not ask Sam questions. When something is ambiguous, pick the option most consistent with this prompt, `DESIGN.md`, `PRODUCT.md`, and the `buzra-brand` skill. Log the decision with one line of reasoning in `docs/website/DECISIONS.md` under a heading "Fix pass 1", then continue.
2. Read before you write. Read every file in full before changing it. Before using any Next.js 16 API (metadata, redirects, route handlers), read the matching guide in `node_modules/next/dist/docs/` (the repo's `AGENTS.md` requires it). Check the installed Resend and Stripe SDK types before calling them.
3. The code is the source of truth for product behavior. If this prompt assumes something about the code that isn't true (a column name, a function name, a query parameter), follow the code, adapt the instruction to it, and log the difference in DECISIONS.md.
4. Keep `docs/website/FIX_PASS_1_PROGRESS.md` current after every phase: status, files changed, open issues, next step. Re-read PART A after any context compaction.
5. Commit at the end of every phase with `fix: phase <n> <short description>`. Run `git status` first. Never stage `.env*`, `qa-artifacts/`, or `docs/design/references/`.
6. Use subagents for independent work (writing tests, copy audits) when it saves time. The main thread owns all decisions.
7. All site and email copy follows the voice and bans in `DESIGN.md` and the `buzra-brand` skill: plain, specific, sentence case, no hype words, no exclamation marks outside example emails and replies. There must be no em dashes (U+2014) or en dashes (U+2013) anywhere, including metadata, alt text, aria labels, emails, and legal text.

## A4. Hard safety rules (never break these)

- Never commit to, push to, or merge `main`. Never force-push. Never rewrite history.
- Never read, print, modify, or commit real secrets. If `.env.local` exists, do not open, edit, or delete it. If it does not exist, create a throwaway one with ONLY these dummy values for local builds, and delete it at the end:

```bash
SUPABASE_URL=https://example.supabase.co
SUPABASE_SERVICE_ROLE_KEY=dummy-service-role-key
STRIPE_SECRET_KEY=sk_test_dummy
STRIPE_WEBHOOK_SECRET=whsec_dummy
RESEND_API_KEY=re_dummy
SENDING_DOMAIN=buzrareviews.com
ANTHROPIC_API_KEY=dummy
GOOGLE_PLACES_API_KEY=dummy
CRON_SECRET=dummy
CONTACT_TO_EMAIL=test@example.com
UNSUBSCRIBE_SECRET=dummy-unsubscribe-secret-for-local-builds-only
```

- Production uses a LIVE Stripe key. Never run anything that could reach Stripe, Resend, Anthropic, Supabase, or Google for real. Every test mocks the network. Never send a request to `/api/cron/check-reviews`, `/api/checkout`, `/api/customers`, `/api/contact`, `/api/unsubscribe`, `/api/dashboard-link`, or `/api/billing-portal` on a real backend, even locally.
- Never run SQL against any real database. Write migrations as files only.
- The only network calls allowed to production are read-only `curl -sI` and `curl -s` requests to `https://buzrareviews.com` and `https://www.buzrareviews.com`, in Phase 0 and Phase 9.
- Files you may change in this pass: anything under `src/` and `qa/`, `next.config.*`, `supabase/schema.sql` (append only), new files under `supabase/migrations/`, `.env.local.example` (new variable names with comments, never values), files under `docs/website/`, and `package.json` scripts if needed. Do not touch `vercel.json`.
- No new dependencies. `zod`, `resend`, `stripe`, and Node's `crypto` cover this pass. If you believe one is truly needed, justify it in DECISIONS.md first.
- Do not change the behavior of anything this prompt doesn't name. The review-checking cron, AI reply drafting, the checkout flow, and the onboarding search stay exactly as they are.

---

# PART B: PHASES

## Phase 0: Setup, inputs, baseline

1. Confirm the branch is `site/fix-pass-1` (create it from an up-to-date `main` if not). Run `npm ci` if `node_modules` is missing.
2. Parse Sam's inputs block at the top of this file and validate it:
   - `SUPPORT_EMAIL` must be a valid email address. If it is empty or invalid, stop and report, because this value can't be guessed.
   - `IN_PERSON_IN_BOZEMAN` and `SHOW_HEALTHCARE` must be `yes` or `no`. If either is missing, use `IN_PERSON_IN_BOZEMAN: yes` and `SHOW_HEALTHCARE: no` and log it.
   - Empty `LEGAL_ENTITY_NAME` and `LEGAL_MAILING_ADDRESS` are allowed.
   Record the parsed values in the progress file.
3. Verify issue 3 without changing anything: `curl -sI https://www.buzrareviews.com` should return a 301 or 308 with `location: https://buzrareviews.com/`, and `curl -sI https://buzrareviews.com` should return 200. Record both outputs. If the redirect doesn't work that way, list it in the report as a Sam action and do not change code for it.
4. Record a baseline so you don't chase pre-existing problems:
   - `npx next typegen && npx tsc --noEmit` exits 0.
   - `npm run lint` shows exactly the 5 known `no-explicit-any` errors (3 in `src/app/api/cron/check-reviews/route.ts`, 2 in `src/lib/places.ts`) and nothing else. The lint gate for this pass is `npx eslint . --ignore-pattern "src/app/api/cron/check-reviews/route.ts" --ignore-pattern "src/lib/places.ts"` exiting 0.
   - `npx next build` exits 0 with the dummy env.
   - The existing Playwright suite (`npm run qa:e2e`) passes. Record anything that fails before you change code as pre-existing, and fix it only if it falls inside this pass.
5. Read these files in full and write a short map of each into the progress file (exports, tables and columns touched, query parameters read): `supabase/schema.sql`, `src/lib/resend.ts`, `src/lib/stripe.ts`, `src/lib/supabase.ts`, `src/lib/pricing.ts`, every route under `src/app/api/`, the three app pages under `src/app/(app)/`, `src/config/site.ts`, everything in `src/content/`, the `ContactForm`, `SiteHeader`, `MobileMenu`, `SiteFooter`, `FounderNote`, and `Faq` components, the `bozeman`, `privacy`, and `terms` pages, `src/app/sitemap.ts`, `src/app/robots.ts`, the root `layout.tsx`, `src/app/opengraph-image.tsx`, `next.config.*`, and every file in `qa/`.
6. Answer these in the progress file before Phase 1, because later phases depend on them:
   - The type and default of `businesses.id` (expected: `uuid` with `gen_random_uuid()`), and of the customers table's `id`.
   - The column names for the owner's email (expected: `owner_email`), the business's address, the subscription status, and any stored Stripe customer or subscription ID.
   - How the dashboard link in the onboarding confirmation email is built (path and query parameter), and which function sends that email.
   - Every call site that sends a review request email (grep for `How was your visit to` and for `emails.send`), and which page owners use to add customers.
   - What the email greeting renders when a customer has no name.
7. Add these typed keys to `src/config/site.ts`, each with a short comment:
   - `contactEmail`: the `SUPPORT_EMAIL` value
   - `legalEntityName`: the value, or `null` if empty
   - `legalMailingAddress`: the value, or `null` if empty
   - `inPersonInBozeman`: `true` or `false`
   - `showHealthcare`: `true` or `false`
   Every consumer must handle `null` gracefully, as before (hide the element, never show a placeholder).

Commit: `fix: phase 0 inputs, baseline, site config`.

## Phase 1: Contact email everywhere and clear trial wording (issues 1 and 10)

1. Make every reference to emailing Sam a real `mailto:` link to `site.contactEmail`, with visible link text. Show the address itself where it helps (FAQ answers, legal pages, the setup page) and use "Email Sam" where space is tight (founder links). Cover at least:
   - FAQ "Is there a contract? How do I cancel?" on home and pricing. For now: "No contract. It's month to month. To cancel, email Sam at {contactEmail} and he'll take care of it." Phase 8 adds the self-serve option.
   - Pricing "What's included", item 5 detail. Phase 2 sets its final wording; make "Email Sam" a link.
   - Founder section links: "Get setup help" (to `/setup`, built in Phase 2) and "Email Sam".
   - Footer "Company" column: "Contact" as a mailto link (the existing conditional now renders it).
   - Setup page, under the form: "Prefer email? Write to Sam at {contactEmail}."
   - The contact form's not-connected fallback already includes the email link when `contactEmail` is set. Confirm it renders.
2. Grep all of `src/` (case-insensitive) for "email sam", "contact form", "reach us", "reach me", and "contact us". Every instance must be linked or rewritten.
3. Trial wording (issue 10). Replace the FAQ answer "How does the free trial work?" with: "Find your business and add your email. We'll email you a link to your dashboard, and you start your 14-day trial from there by entering a card through Stripe. You won't be charged until the trial ends, and if you cancel before then, you pay nothing." Check the onboarding and dashboard pages for any sentence that conflicts with this and align the wording without changing behavior.

Commit: `fix: phase 1 support email and trial wording`.

## Phase 2: Setup page (issue 2)

1. Rename `src/app/(marketing)/bozeman` to `src/app/(marketing)/setup` with `git mv` (quote paths with parentheses). Add a permanent redirect from `/bozeman` to `/setup` in `next.config.*` using `redirects()`, so old links and printed material keep working.
2. Update every internal link, the sitemap, `qa/routes.ts`, analytics `location` values (`"bozeman"` becomes `"setup"`), and every test that referenced `/bozeman`. Grep `src/` and `qa/` for `bozeman` (case-insensitive) and review every hit. Keep mentions of the town; change only the route.
3. Copy when `site.inPersonInBozeman` is true:
   - Metadata title: "Setup help from Sam". Description: "Need a hand? Sam will set up BuzraReviews with you on a call, or in person in Bozeman, in about 20 minutes."
   - H1: "Need a hand getting set up? I'll do it with you."
   - Lead: "I'm Sam, and I build BuzraReviews. Wherever your business is, I'll get on a call and walk through the whole setup with you. If you're in or around Bozeman, I'll come by in person. There's no charge either way."
   - Two short text blocks above the numbered steps, each an H3 plus one line, no cards and no icons: "On a call, anywhere." / "Video or phone, whichever is easier. About 20 minutes." and "In person, in Bozeman." / "I'll come to your business and we'll set it up together."
   - Keep the existing numbered steps under "What we'll do in about 20 minutes".
   - Form heading: "Ask Sam for setup help". Add a fieldset with the legend "How should we meet?" and two native radio inputs, "On a call" (default) and "In person in Bozeman". Submit button: "Send my request".
   - Send the choice to `/api/contact` as `meeting: "call" | "in_person"`. Extend the route's zod schema with an optional enum, include the choice in the email body, and set the subject to `Setup request (call): {business}` or `Setup request (in person): {business}`.
4. Copy when `site.inPersonInBozeman` is false: the same page without the in-person block and without the radio group. Lead: "I'm Sam, and I build BuzraReviews. Wherever your business is, I'll get on a call and walk through the whole setup with you. There's no charge." Description: "Need a hand? Sam will set up BuzraReviews with you on a call, in about 20 minutes." The email subject is `Setup request: {business}`.
5. Labels across the site:
   - Header nav item "Bozeman" becomes "Setup help", linking to `/setup`, in both the desktop nav and the mobile menu.
   - Footer: remove "In-person setup in Bozeman" from "Who it's for". The "Company" column becomes: "Setup help" (`/setup`), "Contact" (mailto), "Privacy", "Terms".
   - Facts band, fourth item, linking to `/setup`: "Made in Bozeman, Montana." followed by "Stuck? Sam will set it up with you, on a call or in person." (calls only: "Stuck? Sam will set it up with you on a call.")
   - Founder note (in person): "I'm Sam, and I build BuzraReviews here in Bozeman. You can set yourself up in a few minutes. If you run into any trouble, I'll set it up with you myself, on a call or in person if you're nearby." (calls only: end with "I'll set it up with you myself on a call.") Links: "Get setup help" (`/setup`) and "Email Sam".
   - FAQ "Who's behind BuzraReviews?" (in person): "Sam, who builds and runs it in Bozeman, Montana. If you get stuck, he'll set it up with you on a call, or in person if you're in or around Bozeman." (calls only: drop the last clause.) Link: "Get setup help" to `/setup`.
   - PlanCard and pricing "What's included", item 5. In person: label "Help from a real person, on a call or in person in Bozeman", detail "Email Sam anytime. If you get stuck, Sam will set it up with you on a call, or in person if you're in or around Bozeman." Calls only: label "Help from a real person, on a call if you get stuck", detail "Email Sam anytime. If you get stuck, Sam will set it up with you on a call." The home PlanCard and the pricing page must read from the same source.
6. List every new sentence written in Sam's voice in the report, for his approval.

Commit: `fix: phase 2 setup page and consistent labels`.

## Phase 3: Metadata (issue 4)

1. Read the Next.js 16 metadata docs in `node_modules/next/dist/docs/`, especially how `openGraph` and `twitter` objects merge between layouts and pages (nested objects are replaced, not deep-merged) and how the file-based `opengraph-image` is inherited by child routes.
2. Create `src/config/metadata.ts` exporting a pure helper, for example `pageMetadata({ title, description, path, absoluteTitle, noindex })`. It returns `title`, `description`, `alternates.canonical`, and complete `openGraph` (`title`, `description`, `url`, `siteName: "BuzraReviews"`, `locale: "en_US"`, `type: "website"`) and `twitter` (`card: "summary_large_image"`, `title`, `description`) objects. The `og:title` must equal the document title the page actually renders, including the " | BuzraReviews" suffix on templated titles.
3. Use it on every marketing page: `/`, `/pricing`, each `/for/[vertical]` page, `/setup`, `/privacy`, `/terms`, and the 404. Add `alternates.canonical: "/"` to the home page.
4. The branded share image must still appear on every page. If the file-based `opengraph-image` stops reaching subpages after this change, include it explicitly in the helper. Prove it in the built HTML (Phase 9 tests), not by assumption.
5. Add `robots: { index: false, follow: false }` to `/onboarding`, `/customers`, `/dashboard`, `/unsubscribe` (Phase 7), and to `/for/dental` when `site.showHealthcare` is false. Give the app pages real titles: "Find your business", "Your customers", "Your dashboard".
6. `sitemap.ts` lists marketing routes only: `/setup` instead of `/bozeman`, and no `/for/dental` when `site.showHealthcare` is false.

Commit: `fix: phase 3 page-specific metadata`.

## Phase 4: Demo greeting and healthcare visibility (issues 5 and 7)

1. Dental demo email: give the example customer the first name "Dana" so the greeting reads "Hi Dana,". The dental demo replies still never use a name, because that is the healthcare reply tone. The email greeting and the reply tone are separate; check both the demo data and the EmailCard render path.
2. Real product greeting: if the review request email renders "Hi ," or "Hi," when a customer has no name, change the fallback to "Hi there,". Phase 7 moves the template into a pure renderer; keep this fallback there.
3. When `site.showHealthcare` is false:
   - Hero audience line: "For salons, barbershops, restaurants, and every shop with one front door."
   - The home vertical switch shows "Salon" and "Restaurant" only.
   - The "Who it's for" menus (desktop nav, mobile menu, footer) list only salons and restaurants.
   - `/for/dental` stays reachable by direct link, is left out of the sitemap, and is `noindex` (Phase 3).
   - FAQ "Is my kind of business a good fit?": "If you have one location, customers who can leave you a Google review, and their email addresses, yes. Salons, barbershops, restaurants, cafes, auto shops, and similar local businesses all fit. BuzraReviews isn't built for businesses with many locations."
   - Grep `src/` for "dental", "dentist", "patient", "chiropract", and "healthcare". Outside the dental page itself and its demo data, none of these may render on any page. Keep all dental content in the code so Sam can flip the flag later.
   When `site.showHealthcare` is true, everything renders as it does today, plus the greeting fix.
4. Update existing tests that assume a "Dental office" switch option so they branch on `site.showHealthcare`.
5. Update `docs/website/CLAIMS.md` for every changed claim.

Commit: `fix: phase 4 demo greeting and healthcare flag`.

## Phase 5: Legal pages (issue 6)

Update both pages and set "Last updated" to the run date. Keep the existing structure and plain tone.

Privacy:

- "Who we are": with an entity, "BuzraReviews is operated by {legalEntityName}, based in Bozeman, Montana." Without one, "BuzraReviews is built and run by Sam, based in Bozeman, Montana." Then "You can reach us at {contactEmail}." plus the mailing address if set.
- "Your choices": end with "...by emailing us at {contactEmail}." instead of pointing to "the details at the top of this page."
- "Review request emails": add "Every review request email includes an unsubscribe link. If you use it, that business can no longer send you review requests through BuzraReviews. We keep a record of your email address and the business so your request is honored."
- "Retention": add "Unsubscribe records are kept for as long as needed to honor them."
- "Contact": the email, the mailing address if set, and "You can also use the form on our setup page" (link to `/setup`).

Terms:

- With an entity, open with "BuzraReviews is operated by {legalEntityName}." before the existing agreement paragraph.
- "Subscription and billing": "You can cancel anytime from your dashboard using Manage billing, or by emailing us at {contactEmail}. Cancellation takes effect at the end of your current billing period, and we don't prorate refunds for partial months." (Phase 8 builds Manage billing. Sam will set the Stripe portal to cancel at period end; list that in the report.)
- "SMS program terms": the support line becomes "For help, reply HELP or email {contactEmail}."
- "Contact": the email, the mailing address if set, and the setup page link.

The banned-words lint exempts `/privacy` and `/terms`, but the dash ban applies. List both pages in the report as needing Sam's review, and ideally a lawyer's.

Commit: `fix: phase 5 legal pages`.

## Phase 6: Honeypot accessibility (issue 11)

For every honeypot field (the setup contact form now, and the dashboard link form in Phase 8):

- Wrap the field in an element with `aria-hidden="true"`, moved off-screen with CSS (not `display: none`). The input gets `tabIndex={-1}` and `autoComplete="off"`. Keep its neutral name (`company` is fine).
- The label stays in the DOM for bots, inside the `aria-hidden` wrapper.
- axe must stay at 0 violations, including `aria-hidden-focus`.
- Tests (Phase 9): the form's `innerText` doesn't include the honeypot label, and pressing Tab through the form never focuses it.

Commit: `fix: phase 6 honeypot hidden from assistive tech`.

## Phase 7: Review request email compliance (issue 12)

Goal: every review request email carries a working one-click unsubscribe, the sender's postal address, and a clear explanation of why it was sent, and an unsubscribed person never gets another request from that business.

1. Migration. Create `supabase/migrations/<YYYYMMDD>_fix_pass_1.sql` and append the same statements to `supabase/schema.sql` under a comment `-- Fix pass 1`. Match the real type of `businesses.id` and the RLS conventions you found in Phase 0. Expected shape:

```sql
create table if not exists public.email_suppressions (
  business_id uuid not null references public.businesses(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  primary key (business_id, email)
);
alter table public.email_suppressions enable row level security;

alter table public.businesses
  add column if not exists dashboard_link_sent_at timestamptz;
```

   Store emails trimmed and lowercased. Never run this SQL; Sam runs it.

2. Signed unsubscribe links. Create `src/lib/unsubscribe.ts` (relative imports only, so tests can load it):
   - Read `UNSUBSCRIBE_SECRET` and throw at import if it's missing, following the same pattern as `src/lib/resend.ts`. A deploy without the secret then fails at build time instead of sending broken links.
   - `signUnsubscribeToken(customerId: string): string` returns a base64url HMAC-SHA256 of `"unsub:v1:" + customerId`.
   - `verifyUnsubscribeToken(customerId: string, token: string): boolean` compares with `crypto.timingSafeEqual` and returns false on any length mismatch.
   - `buildUnsubscribeUrl(customerId: string): string` returns `https://buzrareviews.com/unsubscribe?c=<customerId>&t=<token>`, using the site URL from `src/config/site.ts`.
   - Add `UNSUBSCRIBE_SECRET=` with a one-line comment to `.env.local.example`.
   If the customers table `id` isn't a UUID, use it anyway (the HMAC makes the link unforgeable) and log it.

3. Pure email renderer. Move the review request template into `src/lib/emails/review-request.ts`, a pure function with no env access and relative imports only, for example `renderReviewRequestEmail({ businessName, firstName, reviewUrl, unsubscribeUrl, businessAddress })` returning `{ subject, html, text }`. `src/lib/resend.ts` calls it.
   - Keep the subject and body wording exactly as it is now (the website demo mirrors it), apart from the Phase 4 greeting fallback and this new footer.
   - The footer goes below the sign-off in small gray text, in both HTML and plain text:
     - "You're getting this email because you visited {Business}."
     - "Sent by BuzraReviews on behalf of {Business}, {Business address}."
     - "Don't want these emails? Unsubscribe" with "Unsubscribe" linked.
   - Use the address stored on the business record. If there isn't one, fall back to `site.legalMailingAddress`. If neither exists, leave the address out of that line, log a warning, and list it in the report as a must-fix before sending at volume. Do not block sending over a missing address.
   - Always send a plain-text part (Resend accepts `text`), so the email isn't HTML-only.

4. Headers. When sending, add `List-Unsubscribe: <{unsubscribeUrl}>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` through the Resend SDK's `headers` option (check the installed types). Keep the existing From name and reply-to behavior.

5. Suppression check at the single choke point. Put it inside the function that sends review requests, not in each caller. Before sending, look up `(business_id, lower(trim(email)))` in `email_suppressions`.
   - Suppressed: don't send, and return a typed result such as `{ sent: false, reason: "unsubscribed" }`. The page where owners add customers shows: "This customer asked not to get review requests from you, so we didn't send one." Keep saving the customer row the way the code does now.
   - Lookup error (for example, the table doesn't exist yet because the migration wasn't run): fail closed. Don't send. Show "We couldn't send this review request. Please try again in a few minutes." and `console.error` the cause. Log in DECISIONS.md that failing closed is intentional.

6. Unsubscribe page and API.
   - `src/app/unsubscribe/page.tsx`: static and `noindex`. Use `AppHeader` chrome or a minimal layout (your call, logged). On mount it reads `c` and `t` from `window.location.search`, the same pattern the dashboard uses. H1: "Stop review requests?" Lead: "You won't get any more review request emails from this business through BuzraReviews." Button: "Unsubscribe". Loading the page never changes anything, because email security scanners open links automatically.
   - `src/app/api/unsubscribe/route.ts`, `POST` only. Read `c` and `t` from the query string. Accept both a JSON body and the one-click form body `List-Unsubscribe=One-Click`. Validate with zod, verify the token, look up the customer to get `business_id` and email, and upsert into `email_suppressions` (ignore duplicates). Return `{ ok: true, business: <name> }`. Invalid or missing token: 400 `{ ok: false }`. Unknown customer: 404 `{ ok: false }`.
   - Page states. Success: "Done. {Business} won't send you review requests through BuzraReviews anymore." Invalid link: "This link doesn't work. You can reply to the email and ask the business to stop, or email us at {contactEmail}." Server error: "Something went wrong. Please try again, or email us at {contactEmail}."

7. Keep the website demo truthful. The hero and vertical EmailCards mirror the real email, so add one line of card micro text under the sign-off: "Sent on behalf of {Business}. Unsubscribe" ("Unsubscribe" styled like a link but inert plain text, never a real link). It must be in the server-rendered HTML at its final size, so nothing shifts.

8. FAQ "What do my customers get?": append "Every email includes an unsubscribe link." Add the claim to CLAIMS.md with its file and line.

Commit: `fix: phase 7 unsubscribe, suppression, email footer`.

## Phase 8: Dashboard (issues 8 and 9)

1. Review the access model. Report only; don't redesign it in this pass.
   - Confirm `businesses.id` is a random UUID (for example `uuid default gen_random_uuid()`). If it's sequential or otherwise guessable, mark it CRITICAL at the top of the report with the exact file and line.
   - List every API route that returns business or customer data given a business ID. Confirm none of them lists businesses or accepts anything weaker than the full ID.

2. Lost link recovery. On `/dashboard`, below the Business ID form, add:
   - Heading "Lost your link?" and the line "Enter the email you signed up with and we'll send your dashboard link again."
   - An email input labeled "Your email", a honeypot (Phase 6 rules), a `startedAt` timestamp, and the button "Email me my link".
   - After any submit, always show: "If that email has a BuzraReviews account, we just sent the link. Check your inbox and spam folder." Never reveal whether an account exists.

3. `src/app/api/dashboard-link/route.ts` (`POST`):
   - zod: email, max 254 characters. If the honeypot is filled, or the form was submitted less than 3 seconds after `startedAt`, return the generic 200 and do nothing.
   - Find businesses whose owner email matches, at most 5. Normalize the input with trim and lowercase and compare with an exact match. Never pass raw input to `ilike` or `like`, because `%` and `_` are wildcards there and a value like `%` would match every owner. If stored emails can be mixed case, escape `%`, `_`, and `\` before any case-insensitive match.
   - For each business, skip it if `dashboard_link_sent_at` is within the last 5 minutes. Otherwise send the email and set `dashboard_link_sent_at` to now.
   - Email from `BuzraReviews <noreply@${SENDING_DOMAIN}>`, subject "Your BuzraReviews dashboard link", body "Here's the link to your BuzraReviews dashboard for {Business}: {link}" then "Bookmark it so you can come back anytime. If you didn't ask for this, you can ignore this email." Build `{link}` with the same code the onboarding confirmation email uses (Phase 0 finding); reuse it, don't duplicate it.
   - On any error, log it and still return the generic 200.

4. Billing portal (issue 9). `src/app/api/billing-portal/route.ts` (`POST`):
   - zod: the business ID, validated as a UUID if that's what IDs are.
   - Load the business and use the Stripe identifier the existing checkout and webhook code stores: a customer ID directly, or the stored subscription retrieved to get its customer. If no Stripe identifier is stored at all, return 409 `{ ok: false, reason: "no_subscription" }`.
   - Create a session with `stripe.billingPortal.sessions.create({ customer, return_url })`, where `return_url` is the business's dashboard link from the same builder. Return `{ url }`.
   - Use the existing Stripe client from `src/lib/stripe.ts`.

5. Dashboard UI. When the loaded business's subscription is trialing, active, or past due (use the real status values from the code), show a secondary button "Manage billing" with the line "Cancel, change your card, or see invoices." Clicking it posts to `/api/billing-portal` and then calls `window.location.assign(url)`. On 409 or any error, show: "We couldn't open billing right now. Email Sam at {contactEmail} and he'll take care of it." Businesses without a subscription keep the existing "Start free trial" flow exactly as it is.

6. If the existing `track()` setup is present, add the events `billing_portal_click`, `dashboard_link_request`, and `unsubscribe_confirm`.

7. Final FAQ answer for "Is there a contract? How do I cancel?" on home and pricing: "No contract. It's month to month. To cancel, open your dashboard and click Manage billing, or email Sam at {contactEmail} and he'll take care of it."

Commit: `fix: phase 8 lost link recovery and billing portal`.

## Phase 9: Tests, gates, report, push

### Tests

Add these under `qa/tests/`. Mock every API call with `page.route`, and block every non-localhost request in a shared fixture so nothing can leave the machine.

1. `metadata.spec.ts`: for every marketing route, exactly one canonical link equal to `https://buzrareviews.com<path>`; `og:url` equals the canonical; `og:title` equals the document title; `og:description` equals the meta description; `og:image` is present and absolute; `twitter:title` and `twitter:description` are present and specific to the page (they differ from the home values on every route except `/`). `/onboarding`, `/customers`, `/dashboard`, `/unsubscribe`, and `/for/dental` (when `showHealthcare` is false) have a robots meta tag containing `noindex`. `/sitemap.xml` contains `/setup`, not `/bozeman`, and matches the healthcare flag.
2. `redirects.spec.ts`: `GET /bozeman` with `maxRedirects: 0` returns 308 with a `location` ending in `/setup`.
3. `contact.spec.ts`: a `mailto:` link to `site.contactEmail` exists on `/`, `/pricing`, `/setup`, `/privacy`, and `/terms`, and in the footer of every marketing route. No page's text contains "contact form on our Bozeman page." The setup form sends `meeting` when in-person is on, and shows the success and not-connected states with `/api/contact` mocked to 200 and 503.
4. `honeypot.spec.ts`: the Phase 6 checks for both forms.
5. `healthcare.spec.ts`: the vertical switch, nav, mobile menu, footer, and FAQ match Phase 4 for the configured flag.
6. `unsubscribe.spec.ts`: the page shows the button and sends no POST on load; clicking with `/api/unsubscribe` mocked to 200 shows the success message with the business name; mocked 400 shows the invalid-link message. Also a Node-side test (no browser) that sets `process.env.UNSUBSCRIBE_SECRET`, dynamically imports `src/lib/unsubscribe.ts`, and checks that a signed token verifies while a tampered token, a token for another ID, and a wrong-length token all fail.
7. `email-render.spec.ts` (Node-side): `renderReviewRequestEmail` keeps the current subject; the greeting uses the first name when given and "Hi there," when not; both the HTML and text parts contain the footer lines and the unsubscribe URL; the output contains no em or en dashes.
8. `dashboard.spec.ts`: the lost-link form shows the generic message with `/api/dashboard-link` mocked; "Manage billing" appears for a mocked active business, posts to the mocked `/api/billing-portal`, and navigates to the returned URL (intercept that URL and fulfill it locally); a mocked 409 shows the fallback message with the email link; a business without a subscription shows the original trial flow unchanged.
9. Update existing tests for `/setup`, the healthcare flag, and the new copy. Never weaken an assertion to make a test pass.

### Gates (all must pass; paste the real output)

| Gate | Threshold |
|---|---|
| Build | `npx next build` exits 0. Every marketing route, plus `/setup` and `/unsubscribe`, is still static (○ or ●). |
| Types | `npm run qa:types` exits 0 |
| Lint | The scoped ESLint command exits 0, and `npm run lint` shows only the 5 known errors |
| E2E | Every Playwright test passes on the mobile, tablet, and desktop projects |
| Accessibility | axe reports 0 violations on every route, including `/setup`, `/unsubscribe`, and `/dashboawith both forms visible |
| Copy | Copy lint reports 0 hits on every route (dash ban everywhere; banned words everywhere except `/privacy` and `/terms`) |
| Anti-slop | `npx -y impeccable detect` exits 0 for `/setup` and `/dashboard` on the running production build and for `src/components src/app`, within the existing waivers |
| Production check | `curl -sI https://www.buzrareviews.com` shows the redirect to the bare domain (issue 3), recorded |

If a gate fails, fix the cause, not the test. Never lower a threshold, skip a test, or add an axe exclusion.

### Ship

1. Delete the throwaway `.env.local` if you created it. `git status` must be clean apart from intended changes.
2. Push `site/fix-pass-1`. If `gh` is installed and authenticated, run `gh pr create --base main --head site/fix-pass-1 --title "Fix pass 1: contact, setup page, metadata, unsubscribe, billing portal" --body-file docs/website/FIX_PASS_1_REPORT.md`, then `gh pr checks` to capture the Vercel preview URL if it appears. Otherwise print `https://github.com/samedame/buzrareviews/compare/main...site/fix-pass-1`.
3. Never merge.

### Report

Write `docs/website/FIX_PASS_1_REPORT.md` and post it in the conversation, with exactly these headings:

1. **Summary**: two or three sentences.
2. **Issues**: a table of issues 1 to 12 with what changed, the files, and the test that proves it.
3. **Gates**: the gates table with each measured value and the command that produced it.
4. **Phase 0 findings**: ID types, column names, the dashboard link format, review request call sites, and the access model review. Put any CRITICAL finding first.
5. **Decisions**: links into DECISIONS.md.
6. **Sam's checklist** (always include all of these, merge blockers first):
   - MERGE BLOCKER: run `supabase/migrations/<file>.sql` in Supabase (SQL Editor) before merging. Without it, review requests fail closed and no emails go out.
   - MERGE BLOCKER: add `UNSUBSCRIBE_SECRET` in Vercel for Production and Preview (`openssl rand -hex 32`). Without it the build fails and production stays on the previous version.
   - MERGE BLOCKER: configure the Stripe customer portal in live mode: cancel at the end of the billing period, payment method updates, invoice history, and your Privacy and Terms URLs.
   - Confirm `CONTACT_TO_EMAIL` is set in Vercel for Production and Preview, then send a test request from `/setup` on the preview.
   - Confirm your support inbox receives mail.
   - Approve the sentences in your voice listed in this report.
   - Review `/privacy` and `/terms` (ideally with a lawyer). Once the LLC is filed, fill `legalEntityName` and `legalMailingAddress` in `src/config/site.ts`.
   - On the preview: open your own test business's dashboard and click Manage billing (opening the portal charges nothing); request your dashboard link from the lost-link form; add yourself as a customer, use the unsubscribe link, then add yourself again and confirm the page says no email was sent.
   - Keep `/for/dental` hidden until a lawyer confirms whether you need a HIPAA business associate agreement with dental offices.
7. **Product flags noticed but not changed**: anything you found outside this pass's scope.

## Definition of Done (the /goal evaluator checks this list)

Mark each item PASS or FAIL in the report, with evidence shown in this conversation:

- [ ] Phase 0: inputs validated, baseline recorded, Phase 0 questions answered in the progress file.
- [ ] Issue 1: the support email is linked everywhere listed, with no unlinked "email Sam" left.
- [ ] Issue 2: `/setup` is live, `/bozeman` returns a 308 to it, labels are consistent, and the in-person setting is applied.
- [ ] Issue 3: the production redirect is verified and recorded.
- [ ] Issue 4: page-specific Open Graph and Twitter tags, canonicals on every marketing page, `noindex` on app and utility pages, correct sitemap.
- [ ] Issue 5: the dental demo greeting is fixed, and the real email's greeting fallback is verified or fixed.
- [ ] Issue 6: legal pages updated with the entity (or a reminder), email, address if given, and date.
- [ ] Issue 7: the healthcare flag is applied everywhere listed.
- [ ] Issue 8: lost-link recovery is built, and the access model is reviewed and reported.
- [ ] Issue 9: the billing portal route and dashboard button are built, and the FAQ and Terms are updated.
- [ ] Issue 10: trial wording is consistent.
- [ ] Issue 11: honeypots are hidden from assistive tech, with tests passing.
- [ ] Issue 12: unsubscribe links, headers, footer, suppression check, and migration file are done.
- [ ] Every gate passes with evidence shown in this conversation.
- [ ] The throwaway `.env.local` is deleted if created, the branch is pushed, and a pull request is opened or a compare URL printed.
- [ ] The report is written and posted, including Sam's checklist.
