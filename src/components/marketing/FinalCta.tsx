import { Container } from "@/components/ui/Container";
import { BusinessSearchForm } from "@/components/marketing/BusinessSearchForm";
import { Icon } from "@/components/ui/Icon";
import { FACTS_ROW } from "@/content/home";

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-heading" className="bg-ink py-16 sm:py-24">
      <Container className="text-center">
        <h2 id="final-cta-heading" className="text-h2 text-paper">
          Start with your business name.
        </h2>
        <p className="text-lead text-ink-on-dark mx-auto mt-4">
          Setup takes a few minutes. Your first review request can go out today.
        </p>
        <div className="mx-auto mt-8 max-w-xl text-left">
          <BusinessSearchForm id="final-cta-search" variant="dark" location="final" />
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {FACTS_ROW.map((fact) => (
            <li key={fact} className="flex items-center gap-2 text-small text-ink-on-dark">
              <Icon name="check" size={16} />
              {fact}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
