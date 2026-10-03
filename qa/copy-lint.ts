// Hard bans from MASTER_PROMPT.md G3, enforced mechanically here. Whole-word
// (or whole-phrase) matches only, case-insensitive. /privacy and /terms are
// exempt (legal text may need words like "guarantee").
export const BANNED_PHRASES = [
  "revolutionize",
  "revolutionary",
  "supercharge",
  "unlock",
  "unleash",
  "elevate",
  "seamless",
  "seamlessly",
  "effortless",
  "effortlessly",
  "game-changer",
  "game changer",
  "cutting-edge",
  "next-level",
  "next level",
  "leverage",
  "empower",
  "harness",
  "robust",
  "streamline",
  "skyrocket",
  "world-class",
  "best-in-class",
  "all-in-one",
  "solution",
  "solutions",
  "synergy",
  "transform",
  "transformative",
  "magic",
  "magical",
  "delight",
  "ai-powered",
  "powered by ai",
  "in today's",
  "fast-paced",
  "take your business",
  "reputation management",
  "boost your reputation",
  "5-star reviews only",
  "only happy customers",
  "guaranteed",
  "guarantee",
];

export const EM_DASH = "—";
export const EN_DASH = "–";

export type CopyLintViolation = { kind: "dash" | "banned-phrase"; match: string; context: string };

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function lintText(text: string): CopyLintViolation[] {
  const violations: CopyLintViolation[] = [];

  if (text.includes(EM_DASH) || text.includes(EN_DASH)) {
    const dashMatch = text.match(new RegExp(`.{0,20}[${EM_DASH}${EN_DASH}].{0,20}`));
    violations.push({ kind: "dash", match: dashMatch?.[0] ?? "(dash found)", context: text.slice(0, 120) });
  }

  for (const phrase of BANNED_PHRASES) {
    const pattern = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
    const match = text.match(pattern);
    if (match) {
      violations.push({ kind: "banned-phrase", match: match[0], context: text.slice(Math.max(0, match.index! - 40), match.index! + 60) });
    }
  }

  return violations;
}
