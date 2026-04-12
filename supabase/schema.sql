-- ─────────────────────────────────────────────────────────────────────
-- Carroll for Judge — Endorsements schema
-- Run this in Supabase SQL Editor (once, on a fresh project).
-- ─────────────────────────────────────────────────────────────────────

-- Endorsements table
create table if not exists public.endorsements (
  id            uuid primary key default gen_random_uuid(),

  -- Submission
  name          text not null,
  email         text not null,
  location      text,                                         -- optional city/town
  endorsement   text not null,                                -- raw text the person wrote

  -- AI analysis (populated on submit)
  category      text,                                         -- 'former_client' | 'professional_reference' | 'community_leader' | 'fellow_attorney' | 'friend_family' | 'other'
  zinger        text,                                         -- one-sentence summary
  share_caption text,                                         -- longer social caption
  safe_to_publish boolean default true,                       -- AI safety flag

  -- Moderation
  status        text not null default 'pending'               -- 'pending' | 'approved' | 'rejected'
                check (status in ('pending','approved','rejected')),
  admin_notes   text,

  -- Timestamps
  created_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   text
);

create index if not exists endorsements_status_created_idx
  on public.endorsements (status, created_at desc);

create index if not exists endorsements_category_idx
  on public.endorsements (category);

-- ─── Row Level Security ─────────────────────────────────────────────
alter table public.endorsements enable row level security;

-- Public: can read ONLY approved rows (to display on /endorsements)
drop policy if exists "public_read_approved" on public.endorsements;
create policy "public_read_approved"
  on public.endorsements
  for select
  to anon, authenticated
  using (status = 'approved');

-- Public: can insert new submissions (the form)
drop policy if exists "public_insert_submissions" on public.endorsements;
create policy "public_insert_submissions"
  on public.endorsements
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated admins (will be managed by service role + allowlist in app code)
-- Service role key bypasses RLS, so admin ops go through server-side routes
-- that check ADMIN_EMAILS against the authenticated user.

-- ─── Admin allowlist (optional — app-level check is authoritative) ──
create table if not exists public.admin_users (
  email      text primary key,
  added_at   timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- No public policies — only service role reads/writes this.
