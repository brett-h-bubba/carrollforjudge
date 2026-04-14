import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { Resend } from "resend";
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

  // Fire admin notification
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const resendKey = process.env.RESEND_API_KEY;

  if (adminEmails.length > 0 && resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Carroll for Judge <donations@carrollforjudge.com>",
        to: adminEmails,
        subject: `New $${amount} donation from ${donorName}${recurring}`,
        text: [
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
          .join("\n"),
      });
    } catch (err) {
      console.error("[anedot-webhook] Resend email failed (non-fatal):", err);
    }
  } else {
    console.warn("[anedot-webhook] ADMIN_EMAILS or RESEND_API_KEY missing; skipping notification");
  }

  return NextResponse.json({ received: true, event, id: donationId });
}
