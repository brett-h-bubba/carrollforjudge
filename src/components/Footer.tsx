import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-gold font-bold text-lg mb-2">
              Keri H. Carroll
            </h3>
            <p className="text-sm text-cream/60 leading-relaxed">
              Candidate for Chancery Court Judge
              <br />
              20th District, Place 1
              <br />
              Rankin County, Mississippi
            </p>
            <p className="mt-4 text-sm text-cream/60">
              Election Day: November 3, 2026
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-cream uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Keri" },
                { href: "/chancery-court", label: "Why Chancery Court Matters" },
                { href: "/endorsements", label: "Endorsements" },
                { href: "/get-involved", label: "Get Involved" },
                { href: "/donate", label: "Donate" },
                { href: "/news", label: "News & Updates" },
              ].map((link) => (
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

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold text-cream uppercase tracking-wider mb-3">
              Connect
            </h4>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.facebook.com/kerihcarroll"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
              <p className="text-cream/50 mt-4 text-xs leading-relaxed">
                Paid for by the Committee to Elect Keri H. Carroll
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Keri H. Carroll for Chancery Court
          Judge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
