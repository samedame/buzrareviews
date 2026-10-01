import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/marketing/LegalLayout";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BuzraReviews collects, uses, and protects information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="September 30, 2026">
      <LegalSection heading="Who we are">
        <p>
          BuzraReviews is built and run by {site.founderName}, based in {site.city}. If you have a question about
          this policy or about your information, you can reach us through the contact form on{" "}
          <a href="/bozeman" className="text-meadow underline underline-offset-[3px]">
            our Bozeman page
          </a>
          {site.contactEmail ? (
            <>
              {" "}
              or by email at{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
                {site.contactEmail}
              </a>
              .
            </>
          ) : (
            "."
          )}
        </p>
      </LegalSection>

      <LegalSection heading="Information we collect">
        <p>From business owners who use BuzraReviews: your business name and address, your Google place ID and review link, your email address, an optional phone number, your reply tone preference, and your subscription status. Card details are handled directly by Stripe and are never stored on our servers.</p>
        <p>From our business users, about their own customers: a customer&apos;s name, email, and optional phone number, provided by the business so we can send that business&apos;s review request on their behalf.</p>
        <p>Public Google review data for connected businesses: reviewer display name, star rating, review text, and date, as made available through Google&apos;s Places API.</p>
        <p>From website visitors: privacy-friendly analytics provided by Vercel, which does not use cookies to track you across sites.</p>
        <p>From anyone who submits our contact form: whatever you type into it, including your name, business name, email, optional phone number, and message.</p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>We use this information to run the service: sending review requests on a business&apos;s behalf, drafting replies, handling billing, providing support, and keeping the service secure. When a reply is drafted, the review text and the business name are sent to Anthropic&apos;s API to generate the draft.</p>
        <p>We do not sell personal information, and we do not use it for advertising.</p>
      </LegalSection>

      <LegalSection heading="Service providers">
        <p>We work with a small number of providers to run BuzraReviews, each of whom only receives the information they need to do their job:</p>
        <p>Vercel (hosting and website analytics), Supabase (database), Stripe (payments), Resend (sending email), Anthropic (drafting replies), Google (business and review data), and Twilio (only if and when BuzraReviews sends text messages).</p>
      </LegalSection>

      <LegalSection heading="Text messaging">
        <p>
          BuzraReviews does not send text messages today. If and when it does, no mobile information will be
          shared with third parties or affiliates for marketing or promotional purposes. All of the categories
          described in this policy exclude text messaging originator opt-in data and consent; this information
          will not be shared with any third parties. Phone numbers are used only to deliver the messages a
          business has asked us to send on its behalf.
        </p>
      </LegalSection>

      <LegalSection heading="Review request emails">
        <p>Review request emails are sent on behalf of the business a recipient visited, not on behalf of BuzraReviews. If a recipient wants that business, or us, to stop emailing them, they can ask either one and we will honor it.</p>
      </LegalSection>

      <LegalSection heading="Retention">
        <p>We keep information for as long as a business&apos;s account is active, plus a reasonable period afterward in case the business wants to come back or we need the records for billing or legal reasons.</p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>We use reasonable safeguards to protect the information we handle, including relying on established providers (Stripe, Supabase, Vercel) for the most sensitive parts of the system. No method of storing or transmitting data is perfectly secure, and we can&apos;t guarantee absolute security.</p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>BuzraReviews is a tool for business owners and is not directed to children under 13. We do not knowingly collect information from children.</p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>You can ask to access, correct, or delete the information we hold about you by contacting us using the details at the top of this page.</p>
      </LegalSection>

      <LegalSection heading="Changes to this policy">
        <p>We may update this policy from time to time. If we make a meaningful change, we&apos;ll update the date at the top of this page.</p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy can go through the contact form on{" "}
          <a href="/bozeman" className="text-meadow underline underline-offset-[3px]">
            our Bozeman page
          </a>
          {site.contactEmail && (
            <>
              {" "}
              or to{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
                {site.contactEmail}
              </a>
            </>
          )}
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
