import type { Metadata } from "next";
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
      {/* Hero */}
      <section className="bg-gradient-to-br from-gold-dark via-gold to-gold-light text-forest-dark py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Support the Campaign
          </h1>
          <p className="text-lg sm:text-xl text-forest-dark/80 max-w-2xl mx-auto">
            Your generosity helps bring experienced, fair-minded leadership to
            the Chancery Court bench in Rankin County.
          </p>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-forest mb-6">
            Why Your Support Matters
          </h2>
          <p className="text-slate leading-relaxed text-lg">
            Judicial campaigns in Mississippi are nonpartisan &mdash; they rely
            on community support, not party funding. Every contribution, no
            matter the size, helps Keri reach more families in Rankin County with
            her message of experience, fairness, and integrity. Your support
            goes directly toward voter outreach, campaign materials, and
            community events.
          </p>
        </div>
      </section>

      {/* Donation Options & Form */}
      <section className="py-16 sm:py-20 bg-white" id="contribute">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-forest text-center mb-4">
            Make a Contribution
          </h2>
          <p className="text-center text-slate-light mb-10 max-w-xl mx-auto">
            Online donations coming soon. To contribute now, please fill out the
            form below and a campaign team member will follow up with you.
          </p>
          <DonateForm />
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-16 sm:py-20 bg-cream-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-forest text-center mb-8">
            Mississippi Campaign Finance Requirements
          </h2>
          <div className="bg-white rounded-xl shadow-md border border-cream-dark p-6 sm:p-8">
            <p className="text-sm text-slate-light mb-6">
              Mississippi law requires judicial campaigns to disclose contributor
              information and adhere to contribution limits. By contributing, you
              confirm that you are making this contribution with your own funds
              and not on behalf of another person or entity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {disclaimers.map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-cream rounded-lg border border-cream-dark"
                >
                  <p className="text-xs font-semibold text-slate-light uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-forest font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Ways */}
      <section className="py-16 sm:py-20 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Other Ways to Contribute
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mail a Check */}
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gold mb-2">
                Mail a Check
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Make checks payable to &ldquo;Committee to Elect Keri H.
                Carroll&rdquo; and mail to:
              </p>
              <p className="text-cream/90 text-sm mt-3 font-medium">
                Committee to Elect Keri H. Carroll
                <br />
                P.O. Box XXXX
                <br />
                Brandon, MS 39043
              </p>
            </div>

            {/* Attend a Fundraiser */}
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gold mb-2">
                Attend a Fundraiser
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Join us at an upcoming fundraising event. Check our events page
                for dates and locations throughout Rankin County.
              </p>
            </div>

            {/* Host a Fundraiser */}
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gold mb-2">
                Host a Fundraiser
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Open your home or business for a fundraising event. Our campaign
                team will help you plan every detail. Reach out through our{" "}
                <a
                  href="/get-involved#contact-form"
                  className="text-gold underline hover:text-gold-light"
                >
                  Get Involved
                </a>{" "}
                page to get started.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
