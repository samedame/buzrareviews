import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY env var');
if (!process.env.SENDING_DOMAIN) throw new Error('Missing SENDING_DOMAIN env var');

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReviewRequestEmail(opts: {
  to: string;
  customerName?: string;
  businessName: string;
  reviewLink: string;
}) {
  const { to, customerName, businessName, reviewLink } = opts;
  const greeting = customerName ? `Hi ${customerName},` : 'Hi,';

  return resend.emails.send({
    from: `${businessName} <reviews@${process.env.SENDING_DOMAIN}>`,
    to,
    subject: `How was your visit to ${businessName}?`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <p>${greeting}</p>
        <p>Thanks for visiting ${businessName}! We'd really appreciate it if you could leave us a quick Google review — it takes less than a minute and helps a small business a lot.</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${reviewLink}" style="display:inline-block;padding:12px 24px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">
            Leave a review
          </a>
        </p>
        <p>Thank you!<br/>${businessName}</p>
      </div>
    `,
  });
}
