import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/marketing/ContactForm";
import { BusinessSearchForm } from "@/components/marketing/BusinessSearchForm";
import { site } from "@/config/site";
import { SETUP_VISIT_STEPS } from "@/content/setup";
import { pageMetadata } from "@/config/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Setup help from Sam",
  description: site.inPersonInBozeman
    ? "Need a hand? Sam will set up BuzraReviews with you on a call, or in person in Bozeman, in about 20 minutes."
    : "Need a hand? Sam will set up BuzraReviews with you on a call, in about 20 minutes.",
  path: "/setup",
});

export default function SetupPage() {
  return (
    <>
      <section aria-labelledby="setup-hero-heading" className="py-10 sm:py-16">
        <Container>
          <div className={`grid gap-10 ${site.mainStreetPhoto ? "lg:grid-cols-[1.4fr_1fr] lg:items-start" : ""}`}>
            <div>
              <h1 id="setup-hero-heading" className="text-hero text-ink max-w-[22ch]">
                Need a hand getting set up? I&apos;ll do it with you.
              </h1>
              <p className="text-lead text-ink-2 mt-6">
                {site.inPersonInBozeman
                  ? "I'm Sam, and I build BuzraReviews. Wherever your business is, I'll get on a call and walk through the whole setup with you. If you're in or around Bozeman, I'll come by in person. There's no charge either way."
                  : "I'm Sam, and I build BuzraReviews. Wherever your business is, I'll get on a call and walk through the whole setup with you. There's no charge."}
              </p>

              <div className={`mt-10 grid gap-6 ${site.inPersonInBozeman ? "sm:grid-cols-2" : ""}`}>
                <div>
                  <h2 className="text-h3 text-ink">On a call, anywhere.</h2>
                  <p className="text-body text-ink-2 mt-2">Video or phone, whichever is easier. About 20 minutes.</p>
                </div>
                {site.inPersonInBozeman && (
                  <div>
                    <h2 className="text-h3 text-ink">In person, in Bozeman.</h2>
                    <p className="text-body text-ink-2 mt-2">I&apos;ll come to your business and we&apos;ll set it up together.</p>
                  </div>
                )}
              </div>

              <h2 className="text-h3 text-ink mt-10">What we&apos;ll do in about 20 minutes</h2>
              <ol className="mt-4 flex flex-col gap-3">
                {SETUP_VISIT_STEPS.map((step) => (
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

      <section aria-labelledby="setup-form-heading" className="bg-mist py-16 sm:py-24">
        <Container className="max-w-xl">
          <h2 id="setup-form-heading" className="text-h2 text-ink">
            Ask Sam for setup help
          </h2>
          <div className="mt-8">
            <ContactForm showMeetingChoice={site.inPersonInBozeman} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {site.contactEmail && (
              <p className="text-small text-ink-2">
                Prefer email? Write to Sam at{" "}
                <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
                  {site.contactEmail}
                </a>
                .
              </p>
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

      <section aria-labelledby="setup-diy-heading" className="py-16 sm:py-24">
        <Container>
          <h2 id="setup-diy-heading" className="text-h2 text-ink">
            Rather do it yourself?
          </h2>
          <div className="mt-8 max-w-xl">
            <BusinessSearchForm id="setup-search" location="setup" />
          </div>
        </Container>
      </section>
    </>
  );
}
