# DESIGN.md — Main Street Gold

The locked design system for the BuzraReviews marketing site and app pages. This is the source of truth for any UI, styling, animation, or copy work in this repo (see also the `buzra-brand` skill, a quick-reference summary of this file). Full build spec and rationale: `docs/website/MASTER_PROMPT.md` PART E. Reference research backing the choices below: `docs/design/REFERENCE_NOTES.md`.

This direction is locked. Do not re-open it. Values may be refined only where a contrast or rendering check forces it, and any change must be logged in `docs/website/DECISIONS.md`.

## 1. Concept

A well-kept storefront on a small-town main street, plus the universal sign of a good review: the gold star. White like clean shop glass. Pine ink like the forested ridges above Bozeman. Gold like a five-star rating and a sign-painter's gold leaf. The type is American-plainspoken: Libre Franklin, a revival of Franklin Gothic, the workhorse of newspapers and storefront signage, for headlines; Atkinson Hyperlegible Next, designed by the Braille Institute for legibility, for body text, because owners read this on a phone between clients.

Design principles:

1. **The customer's words are the hero.** Reviews and replies appear as real, readable text at real size, never as tiny decorative UI.
2. **Spend boldness in one place.** The hero Review Loop demo. Everything around it is quiet, well spaced, and plain.
3. **Gold is earned.** Gold appears only on stars, the primary button, and the thread. Never as a background wash, never as text on white.
4. **Say the price early.** "$29 a month" appears in the first viewport on desktop and mobile.
5. **Local and human.** A real founder, a real town, real photos (or no photos — layouts look complete without them).

## 2. Color tokens

Defined in `src/app/globals.css` with Tailwind v4 `@theme`.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `paper` | `#FFFFFF` | Page background, cards | — |
| `ink` | `#13251D` | Headings, body text, dark UI, final CTA band background | 15.7:1 on paper |
| `ink-2` | `#3D5249` | Secondary text, lead paragraphs | 8.4:1 on paper |
| `ink-3` | `#5C6F66` | Meta text, captions, placeholders (13px min) | 5.4:1 on paper |
| `gold` | `#F5B000` | Primary button fill, star fill, the thread | Never text on white (1.9:1). Ink on gold: 8.3:1 |
| `gold-hover` | `#E5A400` | Primary button hover | Ink on it: 6.5:1 |
| `gold-edge` | `#A87700` | Star outlines, 1px primary button edge | 3.9:1 on paper (passes non-text 3:1) |
| `gold-wash` | `#FFF4D6` | Selected chip background, "Copied" confirmation background | — |
| `meadow` | `#2E6A4F` | Links, check marks, success states | 6.4:1 on paper |
| `mist` | `#EEF4F0` | Bands, footer background, secondary button hover | — |
| `line` | `#DCE5DF` | Hairlines, card borders | — |
| `brick` | `#B3452F` | Low-star ratings, error text | 5.5:1 on paper |
| `ink-on-dark` | `#C9D6CF` | Secondary text on the ink band | 10.4:1 on ink |

Rules: light theme only (`color-scheme: light`; no `prefers-color-scheme: dark` block). No purple, indigo, violet, lavender, or blue anywhere. No gradients except the thread's own SVG stroke if needed. Body text must reach 4.5:1, large text and UI boundaries 3:1 — every pair actually used on the site is logged in §9 below with its measured ratio.

## 3. Typography

Loaded with `next/font/google` in `src/app/layout.tsx`; Geist removed entirely.

- `Libre_Franklin` — variable, CSS var `--font-libre-franklin`, weights 600/700/800. Maps to `--font-display`.
- `Atkinson_Hyperlegible_Next` — variable, CSS var `--font-atkinson`, weights 400/500/700 (+ italic 400 optional for quoted review text). Maps to `--font-sans`. Body uses `--font-sans`.

