import { NextResponse } from "next/server";
import { sendDigest, buildMetrics, renderDigest } from "@/lib/digest";

// Gated by middleware.ts (HTTP Basic Auth)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: preview metrics without sending (returns JSON + HTML preview)
export async function GET() {
  const metrics = await buildMetrics();
  const { subject, html, text } = renderDigest(metrics);
  return NextResponse.json({ subject, html, text, metrics });
}

// POST: actually fire the digest to ADMIN_EMAILS
export async function POST() {
  const recipients = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const result = await sendDigest(recipients);
  return NextResponse.json(result);
}
