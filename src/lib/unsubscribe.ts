import { createHmac, timingSafeEqual } from 'node:crypto';
// Relative import, not the '@/' alias -- this file needs to load standalone
// in a Node-side test (no Next.js module resolution) per the Phase 9 spec.
import { site } from '../config/site';

if (!process.env.UNSUBSCRIBE_SECRET) throw new Error('Missing UNSUBSCRIBE_SECRET env var');
const SECRET = process.env.UNSUBSCRIBE_SECRET;

export function signUnsubscribeToken(customerId: string): string {
  return createHmac('sha256', SECRET).update(`unsub:v1:${customerId}`).digest('base64url');
}

export function verifyUnsubscribeToken(customerId: string, token: string): boolean {
  const expected = Buffer.from(signUnsubscribeToken(customerId));
  const actual = Buffer.from(token);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export function buildUnsubscribeUrl(customerId: string): string {
  const token = signUnsubscribeToken(customerId);
  return `${site.url}/unsubscribe?c=${encodeURIComponent(customerId)}&t=${encodeURIComponent(token)}`;
}
