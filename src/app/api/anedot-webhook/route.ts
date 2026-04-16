import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendAdminMail, getAdminEmails } from "@/lib/mailer";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Anedot webhook receiver.
 *
 * Anedot sends POST JSON to this endpoint whenever a subscribed event fires
 * (donation_completed, submission, etc.). Each request is signed with
 * SHA-256 HMAC over the raw body, delivered in the `X-Request-Signature`
 * header.
 *
 * We verify the signature, then fire an admin notification via Resend.
 *
 * Env vars required:
 * - ANEDOT_WEBHOOK_SECRET  Secret token generated in Anedot dashboard
 * - RESEND_API_KEY         Resend auth
 * - ADMIN_EMAILS           Comma-separated notification recipients
 *
 * Response policy:
 * - 401 on bad signature (reject spoofed requests)
 * - 400 on malformed body
 * - 200 on anything we handled (even if the email send failed — we don't
 *   want Anedot to retry and re-notify, and the event is captured in logs)
 */

interface AnedotDonationPayload {
  event?: string;
  payload?: {
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    amount_in_dollars?: string;
    net_amount?: string;
    recurring?: string;
    id?: string;
    action_page_name?: string;
    action_page_id?: string;
    status?: string;
    date?: string;
    date_iso8601?: string;
  };
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.ANEDOT_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[anedot-webhook] ANEDOT_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const providedSig = req.headers.get("x-request-signature") ?? "";
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (!timingSafeEqualHex(providedSig, expectedSig)) {
    console.warn("[anedot-webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: AnedotDonationPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event ?? "unknown";
  const p = body.payload ?? {};

  // Only email on donations; silently 200 for other event types.
  if (!event.startsWith("donation")) {
    console.log(`[anedot-webhook] Received non-donation event: ${event}`);
    return NextResponse.json({ received: true });
  }

  const donorName = p.name || [p.first_name, p.last_name].filter(Boolean).join(" ") || "Unknown donor";
  const amount = p.amount_in_dollars ?? "?";
  const isRecurring = p.recurring === "true";
  const recurring = isRecurring ? " (recurring)" : "";
  const actionPage = p.action_page_name ? ` via ${p.action_page_name}` : "";
  const donationId = p.id ?? "(no id)";
  const date = p.date_iso8601 ?? p.date ?? new Date().toISOString();

  // ─ Persist to Supabase (idempotent via anedot_id unique constraint) ─
  try {
    const supabase = getServerSupabase();
    const amountNum = p.amount_in_dollars ? Number(p.amount_in_dollars) : null;
    const netNum = p.net_amount ? Number(p.net_amount) : null;
    const { error: dbError } = await supabase.from("donations").upsert(
      {
        anedot_id: p.id ?? null,
        event,
        donor_name: donorName,
        donor_email: p.email ?? null,
        amount_dollars: Number.isFinite(amountNum) ? amountNum : null,
        net_dollars: Number.isFinite(netNum) ? netNum : null,
        recurring: isRecurring,
        action_page_name: p.action_page_name ?? null,
        action_page_id: p.action_page_id ?? null,
        raw_payload: body,
        donated_at: p.date_iso8601 ?? null,
      },
      { onConflict: "anedot_id" },
    );
    if (dbError) {
      console.error("[anedot-webhook] Supabase insert failed:", dbError);
    }
  } catch (err) {
    console.error("[anedot-webhook] Supabase insert threw:", err);
  }

  // Fire admin notification (Gmail SMTP)
  const adminEmails = getAdminEmails();
  if (adminEmails.length > 0) {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const plainText = [
      `New donation received!`,
      ``,
      `Donor:     ${donorName}`,
      `Email:     ${p.email || "(not provided)"}`,
      `Amount:    $${amount}${recurring}`,
      p.net_amount ? `Net:       $${p.net_amount}` : null,
      `Source:    ${actionPage || "(direct)"}`,
      `Date:      ${date}`,
      `Event:     ${event}`,
      `Anedot ID: ${donationId}`,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;background:#ffffff;">
  <div style="border-bottom:2px solid #b08a49;padding-bottom:12px;margin-bottom:20px;">
    <p style="margin:0;font-size:11px;color:#b08a49;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Carroll for Judge · Admin Notification</p>
    <h1 style="margin:6px 0 0;font-size:22px;color:#215b64;font-weight:600;">New $${esc(amount)} donation${recurring ? ' (recurring)' : ''}</h1>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:6px 0;color:#6b7280;width:110px;">Donor</td><td style="padding:6px 0;"><strong>${esc(donorName)}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;">${p.email ? `<a href="mailto:${esc(p.email)}" style="color:#215b64;">${esc(p.email)}</a>` : '<em style="color:#9ca3af;">(not provided)</em>'}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Amount</td><td style="padding:6px 0;"><strong style="color:#059669;">$${esc(amount)}</strong>${recurring ? ` <span style="color:#6b7280;">(${esc(recurring.trim())})</span>` : ''}</td></tr>
    ${p.net_amount ? `<tr><td style="padding:6px 0;color:#6b7280;">Net</td><td style="padding:6px 0;">$${esc(String(p.net_amount))}</td></tr>` : ''}
    <tr><td style="padding:6px 0;color:#6b7280;">Source</td><td style="padding:6px 0;">${esc(actionPage || "(direct)")}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Date</td><td style="padding:6px 0;">${esc(date)}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Anedot ID</td><td style="padding:6px 0;font-family:monospace;font-size:12px;color:#6b7280;">${esc(donationId)}</td></tr>
  </table>
  <p style="margin-top:28px;font-size:11px;color:#9ca3af;line-height:1.5;">
    Friends of Keri H. Carroll &middot; <a href="https://www.carrollforjudge.com" style="color:#9ca3af;">carrollforjudge.com</a>
  </p>
</body></html>`;

    await sendAdminMail({
      to: adminEmails,
      subject: `New $${amount} donation from ${donorName}${recurring}`,
      text: plainText,
      html,
      headers: {
        "X-Entity-Ref-ID": `donation-${donationId}`,
      },
    });
  } else {
    console.warn("[anedot-webhook] ADMIN_EMAILS missing; skipping notification");
  }

  return NextResponse.json({ received: true, event, id: donationId });
}
