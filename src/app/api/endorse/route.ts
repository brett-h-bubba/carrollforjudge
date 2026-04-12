import { NextRequest, NextResponse } from "next/server";
import { analyzeEndorsement } from "@/lib/ai";
import { getServerSupabase } from "@/lib/supabase";
import { Resend } from "resend";

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
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return bad(400, "Invalid JSON body.");
  }

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
      await resend.emails.send({
        from: "Carroll for Judge <endorsements@carrollforjudge.com>",
        to: adminEmails,
        subject: `New endorsement from ${name}${location ? ` (${location})` : ""}`,
        text: [
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
          `Review at: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin`,
        ].filter(Boolean).join("\n"),
      });
    } catch (err) {
      console.error("[endorse] Admin email failed (non-fatal):", err);
    }
  }

  return NextResponse.json(data);
}
