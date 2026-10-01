# Decisions log

Every ambiguous call made while executing `docs/website/MASTER_PROMPT.md`, with one line of reasoning, so later phases (and Sam) can see why. Newest at the bottom.

## Phase 0

1. **Motion AI Kit installed via the manual fallback, not the interactive installer.** `npx motion-ai` expects an interactive TTY (pick "Project", select "Claude Code", confirm). This session can't drive that prompt, so used the documented fallback: `npm pack`, extract, copy `content/skills/motion` into `.claude/skills/motion`. Did not run `claude mcp add --transport http motion https://mcp.motion.dev` because a plugin/MCP server added mid-session isn't callable until restart anyway (per C1's own note) — the self-contained `.claude/skills/motion/best-practices/` docs are the thing actually used during Phases 3-5.
2. **Installed `@playwright/test` and `@axe-core/playwright` during Phase 0, not Phase 1.** D1 asks for them, but C1's toolchain check also needs a working Playwright/Chromium for later phases, and installing once up front avoids a second `npm i` later. No behavior change, just sequencing.

## Phase 1

3. **Trusted the live screenshots over the D2 text where they disagreed, per A3 rule 1 ("if a site has changed since this prompt was written, trust what you see").** Linear's hero is now fully rendered at 0ms (D2 said blank at 3s), Attio has moved to a centered hero with an announcement bar (D2 implied an asymmetric positive example), GlossGenius's below-fold product moment is now an AI chat composer, not a scheduling calendar. REFERENCE_NOTES.md documents each case inline. None of this changes PART E (the design is locked); it only affects which concrete details back up the "default AI SaaS page" contrast in DESIGN.md.
4. **Delegated screenshot viewing to a forked subagent rather than reading all 172 PNGs in the main thread.** Image tool results are expensive context with no reuse value once the notes are written; the fork wrote `docs/design/REFERENCE_NOTES.md` directly and reported back a short summary. The file itself was reviewed in the main thread before committing.

## Phase 2

5. **Recomputed every DESIGN.md contrast ratio from sRGB relative luminance (WCAG 2.x formula) instead of copying the brief's rounded figures verbatim.** The H2 QA gate requires every ratio in DESIGN.md to be independently correct, not just transcribed. All ten pairs came out within 0.1-1.0 of the brief's stated numbers (e.g. ink/paper: brief said 15.7:1, computed 16.03:1) and every pair still clears its WCAG AA threshold, so no token values changed — only the documented ratios were corrected to the precise computed values.

## Phase 3

6. **Added `.claude/**`, `.agents/**`, `qa-artifacts/**`, and `docs/design/references/**` to `eslint.config.mjs`'s `globalIgnores`.** The H1 scoped lint command was specified before Phase 0 installed any plugins/skills; without this, ESLint walks into vendored third-party scripts (e.g. `.claude/skills/impeccable/scripts/live-browser.js`, a minified-looking bundled file) and produces ~94 bogus warnings that have nothing to do with our source. This mirrors `.gitignore`'s existing exclusions for the same directories, so the scoped lint gate now only ever reports on our own code. Verified `npx eslint . --ignore-pattern ... ` is back to 0 problems and `npm run lint` shows exactly the 5 known pre-existing errors.
7. **Loaded `Libre_Franklin` and `Atkinson_Hyperlegible_Next` with `weight: "variable"` instead of an array of static weights.** Both support a `variable` weight option in this Next.js version's font data (confirmed in `node_modules/next/dist/compiled/@next/font/dist/google/font-data.json` and the type declarations) which loads the true variable font file, matching DESIGN.md's "variable font" requirement and letting CSS set any weight in range rather than only the three named ones.
8. **Built a separate `LogoMark` component instead of reusing `Stars` with `max=1` for the single-star logo.** `Stars` always sets `role="img"` with an `aria-label` like "1 out of 1 stars," which is semantically wrong for a decorative logo mark (there's no rating being conveyed). `LogoMark` renders the same star path `aria-hidden`, letting the adjacent wordmark text carry the link's accessible name.
