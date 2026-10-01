"use client";

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/Button";
import { Field, TextAreaField } from "@/components/ui/Field";
import { site } from "@/config/site";

type Status = "idle" | "submitting" | "success" | "error" | "not-connected";

export function ContactForm({ showMeetingChoice = false }: { showMeetingChoice?: boolean }) {
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      business: String(data.get("business") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? "") || undefined,
      message: String(data.get("message") ?? "") || undefined,
      company: String(data.get("company") ?? ""),
      meeting: showMeetingChoice ? String(data.get("meeting") ?? "call") : undefined,
      startedAt,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 503) {
        setStatus("not-connected");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      track("contact_submit");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="paper-card p-6">
        <p className="text-body text-ink">Thanks! Sam will reach out to set up a time.</p>
      </div>
    );
  }

  if (status === "not-connected") {
    return (
      <div className="paper-card p-6">
        <p className="text-body text-ink">
          The form isn&apos;t connected yet. Please try again later.
          {site.contactEmail && (
            <>
              {" "}
              Or{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
                email Sam directly
              </a>
              .
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot: aria-hidden + tabIndex=-1 keep it out of assistive tech
          and the tab order, and `invisible` (visibility:hidden) keeps its
          label out of the rendered text a sighted/AT user could otherwise
          perceive (position:absolute alone, e.g. -left-[9999px], still
          counts as rendered text to .innerText() -- verified directly
          against the running build, not assumed). Real bots read the DOM's
          attributes/textContent regardless of computed visibility, so this
          doesn't reduce the honeypot's effectiveness against them. */}
      <div aria-hidden="true" className="invisible absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company-field">Company</label>
        <input type="text" id="company-field" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="contact-name" label="Name" name="name" required autoComplete="name" />
      <Field id="contact-business" label="Business name" name="business" required autoComplete="organization" />
      <Field id="contact-email" label="Email" name="email" type="email" required autoComplete="email" />
      <Field id="contact-phone" label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <TextAreaField id="contact-message" label="Message (optional)" name="message" rows={4} />

      {showMeetingChoice && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-small font-medium text-ink">How should we meet?</legend>
          <label className="flex items-center gap-2 text-small text-ink-2">
            <input type="radio" name="meeting" value="call" defaultChecked />
            On a call
          </label>
          <label className="flex items-center gap-2 text-small text-ink-2">
            <input type="radio" name="meeting" value="in_person" />
            In person in Bozeman
          </label>
        </fieldset>
      )}

      {status === "error" && (
        <p role="alert" className="text-small text-brick">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="large" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send my request"}
      </Button>
    </form>
  );
}
