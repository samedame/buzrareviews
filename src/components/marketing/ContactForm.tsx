"use client";

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/Button";
import { Field, TextAreaField } from "@/components/ui/Field";
import { site } from "@/config/site";

type Status = "idle" | "submitting" | "success" | "error" | "not-connected";

export function ContactForm() {
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
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company-field">Company</label>
        <input type="text" id="company-field" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="contact-name" label="Name" name="name" required autoComplete="name" />
      <Field id="contact-business" label="Business name" name="business" required autoComplete="organization" />
      <Field id="contact-email" label="Email" name="email" type="email" required autoComplete="email" />
      <Field id="contact-phone" label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <TextAreaField id="contact-message" label="Message (optional)" name="message" rows={4} />

      {status === "error" && (
        <p role="alert" className="text-small text-brick">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="large" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Set up a call with Sam"}
      </Button>
    </form>
  );
}
