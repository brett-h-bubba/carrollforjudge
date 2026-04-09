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
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-forest-dark text-white py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-shadow-hero mb-6">
            News &amp; Updates
          </h1>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
            Follow the campaign trail across Rankin County
          </p>
        </div>
      </section>

      {/* ── Featured Post ────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="shadow-lg overflow-hidden md:flex">
            {/* Placeholder image area */}
            <div className="md:w-1/2 bg-cream-dark min-h-[260px] md:min-h-[380px] flex items-center justify-center border-t-4 border-gold md:border-t-0 md:border-l-4">
              <span className="text-slate-light text-sm uppercase tracking-widest font-bold">
                Campaign Photo
              </span>
            </div>
            <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-cream">
              <span className="text-sm font-bold text-gold uppercase tracking-widest">
                April 2026
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-forest-dark uppercase tracking-tight leading-tight">
                Keri Carroll Announces Campaign for Chancery Court Judge
              </h2>
              <p className="mt-4 text-slate-light leading-relaxed">
                With 21 years of family law experience, Keri H. Carroll formally
                announces her candidacy for Chancery Court Judge of
                Mississippi&apos;s 20th District, Place 1, serving Rankin County.
              </p>
              <Link
                href="#"
                className="mt-6 inline-block px-8 py-3 bg-forest-dark text-white font-bold uppercase tracking-wide hover:bg-forest transition-colors shadow-sm w-fit text-sm"
              >
                Read More
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ── Blog Grid ────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest uppercase tracking-tight mb-2">
              Latest from the Campaign
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="bg-white border-t-4 border-gold shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
              >
                {/* Placeholder image */}
                <div className="bg-cream-dark h-48 flex items-center justify-center">
                  <span className="text-slate-light text-sm uppercase tracking-widest font-bold">
                    Post Image
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-bold text-gold uppercase tracking-widest">
                    {post.date}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-forest-dark leading-snug uppercase tracking-tight">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-light leading-relaxed flex-1">
                    {post.preview}
                  </p>
                  <Link
                    href="#"
                    className="mt-5 inline-block px-6 py-2.5 bg-forest-dark text-white font-bold uppercase tracking-wide text-xs hover:bg-forest transition-colors shadow-sm w-fit"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email Signup ─────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-forest text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-shadow mb-2">
            Stay Connected
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-6" />
          <p className="text-cream/70 leading-relaxed">
            Get campaign updates, event invitations, and news delivered to your
            inbox.
          </p>
          <EmailSignup />
        </div>
      </section>

      {/* ── Social ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-forest uppercase tracking-tight mb-2">
            Follow Us
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-slate-light mb-8">
            Stay connected on social media for real-time campaign updates.
          </p>
          <a
            href="https://www.facebook.com/kerihcarroll"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-forest-dark font-bold uppercase tracking-wide hover:bg-gold-light transition-colors shadow-md text-lg"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Follow on Facebook
          </a>
        </div>
      </section>
    </div>
  );
}
