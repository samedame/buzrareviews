"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(`/api/businesses?q=${encodeURIComponent(query)}`);
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
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md px-6 py-12">
        {step === "search" && (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 text-center">
              Find your business
            </h1>
            <p className="mt-2 text-gray-600 text-center">
              Search Google for your business name and city to get started.
            </p>

            <form onSubmit={handleSearch} className="mt-6 flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Bloom Salon, Bozeman MT"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                minLength={3}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </form>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            {results.length > 0 && (
              <ul className="mt-6 space-y-2">
                {results.map((place) => (
                  <li key={place.id}>
                    <button
                      onClick={() => handleSelect(place)}
                      className="w-full text-left rounded-md border border-gray-200 px-4 py-3 hover:border-gray-900 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{place.displayName}</p>
                      <p className="text-sm text-gray-600">{place.formattedAddress}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {step === "confirm" && selected && (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 text-center">
              Confirm your business
            </h1>

            <div className="mt-6 rounded-md border border-gray-200 px-4 py-3">
              <p className="font-medium text-gray-900">{selected.displayName}</p>
              <p className="text-sm text-gray-600">{selected.formattedAddress}</p>
            </div>

            <form onSubmit={handleConfirm} className="mt-6 space-y-4">
              <div>
                <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-900">
                  Your email
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ll send review activity and drafted replies here for you to approve.
                </p>
                <input
                  id="ownerEmail"
                  type="email"
                  value={ownerEmail}
                  onChange={(event) => setOwnerEmail(event.target.value)}
                  placeholder="you@yourbusiness.com"
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-900">
                  Phone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="ownerPhone"
                  type="tel"
                  value={ownerPhone}
                  onChange={(event) => setOwnerPhone(event.target.value)}
                  placeholder="(555) 555-5555"
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("search");
                    setSelected(null);
                    setError(null);
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
                >
                  {loading ? "Saving…" : "Confirm & Create"}
                </button>
              </div>
            </form>
          </>
        )}

        {step === "done" && selected && (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">You&apos;re all set</h1>
            <p className="mt-3 text-gray-600">
              {selected.displayName} is now registered with BuzraReviews. We&apos;ll start
              polling for new Google reviews and drafting replies for you to approve.
            </p>
            {confirmationEmailFailed && createdBusinessId && (
              <p className="mt-4 rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                We couldn&apos;t send your confirmation email, so save this instead: your
                business ID is <strong>{createdBusinessId}</strong>. Use it to log back into
                your dashboard anytime.
              </p>
            )}
            {createdBusinessId && (
              <Link
                href={`/dashboard?businessId=${encodeURIComponent(
                  createdBusinessId
                )}&businessName=${encodeURIComponent(selected.displayName)}`}
                className="mt-6 inline-block rounded-md bg-gray-900 px-5 py-2.5 text-white"
              >
                Go to your dashboard
              </Link>
            )}
            {createdBusinessId && (
              <p className="mt-3">
                <Link
                  href={`/customers?businessId=${encodeURIComponent(
                    createdBusinessId
                  )}&businessName=${encodeURIComponent(selected.displayName)}`}
                  className="text-sm text-gray-600 underline"
                >
                  Or add your customers first
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
