// All content on this page is typed data so Sam can edit words without
// touching layout. Every business, reviewer, and review below is fictional
// (MASTER_PROMPT.md G4) -- every surface that renders this data must show
// an ExampleTag.
//
// The email copy mirrors src/lib/resend.ts's sendReviewRequestEmail word
// for word (verified against the source on 2026-09-30). The reply rules
// (2-4 sentences, thank by first name, apology without excuses for low
// ratings, no corporate phrases, sign off with just the business name)
// mirror src/lib/anthropic.ts's draftReviewReply prompt.

export type Tone = "friendly" | "professional" | "casual";

export const TONE_LABELS: Record<Tone, string> = {
  friendly: "Friendly & warm",
  professional: "Professional",
  casual: "Casual & upbeat",
};

export const TONE_ORDER: Tone[] = ["friendly", "professional", "casual"];

export function emailSubject(businessName: string) {
  return `How was your visit to ${businessName}?`;
}

export function emailGreeting(firstName?: string) {
  return firstName ? `Hi ${firstName},` : "Hi,";
}

export function emailBody(businessName: string) {
  return `Thanks for visiting ${businessName}! We'd really appreciate it if you could leave us a quick Google review. It takes less than a minute and helps a small business a lot.`;
}

export const EMAIL_BUTTON_LABEL = "Leave a review";

export function emailSignoff(businessName: string) {
  return ["Thank you!", businessName] as const;
}

export type VerticalId = "salon" | "dental" | "restaurant";

export type DemoReview = {
  reviewerName: string;
  customerFirstName?: string; // used to personalize the email card; omitted for dental (no names in replies)
  rating: number;
  text: string;
  reply: string;
};

export type VerticalDemo = {
  id: VerticalId;
  switchLabel: string;
  switchLabelShort: string;
  businessName: string;
  emailSentTime: string;
  reviewArrivedTime: string;
  primaryReview: DemoReview;
  secondaryReview: DemoReview;
};

export const VERTICAL_DEMOS: Record<VerticalId, VerticalDemo> = {
  salon: {
    id: "salon",
    switchLabel: "Salon",
    switchLabelShort: "Salon",
    businessName: "Juniper Hair Studio",
    emailSentTime: "9:14 AM",
    reviewArrivedTime: "9:52 AM",
    primaryReview: {
      reviewerName: "Maya R.",
      customerFirstName: "Maya",
      rating: 5,
      text: "Bri gave me the best cut I've had in years. Booked my next one before I left.",
      reply:
        "Thank you, Maya! Bri is going to be so happy to read this. We're glad you love the cut, and we can't wait to see you at your next appointment. Juniper Hair Studio",
    },
    secondaryReview: {
      reviewerName: "Nate K.",
      customerFirstName: "Nate",
      rating: 2,
      text: "Waited 25 minutes past my appointment time and nobody said anything. The cut itself was fine.",
      reply:
        "Nate, we're sorry about the wait, and even more sorry that nobody kept you in the loop. That's not how we want anyone to feel here. Please give us a call so we can make it right on your next visit. Juniper Hair Studio",
    },
  },
  dental: {
    id: "dental",
    switchLabel: "Dental office",
    switchLabelShort: "Dental",
    businessName: "Northfork Family Dental",
    emailSentTime: "2:08 PM",
    reviewArrivedTime: "4:45 PM",
    primaryReview: {
      reviewerName: "Dana L.",
      rating: 5,
      text: "Everyone was kind and explained everything. First time I haven't dreaded going to the dentist.",
      reply:
        "Thank you for taking the time to share this. We're glad our team made you feel comfortable, and we appreciate the kind words. Northfork Family Dental",
    },
    secondaryReview: {
      reviewerName: "Chris P.",
      rating: 2,
      text: "Had to wait almost 40 minutes past my appointment time.",
      reply:
        "We're sorry for the long wait. That isn't the experience we want for anyone who visits us. Please call our office so we can talk it through. Northfork Family Dental",
    },
  },
  restaurant: {
    id: "restaurant",
    switchLabel: "Restaurant",
    switchLabelShort: "Restaurant",
    businessName: "Copper Kettle Cafe",
    emailSentTime: "12:32 PM",
    reviewArrivedTime: "1:10 PM",
    primaryReview: {
      reviewerName: "Luis M.",
      customerFirstName: "Luis",
      rating: 5,
      text: "Best breakfast burrito in town, and they remembered my order the second time I came in.",
      reply:
        "Luis, thank you! Remembering your order is our favorite kind of compliment. We'll have the burrito ready next time. Copper Kettle Cafe",
    },
    secondaryReview: {
      reviewerName: "Priya S.",
      customerFirstName: "Priya",
      rating: 3,
      text: "Food was great but my pickup order was missing the side I paid for.",
      reply:
        "Priya, we're sorry we missed your side. That's on us. Please reach out and we'll make it right on your next order. Copper Kettle Cafe",
    },
  },
};

export const VERTICAL_ORDER: VerticalId[] = ["salon", "dental", "restaurant"];

export const MAX_PERSONALIZED_NAME_LENGTH = 40;

// Every reply template ends with "... {businessName}" as its sign-off, and
// none of the bodies otherwise repeat the name, so swapping only the last
// occurrence personalizes the sign-off without touching the drafted text.
export function personalizeReply(reply: string, originalName: string, newName: string): string {
  const index = reply.lastIndexOf(originalName);
  if (index === -1) return reply;
  return reply.slice(0, index) + newName + reply.slice(index + originalName.length);
}

// The Tone section (home page, F2 section 5) is salon-only and shows how
// the same two reviews read in each of the three tone presets.
export type ToneReview = {
  reviewerName: string;
  customerFirstName: string;
  rating: number;
  text: string;
  replies: Record<Tone, string>;
};

export const TONE_DEMO_BUSINESS = "Juniper Hair Studio";

export const TONE_DEMO_FIVE_STAR: ToneReview = {
  reviewerName: "Maya R.",
  customerFirstName: "Maya",
  rating: 5,
  text: "Bri gave me the best cut I've had in years. Booked my next one before I left.",
  replies: {
    friendly:
      "Thank you, Maya! Bri is going to be so happy to read this. We're glad you love the cut, and we can't wait to see you at your next appointment. Juniper Hair Studio",
    professional:
      "Thank you for the kind review, Maya. We're glad you're happy with your cut, and we'll pass your compliments along to Bri. We look forward to seeing you at your next appointment. Juniper Hair Studio",
    casual: "Maya, this made our day! Bri's going to be smiling all week. See you next time! Juniper Hair Studio",
  },
};

export const TONE_DEMO_TWO_STAR: ToneReview = {
  reviewerName: "Nate K.",
  customerFirstName: "Nate",
  rating: 2,
  text: "Waited 25 minutes past my appointment time and nobody said anything. The cut itself was fine.",
  replies: {
    friendly:
      "Nate, we're sorry about the wait, and even more sorry that nobody kept you in the loop. That's not how we want anyone to feel here. Please give us a call so we can make it right on your next visit. Juniper Hair Studio",
    professional:
      "Thank you for the feedback, Nate. We apologize for the delay and for not keeping you informed while you waited. We'd appreciate the chance to make it right, so please contact us directly. Juniper Hair Studio",
    casual:
      "Nate, that wait wasn't okay, and we should have told you what was going on. Sorry about that. Give us a call and we'll make your next visit a lot smoother. Juniper Hair Studio",
  },
};
