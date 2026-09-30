import { NextRequest, NextResponse } from 'next/server';
import { draftReviewReply } from '@/lib/anthropic';

// POST /api/preview-reply
// body: { businessName: string, tone: string }
// Generates two example AI replies (one to a positive review, one to a
// constructive one) using canned sample reviews, so an owner can see what
// a tone sounds like before saving it. Nothing here is stored, and these
// examples are never shown to real customers.
const SAMPLE_REVIEWS = {
  positive: {
    reviewerName: 'Jordan',
    rating: 5,
    reviewText:
      'Everyone here was so welcoming and the service was great from start to finish. Highly recommend.',
  },
  constructive: {
    reviewerName: 'Morgan',
    rating: 2,
    reviewText:
      "Had to wait a lot longer than expected and no one really explained what was going on. The staff was nice once they helped me though.",
  },
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const businessName = typeof body?.businessName === 'string' ? body.businessName.trim() : '';
  const tone = typeof body?.tone === 'string' ? body.tone.trim() : '';

  if (!businessName) {
    return NextResponse.json({ error: 'businessName is required' }, { status: 400 });
  }
  if (!tone) {
    return NextResponse.json({ error: 'tone is required' }, { status: 400 });
  }

  try {
    const [positive, constructive] = await Promise.all([
      draftReviewReply({ businessName, tone, ...SAMPLE_REVIEWS.positive }),
      draftReviewReply({ businessName, tone, ...SAMPLE_REVIEWS.constructive }),
    ]);
    return NextResponse.json({
      positive: { ...SAMPLE_REVIEWS.positive, reply: positive },
      constructive: { ...SAMPLE_REVIEWS.constructive, reply: constructive },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not generate a preview.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
