import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Keri",
  description:
    "Learn about Keri H. Carroll — a Mississippi attorney with 21 years of family law experience, running for Chancery Court Judge in the 20th District (Rankin County).",
};

const timelineEvents = [
  {
    label: "Mississippi College",
    description: "Earned her undergraduate degree at Mississippi College in Clinton, Mississippi.",
  },
  {
    label: "Mississippi College School of Law",
    description: "Graduated from MC School of Law, building a strong foundation in Mississippi jurisprudence.",
  },
  {
    year: "2005",
    label: "Admitted to the Mississippi Bar",
    description: "Began her legal career as a licensed attorney in the State of Mississippi.",
  },
  {
    label: "Supreme Court Clerkship",
    description:
      "Clerked for Chief Justice James W. Smith Jr. at the Mississippi Supreme Court, gaining firsthand experience in appellate decision-making at the highest level.",
  },
  {
    year: "2006",
    label: "Launched Solo Practice",
    description:
      "Founded Keri Haralson Carroll, PLLC, dedicating her practice to family law and chancery matters.",
  },
  {
    label: "Public Defender — Pearl Municipal & Youth Court",
    description:
      "Served as a public defender in Pearl, ensuring every person received competent legal representation regardless of means.",
  },
  {
    label: "Adjunct Professor — Mississippi College",
    description:
      "Returned to her alma mater to teach the next generation of Mississippi lawyers.",
  },
  {
    label: "Connie Smith & Associates",
    description:
      "Joined the Flowood firm, continuing to represent families across Rankin County in chancery matters.",
  },
  {
    year: "2025",
    label: "Supreme Court Appellate Work",
    description:
      "Handled appellate work before the Mississippi Supreme Court in a custody and adoption case originating in Rankin County Chancery Court.",
  },
  {
    year: "2026",
    label: "Running for Chancery Court Judge",
    description:
      "Announced her candidacy for Chancery Court Judge, 20th District, Place 1 — bringing two decades of relevant experience to the bench.",
  },
];

