"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin",         label: "Endorsements" },
  { href: "/admin/signups", label: "Signups" },
];

export default function AdminTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-2 mb-8 border-b-2 border-teal/10">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-5 py-3 text-sm font-semibold tracking-wider uppercase border-b-2 -mb-[2px] transition-colors ${
              active
                ? "border-gold text-teal-dark"
                : "border-transparent text-ink-muted hover:text-teal"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
