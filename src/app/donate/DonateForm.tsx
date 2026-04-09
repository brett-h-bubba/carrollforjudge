"use client";

import { useState } from "react";

const suggestedAmounts = [25, 50, 100, 250, 500, 1000];

export default function DonateForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    employer: "",
    occupation: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleAmountSelect(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function handleCustomAmount(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const displayAmount = selectedAmount
    ? `$${selectedAmount.toLocaleString()}`
    : customAmount
      ? `$${customAmount}`
      : null;

  if (submitted) {
    return (
      <div className="bg-forest-dark p-10 text-center">
        <div className="w-16 h-16 bg-gold/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
          Thank You for Your Support!
        </h3>
        <p className="text-cream/70">
          We have received your contribution interest
          {displayAmount ? ` of ${displayAmount}` : ""}. A campaign team member
          will follow up with you shortly to complete your contribution.
        </p>
      </div>
    );
  }

  const inputClasses =
    "w-full border-2 border-forest-dark bg-white px-4 py-3 text-slate focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Amount Selection */}
      <div>
        <label className="block text-sm font-bold text-forest uppercase tracking-wide mb-3">
          Select an Amount
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {suggestedAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleAmountSelect(amount)}
              className={`py-3 px-4 border-2 font-bold text-lg transition-all ${
                selectedAmount === amount
                  ? "border-gold bg-gold text-forest-dark"
                  : "border-forest-dark bg-white text-slate hover:border-gold"
              }`}
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
        {/* Custom amount */}
        <div className="mt-3">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light font-bold">
              $
            </span>
            <input
              type="number"
              min="1"
              placeholder="Other amount"
              value={customAmount}
              onChange={handleCustomAmount}
              className={`w-full border-2 pl-8 pr-4 py-3 text-lg font-bold text-slate bg-white placeholder:font-normal placeholder:text-slate-light/50 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all ${
                customAmount
                  ? "border-gold bg-gold/10"
                  : "border-forest-dark"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Contributor Information */}
      <div className="space-y-5">
        <h3 className="text-lg font-bold text-forest uppercase tracking-wide">
          Contributor Information
        </h3>

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold text-forest uppercase tracking-wide mb-2"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-forest uppercase tracking-wide mb-2"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold text-forest uppercase tracking-wide mb-2"
          >
            Phone{" "}
            <span className="text-slate-light text-xs font-normal normal-case">
              (optional)
            </span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Employer */}
          <div>
            <label
              htmlFor="employer"
              className="block text-sm font-bold text-forest uppercase tracking-wide mb-2"
            >
              Employer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employer"
              name="employer"
              required
              value={formData.employer}
              onChange={handleChange}
              placeholder="Required by MS law"
              className={`${inputClasses} placeholder:text-slate-light/50`}
            />
          </div>

          {/* Occupation */}
          <div>
            <label
              htmlFor="occupation"
              className="block text-sm font-bold text-forest uppercase tracking-wide mb-2"
            >
              Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              required
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Required by MS law"
              className={`${inputClasses} placeholder:text-slate-light/50`}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 bg-gold text-forest-dark font-bold uppercase tracking-wide hover:bg-gold-light transition-colors shadow-md text-lg"
      >
        Submit Contribution
      </button>
    </form>
  );
}
