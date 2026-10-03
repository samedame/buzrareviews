import type { VerticalId } from "./demo";

export type VerticalSlug = "salons" | "dental" | "restaurants";

export const VERTICAL_SLUGS: VerticalSlug[] = ["salons", "dental", "restaurants"];

export const SLUG_TO_DEMO_ID: Record<VerticalSlug, VerticalId> = {
  salons: "salon",
  dental: "dental",
  restaurants: "restaurant",
};

export type VerticalPoint = {
  title: string;
  body: string;
  // Fix pass 2, issue 1: set on the one point per page that cites a
  // BrightLocal statistic, so the template can render the source line
  // directly under it (not under the other two, non-statistic points).
  hasSource?: boolean;
};

export type VerticalPageContent = {
  slug: VerticalSlug;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;
  points: VerticalPoint[];
  note: string;
  faqIds: string[];
};

export const VERTICAL_PAGES: Record<VerticalSlug, VerticalPageContent> = {
  salons: {
    slug: "salons",
    navLabel: "Salons and barbershops",
    metaTitle: "Google reviews for salons and barbershops",
    metaDescription:
      "Send every client a friendly review request after their appointment and get a reply drafted for every new Google review. $29 a month.",
    h1: "More Google reviews for your salon, without the awkward ask.",
    lead: "Add a client after their appointment and BuzraReviews emails them a friendly review request from your salon's name. When the review comes in, a reply is already drafted in your voice.",
    points: [
      {
        title: "Busy Saturdays, handled.",
        body: "Asking every client at checkout is easy to forget when the chairs are full. Add them in a few seconds afterward and the request goes out right away.",
      },
      {
        title: "Stylists get the credit.",
        body: "Clients often name their stylist. Drafted replies can thank the stylist right back, so your team sees the love too.",
      },
      {
        title: "Fresh reviews win new clients.",
        body: "74% of people only care about reviews from the last three months. A request after every appointment keeps yours current.",
        hasSource: true,
      },
    ],
    note: "Tip: set a tone like ‘Warm and short. Mention the stylist by name when the review does.’",
    faqIds: ["what-customers-get", "post-for-me", "ok-to-ask"],
  },
  dental: {
    slug: "dental",
    navLabel: "Dental offices",
    metaTitle: "Google reviews for dental offices",
    metaDescription:
      "Friendly review requests after each visit and careful, professional reply drafts you approve before posting. $29 a month, no contract.",
    h1: "Patient reviews, handled with care.",
    lead: "Send a friendly review request after each visit and get a careful, professional reply drafted for every new Google review. You read every word before anything is posted.",
    points: [
      {
        title: "Careful replies, your rules.",
        body: "Set your tone once, for example: ‘Professional and warm. Don't use names, don't mention treatment, and never confirm that someone is a patient.’ Drafts follow it, and you approve each one.",
      },
      {
        title: "Nothing new for the front desk.",
        body: "Your team adds a patient's name and email in a few seconds. That's the whole workflow.",
      },
      {
        title: "Recent reviews matter most.",
        body: "74% of people only care about reviews from the last three months. A request after each visit keeps yours current.",
        hasSource: true,
      },
    ],
    note: "Healthcare offices have extra rules about what a reply can say. Keep replies general, and don't confirm that anyone is a patient. BuzraReviews doesn't give legal advice.",
    faqIds: ["post-for-me", "bad-review", "getting-started"],
  },
  restaurants: {
    slug: "restaurants",
    navLabel: "Restaurants and cafes",
    metaTitle: "Google reviews for restaurants and cafes",
    metaDescription:
      "Use the guest emails you already have to ask for Google reviews, and answer every review in your voice. $29 a month.",
    h1: "Turn regulars into reviews.",
    lead: "If you have guest emails from reservations, pickup orders, or catering, BuzraReviews sends a friendly review request and drafts a reply to every new Google review in your voice.",
    points: [
      {
        title: "Works with the emails you already have.",
        body: "Reservations, online orders, catering, loyalty sign-ups. Add a guest's email and the request goes out.",
      },
      {
        title: "No review sits unanswered.",
        body: "New reviews show up once a day with a reply drafted, so the busy weeks don't leave reviews hanging.",
      },
      {
        title: "Your voice, not a template.",
        body: "Generic, templated replies make 50% of people unlikely to choose a business. Each draft answers what that guest actually said.",
        hasSource: true,
      },
    ],
    note: "Walk-in only, with no guest emails? BuzraReviews isn't the right fit yet.",
    faqIds: ["good-fit", "how-often", "text-messages"],
  },
};
