import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { verifyResendSignature } from "@/lib/resend-webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Resend inbound-email webhook receiver.
 *
 * Subscribes to the `email.received` event. Resend delivers metadata only
 * (no body bytes) — we persist what we got, then optionally fetch full
 * body + attachments later via the Received Emails API.
 *
 * Env vars:
 *   RESEND_INBOUND_WEBHOOK_SECRET  Svix signing secret (whsec_...)
 *   RESEND_API_KEY                 Used for body/attachment fetches
 */

interface ResendInboundPayload {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
    from?: { email?: string; name?: string } | string;
    to?: Array<string | { email?: string }>;
    cc?: Array<string | { email?: string }>;
    bcc?: Array<string | { email?: string }>;
    subject?: string;
    message_id?: string;
    in_reply_to?: string;
    references?: string;
    attachments?: Array<{
      id?: string;
      filename?: string;
      content_type?: string;
      content_disposition?: string;
      content_id?: string;
    }>;
  };
}

function normalizeAddrs(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((v) => {
      if (typeof v === "string") return v;
      if (v && typeof v === "object" && "email" in v && typeof (v as { email: unknown }).email === "string") {
        return (v as { email: string }).email;
      }
      return null;
    })
    .filter((v): v is string => Boolean(v));
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[resend-inbound] RESEND_INBOUND_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const sig = verifyResendSignature({
    secret,
    svixId: req.headers.get("svix-id"),
    svixTimestamp: req.headers.get("svix-timestamp"),
    svixSignature: req.headers.get("svix-signature"),
    rawBody,
  });
  if (!sig.ok) {
    console.warn("[resend-inbound] Signature rejected:", sig.reason);
    return NextResponse.json({ error: sig.reason }, { status: 401 });
  }

  let payload: ResendInboundPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.type !== "email.received") {
    // Not an inbound event — ack and move on.
    return NextResponse.json({ received: true, ignored: payload.type });
  }

  const d = payload.data ?? {};

  const fromObj =
    typeof d.from === "object" && d.from !== null
      ? d.from
      : typeof d.from === "string"
        ? { email: d.from }
        : null;

  const row = {
    resend_email_id: d.email_id ?? null,
    message_id: d.message_id ?? null,
    in_reply_to: d.in_reply_to ?? null,
    references: d.references ?? null,
    from_addr: fromObj?.email ?? null,
    from_name: fromObj?.name ?? null,
    to_addrs: normalizeAddrs(d.to),
    cc_addrs: normalizeAddrs(d.cc),
    bcc_addrs: normalizeAddrs(d.bcc),
    subject: d.subject ?? null,
    raw_payload: payload as unknown,
    received_at: payload.created_at ?? new Date().toISOString(),
  };

  const supabase = getServerSupabase();
  const { data: inserted, error } = await supabase
    .from("inbound_emails")
    .upsert(row, { onConflict: "resend_email_id" })
    .select("id")
    .single();

  if (error) {
    console.error("[resend-inbound] Supabase insert failed:", error);
    // Still ack so Resend doesn't retry forever — we have the event in logs.
    return NextResponse.json({ received: true, persisted: false });
  }

  // Store attachment stubs (bytes fetched lazily)
  if (inserted && Array.isArray(d.attachments) && d.attachments.length > 0) {
    const rows = d.attachments.map((a) => ({
      inbound_email_id: inserted.id,
      resend_attachment_id: a.id ?? null,
      filename: a.filename ?? null,
      content_type: a.content_type ?? null,
      content_id: a.content_id ?? null,
    }));
    const { error: attErr } = await supabase.from("inbound_email_attachments").insert(rows);
    if (attErr) console.error("[resend-inbound] Attachment insert failed:", attErr);
  }

  return NextResponse.json({ received: true, id: inserted?.id });
}
