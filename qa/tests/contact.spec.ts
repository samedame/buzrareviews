import { test, expect } from "../fixtures";
import { MARKETING_ROUTES } from "../routes";
import { site } from "@/config/site";

test.describe("contact email everywhere (issue 1)", () => {
  for (const route of ["/", "/pricing", "/setup", "/privacy", "/terms"]) {
    test(`page: ${route} has a real mailto link to site.contactEmail`, async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });
      await expect(page.locator(`a[href="mailto:${site.contactEmail}"]`).first()).toBeVisible();
    });
  }

  for (const route of MARKETING_ROUTES) {
    test(`page: ${route} footer has a mailto link`, async ({ page }) => {
      await page.goto(route, { waitUntil: "load" });
      await expect(page.locator(`footer a[href="mailto:${site.contactEmail}"]`)).toBeVisible();
    });
  }

  test("no page says 'contact form on our Bozeman page'", async ({ page }) => {
    for (const route of MARKETING_ROUTES) {
      await page.goto(route, { waitUntil: "load" });
      const text = await page.locator("body").innerText();
      expect(text).not.toContain("contact form on our Bozeman page");
      expect(text).not.toContain("Bozeman page");
    }
  });
});

test.describe("/setup contact form (issue 2)", () => {
  test("sends the meeting choice when in-person is on, and shows the success state", async ({ page }) => {
    test.skip(!site.inPersonInBozeman, "Meeting choice only renders when site.inPersonInBozeman is true");

    const captured: { meeting?: string } = {};
    await page.route("**/api/contact", (route) => {
      captured.meeting = route.request().postDataJSON()?.meeting;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });

    await page.goto("/setup", { waitUntil: "load" });
    await page.fill("#contact-name", "Jamie Rivera");
    await page.fill("#contact-business", "Bloom Salon");
    await page.fill("#contact-email", "jamie@example.com");
    await page.getByRole("radio", { name: "In person in Bozeman" }).check();
    await page.getByRole("button", { name: "Send my request" }).click();

    await expect(page.getByText("Thanks! Sam will reach out to set up a time.")).toBeVisible();
    expect(captured.meeting).toBe("in_person");
  });

  test("shows the not-connected message when /api/contact returns 503", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "not connected" }) })
    );
    await page.goto("/setup", { waitUntil: "load" });
    await page.fill("#contact-name", "Jamie Rivera");
    await page.fill("#contact-business", "Bloom Salon");
    await page.fill("#contact-email", "jamie@example.com");
    await page.getByRole("button", { name: "Send my request" }).click();
    await expect(page.getByText("The form isn't connected yet.")).toBeVisible();
  });
});
