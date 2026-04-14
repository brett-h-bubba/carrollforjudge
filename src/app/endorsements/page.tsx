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
    "See who supports Keri H. Carroll for Chancery Court Judge in Mississippi's 20th District. Endorsements from legal professionals, community leaders, organizations, and elected officials across Rankin County.",
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

/* ------------------------------------------------------------------ */
/*  Data — swap placeholder text for real endorsements as they arrive  */
/* ------------------------------------------------------------------ */

const featuredEndorsements = [
  {
    name: "Endorsement Coming Soon",
    title: "Community Leader",
    quote:
      "This space is reserved for a featured endorsement highlighting Keri Carroll's qualifications, character, and commitment to serving Rankin County families.",
  },
  {
    name: "Endorsement Coming Soon",
    title: "Legal Professional",
    quote:
      "This space is reserved for a featured endorsement from a respected member of the legal community who can speak to Keri's courtroom experience and judicial temperament.",
  },
  {
    name: "Endorsement Coming Soon",
    title: "Civic Leader",
    quote:
      "This space is reserved for a featured endorsement from a civic leader who has seen Keri's dedication to the community firsthand.",
  },
];

const categories = [
  {
    label: "Legal Community",
    bg: "bg-cream",
    description:
      "Attorneys, judges, and legal professionals who know Keri's work",
    endorsers: [
      { name: "Name Placeholder", title: "Attorney, Rankin County" },
      { name: "Name Placeholder", title: "Attorney, Rankin County" },
      { name: "Name Placeholder", title: "Retired Judge" },
    ],
  },
  {
    label: "Community Leaders",
    bg: "bg-white",
    description: "Leaders who have seen Keri's impact in Rankin County",
    endorsers: [
      { name: "Name Placeholder", title: "Community Volunteer" },
      { name: "Name Placeholder", title: "Business Owner, Brandon" },
    ],
  },
  {
    label: "Organizations",
    bg: "bg-cream",
    description: "Groups and associations supporting the campaign",
    endorsers: [
      { name: "Organization Placeholder", title: "Rankin County" },
      { name: "Organization Placeholder", title: "Statewide" },
    ],
  },
  {
    label: "Elected Officials",
    bg: "bg-white",
    description: "Public servants who trust Keri to serve on the bench",
    endorsers: [
      { name: "Name Placeholder", title: "Elected Official, Rankin County" },
      { name: "Name Placeholder", title: "Elected Official, Mississippi" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function EndorsementsPage() {
  const approved = await fetchApproved();
  const featured = approved
    .filter((e) => e.featured)
    .sort((a, b) => {
      const at = a.featured_at ? Date.parse(a.featured_at) : 0;
      const bt = b.featured_at ? Date.parse(b.featured_at) : 0;
      return bt - at;
    });
  const nonFeatured = approved.filter((e) => !e.featured);

  return (
    <div>
      <FloatingEndorse />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-teal-dark text-white py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-shadow-hero mb-6">
            Endorsements
          </h1>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Trusted by leaders across Rankin County
          </p>
        </div>
      </section>

      {/* ── Voices of Support (live, from DB) ─────────────────── */}
      {nonFeatured.length > 0 && (
        <section className="py-20 sm:py-28 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-3">
                Voices of Support
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-teal-dark mb-2">
                In Their Own Words
              </h2>
              <div className="w-20 h-[3px] bg-gold mx-auto mt-4" />
              <p className="text-slate-light max-w-2xl mx-auto text-lg mt-6">
                Real endorsements from Rankin County neighbors, clients, and colleagues.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {nonFeatured.map((e) => (
                <div
                  key={e.id}
                  className="bg-white border-l-4 border-gold p-7 shadow-md hover:shadow-xl transition-shadow flex flex-col"
                >
                  <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-3">
                    {categoryLabel(e.category)}
                  </p>

                  {e.zinger && (
                    <p className="text-xl text-teal-dark font-semibold italic leading-snug mb-4">
                      &ldquo;{e.zinger}&rdquo;
                    </p>
                  )}

                  <p className="text-slate leading-relaxed mb-6 flex-1 text-[15px]">
                    {e.endorsement}
                  </p>

                  <div className="pt-4 border-t border-cream-dark">
                    <p className="font-semibold text-teal-dark">{e.name}</p>
                    {e.location && (
                      <p className="text-sm text-slate-light">{e.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Endorsements ────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              Featured Endorsements
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto mb-6" />
            <p className="text-slate-light max-w-xl mx-auto text-lg">
              Hear from those who know Keri best and why they believe she is the
              right choice for Chancery Court Judge.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {(featured.length > 0
              ? featured.map((e) => ({
                  key: e.id,
                  name: e.name,
                  title: e.location
                    ? `${categoryLabel(e.category)} · ${e.location}`
                    : categoryLabel(e.category),
                  quote: e.endorsement,
                }))
              : featuredEndorsements.map((e, i) => ({
                  key: `placeholder-${i}`,
                  name: e.name,
                  title: e.title,
                  quote: e.quote,
                }))
            ).map((endorsement) => (
              <div
                key={endorsement.key}
                className="bg-cream border-l-4 border-gold p-8 shadow-md hover:shadow-xl transition-shadow flex flex-col"
              >
                {/* Gold quotation mark */}
                <svg
                  className="w-10 h-10 text-gold mb-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>

                <p className="text-slate italic leading-relaxed mb-6 flex-1 text-lg">
                  &ldquo;{endorsement.quote}&rdquo;
                </p>

                <div>
                  <p className="font-semibold text-teal text-lg">
                    {endorsement.name}
                  </p>
                  <p className="text-sm text-slate-light">
                    {endorsement.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Endorsements ────────────────────────────── */}
      {categories.map((cat) => (
        <section
          key={cat.label}
          className={`py-16 sm:py-20 ${cat.bg}`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-teal mb-2">
              {cat.label}
            </h2>
            <div className="w-20 h-[3px] bg-gold mb-4" />
            <p className="text-slate-light mb-8">{cat.description}</p>

            <div className="space-y-4">
              {cat.endorsers.map((person, j) => (
                <div
                  key={j}
                  className="flex items-center gap-4 bg-white p-4 border-l-4 border-gold/40 shadow-sm"
                >
                  <div className="w-10 h-10 shrink-0 bg-teal-dark flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gold"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-teal">{person.name}</p>
                    <p className="text-sm text-slate-light">{person.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── Add Your Endorsement ─────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-teal text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-shadow mb-2">
            Add Your Endorsement
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-cream/85 leading-relaxed mb-4 text-lg">
            Do you believe Keri H. Carroll has the experience, temperament, and
            dedication to serve Rankin County as Chancery Court Judge? Let your
            voice be heard.
          </p>
          <p className="text-sm text-cream/60 mb-10">
            Public endorsements may be featured on this page with your
            permission. Your support makes a difference.
          </p>
          <EndorseCTA label="Endorse Keri" />
          <p className="mt-5 text-xs text-cream/50 italic">
            Takes about a minute — we&rsquo;ll even make a shareable graphic for you.
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
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
