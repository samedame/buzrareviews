// Pure constants, no side effects and no env var dependency, so marketing
// pages can import pricing without pulling in the Stripe client (and its
// throw-on-missing-env-var behavior) at build time.
export const SUBSCRIPTION_PRICE_USD_CENTS = 2900; // $29/mo
export const TRIAL_PERIOD_DAYS = 14;
