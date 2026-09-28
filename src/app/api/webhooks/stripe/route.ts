import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/webhooks/stripe
// Stripe sends subscription lifecycle events here. Set this URL
// (https://buzrareviews.com/api/webhooks/stripe) as a webhook endpoint in
// the Stripe Dashboard (Developers -> Webhooks), subscribed to at least:
//   checkout.session.completed
//   customer.subscription.updated
//   customer.subscription.deleted
// then copy the endpoint's signing secret into Vercel as STRIPE_WEBHOOK_SECRET.
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing STRIPE_WEBHOOK_SECRET env var');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error('Stripe webhook signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const businessId = session.client_reference_id;
      const customerId =
        typeof session.customer === 'string' ? session.customer : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

      if (businessId && customerId) {
        const { error } = await supabaseAdmin
          .from('businesses')
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId ?? null,
            subscription_status: 'trialing',
          })
          .eq('id', businessId);

        if (error) {
          console.error('Failed to record checkout completion:', error);
        }
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const businessId = subscription.metadata?.business_id;

      if (businessId) {
        const { error } = await supabaseAdmin
          .from('businesses')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status:
              event.type === 'customer.subscription.deleted' ? 'canceled' : subscription.status,
          })
          .eq('id', businessId);

        if (error) {
          console.error('Failed to update subscription status:', error);
        }
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
