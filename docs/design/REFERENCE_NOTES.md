# Reference notes

Screenshots captured 2026-09-30 via `qa/capture-references.mjs` (1440x900 desktop, 390x844 mobile, scroll positions 0/900/1800; four sites also captured as an 8-frame, 400ms burst to see entrance choreography). Screenshots live in `docs/design/references/` (gitignored). Nothing below was copied from any site — these are notes on patterns, named concretely, for Phase 2 to react to.

Several sites have visibly changed since PART D of `docs/website/MASTER_PROMPT.md` was drafted. Where that's true, this file says so and goes with what's on screen now.

## Conversion references for this exact audience

### owner.com

**Borrow**
- The entire hero is one system: a small proof line, a huge headline, then a single input + button ("Find your restaurant name" / "Get my AI report") as the only hero CTA — no secondary button competing for attention.
- Below the fold, real owner headshots with their actual restaurant context in frame (not studio portraits) under the heading "Grow sales like these owners" — specific and human, not stock.
- The /pricing page states two plans with huge tabular numerals ($249/$499 per month) directly under one-line plan descriptions — price is the loudest thing on the page, no "contact us for pricing."

**Avoid**
- "4.8 ★★★★★ across 1,000+ reviews" sits directly above the H1 — a rating line for themselves, which BuzraReviews cannot do (no public customer data).
- Green gradient color-blocks flank the phone mockup purely as a decorative shape — not read as data or UI, pure color panels.
- The phone mockup content is "You're losing $450 a month in sales until you fix these issues" — a scare-framed, invented-sounding stat generator; the generic "AI report" conceit doesn't fit BuzraReviews' honest-mechanism stance.

### glossgenius

Changed since D2: the hero is no longer a calm rounded product panel below the fold — it's now a full-bleed lifestyle photo with the headline overlaid directly on the image, and the below-fold section is an AI chat composer ("Hi Norma, what do you want to learn today?") with suggestion chips, not a scheduling calendar.

**Borrow**
- The headline itself is a short, declarative double sentence rhythm: "Scheduling, payments, and admin. Handled." — period-separated short clauses, not one long sentence.
- Real environment photography (plant, warm window light, a hand holding a phone) reads as an actual salon, not a stock backdrop — proves photography can be the hero visual without being generic.

**Avoid**
- Letter-spaced all-caps wordmark ("G L O S S G E N I U S") — explicitly banned for us.
- Two pill CTAs in different fills (solid chartreuse "Start free trial" vs. outlined "Demo for teams") sitting side by side reads as indecisive about the primary action.
- The product panel below is now framed as an AI chat agent with free-text suggestion chips ("3 new revenue opportunities →") — this is the "AI as the product" framing we're avoiding; our product moment is the review loop itself, not a chatbot.

### visiblefeedback (direct competitor)

**Borrow**
- Price and trial length stated in the header itself ("Try Free For 14 Days") before any scrolling — the trial length should be this visible.

**Avoid**
- Headline "Stop small issues from becoming big problems" and bullet "Recover unhappy customers before they cancel" is exactly the review-gating language Google's policy and our own rules ban — a clean negative example to point to.
- An uncited stat sits directly under the bullet list: "Businesses with 4+ star ratings earn 32% more revenue." — no source link anywhere near it. This is the uncited-number failure mode CLAIMS.md exists to prevent.
- Two competing CTA colors on one screen (orange "Try Free For 14 Days" in the header, green "Send Your First Follow Up" in the hero).
- A 5-emoji satisfaction survey ("☹️ 🙁 😐 🙂 😊") is the literal in-product screenshot shown — reads as exactly the kind of pre-filter/sentiment-gate Google prohibits.

## Craft references

### stripe / stripe.com/payments

**Borrow**
- Dotted hairline vertical guide lines run down the page at the container edges on the /payments page, used purely to organize the grid — never decorative on their own.
- Product UI (a checkout form, a card-present terminal, a subscription confirmation modal) is built as real HTML at believable scale with real-looking data (`jane.diaz@stripe.com`, "$1,400/year", "Electric Kettle with Temperature Control $150.00") — not a cropped screenshot.
- The H1 and lead are both already fully legible in the very first burst frame (0ms) — no entrance delay on the content that matters for reading, confirming the "protect LCP" approach is right.

