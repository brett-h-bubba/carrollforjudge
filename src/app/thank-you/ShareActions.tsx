"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  fn: string;
  ogImageUrl: string;
}

export default function ShareActions({ fn, ogImageUrl }: Props) {
  // Fire donate_completed once on mount (donor lands here after Anedot).
  useEffect(() => {
    trackEvent("donate_completed");
  }, []);
  const downloadName = fn
    ? `keri-carroll-${fn.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`
    : "keri-carroll.png";

  return (
    <div>
      <a
        href={ogImageUrl}
        download={downloadName}
        onClick={() => trackEvent("share_download", { location: "thank_you_button" })}
        className="flex items-center justify-center gap-2 w-full px-6 py-5 bg-teal-dark text-cream font-semibold tracking-wider uppercase text-base hover:bg-teal transition-colors"
      >
        <span aria-hidden>↓</span>
        Download image
      </a>
      <p className="mt-4 text-xs text-ink-muted text-center">
        Post the image to Instagram, Facebook, X — anywhere. The campaign URL is baked
        into the design.
      </p>
    </div>
  );
}
