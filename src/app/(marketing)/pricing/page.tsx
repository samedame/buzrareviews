import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Faq } from "@/components/ui/Faq";
import { PlanCard } from "@/components/marketing/PlanCard";
import { FinalCta } from "@/components/marketing/FinalCta";
import { PLAN_INCLUDED_DETAILED, PLAN_NOT_INCLUDED } from "@/content/home";
import { getFaqItems, PRICING_FAQ_ORDER } from "@/content/faq";
import { pageMetadata } from "@/config/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Pricing: $29 a month, no contract",
  description:
    "One plan with a 14-day free trial: review request emails, a daily Google review check, and drafted replies in your tone. Cancel anytime.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <section aria-labelledby="pricing-hero-heading" className="py-10 sm:py-16">
        <Container>
          <h1 id="pricing-hero-heading" className="text-hero text-ink max-w-[16ch]">
            One plan. $29 a month.
          </h1>
          <p className="text-lead text-ink-2 mt-6">No tiers, no contract, no sales call. Try it free for 14 days.</p>
          <div className="mt-10 max-w-md">
            <PlanCard location="pricing_page" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="whats-included-heading" className="py-16 sm:py-24">
        <Container>
          <h2 id="whats-included-heading" className="text-h2 text-ink">
            What&apos;s included
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {PLAN_INCLUDED_DETAILED.map((item) => (
              <div key={item.title}>
                <h3 className="text-h3 text-ink">{item.title}</h3>
                <p className="text-body text-ink-2 mt-2">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="not-included-heading" className="bg-mist py-16 sm:py-24">
        <Container>
          <h2 id="not-included-heading" className="text-h2 text-ink">
            What you won&apos;t pay for
          </h2>
          <ul className="mt-8 flex flex-col gap-3">
            {PLAN_NOT_INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-body text-ink-2">
                <Icon name="close" size={18} className="mt-0.5 shrink-0 text-ink-3" />
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="pricing-faq-heading" className="py-16 sm:py-24">
        <Container>
          <h2 id="pricing-faq-heading" className="text-h2 text-ink">
            Questions owners ask
          </h2>
          <div className="mt-10">
            <Faq items={getFaqItems(PRICING_FAQ_ORDER)} />
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
