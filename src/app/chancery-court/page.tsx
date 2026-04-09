import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Chancery Court Matters",
  description:
    "Learn what Mississippi's Chancery Court handles — divorce, custody, adoption, guardianship, estates, and more — and why your vote for chancellor directly affects Rankin County families.",
};

const caseTypes = [
  {
    title: "Divorce and Marital Disputes",
    description:
      "When a marriage ends, the chancellor divides property, determines alimony, and helps families move forward. These decisions shape the financial future of both spouses.",
  },
  {
    title: "Child Custody and Support",
    description:
      "Who a child lives with, how much time they spend with each parent, and how their needs are financially supported — the chancellor decides all of it.",
  },
  {
    title: "Adoption Proceedings",
    description:
      "Adoption gives children a permanent, loving home. The chancellor reviews every adoption to ensure it serves the child's best interests and finalizes the new family bond.",
  },
  {
    title: "Guardianship and Conservatorship",
    description:
      "When an aging parent can no longer manage their own affairs, or a child needs a guardian other than a parent, the chancellor appoints someone to protect them.",
  },
  {
    title: "Estate and Probate Matters",
    description:
      "After a loved one passes, the chancellor oversees how their estate is handled — ensuring wills are honored, debts are settled, and heirs receive what they're owed.",
  },
  {
    title: "Property Disputes",
    description:
      "Boundary disagreements, easement conflicts, and disputes over land ownership come before the chancellor, who resolves them based on the principles of equity and fairness.",
  },
  {
    title: "Juvenile Matters",
    description:
      "Cases involving minors in need of supervision or protection are heard in chancery court. The chancellor's priority is always the safety and well-being of the child.",
  },
  {
    title: "Domestic Violence Protection",
    description:
      "Victims of domestic abuse can seek protective orders through chancery court. The chancellor has the authority to provide immediate safety measures for families in crisis.",
  },
];

