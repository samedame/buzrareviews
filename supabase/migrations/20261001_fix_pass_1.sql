-- Fix pass 1 (issue 12): review request email unsubscribe + suppression,
-- and a timestamp for throttling dashboard-link-recovery emails (issue 8).
-- Run this in the Supabase SQL editor. Idempotent, matching the style of
-- the rest of supabase/schema.sql.

create table if not exists email_suppressions (
  business_id uuid not null references businesses(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  primary key (business_id, email)
);
alter table email_suppressions enable row level security;

alter table businesses add column if not exists dashboard_link_sent_at timestamptz;
