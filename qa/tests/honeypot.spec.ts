import { test, expect } from "../fixtures";

test.describe("honeypot accessibility (issue 11)", () => {
  test("/setup contact form: honeypot label absent from innerText, Tab never focuses it", async ({ page }) => {
    await page.goto("/setup", { waitUntil: "load" });
    const form = page.locator("form").filter({ has: page.locator("#contact-name") });
    const text = await form.evaluate((el) => (el as HTMLElement).innerText);
    expect(text).not.toContain("Company");

    await page.locator("#contact-name").focus();
    let hitHoneypot = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const activeId = await page.evaluate(() => document.activeElement?.id);
      if (activeId === "company-field") hitHoneypot = true;
    }
    expect(hitHoneypot).toBe(false);
  });

  test("/dashboard lost-link form: honeypot label absent from innerText, Tab never focuses it", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "load" });
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).not.toContain("Company");

    await page.getByLabel("Your email").focus();
    let hitHoneypot = false;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const activeId = await page.evaluate(() => document.activeElement?.id);
      if (activeId === "recoveryCompany") hitHoneypot = true;
    }
    expect(hitHoneypot).toBe(false);
  });
});