const faqs = [
  {
    question: "Is this a partisan election?",
    answer:
      "No. Judicial elections in Mississippi are nonpartisan. Candidates do not run under a party label, and the election appears on the nonpartisan section of the ballot. The focus is on qualifications, experience, and judicial temperament — not party affiliation.",
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
      "Yes. The chancellor handles matters that could affect any family at any time — divorce, custody, guardianship of an aging parent, probate after a death in the family. You may not need chancery court today, but when you do, the judge on the bench will make decisions that reshape your family's life.",
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
      {/* Hero */}
      <section className="bg-forest text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Why Chancery Court Matters
          </h1>
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Most voters have never set foot in a chancery courtroom. But the
            decisions made there affect families more deeply than almost any
            other court in Mississippi.
          </p>
        </div>
      </section>

      {/* What Is Chancery Court? */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-8">
            What Is Chancery Court?
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-slate">
            <p>
              Mississippi&apos;s chancery courts are courts of equity — not
              criminal courts. There are no juries, no prosecutors, and no
              criminal defendants. Instead, a single judge called the{" "}
              <strong className="text-forest">chancellor</strong> hears cases
              and makes decisions based on fairness and the facts before them.
            </p>
            <p>
              Chancery court handles the most personal legal matters families
              face: divorce, child custody, adoption, guardianship of aging
              parents, estates after a loved one passes, and the protection of
              people who cannot protect themselves. These are not abstract legal
              proceedings. They are the moments when families need the court to
              get it right.
            </p>
            <p>
              Mississippi is one of the few states that still maintains a
              separate system of chancery courts, a tradition dating back to
              English common law. The chancellor sits without a jury and has
              broad discretion to fashion remedies that are just and equitable.
            </p>
          </div>
        </div>
      </section>

      {/* What Cases Does Chancery Court Handle? */}
      <section className="py-16 sm:py-20 bg-cream-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-4 text-center">
            What Cases Does Chancery Court Handle?
          </h2>
          <p className="text-center text-slate-light mb-12 max-w-2xl mx-auto text-lg">
            The chancellor presides over cases that touch every stage of family
            life — from bringing a child home through adoption to settling an
            estate after a loss.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {caseTypes.map((caseType) => (
              <div
                key={caseType.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-forest mb-3">
                  {caseType.title}
                </h3>
                <p className="text-sm text-slate-light leading-relaxed">
                  {caseType.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Your Chancellor Matters */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-8">
            Why Your Chancellor Matters
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-slate">
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
              medical decisions. The chancellor decides how a family farm or
              business is divided when a marriage ends.
            </p>
            <p>
              These are not abstract legal questions. They are the most
              important decisions families face — and they deserve a chancellor
              who is prepared, patient, and committed to treating every person
              in the courtroom with dignity and respect.
            </p>
            <p className="font-semibold text-forest">
              Your vote for chancellor is a vote for the person who will make
              these decisions for Rankin County families. It matters.
            </p>
          </div>
        </div>
      </section>

      {/* The 20th District */}
      <section className="py-16 sm:py-20 bg-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            The 20th Chancery Court District
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-cream/85">
            <p>
              The 20th Chancery Court District covers{" "}
              <strong className="text-white">Rankin County, Mississippi</strong>
              . If you live in Rankin County, this is your chancery court
              district.
            </p>
            <p>
              The district has multiple chancellor positions, called
              &ldquo;places.&rdquo; Each place is a separate seat on the bench,
              and voters elect each chancellor individually. This election is
              for{" "}
              <strong className="text-gold">
                Place 1
              </strong>{" "}
              of the 20th Chancery Court District.
            </p>
            <p>
              The general election will be held on{" "}
              <strong className="text-gold">November 3, 2026</strong>. As a
              judicial race, it appears on the nonpartisan section of the
              ballot — every registered voter in Rankin County can vote
              regardless of party affiliation.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes a Good Chancellor */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-8">
            What Makes a Good Chancellor
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-slate mb-10">
            <p>
              A chancellor must do more than know the law. The best chancellors
              bring a combination of qualities that cannot be learned from a
              textbook:
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white rounded-xl p-6 border border-cream-dark">
              <h3 className="text-lg font-bold text-forest mb-2">
                Deep Experience
              </h3>
              <p className="text-slate-light leading-relaxed">
                A chancellor needs years of hands-on practice in the types of
                cases they will decide — family law, custody, estates,
                guardianship. Keri Carroll has spent 21 years practicing in
                these exact areas.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-dark">
              <h3 className="text-lg font-bold text-forest mb-2">
                Judicial Temperament
              </h3>
              <p className="text-slate-light leading-relaxed">
                Families in chancery court are going through the hardest moments
                of their lives. A good chancellor listens carefully, treats
                everyone with respect, and keeps the courtroom calm and fair.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-dark">
              <h3 className="text-lg font-bold text-forest mb-2">
                Preparation
              </h3>
              <p className="text-slate-light leading-relaxed">
                Every case is someone&apos;s entire life. A good chancellor
                comes to the bench having read every filing, reviewed every
                exhibit, and thought carefully about the issues before hearing a
                single word of testimony.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-dark">
              <h3 className="text-lg font-bold text-forest mb-2">
                Patience
              </h3>
              <p className="text-slate-light leading-relaxed">
                The right decision takes time. A good chancellor gives every
                party the opportunity to be heard, considers all the evidence,
                and does not rush to judgment — because what is at stake cannot
                be undone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-cream-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark"
              >
                <h3 className="text-lg font-bold text-forest mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-forest text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5">
            Learn More About Keri Carroll
          </h2>
          <p className="text-lg text-cream/80 mb-10 max-w-xl mx-auto leading-relaxed">
            With 21 years of family law experience in the cases chancery court
            handles every day, Keri brings the preparation, patience, and
            temperament Rankin County families deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="px-8 py-3.5 bg-gold text-forest-dark font-bold rounded-md hover:bg-gold-light transition-colors shadow-md text-lg"
            >
              About Keri
            </Link>
            <Link
              href="/get-involved"
              className="px-8 py-3.5 border-2 border-cream/40 text-cream font-bold rounded-md hover:bg-white/10 transition-colors text-lg"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
