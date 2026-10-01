"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export function TrackedStartTrialLink({ className, location }: { className?: string; location: string }) {
  return (
    <Link
      href="/onboarding"
      className={className}
      onClick={() => track("start_trial_click", { location })}
    >
      Start free trial
    </Link>
  );
}
