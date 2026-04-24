import type { Metadata } from "next";
import Link from "next/link";
import EndorseCTA from "@/components/EndorseCTA";
import FloatingEndorse from "@/components/FloatingEndorse";
import { EndorsementCard } from "@/components/EndorsementCard";
import { getServerSupabase } from "@/lib/supabase";
import type { Endorsement, EndorsementPillar } from "@/lib/supabase";
import { DONATE_URL } from "@/lib/donate";

const PILLAR_SECTIONS: Array<{ pillar: EndorsementPillar; title: string; blurb: string }> = [
  {
    pillar: "experience",
    title: "On her Experience",
    blurb:
      "21 years practicing the exact cases chancery court hears - attorneys, peers, and former clients speaking to the depth of her preparation.",
  },
  {
    pillar: "fairness",
    title: "On her Fairness",
    blurb:
      "Four years on the bench as Family Master. Those who have watched her listen, rule, and treat everyone with respect.",
  },
  {
    pillar: "family",
    title: "On her commitment to Family",
    blurb:
      "Clients, community leaders, and neighbors who have seen her stand with Rankin County families in their hardest moments.",
  },
];

// Pull fresh each request so newly-approved endorsements appear immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Endorsements",
  description:
    "See who supports Keri H. Carroll for Chancery Court Judge in Mississippi's 20th District. Endorsements from legal professionals, community leaders, and neighbors across Rankin County.",
  alternates: { canonical: "/endorsements" },
};

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
      "Candidate for Chancery Court Judge, Mississippi's 20th Chancery Court District, Place 1 - Rankin County, Mississippi.",
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
            Community Endorsements for Keri H. Carroll
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
        <PillarGroups approved={approved} />
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
            Takes about a minute - we&rsquo;ll craft a shareable graphic for you too.
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
// Grouped-by-pillar render. If none are classified yet, falls back
// to a single grid so legacy rows still show up.
// ───────────────────────────────────────────────────────────────
function PillarGroups({ approved }: { approved: Endorsement[] }) {
  const unclassified = approved.filter((e) => !e.pillar || e.pillar === "other");
  const classified = approved.filter((e) => e.pillar && e.pillar !== "other");

  // Legacy / pre-pillar fallback - all rows unclassified → original single grid
  if (classified.length === 0) {
    return (
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {approved.map((e) => (
              <EndorsementCard key={e.id} endorsement={e} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Jump-nav - shows pillars with at least 1 endorsement */}
        <nav
          aria-label="Jump to pillar"
          className="flex flex-wrap items-center justify-center gap-3 mb-14 pb-8 border-b border-cream-dark"
        >
          <span className="text-[10px] font-bold text-gold tracking-[0.3em] uppercase">
            Filter by pillar
          </span>
          {PILLAR_SECTIONS.filter(
            (s) => approved.some((e) => e.pillar === s.pillar),
          ).map((s) => (
            <a
              key={s.pillar}
              href={`#pillar-${s.pillar}`}
              className="text-xs font-semibold tracking-wider uppercase text-teal-dark border border-teal/30 px-3 py-1.5 hover:bg-teal hover:text-cream transition-colors"
            >
              {s.title.replace("On her ", "").replace("On her commitment to ", "")}
            </a>
          ))}
        </nav>

        {PILLAR_SECTIONS.map((s) => {
          const rows = approved.filter((e) => e.pillar === s.pillar);
          if (rows.length === 0) return null;
          return (
            <div key={s.pillar} id={`pillar-${s.pillar}`} className="mb-16 last:mb-0 scroll-mt-24">
              <header className="mb-8">
                <p className="text-gold font-semibold tracking-[0.3em] uppercase text-[11px] mb-2">
                  {rows.length} {rows.length === 1 ? "voice" : "voices"}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-teal-dark mb-3">
                  {s.title}
                </h2>
                <p className="text-slate max-w-2xl leading-relaxed">{s.blurb}</p>
                <div className="w-16 h-[2px] bg-gold mt-5" />
              </header>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {rows.map((e) => (
                  <EndorsementCard key={e.id} endorsement={e} />
                ))}
              </div>
            </div>
          );
        })}

        {unclassified.length > 0 && (
          <div id="pillar-other" className="mb-0 scroll-mt-24 pt-12 mt-12 border-t border-cream-dark">
            <header className="mb-8">
              <p className="text-gold font-semibold tracking-[0.3em] uppercase text-[11px] mb-2">
                {unclassified.length} more
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-teal-dark mb-3">
                More voices for Keri
              </h2>
              <div className="w-16 h-[2px] bg-gold mt-5" />
            </header>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {unclassified.map((e) => (
                <EndorsementCard key={e.id} endorsement={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────────────────────
// Empty state - warm, not desperate
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
