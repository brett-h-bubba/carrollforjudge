import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client.
 * Uses the publishable key and respects Row Level Security.
 */
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

/**
 * Server-only Supabase client.
 * Uses the new-format secret API key — BYPASSES RLS. Never expose to browser.
 * Falls back to the legacy SUPABASE_SERVICE_ROLE_KEY if the new key isn't set.
 */
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type EndorsementCategory =
  | "former_client"
  | "professional_reference"
  | "community_leader"
  | "fellow_attorney"
  | "friend_family"
  | "other";

export type EndorsementStatus = "pending" | "approved" | "rejected";

/**
 * Which of the three campaign pillars the endorsement is testifying to.
 * See brand/BRAND.md + the "Experience · Fairness · Family" framework.
 * Nullable on legacy rows that predate the field.
 */
export type EndorsementPillar = "experience" | "fairness" | "family" | "other";

export const ENDORSEMENT_PILLARS: EndorsementPillar[] = [
  "experience",
  "fairness",
  "family",
  "other",
];

export interface Endorsement {
  id: string;
  name: string;
  email: string;
  location: string | null;
  endorsement: string;
  category: EndorsementCategory | null;
  pillar: EndorsementPillar | null;
  zinger: string | null;
  share_caption: string | null;
  safe_to_publish: boolean;
  status: EndorsementStatus;
  admin_notes: string | null;
  featured: boolean;
  featured_at: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export const MAX_FEATURED = 3;

// ─── Signups ──────────────────────────────────────────────────────────
export type SignupInterest =
  | "volunteer"
  | "yard_sign"
  | "host_event"
  | "updates";

export type SignupStatus = "new" | "contacted" | "converted" | "archived";

export interface Signup {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  interests: SignupInterest[];
  message: string | null;
  status: SignupStatus;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export const INTEREST_LABELS: Record<SignupInterest, string> = {
  volunteer: "Volunteer",
  yard_sign: "Yard Sign",
  host_event: "Host an Event",
  updates: "Receive Updates",
};

// ─── Email campaigns (broadcast) ──────────────────────────────────────
export type CampaignStatus = "draft" | "sending" | "sent" | "failed" | "cancelled";
export type SendStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "bounced"
  | "complained"
  | "failed"
  | "suppressed";
export type SuppressionReason = "unsubscribed" | "bounced" | "complained" | "manual";

export interface EmailCampaign {
  id: string;
  subject: string;
  body_html: string;
  body_text: string;
  from_name: string;
  from_address: string;
  reply_to: string | null;
  recipient_filter: Record<string, unknown>;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: CampaignStatus;
  reviewed_by: string | null;
  created_by: string | null;
  created_at: string;
  sending_started_at: string | null;
  sent_at: string | null;
}

export interface EmailSend {
  id: string;
  campaign_id: string;
  signup_id: string | null;
  email: string;
  resend_id: string | null;
  status: SendStatus;
  error: string | null;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  updated_at: string;
}

// ─── Inbound Emails ──────────────────────────────────────────────────
export type InboundStatus = "new" | "read" | "replied" | "archived" | "spam";

export interface InboundEmail {
  id: string;
  resend_email_id: string | null;
  message_id: string | null;
  in_reply_to: string | null;
  references: string | null;
  from_addr: string | null;
  from_name: string | null;
  to_addrs: string[];
  cc_addrs: string[];
  bcc_addrs: string[];
  subject: string | null;
  html: string | null;
  text: string | null;
  headers: Record<string, string> | null;
  body_fetched: boolean;
  status: InboundStatus;
  admin_notes: string | null;
  raw_payload: unknown;
  received_at: string;
  read_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface InboundAttachment {
  id: string;
  inbound_email_id: string;
  resend_attachment_id: string | null;
  filename: string | null;
  content_type: string | null;
  content_id: string | null;
  size_bytes: number | null;
  storage_path: string | null;
  created_at: string;
}

// ─── Donations ────────────────────────────────────────────────────────
export type DonationStatus = "new" | "acknowledged" | "flagged" | "archived";

export interface Donation {
  id: string;
  anedot_id: string | null;
  event: string;
  donor_name: string | null;
  donor_email: string | null;
  amount_dollars: number | null;
  net_dollars: number | null;
  recurring: boolean;
  action_page_name: string | null;
  action_page_id: string | null;
  status: DonationStatus;
  admin_notes: string | null;
  raw_payload: unknown;
  donated_at: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}
