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
      <div className="mt-8 rounded-lg bg-forest/5 border border-forest/20 p-6">
        <p className="text-forest font-semibold text-lg">
          Thank you for subscribing!
        </p>
        <p className="mt-1 text-slate-light text-sm">
          You&apos;ll receive campaign updates at{" "}
          <span className="font-medium text-forest-dark">{email}</span>.
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
        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-gold text-forest-dark font-bold rounded-lg hover:bg-gold-light transition-colors shadow-md whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
