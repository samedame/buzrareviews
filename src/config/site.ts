export const site = {
  name: "BuzraReviews",
  url: "https://buzrareviews.com",
  city: "Bozeman, Montana",
  founderName: "Sam",
  // TODO(Sam): set to "/images/sam-portrait.jpg" once you've shot and added the photo (see docs/website/SHOT_LIST.md).
  founderPhoto: null as string | null,
  // TODO(Sam): set to your inbox once CONTACT_TO_EMAIL is configured in Vercel, e.g. "sam@buzrareviews.com".
  contactEmail: null as string | null,
  // TODO(Sam): set if you want a phone number shown anywhere on the site, e.g. "+1 (406) 555-0100".
  contactPhone: null as string | null,
  // TODO(Sam): set to a scheduling link (Calendly, Cal.com, etc.) if you want a "Pick a time" button on /bozeman.
  bookingUrl: null as string | null,
} as const;
