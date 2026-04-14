"use client";

import { useEffect, useState, useCallback } from "react";
import type { Signup, SignupStatus } from "@/lib/supabase";
import { INTEREST_LABELS } from "@/lib/supabase";
import AdminTabs from "@/components/AdminTabs";

type StatusFilter = "new" | "contacted" | "converted" | "archived" | "all";

export default function AdminSignupsPage() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("new");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/signups?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setSignups(data.signups || []);
    } else {
      setSignups([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [filter, load]);

  async function updateStatus(id: string, status: SignupStatus) {
    setError(null);
    const res = await fetch(`/api/admin/signups`, {
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
    await fetch(`/api/admin/signups`, {
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
          <h1 className="text-3xl font-bold text-teal-dark">Signups</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Volunteer / yard sign / host / update subscribers from the{" "}
            <code className="bg-cream-dark px-1.5 py-0.5 text-xs">/get-involved</code> page.
          </p>
        </div>

        <AdminTabs />

        {error && (
          <div className="mb-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 border-b border-teal/10 flex-wrap">
          {(["new", "contacted", "converted", "archived", "all"] as StatusFilter[]).map((f) => (
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
          <div className="py-16 text-center text-ink-muted">Loading&hellip;</div>
        ) : signups.length === 0 ? (
          <div className="py-16 text-center text-ink-muted italic">
            No signups in this bucket.
          </div>
        ) : (
          <div className="space-y-4">
            {signups.map((s) => (
              <SignupCard key={s.id} signup={s} onStatus={updateStatus} onSaveNote={saveNote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
function SignupCard({
  signup,
  onStatus,
  onSaveNote,
}: {
  signup: Signup;
  onStatus: (id: string, status: SignupStatus) => Promise<void>;
  onSaveNote: (id: string, note: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState(signup.admin_notes || "");
  const [busy, setBusy] = useState(false);

  async function doStatus(status: SignupStatus) {
    setBusy(true);
    await onStatus(signup.id, status);
    setBusy(false);
  }

  const statusColor =
    signup.status === "converted" ? "bg-green-600"
    : signup.status === "contacted" ? "bg-teal"
    : signup.status === "archived" ? "bg-ink-muted"
    : "bg-gold";

  return (
    <div className="bg-white border-2 border-teal/10 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-xl font-bold text-teal-dark">
              {signup.first_name} {signup.last_name}
            </h3>
            <span
              className={`text-[10px] font-bold tracking-[0.2em] uppercase text-white px-2 py-0.5 ${statusColor}`}
            >
              {signup.status}
            </span>
          </div>
          <div className="text-sm text-ink-muted space-y-0.5 mt-1">
            <div>
              <a href={`mailto:${signup.email}`} className="text-teal hover:text-gold underline">
                {signup.email}
              </a>
              {signup.phone && (
                <>
                  {" · "}
                  <a href={`tel:${signup.phone}`} className="text-teal hover:text-gold underline">
                    {signup.phone}
                  </a>
                </>
              )}
            </div>
            {signup.address && <div>{signup.address}</div>}
            <div className="text-xs">{new Date(signup.created_at).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Interests */}
      {signup.interests.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {signup.interests.map((i) => (
            <span
              key={i}
              className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gold/15 text-gold-dark border border-gold/30"
            >
              {INTEREST_LABELS[i]}
            </span>
          ))}
        </div>
      )}

      {/* Message */}
      {signup.message && (
        <div className="bg-cream p-4 mb-4 border-l-2 border-gold">
          <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">
            Message
          </p>
          <p className="text-ink leading-relaxed text-sm">{signup.message}</p>
        </div>
      )}

      {/* Admin note */}
      <label className="block mb-4">
        <span className="block text-xs font-bold text-teal uppercase tracking-wider mb-1.5">
          Admin note (internal)
        </span>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (signup.admin_notes || "")) onSaveNote(signup.id, notes);
          }}
          placeholder="Status, follow-up, etc. Saves on blur."
          className="w-full px-3 py-2 bg-cream border-2 border-teal/20 text-ink focus:border-gold focus:outline-none text-sm"
        />
      </label>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {signup.status !== "contacted" && (
          <button
            disabled={busy}
            onClick={() => doStatus("contacted")}
            className="px-4 py-2 text-sm font-semibold bg-teal text-white hover:bg-teal-dark disabled:opacity-50"
          >
            Mark Contacted
          </button>
        )}
        {signup.status !== "converted" && (
          <button
            disabled={busy}
            onClick={() => doStatus("converted")}
            className="px-4 py-2 text-sm font-semibold bg-teal-dark text-white hover:bg-teal disabled:opacity-50"
          >
            Mark Converted
          </button>
        )}
        {signup.status !== "archived" && (
          <button
            disabled={busy}
            onClick={() => doStatus("archived")}
            className="px-4 py-2 text-sm font-semibold border-2 border-ink-muted/30 text-ink-muted hover:border-ink-muted disabled:opacity-50"
          >
            Archive
          </button>
        )}
        {signup.status !== "new" && (
          <button
            disabled={busy}
            onClick={() => doStatus("new")}
            className="px-4 py-2 text-sm font-semibold border-2 border-teal/20 text-teal hover:border-gold disabled:opacity-50"
          >
            Reset to new
          </button>
        )}
      </div>
    </div>
  );
}
