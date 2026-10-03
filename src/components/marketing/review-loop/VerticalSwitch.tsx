"use client";

import type { VerticalId } from "@/content/demo";
import { VERTICAL_DEMOS, VERTICAL_ORDER } from "@/content/demo";
import { site } from "@/config/site";

// Issue 7: the home page's switchable demo only shows dental while
// site.showHealthcare is true. /for/dental itself stays reachable by direct
// link regardless -- this filter only affects the home page's switch UI.
const SWITCH_ORDER = site.showHealthcare ? VERTICAL_ORDER : VERTICAL_ORDER.filter((id) => id !== "dental");

export function VerticalSwitch({
  value,
  onChange,
}: {
  value: VerticalId;
  onChange: (id: VerticalId) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Example business type" className="flex flex-wrap gap-2">
      {SWITCH_ORDER.map((id) => {
        const selected = id === value;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(id)}
            className={`rounded-[var(--radius-chip)] px-3 py-1.5 text-small font-medium transition-colors duration-[var(--dur-ui)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              selected ? "bg-gold-wash text-ink" : "text-ink-3 hover:text-ink"
            }`}
          >
            <span className="sm:hidden">{VERTICAL_DEMOS[id].switchLabelShort}</span>
            <span className="hidden sm:inline">{VERTICAL_DEMOS[id].switchLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
