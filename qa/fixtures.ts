import { test as base, expect } from "@playwright/test";

// Shared fixture for the Fix pass 1 test files: blocks any request that
// isn't going to the local dev server, so a test can never accidentally
// reach Stripe, Resend, Anthropic, Supabase, or Google for real, even if a
// mock is missing or misconfigured. Each test still mocks the specific
// endpoints it cares about with page.route; this is the backstop.
export const test = base.extend({
  // Playwright's fixture-provider callback (its second parameter) can be
  // named anything; called `runWithPage` instead of the conventional `use`
  // so eslint-plugin-react-hooks doesn't mistake it for a React Hook call
  // (its rule triggers on any `use...(` identifier, with no awareness this
  // is a Playwright fixture file, not a React component).
  page: async ({ page }, runWithPage) => {
    await page.route("**/*", (route) => {
      const url = new URL(route.request().url());
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        route.continue();
      } else {
        route.abort();
      }
    });
    await runWithPage(page);
  },
});

export { expect };
