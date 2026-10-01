import { SUBSCRIPTION_PRICE_USD_CENTS, TRIAL_PERIOD_DAYS } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PLAN_INCLUDED } from "@/content/home";

export function PlanCard() {
  const price = Math.round(SUBSCRIPTION_PRICE_USD_CENTS / 100);

  return (
    <div className="paper-card p-8">
      <p className="flex items-baseline gap-1">
        <span className="text-h2 tabular-nums text-ink">${price}</span>
        <span className="text-body text-ink-2">/month</span>
      </p>
      <p className="text-small text-ink-2 mt-1">after your {TRIAL_PERIOD_DAYS}-day free trial</p>

      <ul className="mt-6 flex flex-col gap-3">
        {PLAN_INCLUDED.map((item) => (
          <li key={item} className="flex items-start gap-2 text-small text-ink">
            <Icon name="check" size={18} className="mt-0.5 shrink-0 text-meadow" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button href="/onboarding" size="large" className="w-full">
          Start free trial
        </Button>
      </div>

      <p className="mt-4 text-small text-ink-3">
        You&apos;ll add a card when you start your trial. You won&apos;t be charged until it ends, and you can
        cancel anytime.
      </p>
    </div>
  );
}
