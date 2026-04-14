"use client";

import { useEffect, useState, useCallback } from "react";
import type { Donation, DonationStatus } from "@/lib/supabase";
import AdminTabs from "@/components/AdminTabs";

type StatusFilter = DonationStatus | "all";

interface Totals {
  count: number;
  sum: number;
  new_count: number;
}

function formatCurrency(n: number | null): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [totals, setTotals] = useState<Totals>({ count: 0, sum: 0, new_count: 0 });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("new");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/donations?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setDonations(data.donations || []);
      setTotals(data.totals || { count: 0, sum: 0, new_count: 0 });
    } else {
      setDonations([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [filter, load]);

  async function updateStatus(id: string, status: DonationStatus) {
    setError(null);
    const res = await fetch(`/api/admin/donations`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      const { error: errMsg } = await res.json().catch(() => ({ error: "Request failed" }));
      setError(errMsg || "Request failed");
      return;
    }
    await load();
  }

  async function saveNote(id: string, admin_notes: string) {
    setError(null);
    await fetch(`/api/admin/donations`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, admin_notes }),
    });
    await load();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-4">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-1">
            Campaign Admin
          </p>
          <h1 className="text-3xl font-bold text-teal-dark">Donations</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Real-time feed of contributions received via Anedot. Delivered by webhook.
          </p>
        </div>

        <AdminTabs />

        {/* Totals */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="border border-teal/10 bg-cream/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">Total raised</p>
            <p className="text-2xl font-bold text-teal-dark mt-1">{formatCurrency(totals.sum)}</p>
          </div>
          <div className="border border-teal/10 bg-cream/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">All donations</p>
            <p className="text-2xl font-bold text-teal-dark mt-1">{totals.count}</p>
          </div>
          <div className="border border-teal/10 bg-cream/40 px-5 py-4">
            <p className="text-xs uppercase tracking-wider text-ink-muted">New (unreviewed)</p>
            <p className="text-2xl font-bold text-gold mt-1">{totals.new_count}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 border-b border-teal/10 flex-wrap">
          {(["new", "acknowledged", "flagged", "archived", "all"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold tracking-wider uppercase border-b-2 transition-colors ${
                filter === f
                  ? "border-gold text-teal-dark"
                  : "border-transparent text-ink-muted hover:text-teal"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-ink-muted">Loading…</p>
        ) : donations.length === 0 ? (
          <p className="text-sm text-ink-muted">No donations in this view.</p>
        ) : (
          <ul className="space-y-4">
            {donations.map((d) => (
              <DonationRow
                key={d.id}
                donation={d}
                onStatus={updateStatus}
                onNote={saveNote}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DonationRow({
  donation,
  onStatus,
  onNote,
}: {
  donation: Donation;
  onStatus: (id: string, status: DonationStatus) => void;
  onNote: (id: string, note: string) => void;
}) {
  const [note, setNote] = useState(donation.admin_notes || "");
  const [noteDirty, setNoteDirty] = useState(false);

  return (
    <li className="border border-teal/10 bg-white px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
        <div>
          <p className="text-lg font-bold text-teal-dark">
            {formatCurrency(donation.amount_dollars)}
            {donation.recurring && (
              <span className="ml-2 text-xs font-semibold text-gold uppercase tracking-wider">
                Recurring
              </span>
            )}
          </p>
          <p className="text-sm text-ink">
            {donation.donor_name || "Unknown donor"}
            {donation.donor_email && (
              <>
                {" · "}
                <a href={`mailto:${donation.donor_email}`} className="text-teal hover:underline">
                  {donation.donor_email}
                </a>
              </>
            )}
          </p>
        </div>
        <div className="text-right text-xs text-ink-muted">
          <p>{formatDate(donation.donated_at || donation.created_at)}</p>
          {donation.action_page_name && <p className="mt-0.5">{donation.action_page_name}</p>}
          {donation.anedot_id && (
            <p className="mt-0.5 font-mono text-[10px]">{donation.anedot_id}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-teal/5">
        <span className="text-xs uppercase tracking-wider text-ink-muted mr-2">Status:</span>
        {(["new", "acknowledged", "flagged", "archived"] as DonationStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onStatus(donation.id, s)}
            className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition-colors ${
              donation.status === s
                ? "border-gold bg-gold/10 text-teal-dark"
                : "border-teal/20 text-ink-muted hover:border-teal/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setNoteDirty(true);
          }}
          onBlur={() => {
            if (noteDirty) {
              onNote(donation.id, note);
              setNoteDirty(false);
            }
          }}
          placeholder="Admin notes (thank-you sent, compliance review, etc.)"
          className="w-full text-sm border border-teal/10 bg-cream/30 px-3 py-2 min-h-[60px] focus:outline-none focus:border-teal/40"
        />
      </div>
    </li>
  );
}
