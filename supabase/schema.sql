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
