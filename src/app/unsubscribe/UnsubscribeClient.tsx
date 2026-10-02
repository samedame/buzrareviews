"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

type Status = "idle" | "submitting" | "success" | "invalid" | "error";

export function UnsubscribeClient() {
  // Loading the page never changes anything -- email security scanners open
  // links automatically, so the POST only happens on a real button click.
  // `checked` distinguishes "haven't looked at the URL yet" (render the
  // normal prompt, same as the server-rendered HTML) from "looked, and c/t
  // are genuinely missing" -- without it, every valid link would flash the
  // "invalid link" message for one paint before the mount effect runs,
  // since `params` starts null on both server and client either way.
  const [checked, setChecked] = useState(false);
  const [params, setParams] = useState<{ c: string; t: string } | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const search = new URLSearchParams(window.location.search);
    const c = search.get("c");
    const t = search.get("t");
    setParams(c && t ? { c, t } : null);
    setChecked(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function handleUnsubscribe() {
    if (!params) return;
    setStatus("submitting");

    try {
      const response = await fetch(
        `/api/unsubscribe?c=${encodeURIComponent(params.c)}&t=${encodeURIComponent(params.t)}`,
        { method: "POST" }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus(response.status === 400 ? "invalid" : "error");
        return;
      }

      setBusinessName(data.business ?? null);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Container className="max-w-md py-16">
      <h1 className="text-h2 text-ink text-center">Stop review requests?</h1>

      {status === "success" ? (
        <p className="text-body text-ink-2 mt-4 text-center">
          Done. {businessName ?? "This business"} won&apos;t send you review requests through BuzraReviews
          anymore.
        </p>
      ) : status === "invalid" || (checked && !params) ? (
        <p className="text-body text-ink-2 mt-4 text-center">
          This link doesn&apos;t work. You can reply to the email and ask the business to stop
          {site.contactEmail && (
            <>
              , or email us at{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
                {site.contactEmail}
              </a>
            </>
          )}
          .
        </p>
      ) : status === "error" ? (
        <p className="text-body text-ink-2 mt-4 text-center">
          Something went wrong. Please try again
          {site.contactEmail && (
            <>
              , or email us at{" "}
              <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
                {site.contactEmail}
              </a>
            </>
          )}
          .
        </p>
      ) : (
        <>
          <p className="text-body text-ink-2 mt-4 text-center">
            You won&apos;t get any more review request emails from this business through BuzraReviews.
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleUnsubscribe} disabled={status === "submitting" || !params}>
              {status === "submitting" ? "Unsubscribing…" : "Unsubscribe"}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
