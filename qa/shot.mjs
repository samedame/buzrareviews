// Ad-hoc screenshot helper for eyeballing a route during the build, not part
// of the QA harness. Usage: node qa/shot.mjs /path out-prefix
import { chromium } from "@playwright/test";

const [, , urlPath = "/", prefix = "shot"] = process.argv;
const base = "http://localhost:3100";

const browser = await chromium.launch();

for (const [label, viewport, isMobile] of [
  ["mobile", { width: 390, height: 844 }, true],
  ["desktop", { width: 1440, height: 900 }, false],
]) {
  const context = await browser.newContext({ viewport, isMobile, hasTouch: isMobile });
  const page = await context.newPage();
  await page.goto(base + urlPath, { waitUntil: "load" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `/tmp/${prefix}-${label}.png`, fullPage: true });
  await context.close();
}

await browser.close();
console.log("done");
