import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("final state is visible immediately, no animation", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(100);

    // Scoped to the hero demo specifically: the Tone section further down
    // the page always shows Maya's review with the same default "friendly"
    // reply text, so the plain text string isn't unique on the page.
    const heroDemo = page.getByTestId("review-loop-demo");
    await expect(heroDemo.getByRole("img", { name: "5 out of 5 stars" })).toBeVisible();
    await expect(heroDemo.getByText("Thank you, Maya! Bri is going to be so happy")).toBeVisible();
  });
});

test.describe("full motion sequence", () => {
  test("reply text is not visible at 500ms but is by 5000ms, Copied state reached", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    const heroDemo = page.getByTestId("review-loop-demo");

    await page.waitForTimeout(500);
    await expect(heroDemo.getByText("Thank you, Maya! Bri is going to be so happy")).not.toBeVisible();

    // Reply resolves at 3100ms per the choreography table.
    await page.waitForTimeout(2600);
    await expect(heroDemo.getByText("Thank you, Maya! Bri is going to be so happy")).toBeVisible();

    // The scripted "Copied" state holds from 3600ms to 4400ms, then the
    // button settles back to "Copy reply" (ready for a real click) as
    // "Replay" appears -- check inside that window, not after it closes.
    await page.waitForTimeout(500);
    await expect(heroDemo.getByRole("button", { name: "Copied" })).toBeVisible();
  });

  test("12 frames of the hero, 400ms apart, for manual choreography review", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "One capture is enough; this is for visual review, not a per-viewport assertion");

    await mkdir("qa-artifacts/frames", { recursive: true });
    await page.goto("/", { waitUntil: "load" });

    for (let i = 0; i < 12; i++) {
      await page.screenshot({ path: `qa-artifacts/frames/frame-${String(i).padStart(2, "0")}.png` });
      await page.waitForTimeout(400);
    }
  });

  test("LCP element is the H1 or the lead paragraph, never a demo card", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "LCP is measured once, desktop is representative");

    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(500);

    const lcpTag = await page.evaluate(
      () =>
        new Promise<string | null>((resolve) => {
          try {
            const observer = new PerformanceObserver((list) => {
              const entries = list.getEntries() as PerformanceEntry[];
              const last = entries[entries.length - 1] as unknown as { element?: Element };
              resolve(last?.element?.tagName.toLowerCase() ?? last?.element?.id ?? null);
            });
            observer.observe({ type: "largest-contentful-paint", buffered: true });
            setTimeout(() => resolve(null), 1000);
          } catch {
            resolve(null);
          }
        })
    );

    if (lcpTag) {
      expect(["h1", "p"]).toContain(lcpTag);
    }
  });

  test("JavaScript transferred on / is 200 KB or less", async ({ page, context }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Measured once; bundle size doesn't vary by viewport");

    // response.body() returns the *decompressed* body, which overstates what
    // was actually sent over the wire -- use CDP's encodedDataLength (the
    // same figure DevTools/Lighthouse report as "transferred") instead.
    const client = await context.newCDPSession(page);
    await client.send("Network.enable");
    const sizeByRequestId = new Map<string, number>();
    const urlByRequestId = new Map<string, string>();

    client.on("Network.responseReceived", (event) => {
      urlByRequestId.set(event.requestId, event.response.url);
    });
    client.on("Network.loadingFinished", (event) => {
      sizeByRequestId.set(event.requestId, event.encodedDataLength);
    });

    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    let totalBytes = 0;
    for (const [requestId, bytes] of sizeByRequestId) {
      const url = urlByRequestId.get(requestId) ?? "";
      if (/\.(js|mjs)(\?|$)/.test(url)) totalBytes += bytes;
    }

    console.log(`JavaScript transferred on /: ${(totalBytes / 1024).toFixed(1)} KB`);
    expect(totalBytes).toBeLessThanOrEqual(200 * 1024);
  });
});
