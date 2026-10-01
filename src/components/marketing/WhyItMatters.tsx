import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { WHY_IT_MATTERS_STATS, BRIGHTLOCAL_SOURCE } from "@/content/home";

// Highlights the leading percentage in a stat sentence as a large inline
// numeral (DESIGN.md: "a large sentence with the number inline"), without
// restructuring the approved sentence text itself.
function StatSentence({ text }: { text: string }) {
  const match = text.match(/\d+%/);
  if (!match || match.index === undefined) {
    return <p className="text-h3 text-ink">{text}</p>;
  }
  const before = text.slice(0, match.index);
  const number = match[0];
  const after = text.slice(match.index + number.length);
  return (
    <p className="text-h3 text-ink">
      {before}
      <span className="text-h2 tabular-nums">{number}</span>
      {after}
    </p>
  );
}

export function WhyItMatters() {
  return (
    <section aria-labelledby="why-it-matters-heading" className="py-16 sm:py-28">
      <Container>
        <h2 id="why-it-matters-heading" className="text-h2 text-ink">
          Your reviews are the new front window.
        </h2>
        <p className="text-lead text-ink-2 mt-4">
          Before anyone walks in, they read what your customers said. Here&apos;s what BrightLocal&apos;s 2026
          survey of consumers found.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {WHY_IT_MATTERS_STATS.map((item) => (
            <div key={item.stat} className="max-w-[58ch]">
              <StatSentence text={item.stat} />
              <p className="text-body text-ink-2 mt-2">{item.answer}</p>
            </div>
          ))}
        </div>

        <a
          href={BRIGHTLOCAL_SOURCE.href}
          className="mt-8 inline-flex items-center gap-1 text-small text-meadow underline underline-offset-[3px]"
        >
          {BRIGHTLOCAL_SOURCE.label}
          <Icon name="external-link" size={14} />
        </a>
      </Container>
    </section>
  );
}