**Avoid**
- A large diagonal rainbow-gradient ribbon fills roughly 40% of the hero on both pages — exactly the gradient-as-hero-decoration pattern we're banning.
- A live-ticking counter ("Global GDP running on Stripe: 1.72457048% → 1.72457050%") visibly increments between burst frames — a count-up/ticker effect, banned for us.
- A customer logo wall directly under the hero (Amazon, Nvidia, Ford, Coinbase, Google, Shopify, Mindbody) and a persistent "9 sales reps available / Chat now" floating widget on every screenshot.

### attio

Changed since D2: the hero is now centered (with a black announcement bar above it — "Orchestrate revenue agents with Workflows"), not the asymmetric layout implied by the general reference list. This makes attio a case *for* the "avoid centered hero + announcement bar" rule rather than purely a positive example.

**Borrow**
- The product window (macOS-style traffic-light chrome, realistic sidebar + content) shows a live, specific interaction: a composer with the typed question "How do I win my deal with GreenLeaf?" that transitions to a "Thinking" state and then a real written answer across the burst frames — a believable single interaction, not a static screenshot.
- Mobile hero swaps the two buttons for a single inline "Your email address" + "Send me a demo" field — a clean mobile-specific CTA simplification worth noting even though our CTA differs.

**Avoid**
- Centered hero template and a dismissible black announcement bar — both already banned for us, and seeing them in the wild as the current live state is a useful "even craft-forward products do this, we still won't" data point.
- A persistent circular chat-launcher icon bottom-right on every screenshot.

### granola

**Borrow**
- True asymmetric hero: text block pinned left, a layered product-window stack pinned right, with real specific note content ("Q3 GTM sync," "Jack flagged deals stalling at business case stage," "Agreed to narrow Q3 focus to mid-market finance and ops buyers") — concrete, specific, believable text instead of lorem-ipsum-feeling placeholder copy.
- Across the burst frames the note visibly fills in and an "Enhancing notes" status with a small spinner appears — a modest, legible progress state rather than a flashy reveal.

**Avoid**
- Headline is set in an italic-leaning serif display face ("The AI notepad for back-to-back meetings") — conflicts with our two-sans-family rule and reads overly editorial for our audience.
- Olive/chartreuse "New" pill and matching solid CTA pill.
- A floating video-call tile with real-looking stock-feeling faces sits over the product window — close to the "no stock/illustrated people" line even though it's meant to represent a live meeting.

### linear

Changed since D2: the hero text ("The product development system for teams and agents") and the product panel beneath it are both fully rendered in the very first burst frame — the hero is not blank at 3 seconds the way D2 describes. That specific claim is outdated; linear's current build protects first paint on the headline just as aggressively as Stripe does.

**Borrow**
- Confirmed: generous, exact spacing and a single consistent corner radius across the whole product panel reads as calm and precise even on a dark background — the restraint principle holds regardless of palette.
- Content density inside the product mock is realistic (issue IDs like "DRV-8852," real relative timestamps "2min ago," labeled activity log entries) rather than placeholder-looking.

**Avoid**
- Full dark theme (near-black background) — banned for us outright.
- By the later burst frames, a floating AI agent chat panel ("Linear — Opus 5," a prompt box, "Worked for 10 sec") pops in over the product mock — another instance of the floating-assistant-widget pattern to avoid.

### resend

**Borrow**
- Headline is exactly four words ("Email for developers") in a large serif, immediately legible, with a two-sentence plain description underneath — proves brevity reads as confidence.

**Avoid**
- Full dark theme.
- A rotating 3D isometric cube render sits to the right of the headline as pure decoration — the literal "3D object" ban.

### mercury

