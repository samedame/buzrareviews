import { test, expect } from "../fixtures";

test.describe("/unsubscribe page (issue 12)", () => {
  test("shows the Unsubscribe button and sends no POST on load", async ({ page }) => {
    let posted = false;
    await page.route("**/api/unsubscribe*", (route) => {
      posted = true;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });

    await page.goto("/unsubscribe?c=11111111-1111-4111-a111-111111111111&t=faketoken", { waitUntil: "load" });
    await expect(page.getByRole("button", { name: "Unsubscribe" })).toBeVisible();
    expect(posted).toBe(false);
  });

  test("clicking Unsubscribe with a 200 response shows the success message with the business name", async ({ page }) => {
    await page.route("**/api/unsubscribe*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, business: "Bloom Salon" }),
      })
    );

    await page.goto("/unsubscribe?c=11111111-1111-4111-a111-111111111111&t=faketoken", { waitUntil: "load" });
    await page.getByRole("button", { name: "Unsubscribe" }).click();
    await expect(page.getByText("Done. Bloom Salon won't send you review requests")).toBeVisible();
  });

  test("a 400 response shows the invalid-link message", async ({ page }) => {
    await page.route("**/api/unsubscribe*", (route) =>
      route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ ok: false }) })
    );

    await page.goto("/unsubscribe?c=11111111-1111-4111-a111-111111111111&t=faketoken", { waitUntil: "load" });
    await page.getByRole("button", { name: "Unsubscribe" }).click();
    await expect(page.getByText("This link doesn't work.")).toBeVisible();
  });

  test("loading the page with no c/t shows the invalid-link message, not the normal prompt", async ({ page }) => {
    await page.goto("/unsubscribe", { waitUntil: "load" });
    await expect(page.getByText("This link doesn't work.")).toBeVisible();
  });
});

test.describe("src/lib/unsubscribe.ts (Node-side, no browser)", () => {
  test("a signed token verifies; a tampered token, a token for another ID, and a wrong-length token all fail", async () => {
    process.env.UNSUBSCRIBE_SECRET = "test-secret-for-unsubscribe-lib";
    const { signUnsubscribeToken, verifyUnsubscribeToken } = await import("../../src/lib/unsubscribe");

    const customerId = "11111111-1111-4111-a111-111111111111";
    const otherCustomerId = "22222222-2222-4222-a222-222222222222";
    const token = signUnsubscribeToken(customerId);

    expect(verifyUnsubscribeToken(customerId, token)).toBe(true);

    const tampered = token.slice(0, -1) + (token.at(-1) === "A" ? "B" : "A");
    expect(verifyUnsubscribeToken(customerId, tampered)).toBe(false);

    expect(verifyUnsubscribeToken(otherCustomerId, token)).toBe(false);

    expect(verifyUnsubscribeToken(customerId, token.slice(0, -2))).toBe(false);
  });
});
