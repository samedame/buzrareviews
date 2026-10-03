"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LazyMotion, domAnimation, MotionConfig, m } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/Stars";
import { HOW_IT_WORKS_STEPS } from "@/content/home";

function useDelayedFlag(play: boolean, delay: number) {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => setFlag(true), delay);
    return () => clearTimeout(t);
  }, [play, delay]);
  return flag;
}

function StepVignette({ children }: { children: (play: boolean) => ReactNode }) {
  const [play, setPlay] = useState(false);
  return (
    <m.div
      className="paper-card p-5"
      onViewportEnter={() => setPlay(true)}
      viewport={{ once: true, amount: 0.4 }}
    >
      {children(play)}
    </m.div>
  );
}

function FindBusinessVignette({ play }: { play: boolean }) {
  const selected = useDelayedFlag(play, 500);
  return (
    <div>
      <div className="rounded-[var(--radius-control)] border border-line px-3 py-2 text-small text-ink-2">
        Juniper Hair Studio, Bozeman
      </div>
      <m.div
        className="mt-2 rounded-[var(--radius-control)] border px-3 py-2 text-small"
        animate={{
          borderColor: selected ? "var(--color-gold-edge)" : "var(--color-line)",
          backgroundColor: selected ? "var(--color-gold-wash)" : "var(--color-paper)",
        }}
        transition={{ duration: 0.2 }}
      >
        Juniper Hair Studio, Main Street, Bozeman, MT
      </m.div>
    </div>
  );
}

function AddCustomerVignette({ play }: { play: boolean }) {
  const sent = useDelayedFlag(play, 700);
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="rounded-[var(--radius-control)] border border-line px-3 py-2 text-small text-ink-2">Maya R.</div>
        <div className="rounded-[var(--radius-control)] border border-line px-3 py-2 text-small text-ink-2">maya@example.com</div>
      </div>
      <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-gold px-4 py-2 text-small font-medium text-ink">
        {sent ? (
          <>
            <Icon name="check" size={16} />
            Sent
          </>
        ) : (
          "Add & send review request"
        )}
      </div>
    </div>
  );
}

function DashboardRowVignette({ play }: { play: boolean }) {
  const drafted = useDelayedFlag(play, 700);
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-line px-3 py-3">
      <div>
        <Stars rating={5} size={16} />
        <p className="mt-1 text-small text-ink-2">Dana L.</p>
      </div>
      <m.span
        animate={{ opacity: drafted ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-small font-medium text-meadow"
      >
        Reply drafted
      </m.span>
    </div>
  );
}

function CopyPasteVignette({ play }: { play: boolean }) {
  const copied = useDelayedFlag(play, 700);
  return (
    <div className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-ink px-4 py-2 text-small font-medium text-ink">
      <Icon name={copied ? "check" : "copy"} size={16} />
      {copied ? "Copied" : "Copy reply"}
    </div>
  );
}

const VIGNETTES = [FindBusinessVignette, AddCustomerVignette, DashboardRowVignette, CopyPasteVignette];

export function HowItWorks() {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-16 sm:py-28">
          <Container>
            <h2 id="how-it-works-heading" className="text-h2 text-ink">
              How it works
            </h2>
            <p className="text-lead text-ink-2 mt-4">A few minutes to set up. A few seconds a day after that.</p>

            <div className="mt-10 flex flex-col gap-14">
              {HOW_IT_WORKS_STEPS.map((step, i) => {
                const Vignette = VIGNETTES[i];
                const reversed = i % 2 === 1;
                return (
                  <div key={step.number} className="grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-12">
                    <div className={reversed ? "sm:order-2" : ""}>
                      <span className="text-small text-ink-3">{step.number}</span>
                      <h3 className="text-h3 text-ink mt-1">{step.title}</h3>
                      <p className="text-body text-ink-2 mt-2">{step.body}</p>
                    </div>
                    <div className={reversed ? "sm:order-1" : ""}>
                      <StepVignette>{(play) => <Vignette play={play} />}</StepVignette>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
