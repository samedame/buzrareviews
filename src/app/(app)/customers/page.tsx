"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type AddedCustomer = {
  email: string;
  emailStatus: "sent" | "failed";
};

export default function CustomersPage() {
  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<AddedCustomer[]>([]);

  // Read businessId/businessName from the URL (e.g. a link from the
  // onboarding "done" step) without next/navigation's useSearchParams, so
  // this page doesn't need a Suspense boundary to stay statically prerendered.
  useEffect(() => {
    // Reading a browser-only API (the URL) after mount and syncing it into
    // state is the correct pattern here -- it's what keeps server and
    // client's initial render identical and avoids a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    const params = new URLSearchParams(window.location.search);
    const id = params.get("businessId");
    const name = params.get("businessName");
    if (id) setBusinessId(id);
    if (name) setBusinessName(name);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!businessId.trim()) {
      setError("Enter the business ID this customer belongs to.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: businessId.trim(),
          name: name.trim() || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Couldn't add this customer.");
      }

      setAdded((prev) => [
        { email: data.customer.email, emailStatus: data.emailStatus },
        ...prev,
      ]);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="max-w-md py-16">
      <h1 className="text-h2 text-ink text-center">Add a customer</h1>
      <p className="text-body text-ink-2 mt-2 text-center">
        {businessName
          ? `Adding customers for ${businessName}. Each one gets an immediate review request email.`
          : "Each customer you add gets an immediate review request email."}
      </p>

      {businessId && (
        <p className="mt-2 text-center text-small">
          <Link
            href={`/dashboard?businessId=${encodeURIComponent(businessId)}&businessName=${encodeURIComponent(businessName)}`}
            className="text-meadow underline underline-offset-[3px]"
          >
            View dashboard
          </Link>
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Field
          id="businessId"
          label="Business ID"
          autoComplete="off"
          value={businessId}
          onChange={(event) => setBusinessId(event.target.value)}
          placeholder="Paste the business's ID"
          required
        />

        <Field
          id="customerName"
          name="name"
          label="Customer name (optional)"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jamie Rivera"
        />

        <Field
          id="customerEmail"
          name="email"
          label="Customer email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jamie@example.com"
          required
        />

        <Field
          id="customerPhone"
          name="tel"
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="(555) 555-5555"
        />

        {error && (
          <p className="text-small text-brick" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding…" : "Add & send review request"}
        </Button>
      </form>

      {added.length > 0 && (
        <div className="mt-8">
          <h2 className="text-small font-medium text-ink">Added this session</h2>
          <ul className="mt-2 flex flex-col gap-1">
            {added.map((customer, index) => (
              <li
                key={`${customer.email}-${index}`}
                className="flex items-center justify-between rounded-[var(--radius-control)] border border-line px-3 py-2 text-small"
              >
                <span className="text-ink">{customer.email}</span>
                <span className={customer.emailStatus === "sent" ? "text-meadow" : "text-brick"}>
                  {customer.emailStatus === "sent" ? "Email sent" : "Email failed"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
