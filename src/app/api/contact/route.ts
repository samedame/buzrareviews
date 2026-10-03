import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resend } from '@/lib/resend';

// POST /api/contact
// Setup-help requests from ContactForm on /setup. Honeypot + timing
// check silently drop spam (return 200 with no email sent, so bots can't
// tell they were filtered). Never called for real in QA -- always mocked.
const ContactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  business: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(1000).optional(),
  company: z.string().optional(),
  // Only sent when the page shows the meeting-choice radios
  // (site.inPersonInBozeman); absent entirely when it's calls-only.
  meeting: z.enum(["call", "in_person"]).optional(),
  startedAt: z.number(),
});

const MIN_SUBMIT_MS = 3000;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = ContactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the form and try again.' }, { status: 400 });
  }

  const { name, business, email, phone, message, company, meeting, startedAt } = parsed.data;

  const looksLikeSpam = Boolean(company) || Date.now() - startedAt < MIN_SUBMIT_MS;
  if (looksLikeSpam) {
    return NextResponse.json({ ok: true });
  }

  if (!process.env.CONTACT_TO_EMAIL) {
    return NextResponse.json({ error: 'Contact form is not connected yet.' }, { status: 503 });
  }

  const lines = [
    `Name: ${name}`,
    `Business: ${business}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    meeting ? `Meeting: ${meeting === 'in_person' ? 'In person in Bozeman' : 'On a call'}` : null,
    message ? `Message: ${message}` : null,
  ].filter((line): line is string => line !== null);

  const subject =
    meeting === 'call'
      ? `Setup request (call): ${business}`
      : meeting === 'in_person'
        ? `Setup request (in person): ${business}`
        : `Setup request: ${business}`;

  try {
    await resend.emails.send({
      from: `BuzraReviews <noreply@${process.env.SENDING_DOMAIN}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject,
      text: lines.join('\n'),
    });
  } catch (err) {
    console.error('Contact form email failed:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
