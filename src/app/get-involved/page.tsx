import type { Metadata } from "next";
import Link from "next/link";
import GetInvolvedForm from "./GetInvolvedForm";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Join the campaign for Keri H. Carroll for Chancery Court Judge in Rankin County, Mississippi. Volunteer, request a yard sign, host an event, or spread the word.",
};

const waysToHelp = [
  {
    title: "Volunteer",
    description:
      "Help with phone banking, door-to-door canvassing, and campaign events. Every hour you give makes a difference.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "Request a Yard Sign",
    description:
      "Show your support in your neighborhood. We'll deliver a yard sign right to your door.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    title: "Host a Meet & Greet",
    description:
      "Invite your neighbors to meet Keri. A living room conversation can change an election.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Spread the Word",
    description:
      "Share on social media, talk to friends and family, and help us reach every voter in Rankin County.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
  },
];

export default function GetInvolvedPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-forest text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Every Conversation Matters
          </h1>
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
            In a judicial race, personal connections make the difference. Your
            voice, your time, and your support can help bring experienced,
            thoughtful leadership to the bench.
          </p>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-forest text-center mb-12">
            Ways You Can Help
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {waysToHelp.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl shadow-md p-6 border border-cream-dark hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-forest/10 rounded-lg flex items-center justify-center text-forest mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-forest mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-20 bg-white" id="contact-form">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-forest text-center mb-4">
            Sign Up to Get Involved
          </h2>
          <p className="text-center text-slate-light mb-10 max-w-xl mx-auto">
            Fill out the form below and a member of our campaign team will be in
            touch. Every bit of support matters.
          </p>
          <GetInvolvedForm />
        </div>
      </section>

      {/* Campaign Events */}
      <section className="py-16 sm:py-20 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-forest mb-4">
            Upcoming Events
          </h2>
          <p className="text-slate-light text-lg max-w-xl mx-auto">
            Check back soon for campaign events in Rankin County. We look
            forward to meeting you on the trail.
          </p>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 sm:py-20 bg-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-cream/80 mb-8 max-w-lg mx-auto">
            Follow us on Facebook for the latest campaign updates, events, and
            ways to support Keri. Share our page with friends and neighbors.
          </p>
          <a
            href="https://www.facebook.com/kerihcarroll"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-forest-dark font-bold rounded-lg hover:bg-gold-light transition-colors shadow-md text-lg"
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
