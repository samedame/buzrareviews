# Critique log

Phase 7 (PART H3) taste and polish pass. Two full passes were run against a
local production build (`next build` + `next start -p 3100`): Pass 1 looked
only at the home page with fresh eyes; Pass 2 covered all 11 routes at 390,
768, and 1440px. Screenshots for this review were taken with
`reducedMotion: "reduce"` so the Review Loop demo cards show their finished
state rather than a random mid-choreography frame. Canonical screenshots now
live at `qa-artifacts/screens/<mobile|tablet|desktop>/<slug>.png` after the
Playwright run at the bottom of this phase (slugs: `home`, `pricing`,
`for-salons`, `for-dental`, `for-restaurants`, `bozeman`, `privacy`, `terms`,
`onboarding`, `customers`, `dashboard`).

## Findings and fixes

### 1. Loading-state button labels missing the ellipsis convention

Web Interface Guidelines: "Loading states end with `…`: `Loading…`,
`Saving…`". Several buttons across the app funnel showed a loading word with
no ellipsis (inconsistent with the typography convention, and with the fact
that every other string on these pages follows it).

- `src/app/(app)/onboarding/page.tsx`: "Searching" to "Searching…", "Saving"
  to "Saving…".
- `src/app/(app)/customers/page.tsx`: "Adding" to "Adding…".
- `src/app/(app)/dashboard/page.tsx`: "Loading" to "Loading…", "Redirecting"
  to "Redirecting…", "Saving" (tone) to "Saving…", "Generating example" to
  "Generating…".
- `src/components/marketing/ContactForm.tsx`: "Sending" to "Sending…".

No em dash or en dash involved (`…` is U+2026, distinct from the banned
U+2013/U+2014), so this doesn't conflict with G3.

### 2. App-funnel inputs missing `autoComplete`/`name`/`inputMode`

Web Interface Guidelines: "Inputs need autocomplete and meaningful name" and
"Use correct type and inputmode." `src/components/marketing/ContactForm.tsx`
and `BusinessSearchForm.tsx` already do this correctly (`autoComplete="name"`,
`"organization"`, `"email"`, `"tel"`), but the equivalent fields in the app
funnel pages did not, which is an inconsistency rather than a deliberate
choice.

- `src/app/(app)/onboarding/page.tsx`: business-name search input gained
  `name="business"` + `autoComplete="organization"`; owner email gained
  `name="email"` + `autoComplete="email"`; owner phone gained `name="tel"` +
  `autoComplete="tel"` + `inputMode="tel"`.
