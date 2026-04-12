"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Keri" },
  { href: "/chancery-court", label: "Why Chancery Court" },
  { href: "/endorsements", label: "Endorsements" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/news", label: "News" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Top bar ─────────────────────────────────── */}
      <div className="bg-teal-dark text-cream/75 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
          <span className="hidden sm:inline tracking-wide">
            Paid for by Committee to Elect Keri H. Carroll
          </span>
          <span className="sm:hidden tracking-wide text-xs">
            Committee to Elect Keri H. Carroll
          </span>

          <div className="flex items-center gap-5">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/kerihcarroll"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Donate button */}
            <Link
              href="/donate"
              className="bg-gold text-teal-dark font-semibold text-sm tracking-wide px-5 py-1.5 hover:bg-gold-light transition-colors"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ────────────────────────────── */}
      <nav
        className={`bg-cream border-b border-teal/10 transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-black/10" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 lg:h-32 py-2">
            {/* Logo (full brand lockup — includes wordmark) */}
            <Link
              href="/"
              className="block relative h-full aspect-[2/1] max-w-[280px] sm:max-w-[340px] lg:max-w-[420px]"
              aria-label="Keri H. Carroll for Chancery Court Judge — Home"
            >
              <Image
                src="/images/logo.png"
                alt="Keri H. Carroll for Chancery Court Judge"
                fill
                className="object-contain object-left"
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 420px"
                priority
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-teal uppercase tracking-[0.18em] hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-teal hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-teal/10 pb-4 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-teal uppercase tracking-[0.18em] hover:text-gold hover:bg-teal/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/donate"
                onClick={() => setMobileOpen(false)}
                className="block mx-4 mt-3 px-5 py-3 bg-gold text-teal-dark text-sm font-semibold tracking-wide text-center hover:bg-gold-light transition-colors"
              >
                Donate
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
