import { NextRequest, NextResponse } from 'next/server';
import { stripe, SUBSCRIPTION_PRICE_USD_CENTS, TRIAL_PERIOD_DAYS } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/checkout
// body: { businessId: string }
// Creates a Stripe Checkout Session for the BuzraReviews subscription
// ($29/mo, 14-day free trial) and returns the URL to send the owner to.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.businessId) {
    return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
  }

  const { data: business, error } = await supabaseAdmin
    .from('businesses')
    .select('id, name, owner_email, stripe_customer_id, subscription_status')
    .eq('id', body.businessId)
    .single();

  if (error || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  if (business.subscription_status === 'active' || business.subscription_status === 'trialing') {
    return NextResponse.json(
      { error: 'This business already has a subscription' },
      { status: 409 }
    );
  }

  const origin = req.nextUrl.origin;
  const businessName = encodeURIComponent(business.name);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: business.stripe_customer_id ?? undefined,
    customer_email: business.stripe_customer_id ? undefined : business.owner_email,
    client_reference_id: business.id,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: SUBSCRIPTION_PRICE_USD_CENTS,
          recurring: { interval: 'month' },
          product_data: { name: 'BuzraReviews' },
        },
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: TRIAL_PERIOD_DAYS,
      metadata: { business_id: business.id },
    },
    metadata: { business_id: business.id },
    success_url: `${origin}/dashboard?businessId=${business.id}&businessName=${businessName}&subscribed=true`,
    cancel_url: `${origin}/dashboard?businessId=${business.id}&businessName=${businessName}`,
  });

  if (!session.url) {
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
