import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

// RFC 8058 one-click unsubscribe POST handler.
// Gmail/Yahoo bulk-sender spec (Feb 2024) requires both:
//   List-Unsubscribe: <https://.../api/unsubscribe/<token>>
//   List-Unsubscribe-Post: List-Unsubscribe=One-Click
// When the mail client hits this POST, we must unsubscribe immediately
// (no confirmation page) and return 200.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function performUnsubscribe(token: string) {
  const supabase = getServerSupabase();
  const { data: row } = await supabase
    .from("unsubscribe_tokens")
    .select("*")
    .eq("token", token)
    .single();
  if (!row) return false;

  const emailLower = row.email.toLowerCase();
  await supabase.from("email_suppressions").upsert(
    {
      email: emailLower,
      reason: "unsubscribed",
      campaign_id: row.campaign_id,
    },
    { onConflict: "email" },
  );

  if (row.signup_id) {
    const { data: signup } = await supabase
      .from("signups")
      .select("interests")
      .eq("id", row.signup_id)
      .single();
    if (signup) {
      const nextInterests = Array.isArray(signup.interests)
        ? signup.interests.filter((i: string) => i !== "updates")
        : [];
      await supabase
        .from("signups")
        .update({ interests: nextInterests })
        .eq("id", row.signup_id);
    }
  }

  await supabase
    .from("unsubscribe_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token);

  return true;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const ok = await performUnsubscribe(token);
  if (!ok) return new NextResponse("Invalid token", { status: 404 });
  return new NextResponse("Unsubscribed", { status: 200 });
}

// Also handle GET for HTML confirmation click-through (from our email footer)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const ok = await performUnsubscribe(token);
  return NextResponse.redirect(
    new URL(
      `/unsubscribe/${token}${ok ? "" : "?error=1"}`,
      _req.url,
    ),
  );
}
