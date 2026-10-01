# Build progress

Living log for the BuzraReviews marketing site build (branch `site/v1`). Updated after every phase so work can resume after a context compaction. See `docs/website/MASTER_PROMPT.md` for the full spec.

## Phase 0: Toolchain and project hygiene — in progress

Started: 2026-09-30.

Toolchain verified/installed (C1):

- Plugins (local scope): `frontend-design`, `playwright`, `chrome-devtools-mcp`, `context7`, `modern-web-guidance` — all installed successfully via `claude plugin install ...@claude-plugins-official --scope local`.
- Skills installed into `.claude/skills/`: `web-design-guidelines`, `vercel-react-best-practices` (via `npx skills add vercel-labs/agent-skills`), `emil-design-eng`, `animate`, `review-animations`, `find-animation-opportunities`, `mobile-native` (via `npx skills add emilkowalski/skill`), `impeccable` (via `npx impeccable install --providers=claude --scope=project`).
- Motion AI Kit: the interactive installer (`npx motion-ai`) requires a TTY prompt, which isn't available in this automated flow, so used the documented fallback: `npm pack motion-ai@latest`, extracted the tarball, copied `content/skills/motion` into `.claude/skills/motion`. Did not register the hosted MCP server (`claude mcp add --transport http motion https://mcp.motion.dev`) since it wouldn't be callable until a session restart anyway; the self-contained `best-practices/` docs cover what's needed for Phases 3-5.
- `npx playwright install chromium` — done, confirmed executable path resolves.
- Node version: v24.19.0 (>= 20.9 required). `node_modules` already present.

Project hygiene (C3):

- `.gitignore`: appended the website build tooling block and Impeccable's ignore block (fetched verbatim from the impeccable README).
- `.claude/skills/buzra-brand/SKILL.md` created (committed; the only skill directory not gitignored).
- `CLAUDE.md`: appended `For any UI or copy work, follow DESIGN.md and the buzra-brand skill.` under the existing `@AGENTS.md` line.
- `docs/website/PROGRESS.md`, `docs/website/DECISIONS.md`, `docs/website/CRITIQUE_LOG.md` created (this phase).
- `PRODUCT.md` created at repo root.
- `.impeccable/config.json` created with `{ "buildPath": "code" }`.

Files changed this phase: `.gitignore`, `CLAUDE.md`, `PRODUCT.md`, `.impeccable/config.json`, `.claude/skills/buzra-brand/SKILL.md`, `docs/website/PROGRESS.md`, `docs/website/DECISIONS.md`, `docs/website/CRITIQUE_LOG.md`, `docs/website/MASTER_PROMPT.md` (saved before Phase 0 started), `package.json`/`package-lock.json` (added `@playwright/test`, `@axe-core/playwright` as devDependencies, needed early since Phase 1 also depends on them).

Open issues: none blocking.

Next step: commit Phase 0, then start Phase 1 (capture reference screenshots).

## Phase 1: Study real reference sites — done

- `qa/capture-references.mjs` written per D1 (desktop 1440x900 + mobile 390x844, scroll positions 0/900/1800, overlay-hiding CSS injected, Escape pressed, burst mode for the 4 "burst" sites). Ran clean against all 18 sites in D2 (owner.com x2, glossgenius, visiblefeedback, stripe x2, attio, granola, linear, resend, mercury, and 7 competitors) — 172 screenshots, zero failures. Screenshots are gitignored under `docs/design/references/`.
- Delegated the "open every screenshot and look at it" step to a forked subagent (image-viewing is expensive context with no lasting value; the output file is what matters) which wrote `docs/design/REFERENCE_NOTES.md`.
- Several sites have visibly moved on since the MASTER_PROMPT.md D2 text was written on 2026-09-30 (same day, different hour) — notably Linear's hero is now fully painted at 0ms (not blank at 3s as D2 claimed), Attio has shifted to a centered hero + announcement bar, GlossGenius pivoted its below-fold product moment to an AI chat composer, and three competitors (Weave, Podium, Boulevard) now frame their product as an anthropomorphized "AI Receptionist/Employee." REFERENCE_NOTES.md documents each divergence inline rather than silently trusting the stale D2 text — see DECISIONS.md.
- Read the two craft articles (emilkowal.ski "You don't need animations," vercel.com/design/guidelines) directly via WebFetch rather than screenshotting — they're reading material, not visual references. Both reinforce the motion/a11y rules already locked in PART E.
- Files added: `qa/capture-references.mjs`, `docs/design/REFERENCE_NOTES.md`.

