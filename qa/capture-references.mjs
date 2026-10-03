// One-off research tool for docs/website/MASTER_PROMPT.md PART D.
// Captures screenshots of real reference sites for design study. Never clicks
// buttons or submits forms. Screenshots are gitignored (docs/design/references/).
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";

const HIDE_OVERLAYS_CSS = `
  #onetrust-consent-sdk, [id*="cookie" i], [class*="cookie" i],
  [id*="consent" i], [class*="consent" i], #intercom-container,
  iframe[title*="chat" i], #hubspot-messages-iframe-container {
    display: none !important;
  }
`;

const sites = [
  { slug: "owner-com", url: "https://www.owner.com", burst: false },
  { slug: "owner-com-pricing", url: "https://www.owner.com/pricing", burst: false },
  { slug: "glossgenius", url: "https://glossgenius.com", burst: false },
  { slug: "visiblefeedback", url: "https://visiblefeedback.com", burst: false },
  { slug: "stripe", url: "https://stripe.com", burst: true },
  { slug: "stripe-payments", url: "https://stripe.com/payments", burst: false },
  { slug: "attio", url: "https://attio.com", burst: true },
  { slug: "granola", url: "https://www.granola.ai", burst: true },
  { slug: "linear", url: "https://linear.app", burst: true },
  { slug: "resend", url: "https://resend.com", burst: false },
  { slug: "mercury", url: "https://mercury.com", burst: false },
  { slug: "truereview", url: "https://www.truereview.co", burst: false },
  { slug: "nicejob", url: "https://nicejob.com", burst: false },
  { slug: "getreviewloop", url: "https://getreviewloop.com", burst: false },
  { slug: "podium", url: "https://www.podium.com", burst: false },
  { slug: "birdeye", url: "https://www.birdeye.com", burst: false },
  { slug: "getweave", url: "https://www.getweave.com", burst: false },
  { slug: "joinblvd", url: "https://www.joinblvd.com", burst: false },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900, isMobile: false, hasTouch: false },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
];

async function captureSite(browser, site) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      userAgent: vp.isMobile ? undefined : DESKTOP_UA,
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });
    const page = await context.newPage();
    const outDir = path.join("docs/design/references", site.slug);
    await mkdir(outDir, { recursive: true });

    try {
      await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(3500);
      await page.addStyleTag({ content: HIDE_OVERLAYS_CSS });
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);

      if (site.burst) {
        for (let i = 0; i < 8; i++) {
          await page.screenshot({
            path: path.join(outDir, `${vp.name}-burst-${String(i).padStart(2, "0")}.png`),
          });
          await page.waitForTimeout(400);
        }
      }

      for (const scrollY of [0, 900, 1800]) {
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(outDir, `${vp.name}-${scrollY}.png`),
        });
      }

      console.log(`ok: ${site.slug} (${vp.name})`);
    } catch (err) {
      console.error(`FAILED: ${site.slug} (${vp.name}): ${err.message}`);
    } finally {
      await context.close();
    }
  }
}

const browser = await chromium.launch();
for (const site of sites) {
  await captureSite(browser, site);
}
await browser.close();
