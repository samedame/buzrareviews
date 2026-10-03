# BuzraReviews Fix Pass 2: Master Prompt for Claude Code

Version 1.0, written October 1, 2026. A small follow-up to Fix Pass 1, on the same branch and the same pull request.

---

## FOR SAM: HOW TO RUN THIS (Claude, skip to PART A)

```bash
cd ~/Desktop/buzrareviews
git checkout site/fix-pass-1 && git pull
mv ~/Downloads/FIX_PASS_2.md docs/website/FIX_PASS_2.md
claude --effort high
```

Paste this one line:

```text
/goal Read docs/website/FIX_PASS_2.md completely, then execute every step in order without asking me questions. The goal is met only when the report is posted in this conversation with every Definition of Done item marked PASS and backed by real command output shown here (build exit 0, scoped lint and typecheck clean, all Playwright projects green with axe 0 violations and copy lint 0 hits) and the new commits are pushed to site/fix-pass-1. If not met after 60 turns, stop and report exactly what is blocking.
```

When it's done, the Vercel preview for `site/fix-pass-1` rebuilds automatically. Send Claude (in chat) a fresh share link to that preview so it can reverify, then merge.

---

# PART A: MISSION AND RULES

## A1. Mission

Fix Pass 1 is complete and verified. A review of the preview found three small problems. Fix them on branch `site/fix-pass-1` (the open pull request), prove each fix with a test, and push. Change nothing else.

| # | Problem | Where |
|---|---|---|
| 1 | The industry pages show BrightLocal statistics ("74% of people only care about reviews from the last three months," and "50%" on the restaurants page) with no visible source link. The home page cites the same survey correctly. Every statistic on the site must have a visible source line. | `/for/salons`, `/for/restaurants`, `/for/dental` (the shared vertical template) |
| 2 | Fix Pass 1's metadata helper dropped the share image details. Production currently outputs `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`, and the matching `twitter:image:*` tags, plus a cache-busting query on the image URL. The preview outputs only `og:image` and `twitter:image` with a bare URL. | Every page |
| 3 | On `/setup`, the numbered steps read "1. 1Find and confirm..." to assistive tech: the `<ol>` already announces the number, and a visible numeral repeats it. | `/setup`, and any other numbered list built the same way |

## A2. Rules

1. Work autonomously. Do not ask Sam questions. Log any judgment call with one line of reasoning in `docs/website/DECISIONS.md` under "Fix pass 2".
2. Read every file in full before changing it. Read the Next.js 16 metadata docs in `node_modules/next/dist/docs/` before touching metadata, especially how file-based `opengraph-image` and `twitter-image` interact with `openGraph.images` and `twitter.images` set in config.
3. Every rule from Fix Pass 1 PART A still applies: never touch `main`, never read or commit secrets (use the same throwaway `.env.local` dummy values if `.env.local` is missing, and delete it at the end), never reach real services, mock every network call in tests, no new dependencies, no em dashes or en dashes anywhere, copy follows `DESIGN.md` and the `buzra-brand` skill.
4. Do not change copy except where this prompt says so. Do not change the design.

# PART B: STEPS

## Step 1: Baseline

On `site/fix-pass-1`, run and record: `npx next typegen && npx tsc --noEmit` (exit 0), the scoped lint command from Fix Pass 1 (exit 0), `npx next build` (exit 0), and `npm run qa:e2e` (all green). If anything is red before you change code, record it and fix it only if it's one of the three problems.

## Step 2: Source lines for every statistic (problem 1)

1. Find how the home page renders its source line under the BrightLocal statistics (the "Source: BrightLocal, Local Consumer Review Survey 2026" link, with its external link icon). Reuse that exact component or markup.
2. In `src/content/verticals.ts` (or wherever the vertical points live), add a typed `source` field to every point that contains a statistic, and render the same source line under that point in the vertical template. If a page has several cited points, one source line under the group is fine, matching the home page pattern.
3. Grep `src/content/` and `src/app/` for any rendered number followed by `%`. Every one must have a visible BrightLocal source line in the same section. Do not add, remove, or reword any statistic.
4. The source link keeps the home page's behavior (same tab, external link icon, `https://www.brightlocal.com/research/local-consumer-review-survey/`).

## Step 3: Full share image metadata (problem 2)

