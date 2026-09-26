import { NextRequest, NextResponse } from 'next/server';
import { searchBusiness, reviewLinkFor } from '@/lib/places';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/businesses?q=<search text>
// Looks up candidate businesses via Google Places so onboarding can pick
// the right one before creating a business record.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) {
    return NextResponse.json({ error: 'Missing ?q= search query' }, { status: 400 });
  }
  try {
    const results = await searchBusiness(q);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
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
