import type { Metadata } from "next";
import Link from "next/link";
import EndorseCTA from "@/components/EndorseCTA";
import FloatingEndorse from "@/components/FloatingEndorse";
import { getServerSupabase } from "@/lib/supabase";
import type { Endorsement, EndorsementCategory } from "@/lib/supabase";
import { DONATE_URL } from "@/lib/donate";

// Pull fresh each request so newly-approved endorsements appear immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Endorsements",
  description:
    "See who supports Keri H. Carroll for Chancery Court Judge in Mississippi's 20th District. Endorsements from legal professionals, community leaders, and neighbors across Rankin County.",
};

function categoryLabel(category: EndorsementCategory | null): string {
  switch (category) {
    case "former_client":          return "Former Client";
    case "professional_reference": return "Professional Reference";
    case "community_leader":       return "Community Leader";
    case "fellow_attorney":        return "Fellow Attorney";
    case "friend_family":          return "Friend of the Campaign";
    default:                       return "Supporter";
  }
}

async function fetchApproved(): Promise<Endorsement[]> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("endorsements")
      .select("*")
      .eq("status", "approved")
      .order("featured", { ascending: false })          // featured first
      .order("featured_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[endorsements] fetch error:", error);
      return [];
    }
    return (data as Endorsement[]) || [];
  } catch (err) {
    console.error("[endorsements] fetch failed:", err);
    return [];
  }
}

// ─── Person schema.org structured data (SEO) ────────────────────────
function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Keri H. Carroll",
    alternateName: "Keri Haralson Carroll",
    jobTitle: "Candidate for Chancery Court Judge",
    description:
      "Candidate for Chancery Court Judge, Mississippi's 20th Chancery Court District, Place 1 — Rankin County, Mississippi.",
    url: "https://carrollforjudge.com",
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Mississippi College" },
      { "@type": "CollegeOrUniversity", name: "Mississippi College School of Law" },
    ],
    worksFor: { "@type": "Organization", name: "Connie Smith & Associates" },
    sameAs: ["https://www.facebook.com/kerihcarroll"],
  };
}

function reviewsJsonLd(endorsements: Endorsement[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: endorsements.map((e, i) => ({
      "@type": "Review",
      position: i + 1,
      itemReviewed: {
        "@type": "Person",
        name: "Keri H. Carroll",
        url: "https://carrollforjudge.com",
      },
      author: {
        "@type": "Person",
        name: e.name,
        ...(e.location ? { address: e.location } : {}),
      },
      reviewBody: e.endorsement,
      datePublished: e.created_at,
    })),
  };
}

export default async function EndorsementsPage() {
  const approved = await fetchApproved();
  const count = approved.length;

  return (
    <div>
      <FloatingEndorse />

      {/* ── SEO structured data ─────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      {count > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd(approved)) }}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-teal-dark text-white py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
            Voices for Keri
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-shadow-hero mb-6">
            Endorsements
          </h1>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-cream/85 max-w-2xl mx-auto leading-relaxed">
            Attorneys, former clients, and neighbors across Rankin County who
            know Keri&rsquo;s work best.
          </p>
        </div>
      </section>

      {/* ── Endorsers grid / empty state ───────────────────── */}
      {count === 0 ? (
        <EmptyState />
      ) : (
        <section className="bg-cream py-20 sm:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {approved.map((e) => (
                <EndorsementCard key={e.id} endorsement={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Add Your Endorsement ───────────────────────────── */}
      <section className="py-20 sm:py-28 bg-teal text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
            Your Voice Matters
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-shadow mb-4">
            Add Your Endorsement
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-cream/85 leading-relaxed mb-4 text-lg">
            Do you believe Keri H. Carroll has the experience, temperament, and
            dedication to serve Rankin County as Chancery Court Judge? Let your
            voice be heard.
          </p>
          <p className="text-sm text-cream/60 mb-10 italic">
            Takes about a minute — we&rsquo;ll craft a shareable graphic for you too.
          </p>
          <EndorseCTA label="Endorse Keri" />
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-dark mb-5">
            Join the Movement
          </h2>
          <p className="text-teal-dark/80 max-w-2xl mx-auto mb-10 leading-relaxed text-lg">
            Whether you volunteer your time, contribute to the campaign, or
            simply spread the word, every action helps bring experienced,
            compassionate leadership to the Chancery Court bench.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-involved"
              className="w-full sm:w-auto px-10 py-4 bg-teal-dark text-white font-semibold tracking-wide hover:bg-teal transition-colors shadow-md text-center text-lg"
            >
              Get Involved
            </Link>
            <a
              href={DONATE_URL}
              className="w-full sm:w-auto px-10 py-4 bg-white text-teal-dark font-semibold tracking-wide hover:bg-cream transition-colors shadow-md text-center text-lg"
            >
              Donate
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Single endorsement card
// ───────────────────────────────────────────────────────────────
function EndorsementCard({ endorsement: e }: { endorsement: Endorsement }) {
  const headline = e.zinger?.trim() || null;
  const fullText = e.endorsement.trim();
  const isFeatured = e.featured;

  return (
    <article
      id={`endorsement-${e.id}`}
      className={`bg-white flex flex-col shadow-sm hover:shadow-xl transition-shadow ${
        isFeatured ? "ring-1 ring-gold/30" : "border-l-4 border-gold"
      }`}
    >
      {/* Featured ribbon */}
      {isFeatured && (
        <div className="bg-gold text-teal-dark px-7 py-2 text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-2">
          <span aria-hidden="true">✦</span> Featured Endorsement
        </div>
      )}

      <div className="p-7 sm:p-8 flex flex-col flex-1">
        {/* Category + location (meta row) */}
        <div className="flex items-center gap-2 flex-wrap mb-5 text-xs">
          <span className="text-gold font-semibold uppercase tracking-[0.25em]">
            {categoryLabel(e.category)}
          </span>
          {e.location && (
            <>
              <span className="text-slate-light" aria-hidden="true">·</span>
              <span className="text-slate-light uppercase tracking-[0.2em]">
                {e.location}
              </span>
            </>
          )}
        </div>

        {/* Zinger (pull quote) */}
        {headline && (
          <blockquote
            cite={typeof window === "undefined" ? undefined : window.location.href}
            className="text-xl sm:text-2xl text-teal-dark font-semibold italic leading-snug mb-5"
          >
            &ldquo;{headline}&rdquo;
          </blockquote>
        )}

        {/* Full endorsement text */}
        <p className="text-slate leading-relaxed text-[15px] flex-1 whitespace-pre-line">
          {fullText}
        </p>

        {/* Attribution */}
        <cite className="mt-6 pt-4 border-t border-cream-dark not-italic flex items-baseline gap-2">
          <span className="text-slate-light" aria-hidden="true">—</span>
          <span className="font-semibold text-teal-dark">{e.name}</span>
        </cite>
      </div>
    </article>
  );
}

// ───────────────────────────────────────────────────────────────
// Empty state — warm, not desperate
// ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <section className="bg-cream py-24 sm:py-32">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 mb-6 border-2 border-gold/40">
          <span className="text-gold text-2xl" aria-hidden="true">✦</span>
        </div>
        <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
          Join the First Wave
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark leading-tight mb-6">
          Endorsements from across Rankin County are coming in.
        </h2>
        <p className="text-slate leading-loose mb-10 text-lg">
          Be the first to add your voice.
        </p>
        <EndorseCTA label="Endorse Keri" />
      </div>
    </section>
  );
}
