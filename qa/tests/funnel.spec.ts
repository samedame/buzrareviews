import { test, expect } from "@playwright/test";

test.describe("hero search personalization and submit", () => {
  test("typing updates the demo email subject and reply sign-off", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.locator("#hero-search").fill("Bloom Salon, Bozeman");
    await page.waitForTimeout(400);

    await expect(page.getByText("How was your visit to Bloom Salon, Bozeman?")).toBeVisible();
    await expect(page.locator("text=Bloom Salon, Bozeman").last()).toBeVisible();
  });

  test("submitting navigates to /onboarding?q= and the search auto-runs", async ({ page }) => {
    await page.route("**/api/businesses?q=*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            { id: "p1", displayName: "Bloom Salon", formattedAddress: "123 Main St, Bozeman, MT" },
            { id: "p2", displayName: "Bloom Salon & Spa", formattedAddress: "456 Oak Ave, Bozeman, MT" },
          ],
        }),
      })
    );

    await page.goto("/", { waitUntil: "load" });
    await page.locator("#hero-search").fill("Bloom Salon, Bozeman");
    await page.locator("#hero-search").locator("..").getByRole("button", { name: "Find my business" }).click();

    await page.waitForURL(/\/onboarding\?q=/);
    expect(decodeURIComponent(page.url())).toContain("q=Bloom Salon, Bozeman");

    const input = page.locator('input[aria-label="Business name and city"]');
    await expect(input).toHaveValue("Bloom Salon, Bozeman");
    await expect(page.getByText("Bloom Salon", { exact: true })).toBeVisible();
    await expect(page.getByText("Bloom Salon & Spa")).toBeVisible();
  });

  test("empty submit shows inline error and stays on the page", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.locator("#hero-search").locator("..").getByRole("button", { name: "Find my business" }).click();
    await expect(page.getByText("Type your business name first.")).toBeVisible();
    expect(page.url()).toBe(new URL("/", page.url()).toString());
  });

  test("the final CTA form behaves the same way", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.locator("#final-cta-search").locator("..").getByRole("button", { name: "Find my business" }).click();
    await expect(page.getByText("Type your business name first.")).toBeVisible();
  });
});

test.describe("tone demo", () => {
  test("switching tone updates the drafted reply", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const toneSection = page.locator("section", { has: page.getByRole("heading", { name: "Replies that sound like you wrote them." }) });

    await toneSection.getByRole("radio", { name: "Professional" }).click();
    await expect(toneSection.getByText("Thank you for the kind review, Maya.")).toBeVisible();

    await toneSection.getByRole("radio", { name: "Casual & upbeat" }).click();
    await expect(toneSection.getByText("Maya, this made our day!")).toBeVisible();
  });
});

test.describe("review loop vertical switch", () => {
  test("switching to Dental office shows Northfork Family Dental with no reviewer name in the reply", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    // Mobile shows the short label ("Dental") per DESIGN.md's "short labels
    // on mobile" spec; desktop/tablet show the full label ("Dental office").
    await page.getByRole("radio", { name: /^Dental( office)?$/ }).click();
    await page.waitForTimeout(2500);

    await expect(page.getByText("Northfork Family Dental").first()).toBeVisible();
    const reply = page.getByText("Thank you for taking the time to share this.");
    await expect(reply).toBeVisible();
  });

  test("Copy reply puts the exact demo reply on the clipboard and shows Copied", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Clipboard permissions are Chromium-only in Playwright");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(4600);

    const copyButton = page.getByRole("button", { name: "Copy reply" });
    await copyButton.click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain("Bri is going to be so happy to read this");
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("opens, traps focus, closes on Escape, and returns focus to its button", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const openButton = page.getByRole("button", { name: "Open menu" });
    await openButton.click();

    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);

    const isFocused = await openButton.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });
});

test.describe("contact form", () => {
  test("shows the success message when /api/contact returns 200", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) })
    );
    await page.goto("/setup", { waitUntil: "load" });
    await page.fill("#contact-name", "Jamie Rivera");
    await page.fill("#contact-business", "Bloom Salon");
    await page.fill("#contact-email", "jamie@example.com");
    await page.getByRole("button", { name: "Send my request" }).click();
    await expect(page.getByText("Thanks! Sam will reach out to set up a time.")).toBeVisible();
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
