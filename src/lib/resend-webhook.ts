/**
 * Resend webhook signature verification.
 *
 * Resend uses Svix to sign webhook deliveries. Headers:
 *   svix-id         unique event id
 *   svix-timestamp  unix seconds
 *   svix-signature  space-separated "v1,<base64>" entries (rotatable)
 *
 * To verify: HMAC-SHA256(secret, `${id}.${timestamp}.${body}`), base64.
 * Compare against any one of the signatures in the header.
 *
 * The secret is the `whsec_...` token from the Resend dashboard. We strip
 * the `whsec_` prefix and base64-decode the remainder as the key bytes.
 */

import crypto from "node:crypto";

const TOLERANCE_SECONDS = 5 * 60; // Reject events older than 5 min (replay protection)

function decodeSecret(secret: string): Buffer {
  const stripped = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  return Buffer.from(stripped, "base64");
}

export function verifyResendSignature(opts: {
  secret: string;
  svixId: string | null;
  svixTimestamp: string | null;
  svixSignature: string | null;
  rawBody: string;
}): { ok: true } | { ok: false; reason: string } {
  const { secret, svixId, svixTimestamp, svixSignature, rawBody } = opts;
  if (!svixId || !svixTimestamp || !svixSignature) {
    return { ok: false, reason: "Missing Svix headers" };
  }

  const tsNum = Number(svixTimestamp);
  if (!Number.isFinite(tsNum)) return { ok: false, reason: "Bad timestamp" };
  const drift = Math.abs(Date.now() / 1000 - tsNum);
  if (drift > TOLERANCE_SECONDS) return { ok: false, reason: "Timestamp outside tolerance" };

  const key = decodeSecret(secret);
  const signed = `${svixId}.${svixTimestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", key).update(signed).digest("base64");

  // svix-signature may contain multiple space-separated values like
  // "v1,abc== v1,def==". Any one match = valid.
  const parts = svixSignature.split(" ");
  for (const p of parts) {
    const [, sig] = p.split(",");
    if (!sig) continue;
    try {
      const a = Buffer.from(sig);
      const b = Buffer.from(expected);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
        return { ok: true };
      }
    } catch {
      // ignore
    }
  }
  return { ok: false, reason: "Signature mismatch" };
}
