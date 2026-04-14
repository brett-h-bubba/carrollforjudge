import type { Metadata } from "next";
import Link from "next/link";

// We re-read searchParams in generateMetadata AND the page. Force dynamic
// so Next doesn't try to cache across donor variants.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carrollforjudge.com";

interface PageProps {
  searchParams: Promise<{
    fn?: string;
    amt?: string;
    id?: string;
    recurring?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const fn = (params.fn || "").slice(0, 40);
  const ogUrl = `${SITE_URL}/api/og/thank-you${fn ? `?fn=${encodeURIComponent(fn)}` : ""}`;

  const title = fn
    ? `${fn} is supporting Keri H. Carroll for Chancery Court Judge`
    : "Supporting Keri H. Carroll for Chancery Court Judge";

  return {
    title,
    description:
      "Thank you for supporting Keri H. Carroll for Chancery Court Judge — 20th District, Place 1. Vote November 3, 2026.",
    openGraph: {
      title,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogUrl],
    },
  };
}

export default async function ThankYouPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const fn = (params.fn || "").slice(0, 40);
  const amt = (params.amt || "").slice(0, 12);
  const recurring = params.recurring === "true";

  const shareUrl = `${SITE_URL}/thank-you${fn ? `?fn=${encodeURIComponent(fn)}` : ""}`;
  const shareText = fn
    ? `I'm supporting Keri H. Carroll for Chancery Court Judge. Join me at carrollforjudge.com.`
    : `Supporting Keri H. Carroll for Chancery Court Judge. Nov 3, 2026.`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const smsBody = `${shareText} ${shareUrl}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(smsBody)}`;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-2">
          Thank You{fn ? `, ${fn}` : ""}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-teal-dark">
          You just helped elect the right judge.
        </h1>
        <p className="mt-6 text-lg text-ink max-w-xl mx-auto">
          {amt ? (
            <>
              Your {recurring ? "recurring " : ""}contribution of{" "}
              <span className="font-bold text-teal-dark">${amt}</span> means every Rankin
              County family gets experience on the bench on November 3, 2026.
            </>
          ) : (
            <>
              Your contribution means every Rankin County family gets experience on the
              bench on November 3, 2026.
            </>
          )}
        </p>

        {/* Share card preview */}
        <div className="mt-12 border border-teal/10 bg-white shadow-sm">
          <img
            src={`/api/og/thank-you${fn ? `?fn=${encodeURIComponent(fn)}` : ""}`}
            alt="Share card"
            className="w-full h-auto"
            width={1200}
            height={630}
          />
        </div>

        <div className="mt-8">
          <p className="text-sm text-ink-muted mb-4">
            Share your support — it matters.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-teal-dark text-cream font-semibold tracking-wider uppercase text-sm hover:bg-teal transition-colors"
            >
              Share on X
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-teal-dark text-cream font-semibold tracking-wider uppercase text-sm hover:bg-teal transition-colors"
            >
              Share on Facebook
            </a>
            <a
              href={smsUrl}
              className="px-6 py-3 bg-gold text-teal-dark font-semibold tracking-wider uppercase text-sm hover:opacity-90 transition-opacity"
            >
              Text a Friend
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-teal/10">
          <Link
            href="/"
            className="text-sm text-teal hover:underline tracking-wider uppercase"
          >
            ← Return to the campaign
          </Link>
        </div>
      </div>
    </div>
  );
}
