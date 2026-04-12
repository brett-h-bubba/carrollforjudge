import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-teal-dark">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/headshot-3.jpg"
            alt=""
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
            aria-hidden="true"
          />
        </div>
        {/* Dark overlay gradient — heavy on left for text, fading right to show photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-dark via-teal-dark/95 to-teal-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/80 via-transparent to-teal-dark/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40 sm:py-48 lg:py-56 w-full">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-8 text-shadow">
              20th Chancery Court District &middot; Place 1
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-normal text-shadow-hero">
              The Experience
              <br />
              Rankin County
              <br />
              Families <span className="text-gold italic">Deserve</span>
            </h1>
            {/* Gold accent divider */}
            <div className="mt-10 w-20 h-[2px] bg-gold" />
            <p className="mt-8 text-xl sm:text-2xl text-cream/90 font-normal italic leading-relaxed text-shadow">
              21 years of family law. Ready on Day One.
            </p>
            <div className="mt-12 flex flex-wrap gap-5">
              <Link
                href="/get-involved"
                className="inline-flex items-center px-10 py-5 bg-gold text-teal-dark font-semibold tracking-wide text-lg hover:bg-gold-light transition-colors shadow-xl"
              >
                Get Involved
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-10 py-5 border-2 border-white text-white font-semibold tracking-wide text-lg hover:bg-white/10 transition-colors"
              >
                Meet Keri
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* ===== CAMPAIGN PILLARS ===== */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
              The Case for Keri
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-teal-dark tracking-normal">
              Why <span className="font-script text-6xl sm:text-7xl text-teal align-middle">K</span>eri Carroll
            </h2>
            <div className="mt-6 w-20 h-[2px] bg-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {/* Pillar 1: Experienced */}
            <div className="border-t-2 border-gold pt-8">
              <h3 className="text-3xl sm:text-4xl font-bold text-teal-dark tracking-normal mb-5">
                Experienced
              </h3>
              <p className="text-slate-light text-lg leading-loose">
                21 years practicing the exact law chancery court handles — divorce,
                custody, adoption, guardianship, and probate. Not a generalist.
                A specialist in the work of this court.
              </p>
            </div>

            {/* Pillar 2: Prepared */}
            <div className="border-t-2 border-gold pt-8">
              <h3 className="text-3xl sm:text-4xl font-bold text-teal-dark tracking-normal mb-5">
                Prepared
              </h3>
              <p className="text-slate-light text-lg leading-loose">
                Mississippi Supreme Court clerkship. Solo practice owner.
                Public defender. Adjunct law professor. A career built on
                preparation, discipline, and service.
              </p>
            </div>

            {/* Pillar 3: Ready */}
            <div className="border-t-2 border-gold pt-8">
              <h3 className="text-3xl sm:text-4xl font-bold text-teal-dark tracking-normal mb-5">
                Ready
              </h3>
              <p className="text-slate-light text-lg leading-loose">
                Not learning on the job. Not figuring it out as she goes.
                Keri H. Carroll is ready to serve Rankin County families
                from Day One.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="bg-teal-dark py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo with gold border frame */}
            <div className="relative">
              <div className="relative aspect-[3/4] max-w-lg mx-auto lg:mx-0 shadow-2xl border-2 border-gold/40 overflow-hidden">
                <Image
                  src="/images/headshot-2.jpg"
                  alt="Keri H. Carroll — candidate for Chancery Court Judge"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Decorative gold corner accents */}
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-gold" />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-gold" />
            </div>

            {/* Bio content */}
            <div>
              <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
                Meet the Candidate
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-gold tracking-normal mb-8 leading-tight">
                About <span className="font-script text-6xl sm:text-7xl text-gold align-middle">K</span>eri
                <br />
                H. Carroll
              </h2>
              <div className="w-20 h-[2px] bg-gold mb-8" />
              <p className="text-white/90 text-lg leading-loose mb-8">
                Keri H. Carroll has spent more than two decades serving Mississippi
                families through the legal system. Her career reflects a deep,
                unwavering commitment to the exact work chancery court judges do
                every single day.
              </p>

              <ul className="space-y-5 mb-10">
                {[
                  "Clerked for a Justice on the Mississippi Supreme Court",
                  "Built and operated her own solo law practice",
                  "Served as a public defender, ensuring access to justice",
                  "Taught as an adjunct professor at MC School of Law",
                  "21 years practicing family law in Mississippi",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <svg
                      className="w-6 h-6 text-gold mt-1 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white/85 text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-teal-dark font-semibold tracking-wide text-lg hover:bg-gold-light transition-colors shadow-lg"
              >
                Read Full Bio
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHANCERY COURT ===== */}
      <section className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
              The Work of the Court
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-teal-dark tracking-normal">
              Why Your Chancellor Matters
            </h2>
            <div className="mt-6 w-20 h-[2px] bg-gold mx-auto" />
            <p className="mt-10 text-slate text-lg sm:text-xl max-w-3xl mx-auto leading-loose">
              Your chancellor decides who gets custody of your children. Who
              inherits your estate. Whether an adoption goes through. These are
              the most personal, consequential decisions a court can make.
              Experience is not optional.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              { label: "DIVORCE", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" },
              { label: "CUSTODY", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { label: "ADOPTION", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
              { label: "GUARDIANSHIP", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { label: "PROBATE", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { label: "DOMESTIC VIOLENCE", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-teal-dark border-l-2 border-gold p-6 sm:p-8 flex flex-col items-center text-center"
              >
                <svg
                  className="w-8 h-8 text-gold mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
                <span className="text-white font-semibold uppercase tracking-[0.2em] text-xs sm:text-sm">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/chancery-court"
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-dark text-white font-semibold tracking-wide text-lg hover:bg-teal transition-colors shadow-lg"
            >
              Learn About Chancery Court
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ENDORSEMENTS PREVIEW ===== */}
      <section className="bg-cream-dark py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
              Voices of Support
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-teal-dark tracking-normal">
              Endorsed by the Community
            </h2>
            <div className="mt-6 w-20 h-[2px] bg-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                quote: "Endorsement coming soon.",
                name: "Name",
                title: "Title",
              },
              {
                quote: "Endorsement coming soon.",
                name: "Name",
                title: "Title",
              },
              {
                quote: "Endorsement coming soon.",
                name: "Name",
                title: "Title",
              },
            ].map((endorsement, i) => (
              <div
                key={i}
                className="bg-white border-t-2 border-gold p-10 shadow-md"
              >
                {/* Large gold quotation mark */}
                <svg
                  className="w-12 h-12 text-gold/40 mb-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <p className="text-slate italic text-lg leading-loose min-h-[5rem]">
                  &ldquo;{endorsement.quote}&rdquo;
                </p>
                <div className="mt-8 pt-6 border-t border-cream-dark">
                  <div className="h-4 w-32 bg-slate/10" />
                  <div className="h-3 w-24 bg-slate/5 mt-2" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/endorsements"
              className="inline-flex items-center gap-3 text-teal-dark font-semibold tracking-wide text-lg hover:text-teal-light transition-colors"
            >
              View All Endorsements
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GET INVOLVED CTA ===== */}
      <section className="relative bg-gold overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-dark/20 via-transparent to-gold-light/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <p className="text-teal-dark font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm mb-5">
              Join the Campaign
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-dark tracking-normal mb-5">
              Every Conversation Matters
            </h2>
            <div className="mx-auto w-20 h-[2px] bg-teal-dark/40 mb-6" />
            <p className="text-teal-dark/80 text-xl sm:text-2xl italic font-normal mb-14">
              Election Day is November 3, 2026
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <Link
                href="/get-involved"
                className="inline-flex items-center px-8 py-4 bg-teal-dark text-white font-semibold tracking-wide text-lg hover:bg-teal transition-colors shadow-lg"
              >
                Volunteer
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center px-8 py-4 bg-teal-dark text-white font-semibold tracking-wide text-lg hover:bg-teal transition-colors shadow-lg"
              >
                Yard Sign
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center px-8 py-4 bg-teal-dark text-white font-semibold tracking-wide text-lg hover:bg-teal transition-colors shadow-lg"
              >
                Host Event
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center px-8 py-4 bg-teal-dark text-white font-semibold tracking-wide text-lg hover:bg-teal transition-colors shadow-lg"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ELECTION INFO BAR ===== */}
      <section className="bg-teal-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-center">
            <span className="text-white">
              Election Day:{" "}
              <span className="text-gold">November 3, 2026</span>
            </span>
            <span className="hidden sm:inline text-cream/30">|</span>
            <span className="text-white">Rankin County, Mississippi</span>
            <span className="hidden sm:inline text-cream/30">|</span>
            <span className="text-white">
              20th Chancery Court District, Place 1
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
