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

type Business = {
  id: string;
  name: string;
  subscription_status: string | null;
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [justSubscribed, setJustSubscribed] = useState(false);

  // Looks up the business itself (name + subscription status). Throws with
  // a clear, user-facing message on a 404 so the caller can distinguish
  // "this business ID doesn't exist" from "it exists but has no reviews yet".
  const loadBusiness = useCallback(async (id: string): Promise<Business> => {
    const response = await fetch(`/api/businesses?id=${encodeURIComponent(id.trim())}`);
    const data = await response.json();

    if (!response.ok) {
      const message =
        data.error === "Business not found"
          ? "We couldn't find a business with that ID. Double check the link from your confirmation email, or the ID you were given when you signed up."
          : (data.error ?? "Couldn't load that business.");
      throw new Error(message);
    }

    return data.business as Business;
  }, []);

  const loadReviews = useCallback(async (id: string): Promise<Review[]> => {
    const response = await fetch(`/api/reviews?businessId=${encodeURIComponent(id.trim())}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Couldn't load reviews.");
    }

    return data.reviews as Review[];
  }, []);

  // Runs both lookups together so "Load" always has one clear outcome:
  // a business that was found (name + subscription status + its reviews,
  // even if that list is empty), or one clear error explaining why nothing
  // loaded. Never leaves the page in a state where it's unclear whether
  // anything happened.
  const loadDashboard = useCallback(
    async (id: string) => {
      if (!id.trim()) {
        setError("Enter a business ID.");
        return;
      }
      setError(null);
      setLoading(true);
      setHasLoaded(false);

      try {
        const business = await loadBusiness(id);
        setBusinessName(business.name ?? "");
        setSubscriptionStatus(business.subscription_status ?? null);

        const reviewList = await loadReviews(id);
        setReviews(reviewList);
        setHasLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [loadBusiness, loadReviews]
  );

  // Read businessId/businessName from the URL (e.g. a link from the
  // customers page) without next/navigation's useSearchParams, so this
  // page doesn't need a Suspense boundary to stay statically prerendered.
  useEffect(() => {
    // Reading a browser-only API (the URL) after mount and syncing it into
    // state is the correct pattern here -- it's what keeps server and
    // client's initial render identical and avoids a hydration mismatch.
    // loadDashboard is intentionally omitted from deps: it's stable
    // (useCallback, no changing deps) and re-running this effect on every
    // render would re-trigger the fetch.
    /* eslint-disable react-hooks/set-state-in-effect */
    const params = new URLSearchParams(window.location.search);
    const id = params.get("businessId");
    const name = params.get("businessName");
    if (name) setBusinessName(name);
    if (id) {
      setBusinessId(id);
      loadDashboard(id);
    }
    if (params.get("subscribed") === "true") setJustSubscribed(true);
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
      setError("Couldn't copy to clipboard. Select and copy the text manually instead.");
    }
  }

  async function handleSubscribe() {
    if (!businessId) return;
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Couldn't start checkout.");
      }

      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong.");
      setCheckoutLoading(false);
    }
  }

  const isSubscribed = subscriptionStatus === "active" || subscriptionStatus === "trialing";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          {businessName ? `${businessName} Reviews` : "Reviews"}
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Here&apos;s how it works: once a day, we check Google for new reviews of your
          business and draft a reply to each one. Anything found shows up on this page for
          you to copy into Google yourself.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            loadDashboard(businessId);
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
        <p className="mt-2 text-xs text-gray-500 text-center">
          This is the ID from the link in your confirmation email. Bookmark this page (with
          the ID filled in) so you can check back anytime.
        </p>

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
            <span className="block mt-1 text-xs text-gray-500">
              We&apos;ll email them asking for a Google review after their visit.
            </span>
          </p>
        )}

        {businessId && (
          <div className="mt-6 rounded-md border border-gray-200 px-4 py-4 text-center">
            {justSubscribed && (
              <p className="mb-2 text-sm font-medium text-green-700">
                Thanks for subscribing. Your 14-day free trial has started.
              </p>
            )}

            {isSubscribed ? (
              <p className="text-sm text-gray-600">
                {subscriptionStatus === "trialing" ? "Free trial active" : "Subscription active"} ($29/mo)
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Subscribe for $29/mo to keep review checks and AI-drafted replies running.
                  14-day free trial, cancel anytime.
                </p>
                <button
                  onClick={handleSubscribe}
                  disabled={checkoutLoading}
                  className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
                >
                  {checkoutLoading ? "Redirecting…" : "Subscribe for $29/mo"}
                </button>
              </>
            )}

            {checkoutError && <p className="mt-2 text-sm text-red-600">{checkoutError}</p>}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

        {hasLoaded && reviews.length === 0 && !error && (
          <p className="mt-10 text-center text-gray-500">
            {businessName || "This business"} is all set up and we checked Google just now,
            nothing new has come in yet. We check again once a day, so it&apos;s worth coming
            back tomorrow, especially once you&apos;ve added customers above.
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
                    <p className="mt-1 text-xs text-gray-500">
                      Copy this and paste it into your reply box on Google, we don&apos;t
                      post it for you.
                    </p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Draft pending. Check back after the next review check.
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
