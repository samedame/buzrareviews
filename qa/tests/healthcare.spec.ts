import { test, expect } from "../fixtures";
import { site } from "@/config/site";

test.describe("healthcare flag (issue 7)", () => {
  test("home vertical switch includes/excludes dental to match site.showHealthcare", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const dentalRadio = page.getByRole("radio", { name: /^Dental( office)?$/ });
    if (site.showHealthcare) {
      await expect(dentalRadio).toHaveCount(1);
    } else {
      await expect(dentalRadio).toHaveCount(0);
    }
  });

  test("desktop nav's 'Who it's for' menu includes/excludes Dental offices", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "This nav item is hidden below the lg: breakpoint");
    await page.goto("/", { waitUntil: "load" });
    await page.getByRole("button", { name: "Who it's for" }).click();
    const dentalLink = page.getByRole("menuitem", { name: "Dental offices" });
    if (site.showHealthcare) {
      await expect(dentalLink).toBeVisible();
    } else {
      await expect(dentalLink).toHaveCount(0);
    }
  });

  test("mobile menu includes/excludes Dental offices", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop", "The mobile menu trigger is hidden at lg: and above");
    await page.goto("/", { waitUntil: "load" });
    await page.getByRole("button", { name: "Open menu" }).click();
    const dentalLink = page.getByRole("link", { name: "Dental offices" });
    if (site.showHealthcare) {
      await expect(dentalLink).toBeVisible();
    } else {
      await expect(dentalLink).toHaveCount(0);
    }
  });

  test("footer's 'Who it's for' column includes/excludes Dental offices", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const dentalLink = page.locator("footer").getByRole("link", { name: "Dental offices" });
    if (site.showHealthcare) {
      await expect(dentalLink).toBeVisible();
    } else {
      await expect(dentalLink).toHaveCount(0);
    }
  });

  test("hero audience line matches the flag", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const text = await page.locator("body").innerText();
    if (site.showHealthcare) {
      expect(text).toContain("For salons, dental offices, restaurants");
    } else {
      expect(text).toContain("For salons, barbershops, restaurants");
      expect(text).not.toContain("dental offices");
    }
  });

  test("FAQ good-fit answer matches the flag", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const details = page.locator("details").filter({ hasText: "Is my kind of business a good fit?" });
    await details.locator("summary").click();
    const text = await details.innerText();
    if (site.showHealthcare) {
      expect(text).toContain("chiropractors");
    } else {
      expect(text).not.toContain("chiropractors");
      expect(text).not.toContain("dental offices");
    }
  });

  test("/for/dental stays reachable by direct link regardless of the flag", async ({ page }) => {
    const response = await page.goto("/for/dental", { waitUntil: "load" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("Patient reviews");
  });
});
