---
name: buzra-brand
description: Use for any UI, styling, animation, or copy work in the BuzraReviews repo. Holds the locked Main Street Gold design system, voice rules, and banned patterns.
---

# BuzraReviews brand: Main Street Gold

Full spec lives in `DESIGN.md` at the repo root. This file is the quick-reference version for day-to-day UI and copy work. When this file and `DESIGN.md` disagree, `DESIGN.md` wins (it's the source of truth; this file is a summary).

## Concept

A well-kept storefront on a small-town main street, plus the universal sign of a good review: the gold star. White like clean shop glass. Pine ink like the forested ridges above Bozeman. Gold like a five-star rating and a sign-painter's gold leaf. Headlines in Libre Franklin (a Franklin Gothic revival, the workhorse of newspapers and storefront signage). Body text in Atkinson Hyperlegible Next (Braille Institute legibility face), because owners read this on a phone between clients.

Principles:
1. The customer's words are the hero. Reviews and replies appear as real, readable text at real size, never as tiny decorative UI.
2. Spend boldness in one place: the hero Review Loop demo. Everything else is quiet, well spaced, and plain.
3. Gold is earned. Gold appears only on stars, the primary button, and the thread. Never as a background wash, never as text on white.
4. Say the price early. "$29 a month" appears in the first viewport, desktop and mobile.
5. Local and human. A real founder, a real town, real photos (or no photos — never placeholders).

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FFFFFF` | Page background, cards |
| `ink` | `#13251D` | Headings, body text, dark UI |
| `ink-2` | `#3D5249` | Secondary text, lead paragraphs |
| `ink-3` | `#5C6F66` | Meta text, captions (13px min) |
| `gold` | `#F5B000` | Primary button fill, star fill, the thread. Never text on white. |
| `gold-hover` | `#E5A400` | Primary button hover |
| `gold-edge` | `#A87700` | Star outlines, 1px primary button edge |
| `gold-wash` | `#FFF4D6` | Selected chip bg, "Copied" confirmation bg |
| `meadow` | `#2E6A4F` | Links, check marks, success states |
| `mist` | `#EEF4F0` | Bands, footer background |
| `line` | `#DCE5DF` | Hairlines, card borders |
| `brick` | `#B3452F` | Low-star ratings, error text |
| `ink-on-dark` | `#C9D6CF` | Secondary text on the ink band |

Light theme only. No purple, indigo, violet, lavender, or blue anywhere. No gradients except the thread's own stroke if needed.

## Type

Libre Franklin (headlines, 600/700/800) + Atkinson Hyperlegible Next (body, 400/500/700). Two families only. Sentence case everywhere — no all-caps labels, no letter-spaced eyebrows, no gradient text, no monospace, no italic/bold/colored single-word emphasis in headlines.

## Layout and depth

Left-aligned everywhere except the centered final CTA band. Radius hierarchy: 6px chips, 10px buttons/inputs, 14px the hero search field, 16px product cards, 24px large panels. Product cards are hairline-bordered "paper cards" with a blur-free bottom edge — never pair a hairline border with a soft blurred shadow (a generated-UI tell).

## Motion

Library: `motion` (import from `motion/react`), client islands only. Tokens: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for entrances/UI responses, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement. Durations: press 140ms, UI 200ms, reveal 260ms. Only two things get animated: the hero Review Loop choreography (once on load, replays on user action) and direct responses to the visitor's own actions. No scroll-triggered fade-ups, no parallax, no looping animation, no overshoot/bounce easing. Always respect `prefers-reduced-motion`.

## Hard bans (see PART G in `docs/website/MASTER_PROMPT.md` for the full list)

- No purple/indigo/violet/lavender/blue, no dark theme, no gradients/glows/noise/glassmorphism.
- No bento grids, no icon tiles, no identical shadow-stamped cards, no floating chips/badges, no logo walls/testimonials/stats bands about BuzraReviews, no stock photos or AI-generated people, no emoji.
- No all-caps eyebrows, middle-dot meta strings, monospace, arrows appended to links, centered hero.
- Copy: no em dash (—) or en dash (–) anywhere, ever. No hype words (revolutionize, seamless, unlock, game-changer, AI-powered, etc. — full list in G3). No exclamation marks except inside demo emails/replies that mirror real product text.
- Every demo business/reviewer is fictional and tagged "Example." Never claim anything outside `docs/website/CLAIMS.md`.

## Pointers

- Full design system, component list, motion choreography table: `DESIGN.md`
- Full build spec, product truth, claims table, copy bank: `docs/website/MASTER_PROMPT.md`
- Product one-pager: `PRODUCT.md`
