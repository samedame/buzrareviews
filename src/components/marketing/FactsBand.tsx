import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { FACTS_BAND } from "@/content/home";

function Fact({ bold, rest, href }: { bold: string; rest: string; href?: string }) {
  const text = (
    <p className="text-small">
      <span className="font-semibold text-ink">{bold}</span>{" "}
      <span className={href ? "text-meadow underline underline-offset-[3px]" : "text-ink-2"}>{rest}</span>
    </p>
  );
  return href ? <Link href={href}>{text}</Link> : text;
}

export function FactsBand() {
  return (
    <section aria-labelledby="facts-band-heading" className="bg-mist py-10 sm:py-14">
      <h2 id="facts-band-heading" className="sr-only">
        Why owners pick BuzraReviews
      </h2>
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {FACTS_BAND.map((fact) => (
            <Fact key={fact.bold} {...fact} />
          ))}
        </div>
      </Container>
    </section>
  );
}
