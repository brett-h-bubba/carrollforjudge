import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import EndorseCTA from "@/components/EndorseCTA";

export const metadata: Metadata = {
  title: "About Keri H. Carroll",
  description:
    "Keri H. Carroll has spent 21 years practicing family law in the matters chancery court hears every day — adoption, custody, divorce, guardianship, probate, and more. Learn why she is the most qualified candidate for Chancery Court Judge in Mississippi's 20th District.",
};

const timelineEvents = [
  {
    year: "MC",
    label: "Mississippi College",
    description:
      "Earned her undergraduate degree at Mississippi College in Clinton, Mississippi — laying the foundation for a career dedicated to Mississippi families.",
  },
  {
    year: "MC LAW",
    label: "Mississippi College School of Law",
    description:
      "Graduated from MC School of Law, building a rigorous foundation in Mississippi jurisprudence and family law.",
  },
  {
    year: "2005",
    label: "Admitted to the Mississippi Bar",
    description:
      "Licensed as an attorney in the State of Mississippi, beginning a career that would focus exclusively on chancery court matters.",
  },
  {
    year: "2005",
    label: "Supreme Court Clerkship",
    description:
      "Clerked for Chief Justice James W. Smith Jr. at the Mississippi Supreme Court — gaining firsthand insight into how appellate courts evaluate trial court decisions.",
  },
  {
    year: "2006",
    label: "Launched Solo Practice",
    description:
      "Founded Keri Haralson Carroll, PLLC, dedicating her practice to family law and chancery matters from day one.",
  },
  {
    year: "—",
    label: "Public Defender — Pearl Municipal & Youth Court",
    description:
      "Served as a public defender in Pearl, ensuring every person received competent legal representation regardless of financial circumstances.",
  },
  {
    year: "—",
    label: "Adjunct Professor — Mississippi College",
    description:
      "Returned to her alma mater to teach the next generation of Mississippi lawyers, investing in the profession she loves.",
  },
  {
    year: "—",
    label: "Connie Smith & Associates",
    description:
      "Joined the Flowood firm, continuing to represent Rankin County families in adoption, custody, divorce, and other chancery matters.",
  },
  {
    year: "2025",
    label: "Supreme Court Appellate Work",
    description:
      "Handled appellate briefing before the Mississippi Supreme Court in a custody and adoption case originating in Rankin County Chancery Court.",
  },
  {
    year: "2026",
    label: "Candidate for Chancery Court Judge",
    description:
      "Announced her candidacy for Chancery Court Judge, 20th District, Place 1 — bringing two decades of directly relevant experience to the bench.",
  },
];

