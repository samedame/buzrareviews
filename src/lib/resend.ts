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
  const greeting = customerName ? `Hi ${customerName},` : 'Hi there,';

  return resend.emails.send({
    from: `${businessName} <reviews@${process.env.SENDING_DOMAIN}>`,
    to,
    subject: `How was your visit to ${businessName}?`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <p>${greeting}</p>
        <p>Thanks for visiting ${businessName}! We'd really appreciate it if you could leave us a quick Google review. It takes less than a minute and helps a small business a lot.</p>
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

// Sent once, right after an owner finishes onboarding. Carries the
// dashboard link (with the business ID baked in) since that ID is the only
// way back into the dashboard and the owner has no account or password to
// log in with. The dashboard's own copy ("the link in your confirmation
// email") assumes this email exists, so if this function is ever removed,
// that copy needs to change too.
export async function sendConfirmationEmail(opts: {
  to: string;
  businessName: string;
  businessId: string;
}) {
  const { to, businessName, businessId } = opts;
  const appUrl = process.env.APP_URL || 'https://buzrareviews.com';
  const dashboardLink = `${appUrl}/dashboard?businessId=${encodeURIComponent(
    businessId
  )}&businessName=${encodeURIComponent(businessName)}`;

  return resend.emails.send({
    from: `BuzraReviews <noreply@${process.env.SENDING_DOMAIN}>`,
    to,
    subject: `You're all set, ${businessName} is connected to BuzraReviews`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto;">
        <p>Hi,</p>
        <p>${businessName} is now connected to BuzraReviews. Starting today, we'll check Google once a day for new reviews and draft a reply to each one for you to approve.</p>
        <p style="text-align: center; margin: 24px 0;">
          <a href="${dashboardLink}" style="display:inline-block;padding:12px 24px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">
            Open your dashboard
          </a>
        </p>
        <p>Bookmark that link, it's how you'll check back for new reviews and add customers to send review requests to. Your business ID is <strong>${businessId}</strong> if you ever need to re-enter it manually.</p>
        <p>Thanks for trying it out!<br/>BuzraReviews</p>
      </div>
    `,
  });
}
