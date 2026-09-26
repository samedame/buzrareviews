import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) throw new Error('Missing ANTHROPIC_API_KEY env var');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function draftReviewReply(opts: {
  businessName: string;
  reviewerName: string;
  rating: number;
  reviewText: string;
}): Promise<string> {
  const { businessName, reviewerName, rating, reviewText } = opts;

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You are drafting a short, genuine-sounding owner reply to a Google review for a small local business called "${businessName}".

Reviewer: ${reviewerName}
Rating: ${rating}/5
Review text: """${reviewText || '(no written text, rating only)'}"""

Write a reply the business owner can post as-is or lightly edit. Rules:
- 2-4 sentences, warm and specific to what they said (don't be generic)
- Thank them by first name if given
- If rating is 4-5: express genuine thanks, mention something specific from their review if possible
- If rating is 1-3: apologize sincerely without being defensive, briefly invite them to reach out directly to make it right, don't make excuses
- No corporate/robotic phrases like "we value your feedback" or "your satisfaction is our priority"
- Sign off with just the business name, not "Team" or "Management"
- Output ONLY the reply text, nothing else`,
      },
    ],
  });

  const block = msg.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}
