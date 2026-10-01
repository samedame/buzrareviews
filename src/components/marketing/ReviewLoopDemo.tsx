"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, MotionConfig, m, AnimatePresence } from "motion/react";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { EmailCard } from "@/components/marketing/review-loop/EmailCard";
import { ReviewCard } from "@/components/marketing/review-loop/ReviewCard";
import { ReplyCard } from "@/components/marketing/review-loop/ReplyCard";
import { GoldThreadSegment } from "@/components/marketing/review-loop/GoldThreadSegment";
import { VerticalSwitch } from "@/components/marketing/review-loop/VerticalSwitch";
import { useReviewLoopSequence } from "@/components/marketing/review-loop/useReviewLoopSequence";
import { VERTICAL_DEMOS, MAX_PERSONALIZED_NAME_LENGTH, personalizeReply, type VerticalId } from "@/content/demo";

export function ReviewLoopDemo({
  initialVertical = "salon",
  showVerticalSwitch = true,
  personalizedName,
}: {
  initialVertical?: VerticalId;
  showVerticalSwitch?: boolean;
  personalizedName?: string;
}) {
  const [vertical, setVertical] = useState<VerticalId>(initialVertical);
  const [mode, setMode] = useState<"full" | "from-review">("full");
  const [counter, setCounter] = useState(0);

  const demo = VERTICAL_DEMOS[vertical];
  const runToken = `${vertical}-${counter}`;
  const seq = useReviewLoopSequence(demo.primaryReview.rating, runToken, mode);

  const trimmedName = personalizedName?.trim().slice(0, MAX_PERSONALIZED_NAME_LENGTH);
  const displayBusinessName = trimmedName || demo.businessName;
  const displayReply = trimmedName
    ? personalizeReply(demo.primaryReview.reply, demo.businessName, trimmedName)
    : demo.primaryReview.reply;

  function handleVerticalChange(id: VerticalId) {
    if (id === vertical) return;
    setVertical(id);
    setMode("from-review");
    setCounter((c) => c + 1);
  }

  function handleReplay() {
    setMode("full");
    setCounter((c) => c + 1);
  }

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ExampleTag />
            {showVerticalSwitch && <VerticalSwitch value={vertical} onChange={handleVerticalChange} />}
          </div>

          <div className="mt-4 flex flex-col items-start">
            <EmailCard
              businessName={displayBusinessName}
              customerFirstName={demo.primaryReview.customerFirstName}
              sentTime={demo.emailSentTime}
            />
            <GoldThreadSegment progress={seq.threadProgress1} />
            <ReviewCard
              visible={seq.reviewVisible}
              starsFilled={seq.starsFilled}
              rating={demo.primaryReview.rating}
              reviewerName={demo.primaryReview.reviewerName}
              text={demo.primaryReview.text}
            />
            <GoldThreadSegment progress={seq.threadProgress2} />
            <ReplyCard
              visible={seq.replyCardVisible}
              resolved={seq.replyResolved}
              demoCopied={seq.demoCopied}
              replyText={displayReply}
            />
          </div>

          <div className="mt-4 h-9">
            <AnimatePresence>
              {seq.replayVisible && (
                <m.button
                  type="button"
                  onClick={handleReplay}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-small font-medium text-meadow underline underline-offset-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Replay
                </m.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
