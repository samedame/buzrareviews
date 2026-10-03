import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';

// POST /api/unsubscribe?c=<customerId>&t=<token>
// c/t always arrive in the query string -- both the real unsubscribe link
// and email clients' RFC 8058 one-click POST (body "List-Unsubscribe=One-Click")
// hit this same URL, so the handler never needs to read the request body.
const QuerySchema = z.object({
  c: z.string().uuid(),
  t: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const parsed = QuerySchema.safeParse({
    c: req.nextUrl.searchParams.get('c'),
    t: req.nextUrl.searchParams.get('t'),
  });

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { c: customerId, t: token } = parsed.data;

  if (!verifyUnsubscribeToken(customerId, token)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { data: customer, error: customerError } = await supabaseAdmin
    .from('customers')
    .select('id, business_id, email')
    .eq('id', customerId)
    .single();

  if (customerError || !customer) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const { data: business } = await supabaseAdmin
    .from('businesses')
    .select('name')
    .eq('id', customer.business_id)
    .single();

  const { error: upsertError } = await supabaseAdmin.from('email_suppressions').upsert(
    { business_id: customer.business_id, email: customer.email.trim().toLowerCase() },
    { onConflict: 'business_id,email', ignoreDuplicates: true }
  );

  if (upsertError) {
    console.error(`Failed to record unsubscribe for customer ${customerId}:`, upsertError);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, business: business?.name ?? null });
}
