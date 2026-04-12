import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Chancery Court Matters",
  description:
    "Learn what Mississippi's Chancery Court handles — divorce, custody, adoption, guardianship, estates, and more — and why your vote for chancellor directly affects Rankin County families.",
};

const caseTypes = [
  {
    title: "Divorce",
    description:
      "When a marriage ends, the chancellor divides property, determines alimony, and shapes the financial future of both spouses.",
  },
  {
    title: "Child Custody",
    description:
      "Who a child lives with, how much time they spend with each parent, and how their needs are supported — the chancellor decides all of it.",
  },
  {
    title: "Adoption",
    description:
      "Adoption gives children a permanent, loving home. The chancellor reviews every case to ensure it serves the child's best interests.",
  },
  {
    title: "Guardianship",
    description:
      "When an aging parent can no longer manage their affairs, or a child needs a guardian, the chancellor appoints someone to protect them.",
  },
  {
    title: "Probate & Estate",
    description:
      "After a loved one passes, the chancellor oversees how their estate is handled — ensuring wills are honored and heirs receive what they are owed.",
  },
  {
    title: "Property Disputes",
    description:
      "Boundary disagreements, easement conflicts, and land ownership disputes come before the chancellor for resolution based on equity and fairness.",
  },
  {
    title: "Juvenile",
    description:
      "Cases involving minors in need of supervision or protection are heard in chancery court. The chancellor's priority is the safety of the child.",
  },
  {
    title: "Domestic Violence",
    description:
      "Victims of domestic abuse can seek protective orders through chancery court. The chancellor provides immediate safety measures for families in crisis.",
  },
];

const pillars = [
  {
    title: "Deep Experience",
    description:
      "A chancellor needs years of hands-on practice in family law, custody, estates, and guardianship. Keri Carroll has spent 21 years practicing in these exact areas.",
  },
  {
    title: "Judicial Temperament",
    description:
      "Families in chancery court are going through the hardest moments of their lives. A good chancellor listens carefully, treats everyone with respect, and keeps the courtroom fair.",
  },
  {
    title: "Preparation",
    description:
      "Every case is someone's entire life. A good chancellor comes to the bench having read every filing, reviewed every exhibit, and thought carefully about the issues.",
  },
  {
    title: "Patience",
    description:
      "The right decision takes time. A good chancellor gives every party the opportunity to be heard, considers all evidence, and does not rush to judgment.",
  },
];

const faqs = [
  {
    question: "Is this a partisan election?",
    answer:
      "No. Judicial elections in Mississippi are nonpartisan. Candidates do not run under a party label. The focus is on qualifications, experience, and judicial temperament — not party affiliation.",
  },
  {
    question: "When is the election?",
    answer:
      "The general election is November 3, 2026. Chancery court races appear on the nonpartisan ballot. Check with your county circuit clerk to confirm your voter registration and polling location.",
  },
  {
    question:
      "Do I vote for chancellor even if I don't have a pending case?",
    answer:
      "Yes. The chancellor handles matters that could affect any family at any time — divorce, custody, guardianship of an aging parent, probate after a death. You may not need chancery court today, but when you do, the judge on the bench will make decisions that reshape your family's life.",
  },
  {
    question: "What district am I in?",
    answer:
      "If you live in Rankin County, Mississippi, you are in the 20th Chancery Court District. This election is for Place 1 of that district.",
  },
];

