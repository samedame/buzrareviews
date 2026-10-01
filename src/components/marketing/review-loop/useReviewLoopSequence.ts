"use client";

import { useEffect, useRef, useState } from "react";

export type SequenceState = {
  threadProgress1: number;
  reviewVisible: boolean;
  starsFilled: number;
  threadProgress2: number;
  replyCardVisible: boolean;
  replyResolved: boolean;
  demoCopied: boolean;
  replayVisible: boolean;
};

function finalState(rating: number): SequenceState {
  return {
    threadProgress1: 1,
    reviewVisible: true,
    starsFilled: rating,
    threadProgress2: 1,
    replyCardVisible: true,
    replyResolved: true,
    demoCopied: false,
    replayVisible: true,
  };
}

const PENDING_STATE: SequenceState = {
  threadProgress1: 0,
  reviewVisible: false,
  starsFilled: 0,
  threadProgress2: 0,
  replyCardVisible: false,
  replyResolved: false,
  demoCopied: false,
  replayVisible: false,
};

// Choreography timetable per DESIGN.md S6. "full" runs the whole sequence
// from the EmailCard (used on first mount and Replay). "from-review" skips
// the thread-1 draw (already drawn) and starts from the review card, used
// when the visitor switches vertical.
function buildSchedule(mode: "full" | "from-review", rating: number) {
  const starDelays = Array.from({ length: rating }, (_, i) => i * 60);

  if (mode === "full") {
    return [
      { at: 300, apply: (s: SequenceState) => ({ ...s, threadProgress1: 1 }) },
      { at: 1000, apply: (s: SequenceState) => ({ ...s, reviewVisible: true }) },
      ...starDelays.map((d, i) => ({
        at: 1200 + d,
        apply: (s: SequenceState) => ({ ...s, starsFilled: i + 1 }),
      })),
      { at: 2000, apply: (s: SequenceState) => ({ ...s, threadProgress2: 1 }) },
      { at: 2600, apply: (s: SequenceState) => ({ ...s, replyCardVisible: true }) },
      { at: 3100, apply: (s: SequenceState) => ({ ...s, replyResolved: true }) },
      { at: 3600, apply: (s: SequenceState) => ({ ...s, demoCopied: true }) },
      { at: 4400, apply: (s: SequenceState) => ({ ...s, demoCopied: false, replayVisible: true }) },
    ];
  }

  return [
    { at: 100, apply: (s: SequenceState) => ({ ...s, reviewVisible: true }) },
    ...starDelays.map((d, i) => ({
      at: 300 + d,
      apply: (s: SequenceState) => ({ ...s, starsFilled: i + 1 }),
    })),
    { at: 1100, apply: (s: SequenceState) => ({ ...s, threadProgress2: 1 }) },
    { at: 1700, apply: (s: SequenceState) => ({ ...s, replyCardVisible: true }) },
    { at: 2200, apply: (s: SequenceState) => ({ ...s, replyResolved: true }) },
    { at: 2700, apply: (s: SequenceState) => ({ ...s, demoCopied: true }) },
    { at: 3500, apply: (s: SequenceState) => ({ ...s, demoCopied: false, replayVisible: true }) },
  ];
}

/**
 * Drives the Review Loop choreography. The hook's initial state (used for
 * SSR and for clients without JS) is always the *final* state -- the
 * sequence only becomes "pending" and replays once an effect runs on the
 * client, so there's never a flash of missing content and reduced-motion
 * users never see movement.
 */
export function useReviewLoopSequence(
  rating: number,
  runToken: string,
  mode: "full" | "from-review"
): SequenceState {
  const [state, setState] = useState<SequenceState>(() => finalState(rating));
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];

    if (reduceMotion) {
      // Resetting to the (already-final) state here is intentional: this
      // effect exists to synchronize with an external timer-driven system
      // (the choreography's setTimeouts below), which is the documented
      // exception to this rule, not a derived-state anti-pattern.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(finalState(rating));
      return;
    }

    setState(mode === "full" ? PENDING_STATE : (s) => ({
      ...s,
      reviewVisible: false,
      starsFilled: 0,
      threadProgress2: 0,
      replyCardVisible: false,
      replyResolved: false,
      demoCopied: false,
      replayVisible: false,
    }));

    for (const step of buildSchedule(mode, rating)) {
      timeouts.current.push(setTimeout(() => setState((s) => step.apply(s)), step.at));
    }

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [runToken, mode, rating]);

  return state;
}
