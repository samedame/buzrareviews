import { Resend } from 'resend';
import { supabaseAdmin } from './supabase';
import { site } from '../config/site';
import { buildUnsubscribeUrl } from './unsubscribe';
import { renderReviewRequestEmail } from './emails/review-request';

if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY env var');
if (!process.env.SENDING_DOMAIN) throw new Error('Missing SENDING_DOMAIN env var');

export const resend = new Resend(process.env.RESEND_API_KEY);

export type SendReviewRequestResult =
  | { sent: true; emailId: string | null }
  | { sent: false; reason: 'unsubscribed' | 'suppression_check_failed' | 'send_failed' };

// The single choke point for every review request email (issue 12): checks
// the suppression list before sending, so a business can never re-trigger
// a request to someone who already unsubscribed through any caller. The
// only real caller is POST /api/customers.
export async function sendReviewRequestEmail(opts: {
  to: string;
  customerId: string;
  customerName?: string;
  businessId: string;
  businessName: string;
  businessAddress?: string;
  reviewLink: string;
}): Promise<SendReviewRequestResult> {
  const { to, customerId, customerName, businessId, businessName, businessAddress, reviewLink } = opts;
  const normalizedEmail = to.trim().toLowerCase();

  let suppressed: boolean;
  try {
    const { data, error } = await supabaseAdmin
      .from('email_suppressions')
      .select('email')
      .eq('business_id', businessId)
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (error) throw error;
    suppressed = Boolean(data);
  } catch (err) {
    // Fail closed: if we can't confirm this address isn't suppressed (for
    // example, the migration hasn't been run yet and the table doesn't
    // exist), don't send. Intentional -- see DECISIONS.md "Fix pass 1".
    console.error(`Suppression check failed for customer ${customerId}:`, err);
    return { sent: false, reason: 'suppression_check_failed' };
  }

  if (suppressed) {
    return { sent: false, reason: 'unsubscribed' };
  }

  const resolvedAddress = businessAddress || site.legalMailingAddress || undefined;
  if (!resolvedAddress) {
    console.warn(
      `No business address and no site.legalMailingAddress for business ${businessId}; review request to ${customerId} omits the address line.`
    );
  }

  const unsubscribeUrl = buildUnsubscribeUrl(customerId);
  const { subject, html, text } = renderReviewRequestEmail({
    businessName,
    firstName: customerName,
    reviewUrl: reviewLink,
    unsubscribeUrl,
    businessAddress: resolvedAddress,
  });

  const { data, error } = await resend.emails.send({
    from: `${businessName} <reviews@${process.env.SENDING_DOMAIN}>`,
    to,
    subject,
    html,
    text,
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });

  if (error) {
    console.error(`Review-request email failed for customer ${customerId}:`, error);
    return { sent: false, reason: 'send_failed' };
  }

  return { sent: true, emailId: data?.id ?? null };
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