export default function ChanceryCourtPage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-teal-dark text-white py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-shadow-hero mb-6">
            Why Chancery Court Matters
          </h1>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Most voters have never set foot in a chancery courtroom. But the
            decisions made there affect families more deeply than almost any
            other court in Mississippi.
          </p>
        </div>
      </section>

      {/* ── What Is Chancery Court ───────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
            What Is Chancery Court?
          </h2>
          <div className="w-20 h-[3px] bg-gold mb-12" />

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Text */}
            <div className="space-y-5 text-lg leading-relaxed text-slate">
              <p>
                Mississippi&apos;s chancery courts are courts of equity — not
                criminal courts. There are no juries, no prosecutors, and no
                criminal defendants. Instead, a single judge called the{" "}
                <strong className="text-teal">chancellor</strong> hears cases
                and makes decisions based on fairness and the facts before them.
              </p>
              <p>
                Chancery court handles the most personal legal matters families
                face: divorce, child custody, adoption, guardianship of aging
                parents, estates after a loved one passes, and the protection of
                people who cannot protect themselves.
              </p>
              <p>
                Mississippi is one of the few states that still maintains a
                separate system of chancery courts, a tradition dating back to
                English common law. The chancellor sits without a jury and has
                broad discretion to fashion remedies that are just and equitable.
              </p>
            </div>

            {/* Right — Dramatic stat */}
            <div className="flex flex-col items-center justify-center text-center p-12 bg-cream rounded-sm">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gold leading-none">
                Every Family
              </span>
              <span className="mt-4 text-xl sm:text-2xl text-slate font-medium">
                could face chancery court
              </span>
              <span className="mt-2 text-sm text-slate-light max-w-xs">
                Divorce, custody, guardianship, probate — these cases touch
                every stage of life
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Case Types Grid ──────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-cream-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              Cases the Chancellor Decides
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto mb-6" />
            <p className="text-slate-light text-lg max-w-2xl mx-auto">
              The chancellor presides over cases that touch every stage of
              family life — from bringing a child home through adoption to
              settling an estate after a loss.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {caseTypes.map((caseType) => (
              <div
                key={caseType.title}
                className="bg-teal-dark border-l-4 border-gold p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {caseType.title}
                </h3>
                <p className="text-sm text-cream/70 leading-relaxed">
                  {caseType.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Your Chancellor Matters ──────────────────────── */}
      <section className="py-20 sm:py-28 bg-teal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-shadow mb-2">
            Why Your Chancellor Matters
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-10" />

          <div className="space-y-6 text-lg leading-relaxed text-cream/85 max-w-3xl mx-auto text-left sm:text-center">
            <p>
              In chancery court, there is no jury. The chancellor alone hears
              the evidence, weighs the arguments, and makes the decision. That
              means the person sitting on the bench has an enormous amount of
              power — and an equally enormous responsibility.
            </p>
            <p>
              The chancellor decides where a child will live after a divorce.
              The chancellor determines whether a grandparent can gain custody
              of a grandchild in danger. The chancellor appoints a guardian for
              an elderly parent who can no longer manage their own finances or
              medical decisions.
            </p>
            <p className="text-xl font-semibold text-gold">
              Your vote for chancellor is a vote for the person who will make
              these decisions for Rankin County families. It matters.
            </p>
          </div>
        </div>
      </section>

      {/* ── What Makes a Good Chancellor ─────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              What Makes a Good Chancellor
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto mb-6" />
            <p className="text-slate-light text-lg max-w-xl mx-auto">
              A chancellor must do more than know the law. The best chancellors
              bring qualities that cannot be learned from a textbook.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-cream p-8 border-l-4 border-gold shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-teal mb-3">
                  {pillar.title}
                </h3>
                <p className="text-slate-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-cream-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto" />
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gold mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-gold">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal-dark mb-5">
            Learn More About Keri Carroll
          </h2>
          <p className="text-lg text-teal-dark/80 mb-10 max-w-xl mx-auto leading-relaxed">
            With 21 years of family law experience in the cases chancery court
            handles every day, Keri brings the preparation, patience, and
            temperament Rankin County families deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="px-10 py-4 bg-teal-dark text-white font-semibold tracking-wide hover:bg-teal transition-colors shadow-md text-lg"
            >
              About Keri
            </Link>
            <Link
              href="/get-involved"
              className="px-10 py-4 bg-white text-teal-dark font-semibold tracking-wide hover:bg-cream transition-colors shadow-md text-lg"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
