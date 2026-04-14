-- ─────────────────────────────────────────────────────────────────────
-- Migration 002 — Signups (volunteer / yard sign / host / updates)
-- Run this in Supabase SQL Editor after migrations 000 and 001.
-- ─────────────────────────────────────────────────────────────────────

create table if not exists public.signups (
  id            uuid primary key default gen_random_uuid(),

  -- Submission
  first_name    text not null,
  last_name     text not null,
  email         text not null,
  phone         text,
  address       text,
  interests     jsonb not null default '[]'::jsonb,  -- ['volunteer','yard_sign','host_event','updates']
  message       text,

  -- Moderation
  status        text not null default 'new'
                check (status in ('new','contacted','converted','archived')),
  admin_notes   text,

  -- Timestamps
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   text
);

create index if not exists signups_status_created_idx
  on public.signups (status, created_at desc);

create index if not exists signups_email_idx
  on public.signups (lower(email));

-- ─── Row Level Security ─────────────────────────────────────────────
alter table public.signups enable row level security;

-- Public: can insert new submissions (the form). No public read.
drop policy if exists "public_insert_signups" on public.signups;
create policy "public_insert_signups"
  on public.signups
  for insert
  to anon, authenticated
  with check (true);

-- Admin reads/writes go through server routes with service role key.
