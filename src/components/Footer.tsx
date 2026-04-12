import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/about", label: "About Keri" },
  { href: "/chancery-court", label: "Why Chancery Court" },
  { href: "/endorsements", label: "Endorsements" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/donate", label: "Donate" },
  { href: "/news", label: "News & Updates" },
];

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 overflow-hidden relative shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Carroll for Judge logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="text-gold font-semibold text-xl tracking-wide">
                Keri H. Carroll
              </span>
            </div>
            <p className="text-sm text-cream/60 leading-relaxed">
              For Chancery Court Judge
              <br />
              20th District, Place 1
              <br />
              Rankin County, Mississippi
            </p>
            <p className="mt-4 text-sm font-semibold text-gold-light tracking-wide">
              Election Day: November 3, 2026
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-cream uppercase tracking-[0.2em] mb-5">
              Quick Links
            </h4>
            <div className="w-8 h-0.5 bg-gold mb-5" />
            <ul className="space-y-3 text-base">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div>
            <h4 className="text-xs font-semibold text-cream uppercase tracking-[0.2em] mb-5">
              Connect
            </h4>
            <div className="w-8 h-0.5 bg-gold mb-5" />
            <a
              href="https://www.facebook.com/kerihcarroll"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-gold transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-base font-medium">
                Follow on Facebook
              </span>
            </a>

            <p className="mt-6 text-sm text-cream/50 leading-relaxed">
              Stay connected for campaign updates, events, and community news.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>
            &copy; {new Date().getFullYear()} Keri H. Carroll for Chancery Court
            Judge. All rights reserved.
          </p>
          <p>Paid for by the Committee to Elect Keri H. Carroll</p>
        </div>
      </div>
    </footer>
  );
}
