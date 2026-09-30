import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) throw new Error('Missing ANTHROPIC_API_KEY env var');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Matches the default value on businesses.reply_tone in supabase/schema.sql,
// so a business with no tone set yet (or a caller that omits it) drafts
// replies exactly the way v1 always did.
export const DEFAULT_REPLY_TONE =
  'friendly and warm, like a small business owner writing personally';

export async function draftReviewReply(opts: {
  businessName: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
  tone?: string;
}): Promise<string> {
  const { businessName, reviewerName, rating, reviewText } = opts;
  const tone = opts.tone?.trim() || DEFAULT_REPLY_TONE;

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You are drafting a short owner reply to a Google review for a small local business called "${businessName}".

Reviewer: ${reviewerName}
Rating: ${rating}/5
Review text: """${reviewText || '(no written text, rating only)'}"""

Tone: ${tone}

Write a reply the business owner can post as-is or lightly edit, matching the tone described above. Rules:
- 2-4 sentences, specific to what they said (don't be generic)
- Thank them by first name if given
- If rating is 4-5: express genuine thanks, mention something specific from their review if possible
- If rating is 1-3: apologize sincerely without being defensive, briefly invite them to reach out directly to make it right, don't make excuses
- No corporate/robotic phrases like "we value your feedback" or "your satisfaction is our priority"
- No em dashes, use a period or comma instead
- Sign off with just the business name, not "Team" or "Management"
- Output ONLY the reply text, nothing else`,
      },
    ],
  });

  const block = msg.content[0];
  const text = block.type === 'text' ? block.text.trim() : '';
  // Belt-and-suspenders: the prompt already says no em dashes, but these
  // replies get posted publicly on the business's Google listing, so strip
  // any that slip through rather than relying on the model alone.
  return text.replace(/\s*—\s*/g, ', ').replace(/,\s*,/g, ',');
}
