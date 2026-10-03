"use client";

import { m } from "motion/react";

// A short connecting segment of the gold thread between two Review Loop
// cards. `progress` is 0 or 1 (not continuously driven) -- motion animates
// the transition between them via the pathLength prop.
export function GoldThreadSegment({ progress }: { progress: number }) {
  return (
    <svg width={24} height={32} viewBox="0 0 24 32" aria-hidden="true" className="shrink-0">
      <m.path
        d="M12 0 L12 32"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: progress }}
        transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
      />
    </svg>
  );
}
