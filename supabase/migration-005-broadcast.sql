-- ─────────────────────────────────────────────────────────────────────
-- Migration 005 — Broadcast email (email blasts to supporters)
-- Run in Supabase SQL Editor after migrations 000-004.
-- ─────────────────────────────────────────────────────────────────────

-- One row per campaign blast
create table if not exists public.email_campaigns (
  id                uuid primary key default gen_random_uuid(),
  subject           text not null,
  body_html         text not null,
  body_text         text not null,
  from_name         text not null default 'Keri Carroll for Judge',
  from_address      text not null default 'campaign@carrollforjudge.com',
  reply_to          text,

  -- Filter snapshot (what was selected at send time)
  recipient_filter  jsonb not null default '{}'::jsonb,

  -- Counters
  recipient_count   integer not null default 0,
  sent_count        integer not null default 0,
  failed_count      integer not null default 0,

  -- State machine
  status            text not null default 'draft'
                    check (status in ('draft','sending','sent','failed','cancelled')),

  -- Compliance
  reviewed_by       text,          -- Person who approved the send (required)

  -- Audit
  created_by        text,
  created_at        timestamptz not null default now(),
  sending_started_at timestamptz,
  sent_at           timestamptz
);

create index if not exists email_campaigns_status_created_idx
  on public.email_campaigns (status, created_at desc);

-- Per-recipient send record (tracking + webhook reconciliation)
create table if not exists public.email_sends (
  id            uuid primary key default gen_random_uuid(),
  campaign_id   uuid not null references public.email_campaigns(id) on delete cascade,
  signup_id     uuid references public.signups(id) on delete set null,
  email         text not null,
  resend_id     text unique,
  status        text not null default 'queued'
                check (status in ('queued','sent','delivered','bounced','complained','failed','suppressed')),
  error         text,
  created_at    timestamptz not null default now(),
  sent_at       timestamptz,
  delivered_at  timestamptz,
  updated_at    timestamptz not null default now()
);

create index if not exists email_sends_campaign_status_idx
  on public.email_sends (campaign_id, status);

create index if not exists email_sends_email_idx
  on public.email_sends (lower(email));

create index if not exists email_sends_resend_id_idx
  on public.email_sends (resend_id);

-- Global do-not-send list (unsubscribes, bounces, complaints, manual)
create table if not exists public.email_suppressions (
  email        text primary key,  -- lowercased
  reason       text not null check (reason in ('unsubscribed','bounced','complained','manual')),
  campaign_id  uuid references public.email_campaigns(id) on delete set null,
  notes        text,
  created_at   timestamptz not null default now()
);

-- Opaque tokens for one-click unsubscribe (embedded in every send)
create table if not exists public.unsubscribe_tokens (
  token        text primary key,  -- url-safe random, 32 bytes
  email        text not null,
  signup_id    uuid references public.signups(id) on delete set null,
  campaign_id  uuid references public.email_campaigns(id) on delete cascade,
  created_at   timestamptz not null default now(),
  used_at      timestamptz
);

create index if not exists unsubscribe_tokens_email_idx
  on public.unsubscribe_tokens (lower(email));

-- ─── Row Level Security ─────────────────────────────────────────────
alter table public.email_campaigns     enable row level security;
alter table public.email_sends          enable row level security;
alter table public.email_suppressions   enable row level security;
alter table public.unsubscribe_tokens   enable row level security;

-- No public access. All writes via service-role key from server routes.
-- Unsubscribe route uses service-role on token lookup (public endpoint but
-- opaque token provides auth).
