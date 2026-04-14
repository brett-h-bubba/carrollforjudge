import { NextRequest, NextResponse } from "next/server";
import { sendDigest } from "@/lib/digest";

/**
 * Scheduled daily digest endpoint.
 *
 * Invoked by Supabase pg_cron via pg_net.http_post. Auth: Bearer token
 * matching CRON_SECRET env var. Route is excluded from middleware auth.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not set" }, { status: 500 });
  }
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recipients = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const result = await sendDigest(recipients);
  return NextResponse.json(result);
}

// Also allow GET for easier debugging (same auth requirement).
export async function GET(req: NextRequest) {
  return POST(req);
}
