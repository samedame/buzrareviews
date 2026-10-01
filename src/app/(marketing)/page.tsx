import { Container } from "@/components/ui/Container";

// Full section-by-section build (hero demo, facts band, how it works, why
// it matters, tone, pricing, founder, FAQ, final CTA) lands in Phase 4 per
// MASTER_PROMPT.md F2. This is the Phase 3 foundation stub: just enough
// real copy to prove the layout, fonts, and tokens render correctly.
export default function HomePage() {
  return (
    <section className="py-18 sm:py-28" aria-labelledby="hero-heading">
      <Container>
        <p className="text-small text-ink-2 max-w-[48ch]">
          For salons, dental offices, restaurants, and every shop with one front door.
        </p>
        <h1 id="hero-heading" className="text-hero text-ink mt-4 max-w-[18ch]">
          Ask every customer. Answer every review.
        </h1>
        <p className="text-lead mt-6">
          Add a customer after their visit and BuzraReviews emails them a friendly review
          request from your business. Every day, it checks Google for new reviews and drafts a
          reply to each one in your voice. $29 a month. No contract.
        </p>
      </Container>
    </section>
  );
}
