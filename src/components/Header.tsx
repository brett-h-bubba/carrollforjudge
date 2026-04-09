"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Keri" },
  { href: "/chancery-court", label: "Chancery Court" },
  { href: "/endorsements", label: "Endorsements" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/news", label: "News" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-forest text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image
                src="/images/logo.png"
                alt="Carroll for Judge logo"
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="leading-tight">
              <span className="text-gold font-bold text-lg tracking-wide">
                Keri H. Carroll
              </span>
              <span className="hidden sm:block text-xs text-cream/70 tracking-widest uppercase">
                Chancery Court Judge
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-cream/90 hover:text-gold transition-colors rounded-md hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              className="ml-3 px-5 py-2.5 bg-gold text-forest-dark text-sm font-bold rounded-md hover:bg-gold-light transition-colors shadow-md"
            >
              Donate
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-cream/90 hover:text-gold"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/10 pt-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-cream/90 hover:text-gold hover:bg-white/10 rounded-md"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setMobileOpen(false)}
              className="block mx-3 mt-3 px-5 py-2.5 bg-gold text-forest-dark text-sm font-bold rounded-md text-center hover:bg-gold-light"
            >
              Donate
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
