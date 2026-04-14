-- ─────────────────────────────────────────────────────────────────────
-- Migration 004 — Inbound Inbox (emails received via Resend webhook)
-- Run this in Supabase SQL Editor after migrations 000, 001, 002, 003.
--
-- Also create a Storage bucket in Supabase:
--   Name: inbound-attachments
--   Public: false
-- Adjust Storage policies as needed for admin service-role access.
-- ─────────────────────────────────────────────────────────────────────

create table if not exists public.inbound_emails (
  id                uuid primary key default gen_random_uuid(),

  -- Resend identifiers
  resend_email_id   text unique,
  message_id        text,
  in_reply_to       text,
  "references"      text,

  -- Envelope
  from_addr         text,
  from_name         text,
  to_addrs          jsonb not null default '[]'::jsonb,
  cc_addrs          jsonb not null default '[]'::jsonb,
  bcc_addrs         jsonb not null default '[]'::jsonb,
  subject           text,

  -- Body (fetched lazily via Resend API after initial webhook)
  html              text,
  text              text,
  headers           jsonb,
  body_fetched      boolean not null default false,

  -- Moderation
  status            text not null default 'new'
                    check (status in ('new','read','replied','archived','spam')),
  admin_notes       text,

  -- Raw webhook payload for audit
  raw_payload       jsonb,

  -- Timestamps
  received_at       timestamptz not null default now(),
  read_at           timestamptz,
  reviewed_at       timestamptz,
  reviewed_by       text
);

create index if not exists inbound_emails_status_received_idx
  on public.inbound_emails (status, received_at desc);

create index if not exists inbound_emails_from_idx
  on public.inbound_emails (lower(from_addr));

create index if not exists inbound_emails_message_id_idx
  on public.inbound_emails (message_id);

-- ─ Attachments ──────────────────────────────────────────────────────
create table if not exists public.inbound_email_attachments (
  id                  uuid primary key default gen_random_uuid(),
  inbound_email_id    uuid not null references public.inbound_emails(id) on delete cascade,
  resend_attachment_id text,
  filename            text,
  content_type        text,
  content_id          text,
  size_bytes          integer,
  storage_path        text,        -- e.g. "inbound-attachments/{email_id}/{filename}"
  created_at          timestamptz not null default now()
);

create index if not exists inbound_email_attachments_email_idx
  on public.inbound_email_attachments (inbound_email_id);

-- ─── Row Level Security ─────────────────────────────────────────────
alter table public.inbound_emails enable row level security;
alter table public.inbound_email_attachments enable row level security;

-- No public access. All access via service-role key from server routes.
