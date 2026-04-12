import type { Metadata } from "next";
import Link from "next/link";
import DonateForm from "./DonateForm";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Keri H. Carroll's campaign for Chancery Court Judge in Rankin County, Mississippi. Your contribution helps bring experienced leadership to the bench.",
};

const disclaimers = [
  {
    label: "Individual contribution limit",
    value: "$2,500 per election cycle",
  },
  { label: "Corporate contributions", value: "$1,000 limit" },
  { label: "PAC contributions", value: "$2,500 limit" },
  {
    label: "Public reporting",
    value: "All contributions over $200 are publicly reported",
  },
];

export default function DonatePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-gold py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-dark mb-6">
            Support the Campaign
          </h1>
          <div className="w-20 h-[3px] bg-teal-dark mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-teal-dark/80 max-w-2xl mx-auto leading-relaxed">
            Your generosity helps bring experienced, fair-minded leadership to
            the Chancery Court bench in Rankin County.
          </p>
        </div>
      </section>

      {/* ── Why Donate ───────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
            Why Your Support Matters
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-slate leading-relaxed text-lg">
            Judicial campaigns in Mississippi are nonpartisan — they rely on
            community support, not party funding. Every contribution, no matter
            the size, helps Keri reach more families in Rankin County with her
            message of experience, fairness, and integrity. Your support goes
            directly toward voter outreach, campaign materials, and community
            events.
          </p>
        </div>
      </section>

      {/* ── Donation Section ─────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-cream" id="contribute">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              Make a Contribution
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto mb-6" />
            <p className="text-slate-light max-w-xl mx-auto">
              Online donations coming soon. To contribute now, please fill out
              the form below and a campaign team member will follow up with you.
            </p>
          </div>
          <DonateForm />
        </div>
      </section>

      {/* ── Legal Disclaimers ────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-teal-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-cream mb-2">
              Mississippi Campaign Finance Requirements
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto" />
          </div>

          <p className="text-sm text-cream/60 mb-8 text-center max-w-xl mx-auto">
            Mississippi law requires judicial campaigns to disclose contributor
            information and adhere to contribution limits. By contributing, you
            confirm that you are making this contribution with your own funds and
            not on behalf of another person or entity.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {disclaimers.map((item) => (
              <div
                key={item.label}
                className="p-5 bg-teal border-l-4 border-gold"
              >
                <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-2">
                  {item.label}
                </p>
                <p className="text-cream font-semibold text-lg">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Alternative Methods ──────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              Other Ways to Contribute
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mail a Check */}
            <div className="bg-cream border-t-4 border-gold p-8 shadow-md">
              <h3 className="text-xl font-semibold text-teal mb-4">
                Mail a Check
              </h3>
              <p className="text-slate-light text-sm leading-relaxed mb-4">
                Make checks payable to &ldquo;Committee to Elect Keri H.
                Carroll&rdquo; and mail to:
              </p>
              <p className="text-teal font-semibold">
                Committee to Elect Keri H. Carroll
                <br />
                P.O. Box XXXX
                <br />
                Brandon, MS 39043
              </p>
            </div>

            {/* Host / Attend Fundraiser */}
            <div className="bg-cream border-t-4 border-gold p-8 shadow-md">
              <h3 className="text-xl font-semibold text-teal mb-4">
                Attend or Host a Fundraiser
              </h3>
              <p className="text-slate-light text-sm leading-relaxed mb-4">
                Join us at an upcoming fundraising event, or open your home or
                business for one. Our campaign team will help you plan every
                detail.
              </p>
              <Link
                href="/get-involved#contact-form"
                className="inline-block px-8 py-3 bg-gold text-teal-dark font-semibold tracking-wide hover:bg-gold-light transition-colors shadow-sm text-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
