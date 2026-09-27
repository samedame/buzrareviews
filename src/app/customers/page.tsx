"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

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
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Add a customer
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          {businessName
            ? `Adding customers for ${businessName}. Each one gets an immediate review-request email.`
            : "Each customer you add gets an immediate review-request email."}
        </p>

        {businessId && (
          <p className="mt-2 text-center text-sm">
            <Link
              href={`/dashboard?businessId=${encodeURIComponent(businessId)}&businessName=${encodeURIComponent(
                businessName
              )}`}
              className="text-gray-600 underline"
            >
              View dashboard
            </Link>
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="businessId" className="block text-sm font-medium text-gray-900">
              Business ID
            </label>
            <input
              id="businessId"
              type="text"
              value={businessId}
              onChange={(event) => setBusinessId(event.target.value)}
              placeholder="Paste the business's ID"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-900">
              Customer name <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="customerName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jamie Rivera"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-900">
              Customer email
            </label>
            <input
              id="customerEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jamie@example.com"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-900">
              Phone <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="customerPhone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(555) 555-5555"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Adding…" : "Add & Send Review Request"}
          </button>
        </form>

        {added.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-medium text-gray-900">Added this session</h2>
            <ul className="mt-2 space-y-1">
              {added.map((customer, index) => (
                <li
                  key={`${customer.email}-${index}`}
                  className="flex items-center justify-between text-sm rounded-md border border-gray-200 px-3 py-2"
                >
                  <span className="text-gray-900">{customer.email}</span>
                  <span
                    className={
                      customer.emailStatus === "sent"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {customer.emailStatus === "sent" ? "Email sent" : "Email failed"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
