import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { pageMetadata } from "@/config/metadata";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "@/app/layout";
import { PlanCard } from "@/components/marketing/PlanCard";
import { FounderNote } from "@/components/marketing/FounderNote";
import { Hero } from "@/components/marketing/Hero";
import { FactsBand } from "@/components/marketing/FactsBand";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WhyItMatters } from "@/components/marketing/WhyItMatters";
import { ToneDemo } from "@/components/marketing/ToneDemo";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Faq } from "@/components/ui/Faq";
import { getFaqItems, HOME_FAQ_ORDER } from "@/content/faq";

export const metadata: Metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FactsBand />
      <HowItWorks />
      <WhyItMatters />

      <section aria-labelledby="tone-heading" className="py-16 sm:py-28">
        <Container>
          <h2 id="tone-heading" className="text-h2 text-ink">
            Replies that sound like you wrote them.
          </h2>
          <p className="text-lead text-ink-2 mt-4">
            Pick a tone, or describe your own in plain words. Every draft is written for that specific review.
            Drafted by AI, approved by you.
          </p>
          <div className="mt-10">
            <ToneDemo />
          </div>
          <p className="text-body text-ink-2 mt-8 max-w-[68ch]">
            Your own words work too. For example: &quot;Warm and short. Mention the stylist by name when the
            review does.&quot;
          </p>
        </Container>
      </section>

      <section aria-labelledby="pricing-heading" className="py-16 sm:py-28">
        <Container>
          <h2 id="pricing-heading" className="text-h2 text-ink">
            One plan. $29 a month.
          </h2>
          <p className="text-lead text-ink-2 mt-4">Everything BuzraReviews does, for one flat price.</p>
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
            <PlanCard location="home_pricing" />
            <div className="max-w-[58ch]">
              <p className="text-body text-ink-2">
                Many review platforms charge hundreds of dollars a month and ask for an annual contract. A
                business with one front door should pay a one-front-door price.
              </p>
              <Link href="/pricing" className="mt-4 inline-block text-small text-meadow underline underline-offset-[3px]">
                See pricing details
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="founder-heading" className="py-16 sm:py-28">
        <Container>
          <h2 id="founder-heading" className="text-h2 text-ink">
            Built by Sam, in Bozeman.
          </h2>
          <div className="mt-10">
            <FounderNote />
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-heading" className="py-16 sm:py-28">
        <Container>
          <h2 id="faq-heading" className="text-h2 text-ink">
            Questions owners ask
          </h2>
          <div className="mt-10">
            <Faq items={getFaqItems(HOME_FAQ_ORDER)} />
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