| Role | Family / weight | Size | Line height | Tracking | Extras |
|---|---|---|---|---|---|
| Hero H1 | Libre Franklin 800 | `clamp(2.625rem, 1.2rem + 4.6vw, 4.5rem)` | 1.0 | -0.035em | `text-wrap: balance` |
| Section H2 | Libre Franklin 800 | `clamp(2rem, 1.2rem + 2.6vw, 3.25rem)` | 1.05 | -0.03em | `text-wrap: balance` |
| H3 | Libre Franklin 700 | `clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem)` | 1.15 | -0.015em | |
| Lead | Atkinson 400, `ink-2` | 1.25rem | 1.55 | 0 | max 58ch, `text-wrap: pretty` |
| Body | Atkinson 400 | 1.125rem (18px) | 1.6 | 0 | max 68ch |
| Small | Atkinson 400 | 0.9375rem | 1.5 | 0 | |
| Buttons / nav | Libre Franklin 700 (nav 600) | 1rem (hero button 1.0625rem) | 1 | -0.005em | |
| Card micro text | Atkinson 500 | 0.8125rem | 1.4 | 0 | only inside product cards |
| Price / stat numerals | Libre Franklin 800 | as H2 | 1 | -0.02em | `font-variant-numeric: tabular-nums lining-nums` |

Sentence case everywhere. No italic/bold/colored single-word emphasis in headlines, no all-caps labels, no letter-spaced eyebrows, no gradient text, no monospace. Two families only.

## 4. Layout, spacing, shape, depth

- Container: max width 1200px. Gutters 20px (<640px), 32px (≥640px), 40px (≥1280px). No horizontal scroll at 360px.
- Grid: 12 columns, 24px gap desktop. Hero text spans cols 1–6, demo spans 7–12.
- Alignment: left-aligned everywhere; the final CTA band is the only centered block.
- Vertical rhythm: major sections 112px/72px (desktop/mobile) top+bottom; bands 56px/40px. Varied to match content, not stamped identically.
- Radius hierarchy: 6px chips/tags, 10px buttons/inputs, 14px the hero search field, 16px product cards, 24px large panels.
- Depth: product cards are "paper cards" — 1px `line` border + blur-free bottom edge `0 2px 0 rgb(19 37 29 / 0.06)`. Never a hairline border paired with a soft blurred shadow (a generated-UI tell per Impeccable). Sections/bands/pricing cards/FAQ items use hairlines or `mist` fills, no shadow. Primary button: `inset 0 -2px 0 rgb(0 0 0 / 0.12)`, no glow.
- Hairlines: 1px `line`, used to separate, never as decoration grids.

Desktop wireframe and the 390px mobile stacking order are in MASTER_PROMPT.md §E4; unchanged here.

## 5. Components

Build these, nothing generic — full behavior spec in MASTER_PROMPT.md §E5:

`SiteHeader`, `Button` (primary/secondary/text-link), `BusinessSearchForm`, `ReviewLoopDemo` (+ `EmailCard`/`ReviewCard`/`ReplyCard`/`GoldThread`/`ExampleTag`/`VerticalSwitch`), `Stars` (custom inline SVG, never `clip-path`), `ToneDemo`, `HowItWorksStep` + `StepVignette`, `PlanCard`, `StatLine`, `FounderNote`, `Faq` (native `<details>`), `FinalCta`, `SiteFooter`, `ContactForm`, `AppHeader`.

Icons: ≤10 custom inline SVGs (check, copy, mail, star, menu, close, chevron, external link), 20px, 1.75px stroke, `currentColor`. Never in a rounded-square tile except the favicon. Photos: only real photos Sam provides; layouts look complete without them. Logo: `Stars` single star + "BuzraReviews" wordmark, Libre Franklin 800, one color.

## 6. Motion system