const practiceAreas = [
  {
    title: "Adoption",
    description:
      "Guiding families through every step of the adoption process — from termination of parental rights to final decrees.",
    relevance: "Adoptions are heard exclusively in chancery court.",
  },
  {
    title: "Child Custody & Support",
    description:
      "Advocating for custody arrangements and support orders that serve the best interest of the child.",
    relevance: "Custody and support disputes are core chancery matters.",
  },
  {
    title: "Divorce",
    description:
      "Representing clients through contested and uncontested divorces, including equitable distribution and alimony.",
    relevance: "All Mississippi divorces are filed in chancery court.",
  },
  {
    title: "Guardianship & Conservatorship",
    description:
      "Protecting vulnerable adults and minors by establishing legal guardianships and conservatorships.",
    relevance: "Guardianship petitions are decided by chancellors.",
  },
  {
    title: "Juvenile Matters",
    description:
      "Handling cases involving minors in the youth court system, including abuse, neglect, and delinquency proceedings.",
    relevance: "Youth court falls under chancery court jurisdiction.",
  },
  {
    title: "Probate & Estate",
    description:
      "Administering wills, estates, and probate matters to ensure families can settle affairs with clarity and fairness.",
    relevance: "Probate is a foundational chancery court function.",
  },
  {
    title: "Domestic Violence",
    description:
      "Securing protective orders and safety for victims of domestic abuse.",
    relevance: "Protection orders are issued by chancery courts.",
  },
  {
    title: "Appellate Work",
    description:
      "Briefing and arguing appeals before the Mississippi Supreme Court and Court of Appeals in family law cases.",
    relevance: "Deep appellate experience sharpens judicial reasoning.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ───── Hero ───── */}
      <section className="bg-forest text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            About Keri H. Carroll
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
            Twenty-one years of practicing law in the matters that chancery court
            decides every day — adoption, custody, divorce, guardianship, probate,
            and more.
          </p>
        </div>
      </section>

      {/* ───── Bio Section ───── */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* Photo placeholder */}
            <div className="md:col-span-2">
              <div className="aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl bg-slate-300 flex items-center justify-center">
                <span className="text-slate-light text-sm tracking-wide uppercase">
                  Photo
                </span>
              </div>
            </div>

            {/* Narrative bio */}
            <div className="md:col-span-3 space-y-5 text-slate text-lg leading-relaxed">
              <p>
                Keri Haralson Carroll has spent her entire legal career immersed in
                the kinds of cases that come before a chancellor. After earning her
                undergraduate degree and law degree from Mississippi College, she
                began her career with a clerkship at the Mississippi Supreme Court
                under Chief Justice James W. Smith Jr. — an experience that gave
                her an inside view of how appellate courts evaluate the decisions
                made by trial judges, and what distinguishes a well-reasoned ruling
                from one that does not hold up on review.
              </p>
              <p>
                In 2006, just a year after being admitted to the bar, Keri opened
                her own practice. From day one, she focused on family law and
                chancery matters: adoptions, custody disputes, divorces,
                guardianships, conservatorships, juvenile proceedings, and probate.
                She built her firm one client at a time, earning a reputation for
                thorough preparation, honest counsel, and genuine care for the
                families she served.
              </p>
              <p>
                Along the way, Keri answered calls to serve beyond her own
                practice. She served as a public defender in Pearl Municipal and
                Youth Court, making sure that every person who appeared before the
                court — regardless of their financial circumstances — received
                competent, dedicated representation. She also returned to
                Mississippi College as an adjunct professor, teaching law to the
                next generation of Mississippi attorneys and investing in the
                profession she loves.
              </p>
              <p>
                Today, Keri practices at Connie Smith &amp; Associates in Flowood,
                where she continues to represent Rankin County families in chancery
                matters. In 2025, she handled appellate work before the Mississippi
                Supreme Court in a custody and adoption case that originated right
                here in Rankin County Chancery Court — the very court she is asking
                voters to let her serve.
              </p>
              <p>
                With twenty-one years of experience practicing the law that
                chancellors apply every day, Keri is not running to learn on the
                job. She is running because she is ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Career Timeline ───── */}
      <section className="py-16 sm:py-24 bg-cream-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest text-center mb-14">
            Career Timeline
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gold/40" />

            <div className="space-y-10">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative pl-12 sm:pl-16">
                  {/* Dot */}
                  <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 rounded-full bg-gold ring-4 ring-cream-dark" />

                  {event.year && (
                    <span className="inline-block text-sm font-bold text-gold-dark tracking-wide uppercase mb-1">
                      {event.year}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-forest">
                    {event.label}
                  </h3>
                  <p className="mt-1 text-slate-light leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Practice Areas ───── */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest">
              Practice Areas
            </h2>
            <p className="mt-3 text-slate-light text-lg max-w-2xl mx-auto">
              Every area of Keri&rsquo;s practice maps directly to the jurisdiction of
              Mississippi&rsquo;s chancery courts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area) => (
              <div
                key={area.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-forest mb-2">
                  {area.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed mb-3">
                  {area.description}
                </p>
                <p className="text-xs text-gold-dark font-semibold uppercase tracking-wide">
                  {area.relevance}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Why I'm Running ───── */}
      <section className="py-16 sm:py-24 bg-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <svg
              className="w-10 h-10 text-gold mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M11.3 2.6c.3-.5 1-.5 1.4 0l2.5 4.2c.2.3.5.5.8.6l4.7 1.1c.6.1.8.8.4 1.3l-3.2 3.5c-.2.3-.3.6-.3 1l.5 4.8c.1.6-.5 1-1 .7l-4.4-1.9c-.3-.1-.7-.1-1 0l-4.4 1.9c-.5.3-1.1-.1-1-.7l.5-4.8c0-.4-.1-.7-.3-1L2.3 9.8c-.4-.5-.2-1.2.4-1.3l4.7-1.1c.3-.1.6-.3.8-.6l2.5-4.2z" />
            </svg>
          </div>
          <blockquote className="text-2xl sm:text-3xl font-semibold leading-snug text-cream italic">
            &ldquo;Rankin County deserves a chancellor with meaningful experience
            in the kinds of matters chancery court hears every day.&rdquo;
          </blockquote>
          <p className="mt-6 text-cream/70 text-lg">
            &mdash; Keri H. Carroll
          </p>
          <p className="mt-8 text-cream/80 text-base max-w-2xl mx-auto leading-relaxed">
            Families who come before the chancery court are facing some of the
            most important moments of their lives — a child&rsquo;s future, a
            loved one&rsquo;s care, the division of everything they have built.
            They deserve a judge who has spent her career in these very matters
            and who will bring preparation, patience, and fairness to every
            case.
          </p>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-16 sm:py-20 bg-cream-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-forest mb-4">
            Join the Campaign
          </h2>
          <p className="text-slate-light text-lg mb-8">
            Help bring twenty-one years of experience to the Rankin County
            bench.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold rounded-md bg-forest text-white hover:bg-forest-light transition-colors shadow-md"
            >
              Get Involved
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold rounded-md bg-gold text-forest-dark hover:bg-gold-light transition-colors shadow-md"
            >
              Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
