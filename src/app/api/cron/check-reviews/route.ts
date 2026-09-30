import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getPlaceReviews } from '@/lib/places';
import { draftReviewReply } from '@/lib/anthropic';

// GET /api/cron/check-reviews
// Called on a schedule by Vercel Cron (see vercel.json). For every business,
// pulls current reviews from the Places API, inserts any not already seen
// (by Google's review id), and generates an AI-drafted reply for each new
// one. Protected by CRON_SECRET so it can't be triggered by anyone else.
//
// See the note in src/lib/places.ts: Places API only returns up to 5
// reviews per business, so this can miss reviews on a business that gets
// several between checks. Acceptable for v1 pilot volume; not a permanent
// fix.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let businesses: { id: string; name: string; google_place_id: string | null; reply_tone?: string | null }[] | null;
  {
    const primary = await supabaseAdmin
      .from('businesses')
      .select('id, name, google_place_id, reply_tone');

    // 42703 = undefined column: the reply_tone migration in
    // supabase/schema.sql (v1.2) hasn't been run yet. Fall back to the
    // default tone for every business rather than failing the whole cron
    // run until it is.
    if (primary.error?.code === '42703') {
      const fallback = await supabaseAdmin.from('businesses').select('id, name, google_place_id');
      if (fallback.error) {
        return NextResponse.json({ error: fallback.error.message }, { status: 500 });
      }
      businesses = fallback.data;
    } else if (primary.error) {
      return NextResponse.json({ error: primary.error.message }, { status: 500 });
    } else {
      businesses = primary.data;
    }
  }

  const results: Record<string, { newReviews: number; error?: string }> = {};

  for (const business of businesses ?? []) {
    if (!business.google_place_id) continue;
    try {
      const reviews = await getPlaceReviews(business.google_place_id);
      let newCount = 0;

      for (const review of reviews) {
        // Insert only if this google_review_id isn't already stored
        // (unique constraint on (business_id, google_review_id) enforces this).
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('reviews')
          .insert({
            business_id: business.id,
            google_review_id: review.id,
            author_name: review.authorName,
            rating: review.rating,
            review_text: review.text,
            review_time: review.publishTime,
          })
          .select()
          .single();

        // insertError with code 23505 = unique violation = already seen, skip silently
        if (insertError) {
          if ((insertError as any).code !== '23505') {
            console.error(`Insert failed for review ${review.id}:`, insertError.message);
          }
          continue;
        }

        newCount++;

        // Generate the AI-drafted reply for this genuinely new review.
        try {
          const draft = await draftReviewReply({
            businessName: business.name,
            reviewerName: review.authorName,
            rating: review.rating,
            reviewText: review.text,
            tone: business.reply_tone ?? undefined,
          });
          await supabaseAdmin
            .from('reviews')
            .update({ ai_draft_reply: draft, draft_generated_at: new Date().toISOString() })
            .eq('id', inserted.id);
        } catch (draftErr: any) {
          console.error(`Draft generation failed for review ${review.id}:`, draftErr.message);
        }
      }

      await supabaseAdmin
        .from('businesses')
        .update({ last_review_check_at: new Date().toISOString() })
        .eq('id', business.id);

      results[business.id] = { newReviews: newCount };
    } catch (err: any) {
      results[business.id] = { newReviews: 0, error: err.message };
    }
  }

  return NextResponse.json({ checked: Object.keys(results).length, results });
}
