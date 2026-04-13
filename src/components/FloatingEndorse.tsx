"use client";

import { useEffect, useState } from "react";
import EndorseCTA from "./EndorseCTA";

/**
 * A small, unobtrusive floating "Endorse" button that appears after
 * the user has scrolled past the hero. Positioned bottom-right on
 * desktop, bottom-center on mobile.
 */
export default function FloatingEndorse() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past ~500px (roughly past the hero)
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed z-40 bottom-6 right-6 sm:bottom-8 sm:right-8 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <EndorseCTA
        label="★ Endorse Keri"
        className="inline-flex items-center gap-2 px-6 py-3.5 bg-gold text-teal-dark font-semibold tracking-wide text-base shadow-2xl hover:bg-gold-light hover:scale-[1.02] transition-all border-2 border-teal-dark/10"
      />
    </div>
  );
}
