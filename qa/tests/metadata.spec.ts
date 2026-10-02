import { test, expect } from "../fixtures";
import { MARKETING_ROUTES } from "../routes";
import { site } from "@/config/site";

const HOME_TITLE = "BuzraReviews: Google reviews for local businesses";
const HOME_DESCRIPTION =
  "Ask every customer for a Google review and answer every review in your voice. Review request emails and drafted replies, $29 a month, no contract.";

test.describe("metadata (issue 4)", () => {
  for (const route of MARKETING_ROUTES) {
    test(`page: ${route} has page-specific canonical, og, and twitter tags`, async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });

      const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonicalHref).toBe(`${site.url}${route === "/" ? "" : route}`);

      // Exactly one canonical link -- a second would mean the page is
      // inheriting the root layout's AND setting its own.
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

      const documentTitle = await page.title();
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
      expect(ogTitle).toBe(documentTitle);

      const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute("content");
      expect(ogDescription).toBe(metaDescription);

      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      expect(ogUrl).toBe(canonicalHref);

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(ogImage).toMatch(/^https:\/\//);

      const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute("content");
      const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute("content");
      expect(twitterTitle).toBeTruthy();
      expect(twitterDescription).toBeTruthy();

      if (route !== "/") {
        expect(twitterTitle).not.toBe(HOME_TITLE);
        expect(twitterDescription).not.toBe(HOME_DESCRIPTION);
        expect(documentTitle).not.toBe(HOME_TITLE);
      }
    });
  }

  test("home page has its own canonical (not inherited/missing)", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonicalHref).toBe(site.url);
  });

  for (const route of ["/onboarding", "/customers", "/dashboard", "/unsubscribe"]) {
    test(`page: ${route} is noindex`, async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      expect(robots).toContain("noindex");
    });
  }

  test("/for/dental is noindex while site.showHealthcare is false", async ({ page }) => {
    test.skip(site.showHealthcare, "This checks the flag-off behavior specifically");
    await page.goto("/for/dental", { waitUntil: "load" });
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("noindex");
  });

  test("/for/salons is not noindex", async ({ page }) => {
    await page.goto("/for/salons", { waitUntil: "load" });
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });

  test("sitemap.xml lists /setup, not /bozeman, and matches the healthcare flag", async ({ page }) => {
    const response = await page.goto("/sitemap.xml", { waitUntil: "load" });
    const body = await response!.text();
    expect(body).toContain(`${site.url}/setup`);
    expect(body).not.toContain("/bozeman");
    if (site.showHealthcare) {
      expect(body).toContain(`${site.url}/for/dental`);
    } else {
      expect(body).not.toContain(`${site.url}/for/dental`);
    }
  });
});
