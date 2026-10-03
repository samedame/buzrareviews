import { site } from "@/config/site";

// Issue 1: "Email Sam" in the plan-included detail must be a real, visible
// link, not plain text -- PLAN_INCLUDED_DETAILED's `body` is a ReactNode
// (not just string) specifically so this one entry can carry it inline.
function emailSamLink() {
  return site.contactEmail ? (
    <a href={`mailto:${site.contactEmail}`} className="text-meadow underline underline-offset-[3px]">
      Email Sam
    </a>
  ) : (
    "Email Sam"
  );
}

export const FACTS_ROW = [
  "14-day free trial",
  "Set up in a few minutes",
  "Cancel anytime",
] as const;

export const FACTS_BAND = [
  { bold: "$29 a month, flat.", rest: "One plan with everything in it." },
  { bold: "No contract.", rest: "Cancel anytime." },
  { bold: "No sales call.", rest: "Start on your own, right now." },
  {
    bold: "Made in Bozeman, Montana.",
    rest: site.inPersonInBozeman
      ? "Stuck? Sam will set it up with you, on a call or in person."
      : "Stuck? Sam will set it up with you on a call.",
    href: "/setup",
  },
] as const;

export type HowItWorksStep = {
  number: number;
  title: string;
  body: string;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: 1,
    title: "Find your business.",
    body: "Search for your business on Google, confirm it's yours, and add your email. We email you a link to your dashboard.",
  },
  {
    number: 2,
    title: "Add a customer after their visit.",
    body: "Type their name and email. We send a short, friendly review request from your business name, with a button that opens your Google review form.",
  },
  {
    number: 3,
    title: "We check Google every day.",
    body: "New reviews show up in your dashboard with a reply already drafted in the tone you picked.",
  },
  {
    number: 4,
    title: "Copy, paste, done.",
    body: "Read the draft, change anything you like, and paste it into Google. We never post for you, so you always have the final word.",
  },
];

export type StatLine = {
  stat: string;
  answer: string;
};

export const WHY_IT_MATTERS_STATS: StatLine[] = [
  {
    stat: "47% of people won't use a business with fewer than 20 reviews.",
    answer: "So ask every customer, not just the ones you remember to ask.",
  },
  {
    stat: "74% only care about reviews from the last three months.",
    answer: "A request after every visit keeps new reviews coming in.",
  },
  {
    stat: "Generic, templated replies make 50% of people unlikely to choose a business.",
    answer: "Every draft is written for that review, in your tone.",
  },
];

export const BRIGHTLOCAL_SOURCE = {
  label: "Source: BrightLocal, Local Consumer Review Survey 2026",
  href: "https://www.brightlocal.com/research/local-consumer-review-survey/",
};

export const PLAN_INCLUDED = [
  "Review request emails, sent from your business name",
  "A daily check for new Google reviews",
  "A drafted reply for each new review, in the tone you choose",
  "Your dashboard, with every review and draft in one place",
  site.inPersonInBozeman
    ? "Help from a real person, on a call or in person in Bozeman"
    : "Help from a real person, on a call if you get stuck",
];

export const PLAN_INCLUDED_DETAILED = [
  {
    title: "Review request emails, sent from your business name",
    body: "Right after you add a customer, they get a short email asking for a Google review, sent from your business's name.",
  },
  {
    title: "A daily check for new Google reviews",
    body: "Once a day, BuzraReviews checks Google for anything new and brings it into your dashboard.",
  },
  {
    title: "A drafted reply for each new review, in the tone you choose",
    body: "Every new review gets a reply drafted in your tone, ready to copy and paste.",
  },
  {
    title: "Your dashboard, with every review and draft in one place",
    body: "One link to come back to anytime, with your reviews, drafts, and customers in one place.",
  },
  {
    title: site.inPersonInBozeman
      ? "Help from a real person, on a call or in person in Bozeman"
      : "Help from a real person, on a call if you get stuck",
    body: site.inPersonInBozeman ? (
      <>{emailSamLink()} anytime. If you get stuck, Sam will set it up with you on a call, or in person if you&apos;re in or around Bozeman.</>
    ) : (
      <>{emailSamLink()} anytime. If you get stuck, Sam will set it up with you on a call.</>
    ),
  },
];

export const PLAN_NOT_INCLUDED = [
  "Setup fees.",
  "An annual contract.",
  "Extra charges per employee.",
  "A sales call just to learn the price.",
];

// Fix pass 1, Phase 2: body branches on site.inPersonInBozeman, so it lives
// in the component (FounderNote.tsx) next to the flag, not here as a static
// string -- this file only holds the one line that never changes.
export const FOUNDER_NOTE = {
  signature: "Sam, founder of BuzraReviews",
};