Changed since D2: this is no longer a plain centered headline on a flat background. The current hero is a full-bleed, soft-focus, slightly surreal landscape photograph (a desk and office chair placed on a foggy hillside) with white text and an announcement bar on top — the image reads as AI-generated or heavily composited, which is exactly the "AI-looking imagery" D2 already told us to avoid, just more clearly on display now than before.

**Borrow**
- Still true: the primary CTA is an inline "Enter your email" field directly beside a solid "Open account" button, with a lower-emphasis "Launch demo" pill beside it — a legible primary/secondary CTA pairing worth the pattern even though our form differs (business name, not email, and only one CTA).

**Avoid**
- The hero visual itself (confirms and sharpens D2): a dreamlike, slightly-off photographic scene is a strong "an AI made this" tell. We render zero decorative photography in the hero; our only visual there is the Review Loop demo.
- A disclosure/compliance strip is pinned at the very bottom of the hero in a dark rounded bar — not a pattern we need, but a reminder that financial/compliance footers exist outside our scope.

## Competitors (to differ from, never to copy)

### truereview

- Purple gradient announcement bar at the very top ("Free Review Radar™ audit... Get My Free Audit").
- Dark hero with a bold magenta single-word accent ("Feedback") carrying a live typing cursor (`|`) after it — the literal typewriter-headline pattern.
- A self-referential rating badge above the H1: "★★★★★ 5.0 rating based on 500+ reviews" with a Google "G" icon — exactly the kind of claim about themselves (not their customers) that's banned.
- Dashboard screenshot stacked with purple stat tiles (2,394 total reviews, 17,546 requests sent, 97% positive experience) plus a floating review-notification card and a large pink circular video-play button overlapping the product shot.
- Two CTAs in different fills (green "Start My Free Trial" vs. outline "Book a Demo") plus a floating two-person avatar stack next to the second button.

### nicejob

- Large italic-serif second headline clause ("*Start attracting them instead.*") — single clause styled in italic for emphasis, directly banned.
- Self-rating badges inline under the CTAs: "4.9 ★★★★★ from 4,000+ reviews," plus "4.9 Google" and "4.8 G2" badges with real third-party logos.
- A dark purple stats band immediately below the fold: "Trusted by thousands of service-based businesses. 2M+ reviews enabled / 20% repeat service rate / 50K+ businesses served" — the exact "2M+ reviews enabled" stats-band pattern D2 called out, confirmed verbatim on the current site.
- Indigo/purple palette throughout; persistent circular chat launcher bottom-right.

### getreviewloop

- Entire background is a saturated indigo/purple with faint looping line-art behind the content.
- Headline overclaims automation: "Turn every customer visit into real reviews, repeat visits, and higher sales — automatically."
- Product shot is crowded with simultaneous stat tiles (a dollar figure "$7045.58 Monthly Revenue +95%", a 4-up metrics row, a bar chart, a review list) plus two floating star-rating chat-bubble chips (purple and orange, each with a smiley + 5 stars) orbiting the top-right corner of the screenshot — the literal "floating UI chips orbiting" pattern.

### podium

- Full dark/black theme with a glowing white pill CTA.
- A literal terminal-style typing-cursor status chip sits above the H1: "[COMPILING...]" with a blinking-style caret icon.
- Headline leads with "AI" as the product itself: "The #1 converting AI Employee for local businesses."
- A full customer logo wall directly under the hero: "60,000+ businesses trust Podium" with Audi, BMW, Ford, Goldfish Swim School, Glendale Heating & Air, Hyundai.
- Top announcement bar with a cartoon mascot avatar and a podcast cross-promotion ("Meet Operator: Now on Car Dealership Guy").

### birdeye

- Full-bleed lifestyle stock photograph (a mother and child on a couch looking at a phone) as the entire hero background — real-feeling but clearly staged/stock people, which we ban outright.
- A floating AI-chat-result UI card is overlaid on top of the photo (a question bubble, an answer with two business results, ratings, and a small embedded map) — assistant-chip-over-photo composition.
- Positioning is explicitly multi-location ("AI Coworkers for Multi-location Brands") — a useful contrast point since BuzraReviews is explicitly single-location only.

