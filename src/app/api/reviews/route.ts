import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/reviews?businessId=...
// Lists reviews (with AI-drafted replies) for a business, newest first.
// Backs the owner-facing dashboard.
export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');
  if (!businessId) {
    return NextResponse.json({ error: 'Missing ?businessId=' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('business_id', businessId)
    .order('review_time', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ reviews: data });
}
