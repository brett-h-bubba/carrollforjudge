import type { Metadata } from "next";
import Link from "next/link";
import ShareActions from "./ShareActions";

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

  const ogQuery = fn ? `?fn=${encodeURIComponent(fn)}` : "";
  const ogImageUrl = `${SITE_URL}/api/og/thank-you${ogQuery}`;
  const shareUrl = `${SITE_URL}/thank-you${ogQuery}`;
  const shareText = fn
    ? `I'm supporting Keri H. Carroll for Chancery Court Judge. Join me: carrollforjudge.com`
    : `Supporting Keri H. Carroll for Chancery Court Judge. November 3, 2026.`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const smsBody = `${shareText} ${shareUrl}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(smsBody)}`;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Top confirmation */}
        <div className="text-center mb-10">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-2">
            Thank you{fn ? `, ${fn}` : ""}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-teal-dark leading-tight">
            You just helped elect the right judge.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-ink max-w-xl mx-auto">
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
        </div>

        {/* Share card hero */}
        <div className="border border-teal/10 bg-white shadow-lg overflow-hidden mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImageUrl}
            alt="Share card"
            className="w-full h-auto block"
            width={1200}
            height={630}
          />
        </div>

        {/* Share call-to-action */}
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-1">
              Your card is ready
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark">
              Share it everywhere.
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Every share puts Keri in front of another Rankin voter. Download the image,
              copy the caption, and post it to Instagram, Facebook, X, or text it to a
              friend.
            </p>
          </div>

          <ShareActions
            fn={fn}
            amt={amt}
            shareUrl={shareUrl}
            shareText={shareText}
            ogImageUrl={ogImageUrl}
            twitterUrl={twitterUrl}
            facebookUrl={facebookUrl}
            smsUrl={smsUrl}
          />
        </div>

        {/* Secondary CTAs */}
        <div className="mt-16 pt-10 border-t border-teal/10 text-center">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Want to do more?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/get-involved"
              className="px-6 py-3 border-2 border-teal-dark text-teal-dark font-semibold tracking-wider uppercase text-sm hover:bg-teal-dark hover:text-cream transition-colors"
            >
              Volunteer
            </Link>
            <Link
              href="/"
              className="px-6 py-3 text-sm text-teal hover:underline tracking-wider uppercase self-center"
            >
              Return to campaign
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
