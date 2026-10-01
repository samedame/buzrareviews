import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/marketing/ContactForm";
import { BusinessSearchForm } from "@/components/marketing/BusinessSearchForm";
import { site } from "@/config/site";
import { BOZEMAN_VISIT_STEPS } from "@/content/bozeman";

export const metadata: Metadata = {
  title: "In-person setup in Bozeman",
  description: "Bozeman business? Sam will set up BuzraReviews with you in person, in about 20 minutes.",
  alternates: { canonical: "/bozeman" },
};

export default function BozemanPage() {
  return (
    <>
      <section aria-labelledby="bozeman-hero-heading" className="py-10 sm:py-16">
        <Container>
          <div className={`grid gap-10 ${site.mainStreetPhoto ? "lg:grid-cols-[1.4fr_1fr] lg:items-start" : ""}`}>
            <div>
              <h1 id="bozeman-hero-heading" className="text-hero text-ink max-w-[22ch]">
                Bozeman business? I&apos;ll set it up with you, in person.
              </h1>
              <p className="text-lead text-ink-2 mt-6">
                I&apos;m Sam, and I build BuzraReviews. If your business is in or around Bozeman, I&apos;ll come
                to you and get everything running with you. There&apos;s no charge for the visit.
              </p>

              <h2 className="text-h3 text-ink mt-10">What we&apos;ll do in about 20 minutes</h2>
              <ol className="mt-4 flex flex-col gap-3">
                {BOZEMAN_VISIT_STEPS.map((step) => (
                  <li key={step.number} className="flex gap-3 text-body text-ink-2">
                    <span className="text-ink-3">{step.number}</span>
                    {step.title}
                  </li>
                ))}
              </ol>
            </div>

            {site.mainStreetPhoto && (
              <div className="aspect-[3/2] overflow-hidden rounded-[var(--radius-card)]">
                <Image
                  src={site.mainStreetPhoto}
                  alt="Main Street, Bozeman, Montana"
                  width={720}
                  height={480}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </Container>
      </section>

      <section aria-labelledby="bozeman-form-heading" className="bg-mist py-16 sm:py-24">
        <Container className="max-w-xl">
          <h2 id="bozeman-form-heading" className="text-h2 text-ink">
            Ask Sam for a visit
          </h2>
          <div className="mt-8">
            <ContactForm />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} className="text-small text-meadow underline underline-offset-[3px]">
                Prefer email?
              </a>
            )}
            {site.bookingUrl && (
              <a
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small text-meadow underline underline-offset-[3px]"
              >
                Pick a time
              </a>
            )}
          </div>
        </Container>
      </section>

      <section aria-labelledby="bozeman-diy-heading" className="py-16 sm:py-24">
        <Container>
          <h2 id="bozeman-diy-heading" className="text-h2 text-ink">
            Rather do it yourself?
          </h2>
          <div className="mt-8 max-w-xl">
            <BusinessSearchForm id="bozeman-search" />
          </div>
        </Container>
      </section>
    </>
  );
}
