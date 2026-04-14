import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerSupabase } from "@/lib/supabase";
import {
  resolveRecipients,
  generateUnsubscribeToken,
  unsubscribeUrl,
  unsubscribeOneClickUrl,
  applyComplianceFooter,
  listUnsubscribeHeaders,
  type RecipientFilter,
} from "@/lib/broadcast";

// Gated by middleware.ts (HTTP Basic Auth)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // Pro plan allows 5 min

const BATCH_SIZE = 100; // Resend Batch API limit

// ─ GET: list past campaigns, or count recipients for a filter ───────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const supabase = getServerSupabase();

  // Preview mode: returns recipient count for a filter
  if (searchParams.get("preview") === "true") {
    const filter: RecipientFilter = {
      interests_any: searchParams.get("interests")
        ? searchParams.get("interests")!.split(",").filter(Boolean)
        : ["updates"],
    };
    try {
      const recipients = await resolveRecipients(supabase, filter);
      return NextResponse.json({
        count: recipients.length,
        sample: recipients.slice(0, 5).map((r) => ({
          email: r.email,
          name: [r.first_name, r.last_name].filter(Boolean).join(" "),
        })),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Preview failed";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // List campaigns
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data ?? [] });
}

// ─ POST: create + send a campaign ────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const {
    subject,
    body_html,
    body_text,
    from_name = "Keri Carroll for Judge",
    from_address = "campaign@carrollforjudge.com",
    reply_to = null,
    reviewed_by,
    interests_any = ["updates"],
    test_email = null, // Optional: send only to this address for QA
    confirm = false,
  }: {
    subject?: string;
    body_html?: string;
    body_text?: string;
    from_name?: string;
    from_address?: string;
    reply_to?: string | null;
    reviewed_by?: string;
    interests_any?: string[];
    test_email?: string | null;
    confirm?: boolean;
  } = body;

  // ─ Validation ──────────────────────────────────────────────────────
  if (!subject || subject.trim().length < 3) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }
  if (!body_html || body_html.trim().length < 20) {
    return NextResponse.json({ error: "HTML body is required." }, { status: 400 });
  }
  if (!body_text || body_text.trim().length < 20) {
    return NextResponse.json({ error: "Plain-text body is required." }, { status: 400 });
  }
  if (!reviewed_by || reviewed_by.trim().length === 0) {
    return NextResponse.json(
      { error: "Reviewed-by name is required (compliance)." },
      { status: 400 },
    );
  }
  if (!confirm) {
    return NextResponse.json(
      { error: "Send not confirmed. Include confirm:true to send." },
      { status: 400 },
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }
  const resend = new Resend(resendKey);
  const supabase = getServerSupabase();

  // ─ Resolve recipients ──────────────────────────────────────────────
  let recipients: Awaited<ReturnType<typeof resolveRecipients>>;
  if (test_email) {
    recipients = [
      { email: test_email, first_name: "Test", last_name: "", signup_id: "" },
    ];
  } else {
    try {
      recipients = await resolveRecipients(supabase, { interests_any });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Recipient resolution failed";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "No recipients match the filter." },
      { status: 400 },
    );
  }

  // ─ Create campaign row ─────────────────────────────────────────────
  const { data: campaign, error: campaignErr } = await supabase
    .from("email_campaigns")
    .insert({
      subject: subject.trim(),
      body_html,
      body_text,
      from_name,
      from_address,
      reply_to,
      recipient_filter: { interests_any, test_email: Boolean(test_email) },
      recipient_count: recipients.length,
      status: "sending",
      reviewed_by: reviewed_by.trim(),
      created_by: "admin",
      sending_started_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (campaignErr || !campaign) {
    return NextResponse.json(
      { error: campaignErr?.message ?? "Could not create campaign" },
      { status: 500 },
    );
  }

  // ─ Pre-insert email_sends rows + generate tokens ───────────────────
  const tokensByEmail = new Map<string, string>();
  const sendsToInsert = recipients.map((r) => {
    const token = generateUnsubscribeToken();
    tokensByEmail.set(r.email, token);
    return {
      campaign_id: campaign.id,
      signup_id: r.signup_id || null,
      email: r.email,
      status: "queued" as const,
    };
  });
  await supabase.from("email_sends").insert(sendsToInsert);

  const tokenRows = recipients.map((r) => ({
    token: tokensByEmail.get(r.email)!,
    email: r.email,
    signup_id: r.signup_id || null,
    campaign_id: campaign.id,
  }));
  await supabase.from("unsubscribe_tokens").insert(tokenRows);

  // ─ Send in batches of 100 ──────────────────────────────────────────
  let sentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    const payload = chunk.map((r) => {
      const token = tokensByEmail.get(r.email)!;
      const unsub = unsubscribeUrl(token);
      const oneClick = unsubscribeOneClickUrl(token);
      const personalizedHtml = body_html.replaceAll(
        "{{first_name}}",
        escapeHtml(r.first_name || "friend"),
      );
      const personalizedText = body_text.replaceAll(
        "{{first_name}}",
        r.first_name || "friend",
      );
      const composed = applyComplianceFooter({
        html: personalizedHtml,
        text: personalizedText,
        unsubUrl: unsub,
      });
      return {
        from: `${from_name} <${from_address}>`,
        to: r.email,
        subject: subject.trim(),
        html: composed.html,
        text: composed.text,
        reply_to: reply_to || undefined,
        headers: listUnsubscribeHeaders(oneClick),
      };
    });

    try {
      const batchResp = await resend.batch.send(payload);
      const results = Array.isArray(batchResp.data?.data) ? batchResp.data.data : [];
      for (let j = 0; j < chunk.length; j++) {
        const r = chunk[j];
        const result = results[j];
        if (result && result.id) {
          sentCount++;
          await supabase
            .from("email_sends")
            .update({
              status: "sent",
              resend_id: result.id,
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("campaign_id", campaign.id)
            .eq("email", r.email);
        } else {
          failedCount++;
          await supabase
            .from("email_sends")
            .update({
              status: "failed",
              error: "No id returned from batch send",
              updated_at: new Date().toISOString(),
            })
            .eq("campaign_id", campaign.id)
            .eq("email", r.email);
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Batch send failed";
      console.error("[broadcast] Batch failed:", msg);
      for (const r of chunk) {
        failedCount++;
        await supabase
          .from("email_sends")
          .update({
            status: "failed",
            error: msg,
            updated_at: new Date().toISOString(),
          })
          .eq("campaign_id", campaign.id)
          .eq("email", r.email);
      }
    }

    // Stay under Resend's default 2 req/s rate limit between batches
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  // ─ Finalize campaign ───────────────────────────────────────────────
  const finalStatus = failedCount === recipients.length ? "failed" : "sent";
  await supabase
    .from("email_campaigns")
    .update({
      status: finalStatus,
      sent_count: sentCount,
      failed_count: failedCount,
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaign.id);

  return NextResponse.json({
    ok: true,
    campaign_id: campaign.id,
    recipient_count: recipients.length,
    sent_count: sentCount,
    failed_count: failedCount,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