const practiceAreas = [
  {
    title: "Adoption",
    description:
      "Guiding families through every step of the adoption process — from termination of parental rights to final decrees.",
  },
  {
    title: "Child Custody & Support",
    description:
      "Advocating for custody arrangements and support orders that serve the best interest of the child.",
  },
  {
    title: "Divorce",
    description:
      "Representing clients through contested and uncontested divorces, including equitable distribution and alimony.",
  },
  {
    title: "Guardianship & Conservatorship",
    description:
      "Protecting vulnerable adults and minors by establishing legal guardianships and conservatorships.",
  },
  {
    title: "Juvenile Matters",
    description:
      "Handling cases involving minors in the youth court system, including abuse, neglect, and delinquency proceedings.",
  },
  {
    title: "Probate & Estate",
    description:
      "Administering wills, estates, and probate matters to ensure families can settle affairs with clarity and fairness.",
  },
  {
    title: "Domestic Violence",
    description:
      "Securing protective orders and safety for victims of domestic abuse — matters of urgent importance.",
  },
  {
    title: "Appellate Work",
    description:
      "Briefing and arguing appeals before the Mississippi Supreme Court and Court of Appeals in family law cases.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ═══════ SECTION 1: HERO BANNER ═══════ */}
      <section className="bg-teal-dark py-24 sm:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold mb-6">
            An Introduction
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            About Keri H. Carroll
          </h1>
          <div className="mx-auto mt-6 w-24 h-1 bg-gold" />
          <p className="mt-8 text-lg sm:text-xl lg:text-2xl text-cream/90 max-w-3xl mx-auto leading-relaxed italic">
            The only candidate whose entire career has focused on the cases
            chancery court hears every day.
          </p>
        </div>
      </section>

      {/* ═══════ SECTION 2: BIO ═══════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 lg:gap-20 items-start">
            {/* Photo with gold left-border accent */}
            <div className="md:col-span-2">
              <div className="relative max-w-md mx-auto">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
                <div className="ml-4 aspect-[3/4] w-full overflow-hidden relative shadow-xl">
                  <Image
                    src="/images/headshot-2.jpg"
                    alt="Keri H. Carroll in cream blazer"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Narrative bio */}
            <div className="md:col-span-3 text-slate text-lg lg:text-xl leading-relaxed space-y-6">
              <p className="relative text-xl lg:text-2xl text-teal-dark leading-relaxed">
                <span className="font-script text-gold text-6xl leading-none float-left mr-3 -mt-2">
                  F
                </span>
                or twenty-one years, Keri Haralson Carroll has done one thing:
                practice the law that chancellors apply every single day. She is
                not pivoting to family law for a campaign. She has lived it for
                her entire career.
              </p>
              <p>
                After earning both her undergraduate degree and law degree from
                Mississippi College, Keri began her career with a clerkship at
                the Mississippi Supreme Court under Chief Justice James W. Smith
                Jr. That experience gave her a rare vantage point — watching how
                the state&apos;s highest court evaluates trial court decisions, what
                distinguishes a well-reasoned ruling from one that falls apart on
                appeal, and what it takes to get the law right when families are
                counting on the outcome.
              </p>
              <p>
                In 2006, just one year after being admitted to the bar, Keri
                opened her own practice. From the start, she focused exclusively
                on family law and chancery matters: adoptions, custody disputes,
                divorces, guardianships, conservatorships, juvenile proceedings,
                and probate. She built her firm one client at a time, earning a
                reputation for thorough preparation, honest counsel, and genuine
                care for the families she served across Rankin County and beyond.
              </p>
              <p>
                Keri has also answered calls to serve beyond her own practice.
                She served as a public defender in Pearl Municipal and Youth
                Court, ensuring that every person who appeared before the court
                received competent, dedicated representation — regardless of
                their financial circumstances. She returned to Mississippi
                College as an adjunct professor, teaching the next generation of
                Mississippi attorneys and investing in the profession she loves.
              </p>
              <p>
                Today, Keri practices at Connie Smith &amp; Associates in Flowood,
                continuing to represent Rankin County families in chancery
                matters. In 2025, she handled appellate work before the
                Mississippi Supreme Court in a custody and adoption case that
                originated right here in Rankin County Chancery Court — the very
                court she is asking voters to let her serve.
              </p>
              <p className="text-teal italic">
                With twenty-one years of experience in the law that chancellors
                apply every day, Keri is not running to learn on the job. She is
                running because she is ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 3: KEY QUALIFICATIONS ═══════ */}
      <section className="py-20 sm:py-28 bg-teal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              {
                stat: "21 YEARS",
                desc: "of family law practice",
              },
              {
                stat: "SUPREME COURT",
                desc: "clerkship experience",
              },
              {
                stat: "8 PRACTICE AREAS",
                desc: "matching chancery jurisdiction",
              },
              {
                stat: "READY",
                desc: "on Day One",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="text-center py-10 px-6 border border-white/10"
              >
                <div className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.15em] text-gold">
                  {item.stat}
                </div>
                <div className="mx-auto mt-4 w-8 h-px bg-gold/60" />
                <div className="mt-4 text-lg text-white/90 italic">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 4: CAREER TIMELINE ═══════ */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold mb-4">
              A Lifetime in the Law
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal">
              Career Timeline
            </h2>
            <div className="mx-auto mt-6 w-16 h-1 bg-gold" />
          </div>

          <div className="relative">
            {/* Gold vertical line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gold" />

            <div className="space-y-12">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative pl-14 sm:pl-18">
                  {/* Gold dot */}
                  <div className="absolute left-2 sm:left-4 top-2 w-4 h-4 bg-gold border-4 border-white shadow-md" />

                  <span className="inline-block text-xs font-semibold text-gold tracking-[0.25em] uppercase mb-2">
                    {event.year}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-teal leading-tight">
                    {event.label}
                  </h3>
                  <p className="mt-3 text-slate text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 5: PRACTICE AREAS ═══════ */}
      <section className="py-20 sm:py-28 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold mb-4">
              Where She Practices
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal">
              Practice Areas
            </h2>
            <div className="mx-auto mt-6 w-16 h-1 bg-gold" />
            <p className="mt-8 text-slate-light text-lg lg:text-xl max-w-2xl mx-auto italic leading-relaxed">
              Every area of Keri&apos;s practice maps directly to the jurisdiction
              of Mississippi&apos;s chancery courts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((area) => (
              <div
                key={area.title}
                className="bg-teal-dark p-6 border-t-4 border-t-gold shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                  {area.title}
                </h3>
                <p className="text-white/80 text-base leading-relaxed mb-5">
                  {area.description}
                </p>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  Heard in Chancery Court
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 6: WHY I'M RUNNING ═══════ */}
      <section className="py-24 sm:py-32 bg-teal-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-center">
            {/* Portrait — adds a visual anchor to the quote */}
            <div className="relative mx-auto lg:mx-0">
              <div className="relative w-64 sm:w-72 aspect-[3/4] shadow-2xl border-2 border-gold/40 overflow-hidden">
                <Image
                  src="/images/headshot-3.jpg"
                  alt="Keri H. Carroll"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 18rem, 18rem"
                />
              </div>
              {/* Gold corner accents */}
              <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 border-gold pointer-events-none" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-gold pointer-events-none" />
            </div>

            {/* Quote content */}
            <div className="text-center lg:text-left">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold mb-6">
                Why I&apos;m Running
              </p>
              {/* Large gold quotation marks */}
              <div className="text-gold text-8xl sm:text-9xl font-serif leading-none select-none" aria-hidden="true">
                &ldquo;
              </div>
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl leading-snug text-cream italic -mt-8 sm:-mt-12">
                Rankin County deserves a chancellor with meaningful experience
                in the kinds of matters chancery court hears every day.
              </blockquote>
              <div className="mt-10 w-12 h-px bg-gold mx-auto lg:mx-0" />
              <p className="mt-4 font-script text-gold text-5xl sm:text-6xl leading-none">
                Keri
              </p>
              <p className="mt-2 text-gold/90 text-xs uppercase tracking-[0.3em]">
                Keri H. Carroll
              </p>
            </div>
          </div>

          <p className="mt-16 text-cream/80 text-lg sm:text-xl max-w-3xl mx-auto text-center leading-relaxed italic">
            Families who come before the chancery court are facing some of the
            most important moments of their lives — a child&apos;s future, a
            loved one&apos;s care, the division of everything they have built.
            They deserve a judge who has spent her career in these very matters
            and who will bring preparation, patience, and fairness to every
            case.
          </p>
        </div>
      </section>

      {/* ═══════ SECTION 6.5: ENDORSEMENT CTA ═══════ */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold font-semibold mb-4">
            Know Keri?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-dark leading-tight">
            Share your endorsement.
          </h2>
          <div className="mx-auto mt-6 w-16 h-[2px] bg-gold" />
          <p className="mt-8 text-slate text-lg leading-loose">
            If you have worked with Keri, been represented by her, or know her
            in the community &mdash; your voice carries weight in this race.
            Add your endorsement, and we will craft a shareable graphic for
            your social feed so your whole network can see it.
          </p>
          <div className="mt-10">
            <EndorseCTA
              label="Endorse Keri"
              className="inline-flex items-center justify-center px-10 py-4 bg-teal-dark text-white font-semibold tracking-wide text-lg hover:bg-teal transition-colors shadow-lg"
            />
          </div>
          <p className="mt-6 text-sm text-slate-light italic">
            Takes about a minute.
          </p>
        </div>
      </section>

      {/* ═══════ SECTION 7: CTA ═══════ */}
      <section className="py-16 sm:py-20 bg-gold">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-teal-dark mb-4">
            You&apos;re Invited
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-dark">
            Join the Campaign
          </h2>
          <div className="mx-auto mt-6 w-16 h-1 bg-teal-dark" />
          <p className="mt-6 text-teal-dark/90 text-lg sm:text-xl italic">
            Help bring twenty-one years of experience to the Rankin County
            bench.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold bg-teal-dark text-white hover:bg-teal transition-colors shadow-lg"
            >
              Get Involved
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold bg-white text-teal-dark hover:bg-cream transition-colors shadow-lg"
            >
              Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
