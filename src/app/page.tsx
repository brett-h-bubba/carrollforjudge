import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-forest-dark overflow-hidden">
        {/* Subtle decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest to-forest-light opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,169,81,0.12)_0%,_transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
              20th Chancery Court District, Place 1
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              The Experience Rankin County Families{" "}
              <span className="text-gold">Deserve</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-cream/80 leading-relaxed max-w-2xl">
              After 21 years of practicing family law in Mississippi, Keri H.
              Carroll is running for Chancery Court Judge — bringing the
              preparation, patience, and deep understanding of the law that
              families in our community need on the bench.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/get-involved"
                className="inline-flex items-center px-8 py-4 bg-gold text-forest-dark font-bold rounded-md hover:bg-gold-light transition-colors shadow-lg text-lg"
              >
                Get Involved
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-cream/40 text-white font-semibold rounded-md hover:bg-white/10 hover:border-cream/60 transition-colors text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero headshot */}
          <div className="hidden lg:block">
            <div className="relative aspect-[3/4] max-w-md ml-auto rounded-2xl overflow-hidden shadow-2xl ring-4 ring-gold/30">
              <Image
                src="/images/headshot-main.jpg"
                alt="Keri H. Carroll"
                fill
                className="object-cover"
                sizes="400px"
                priority
              />
            </div>
          </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
      </section>

      {/* ===== WHY KERI SECTION ===== */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-dark">
              Why Keri Carroll
            </h2>
            <div className="mt-4 w-16 h-1 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1: Experience */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow border border-cream-dark">
              <div className="w-14 h-14 rounded-lg bg-forest/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-forest"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-forest-dark mb-3">
                21 Years of Experience
              </h3>
              <p className="text-slate-light leading-relaxed">
                Since 2005, Keri has practiced family law in Mississippi —
                handling the very cases that come before chancery court. She
                brings firsthand knowledge of the challenges families face and
                the legal framework that governs their outcomes.
              </p>
            </div>

            {/* Card 2: Chancery Court Focus */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow border border-cream-dark">
              <div className="w-14 h-14 rounded-lg bg-forest/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-forest"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m-9-9h1m16 0h1M5.636 5.636l.707.707m11.314 11.314l.707.707M5.636 18.364l.707-.707m11.314-11.314l.707-.707"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l4.5-1.5L12 6l4.5 4.5L21 12l-4.5 1.5L12 18l-4.5-4.5L3 12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-forest-dark mb-3">
                Chancery Court Focus
              </h3>
              <p className="text-slate-light leading-relaxed">
                Keri&apos;s career has centered on the exact matters chancery
                court handles: custody, divorce, adoption, guardianship, and
                probate. She won&apos;t need on-the-job training — she already
                knows this court&apos;s work.
              </p>
            </div>

            {/* Card 3: Judicial Temperament */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow border border-cream-dark">
              <div className="w-14 h-14 rounded-lg bg-forest/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-forest"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 007.92 12.446A9 9 0 1112 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l2.5 1.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-forest-dark mb-3">
                Judicial Temperament
              </h3>
              <p className="text-slate-light leading-relaxed">
                The families who appear in chancery court deserve a judge who is
                prepared, patient, and fair. Keri is committed to hearing every
                case with respect for the parties involved and fidelity to the
                law.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW SECTION ===== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl shadow-lg overflow-hidden relative">
                <Image
                  src="/images/headshot-2.jpg"
                  alt="Keri H. Carroll — candidate for Chancery Court Judge"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/20 rounded-xl -z-10" />
            </div>

            {/* Bio summary */}
            <div>
              <p className="text-gold-dark font-semibold tracking-widest uppercase text-sm mb-3">
                Meet the Candidate
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-forest-dark mb-6">
                A Career Built in Service
              </h2>
              <p className="text-slate leading-relaxed mb-6">
                Keri H. Carroll has spent more than two decades serving
                Mississippi families through the legal system. Her career
                reflects a deep, consistent commitment to the kind of work
                chancery court judges do every day.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Clerked for a Justice on the Mississippi Supreme Court",
                  "Built and operated her own solo law practice",
                  "Served as a public defender, ensuring access to justice",
                  "Taught as an adjunct professor, training the next generation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gold mt-0.5 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-semibold rounded-md hover:bg-forest-light transition-colors shadow-md"
              >
                Read Full Bio
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT IS CHANCERY COURT SECTION ===== */}
      <section className="bg-cream-dark py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold-dark font-semibold tracking-widest uppercase text-sm mb-3">
              Voter Education
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-dark mb-6">
              What Is Chancery Court?
            </h2>
            <p className="text-slate leading-relaxed mb-4">
              Mississippi&apos;s chancery courts handle the legal matters closest
              to home. If your family has ever navigated a divorce, a custody
              dispute, an adoption, a guardianship, or the probate of a loved
              one&apos;s estate, it went through chancery court.
            </p>
            <p className="text-slate leading-relaxed mb-4">
              Chancery judges also hear cases involving property disputes, wills
              and trusts, mental health commitments, and the protection of
              minors. These are not abstract legal questions — they are the
              decisions that shape families&apos; lives.
            </p>
            <p className="text-slate-light leading-relaxed mb-8">
              The judge you elect to this bench will have direct authority over
              some of the most personal and consequential moments Rankin County
              families will ever face. Experience matters.
            </p>
            <Link
              href="/chancery-court"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white font-semibold rounded-md hover:bg-forest-light transition-colors shadow-md"
            >
              Learn About Chancery Court
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ENDORSEMENTS PREVIEW SECTION ===== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-dark">
              Trusted by the Community
            </h2>
            <div className="mt-4 w-16 h-1 bg-gold mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-cream rounded-xl p-8 border border-cream-dark"
              >
                {/* Quotation mark */}
                <svg
                  className="w-8 h-8 text-gold/50 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
                </svg>
                <div className="h-20 flex items-center">
                  <p className="text-slate-light italic leading-relaxed">
                    Endorsement coming soon.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-cream-dark">
                  <div className="h-4 w-32 bg-slate-300/50 rounded" />
                  <div className="h-3 w-24 bg-slate-300/30 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/endorsements"
              className="inline-flex items-center gap-2 text-forest font-semibold hover:text-forest-light transition-colors"
            >
              View All Endorsements
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GET INVOLVED CTA SECTION ===== */}
      <section className="relative bg-gold overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-dark/30 via-transparent to-gold-light/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-dark mb-4">
              Every Conversation Matters
            </h2>
            <p className="text-forest-dark/80 text-lg max-w-2xl mx-auto mb-10">
              This campaign is built one conversation at a time. Whether you
              volunteer your time, display a yard sign, host a neighborhood
              event, or contribute financially, you help bring experienced
              leadership to the bench.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/get-involved"
                className="inline-flex items-center px-6 py-3 bg-forest text-white font-semibold rounded-md hover:bg-forest-light transition-colors shadow-md"
              >
                Volunteer
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center px-6 py-3 bg-forest text-white font-semibold rounded-md hover:bg-forest-light transition-colors shadow-md"
              >
                Request a Yard Sign
              </Link>
              <Link
                href="/get-involved"
                className="inline-flex items-center px-6 py-3 bg-forest text-white font-semibold rounded-md hover:bg-forest-light transition-colors shadow-md"
              >
                Host an Event
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center px-6 py-3 bg-forest-dark text-gold font-bold rounded-md hover:bg-forest transition-colors shadow-md border border-forest"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ELECTION INFO BAR ===== */}
      <section className="bg-forest-dark text-cream/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-medium tracking-wide text-center">
            <span>
              Election Day{" "}
              <span className="text-gold font-bold">November 3, 2026</span>
            </span>
            <span className="hidden sm:inline text-cream/40">|</span>
            <span>Rankin County, Mississippi</span>
            <span className="hidden sm:inline text-cream/40">|</span>
            <span>20th Chancery Court District, Place 1</span>
          </div>
        </div>
      </section>
    </>
  );
}
