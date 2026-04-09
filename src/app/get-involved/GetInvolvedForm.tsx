"use client";

import { useState } from "react";

const interestOptions = [
  { id: "volunteering", label: "Volunteering" },
  { id: "yard-sign", label: "Yard Sign" },
  { id: "hosting", label: "Hosting an Event" },
  { id: "updates", label: "Receiving Updates" },
];

export default function GetInvolvedForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    interests: [] as string[],
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((i) => i !== value),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-forest/5 border border-forest/20 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-forest mb-2">Thank You!</h3>
        <p className="text-slate-light">
          We appreciate your interest in supporting Keri&apos;s campaign. A team
          member will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-slate mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-slate focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-slate mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-slate focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate mb-1.5">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-slate focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate mb-1.5">
          Phone <span className="text-slate-light text-xs font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-slate focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-semibold text-slate mb-1.5">
          Address{" "}
          <span className="text-slate-light text-xs font-normal">
            (optional — for yard sign delivery)
          </span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address, city, ZIP"
          className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-slate placeholder:text-slate-light/60 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest"
        />
      </div>

      {/* Interests */}
      <fieldset>
        <legend className="block text-sm font-semibold text-slate mb-3">
          I&apos;m interested in:
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {interestOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-cream-dark bg-cream hover:border-forest/30 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                value={option.id}
                checked={formData.interests.includes(option.id)}
                onChange={handleCheckbox}
                className="w-4 h-4 rounded border-slate-light text-forest focus:ring-forest/40"
              />
              <span className="text-sm text-slate">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate mb-1.5">
          Message{" "}
          <span className="text-slate-light text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us how you'd like to help, or ask any questions..."
          className="w-full rounded-lg border border-cream-dark bg-cream px-4 py-2.5 text-slate placeholder:text-slate-light/60 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest resize-y"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-3 bg-gold text-forest-dark font-bold rounded-lg hover:bg-gold-light transition-colors shadow-md text-lg"
      >
        Sign Up
      </button>
    </form>
  );
}
