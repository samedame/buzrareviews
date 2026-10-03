"use client";

import { m } from "motion/react";

const STAR_PATH = "M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5Z";

export function ReviewCard({
  visible,
  starsFilled,
  rating,
  reviewerName,
  text,
}: {
  visible: boolean;
  starsFilled: number;
  rating: number;
  reviewerName: string;
  text: string;
}) {
  return (
    <m.div
      className="paper-card w-full p-5"
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, visibility: "visible" }
          : { opacity: 0, y: 8, visibility: "hidden" }
      }
      transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
    >
      <p className="text-card-micro text-ink-3">New review</p>
      <div role="img" aria-label={`${rating} out of ${rating} stars`} className="mt-2 flex items-center gap-0.5">
        {Array.from({ length: rating }, (_, i) => (
          <m.svg
            key={i}
            aria-hidden="true"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            initial={false}
            animate={i < starsFilled ? { scale: [0.9, 1] } : {}}
            transition={{ duration: 0.18 }}
          >
            <path
              d={STAR_PATH}
              fill={i < starsFilled ? "var(--color-gold)" : "none"}
              stroke="var(--color-gold-edge)"
              strokeWidth={1}
              strokeLinejoin="round"
            />
          </m.svg>
        ))}
      </div>
      <p className="text-small text-ink mt-2 font-medium">{reviewerName}</p>
      <p className="text-small text-ink-2 mt-1">{text}</p>
    </m.div>
  );
}
