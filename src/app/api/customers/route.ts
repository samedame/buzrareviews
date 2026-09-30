import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendReviewRequestEmail } from '@/lib/resend';

// POST /api/customers
// body: { businessId: string, name?: string, email: string, phone?: string }
// Adds a customer and immediately sends them the review-request email.
// This is the endpoint a business's own signup/checkout flow calls per
// customer (or that Sam triggers manually during hand-onboarded pilots).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.businessId || !body?.email) {
    return NextResponse.json(
      { error: 'businessId and email are required' },
      { status: 400 }
    );
  }

  const { data: business, error: bizError } = await supabaseAdmin
    .from('businesses')
    .select('id, name, google_review_link')
    .eq('id', body.businessId)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const { data: customer, error: custError } = await supabaseAdmin
    .from('customers')
    .insert({
      business_id: business.id,
      name: body.name ?? null,
      email: body.email,
      phone: body.phone ?? null,
    })
    .select()
    .single();

  if (custError) {
    return NextResponse.json({ error: custError.message }, { status: 500 });
  }

  let emailResult;
  let status = 'sent';
  try {
    emailResult = await sendReviewRequestEmail({
      to: customer.email,
      customerName: customer.name ?? undefined,
      businessName: business.name,
      reviewLink: business.google_review_link,
    });
  } catch (err) {
    status = 'failed';
    // This was silently swallowed before, so a failed send left nothing to
    // debug. Resend's error (bad/unverified sending domain, invalid API
    // key, rate limit, etc.) now shows up in Vercel's function logs.
    console.error(`Review-request email failed for customer ${customer.id}:`, err);
  }

  await supabaseAdmin.from('review_requests').insert({
    business_id: business.id,
    customer_id: customer.id,
    status,
    resend_email_id: emailResult?.data?.id ?? null,
  });

  return NextResponse.json({ customer, emailStatus: status }, { status: 201 });
}
