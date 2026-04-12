import { createClient } from "@supabase/supabase-js";

/**
 * Verify an admin request. Requires:
 *  - x-admin-token header set to the caller's Supabase access token (JWT)
 *  - that token must correspond to a user whose email is in ADMIN_EMAILS
 *
 * Returns the authenticated admin email, or throws.
 */
export async function requireAdmin(req: Request): Promise<string> {
  const token = req.headers.get("x-admin-token");
  if (!token) throw new Error("Unauthorized: missing token");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishable) throw new Error("Server misconfigured");

  const sb = createClient(url, publishable, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });

  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user?.email) throw new Error("Unauthorized: invalid session");

  const email = data.user.email.toLowerCase();
  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowlist.length === 0) {
    throw new Error("Server misconfigured: ADMIN_EMAILS not set");
  }
  if (!allowlist.includes(email)) {
    throw new Error("Forbidden: not an authorized admin");
  }
  return email;
}
