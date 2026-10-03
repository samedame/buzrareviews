import { Container } from "@/components/ui/Container";
import type { ReactNode } from "react";

export function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <div className="max-w-[68ch]">
          <h1 className="text-hero text-ink">{title}</h1>
          <p className="text-small text-ink-3 mt-3">Last updated {lastUpdated}</p>
          <div className="mt-10 flex flex-col gap-8">{children}</div>
        </div>
      </Container>
    </section>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-h3 text-ink">{heading}</h2>
      <div className="text-body text-ink-2 mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}
