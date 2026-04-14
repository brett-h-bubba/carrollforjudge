/**
 * Broadcast email helpers — recipient resolution, compliance footer,
 * unsubscribe token generation.
 */

import crypto from "node:crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carrollforjudge.com";

export const CAMPAIGN_DISCLAIMER =
  "Paid for by the Committee to Elect Keri H. Carroll";

// CAN-SPAM requires a physical postal address in every commercial email.
// Set CAMPAIGN_MAILING_ADDRESS in Vercel env (campaign committee treasurer address).
export const CAMPAIGN_MAILING_ADDRESS =
  process.env.CAMPAIGN_MAILING_ADDRESS ||
  "Committee to Elect Keri H. Carroll, Rankin County, MS";

export interface RecipientFilter {
  interests_any?: string[]; // e.g. ["updates"]
  donor_only?: boolean;
  exclude_emails?: string[];
}

export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/unsubscribe/${token}`;
}

/** One-click POST endpoint used in the List-Unsubscribe header (RFC 8058). */
export function unsubscribeOneClickUrl(token: string): string {
  return `${SITE_URL}/api/unsubscribe/${token}`;
}

/**
 * Append compliance footer (unsubscribe link, physical address, disclaimer)
 * to both HTML and text bodies. Required by CAN-SPAM + MS judicial rules.
 */
export function applyComplianceFooter(opts: {
  html: string;
  text: string;
  unsubUrl: string;
}): { html: string; text: string } {
  const footerHtml = `
    <hr style="margin:32px 0 16px;border:none;border-top:1px solid #d9d3c6" />
    <table role="presentation" cellspacing="0" cellpadding="0" style="color:#6b6b6b;font-size:12px;font-family:Georgia,serif;line-height:1.5">
      <tr><td>
        <p>${CAMPAIGN_DISCLAIMER}</p>
        <p>${CAMPAIGN_MAILING_ADDRESS}</p>
        <p>
          You're receiving this because you signed up for updates at
          <a href="${SITE_URL}" style="color:#215b64">carrollforjudge.com</a>.
          <a href="${opts.unsubUrl}" style="color:#215b64;text-decoration:underline">Unsubscribe</a>
          to stop receiving campaign email.
        </p>
      </td></tr>
    </table>
  `;

  const footerText = [
    "",
    "---",
    CAMPAIGN_DISCLAIMER,
    CAMPAIGN_MAILING_ADDRESS,
    "",
    "You are receiving this because you signed up for updates at carrollforjudge.com.",
    `Unsubscribe: ${opts.unsubUrl}`,
  ].join("\n");

  return {
    html: opts.html + footerHtml,
    text: opts.text + footerText,
  };
}

/**
 * One-click unsubscribe headers (RFC 8058) — required by Gmail and Yahoo
 * for bulk senders since Feb 2024.
 */
export function listUnsubscribeHeaders(oneClickUrl: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${oneClickUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/**
 * Resolve recipient emails from signups matching the filter,
 * excluding anyone on the global suppression list.
 */
export async function resolveRecipients(
  supabase: ReturnType<typeof import("@/lib/supabase").getServerSupabase>,
  filter: RecipientFilter,
): Promise<Array<{ email: string; first_name: string; last_name: string; signup_id: string }>> {
  let query = supabase
    .from("signups")
    .select("id, email, first_name, last_name, interests");

  // Apply interest filter (jsonb array "contains" semantics)
  if (filter.interests_any && filter.interests_any.length > 0) {
    // supabase-js: .contains("interests", ["updates"]) => interests @> '["updates"]'
    query = query.contains("interests", filter.interests_any);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Fetch suppressions
  const { data: suppressions } = await supabase
    .from("email_suppressions")
    .select("email");
  const suppressed = new Set(
    (suppressions ?? []).map((s: { email: string }) => s.email.toLowerCase()),
  );

  const excluded = new Set(
    (filter.exclude_emails ?? []).map((e) => e.toLowerCase()),
  );

  // Dedupe by email (lowercased) so we don't double-send if someone signed
  // up twice.
  const seen = new Set<string>();
  const recipients: Array<{ email: string; first_name: string; last_name: string; signup_id: string }> = [];
  for (const row of data ?? []) {
    const emailLower = row.email?.toLowerCase();
    if (!emailLower) continue;
    if (seen.has(emailLower)) continue;
    if (suppressed.has(emailLower)) continue;
    if (excluded.has(emailLower)) continue;
    seen.add(emailLower);
    recipients.push({
      email: row.email,
      first_name: row.first_name ?? "",
      last_name: row.last_name ?? "",
      signup_id: row.id,
    });
  }

  return recipients;
}
