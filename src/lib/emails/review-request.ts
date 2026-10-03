// Pure renderer: no env access, no I/O. Kept subject/body wording exactly
// as src/lib/resend.ts had it (the website demo mirrors this word for word,
// src/content/demo.ts), apart from the Phase 4 "Hi there," fallback and the
// new footer below. Relative import only, so this can be dynamically
// imported standalone in a Node-side test.

export function renderReviewRequestEmail(opts: {
  businessName: string;
  firstName?: string;
  reviewUrl: string;
  unsubscribeUrl: string;
  businessAddress?: string;
}): { subject: string; html: string; text: string } {
  const { businessName, firstName, reviewUrl, unsubscribeUrl, businessAddress } = opts;
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  const subject = `How was your visit to ${businessName}?`;
  const sentOnBehalfOf = businessAddress ? `${businessName}, ${businessAddress}` : businessName;

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
      <p>${greeting}</p>
      <p>Thanks for visiting ${businessName}! We'd really appreciate it if you could leave us a quick Google review. It takes less than a minute and helps a small business a lot.</p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${reviewUrl}" style="display:inline-block;padding:12px 24px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">
          Leave a review
        </a>
      </p>
      <p>Thank you!<br/>${businessName}</p>
      <p style="margin-top:32px;color:#6b7280;font-size:12px;line-height:1.5;">
        You're getting this email because you visited ${businessName}.<br/>
        Sent by BuzraReviews on behalf of ${sentOnBehalfOf}.<br/>
        Don't want these emails? <a href="${unsubscribeUrl}" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  `;

  const text = [
    greeting,
    '',
    `Thanks for visiting ${businessName}! We'd really appreciate it if you could leave us a quick Google review. It takes less than a minute and helps a small business a lot.`,
    '',
    `Leave a review: ${reviewUrl}`,
    '',
    `Thank you!`,
    businessName,
    '',
    `You're getting this email because you visited ${businessName}.`,
    `Sent by BuzraReviews on behalf of ${sentOnBehalfOf}.`,
    `Don't want these emails? Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n');

  return { subject, html, text };
}
