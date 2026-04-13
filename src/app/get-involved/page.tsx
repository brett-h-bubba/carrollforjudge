import type { Metadata } from "next";
import Link from "next/link";
import GetInvolvedForm from "./GetInvolvedForm";
import EndorseCTA from "@/components/EndorseCTA";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Join the campaign for Keri H. Carroll for Chancery Court Judge in Rankin County, Mississippi. Volunteer, request a yard sign, host an event, or spread the word.",
};

type Way = {
  title: string;
  description: string;
  href?: string;
  cta?: string;
  endorse?: boolean; // opens endorsement modal instead of navigating
};

const waysToHelp: Way[] = [
  {
    title: "Request a Yard Sign",
    description:
      "Show your support across Rankin County. We will deliver a yard sign right to your door.",
  },
  {
    title: "Donate",
    description:
      "Every dollar funds yard signs, direct mail, and the ground game that wins judicial races. Your support makes a direct impact.",
    href: "/donate",
    cta: "Donate Now",
  },
  {
    title: "Endorse Keri",
    description:
      "Know Keri personally or professionally? Add your name. We will craft a shareable graphic so your whole network can see your support.",
    endorse: true,
    cta: "Endorse Now",
  },
  {
    title: "Host a Meet & Greet",
    description:
      "Invite your neighbors to meet Keri. A living room conversation can change an election.",
  },
  {
    title: "Volunteer",
    description:
      "Help with phone banking, door-to-door canvassing, and campaign events. Every hour you give makes a difference.",
  },
  {
    title: "Spread the Word",
    description:
      "Share on social media, talk to friends and family, and help us reach every voter in Rankin County.",
  },
];

export default function GetInvolvedPage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-teal-dark text-white py-24 sm:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-shadow-hero mb-6">
            Every Conversation Matters
          </h1>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed">
            In a judicial race, personal connections make the difference. Your
            voice, your time, and your support can help bring experienced,
            thoughtful leadership to the bench.
          </p>
        </div>
      </section>

      {/* ── Ways to Help ─────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              Ways You Can Help
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {waysToHelp.map((item) => (
              <div
                key={item.title}
                className="bg-teal-dark border-t-4 border-gold p-7 shadow-md hover:shadow-xl transition-shadow flex flex-col"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-cream/70 leading-relaxed flex-1">
                  {item.description}
                </p>
                {item.endorse ? (
                  <div className="mt-5">
                    <EndorseCTA
                      label={item.cta || "Endorse Now"}
                      className="inline-flex items-center justify-center px-5 py-2.5 bg-gold text-teal-dark font-semibold text-sm tracking-wide hover:bg-gold-light transition-colors"
                    />
                  </div>
                ) : item.href ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center mt-5 px-5 py-2.5 bg-gold text-teal-dark font-semibold text-sm tracking-wide hover:bg-gold-light transition-colors"
                  >
                    {item.cta || "Learn More"}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form ─────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-cream" id="contact-form">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
              Sign Up to Get Involved
            </h2>
            <div className="w-20 h-[3px] bg-gold mx-auto mb-6" />
            <p className="text-slate-light max-w-xl mx-auto">
              Fill out the form below and a member of our campaign team will be
              in touch. Every bit of support matters.
            </p>
          </div>
          <GetInvolvedForm />
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-teal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-shadow mb-2">
            Upcoming Events
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-cream/70 text-lg max-w-xl mx-auto">
            Check back soon for campaign events in Rankin County. We look
            forward to meeting you on the trail.
          </p>
        </div>
      </section>

      {/* ── Social ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-teal mb-2">
            Stay Connected
          </h2>
          <div className="w-20 h-[3px] bg-gold mx-auto mb-8" />
          <p className="text-slate-light mb-8 max-w-lg mx-auto">
            Follow us on Facebook for the latest campaign updates, events, and
            ways to support Keri. Share our page with friends and neighbors.
          </p>
          <a
            href="https://www.facebook.com/kerihcarroll"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-teal-dark font-semibold tracking-wide hover:bg-gold-light transition-colors shadow-md text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Follow on Facebook
          </a>
        </div>
      </section>
    </div>
  );
}
