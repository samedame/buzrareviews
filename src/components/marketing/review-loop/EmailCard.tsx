"use client";

import { m } from "motion/react";
import { emailBody, emailGreeting, emailSignoff, emailSubject, EMAIL_BUTTON_LABEL } from "@/content/demo";

export function EmailCard({
  businessName,
  customerFirstName,
  sentTime,
}: {
  businessName: string;
  customerFirstName?: string;
  sentTime: string;
}) {
  const [thanks, signoffName] = emailSignoff(businessName);

  return (
    <div className="paper-card w-full p-5">
      <p className="text-card-micro text-ink-3">Sent {sentTime}</p>
      <m.p
        key={`subject-${businessName}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12 }}
        className="text-h3 text-ink mt-2"
      >
        {emailSubject(businessName)}
      </m.p>
      <p className="text-small text-ink-2 mt-3">{emailGreeting(customerFirstName)}</p>
      <m.p
        key={`body-${businessName}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12 }}
        className="text-small text-ink-2 mt-2"
      >
        {emailBody(businessName)}
      </m.p>
      <div className="mt-4 inline-flex items-center rounded-[var(--radius-control)] bg-ink px-4 py-2 text-small font-medium text-paper">
        {EMAIL_BUTTON_LABEL}
      </div>
      <p className="text-small text-ink-2 mt-4">
        {thanks}
        <br />
        <m.span key={`signoff-${signoffName}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}>
          {signoffName}
        </m.span>
      </p>
    </div>
  );
}