Library: `motion` (import from `motion/react`), client islands only, `LazyMotion` + `domAnimation`, `MotionConfig reducedMotion="user"`. CSS for simple hover/press.

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entrances, UI responses */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* on-screen movement, thread drawing */
--dur-press: 140ms;
--dur-ui: 200ms;
--dur-reveal: 260ms;
```

Allowed motion, and nothing else: (1) the hero Review Loop choreography — once on load, replays on user action; (2) direct responses to the visitor's own actions; (3) how-it-works vignettes, once at 40% visibility.

Hero choreography (full table in MASTER_PROMPT.md §E7): H1/lead/form/facts/EmailCard are visible in server HTML with no entrance animation (protects LCP); thread draws to ReviewCard at 300ms; stars fill at 1200ms; thread draws to ReplyCard at 2000ms; ReplyCard resolves from skeleton at 3100ms; copy/replay by 4400ms. Server HTML renders the pending state so there's no animate-in-then-flicker; `prefers-reduced-motion` and no-JS both show the final state immediately.

Global rules: animate only `transform`, `opacity`, small `filter: blur()`, `clip-path`, SVG path length. `--ease-out` for entrances, never `ease-in`. Springs only for interruptible indicators, no overshoot. UI responses <300ms; demo steps up to 700ms; whole hero sequence finishes within 4.5s. Hover only under `@media (hover: hover) and (pointer: fine)`. Reduced motion = no movement, final state immediately.

Banned: fade-up-on-scroll, parallax, scroll-jacking, smooth-scroll libraries, marquees, count-up numbers, typewriter headlines, custom cursors, magnetic buttons, tilt cards, hover-lift-on-every-card, ambient looping animation, animated gradients, background video, WebGL, Lottie.

## 7. Default vs. ours

Grounded in `docs/design/REFERENCE_NOTES.md`'s "Default AI SaaS page" synthesis — every one of these was observed live across the 18 sites captured in Phase 1, not hypothesized.

| Axis | The default AI SaaS page would do this | BuzraReviews does this instead |
|---|---|---|
| Palette | Saturated purple-to-indigo or full black, one acid/neon accent | Warm white paper, pine ink, gold used only where earned (stars, one button, the thread) |
| Type | Inter or a generic grotesk everywhere, one weight doing all the work | Libre Franklin (display) + Atkinson Hyperlegible Next (body) — two deliberate, legible, American-plainspoken faces |
| Hero | Centered, crowded with an announcement bar, headline leads with the word "AI," a self-referential rating badge above it ("4.9 ★★★★★ from 4,000+ reviews") | Left-aligned, no announcement bar, headline states the plain mechanism ("Ask every customer. Answer every review."), zero claims about BuzraReviews' own numbers |
| Proof | A product screenshot crowded with simultaneous metric tiles, bar charts, and dollar figures, or a logo wall / stats band ("2M+ reviews enabled," "60,000+ businesses") | One calm, honest-scale demo (the Review Loop) tagged "Example," real review and reply text at real reading size |
| Layout | The SaaS-card kit: everything chopped into identical rounded cards with the same soft grey shadow | A radius hierarchy (6/10/14/16/24px) and hairline-vs-fill depth system; no card looks like any other card for an unrelated reason |
| Imagery | Stock or staged lifestyle photography, or an AI-generated/surreal hero photo (seen live on Mercury, Birdeye, Boulevard) | Real photos only, shot by Sam, or no photo at all — the layout is designed to look complete either way |
| Motion | Floating UI chips orbiting the headline, a typing-cursor or "[COMPILING...]" status chip, fade-up-on-scroll on every section, count-up stat tickers | One orchestrated hero moment plus motion that only answers the visitor's own actions; everything else is still |
| Copy | Hype words ("Supercharge," "AI-powered," "game-changing"), an italic or color-accented single word in the headline, invented or uncited stats | Plain, specific, sentence-case copy; every number traces to `docs/website/CLAIMS.md`; no em/en dashes, no hype words (full list: MASTER_PROMPT.md §G3) |

## 8. Known tells check

### `frontend-design`'s five AI-generated clusters

1. **Warm cream + high-contrast serif + terracotta accent.** We use a cool white (`paper #FFFFFF`, not cream), two sans faces (no serif display), and gold/pine-ink, not terracotta. Clear miss.
2. **Near-black background + one acid/vermilion accent.** We are light-theme only; the one dark surface we use (`ink #13251D`, the final CTA band) is a deliberate pine-ink, not a near-black stand-in, and it carries no accent color of its own. Clear miss.
3. **Broadsheet hairline newspaper layout, zero border-radius, dense columns.** We do use hairlines, but as organizers (card borders, section dividers) inside a radius hierarchy (6/10/14/16/24px) — never zero-radius, never a dense multi-column newspaper grid. Clear miss.
4. **The SaaS-card kit: identical rounded cards, one radius for everything, the same soft grey shadow, gradient washes.** Explicitly banned in §4: product cards use a hairline border + blur-free bottom edge, never a soft blurred shadow; sections/bands/pricing/FAQ have no shadow at all; no gradient washes anywhere. Clear miss.
5. **Template chrome: ALL-CAPS eyebrows, middle-dot meta strings, "WORD — fragment" em-dash labels, tinted near-black, monospace data labels, "→" on every link.** All individually banned (§3, §G1/G3 in MASTER_PROMPT.md): sentence case everywhere, facts separated by space not middle dots, no em/en dashes anywhere in copy, no monospace, no appended arrows. Clear miss.

