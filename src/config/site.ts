export const site = {
  name: "BuzraReviews",
  url: "https://buzrareviews.com",
  city: "Bozeman, Montana",
  founderName: "Sam",
  // TODO(Sam): set to "/images/sam-portrait.jpg" once you've shot and added the photo (see docs/website/SHOT_LIST.md).
  founderPhoto: null as string | null,
  // TODO(Sam): set to "/images/main-street-1.jpg" once you've shot and added a Main Street photo (see docs/website/SHOT_LIST.md).
  mainStreetPhoto: null as string | null,
  // Fix pass 1: set from FIX_PASS_1.md's SUPPORT_EMAIL input. Shown across the
  // site, in the legal pages, and as the cancel/SMS-help contact.
  contactEmail: "support@buzrareviews.com" as string | null,
  // TODO(Sam): set if you want a phone number shown anywhere on the site, e.g. "+1 (406) 555-0100".
  contactPhone: null as string | null,
  // TODO(Sam): set to a scheduling link (Calendly, Cal.com, etc.) if you want a "Pick a time" button on /setup.
  bookingUrl: null as string | null,
  // Fix pass 1: set from FIX_PASS_1.md's LEGAL_ENTITY_NAME input. Null until
  // the Montana LLC is filed; legal pages fall back to "Sam" when null.
  legalEntityName: null as string | null,
  // Fix pass 1: set from FIX_PASS_1.md's LEGAL_MAILING_ADDRESS input. Shown
  // only on Privacy and Terms when set.
  legalMailingAddress: null as string | null,
  // Fix pass 1: set from FIX_PASS_1.md's IN_PERSON_IN_BOZEMAN input. Controls
  // whether /setup and every place that echoes its offer mention an in-person
  // visit in Bozeman, or online/call help only.
  inPersonInBozeman: true,
  // Fix pass 1: set from FIX_PASS_1.md's SHOW_HEALTHCARE input. Controls
  // whether dental/healthcare marketing appears in nav, footer, the home
  // vertical switch, and the FAQ. /for/dental itself stays reachable by
  // direct link either way (noindex when false), per Phase 3/4.
  showHealthcare: false,
} as const;
