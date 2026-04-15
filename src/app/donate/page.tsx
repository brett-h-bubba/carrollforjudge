import type { Metadata } from "next";
import Link from "next/link";
import { DONATE_URL, DONATE_IS_EXTERNAL } from "@/lib/donate";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Support Keri H. Carroll's campaign for Chancery Court Judge in Mississippi's 20th District. Contributions are processed securely through Anedot.",
  alternates: { canonical: "/donate" },
};

const suggestedAmounts = [25, 50, 100, 250, 500, 1000];

const compliance = [
  {
    label: "Individual Limit",
    value: "$2,500 per election cycle",
  },
  {
    label: "Corporate Limit",
    value: "$1,000 per election cycle",
  },
  {
    label: "PAC Limit",
    value: "$2,500 per election cycle",
  },
  {
    label: "Public Reporting",
    value: "Contributions over $200 are publicly reported per Mississippi law",
  },
];

export default function DonatePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gold py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-teal-dark font-semibold mb-4">
            Support the Campaign
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-dark leading-tight">
            Contribute to Keri&rsquo;s Campaign
          </h1>
          <div className="mx-auto mt-6 w-20 h-[3px] bg-teal-dark" />
          <p className="mt-8 text-teal-dark/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Every dollar funds yard signs, direct mail, and the ground game
            that wins judicial races. Your support makes a direct impact.
          </p>
        </div>
      </section>

      {/* ── Primary CTA ──────────────────────────────────────── */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-l-4 border-gold shadow-xl p-8 sm:p-12 text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold font-semibold mb-4">
              Secure Checkout
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark mb-4">
              Contribute through our secure payment processor.
            </h2>
            <p className="text-slate leading-relaxed mb-10">
              Contributions are processed by Anedot &mdash; used by campaigns
              across the country for compliance, security, and Apple Pay
              support. You&rsquo;ll be redirected to a secure page to
              complete your contribution.
            </p>

            {/* Suggested amounts — visual anchor only, donor picks on Anedot */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-10">
              {suggestedAmounts.map((amt) => (
                <div
                  key={amt}
                  className="border-2 border-teal/20 px-3 py-4 text-teal-dark font-semibold text-lg"
                >
                  ${amt}
                </div>
              ))}
            </div>

            {DONATE_IS_EXTERNAL ? (
              <a
                href={DONATE_URL}
                className="inline-flex items-center justify-center px-12 py-5 bg-teal-dark text-cream font-semibold tracking-wide text-xl hover:bg-teal transition-colors shadow-lg"
              >
                Contribute Now
                <span aria-hidden="true" className="ml-3">
                  &rarr;
                </span>
              </a>
            ) : (
              <div className="inline-flex items-center justify-center px-12 py-5 bg-teal/20 text-teal-dark font-semibold tracking-wide text-xl">
                Donation platform coming soon
              </div>
            )}

            <p className="mt-6 text-xs text-slate-light italic">
              Apple Pay, credit card, and bank transfer accepted.
            </p>
          </div>
        </div>
      </section>

      {/* ── Compliance disclaimers ───────────────────────────── */}
      <section className="bg-teal-dark py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gold font-semibold mb-3">
              Mississippi Campaign Finance
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-cream">
              Contribution Guidelines
            </h2>
            <div className="mx-auto mt-4 w-16 h-[2px] bg-gold" />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {compliance.map((item) => (
              <div
                key={item.label}
                className="bg-teal border-l-2 border-gold p-5"
              >
                <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-2">
                  {item.label}
                </p>
                <p className="text-cream/90 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs text-cream/60 italic leading-relaxed text-center max-w-2xl mx-auto">
            Contributions to Friends of Keri H. Carroll are not tax
            deductible. Federal law prohibits contributions from foreign
            nationals. By contributing, you certify you are a U.S. citizen
            or lawfully admitted permanent resident contributing with your
            own personal funds.
          </p>
        </div>
      </section>

      {/* ── Alternative methods ──────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark text-center mb-2">
            Other Ways to Contribute
          </h2>
          <div className="mx-auto mt-2 w-16 h-[2px] bg-gold mb-10" />

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="border-2 border-cream-dark p-6">
              <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-3">
                Mail a Check
              </p>
              <p className="text-slate leading-relaxed text-sm">
                Make payable to <em>Friends of Keri H. Carroll</em> and
                include your employer and occupation.
              </p>
            </div>
            <div className="border-2 border-cream-dark p-6">
              <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-3">
                Attend a Fundraiser
              </p>
              <p className="text-slate leading-relaxed text-sm">
                Upcoming events will be posted on our{" "}
                <Link href="/news" className="text-teal-dark underline hover:text-gold">
                  news page
                </Link>
                .
              </p>
            </div>
            <div className="border-2 border-cream-dark p-6">
              <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-3">
                Host a Fundraiser
              </p>
              <p className="text-slate leading-relaxed text-sm">
                Help build the campaign through your own network.{" "}
                <Link href="/get-involved" className="text-teal-dark underline hover:text-gold">
                  Get in touch
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      {DONATE_IS_EXTERNAL && (
        <section className="bg-gold py-14 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-dark mb-6">
              Ready to contribute?
            </h2>
            <a
              href={DONATE_URL}
              className="inline-flex items-center justify-center px-10 py-4 bg-teal-dark text-cream font-semibold tracking-wide text-lg hover:bg-teal transition-colors shadow-lg"
            >
              Contribute Now
              <span aria-hidden="true" className="ml-3">
                &rarr;
              </span>
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