### Impeccable's tells

- **Inter everywhere.** We use Libre Franklin + Atkinson Hyperlegible Next; Inter is explicitly banned (§G1.11 of MASTER_PROMPT.md). Clear miss.
- **Purple-to-blue gradients.** No purple/indigo/violet/lavender/blue anywhere, no gradients except the thread's own stroke. Clear miss.
- **Cards nested in cards.** Our depth system (§4) has exactly one card type (the paper product card) at one nesting level; sections and bands use flat fills or hairlines, never a card-inside-a-card. Clear miss.
- **Gray text on colored backgrounds.** Our only colored background is `ink` (final CTA band) and `mist` (bands/footer); text on `ink` uses `ink-on-dark` at 10.4:1, text on `mist` uses standard `ink`/`ink-2` — no gray-on-color combination exists. Clear miss.
- **Icon tiles above headings.** Icons are inline, 20px, `currentColor`, never in a rounded-square tile except the favicon, and never stacked above every heading (§5). Clear miss.
- **Bounce easing.** Motion tokens are `--ease-out` and `--ease-in-out` only; springs are reserved for interruptible indicators and explicitly set `bounce: 0`. Clear miss.

Every row above is a clean miss, not a near-miss requiring a workaround — the design was chosen specifically to sit outside all eleven clusters at once, confirmed against what competitors are actually shipping today (`docs/design/REFERENCE_NOTES.md`).

## 9. Contrast ledger

Every text/background pair actually used on the site, with its ratio computed directly from sRGB relative luminance per the WCAG 2.x formula (not copied from the brief — independently verified; see `docs/website/DECISIONS.md`). AA requires 4.5:1 for body text, 3:1 for large text (≥24px, or ≥19px bold) and non-text UI boundaries.

| Foreground | Background | Ratio | Use | Passes |
|---|---|---|---|---|
| `ink` #13251D | `paper` #FFFFFF | 16.03:1 | Headings, body text | AA (body + large) |
| `ink-2` #3D5249 | `paper` #FFFFFF | 8.39:1 | Lead paragraphs, secondary text | AA (body + large) |
| `ink-3` #5C6F66 | `paper` #FFFFFF | 5.36:1 | Meta text, captions (13px min) | AA (body + large) |
| `ink` #13251D | `gold` #F5B000 | 8.47:1 | Primary button text | AA (body + large) |
| `gold-edge` #A87700 | `paper` #FFFFFF | 3.96:1 | Star outlines, button edge (non-text) | AA (non-text 3:1) |
| `ink` #13251D | `gold-hover` #E5A400 | 7.36:1 | Primary button text, hover | AA (body + large) |
| `meadow` #2E6A4F | `paper` #FFFFFF | 6.38:1 | Links, check marks | AA (body + large) |
| `brick` #B3452F | `paper` #FFFFFF | 5.51:1 | Low-star ratings, error text | AA (body + large) |
| `ink-on-dark` #C9D6CF | `ink` #13251D | 10.69:1 | Secondary text on the final CTA band | AA (body + large) |
| `ink` #13251D | `mist` #EEF4F0 | 14.38:1 | Headings/body inside bands and footer | AA (body + large) |

No text is ever set in `gold` on `paper` (1.89:1 — fails AA; this is why gold is reserved for fills, stars, and the thread, never for text on white).

## 10. Self-checks

The G5 self-checks (squint test, five-second test, swap test, remove-one-accessory test) are run per page during Phase 7 and logged with results in `docs/website/CRITIQUE_LOG.md`, not here — this file is the system, that file is the evidence it was applied.
