-- BuzraReviews v1 schema
-- Run this in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_email text not null,
  owner_phone text,
  google_place_id text unique,
  google_review_link text,
  address text,
  created_at timestamptz not null default now(),
  last_review_check_at timestamptz,
  last_seen_review_time timestamptz
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists review_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  sent_at timestamptz not null default now(),
  status text not null default 'sent',
  resend_email_id text
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  google_review_id text not null,
  author_name text,
  rating int,
  review_text text,
  review_time timestamptz,
  ai_draft_reply text,
  draft_generated_at timestamptz,
  owner_replied boolean not null default false,
  created_at timestamptz not null default now(),
  unique(business_id, google_review_id)
);

create index if not exists idx_customers_business on customers(business_id);
create index if not exists idx_review_requests_business on review_requests(business_id);
create index if not exists idx_reviews_business on reviews(business_id);

-- Service-role key (used by the API routes) bypasses RLS, so RLS below
-- is just a safety net in case the anon/public key is ever exposed client-side.
alter table businesses enable row level security;
alter table customers enable row level security;
alter table review_requests enable row level security;
alter table reviews enable row level security;

-- v1.1: Stripe billing ($29/mo, 14-day free trial). Columns are nullable --
-- a null subscription_status means "never subscribed". Idempotent, so it's
-- safe to re-run this whole file against a database that already has these.
alter table businesses add column if not exists stripe_customer_id text;
alter table businesses add column if not exists stripe_subscription_id text;
alter table businesses add column if not exists subscription_status text;

-- v1.2: per-business reply tone. Free text describing how AI-drafted
-- replies should sound; the dashboard offers a few presets but the owner
-- can edit it freely. Defaults to the original hardcoded tone so existing
-- businesses behave exactly as before this column existed.
alter table businesses add column if not exists reply_tone text not null default 'friendly and warm, like a small business owner writing personally';

-- Fix pass 1 (issue 12): review request email unsubscribe + suppression,
-- and a timestamp for throttling dashboard-link-recovery emails (issue 8).
-- Same statements as supabase/migrations/20261001_fix_pass_1.sql.
create table if not exists email_suppressions (
  business_id uuid not null references businesses(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  primary key (business_id, email)
);
alter table email_suppressions enable row level security;

alter table businesses add column if not exists dashboard_link_sent_at timestamptz;
