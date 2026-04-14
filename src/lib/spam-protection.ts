/**
 * Lightweight spam protection for public form endpoints.
 *
 * - Honeypot: check a hidden field that real users never fill.
 * - Rate limit: best-effort in-memory limiter keyed by IP. On Vercel
 *   serverless this is per-instance, not global — good enough to blunt
 *   burst abuse from a single warm container. For hardened protection,
 *   swap to Upstash Ratelimit or Vercel KV.
 */

import type { NextRequest } from "next/server";

export function honeypotTriggered(body: Record<string, unknown>): boolean {
  // Any of these fields being non-empty → bot.
  const trap = [body.website, body.url, body.homepage];
  return trap.some((v) => typeof v === "string" && v.trim().length > 0);
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  opts: { max: number; windowMs: number } = { max: 5, windowMs: 10 * 60 * 1000 },
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    const resetAt = now + opts.windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: opts.max - 1, resetAt };
  }
  existing.count += 1;
  const ok = existing.count <= opts.max;
  return { ok, remaining: Math.max(0, opts.max - existing.count), resetAt: existing.resetAt };
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
