import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';
import { sendDashboardLinkEmail } from '@/lib/resend';

// POST /api/dashboard-link
// Issue 8: lost-link recovery. Always returns the same generic 200 message
// regardless of outcome (bad input, honeypot, no match, already sent
// recently, or a real send) -- never reveals whether an account exists.
const RequestSchema = z.object({
  email: z.string().trim().email().max(254),
  company: z.string().optional(),
  startedAt: z.number(),
});

const MIN_SUBMIT_MS = 3000;
const RESEND_THROTTLE_MS = 5 * 60 * 1000;

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);

  // Invalid input is treated the same as "nothing to do" -- the response
  // never distinguishes it, so don't bother validating further than zod.
  if (!parsed.success) {
    return NextResponse.json({ ok: true });
  }

  const { email, company, startedAt } = parsed.data;
  const looksLikeSpam = Boolean(company) || Date.now() - startedAt < MIN_SUBMIT_MS;
  if (looksLikeSpam) {
    return NextResponse.json({ ok: true });
  }

  try {
    // Exact match, case-insensitive: ilike is case-insensitive by default,
    // but ilike treats %, _, and \ as wildcards in the pattern -- escaping
    // them first turns this into a safe case-insensitive exact match
    // instead of a pattern an attacker could widen (e.g. a bare "%").
    const normalizedEmail = escapeLikePattern(email.trim());
    const { data: businesses, error } = await supabaseAdmin
      .from('businesses')
      .select('id, name, owner_email, dashboard_link_sent_at')
      .ilike('owner_email', normalizedEmail)
      .limit(5);

    if (error) throw error;

    const now = Date.now();
    for (const business of businesses ?? []) {
      const lastSent = business.dashboard_link_sent_at ? new Date(business.dashboard_link_sent_at).getTime() : 0;
      if (now - lastSent < RESEND_THROTTLE_MS) continue;

      await sendDashboardLinkEmail({ to: business.owner_email, businessName: business.name, businessId: business.id });
      await supabaseAdmin.from('businesses').update({ dashboard_link_sent_at: new Date().toISOString() }).eq('id', business.id);
    }
  } catch (err) {
    console.error('Dashboard-link lookup/send failed:', err);
  }

  return NextResponse.json({ ok: true });
}
