import { getServerSupabase } from "@/lib/supabase";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function performUnsubscribe(token: string): Promise<{
  ok: boolean;
  email?: string;
  message: string;
}> {
  const supabase = getServerSupabase();
  const { data: row } = await supabase
    .from("unsubscribe_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (!row) {
    return { ok: false, message: "Invalid or expired unsubscribe link." };
  }

  const emailLower = row.email.toLowerCase();

  // Insert suppression (idempotent via pk)
  await supabase.from("email_suppressions").upsert(
    {
      email: emailLower,
      reason: "unsubscribed",
      campaign_id: row.campaign_id,
    },
    { onConflict: "email" },
  );

  // Remove 'updates' from signups.interests for this email
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

  // Mark token used
  await supabase
    .from("unsubscribe_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token", token);

  return {
    ok: true,
    email: row.email,
    message: "You have been unsubscribed from campaign email.",
  };
}

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await performUnsubscribe(token);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-2">
          Email Preferences
        </p>
        <h1 className="text-3xl font-bold text-teal-dark mb-6">
          {result.ok ? "Unsubscribed" : "Something went wrong"}
        </h1>
        <p className="text-lg text-ink mb-8">{result.message}</p>
        {result.email && (
          <p className="text-sm text-ink-muted mb-8">
            <span className="font-mono">{result.email}</span> will no longer receive
            campaign updates.
          </p>
        )}
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-teal-dark text-cream font-semibold tracking-wider uppercase text-sm hover:bg-teal transition-colors"
        >
          Return to carrollforjudge.com
        </Link>
      </div>
    </div>
  );
}