Next step: commit Phase 1, then start Phase 2 (write DESIGN.md).

## Phase 2: Design system (DESIGN.md) — done

- `DESIGN.md` written at repo root: concept, full token tables (color/type/layout/components/motion), the "Default vs ours" table (every row grounded in a concrete pattern actually observed in `docs/design/REFERENCE_NOTES.md`, not hypothesized), the "Known tells check" table (walks all 5 `frontend-design` clusters + 6 Impeccable tells and states why each is a clean miss), a contrast ledger, and a pointer to the G5 self-checks (run per-page in Phase 7, logged in CRITIQUE_LOG.md).
- Pulled the exact 5-cluster list from the installed `frontend-design` plugin's SKILL.md directly (not paraphrased from the master prompt) so the "known tells" table cites the real source language.
- Independently recomputed all 10 contrast ratios from sRGB relative luminance rather than trusting the brief's rounded numbers — all confirmed to pass WCAG AA with the token values unchanged (see DECISIONS.md #5).
- Files added: `DESIGN.md`.

Next step: commit Phase 2, then start Phase 3 (foundation: fonts, tokens, route architecture, pricing.ts).

## Phase 3: Foundation — done

- `src/lib/pricing.ts` created (`SUBSCRIPTION_PRICE_USD_CENTS = 2900`, `TRIAL_PERIOD_DAYS = 14`); `src/lib/stripe.ts` now re-exports both from it with zero behavior change (confirmed: `src/app/api/checkout/route.ts` is the only other consumer and its import path/usage is unchanged).
- `src/app/globals.css` rewritten with the full Main Street Gold token set (`@theme` for colors/radii, `@theme inline` only for the two font variables since those are injected at runtime by `next/font`), fluid type-scale utility classes, and the `.paper-card` depth pattern. Dropped the `prefers-color-scheme: dark` block and the Arial fallback per DESIGN.md.
- `src/app/layout.tsx`: Geist removed, `Libre_Franklin` + `Atkinson_Hyperlegible_Next` loaded as true variable fonts (`weight: "variable"`), `metadataBase` + title template + default description set.
- `src/config/site.ts` created with all `// TODO(Sam)` fields.
- Base UI primitives in `src/components/ui/`: `Container`, `VisuallyHidden`, `Icon` (8-icon inline SVG set), `Stars`, `LogoMark`, `ExampleTag`, `Button` (primary/secondary/text, href-or-button polymorphism).
- Marketing shell in `src/components/marketing/`: `SiteHeader` (scroll border, desktop nav incl. "Who it's for" disclosure, mobile menu trigger), `MobileMenu` (native `<dialog>` + `showModal()`, focus returns to trigger on close), `SiteFooter` (4-column layout, Google trademark line).
- `src/app/page.tsx` moved to `src/app/(marketing)/page.tsx` via `git mv` (URL unchanged); `(marketing)/layout.tsx` created with a skip link, `SiteHeader`, `<main id="main">`, `SiteFooter`. Home page itself is a Phase-3 stub (real H1/lead copy, no placeholder text) — full section-by-section build is Phase 4.
- `onboarding`, `customers`, `dashboard` deliberately **not** moved yet — F8 schedules that for Phase 6. They still render under the root layout only (no marketing header/footer, no AppHeader yet) and are unaffected by this phase.
- Created the throwaway `.env.local` per A4 (did not exist before). Will be deleted at the end per I1.
- Fixed `eslint.config.mjs` to ignore `.claude/**`, `.agents/**`, `qa-artifacts/**`, `docs/design/references/**` — these vendored tool directories aren't covered by eslint-config-next's default ignores and were producing ~94 bogus warnings unrelated to our code (see DECISIONS.md #6).
- Verified: `next typegen` clean, `tsc --noEmit` clean, `next build` succeeds with `/` listed as `○` (static); scoped ESLint command 0 problems; `npm run lint` shows exactly the 5 known pre-existing errors. One harmless build warning noted: "Failed to find font override values for font `Atkinson Hyperlegible Next`" (Next.js has no precomputed fallback-font metrics for this newer font family yet — informational only, no fallback font generated, not a regression to chase).

Next step: commit Phase 3, then start Phase 4 (home page sections + the Review Loop demo).

## Phase 4: Home page — done

- `src/content/demo.ts`: typed demo data for all three verticals (salon/dental/restaurant, each with a primary 5-star + secondary low-star review and reply) and the salon-only tone-demo data (3 tones x 2 reviews), plus the email template helpers -- all verified word-for-word against `src/lib/resend.ts` and the reply rules in `src/lib/anthropic.ts` before writing (not just copied from the brief's Appendix X1).
- `src/content/home.ts`, `src/content/faq.ts`: remaining home-page copy as typed data (facts band, how-it-works steps, why-it-matters stats + BrightLocal source, plan included/excluded lists, founder note, full FAQ bank with home/pricing orderings).
- The signature **Review Loop demo** (`src/components/marketing/ReviewLoopDemo.tsx` + `review-loop/` subcomponents: `EmailCard`, `ReviewCard`, `ReplyCard`, `GoldThreadSegment`, `VerticalSwitch`, `useReviewLoopSequence`): full choreography timetable from DESIGN.md S6 (thread draws, star stagger, skeleton-to-text resolve, scripted copy/replay), SSR-safe (initial state is always the *final* state, so there's no flash of missing content and no-JS/reduced-motion users get the resolved demo immediately), vertical switching replays from the review-card step per spec, hero search typing personalizes the business name and reply sign-off via a 120ms crossfade without replaying the sequence, and the real "Copy reply" button does a genuine `navigator.clipboard.writeText`.
- `BusinessSearchForm` (debounced 150ms/40-char emit, empty-submit inline error, dark variant for the final CTA, unique `id` per instance), `ToneDemo` (3-tone radiogroup, 2px-blur crossfade), `HowItWorks` (4 alternating steps, each with a small scripted vignette that plays once on `onViewportEnter`), `WhyItMatters` (stat sentences with the percentage highlighted inline, not in a tile), `PlanCard`, `FounderNote`, `FinalCta`, and `Faq` (native `<details>`, CSS-only height/opacity animation via `interpolate-size`/`::details-content`, instant fallback elsewhere) all built and assembled into `(marketing)/page.tsx` in the F2 section order.
- Installed `motion` (v13.4.6); used via `LazyMotion`/`domAnimation`/`MotionConfig reducedMotion="user"` in every animated island, matching DESIGN.md S6.
- Added a `plus` icon (rotates 45° on open, the spec'd FAQ disclosure treatment) to the shared `Icon` set -- 9 of the ≤10 icon budget now used.
- Manual QA via Playwright screenshots at 390 and 1440 (see G5 self-checks, logged informally here and formally repeated in CRITIQUE_LOG.md during Phase 7): caught and fixed two real bugs before commit --
  1. The header's desktop-only "Start free trial" button was visible on mobile. Root cause: `Button`'s own base classes always include `inline-flex`, which fought with a `hidden sm:inline-flex` className passed in for responsive visibility (Tailwind doesn't guarantee className-prop utilities win over a component's baked-in classes). Fixed by wrapping the button in a `<div className="hidden sm:block">` instead, and documented the pattern so it doesn't recur (`.text-lead`'s color was fixed the same way pre-emptively). See DECISIONS.md #9-10.
  2. The vertical switch labels ("Salon / Dental office / Restaurant") plus the Example tag wrapped awkwardly at 390px. Added `switchLabelShort` per DESIGN.md's own "short labels on mobile" spec. See DECISIONS.md #11.
- Confirmed via scripted interaction (Playwright): vertical switch updates the business name, hero search typing personalizes the email subject live, tone switch changes the drafted reply text, and empty-submit validation keeps the visitor on the page with the inline error -- all working.
- Two console 404s observed on `/` are expected, not bugs: Next.js prefetches linked routes (`/pricing`, `/bozeman`) that don't exist until Phase 5.
- Fixed one real lint error introduced by this phase's code (`react-hooks/set-state-in-effect` in `useReviewLoopSequence.ts`) with a justified, narrowly-scoped suppression -- see DECISIONS.md #12. Scoped ESLint command is back to 0 problems; `next build` succeeds with `/` still static; `tsc --noEmit` clean.

Next step: commit Phase 4, then start Phase 5 (pricing, industry pages, Bozeman page, legal pages, metadata/SEO).

## Phase 5: Remaining marketing pages and metadata — done

- `/pricing` (F3): plan card, "What's included" (expanded 5-item descriptions in `src/content/home.ts`), "What you won't pay for," pricing-specific FAQ subset, final CTA.
- Industry pages (F4): one dynamic route (`src/app/(marketing)/for/[vertical]/page.tsx`, `generateStaticParams` + `dynamicParams = false`, so unknown verticals 404 instead of rendering on-demand) driven by `src/content/verticals.ts`. Shared `VerticalPageTemplate` + `VerticalHero` (demo locked to the vertical, no switch) render all three of `/for/salons`, `/for/dental`, `/for/restaurants`, all building as static (`●` SSG) per the build output.
- `/bozeman` (F5): founder-voice hero, numbered 20-minute visit sequence, `ContactForm` (honeypot + `startedAt` timing field, posts to `/api/contact`, handles success/503/error states distinctly), conditional "Prefer email?"/"Pick a time" links, a `BusinessSearchForm` for the DIY path, and a Main Street photo slot that collapses cleanly when unconfigured (added `site.mainStreetPhoto`, not in F1's original field list -- see DECISIONS.md #14).
- `/api/contact` (F9, pulled into this phase since `/bozeman` depends on it): zod-validated, honeypot + 3-second minimum-fill-time spam check (silently returns `{ ok: true }` without sending), 503 when `CONTACT_TO_EMAIL` is unset, sends via the existing `resend` client with `replyTo` set to the visitor's email (verified the SDK's exact field name from its `.d.mts`). Added `CONTACT_TO_EMAIL` to `.env.local.example` with a comment, per A4's one allowed exception.
- `/privacy` and `/terms` (F6): full plain-English text per the X5 outlines, including the required SMS/A2P 10DLC language, inside a shared `LegalLayout`/`LegalSection` (max 68ch, H2 per section, "Last updated" date). Flagged for Sam's (and ideally a lawyer's) review in the final report, not labeled "draft" anywhere on the page itself.
- Metadata/SEO (F7): root `layout.tsx` now sets full Open Graph + Twitter card fields (once, at root, per spec's literal wording -- each page only overrides `title`/`description`/`alternates.canonical`); `opengraph-image.tsx` using a real downloaded static Libre Franklin ExtraBold TTF (see DECISIONS.md #16); `JsonLd` (Organization + SoftwareApplication, deliberately no `aggregateRating`/`review`) rendered in `(marketing)/layout.tsx`; `sitemap.ts` and `robots.ts`; branded `not-found.tsx`; `icon.svg` + code-generated `apple-icon.tsx` (replacing the stock `favicon.ico`, see DECISIONS.md #15).
- `docs/website/CLAIMS.md` written and cross-checked against `src/lib/resend.ts`, `anthropic.ts`, `pricing.ts`, `places.ts`, `vercel.json`, and `api/checkout/route.ts` -- every claim on every page built so far traces to a real source; nothing from B2's "not allowed" column slipped in.
- Fixed two real lint errors from this phase's code before commit: an unescaped apostrophe in `/privacy` (`react/no-unescaped-entities`) and an impure `Date.now()` call in `ContactForm` (`react-hooks/purity` -- switched `useRef(Date.now())` to `useState(() => Date.now())`). See DECISIONS.md #13.
- Verified via screenshots at 390/1440: `/pricing`, `/for/salons`, `/for/dental`, `/bozeman`, `/privacy`, `/terms`, and the 404 page all render cleanly, on-brand, with the Review Loop demo resolving identically on vertical pages as on the home page (one screenshot caught mid-animation initially -- confirmed not a bug by re-shooting after the full 4.4s sequence).
- `next build`: all new routes list as `○` or `●` static. Scoped ESLint 0 problems, `tsc --noEmit` clean, `npm run lint` still shows only the 5 known baseline errors.

Next step: commit Phase 5, then start Phase 6 (move onboarding/customers/dashboard into `(app)`, implement `/onboarding?q=`, restyle those three pages, wire analytics).

## Phase 6: Funnel continuity (app pages) — not started

## Phase 7: QA and polish — not started

## Phase 8-9: Ship and report — not started
