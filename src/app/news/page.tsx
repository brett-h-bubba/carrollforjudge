import type { Metadata } from "next";
import Link from "next/link";
import EmailSignup from "./EmailSignup";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Stay up to date with Keri H. Carroll's campaign for Chancery Court Judge in Mississippi's 20th District. Read the latest news, event announcements, and updates from the campaign trail across Rankin County.",
};

const blogPosts = [
  {
    title: "Why Chancery Court Matters to Your Family",
    date: "March 2026",
    preview:
      "Chancery Court touches the most personal areas of your life — from divorce and custody to guardianships and estate disputes. Learn how this court directly impacts Rankin County families every day.",
  },
  {
    title: "Meet Keri at Upcoming Community Events",
    date: "March 2026",
    preview:
      "Keri Carroll is hitting the road across Rankin County this spring. Find out where you can meet her, ask questions, and learn more about her vision for the Chancery Court bench.",
  },
  {
    title: "What Experience Means on the Chancery Bench",
    date: "February 2026",
    preview:
      "With over two decades practicing family law, Keri Carroll brings unmatched courtroom experience to the bench. Here's why that background matters for fair, informed rulings.",
  },
];

export default function NewsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-forest text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            News &amp; Updates
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
            Follow the campaign trail across Rankin County
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
          <div className="md:w-1/2 bg-slate-300 min-h-[260px] md:min-h-[360px] flex items-center justify-center">
            <span className="text-slate-light text-sm uppercase tracking-widest">
              Campaign Photo
            </span>
          </div>
          <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
            <span className="text-sm font-medium text-gold-dark uppercase tracking-wide">
              April 2026
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-forest-dark leading-tight">
              Keri Carroll Announces Campaign for Chancery Court Judge
            </h2>
            <p className="mt-4 text-slate-light leading-relaxed">
              With 21 years of family law experience, Keri H. Carroll formally
              announces her candidacy for Chancery Court Judge of
              Mississippi&apos;s 20th District, Place 1, serving Rankin County.
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-forest font-semibold hover:text-gold-dark transition-colors group"
            >
              Read More
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
        </article>
      </section>

      {/* Blog Grid */}
      <section className="bg-cream-dark py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-dark text-center mb-10">
            Latest from the Campaign
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="bg-slate-300 h-48 flex items-center justify-center">
                  <span className="text-slate-light text-sm uppercase tracking-widest">
                    Post Image
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-medium text-gold-dark uppercase tracking-wide">
                    {post.date}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-forest-dark leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-light leading-relaxed flex-1">
                    {post.preview}
                  </p>
                  <Link
                    href="#"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-forest font-semibold hover:text-gold-dark transition-colors group"
                  >
                    Read More
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-dark">
            Stay Connected
          </h2>
          <p className="mt-3 text-slate-light leading-relaxed">
            Get campaign updates, event invitations, and news delivered to your
            inbox.
          </p>
          <EmailSignup />
        </div>
      </section>

      {/* Social Media Feed Placeholder */}
      <section className="bg-cream-dark py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-dark">
            Follow Us
          </h2>
          <p className="mt-3 text-slate-light">
            Stay connected on social media for real-time campaign updates.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-forest text-white font-semibold rounded-lg hover:bg-forest-light transition-colors shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Follow on Facebook
            </a>
          </div>
          <div className="mt-10 rounded-xl border-2 border-dashed border-slate-300 p-10 text-slate-light text-sm">
            Social media feed coming soon
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to Make a Difference?
          </h2>
          <p className="mt-3 text-cream/80 leading-relaxed">
            Join the campaign and help bring experienced, fair leadership to
            Rankin County&apos;s Chancery Court.
          </p>
          <Link
            href="/get-involved"
            className="mt-6 inline-block px-8 py-3.5 bg-gold text-forest-dark font-bold rounded-lg hover:bg-gold-light transition-colors shadow-lg text-lg"
          >
            Get Involved
          </Link>
        </div>
      </section>
    </div>
  );
}
