-- ─────────────────────────────────────────────────────────────────────
-- Migration 003 — Donations (received via Anedot webhook)
-- Run this in Supabase SQL Editor after migrations 000, 001, 002.
-- ─────────────────────────────────────────────────────────────────────

create table if not exists public.donations (
  id               uuid primary key default gen_random_uuid(),

  -- Identifiers
  anedot_id        text unique,
  event            text not null,

  -- Donor
  donor_name       text,
  donor_email      text,

  -- Amount
  amount_dollars   numeric(10, 2),
  net_dollars      numeric(10, 2),
  recurring        boolean not null default false,

  -- Source
  action_page_name text,
  action_page_id   text,

  -- Status / moderation
  status           text not null default 'new'
                   check (status in ('new','acknowledged','flagged','archived')),
  admin_notes      text,

  -- Raw payload for audit / compliance reporting
  raw_payload      jsonb,

  -- Timestamps
  donated_at       timestamptz,
  created_at       timestamptz not null default now(),
  reviewed_at      timestamptz,
  reviewed_by      text
);

create index if not exists donations_status_donated_idx
  on public.donations (status, donated_at desc);

create index if not exists donations_donor_email_idx
  on public.donations (lower(donor_email));

create index if not exists donations_anedot_id_idx
  on public.donations (anedot_id);

-- ─── Row Level Security ─────────────────────────────────────────────
alter table public.donations enable row level security;

-- No public access. All writes happen via service-role key from
-- the webhook route; admin reads/writes go through server routes.
