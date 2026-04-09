import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Endorsements",
  description:
    "See who supports Keri H. Carroll for Chancery Court Judge in Mississippi's 20th District. Endorsements from legal professionals, community leaders, organizations, and elected officials across Rankin County.",
};

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
    description: "Leaders who have seen Keri's impact in Rankin County",
    endorsers: [
      { name: "Name Placeholder", title: "Community Volunteer" },
      { name: "Name Placeholder", title: "Business Owner, Brandon" },
    ],
  },
  {
    label: "Organizations",
    description: "Groups and associations supporting the campaign",
    endorsers: [
      { name: "Organization Placeholder", title: "Rankin County" },
      { name: "Organization Placeholder", title: "Statewide" },
    ],
  },
  {
    label: "Elected Officials",
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

export default function EndorsementsPage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Endorsements
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
            Trusted by leaders across Rankin County
          </p>
          <div className="mt-6 w-20 h-1 bg-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* ── Featured Endorsements ────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-forest mb-4">
            Featured Endorsements
          </h2>
          <p className="text-center text-slate-light max-w-xl mx-auto mb-12">
            Hear from those who know Keri best and why they believe she is the
            right choice for Chancery Court Judge.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {featuredEndorsements.map((endorsement, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 flex flex-col items-center text-center"
              >
                {/* Placeholder photo */}
                <div className="w-20 h-20 rounded-full bg-slate-300 mb-5 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white/70"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>

                {/* Quote */}
                <svg
                  className="w-8 h-8 text-gold/40 mb-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="text-slate italic leading-relaxed mb-5">
                  &ldquo;{endorsement.quote}&rdquo;
                </p>

                <div className="mt-auto">
                  <p className="font-bold text-forest">{endorsement.name}</p>
                  <p className="text-sm text-slate-light">
                    {endorsement.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Endorsements ────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-forest mb-4">
            Endorsements by Category
          </h2>
          <p className="text-center text-slate-light max-w-xl mx-auto mb-14">
            Support for Keri spans the legal community, civic organizations,
            business leaders, and public servants throughout Rankin County.
          </p>

          <div className="grid gap-10 md:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="border border-cream-dark rounded-xl p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-forest mb-1">
                  {cat.label}
                </h3>
                <p className="text-sm text-slate-light mb-5">
                  {cat.description}
                </p>

                <ul className="divide-y divide-cream-dark">
                  {cat.endorsers.map((person, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      {/* Small placeholder avatar */}
                      <div className="w-10 h-10 shrink-0 rounded-full bg-slate-300 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white/70"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate">
                          {person.name}
                        </p>
                        <p className="text-sm text-slate-light">
                          {person.title}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Add Your Endorsement ─────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-forest mb-4">
            Add Your Endorsement
          </h2>
          <p className="text-slate leading-relaxed mb-3">
            Do you believe Keri H. Carroll has the experience, temperament, and
            dedication to serve Rankin County as Chancery Court Judge? Let your
            voice be heard.
          </p>
          <p className="text-sm text-slate-light mb-8">
            Public endorsements may be featured on this page with your
            permission. Your support makes a difference.
          </p>
          <Link
            href="/get-involved"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-forest-dark font-bold rounded-lg hover:bg-gold-light transition-colors shadow-md text-lg"
          >
            Share Your Support
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Join the Movement
          </h2>
          <p className="text-cream/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you volunteer your time, contribute to the campaign, or
            simply spread the word, every action helps bring experienced,
            compassionate leadership to the Chancery Court bench.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-involved"
              className="w-full sm:w-auto px-8 py-3.5 bg-gold text-forest-dark font-bold rounded-lg hover:bg-gold-light transition-colors shadow-md text-center"
            >
              Get Involved
            </Link>
            <Link
              href="/donate"
              className="w-full sm:w-auto px-8 py-3.5 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold hover:text-forest-dark transition-colors text-center"
            >
              Donate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
