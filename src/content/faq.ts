export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

// Appendix X3. Home uses all of these in this order except "how-many".
// /pricing uses: trial, contract, how-many, what-customers-get.
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "ok-to-ask",
    question: "Is it OK to ask customers for Google reviews?",
    answer:
      "Yes. Google encourages businesses to ask. What Google doesn't allow is offering anything in return for a review, asking only your happy customers, or pressuring people while they're still at your business. BuzraReviews sends the same friendly email to every customer you add, after their visit, with nothing offered in return.",
    link: { label: "Read Google's review policy", href: "https://support.google.com/business/answer/7400114" },
  },
  {
    id: "ask-at-counter",
    question: "Can't I just ask at the counter?",
    answer:
      "You can ask, but Google's rules say businesses shouldn't require or pressure people to leave reviews while they're still on site. A friendly email after the visit is easier on everyone, and people can write the review when they have a minute.",
  },
  {
    id: "what-customers-get",
    question: "What do my customers get?",
    answer:
      "A short email from your business name with the subject “How was your visit to [your business]?” and a “Leave a review” button that opens your Google review form. No survey first and no hoops.",
  },
  {
    id: "post-for-me",
    question: "Do you post replies for me?",
    answer:
      "No. You copy the drafted reply and paste it into Google yourself. It takes a few seconds, and nothing goes public without you reading it first.",
  },
  {
    id: "how-often",
    question: "How often do you check for new reviews?",
    answer: "Once a day. New reviews show up in your dashboard with a reply already drafted.",
  },
  {
    id: "bad-review",
    question: "What happens with a bad review?",
    answer:
      "You get a calm, professional draft: a real apology, no excuses, and an invitation to reach out to you directly. Edit it as much as you like before you post it.",
  },
  {
    id: "getting-started",
    question: "What do I need to get started?",
    answer:
      "Your business on Google (your Google Business Profile), an email address, and your customers' email addresses. No new hardware and no website changes.",
  },
  {
    id: "free-trial",
    question: "How does the free trial work?",
    answer:
      "Start your trial from your dashboard. You'll enter a card through Stripe and get 14 days free. You won't be charged until the trial ends, and if you cancel before then, you pay nothing.",
  },
  {
    id: "contract-cancel",
    question: "Is there a contract? How do I cancel?",
    answer: "No contract. It's month to month, and you can cancel anytime. Just email Sam and it's done.",
  },
  {
    id: "text-messages",
    question: "Do you send text messages?",
    answer: "Not right now. Review requests go out by email.",
  },
  {
    id: "good-fit",
    question: "Is my kind of business a good fit?",
    answer:
      "If you have one location, customers who can leave you a Google review, and their email addresses, yes. Salons, barbershops, dental offices, restaurants, cafes, auto shops, and chiropractors all fit. BuzraReviews isn't built for businesses with many locations.",
  },
  {
    id: "how-many",
    question: "How many review requests can I send?",
    answer: "One per customer visit is the right rhythm, and there's no per-request fee.",
  },
  {
    id: "whos-behind",
    question: "Who's behind BuzraReviews?",
    answer:
      "Sam, who builds and runs it in Bozeman, Montana. Businesses in and around Bozeman can get set up in person.",
    link: { label: "In-person setup in Bozeman", href: "/bozeman" },
  },
];

export function getFaqItems(ids: string[]): FaqItem[] {
  return ids
    .map((id) => FAQ_ITEMS.find((item) => item.id === id))
    .filter((item): item is FaqItem => Boolean(item));
}

export const HOME_FAQ_ORDER = [
  "ok-to-ask",
  "ask-at-counter",
  "what-customers-get",
  "post-for-me",
  "how-often",
  "bad-review",
  "getting-started",
  "free-trial",
  "contract-cancel",
  "text-messages",
  "good-fit",
  "whos-behind",
];

export const PRICING_FAQ_ORDER = ["free-trial", "contract-cancel", "how-many", "what-customers-get"];
