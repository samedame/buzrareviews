import { test, expect } from "../fixtures";

const BUSINESS_ID = "11111111-1111-4111-a111-111111111111";

async function mockBusinessLoad(
  page: import("@playwright/test").Page,
  business: { subscription_status: string | null }
) {
  await page.route(`**/api/businesses?id=${BUSINESS_ID}`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        business: { id: BUSINESS_ID, name: "Bloom Salon", reply_tone: null, ...business },
      }),
    })
  );
  await page.route(`**/api/reviews?businessId=${BUSINESS_ID}`, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ reviews: [] }) })
  );
}

test.describe("/dashboard lost-link recovery (issue 8)", () => {
  test("shows the generic message regardless of outcome", async ({ page }) => {
    await page.route("**/api/dashboard-link", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    );
    await page.goto("/dashboard", { waitUntil: "load" });
    await page.getByLabel("Your email").fill("owner@example.com");
    await page.getByRole("button", { name: "Email me my link" }).click();
    await expect(
      page.getByText("If that email has a BuzraReviews account, we just sent the link.")
    ).toBeVisible();
  });
});

test.describe("/dashboard Manage billing (issue 9)", () => {
  test("appears for an active business, posts to /api/billing-portal, and navigates to the returned URL", async ({
    page,
  }) => {
    await mockBusinessLoad(page, { subscription_status: "active" });
    await page.route("**/api/billing-portal", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "http://localhost:3100/mock-billing-portal" }),
      })
    );
    await page.route("**/mock-billing-portal", (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Mock Stripe portal</h1>" })
    );

    await page.goto(`/dashboard?businessId=${BUSINESS_ID}&businessName=Bloom%20Salon`, { waitUntil: "load" });
    await expect(page.getByRole("button", { name: "Manage billing" })).toBeVisible();
    await page.getByRole("button", { name: "Manage billing" }).click();
    await expect(page.getByRole("heading", { name: "Mock Stripe portal" })).toBeVisible();
  });

  test("appears for a past_due business", async ({ page }) => {
    await mockBusinessLoad(page, { subscription_status: "past_due" });
    await page.goto(`/dashboard?businessId=${BUSINESS_ID}&businessName=Bloom%20Salon`, { waitUntil: "load" });
    await expect(page.getByRole("button", { name: "Manage billing" })).toBeVisible();
  });

  test("a 409 response shows the fallback message with a mailto link", async ({ page }) => {
    await mockBusinessLoad(page, { subscription_status: "active" });
    await page.route("**/api/billing-portal", (route) =>
      route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, reason: "no_subscription" }),
      })
    );

    await page.goto(`/dashboard?businessId=${BUSINESS_ID}&businessName=Bloom%20Salon`, { waitUntil: "load" });
    await page.getByRole("button", { name: "Manage billing" }).click();
    await expect(page.getByText("We couldn't open billing right now.")).toBeVisible();
    await expect(page.getByText("We couldn't open billing right now.").locator("xpath=..").locator("a")).toHaveAttribute(
      "href",
      /^mailto:/
    );
  });

  test("a business with no subscription keeps the original trial flow unchanged", async ({ page }) => {
    await mockBusinessLoad(page, { subscription_status: null });
    await page.goto(`/dashboard?businessId=${BUSINESS_ID}&businessName=Bloom%20Salon`, { waitUntil: "load" });
    await expect(page.getByRole("button", { name: "Subscribe for $29/mo" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Manage billing" })).toHaveCount(0);
  });
});
