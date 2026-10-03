import { test, expect } from "../fixtures";
import { MARKETING_ROUTES } from "../routes";

const BRIGHTLOCAL_URL = "https://www.brightlocal.com/research/local-consumer-review-survey/";
const ROUTES_WITH_STATS = MARKETING_ROUTES.filter((route) => route !== "/privacy" && route !== "/terms");

test.describe("every statistic has a visible BrightLocal source line (Fix pass 2, problem 1)", () => {
  for (const route of ROUTES_WITH_STATS) {
    test(`page: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });

      // Find every text node containing a number followed by "%", then
      // check that its closest <section> ancestor contains a visible link
      // to the BrightLocal survey with "BrightLocal" in its text.
      const sectionsMissingSource = await page.evaluate((brightLocalUrl) => {
        // SHOW_TEXT walks <script>/<style> contents too (they're text nodes
        // in the DOM), which on a Next.js page includes the RSC flight-data
        // payload -- serialized JSON that can coincidentally contain a
        // digit-percent substring with nothing to do with rendered content.
        // Only consider text nodes whose nearest element ancestor isn't a
        // script/style tag.
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            return (node.parentElement as HTMLElement | null)?.closest("script, style")
              ? NodeFilter.FILTER_REJECT
              : NodeFilter.FILTER_ACCEPT;
          },
        });
        const missing: string[] = [];
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent ?? "";
          if (!/\d%/.test(text)) continue;

          const section = (node.parentElement as HTMLElement | null)?.closest("section");
          if (!section) {
            missing.push(`"${text.trim()}" (no enclosing <section>)`);
            continue;
          }

          const hasSourceLink = Array.from(section.querySelectorAll("a")).some(
            (a) => a.getAttribute("href") === brightLocalUrl && a.textContent?.includes("BrightLocal")
          );
          if (!hasSourceLink) {
            missing.push(`"${text.trim()}" (section has no BrightLocal source link)`);
          }
        }
        return missing;
      }, BRIGHTLOCAL_URL);

      expect(sectionsMissingSource).toEqual([]);
    });
  }
});
