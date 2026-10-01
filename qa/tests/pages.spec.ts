import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ALL_ROUTES, NOT_FOUND_ROUTE } from "../routes";
import { lintText } from "../copy-lint";

function slugFor(route: string): string {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

const routesToTest = [...ALL_ROUTES, NOT_FOUND_ROUTE];

for (const route of routesToTest) {
  test.describe(`page: ${route}`, () => {
    test("loads with no console/page errors, one h1, no horizontal scroll", async ({ page }, testInfo) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => pageErrors.push(String(err)));

      const response = await page.goto(route, { waitUntil: "load" });

      if (route === NOT_FOUND_ROUTE) {
        expect(response?.status()).toBe(404);
      } else {
        expect(response?.ok()).toBeTruthy();
      }

      await page.waitForTimeout(300);

      // The 404 route is expected to produce exactly the navigation's own
      // "res.status === 404" console noise from Next's dev/prod error
      // overlay in some configurations; filter only that known case.
      const unexpectedConsoleErrors =
        route === NOT_FOUND_ROUTE
          ? consoleErrors.filter((e) => !/404/.test(e))
          : consoleErrors;

      expect(unexpectedConsoleErrors, `console errors on ${route}`).toEqual([]);
      expect(pageErrors, `page errors on ${route}`).toEqual([]);

      const h1Count = await page.locator("h1").count();
      expect(h1Count, `exactly one h1 on ${route}`).toBe(1);

      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasHorizontalScroll, `no horizontal scroll on ${route}`).toBe(false);

      await page.screenshot({
        path: `qa-artifacts/screens/${testInfo.project.name}/${slugFor(route)}.png`,
        fullPage: true,
      });
    });

    test("axe: 0 violations", async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });
      await page.waitForTimeout(300);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });

    test("copy lint: no em/en dashes, no banned phrases, internal links resolve", async ({ page, request }) => {
      await page.goto(route, { waitUntil: "load" });
      await page.waitForTimeout(300);

      const bodyText = await page.locator("body").innerText();
      const title = await page.title();
      const metaDescription = await page.evaluate(
        () => document.querySelector('meta[name="description"]')?.getAttribute("content") ?? ""
      );
      const ogTags = await page.evaluate(() =>
        Array.from(document.querySelectorAll('meta[property^="og:"]')).map((m) => m.getAttribute("content") ?? "")
      );
      const altTexts = await page.evaluate(() =>
        Array.from(document.querySelectorAll("[alt]")).map((el) => el.getAttribute("alt") ?? "")
      );
      const ariaLabels = await page.evaluate(() =>
        Array.from(document.querySelectorAll("[aria-label]")).map((el) => el.getAttribute("aria-label") ?? "")
      );
      const titleAttrs = await page.evaluate(() =>
        Array.from(document.querySelectorAll("[title]")).map((el) => el.getAttribute("title") ?? "")
      );
      const placeholders = await page.evaluate(() =>
        Array.from(document.querySelectorAll("[placeholder]")).map((el) => el.getAttribute("placeholder") ?? "")
      );

      const allText = [
        bodyText,
        title,
        metaDescription,
        ...ogTags,
        ...altTexts,
        ...ariaLabels,
        ...titleAttrs,
        ...placeholders,
      ].join("\n");

      const isLegal = route === "/privacy" || route === "/terms";
      const violations = lintText(allText).filter((v) => !(isLegal && v.kind === "banned-phrase"));

      expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);

      if (route !== NOT_FOUND_ROUTE) {
        const hrefs = await page.evaluate(() =>
          Array.from(document.querySelectorAll('a[href^="/"]')).map((a) => a.getAttribute("href") ?? "")
        );
        const uniqueHrefs = [...new Set(hrefs.map((h) => h.split("#")[0]).filter(Boolean))];

        for (const href of uniqueHrefs) {
          const res = await request.get(href);
          expect(res.status(), `internal link ${href} on ${route}`).toBeLessThan(400);
        }
      }
    });
  });
}
