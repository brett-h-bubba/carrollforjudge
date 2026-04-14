"use client";

import { useState } from "react";

interface Props {
  fn: string;
  amt: string;
  shareUrl: string;
  shareText: string;
  ogImageUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  smsUrl: string;
}

export default function ShareActions({
  fn,
  shareText,
  ogImageUrl,
  twitterUrl,
  facebookUrl,
  smsUrl,
}: Props) {
  const [captionCopied, setCaptionCopied] = useState(false);

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement("textarea");
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2500);
      } catch {
        // ignore
      }
      document.body.removeChild(ta);
    }
  }

  const downloadName = fn
    ? `keri-carroll-${fn.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`
    : "keri-carroll.png";

  return (
    <div className="space-y-3">
      <a
        href={ogImageUrl}
        download={downloadName}
        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-teal-dark text-cream font-semibold tracking-wider uppercase text-sm hover:bg-teal transition-colors"
      >
        <span aria-hidden>↓</span>
        Download image
      </a>

      <button
        type="button"
        onClick={copyCaption}
        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gold text-teal-dark font-semibold tracking-wider uppercase text-sm hover:opacity-90 transition-opacity"
      >
        {captionCopied ? (
          <>✓ Caption copied</>
        ) : (
          <>
            <span aria-hidden>⧉</span>
            Copy caption
          </>
        )}
      </button>

      <div className="grid grid-cols-3 gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-3 border-2 border-teal-dark text-teal-dark font-semibold tracking-wider uppercase text-xs hover:bg-teal-dark hover:text-cream transition-colors"
        >
          Share to X
        </a>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-3 border-2 border-teal-dark text-teal-dark font-semibold tracking-wider uppercase text-xs hover:bg-teal-dark hover:text-cream transition-colors"
        >
          Facebook
        </a>
        <a
          href={smsUrl}
          className="flex items-center justify-center px-3 py-3 border-2 border-teal-dark text-teal-dark font-semibold tracking-wider uppercase text-xs hover:bg-teal-dark hover:text-cream transition-colors"
        >
          Text it
        </a>
      </div>
    </div>
  );
}
