/**
 * Typed helpers for GA4 conversion events.
 * Safe to call even when GA isn't configured — guards on window.gtag.
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      eventName: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

type EventName =
  | "donate_click"
  | "donate_completed"       // fired from /thank-you on initial land
  | "volunteer_submitted"    // get-involved form success
  | "yard_sign_requested"    // subset of volunteer form (interest includes yard_sign)
  | "endorsement_submitted"
  | "share_download"         // thank-you download button
  | "share_copy_caption";

export function trackEvent(event: EventName, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
