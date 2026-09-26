import { createClient } from '@supabase/supabase-js';

// Server-only client — uses the service role key, which bypasses Row Level
// Security. Never import this file into a "use client" component.
if (!process.env.SUPABASE_URL) throw new Error('Missing SUPABASE_URL env var');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
