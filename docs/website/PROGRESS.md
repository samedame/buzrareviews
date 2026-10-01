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

## Phase 4: Home page — not started

## Phase 5: Remaining pages and metadata — not started

## Phase 6: Funnel continuity (app pages) — not started

## Phase 7: QA and polish — not started

## Phase 8-9: Ship and report — not started