- `src/app/(app)/customers/page.tsx`: customer name/email/phone fields gained
  the matching `name`/`autoComplete`/`inputMode` attributes. The opaque
  "Business ID" field got `autoComplete="off"` instead (it isn't a standard
  autofill category, and leaving autocomplete unset risks odd browser
  suggestions on a field that's really a pasted token).
- `src/app/(app)/dashboard/page.tsx`: the "Business ID" load input got the
  same `autoComplete="off"`.

### 3. Straight quotation marks in FAQ copy

Web Interface Guidelines: "Curly quotes `"` `"` not straight `"`."
`src/content/faq.ts` ("What do my customers get?") quoted the email subject
and button copy with escaped straight quotes (`\"How was your visit...\"`).
Changed to curly quotes. Scoped narrowly to this one actual quotation --
the site's straight apostrophes (`doesn't`, `Google's`, `&apos;s` in JSX) are
a consistent, sitewide, intentional style and were left alone; rewriting
every apostrophe would be unrelated scope creep, not a fix.

### 4. Three dashboard buttons missing the focus-visible treatment

Every other button-style control on the site (`Button.tsx`, the tone-preset
chips, `VerticalSwitch`, `ToneDemo`'s radio chips, the onboarding
result-selection buttons, `ReplyCard`'s "Copy reply") carries
`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-ink`. Three buttons in `src/app/(app)/dashboard/page.tsx`
did not: "Save tone", "Show me an example", and the per-review "Copy reply"
button. Added the same classes to all three. (Plain underlined `<a>`/`<Link>`
text links sitewide intentionally rely on the browser's native default focus
ring rather than this custom style -- that pattern is consistent everywhere
it appears and was left as-is, it is not the same category of control.)

### 5. Mobile menu drawer used `h-full` instead of `h-dvh`

`mobile-native` skill, "Layout has the wrong height": a percentage height on
a `<dialog>` shown via `showModal()` resolves against the viewport the same
way `100vh` does, so it can be taller than the visible area while the
address bar is showing. `src/components/marketing/MobileMenu.tsx`'s
full-screen dialog used `h-full`; changed to `h-dvh` so it tracks the real
visible viewport as Safari's/Chrome's chrome shows and hides. Verified
Tailwind v4 ships `h-dvh` (compiles to `height: 100dvh`) by inspecting
`node_modules/tailwindcss/dist/lib.js`.

### 6. No mobile platform-layer baseline in `globals.css`

`mobile-native` skill baseline: nothing in the codebase set
`-webkit-tap-highlight-color`, `-webkit-text-size-adjust`, `touch-action`, or
`user-select`/`-webkit-touch-callout` on interactive elements. In practice
this means every tap flashed the default gray/blue highlight, buttons and
links carried the ~300ms double-tap-zoom delay window, and long-pressing a
button or a link styled as a button could select its text or (on iOS) pop
the share/callout menu. Added the skill's baseline block to
`src/app/globals.css`:

```css
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;
}

button,
a,
[role="button"] {
  touch-action: manipulation;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  user-select: none;
}
```

Verified separately (not part of this fix, just confirmed already correct):
every form input renders at `text-body` (18px), well above the 16px
floor that causes iOS Safari to zoom the page on focus, so no input
font-size override was needed.

Deliberately not applied, per the skill's own caveats:

- `overscroll-behavior: none` on `html, body` -- the skill says to drop this
  "if the app is a scrolling document where pull-to-refresh is welcome,"
  which describes every route here (a marketing site plus three plain
  scrolling funnel pages, no app-shell scroll containers). Removing native
  pull-to-refresh/rubber-banding from a plain content site would cost a
  familiar mobile convenience for no corresponding bug fixed.
- `viewport-fit=cover` + `env(safe-area-inset-*)` -- without this meta flag
  the browser already letterboxes the page inside the safe area (and that
  letterboxing is the paper-white background, so it's invisible), which is
  correct as-is. Turning on edge-to-edge rendering would newly require
  safe-area padding on the sticky header and the mobile menu's bottom button
  that nothing currently needs, for a site that isn't trying to feel like an
  installed PWA.

### 7. No `theme-color` meta tag

Added a `viewport` export to `src/app/layout.tsx`:

```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};
```

A single value, not a light/dark pair: DESIGN.md is explicit that this is a
light-theme-only system with no `prefers-color-scheme: dark` block, so one
`themeColor` matching the paper background (the color at the very top of
every page) is correct and complete.

## Reviewed, no findings

- **`vercel-react-best-practices` on the ~20 "use client" components**
  (`Hero`, `PlanCard`, `SiteHeader`, `HowItWorks`, `BusinessSearchForm`,
  `TrackedStartTrialLink`, `ContactForm`, `VerticalHero`, `ToneDemo`,
  `MobileMenu`, `ReviewLoopDemo` + all of `review-loop/*`, and the three app
  pages): no inline component definitions, functional `setState` already
  used where callbacks are stable, effect dependencies are primitives,
  `BusinessSearchForm`'s personalization is already debounced before it
  reaches `ReviewLoopDemo`, `LazyMotion`/`domAnimation` is already scoped to
  exactly the three components that need motion. No data-fetch waterfalls in
  server components (the only `await` outside the API routes is `await
  params` in `/for/[vertical]`). The home page's JS weight is the
  already-documented, in-scope-elsewhere exception in `DECISIONS.md` and was
  not touched.
- **`review-animations` STANDARDS.md's ten standards, against every
  motion-using file** (`ReviewLoopDemo.tsx` and all of
  `marketing/review-loop/*`, `ToneDemo.tsx`, `HowItWorks.tsx`): every
  duration and curve traces exactly to the tokens in DESIGN.md S6
  (`--ease-out`/`--ease-in-out`, sub-300ms UI responses, the thread's 700ms
  draw and the demo's up-to-2600ms choreography both fall inside the "demo
  steps up to 700ms... whole hero sequence finishes within 4.5s" budget),
  reduced motion renders the finished state immediately via
  `useReviewLoopSequence`'s `finalState()`, nothing animates `scale(0)`
  (stars go `[0.9, 1]`), and nothing is a keyframe-based entrance for
  rapidly-retriggered UI (the vertical switch and tone switch both use
  cross-fades driven by `motion`'s interruptible `animate`). No Block-level
  items. The one borderline item -- `HowItWorks`'s `FindBusinessVignette`
  animates `borderColor`/`backgroundColor`, properties outside the
  transform/opacity/filter/clip-path/path-length list in DESIGN.md S6 -- is a
  once-per-scroll, non-looping state change on a small vignette, not a
  performance-sensitive or frequently-retriggered animation, so it doesn't
  rise to a Block finding.
- **Tailwind v4's `hover:` variant**: confirmed by inspecting
  `node_modules/tailwindcss/dist/lib.js` that `hover:` already compiles to
  `@media (hover: hover) { &:hover {...} }`, so DESIGN.md's "hover only under
  `(hover: hover) and (pointer: fine)`" rule is already satisfied everywhere
  `hover:` is used (`Button`, `VerticalSwitch`, `ToneDemo`, the onboarding
  result rows, `WhoItsForMenu`) without further changes.
- **Icon-only buttons**: `MobileMenu`'s hamburger/close buttons both pair
  the icon with a `VisuallyHidden` label ("Open menu"/"Close menu"); every
  other icon usage sits next to visible text.
- **Form error handling**: errors render inline (`role="alert"`) next to the
  field/action that caused them; this was already correct everywhere it's
  used.

## G5 self-checks

One line per page per check (squint / five-second / swap /
remove-one-accessory).

- **`/` (home)**: Squint: pass -- H1, the business search, and "$29 a
  month" (in the lead paragraph) are the first things seen on both 1440 and
  390. Five-second: pass -- review-request emails plus drafted replies, for
  salons/dental/restaurants, $29/month, is legible to a stranger. Swap: pass
  -- Bozeman, Sam, the three tone presets, and the BrightLocal citation keep
  it specific. Remove-one-accessory: pass -- nothing decorative remains to
  cut; the page was already restrained before this review.
- **`/pricing`**: Squint: pass -- H1 is literally "One plan. $29 a month."
  Five-second: pass. Swap: pass ("What you won't pay for" is concrete).
  Remove-one-accessory: pass.
- **`/for/salons`**: Squint: the H1/search/demo are the first things seen,
  but the price is not in the first viewport (see note below). Five-second:
  pass (stylist-credit, Saturday-rush specifics). Swap: pass. Remove-one-
  accessory: pass.
- **`/for/dental`**: Same squint note as salons. Five-second: pass (the
  no-reviewer-name reply and the "no legal advice" caveat are dental-
  specific). Swap: pass. Remove-one-accessory: pass.
- **`/for/restaurants`**: Same squint note. Five-second: pass (the honest
  "walk-in only, BuzraReviews isn't the right fit yet" line is a real
  specificity signal). Swap: pass. Remove-one-accessory: pass.
- **`/bozeman`**: Same squint note (no price anywhere on the page). Five-
  second: pass (an in-person visit offer from a named founder). Swap: pass
  -- "Sam," "Bozeman," "no charge for the visit," and the 4-step 20-minute
  list make this unmistakably not a generic page. Remove-one-accessory: pass.
  **Note on the squint-test price gap** (`/for/salons`, `/for/dental`,
  `/for/restaurants`, `/bozeman`): DESIGN.md principle 4 says price should
  appear in the first viewport, but MASTER_PROMPT F4/F5/Appendix X2 lock the
  exact H1/lead copy for these four pages verbatim, and none of that locked
  copy mentions "$29." This is a locked-content choice, not a bug -- fixing
  it would mean rewriting copy that the spec says to use "never for
  meaning," so it was left alone and is recorded here rather than changed.
- **`/privacy`, `/terms`**: Not applicable to squint/five-second/swap (no
  H1-search-price pattern expected on a legal page); both read as
  substantive, specific, placeholder-free text with a real "Last updated"
  date.
- **`/onboarding`**: Squint: pass for its purpose -- one H1, one input, one
  button, no price (correct for a mid-funnel step). Five-second: pass. Swap:
  pass (Google-listing search tied to the real flow). Remove-one-accessory:
  pass.
- **`/customers`**: Squint/five-second/swap: pass, same reasoning as
  onboarding. Remove-one-accessory: pass.
- **`/dashboard`**: Squint: pass -- business name, reviews, and the $29/mo
  subscription line are all visible without scrolling once loaded.
  Five-second: pass. Swap: pass (Google copy-paste workflow, AI-drafted
  reply, the honest "we don't post it for you" line). Remove-one-accessory:
  pass.

## Reference comparison

Compared `docs/design/references/stripe/desktop-0.png` and
`docs/design/references/attio/desktop-0.png` against the home and dashboard
screenshots. Stripe's hero is centered, carries a large decorative gradient
swoosh, and stacks a logo wall directly under the fold -- all three are
explicitly banned here (G1), and the comparison confirms the left-aligned,
gradient-free, logo-wall-free home page reads calmer by design, not by
accident. Attio's product-UI panel (a flat, hairline-bordered card with
macOS traffic-light chrome, no soft shadow) is the closer craft comparison
to our "paper card" components (`ReviewCard`, `ReplyCard`, the dashboard's
review list items): both use a single hairline border and a flat or
near-flat edge instead of a blurred shadow, and both read as crisp rather
than soft. No changes made from this comparison; it was a sanity check, and
it passed.
