"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, MotionConfig, m } from "motion/react";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { Stars } from "@/components/ui/Stars";
import {
  TONE_LABELS,
  TONE_ORDER,
  TONE_DEMO_BUSINESS,
  TONE_DEMO_FIVE_STAR,
  TONE_DEMO_TWO_STAR,
  type Tone,
  type ToneReview,
} from "@/content/demo";

function ToneCard({ review, tone }: { review: ToneReview; tone: Tone }) {
  return (
    <div className="paper-card p-5">
      <div className="flex items-center justify-between gap-2">
        <Stars rating={review.rating} />
        <ExampleTag />
      </div>
      <p className="mt-2 text-small font-medium text-ink">{review.reviewerName}</p>
      <p className="mt-1 text-small text-ink-2">{review.text}</p>
      <div className="mt-4 border-t border-line pt-4">
        <p className="text-card-micro text-ink-3">Drafted reply</p>
        <m.p
          key={tone}
          initial={{ opacity: 0, filter: "blur(2px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-small text-ink"
        >
          {review.replies[tone]}
        </m.p>
      </div>
    </div>
  );
}

export function ToneDemo() {
  const [tone, setTone] = useState<Tone>("friendly");

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div>
          <div role="radiogroup" aria-label="Reply tone" className="flex flex-wrap gap-2">
            {TONE_ORDER.map((t) => {
              const selected = t === tone;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTone(t)}
                  className={`rounded-[var(--radius-chip)] px-3 py-1.5 text-small font-medium transition-colors duration-[var(--dur-ui)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                    selected ? "bg-gold-wash text-ink" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {TONE_LABELS[t]}
                </button>
              );
            })}
          </div>

          <p className="mt-2 text-small text-ink-3">Example reviews for {TONE_DEMO_BUSINESS}</p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <ToneCard review={TONE_DEMO_FIVE_STAR} tone={tone} />
            <div>
              <ToneCard review={TONE_DEMO_TWO_STAR} tone={tone} />
              <p className="mt-3 text-small text-ink-3">
                Tough reviews get a calm draft: a real apology, no excuses, and an invitation to talk it through
                directly.
              </p>
            </div>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
