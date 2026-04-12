"use client";

import { useState, type FormEvent } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 bg-teal-dark border-l-4 border-gold p-6 text-left">
        <p className="text-gold font-semibold text-xl">
          Thank you for subscribing!
        </p>
        <p className="mt-1 text-cream/70 text-sm">
          You&apos;ll receive campaign updates at{" "}
          <span className="font-semibold text-white">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <label htmlFor="email-signup" className="sr-only">
        Email address
      </label>
      <input
        id="email-signup"
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 border-2 border-cream/30 bg-white/10 text-white placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
      />
      <button
        type="submit"
        className="px-8 py-3 bg-gold text-teal-dark font-semibold tracking-wide hover:bg-gold-light transition-colors shadow-md whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
