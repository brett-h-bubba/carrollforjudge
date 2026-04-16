/**
 * Admin-alert email sender (Gmail SMTP).
 *
 * Why Gmail SMTP instead of Resend for admin alerts:
 * ─────────────────────────────────────────────────────
 * carrollforjudge.com is a brand-new sending domain with no reputation
 * — Hotmail's SmartScreen aggressively routed admin alerts to Junk even
 * with DKIM/SPF/DMARC passing. Gmail-sent email lands in Hotmail inboxes
 * at near-100% rates because of Google's established sender reputation.
 *
 * Scope: admin-facing transactional alerts ONLY (endorsement submissions,
 * signups, donation webhooks). Bulk sends TO supporters (broadcasts) still
 * use Resend — that needs dedicated infra + volume handling.
 *
 * Auth: uses a Gmail "app password" (NOT Brett's primary account password).
 * Google requires an app password for SMTP access when 2FA is enabled.
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export interface AdminMailArgs {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  /** Sets Reply-To so hitting reply responds to the submitter, not to us. */
  replyTo?: string;
  /** Extra headers for deliverability / tracking. */
  headers?: Record<string, string>;
  /** Display name prepended to the From address. Default: "Carroll for Judge". */
  fromName?: string;
}

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.warn("[mailer] GMAIL_USER or GMAIL_APP_PASSWORD not set — admin alerts disabled");
    return null;
  }
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // TLS from the start — Gmail requires it on 465
    auth: {
      user,
      // Gmail app passwords have display spaces (e.g. "abcd efgh ijkl mnop").
      // Strip them — SMTP auth wants the raw 16-char string.
      pass: pass.replace(/\s+/g, ""),
    },
  });
  return cachedTransporter;
}

/**
 * Send a transactional admin-alert email via Gmail SMTP.
 * Non-throwing — logs and returns false on failure so the API route
 * can continue and not fail the user-facing request if email breaks.
 */
export async function sendAdminMail(args: AdminMailArgs): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const user = process.env.GMAIL_USER!;
  const fromName = args.fromName || "Carroll for Judge";

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to: Array.isArray(args.to) ? args.to.join(", ") : args.to,
      replyTo: args.replyTo,
      subject: args.subject,
      text: args.text,
      html: args.html,
      headers: {
        "X-Auto-Response-Suppress": "OOF, AutoReply",
        ...(args.headers || {}),
      },
    });
    return true;
  } catch (err) {
    console.error("[mailer] sendAdminMail failed:", err);
    return false;
  }
}

/**
 * Returns the parsed ADMIN_EMAILS list, or an empty array if unset.
 */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
