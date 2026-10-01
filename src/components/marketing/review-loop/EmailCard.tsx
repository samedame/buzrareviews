"use client";

import { useEffect, useRef } from "react";
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

  // EmailCard is part of the "already visible" server HTML and must never
  // animate in on first paint (E7: "No entrance animation on these --
  // protects Largest Contentful Paint"). The crossfade below exists only to
  // smooth a *later* personalization update while the visitor types; on
  // the very first render there's nothing to cross from, so it's skipped.
  const hasMounted = useRef(false);
  useEffect(() => {
    hasMounted.current = true;
  }, []);
  // The next line intentionally reads hasMounted.current during render:
  // there's no ref-free way to distinguish "first render" from "later
  // render" without an extra render (useState here would trigger
  // react-hooks/set-state-in-effect instead); this ref is only ever read
  // here and written in the effect above, never the reverse.
  /* eslint-disable-next-line react-hooks/refs -- intentional read of the mount flag; see comment above */
  const crossfadeInitial = hasMounted.current ? { opacity: 0 } : false;

  return (
    <div className="paper-card w-full p-5">
      <p className="text-card-micro text-ink-3">Sent {sentTime}</p>
      <m.p
        key={`subject-${businessName}`}
        initial={crossfadeInitial}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12 }}
        className="text-h3 text-ink mt-2"
      >
        {emailSubject(businessName)}
      </m.p>
      <p className="text-small text-ink-2 mt-3">{emailGreeting(customerFirstName)}</p>
      <m.p
        key={`body-${businessName}`}
        initial={crossfadeInitial}
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
        <m.span key={`signoff-${signoffName}`} initial={crossfadeInitial} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}>
          {signoffName}
        </m.span>
      </p>
    </div>
  );
}
