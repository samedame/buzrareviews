import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/marketing/LegalLayout";
import { SUBSCRIPTION_PRICE_USD_CENTS, TRIAL_PERIOD_DAYS } from "@/lib/pricing";
import { site } from "@/config/site";
import { pageMetadata } from "@/config/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms for using BuzraReviews, including billing and SMS program terms.",
  path: "/terms",
});

export default function TermsPage() {
  const price = Math.round(SUBSCRIPTION_PRICE_USD_CENTS / 100);

  return (
    <LegalLayout title="Terms of Service" lastUpdated="September 30, 2026">
      <LegalSection heading="Agreement and eligibility">
        <p>
          These terms apply to any business, and any person authorized to act on a business&apos;s behalf, that
          uses BuzraReviews. By using BuzraReviews, you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="The service">
        <p>
          BuzraReviews helps single-location local businesses get more Google reviews and reply to them well. We
          email a review request to each customer you add, check Google once a day for new reviews, and draft a
          reply to each new one for you to review and post yourself.
        </p>
        <p>
          Google&apos;s data can be delayed or incomplete, and some reviews may not be detected on a given check.
          We don&apos;t control Google&apos;s systems and can&apos;t guarantee that every review will be caught.
        </p>
      </LegalSection>

      <LegalSection heading="Access">
        <p>
          Your dashboard link is how you access your account. There&apos;s no username or password, so keep that
          link private and don&apos;t share it outside your business.
        </p>
      </LegalSection>

      <LegalSection heading="Subscription and billing">
        <p>
          BuzraReviews costs ${price} a month after a {TRIAL_PERIOD_DAYS}-day free trial. A card is collected
          through Stripe when your trial starts, and your subscription renews monthly after that. You can cancel
          anytime by contacting us; cancellation takes effect at the end of your current billing period, and we
          don&apos;t prorate refunds for partial months.
        </p>
      </LegalSection>

      <LegalSection heading="Your responsibilities">
        <p>Using BuzraReviews, you agree to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Only add customers who did business with you and gave you their contact information.</li>
          <li>Follow applicable laws, including CAN-SPAM for email and, for text messages if and when they&apos;re offered, the TCPA.</li>
          <li>Never use BuzraReviews to post fake reviews, offer incentives for reviews, or selectively ask only happy customers for reviews.</li>
          <li>Follow Google&apos;s own review policies.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="AI-drafted replies">
        <p>
          Drafted replies can be wrong or miss context. You&apos;re responsible for reviewing every draft and for
          anything you post. If you run a healthcare business, don&apos;t post a reply that identifies or
          confirms that someone is a patient.
        </p>
      </LegalSection>

      <LegalSection heading="SMS program terms">
        <p>
          These terms apply if and when BuzraReviews offers text messaging. Program name: &quot;BuzraReviews
          review requests.&quot; Description: a text message asking a customer of a participating business to
          leave a Google review after a visit. Frequency: one message per visit recorded by the business. Message
          and data rates may apply. Reply STOP to opt out, or HELP for help. Carriers are not liable for delayed
          or undelivered messages. Consent to receive messages is not a condition of any purchase, and opt-in
          data is never shared with third parties for marketing purposes (see our{" "}
          <a href="/privacy" className="text-meadow underline underline-offset-[3px]">
            Privacy Policy
          </a>
          ). For support, use the contact form on our{" "}
          <a href="/setup" className="text-meadow underline underline-offset-[3px]">
            setup page
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Third-party services">
        <p>
          BuzraReviews relies on Vercel, Supabase, Stripe, Resend, Anthropic, Google, and (if and when text
          messaging is offered) Twilio. We&apos;re not responsible for outages or errors caused by these
          providers.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>BuzraReviews, its name, and its mark belong to us. You keep ownership of your own business data and your customers&apos; information.</p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>Don&apos;t use BuzraReviews to break the law, harass anyone, or interfere with the service&apos;s normal operation.</p>
      </LegalSection>

      <LegalSection heading="Disclaimers">
        <p>
          BuzraReviews is provided as is, without warranties of any kind, express or implied. We don&apos;t
          guarantee the service will be uninterrupted or error-free.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent the law allows, {site.name} is not liable for indirect, incidental, or
          consequential damages arising from your use of the service.
        </p>
      </LegalSection>

      <LegalSection heading="Indemnity">
        <p>You agree to cover any claims or costs arising from your misuse of BuzraReviews or your violation of these terms.</p>
      </LegalSection>

      <LegalSection heading="Termination">
        <p>We may suspend or end an account that violates these terms. You can stop using BuzraReviews, and cancel your subscription, at any time.</p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>These terms are governed by the laws of the State of Montana.</p>
      </LegalSection>

      <LegalSection heading="Changes to these terms">
        <p>We may update these terms from time to time. If we make a meaningful change, we&apos;ll update the date at the top of this page.</p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms can go through the contact form on{" "}
          <a href="/setup" className="text-meadow underline underline-offset-[3px]">
            our setup page
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
