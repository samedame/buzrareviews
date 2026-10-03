import { defineConfig } from "@playwright/test";
import path from "node:path";

// Playwright's webServer.command runs with cwd set to this config file's own
// directory (qa/), not the repo root, so `npx next start` can't find .next
// unless we point it back explicitly. __dirname (not import.meta.dirname) is
// used because Playwright loads this config as CommonJS.
const repoRoot = path.resolve(__dirname, "..");

export default defineConfig({
  testDir: "tests",
  outputDir: "../qa-artifacts/test-results",
  fullyParallel: true,
  reporter: [["list"], ["html", { outputFolder: "../qa-artifacts/report", open: "never" }]],
  webServer: {
    command: "npx next start -p 3100",
    cwd: repoRoot,
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: "tablet",
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
});
