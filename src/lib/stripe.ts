import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY env var');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Defined in src/lib/pricing.ts rather than as a pre-created Stripe Price
// object, so the price can change with a code edit instead of a trip to the
// Stripe dashboard -- Checkout Sessions accept inline price_data for
// recurring prices just as well as a stored Price ID. Re-exported here so
// existing callers of '@/lib/stripe' are unaffected.
export { SUBSCRIPTION_PRICE_USD_CENTS, TRIAL_PERIOD_DAYS } from './pricing';
