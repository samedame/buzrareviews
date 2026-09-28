import { NextRequest, NextResponse } from 'next/server';
import { searchBusiness, reviewLinkFor } from '@/lib/places';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/businesses?id=<business id>        -> a single business
// GET /api/businesses?q=<search text>          -> Google Places candidates
// The id lookup backs the dashboard (subscription status, name); the q
// lookup backs onboarding, so the owner can pick the right business before
// a record is created.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('id, name, owner_email, subscription_status')
      .eq('id', id)
      .single();

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
  return NextResponse.json({ business: data }, { status: 201 });
}