### getweave

- Light lavender/purple gradient background fills the whole hero.
- Headline uses a bold italic single-word accent for the first word: "*Supercharge* your practice growth." — this is both the italic-accent pattern and literally the word "supercharge," one of our hard-banned words, in the wild.
- Multiple floating UI chips orbit the headline simultaneously: a "Calls" pill, a "Texts" pill, a circular "200 Total Appts" donut-chart chip, a schedule-request toast, and an "AI Receptionist" chat bubble ("Hi! I'm Sam, your AI Receptionist...") — five separate floating elements around one headline.
- Blue CTA buttons; a second announcement bar below the nav for a pricing promotion ("AI Receptionist early access... Lock in 25% off").

### joinblvd (Boulevard)

- Grayscale, editorial-fashion-style photograph of a model as the entire right half of the hero — stock/influencer photography, banned for us.
- Black announcement bar promoting "Beau, your new AI Receptionist" — the third competitor in this list (with Weave and Podium) now centering an "AI employee/receptionist" product conceit, a sharper and more current read than D2's general "AI as the headline" note.
- Several floating UI cards (an appointment-time picker, a "Booked appointments: 1107" stat, a loyalty-points chip) scattered directly over the photograph with no connecting structure between them.
- Inline work-email capture field + "GET A DEMO" button as the primary CTA, no price visible anywhere above the fold.

## Motion and craft reading

- **emilkowal.ski, "You don't need animations"**: the core argument is that animation should be judged by how often a user will see it — high-frequency, repeated interactions (especially keyboard-driven ones) are actively hurt by added motion, because repetition turns "delightful" into "slow and disconnected." UI responses should generally stay under 300ms, and for some interactions the right answer is no animation at all. This directly backs the MASTER_PROMPT.md E7 rule that only the one-time hero choreography and direct user-action feedback get to animate — everything else is deliberately still.
- **vercel.com/design/guidelines**: reinforces several rules already locked in PART E — keyboard-operable flows with visible `:focus-visible` rings and 44px minimum touch targets, motion restricted to `transform`/`opacity` with `prefers-reduced-motion` always honored, optical (not just geometric) alignment, designing every state (empty/sparse/dense/error) rather than just the happy path, and tabular numerals for any numbers meant to be compared at a glance (which is exactly how BuzraReviews' price and stat numerals are already specified).

## Default AI SaaS page

Across the eighteen sites captured, the pattern a generic agent reaches for for "review management software" is now unmistakable, and it is consistent across every single competitor screenshotted: a saturated purple-to-indigo (or full black) background; an announcement bar pinned above the nav promoting an unrelated feature or podcast; a centered or crowded hero that leads with the word "AI" rather than the actual mechanism of the product; a self-referential rating badge or stat band quoting the company's own numbers ("2M+ reviews enabled," "60,000+ businesses trust us," "4.9 from 4,000+ reviews"); two or more competing CTA buttons in different fills, often paired with a floating avatar stack or chat-launcher icon; a product screenshot crowded with simultaneous metric tiles, bar charts, and dollar figures all fighting for attention, frequently decorated with floating star-rating or smiley-face chips orbiting the frame; a typing-cursor or "[COMPILING...]"-style status chip standing in for genuine product proof; a single bold italic or color-accented word inside the headline for false emphasis; a full customer logo wall; and, increasingly in late 2026, the entire product reframed as an anthropomorphized "AI Employee" or "AI Receptionist" rather than a tool the owner stays in control of. BuzraReviews differs from every one of these defaults by design: a warm off-white and pine-ink palette with gold used only where it's earned, no announcement bar, a left-aligned hero that leads with the plain mechanism ("ask every customer, answer every review") and the real price, zero claims about BuzraReviews' own numbers, one CTA color, a single calm product demo (the Review Loop) shown at honest scale with an "Example" tag instead of a crowded metrics dashboard, no floating chips or chat widgets, sentence-case headlines with no italic or color accents, and a named founder instead of an AI mascot.
