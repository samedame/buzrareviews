import { test, expect } from "@playwright/test";
import { renderReviewRequestEmail } from "../../src/lib/emails/review-request";

const EM_DASH = "—";
const EN_DASH = "–";

test.describe("renderReviewRequestEmail (issue 12, Node-side)", () => {
  const base = {
    businessName: "Bloom Salon",
    reviewUrl: "https://g.page/r/bloom-salon/review",
    unsubscribeUrl: "https://buzrareviews.com/unsubscribe?c=abc&t=def",
  };

  test("keeps the current subject", () => {
    const { subject } = renderReviewRequestEmail(base);
    expect(subject).toBe("How was your visit to Bloom Salon?");
  });

  test("greeting uses the first name when given", () => {
    const { html, text } = renderReviewRequestEmail({ ...base, firstName: "Maya" });
    expect(html).toContain("Hi Maya,");
    expect(text).toContain("Hi Maya,");
  });

  test('greeting is "Hi there," when no first name is given', () => {
    const { html, text } = renderReviewRequestEmail(base);
    expect(html).toContain("Hi there,");
    expect(text).toContain("Hi there,");
  });

  test("both html and text contain the footer lines and the unsubscribe URL", () => {
    const { html, text } = renderReviewRequestEmail({ ...base, businessAddress: "123 Main St, Bozeman, MT" });
    for (const part of [html, text]) {
      expect(part).toContain("You're getting this email because you visited Bloom Salon.");
      expect(part).toContain("Sent by BuzraReviews on behalf of Bloom Salon, 123 Main St, Bozeman, MT.");
      expect(part).toContain(base.unsubscribeUrl);
    }
  });

  test("omits the address from the footer line when none is given", () => {
    const { html, text } = renderReviewRequestEmail(base);
    for (const part of [html, text]) {
      expect(part).toContain("Sent by BuzraReviews on behalf of Bloom Salon.");
    }
  });

  test("output contains no em or en dashes", () => {
    const { subject, html, text } = renderReviewRequestEmail({
      ...base,
      firstName: "Maya",
      businessAddress: "123 Main St, Bozeman, MT",
    });
    for (const part of [subject, html, text]) {
      expect(part).not.toContain(EM_DASH);
      expect(part).not.toContain(EN_DASH);
    }
  });
});
