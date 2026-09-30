import { NextRequest, NextResponse } from 'next/server';
import { searchBusiness, reviewLinkFor } from '@/lib/places';
import { supabaseAdmin } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/resend';

// GET /api/businesses?id=<business id>        -> a single business
// GET /api/businesses?q=<search text>          -> Google Places candidates
// The id lookup backs the dashboard (subscription status, name, reply
// tone); the q lookup backs onboarding, so the owner can pick the right
// business before a record is created.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('id, name, owner_email, subscription_status, reply_tone')
      .eq('id', id)
      .single();

    // 42703 = undefined column: the reply_tone migration in
    // supabase/schema.sql (v1.2) hasn't been run against this database yet.
    // Fall back to the pre-migration column set rather than reporting every
    // business as not found.
    if (error?.code === '42703') {
      const fallback = await supabaseAdmin
        .from('businesses')
        .select('id, name, owner_email, subscription_status')
        .eq('id', id)
        .single();

      if (fallback.error || !fallback.data) {
        return NextResponse.json({ error: 'Business not found' }, { status: 404 });
      }
      return NextResponse.json({ business: { ...fallback.data, reply_tone: null } });
    }

    if (error || !data) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    return NextResponse.json({ business: data });
  }

  const q = req.nextUrl.searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'Missing ?q= search query or ?id=' }, { status: 400 });
  }
  try {
    const results = await searchBusiness(q);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/businesses
// body: { placeId: string, name: string, ownerEmail: string, ownerPhone?: string, address?: string }
// Creates a business record from a Places search result the owner confirmed.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.placeId || !body?.name || !body?.ownerEmail) {
    return NextResponse.json(
      { error: 'placeId, name, and ownerEmail are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('businesses')
    .insert({
      name: body.name,
      owner_email: body.ownerEmail,
      owner_phone: body.ownerPhone ?? null,
      google_place_id: body.placeId,
      google_review_link: reviewLinkFor(body.placeId),
      address: body.address ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Best-effort: the business record is already created either way, so a
  // failed confirmation email shouldn't fail signup. The caller gets
  // emailStatus back so the UI can tell the owner if it didn't go out,
  // instead of promising an email that never arrives.
  let emailStatus: 'sent' | 'failed' = 'sent';
  try {
    await sendConfirmationEmail({
      to: data.owner_email,
      businessName: data.name,
      businessId: data.id,
    });
  } catch (err) {
    emailStatus = 'failed';
    console.error(`Confirmation email failed for business ${data.id}:`, err);
  }

  return NextResponse.json({ business: data, emailStatus }, { status: 201 });
}

// PATCH /api/businesses?id=<business id>
// body: { replyTone: string }
// Updates how AI-drafted replies should sound for this business. Empty or
// whitespace-only tone is rejected rather than silently stored, since an
// empty reply_tone would fall back to the default without the owner
// realizing their edit didn't take.
export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing ?id=' }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const replyTone = typeof body?.replyTone === 'string' ? body.replyTone.trim() : '';
  if (!replyTone) {
    return NextResponse.json({ error: 'replyTone is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('businesses')
    .update({ reply_tone: replyTone })
    .eq('id', id)
    .select('id, name, owner_email, subscription_status, reply_tone')
    .single();

  if (error?.code === '42703') {
    return NextResponse.json(
      { error: "The reply_tone column hasn't been added to the database yet. Run the latest supabase/schema.sql in the Supabase SQL editor, then try again." },
      { status: 500 }
    );
  }
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Business not found' }, { status: 404 });
  }
  return NextResponse.json({ business: data });
}
