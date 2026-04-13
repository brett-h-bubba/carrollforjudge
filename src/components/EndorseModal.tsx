"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Step = "form" | "loading" | "share" | "pending_review";

interface EndorseResponse {
  id: string;
  zinger: string;
  share_caption: string;
  category: string;
  safe_to_publish: boolean;
}

const IMAGE_FORMATS = [
  { key: "square",   label: "Instagram / Facebook Post", dimensions: "1080 × 1080" },
  { key: "story",    label: "Instagram / Facebook Story", dimensions: "1080 × 1920" },
  { key: "linkedin", label: "LinkedIn Banner",            dimensions: "1584 × 396"  },
];

export default function EndorseModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [endorsement, setEndorsement] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EndorseResponse | null>(null);
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Ensure createPortal only runs client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state, scroll to top, and lock body scroll when opened
  useEffect(() => {
    if (open) {
      setStep("form");
      setError(null);
      setResult(null);

      // Reset modal scroll positions (outer overlay + inner panel)
      requestAnimationFrame(() => {
        backdropRef.current?.scrollTo({ top: 0 });
        panelRef.current?.scrollTo({ top: 0 });
      });

      // Lock body scroll so the page behind doesn't move
      const prevOverflow = document.body.style.overflow;
      const prevPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPaddingRight;
      };
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !endorsement.trim()) {
      setError("Please fill in your name, email, and endorsement.");
      return;
    }
    if (endorsement.trim().length < 20) {
      setError("Please write at least a sentence or two (20+ characters).");
      return;
    }

    setStep("loading");

    try {
      const res = await fetch("/api/endorse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          location: location.trim() || null,
          endorsement: endorsement.trim(),
        }),
      });

      if (!res.ok) {
        const { error: errMsg } = await res.json().catch(() => ({ error: "Something went wrong." }));
        throw new Error(errMsg || "Something went wrong.");
      }

      const data: EndorseResponse = await res.json();
      setResult(data);

      if (!data.safe_to_publish) {
        setStep("pending_review");
      } else {
        setStep("share");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setStep("form");
    }
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-ink/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="endorse-title"
    >
      {/* Flex wrapper centers the panel but lets it push to the top
          if it's taller than the viewport (so nothing is cut off) */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-8">
        <div
          ref={panelRef}
          className="relative bg-cream w-full max-w-2xl border-2 border-gold/40 shadow-2xl my-auto"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-teal hover:text-gold transition-colors p-2 z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ─── STEP 1: FORM ─── */}
        {step === "form" && (
          <div className="p-8 sm:p-12">
            <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
              Your Voice Matters
            </p>
            <h2
              id="endorse-title"
              className="text-3xl sm:text-4xl font-bold text-teal-dark tracking-normal mb-2"
            >
              Endorse Keri
            </h2>
            <div className="w-16 h-[2px] bg-gold mb-6" />
            <p className="text-ink-muted leading-relaxed mb-8">
              Share why you support Keri for Chancery Court Judge. We&rsquo;ll craft a
              shareable graphic you can post to social media to spread the word.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your Name" required>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={120}
                    className="w-full px-4 py-3 bg-white border-2 border-teal/20 text-ink focus:border-gold focus:outline-none transition-colors"
                  />
                </Field>
                <Field label="City / Town" hint="(optional)">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    maxLength={80}
                    placeholder="e.g. Brandon, MS"
                    className="w-full px-4 py-3 bg-white border-2 border-teal/20 text-ink focus:border-gold focus:outline-none transition-colors"
                  />
                </Field>
              </div>

              <Field label="Email" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                  className="w-full px-4 py-3 bg-white border-2 border-teal/20 text-ink focus:border-gold focus:outline-none transition-colors"
                />
                <p className="text-xs text-ink-muted mt-1.5 italic">
                  Used for verification only. Not displayed or shared.
                </p>
              </Field>

              <Field label="Your Endorsement" required>
                <textarea
                  value={endorsement}
                  onChange={(e) => setEndorsement(e.target.value)}
                  required
                  rows={6}
                  maxLength={2000}
                  placeholder="Tell us why you support Keri. Did she help you or your family? Have you worked with her professionally? What should others know?"
                  className="w-full px-4 py-3 bg-white border-2 border-teal/20 text-ink focus:border-gold focus:outline-none transition-colors resize-y"
                />
                <p className="text-xs text-ink-muted mt-1.5">
                  {endorsement.length}/2000 characters
                </p>
              </Field>

              {error && (
                <div className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-teal-dark text-cream px-6 py-4 font-semibold tracking-wide hover:bg-teal transition-colors"
                >
                  Submit Endorsement
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-4 font-semibold tracking-wide text-teal hover:text-gold transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-ink-muted italic leading-relaxed pt-2">
                By submitting, you agree your name, location, and endorsement may be
                displayed publicly on carrollforjudge.com and used for campaign materials
                after review.
              </p>
            </form>
          </div>
        )}

        {/* ─── STEP 2: LOADING ─── */}
        {step === "loading" && (
          <div className="p-12 sm:p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-8">
              <div className="w-16 h-16 border-4 border-gold/30 border-t-gold animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-teal-dark mb-3">
              Preparing your graphic&hellip;
            </h3>
            <p className="text-ink-muted leading-relaxed max-w-sm mx-auto">
              We&rsquo;re analyzing your endorsement and designing a shareable graphic
              just for you.
            </p>
          </div>
        )}

        {/* ─── STEP 3: SHARE ─── */}
        {step === "share" && result && (
          <ShareStep result={result} onClose={onClose} />
        )}

        {/* ─── STEP 3-alt: PENDING REVIEW ─── */}
        {step === "pending_review" && (
          <div className="p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-6 bg-gold/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-teal-dark mb-3">
              Thank you!
            </h3>
            <p className="text-ink-muted leading-relaxed max-w-md mx-auto mb-8">
              Your endorsement has been received and will be reviewed by the
              campaign team. We&rsquo;ll be in touch soon.
            </p>
            <button
              onClick={onClose}
              className="bg-teal-dark text-cream px-8 py-3 font-semibold tracking-wide hover:bg-teal transition-colors"
            >
              Close
            </button>
          </div>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Share step (separated for clarity) ──────────────────────────────
function ShareStep({
  result,
  onClose,
}: {
  result: EndorseResponse;
  onClose: () => void;
}) {
  const [selectedFormat, setSelectedFormat] = useState(IMAGE_FORMATS[0].key);
  const imgUrl = `/api/og/endorsement/${result.id}?format=${selectedFormat}`;

  async function copyCaption() {
    await navigator.clipboard.writeText(result.share_caption);
  }

  const shareText = encodeURIComponent(result.share_caption);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = encodeURIComponent(`${siteUrl}/endorsements`);

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`;
  const liShare = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
  const xShare  = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;

  return (
    <div className="p-8 sm:p-12">
      <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
        Thank You
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold text-teal-dark tracking-normal mb-2">
        Your endorsement is in
      </h2>
      <div className="w-16 h-[2px] bg-gold mb-6" />

      <p className="text-ink-muted leading-relaxed mb-6">
        Here&rsquo;s a shareable graphic. It&rsquo;ll appear publicly once the
        campaign team approves it.
      </p>

      {/* Zinger preview */}
      <blockquote className="border-l-4 border-gold bg-white px-5 py-4 italic text-lg text-teal-dark mb-8">
        &ldquo;{result.zinger}&rdquo;
      </blockquote>

      {/* Image preview */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal uppercase tracking-wider mb-3">
          Preview
        </p>
        <div className="border-2 border-teal/20 bg-white overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt="Endorsement graphic preview"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Format selector */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-teal uppercase tracking-wider mb-3">
          Choose a Format
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {IMAGE_FORMATS.map((fmt) => (
            <button
              key={fmt.key}
              onClick={() => setSelectedFormat(fmt.key)}
              className={`px-4 py-3 border-2 text-left transition-colors ${
                selectedFormat === fmt.key
                  ? "border-gold bg-gold/10 text-teal-dark"
                  : "border-teal/20 text-ink-muted hover:border-teal/40"
              }`}
            >
              <div className="text-sm font-semibold">{fmt.label}</div>
              <div className="text-xs italic opacity-70">{fmt.dimensions}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <a
          href={imgUrl + "&download=1"}
          download={`carrollforjudge-endorsement-${selectedFormat}.png`}
          className="block text-center bg-teal-dark text-cream px-6 py-4 font-semibold tracking-wide hover:bg-teal transition-colors"
        >
          Download Graphic
        </a>

        <div className="grid grid-cols-3 gap-3">
          <a
            href={fbShare}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border-2 border-teal/20 py-3 text-sm font-semibold text-teal hover:border-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </a>
          <a
            href={liShare}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border-2 border-teal/20 py-3 text-sm font-semibold text-teal hover:border-gold transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={xShare}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border-2 border-teal/20 py-3 text-sm font-semibold text-teal hover:border-gold transition-colors"
          >
            X / Twitter
          </a>
        </div>

        <button
          onClick={copyCaption}
          className="w-full text-left bg-white border-2 border-teal/20 px-4 py-3 text-sm hover:border-gold transition-colors group"
        >
          <div className="text-xs font-semibold text-teal uppercase tracking-wider mb-1 group-hover:text-gold">
            Copy share caption
          </div>
          <div className="text-ink italic">&ldquo;{result.share_caption}&rdquo;</div>
        </button>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 text-teal hover:text-gold transition-colors text-sm font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Small field wrapper ────────────────────────────────────────────
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-teal mb-1.5">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
        {hint && <span className="text-ink-muted font-normal ml-1">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

