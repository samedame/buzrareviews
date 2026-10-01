"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type PlaceResult = {
  id: string;
  displayName: string;
  formattedAddress: string;
};

type Step = "search" | "confirm" | "done";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [selected, setSelected] = useState<PlaceResult | null>(null);
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);
  const [confirmationEmailFailed, setConfirmationEmailFailed] = useState(false);

  async function runSearch(q: string) {
    setError(null);
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(`/api/businesses?q=${encodeURIComponent(q)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Search failed.");
      }

      if (data.results.length === 0) {
        setError("No businesses matched that search. Try adding your city.");
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    runSearch(query);
  }

  // Pre-fill and auto-run the search from the hero/final-CTA business-name
  // form (e.g. /onboarding?q=Bloom%20Salon%2C%20Bozeman). Read directly from
  // the URL rather than useSearchParams, matching the pattern already used
  // on /customers and /dashboard, so this page stays statically prerendered
  // without a Suspense boundary.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q")?.trim().slice(0, 100);
    if (q) {
      setQuery(q);
      runSearch(q);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function handleSelect(place: PlaceResult) {
    setSelected(place);
    setStep("confirm");
    setError(null);
  }

  async function handleConfirm(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: selected.id,
          name: selected.displayName,
          address: selected.formattedAddress,
          ownerEmail,
          ownerPhone: ownerPhone || undefined,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        const message: string = data.error ?? "Couldn't save your business.";
        throw new Error(
          message.includes("duplicate key")
            ? "This business is already registered with BuzraReviews."
            : message
        );
      }

      setCreatedBusinessId(data.business.id);
      setConfirmationEmailFailed(data.emailStatus === "failed");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="max-w-md py-16">
      {step === "search" && (
        <>
          <h1 className="text-h2 text-ink text-center">Find your business</h1>
          <p className="text-body text-ink-2 mt-2 text-center">
            Search Google for your business name and city to get started.
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. Bloom Salon, Bozeman MT"
              aria-label="Business name and city"
              className="flex-1 rounded-[var(--radius-control)] border border-line px-3 py-2.5 text-body text-ink outline-none placeholder:text-ink-3 focus-visible:border-ink"
              minLength={3}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching" : "Search"}
            </Button>
          </form>

          {error && (
            <p className="mt-4 text-small text-brick" role="alert">
              {error}
            </p>
          )}

          {results.length > 0 && (
            <ul className="mt-6 flex flex-col gap-2">
              {results.map((place) => (
                <li key={place.id}>
                  <button
                    onClick={() => handleSelect(place)}
                    className="w-full rounded-[var(--radius-control)] border border-line px-4 py-3 text-left transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <p className="text-body font-medium text-ink">{place.displayName}</p>
                    <p className="text-small text-ink-2">{place.formattedAddress}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {step === "confirm" && selected && (
        <>
          <h1 className="text-h2 text-ink text-center">Confirm your business</h1>

          <div className="mt-6 rounded-[var(--radius-control)] border border-line px-4 py-3">
            <p className="text-body font-medium text-ink">{selected.displayName}</p>
            <p className="text-small text-ink-2">{selected.formattedAddress}</p>
          </div>

          <form onSubmit={handleConfirm} className="mt-6 flex flex-col gap-4">
            <Field
              id="ownerEmail"
              label="Your email"
              hint="We'll send review activity and drafted replies here for you to approve."
              type="email"
              value={ownerEmail}
              onChange={(event) => setOwnerEmail(event.target.value)}
              placeholder="you@yourbusiness.com"
              required
            />

            <Field
              id="ownerPhone"
              label="Phone (optional)"
              type="tel"
              value={ownerPhone}
              onChange={(event) => setOwnerPhone(event.target.value)}
              placeholder="(555) 555-5555"
            />

            {error && (
              <p className="text-small text-brick" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setStep("search");
                  setSelected(null);
                  setError(null);
                }}
              >
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving" : "Confirm & create"}
              </Button>
            </div>
          </form>
        </>
      )}

      {step === "done" && selected && (
        <div className="text-center">
          <h1 className="text-h2 text-ink">You&apos;re all set</h1>
          <p className="text-body text-ink-2 mt-3">
            {selected.displayName} is now registered with BuzraReviews. We&apos;ll start checking Google for new
            reviews and drafting replies for you to approve.
          </p>
          {confirmationEmailFailed && createdBusinessId && (
            <p className="mt-4 rounded-[var(--radius-control)] border border-gold-edge bg-gold-wash px-4 py-3 text-small text-ink">
              We couldn&apos;t send your confirmation email, so save this instead: your business ID is{" "}
              <strong>{createdBusinessId}</strong>. Use it to log back into your dashboard anytime.
            </p>
          )}
          {createdBusinessId && (
            <div className="mt-6">
              <Button
                href={`/dashboard?businessId=${encodeURIComponent(createdBusinessId)}&businessName=${encodeURIComponent(selected.displayName)}`}
              >
                Go to your dashboard
              </Button>
            </div>
          )}
          {createdBusinessId && (
            <p className="mt-3">
              <Link
                href={`/customers?businessId=${encodeURIComponent(createdBusinessId)}&businessName=${encodeURIComponent(selected.displayName)}`}
                className="text-small text-meadow underline underline-offset-[3px]"
              >
                Or add your customers first
              </Link>
            </p>
          )}
        </div>
      )}
    </Container>
  );
}
