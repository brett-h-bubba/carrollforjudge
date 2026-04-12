"use client";

import { useState } from "react";
import EndorseModal from "./EndorseModal";

export default function EndorseCTA({
  label = "Share Your Support",
  className = "inline-block px-10 py-4 bg-gold text-teal-dark font-semibold tracking-wide hover:bg-gold-light transition-colors shadow-md text-lg",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      <EndorseModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
