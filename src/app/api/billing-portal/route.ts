import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { buildDashboardLink } from '@/lib/resend';

// POST /api/billing-portal
// body: { businessId: string }
// Creates a Stripe customer portal session so an owner can cancel, change
// their card, or see invoices (issue 9) without emailing Sam for it.
const RequestSchema = z.object({
  businessId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
  }

  const { data: business, error } = await supabaseAdmin
    .from('businesses')
    .select('id, name, stripe_customer_id')
    .eq('id', parsed.data.businessId)
    .single();

  if (error || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  if (!business.stripe_customer_id) {
    return NextResponse.json({ ok: false, reason: 'no_subscription' }, { status: 409 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: business.stripe_customer_id,
    return_url: buildDashboardLink(business.id, business.name),
  });

  return NextResponse.json({ url: session.url });
}
