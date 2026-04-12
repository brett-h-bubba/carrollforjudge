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
 * Uses the service role key — BYPASSES RLS. Never expose to browser.
 */
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
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

export interface Endorsement {
  id: string;
  name: string;
  email: string;
  location: string | null;
  endorsement: string;
  category: EndorsementCategory | null;
  zinger: string | null;
  share_caption: string | null;
  safe_to_publish: boolean;
  status: EndorsementStatus;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}
