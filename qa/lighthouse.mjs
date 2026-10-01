// Runs Lighthouse against the running production server (npm run qa:lh
// expects `next start` already up on :3100) for the routes and form
// factors in MASTER_PROMPT.md H1.6, and checks every H2 gate.
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3100";
const ROUTES = ["/", "/pricing", "/for/salons"];

mkdirSync("qa-artifacts/lh", { recursive: true });

if (!process.env.CHROME_PATH) {
  process.env.CHROME_PATH = chromium.executablePath();
}

function slugFor(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

const GATES = {
  mobile: { performance: 90, accessibility: 100, "best-practices": 95, seo: 100 },
  desktop: { performance: 95, accessibility: 100, "best-practices": 95, seo: 100 },
};

const results = [];
let anyFailure = false;

for (const route of ROUTES) {
  for (const formFactor of ["mobile", "desktop"]) {
    const outPath = `qa-artifacts/lh/${slugFor(route)}-${formFactor}.json`;
    const presetFlag = formFactor === "desktop" ? "--preset=desktop" : "";
    const cmd = [
      "npx lighthouse",
      `"${BASE}${route}"`,
      "--output=json",
      `--output-path=${outPath}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      '--chrome-flags="--headless=new"',
      presetFlag,
      "--quiet",
    ]
      .filter(Boolean)
      .join(" ");

    execSync(cmd, { stdio: "inherit" });

    const report = JSON.parse(readFileSync(outPath, "utf-8"));
    const scores = Object.fromEntries(
      Object.entries(report.categories).map(([key, cat]) => [key, Math.round(cat.score * 100)])
    );
    const audits = report.audits;
    const lcp = audits["largest-contentful-paint"]?.numericValue;
    const cls = audits["cumulative-layout-shift"]?.numericValue;
    const tbt = audits["total-blocking-time"]?.numericValue;

    const gate = GATES[formFactor];
    const rowFailures = [];
    if (scores.performance < gate.performance) rowFailures.push(`performance ${scores.performance} < ${gate.performance}`);
    if (scores.accessibility < gate.accessibility) rowFailures.push(`accessibility ${scores.accessibility} < ${gate.accessibility}`);
    if (scores["best-practices"] < gate["best-practices"]) rowFailures.push(`best-practices ${scores["best-practices"]} < ${gate["best-practices"]}`);
    if (scores.seo < gate.seo) rowFailures.push(`seo ${scores.seo} < ${gate.seo}`);
    if (formFactor === "mobile") {
      if (lcp > 2500) rowFailures.push(`LCP ${(lcp / 1000).toFixed(2)}s > 2.5s`);
      if (cls > 0.05) rowFailures.push(`CLS ${cls.toFixed(3)} > 0.05`);
      if (tbt > 200) rowFailures.push(`TBT ${Math.round(tbt)}ms > 200ms`);
    }

    if (rowFailures.length > 0) anyFailure = true;

    results.push({ route, formFactor, scores, lcp, cls, tbt, rowFailures });
  }
}

console.log("\n--- Lighthouse results ---");
for (const r of results) {
  console.log(
    `${r.route.padEnd(16)} ${r.formFactor.padEnd(8)} perf=${r.scores.performance} a11y=${r.scores.accessibility} bp=${r.scores["best-practices"]} seo=${r.scores.seo} LCP=${(r.lcp / 1000).toFixed(2)}s CLS=${r.cls.toFixed(3)} TBT=${Math.round(r.tbt)}ms`
  );
  if (r.rowFailures.length > 0) {
    console.log(`  FAIL: ${r.rowFailures.join(", ")}`);
  }
}

if (anyFailure) {
  console.error("\nLighthouse gate FAILED. See failures above.");
  process.exit(1);
} else {
  console.log("\nAll Lighthouse gates passed.");
}
