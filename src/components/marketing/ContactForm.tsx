"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

function Field({
  label,
  name,
  ...rest
}: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-small font-medium text-ink">{label}</span>
      <input
        name={name}
        className="mt-1.5 w-full rounded-[var(--radius-control)] border border-line px-3 py-2.5 text-body text-ink outline-none focus-visible:border-ink"
        {...rest}
      />
    </label>
  );
}

function TextAreaField({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="text-small font-medium text-ink">{label}</span>
      <textarea
        name={name}
        rows={4}
        className="mt-1.5 w-full rounded-[var(--radius-control)] border border-line px-3 py-2.5 text-body text-ink outline-none focus-visible:border-ink"
      />
    </label>
  );
}

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

      <Field label="Name" name="name" required autoComplete="name" />
      <Field label="Business name" name="business" required autoComplete="organization" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <TextAreaField label="Message (optional)" name="message" />

      {status === "error" && (
        <p role="alert" className="text-small text-brick">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="large" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending" : "Ask Sam for a visit"}
      </Button>
    </form>
  );
}
