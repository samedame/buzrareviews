import { Container } from "@/components/ui/Container";
import { Faq } from "@/components/ui/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { VerticalHero } from "@/components/marketing/VerticalHero";
import { getFaqItems } from "@/content/faq";
import { SLUG_TO_DEMO_ID, type VerticalPageContent } from "@/content/verticals";

export function VerticalPageTemplate({ content }: { content: VerticalPageContent }) {
  return (
    <>
      <VerticalHero
        vertical={SLUG_TO_DEMO_ID[content.slug]}
        searchId={`${content.slug}-search`}
        h1={content.h1}
        lead={content.lead}
      />

      <section aria-labelledby="vertical-points-heading" className="py-16 sm:py-24">
        <Container>
          <h2 id="vertical-points-heading" className="sr-only">
            Why it works for {content.navLabel.toLowerCase()}
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {content.points.map((point) => (
              <div key={point.title}>
                <h3 className="text-h3 text-ink">{point.title}</h3>
                <p className="text-body text-ink-2 mt-2">{point.body}</p>
              </div>
            ))}
          </div>
          <p className="text-small text-ink-3 mt-10 max-w-[68ch]">{content.note}</p>
        </Container>
      </section>

      <section aria-labelledby="vertical-faq-heading" className="py-16 sm:py-24">
        <Container>
          <h2 id="vertical-faq-heading" className="text-h2 text-ink">
            Questions owners ask
          </h2>
          <div className="mt-10">
            <Faq items={getFaqItems(content.faqIds)} />
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
