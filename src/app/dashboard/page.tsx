"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

type Review = {
  id: string;
  author_name: string | null;
  rating: number | null;
  review_text: string | null;
  review_time: string | null;
  ai_draft_reply: string | null;
  owner_replied: boolean;
};

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function stars(rating: number | null): string {
  if (!rating) return "";
  return "★".repeat(rating) + "☆".repeat(Math.max(0, 5 - rating));
}

export default function DashboardPage() {
  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadReviews = useCallback(async (id: string) => {
    if (!id.trim()) {
      setError("Enter a business ID.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/reviews?businessId=${encodeURIComponent(id.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Couldn't load reviews.");
      }

      setReviews(data.reviews);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Read businessId/businessName from the URL (e.g. a link from the
  // customers page) without next/navigation's useSearchParams, so this
  // page doesn't need a Suspense boundary to stay statically prerendered.
  useEffect(() => {
    // Reading a browser-only API (the URL) after mount and syncing it into
    // state is the correct pattern here -- it's what keeps server and
    // client's initial render identical and avoids a hydration mismatch.
    // loadReviews is intentionally omitted from deps: it's stable (useCallback,
    // no changing deps) and re-running this effect on every render would
    // re-trigger the fetch.
    /* eslint-disable react-hooks/set-state-in-effect */
    const params = new URLSearchParams(window.location.search);
    const id = params.get("businessId");
    const name = params.get("businessName");
    if (name) setBusinessName(name);
    if (id) {
      setBusinessId(id);
      loadReviews(id);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCopy(review: Review) {
    if (!review.ai_draft_reply) return;
    try {
      await navigator.clipboard.writeText(review.ai_draft_reply);
      setCopiedId(review.id);
      setTimeout(() => setCopiedId((current) => (current === review.id ? null : current)), 2000);
    } catch {
      setError("Couldn't copy to clipboard — select and copy the text manually.");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          {businessName ? `${businessName} — Reviews` : "Reviews"}
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          New reviews and AI-drafted replies show up here after each daily check.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            loadReviews(businessId);
          }}
          className="mt-6 flex gap-2"
        >
          <input
            type="text"
            value={businessId}
            onChange={(event) => setBusinessId(event.target.value)}
            placeholder="Business ID"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load"}
          </button>
        </form>

        {businessId && (
          <p className="mt-3 text-center text-sm">
            <Link
              href={`/customers?businessId=${encodeURIComponent(businessId)}&businessName=${encodeURIComponent(
                businessName
              )}`}
              className="text-gray-600 underline"
            >
              Add another customer
            </Link>
          </p>
        )}

        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

        {hasLoaded && reviews.length === 0 && !error && (
          <p className="mt-10 text-center text-gray-500">
            No reviews yet — check back after your next daily review check.
          </p>
        )}

        <ul className="mt-8 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-md border border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">
                  {review.author_name ?? "Anonymous"}
                </p>
                <p className="text-amber-500" aria-label={`${review.rating ?? 0} out of 5 stars`}>
                  {stars(review.rating)}
                </p>
              </div>
              <p className="text-xs text-gray-500">{formatDate(review.review_time)}</p>

              {review.review_text && (
                <p className="mt-2 text-sm text-gray-700">{review.review_text}</p>
              )}

              <div className="mt-3 rounded-md bg-gray-50 px-3 py-2">
                <p className="text-xs font-medium text-gray-500">AI-drafted reply</p>
                {review.ai_draft_reply ? (
                  <>
                    <p className="mt-1 text-sm text-gray-800">{review.ai_draft_reply}</p>
                    <button
                      onClick={() => handleCopy(review)}
                      className="mt-2 text-sm font-medium text-gray-900 underline"
                    >
                      {copiedId === review.id ? "Copied" : "Copy reply"}
                    </button>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Draft pending — check back after the next review check.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
