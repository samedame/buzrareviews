import { test, expect } from "../fixtures";

test.describe("redirects (issue 2)", () => {
  test("GET /bozeman returns a 308 permanent redirect to /setup", async ({ page }) => {
    const response = await page.request.get("/bozeman", { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers()["location"]).toMatch(/\/setup$/);
  });
});
