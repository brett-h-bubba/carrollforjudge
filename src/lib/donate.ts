/**
 * Canonical URL for the campaign donation flow.
 *
 * Falls back to the on-site /donate page if the env var isn't set (useful
 * for local dev, preview deploys before Anedot is configured, etc.).
 *
 * NEXT_PUBLIC_* vars are inlined at build time, so this constant is safe
 * in both server and client components.
 */
export const DONATE_URL =
  process.env.NEXT_PUBLIC_DONATE_URL || "/donate";

/** True when we have a real external donation URL (i.e. Anedot is live). */
export const DONATE_IS_EXTERNAL = DONATE_URL.startsWith("http");
