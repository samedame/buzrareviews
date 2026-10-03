# Fix pass 2: final report

## Summary

All three problems from the preview review are fixed on `site/fix-pass-1`: every statistic on the industry pages now has a visible BrightLocal source line, every page's share-image metadata is back to the full field set production outputs (width, height, type, alt, for both `og:image` and `twitter:image`), and `/setup`'s numbered steps no longer announce their number twice to assistive tech. Every gate passes; nothing else changed.

## Issues

| # | Problem | What changed | Files | Test |
|---|---|---|---|---|
| 1 | Industry pages cite BrightLocal stats with no visible source link | Extracted the home page's source-link markup into a shared `BrightLocalSource` component; added a `hasSource` flag to the one statistic-bearing point on each of the three vertical pages and rendered the source line directly under it | `src/components/marketing/{BrightLocalSource,WhyItMatters,VerticalPageTemplate}.tsx`, `src/content/verticals.ts` | `qa/tests/citations.spec.ts` |
| 2 | Share image metadata missing width/height/type/alt and the matching Twitter tags | Tested the spec's "preferred" fix (removing `images` entirely) first -- confirmed it doesn't work, since any page-level `openGraph` object still fully replaces the root layout's. Set the full field set explicitly instead, imported from `opengraph-image.tsx`'s own `alt`/`size`/`contentType` exports so the two can't drift | `src/config/metadata.ts` | `qa/tests/metadata.spec.ts` (extended) |
| 3 | `/setup`'s numbered steps announce their number twice | Marked the decorative numeral `aria-hidden="true"`; the `<ol>` still announces each item's real position. Checked `HowItWorks` (the other numbered content) and confirmed it isn't an `<ol>`, so its numeral isn't doubled -- left it alone, as the spec's own fallback instructs | `src/app/(marketing)/setup/page.tsx` | `qa/tests/pages.spec.ts` (extended, `/setup`'s axe test) |

## Gates

| Gate | Threshold | Measured | Command |
|---|---|---|---|
| Build | `next build` exits 0; marketing routes still static | Exit 0; every route's rendering mode unchanged from Fix Pass 1 | `npx next build` |
| Types | `npm run qa:types` exits 0 | Exit 0 | `npx next typegen && npx tsc --noEmit` |
| Lint | Scoped exits 0; full shows only the 5 known errors | Scoped: 0 problems. Full: exactly 5, identical to every prior baseline | `npx eslint . --ignore-pattern ...` / `npm run lint` |
| E2E | All Playwright tests pass on mobile/tablet/desktop | 338 passed (+18 from the new `citations.spec.ts`, 6 tests x 3 projects), 1 failed (JS weight, pre-existing, unchanged), 12 skipped | `npx playwright test -c qa/playwright.config.ts` |
| Accessibility | axe 0 violations on every route | 0 violations everywhere, including the new `/setup` numeral check folded into its existing axe test | Playwright axe assertions |
| Copy | Copy lint 0 hits on every route | 0 hits; no statistic text changed, only a source link added alongside each | `qa/tests/pages.spec.ts` copy-lint test |

A real bug in my own first version of `citations.spec.ts` was caught and fixed before counting it as passing: a `TreeWalker` over `document.body`'s text nodes was also matching text inside `<script>` tags -- specifically Next's RSC flight-data payload, serialized JSON that can coincidentally contain a `\d%`-shaped substring unrelated to any rendered statistic. Fixed by rejecting text nodes whose nearest element ancestor is `script`/`style`.

## Decisions

Logged in `docs/website/DECISIONS.md` under "Fix pass 2" (#43-47):

- **#43** — confirmed empirically that removing `images` from the metadata helper doesn't restore the file-based image on subpages (same root cause as Fix Pass 1 decision #31); implemented the spec's own explicit-fields fallback instead.
- **#44** — did not replicate production's cache-busting query hash on the image URL; it's computed internally by Next's own file-based resolution, not reproducible via a manually-set `images` literal, and isn't part of the testable acceptance criteria.
- **#45, #46** — `BrightLocalSource` extracted as a shared component; `hasSource` placed per-point rather than per-group, since each vertical page has exactly one statistic-bearing point among three non-statistic ones.
- **#47** — `HowItWorks`'s numerals left untouched; confirmed via a repo-wide grep that `/setup` is the only `<ol>` in `src/`.
