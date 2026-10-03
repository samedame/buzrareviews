"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, type FormEvent } from "react";
import { track } from "@vercel/analytics";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Field, TextAreaField } from "@/components/ui/Field";
import { Stars } from "@/components/ui/Stars";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/config/site";

const MANAGE_BILLING_STATUSES = new Set(["trialing", "active", "past_due"]);

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
  reply_tone: string | null;
};

// Matches anthropic.ts's DEFAULT_REPLY_TONE. Duplicated here (rather than
// imported) because anthropic.ts pulls in the Anthropic SDK and throws if
// ANTHROPIC_API_KEY isn't set, neither of which belong in a client bundle.
const FALLBACK_TONE = "friendly and warm, like a small business owner writing personally";

const TONE_PRESETS: { label: string; value: string }[] = [
  { label: "Friendly & warm", value: FALLBACK_TONE },
  { label: "Professional", value: "professional and polished, formal but still personable" },
  {
    label: "Casual & upbeat",
    value: "casual and upbeat, like texting a friend, contractions and casual phrasing are fine",
  },
];

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DashboardClient() {
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
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState(false);

  // Lost-link recovery.
  const [recoveryStartedAt] = useState(() => Date.now());
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCompany, setRecoveryCompany] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  // Reply tone settings.
  const [replyTone, setReplyTone] = useState("");
  const [savedReplyTone, setSavedReplyTone] = useState("");
  const [toneSaving, setToneSaving] = useState(false);
  const [toneError, setToneError] = useState<string | null>(null);
  const [toneJustSaved, setToneJustSaved] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewPositive, setPreviewPositive] = useState<string | null>(null);
  const [previewConstructive, setPreviewConstructive] = useState<string | null>(null);

  // Looks up the business itself (name, subscription status, reply tone).
  // Throws with a clear, user-facing message on a 404 so the caller can
  // distinguish "this business ID doesn't exist" from "it exists but has
  // no reviews yet".
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
      setToneError(null);
      setToneJustSaved(false);
      setPreviewError(null);
      setPreviewPositive(null);
      setPreviewConstructive(null);

      try {
        const business = await loadBusiness(id);
        setBusinessName(business.name ?? "");
        setSubscriptionStatus(business.subscription_status ?? null);
        const tone = business.reply_tone?.trim() || FALLBACK_TONE;
        setReplyTone(tone);
        setSavedReplyTone(tone);

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

  async function handleManageBilling() {
    if (!businessId) return;
    track("billing_portal_click");
    setBillingError(false);
    setBillingLoading(true);

    try {
      const response = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Couldn't open billing.");
      }

      window.location.assign(data.url);
    } catch {
      setBillingError(true);
      setBillingLoading(false);
    }
  }

  async function handleRecoverySubmit(event: FormEvent) {
    event.preventDefault();
    track("dashboard_link_request");
    setRecoveryLoading(true);

    try {
      await fetch("/api/dashboard-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail.trim(), company: recoveryCompany, startedAt: recoveryStartedAt }),
      });
    } catch {
      // The response is always the same generic message regardless of
      // outcome, so a network error here doesn't need its own branch.
    } finally {
      setRecoveryLoading(false);
      setRecoverySubmitted(true);
    }
  }

  async function handleSaveTone() {
    if (!businessId || !replyTone.trim()) return;
    setToneError(null);
    setToneSaving(true);

    try {
      const response = await fetch(`/api/businesses?id=${encodeURIComponent(businessId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyTone }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Couldn't save that tone.");
      }

      setSavedReplyTone(replyTone);
      setToneJustSaved(true);
      setTimeout(() => setToneJustSaved(false), 2500);
    } catch (err) {
      setToneError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setToneSaving(false);
    }
  }

  async function handlePreviewTone() {
    if (!replyTone.trim()) return;
    setPreviewError(null);
    setPreviewLoading(true);
    setPreviewPositive(null);
    setPreviewConstructive(null);

    try {
      const response = await fetch("/api/preview-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName: businessName || "your business", tone: replyTone }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Couldn't generate an example.");
      }

      setPreviewPositive(data.positive.reply);
      setPreviewConstructive(data.constructive.reply);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPreviewLoading(false);
    }
  }

  // Widened to include "past_due" (issue 9): a past-due business still has
  // a real subscription and needs Manage billing to fix its card, not the
  // "Subscribe for $29/mo" flow meant for businesses that never subscribed.
  const isSubscribed = Boolean(subscriptionStatus && MANAGE_BILLING_STATUSES.has(subscriptionStatus));

  return (
    <Container className="max-w-2xl py-16">
      <h1 className="text-h2 text-ink text-center">{businessName ? `${businessName} reviews` : "Reviews"}</h1>
      <p className="text-body text-ink-2 mt-2 text-center">
        Here&apos;s how it works: once a day, we check Google for new reviews of your business and draft a reply
        to each one. Anything found shows up on this page for you to copy into Google yourself.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          loadDashboard(businessId);
        }}
        className="mt-6"
      >
        <label htmlFor="dashboardBusinessId" className="sr-only">
          Business ID
        </label>
        <div className="flex gap-2">
          <input
            id="dashboardBusinessId"
            type="text"
            autoComplete="off"
            value={businessId}
            onChange={(event) => setBusinessId(event.target.value)}
            placeholder="Business ID"
            className="flex-1 rounded-[var(--radius-control)] border border-line px-3 py-2.5 text-body text-ink outline-none placeholder:text-ink-3 focus-visible:border-ink"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading…" : "Load"}
          </Button>
        </div>
      </form>
      <p className="text-small text-ink-3 mt-2 text-center">
        This is the ID from the link in your confirmation email. Bookmark this page (with the ID filled in) so
        you can check back anytime.
      </p>

      <div className="mt-8 rounded-[var(--radius-control)] border border-line px-4 py-4">
        <h2 className="text-small font-semibold text-ink">Lost your link?</h2>
        <p className="text-small text-ink-3 mt-1">
          Enter the email you signed up with and we&apos;ll send your dashboard link again.
        </p>

        {recoverySubmitted ? (
          <p className="mt-3 text-small text-ink-2">
            If that email has a BuzraReviews account, we just sent the link. Check your inbox and spam folder.
          </p>
        ) : (
          <form onSubmit={handleRecoverySubmit} className="mt-3 flex flex-col gap-3">
            {/* Honeypot, same pattern as ContactForm (issue 11). */}
            <div aria-hidden="true" className="invisible absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="recoveryCompany">Company</label>
              <input
                type="text"
                id="recoveryCompany"
                tabIndex={-1}
                autoComplete="off"
                value={recoveryCompany}
                onChange={(event) => setRecoveryCompany(event.target.value)}
              />
            </div>

            <Field
              id="recoveryEmail"
              label="Your email"
              type="email"
              autoComplete="email"
              value={recoveryEmail}
              onChange={(event) => setRecoveryEmail(event.target.value)}
              placeholder="you@yourbusiness.com"
              required
            />
            <Button type="submit" variant="secondary" disabled={recoveryLoading}>
              {recoveryLoading ? "Sending…" : "Email me my link"}
            </Button>
          </form>
        )}
      </div>

      {businessId && (
        <p className="mt-3 text-center text-small">
          <Link
            href={`/customers?businessId=${encodeURIComponent(businessId)}&businessName=${encodeURIComponent(businessName)}`}
            className="text-meadow underline underline-offset-[3px]"
          >
            Add another customer
          </Link>
          <span className="mt-1 block text-small text-ink-3">
            We&apos;ll email them asking for a Google review after their visit.
          </span>
        </p>
      )}

      {businessId && (
        <div className="mt-6 rounded-[var(--radius-control)] border border-line px-4 py-4 text-center">
          {justSubscribed && (
            <p className="mb-2 text-small font-medium text-meadow">
              Thanks for subscribing. Your 14-day free trial has started.
            </p>
          )}

          {isSubscribed ? (
            <>
              <p className="text-small text-ink-2">
                {subscriptionStatus === "trialing" ? "Free trial active" : "Subscription active"} ($29/mo)
              </p>
              {/* isSubscribed is already exactly this set of statuses. */}
              <div className="mt-3 flex flex-col items-center gap-1">
                <Button variant="secondary" onClick={handleManageBilling} disabled={billingLoading}>
                  {billingLoading ? "Opening…" : "Manage billing"}
                </Button>
                <p className="text-small text-ink-3">Cancel, change your card, or see invoices.</p>
                {billingError && (
                  <p className="mt-1 text-small text-brick" role="alert">
                    We couldn&apos;t open billing right now.
                    {site.contactEmail && (
                      <>
                        {" "}
                        Email Sam at{" "}
                        <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
                          {site.contactEmail}
                        </a>{" "}
                        and he&apos;ll take care of it.
                      </>
                    )}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-small text-ink-2">
                Subscribe for $29/mo to keep review checks and AI-drafted replies running. 14-day free trial,
                cancel anytime.
              </p>
              <div className="mt-3 flex justify-center">
                <Button onClick={handleSubscribe} disabled={checkoutLoading}>
                  {checkoutLoading ? "Redirecting…" : "Subscribe for $29/mo"}
                </Button>
              </div>
            </>
          )}

          {checkoutError && (
            <p className="mt-2 text-small text-brick" role="alert">
              {checkoutError}
            </p>
          )}
        </div>
      )}

      {businessId && hasLoaded && (
        <div className="mt-6 rounded-[var(--radius-control)] border border-line px-4 py-4">
          <h2 className="text-small font-semibold text-ink">Reply tone</h2>
          <p className="text-small text-ink-3 mt-1">
            This controls how the AI drafts replies to your reviews. Pick a starting point below or write your
            own, then save. It only affects replies drafted from now on, reviews already drafted won&apos;t
            change.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {TONE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setReplyTone(preset.value)}
                className="rounded-[var(--radius-chip)] border border-line px-3 py-1 text-small text-ink-2 transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <TextAreaField
              id="replyTone"
              label="Reply tone"
              hideLabel
              value={replyTone}
              onChange={(event) => setReplyTone(event.target.value)}
              rows={2}
              placeholder="e.g. friendly and warm, like a small business owner writing personally"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveTone}
              disabled={toneSaving || !replyTone.trim() || replyTone === savedReplyTone}
              className="rounded-[var(--radius-control)] bg-ink px-3 py-1.5 text-small font-medium text-paper disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {toneSaving ? "Saving…" : "Save tone"}
            </button>
            <button
              type="button"
              onClick={handlePreviewTone}
              disabled={previewLoading || !replyTone.trim()}
              className="rounded-[var(--radius-control)] border border-line px-3 py-1.5 text-small font-medium text-ink-2 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {previewLoading ? "Generating…" : "Show me an example"}
            </button>
            {toneJustSaved && <span className="text-small font-medium text-meadow">Saved</span>}
          </div>

          {toneError && (
            <p className="mt-2 text-small text-brick" role="alert">
              {toneError}
            </p>
          )}
          {previewError && (
            <p className="mt-2 text-small text-brick" role="alert">
              {previewError}
            </p>
          )}

          {(previewPositive || previewConstructive) && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-small font-medium text-ink-3">Example only, these aren&apos;t real reviews</p>
              {previewPositive && (
                <div className="rounded-[var(--radius-control)] bg-mist px-3 py-2">
                  <p className="text-small text-ink-3">
                    5-star review from &quot;Jordan&quot;: &quot;Everyone here was so welcoming and the service
                    was great from start to finish. Highly recommend.&quot;
                  </p>
                  <p className="text-body text-ink mt-2">{previewPositive}</p>
                </div>
              )}
              {previewConstructive && (
                <div className="rounded-[var(--radius-control)] bg-mist px-3 py-2">
                  <p className="text-small text-ink-3">
                    2-star review from &quot;Morgan&quot;: &quot;Had to wait a lot longer than expected and no
                    one really explained what was going on.&quot;
                  </p>
                  <p className="text-body text-ink mt-2">{previewConstructive}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-small text-brick mt-4 text-center" role="alert">
          {error}
        </p>
      )}

      {hasLoaded && reviews.length === 0 && !error && (
        <p className="text-body text-ink-3 mt-10 text-center">
          {businessName || "This business"} is all set up and we checked Google just now, nothing new has come
          in yet. We check again once a day, so it&apos;s worth coming back tomorrow, especially once you&apos;ve
          added customers above.
        </p>
      )}

      <ul className="mt-8 flex flex-col gap-4">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-[var(--radius-card)] border border-line px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-body font-medium text-ink">{review.author_name ?? "Anonymous"}</p>
              {review.rating && <Stars rating={review.rating} size={16} />}
            </div>
            <p className="text-small text-ink-3">{formatDate(review.review_time)}</p>

            {review.review_text && <p className="text-small text-ink-2 mt-2">{review.review_text}</p>}

            <div className="mt-3 rounded-[var(--radius-control)] bg-mist px-3 py-2">
              <p className="text-small font-medium text-ink-3">AI-drafted reply</p>
              {review.ai_draft_reply ? (
                <>
                  <p className="text-small text-ink mt-1">{review.ai_draft_reply}</p>
                  <button
                    onClick={() => handleCopy(review)}
                    className="mt-2 inline-flex items-center gap-1.5 text-small font-medium text-ink underline underline-offset-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    <Icon name={copiedId === review.id ? "check" : "copy"} size={14} />
                    {copiedId === review.id ? "Copied" : "Copy reply"}
                  </button>
                  <p className="text-small text-ink-3 mt-1">
                    Copy this and paste it into your reply box on Google, we don&apos;t post it for you.
                  </p>
                </>
              ) : (
                <p className="text-small text-ink-3 mt-1">Draft pending. Check back after the next review check.</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