1. Inspect `src/config/metadata.ts` and `src/app/opengraph-image.tsx` (and `twitter-image.tsx` if it exists). Check what `opengraph-image.tsx` exports (`alt`, `size`, `contentType`).
2. Preferred fix: stop setting `images` in the helper's `openGraph` and `twitter` objects, so the file-based image convention supplies the URL (with its cache-busting query), width, height, type, and alt on every page, as it does on production today.
3. If the build shows that the file-based image does not reach pages that set their own `openGraph` object, set the images explicitly in the helper instead, with every field: absolute URL, `width: 1200`, `height: 630`, `type: "image/png"`, and `alt: "BuzraReviews: Google reviews for local businesses"` (or whatever `opengraph-image.tsx` exports as `alt`; the two must match). Do the same for `twitter.images`.
4. Verify in the built HTML of `/`, `/pricing`, `/setup`, and `/for/salons` that each page outputs `og:image`, `og:image:width`, `og:image:height`, `og:image:type`, `og:image:alt`, `twitter:image`, and `twitter:image:alt`, with absolute URLs on `https://buzrareviews.com`, and that each page's own `og:title`, `og:description`, `og:url`, and canonical are unchanged from Fix Pass 1.

## Step 4: No doubled step numbers (problem 3)

1. On `/setup`, keep the `<ol>` (the steps are a real sequence) and mark the visible decorative numeral `aria-hidden="true"`, so assistive tech announces each step once. Keep the visual design exactly as it is.
2. Check every other numbered list on the site built the same way (for example "How it works" on the home page) and apply the same treatment only where a numeral is announced twice. If "How it works" isn't an `<ol>` and its numeral is the only number announced, leave it alone and log that.

## Step 5: Tests

1. Extend `qa/tests/metadata.spec.ts`: for every marketing route, assert `og:image`, `og:image:width` = `1200`, `og:image:height` = `630`, `og:image:type` = `image/png`, a non-empty `og:image:alt`, `twitter:image`, and a non-empty `twitter:image:alt`, with absolute `https://buzrareviews.com` image URLs. Keep every existing assertion.
2. Add `qa/tests/citations.spec.ts`: on every marketing route, find every text node containing a number followed by `%`, and assert that its section (the closest `section` element) contains a link to `https://www.brightlocal.com/research/local-consumer-review-survey/` with visible text that includes "BrightLocal". Exclude `/privacy` and `/terms`.
3. Add to an existing accessibility test: on `/setup`, every list item's accessible text does not start with a digit (the duplicate numeral is hidden from assistive tech).
4. Never weaken an existing assertion.

## Step 6: Gates (paste the real output)

| Gate | Threshold |
|---|---|
| Build | `npx next build` exits 0; marketing routes still static |
| Types | `npm run qa:types` exits 0 |
| Lint | Scoped ESLint exits 0; `npm run lint` shows only the 5 known errors |
| E2E | Every Playwright test passes on mobile, tablet, desktop |
| Accessibility | axe 0 violations on every route |
| Copy | Copy lint 0 hits on every route |

Fix causes, never tests. Never lower a threshold or skip a test.

## Step 7: Ship and report

1. Delete the throwaway `.env.local` if you created it. `git status` must be clean apart from intended changes.
2. Commit as `fix: pass 2 stat citations, share image tags, step numerals` and push to `site/fix-pass-1`. Never merge, never touch `main`.
3. If `gh` works, add a short comment to the open pull request summarizing Fix Pass 2 (`gh pr comment --body-file docs/website/FIX_PASS_2_REPORT.md`).
4. Write `docs/website/FIX_PASS_2_REPORT.md` and post it here with: a summary, a table of the three problems with what changed, files, and the proving test, the gates table with measured values and commands, and decisions logged.

## Definition of Done

- [ ] Problem 1: every statistic on every marketing page has a visible BrightLocal source line; `citations.spec.ts` passes.
- [ ] Problem 2: every page outputs full `og:image` and `twitter:image` tags with width, height, type, and alt; page-specific titles, descriptions, URLs, and canonicals unchanged; `metadata.spec.ts` passes.
- [ ] Problem 3: no numeral is announced twice on `/setup`; the test passes.
- [ ] Every gate passes with evidence shown in this conversation.
- [ ] Commits pushed to `site/fix-pass-1`; report written and posted.
