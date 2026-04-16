import { NextRequest, NextResponse } from "next/server";
import { analyzeEndorsement } from "@/lib/ai";
import { getServerSupabase } from "@/lib/supabase";
import { Resend } from "resend";
import { honeypotTriggered, rateLimit, clientIp } from "@/lib/spam-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubmitBody {
  name?: string;
  email?: string;
  location?: string | null;
  endorsement?: string;
}

function bad(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  let body: SubmitBody & Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return bad(400, "Invalid JSON body.");
  }

  // Honeypot: silently accept to avoid tipping off bots.
  if (honeypotTriggered(body)) {
    return NextResponse.json({ id: "ok" });
  }

  // Rate limit: 5 submissions / 10 min per IP.
  const rl = rateLimit(`endorse:${clientIp(req)}`);
  if (!rl.ok) return bad(429, "Too many submissions. Please try again later.");

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const location = (body.location || "").trim() || null;
  const endorsement = (body.endorsement || "").trim();

  // ─ Validation ─────────────────────────────────────────
  if (!name || name.length < 2)                return bad(400, "Please provide your name.");
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return bad(400, "Please provide a valid email address.");
  if (!endorsement || endorsement.length < 20) return bad(400, "Endorsement is too short.");
  if (endorsement.length > 2000)               return bad(400, "Endorsement is too long.");

  // ─ Analyze with Gemini ────────────────────────────────
  let analysis;
  try {
    analysis = await analyzeEndorsement(name, endorsement);
  } catch (err) {
    console.error("[endorse] Gemini analysis failed:", err);
    // Fallback — still accept the endorsement, just without AI enrichment
    analysis = {
      category: "other" as const,
      zinger: `${name.split(" ")[0]} is with Keri.`,
      share_caption: `I'm endorsing Keri H. Carroll for Chancery Court Judge. Join me at carrollforjudge.com.`,
      safe_to_publish: true,
    };
  }

  // ─ Save to Supabase ───────────────────────────────────
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("endorsements")
    .insert({
      name,
      email,
      location,
      endorsement,
      category:         analysis.category,
      zinger:           analysis.zinger,
      share_caption:    analysis.share_caption,
      safe_to_publish:  analysis.safe_to_publish,
      status:           "pending",
    })
    .select("id, zinger, share_caption, category, safe_to_publish")
    .single();

  if (error || !data) {
    console.error("[endorse] Supabase insert failed:", error);
    return bad(500, "Could not save your endorsement. Please try again.");
  }

  // ─ Email admins (non-blocking) ────────────────────────
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
  const resendKey = process.env.RESEND_API_KEY;
  if (adminEmails.length > 0 && resendKey) {
    try {
      const resend = new Resend(resendKey);
      const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.carrollforjudge.com"}/admin`;
      const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const plainText = [
        `Name: ${name}`,
        `Email: ${email}`,
        location ? `Location: ${location}` : null,
        `Category: ${analysis.category}`,
        `Zinger: ${analysis.zinger}`,
        `Safe to publish: ${analysis.safe_to_publish ? "yes" : "NO — review carefully"}`,
        ``,
        `--- Full endorsement ---`,
        endorsement,
        ``,
        `Review: ${reviewUrl}`,
        ``,
        `Reply to this email to respond directly to ${name} (${email}).`,
        `--`,
        `Friends of Keri H. Carroll · carrollforjudge.com`,
      ].filter(Boolean).join("\n");

      const html = `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;background:#ffffff;">
  <div style="border-bottom:2px solid #b08a49;padding-bottom:12px;margin-bottom:20px;">
    <p style="margin:0;font-size:11px;color:#b08a49;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Carroll for Judge · Admin Notification</p>
    <h1 style="margin:6px 0 0;font-size:20px;color:#215b64;font-weight:600;">New endorsement received</h1>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:6px 0;color:#6b7280;width:110px;">Name</td><td style="padding:6px 0;"><strong>${esc(name)}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:#215b64;">${esc(email)}</a></td></tr>
    ${location ? `<tr><td style="padding:6px 0;color:#6b7280;">Location</td><td style="padding:6px 0;">${esc(location)}</td></tr>` : ""}
    <tr><td style="padding:6px 0;color:#6b7280;">Category</td><td style="padding:6px 0;">${esc(analysis.category)}</td></tr>
    <tr><td style="padding:6px 0;color:#6b7280;">Safety</td><td style="padding:6px 0;">${analysis.safe_to_publish ? '<span style="color:#059669;">Safe to publish</span>' : '<strong style="color:#dc2626;">REVIEW CAREFULLY</strong>'}</td></tr>
  </table>
  <div style="margin:20px 0;padding:14px 16px;background:#f7f1e8;border-left:3px solid #b08a49;font-style:italic;font-size:15px;color:#215b64;">
    &ldquo;${esc(analysis.zinger)}&rdquo;
  </div>
  <p style="color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:24px 0 8px;font-weight:600;">Full endorsement</p>
  <div style="white-space:pre-line;font-size:15px;line-height:1.6;color:#1a1a1a;">${esc(endorsement)}</div>
  <div style="margin-top:28px;padding-top:16px;border-top:1px solid #e5e7eb;">
    <a href="${reviewUrl}" style="display:inline-block;padding:10px 20px;background:#215b64;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Review in admin &rarr;</a>
  </div>
  <p style="margin-top:28px;font-size:11px;color:#9ca3af;line-height:1.5;">
    Hit reply to respond directly to ${esc(name)} (${esc(email)}).<br/>
    Friends of Keri H. Carroll &middot; <a href="https://www.carrollforjudge.com" style="color:#9ca3af;">carrollforjudge.com</a>
  </p>
</body></html>`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM_ENDORSEMENTS || "Carroll for Judge <endorsements@carrollforjudge.com>",
        to: adminEmails,
        replyTo: email,
        subject: `New endorsement from ${name}${location ? ` (${location})` : ""}`,
        text: plainText,
        html,
        headers: {
          "X-Entity-Ref-ID": `endorsement-${data.id}`,
          "X-Auto-Response-Suppress": "OOF, AutoReply",
        },
      });
    } catch (err) {
      console.error("[endorse] Admin email failed (non-fatal):", err);
    }
  }

  return NextResponse.json(data);
}
