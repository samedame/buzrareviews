import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY env var');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Defined here rather than as a pre-created Stripe Price object, so the
// price can change with a code edit instead of a trip to the Stripe
// dashboard -- Checkout Sessions accept inline price_data for recurring
// prices just as well as a stored Price ID.
export const SUBSCRIPTION_PRICE_USD_CENTS = 2900; // $29/mo
export const TRIAL_PERIOD_DAYS = 14;
