"use client";

import { useEffect, useRef, useState } from "react";
import { m } from "motion/react";
import { Icon } from "@/components/ui/Icon";

export function ReplyCard({
  visible,
  resolved,
  demoCopied,
  replyText,
}: {
  visible: boolean;
  resolved: boolean;
  demoCopied: boolean;
  replyText: string;
}) {
  const [realCopied, setRealCopied] = useState(false);
  const copied = demoCopied || realCopied;

  // If `resolved` is already true on the very first render (the SSR-safe
  // default, before the client-only pending-state effect in
  // useReviewLoopSequence has run), this text must not blur in -- that
  // effect fires moments later and would cut the entrance transition off
  // mid-flight anyway, which is exactly the "flicker" E7 bans.
  const hasMounted = useRef(false);
  useEffect(() => {
    hasMounted.current = true;
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(replyText);
    } catch {
      // Clipboard access can fail (permissions, insecure context); the
      // button still flips to "Copied" so the demo doesn't look broken,
      // since this is example content, not a real action with consequences.
    }
    setRealCopied(true);
    setTimeout(() => setRealCopied(false), 2000);
  }

  return (
    <m.div
      className="paper-card w-full p-5"
      initial={false}
      animate={visible ? { opacity: 1, visibility: "visible" } : { opacity: 0, visibility: "hidden" }}
      transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
    >
      <p className="text-card-micro text-ink-3">Reply drafted</p>

      {resolved ? (
        <m.p
          key="reply-text"
          /* eslint-disable-next-line react-hooks/refs -- intentional read of the mount flag; see comment above */
          initial={hasMounted.current ? { opacity: 0, filter: "blur(4px)" } : false}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.24 }}
          className="text-small text-ink mt-2"
        >
          {replyText}
        </m.p>
      ) : (
        <div className="mt-3 flex flex-col gap-2" aria-hidden="true">
          <div className="h-3 w-full rounded bg-line" />
          <div className="h-3 w-5/6 rounded bg-line" />
          <div className="h-3 w-2/3 rounded bg-line" />
        </div>
      )}

      {resolved && (
        <button
          type="button"
          onClick={handleCopy}
          className="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-ink px-4 py-2 text-small font-medium text-ink transition-transform duration-[var(--dur-press)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <Icon name={copied ? "check" : "copy"} size={16} />
          {copied ? "Copied" : "Copy reply"}
        </button>
      )}
    </m.div>
  );
}
