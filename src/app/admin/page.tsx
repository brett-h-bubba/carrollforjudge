"use client";

import { useEffect, useState, useCallback } from "react";
import type { Endorsement, EndorsementStatus, EndorsementPillar } from "@/lib/supabase";
import { ENDORSEMENT_PILLARS } from "@/lib/supabase";
import { labelForPillar } from "@/lib/ai";
import AdminTabs from "@/components/AdminTabs";

const MAX_FEATURED = 3;

type StatusFilter = "pending" | "approved" | "rejected" | "all";

interface PatchBody {
  status?: EndorsementStatus;
  zinger?: string;
  featured?: boolean;
  pillar?: EndorsementPillar;
}

export default function AdminPage() {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [actionError, setActionError] = useState<string | null>(null);

  const featuredCount = endorsements.filter(
    (e) => e.featured && e.status === "approved"
  ).length;

  const loadEndorsements = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/endorsements?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setEndorsements(data.endorsements || []);
    } else {
      setEndorsements([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadEndorsements();
  }, [filter, loadEndorsements]);

  async function patch(id: string, body: PatchBody): Promise<{ ok: boolean; error?: string }> {
    setActionError(null);
    const res = await fetch(`/api/admin/endorsements`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Request failed" }));
      setActionError(error || "Request failed");
      return { ok: false, error };
    }
    await loadEndorsements();
    return { ok: true };
  }

  async function updateStatus(id: string, status: EndorsementStatus, zinger?: string) {
    await patch(id, { status, zinger });
  }

  async function toggleFeatured(id: string, nextValue: boolean) {
    await patch(id, { featured: nextValue });
  }

  async function updatePillar(id: string, pillar: EndorsementPillar) {
    await patch(id, { pillar });
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-teal/10">
          <div>
            <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-1">
              Campaign Admin
            </p>
            <h1 className="text-3xl font-bold text-teal-dark">Endorsements</h1>
          </div>
          {filter === "approved" && (
            <div className="text-right">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-ink-muted">
                Featured
              </p>
              <p className="text-2xl font-bold text-gold-dark">
                {featuredCount} <span className="text-ink-muted text-base font-normal">/ {MAX_FEATURED}</span>
              </p>
            </div>
          )}
        </div>

        <AdminTabs />

        {actionError && (
          <div className="mb-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
            {actionError}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 border-b border-teal/10">
          {(["pending", "approved", "rejected", "all"] as StatusFilter[]).map((f) => (
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

        {/* List */}
        {loading ? (
          <div className="py-16 text-center text-ink-muted">Loading&hellip;</div>
        ) : endorsements.length === 0 ? (
          <div className="py-16 text-center text-ink-muted italic">
            No endorsements in this bucket.
          </div>
        ) : (
          <div className="space-y-6">
            {endorsements.map((e) => (
              <EndorsementCard
                key={e.id}
                endorsement={e}
                onAction={updateStatus}
                onToggleFeatured={toggleFeatured}
                onUpdatePillar={updatePillar}
                featuredCount={featuredCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
function EndorsementCard({
  endorsement,
  onAction,
  onToggleFeatured,
  onUpdatePillar,
  featuredCount,
}: {
  endorsement: Endorsement;
  onAction: (id: string, status: EndorsementStatus, zinger?: string) => Promise<void>;
  onToggleFeatured: (id: string, nextValue: boolean) => Promise<void>;
  onUpdatePillar: (id: string, pillar: EndorsementPillar) => Promise<void>;
  featuredCount: number;
}) {
  const [zinger, setZinger] = useState(endorsement.zinger || "");
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function doAction(status: EndorsementStatus) {
    setBusy(true);
    await onAction(endorsement.id, status, zinger !== endorsement.zinger ? zinger : undefined);
    setBusy(false);
  }

  async function doFeature(next: boolean) {
    setBusy(true);
    await onToggleFeatured(endorsement.id, next);
    setBusy(false);
  }

  const statusColor =
    endorsement.status === "approved" ? "bg-green-600"
    : endorsement.status === "rejected" ? "bg-red-600"
    : "bg-gold";

  const isApproved = endorsement.status === "approved";
  const canFeature = isApproved && (endorsement.featured || featuredCount < MAX_FEATURED);

  return (
    <div className="bg-white border-2 border-teal/10 p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-xl font-bold text-teal-dark">{endorsement.name}</h3>
            {endorsement.location && (
              <span className="text-sm text-ink-muted">· {endorsement.location}</span>
            )}
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase text-white px-2 py-0.5 ${statusColor}`}>
              {endorsement.status}
            </span>
            {endorsement.featured && (
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-teal-dark px-2 py-0.5 bg-gold">
                ★ Featured
              </span>
            )}
            {!endorsement.safe_to_publish && (
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white px-2 py-0.5 bg-red-700">
                Flagged
              </span>
            )}
          </div>
          <div className="text-sm text-ink-muted">
            {endorsement.email} · {new Date(endorsement.created_at).toLocaleString()}
          </div>
          <div className="flex items-center gap-3 flex-wrap mt-1.5">
            <span className="text-xs text-gold font-semibold tracking-wider uppercase">
              {endorsement.category?.replace(/_/g, " ") || "uncategorized"}
            </span>
            <span className="text-ink-muted text-xs">·</span>
            <label className="inline-flex items-center gap-2">
              <span className="text-[10px] font-bold text-teal uppercase tracking-[0.2em]">Pillar</span>
              <select
                value={endorsement.pillar ?? ""}
                onChange={(e) => {
                  const v = e.target.value as EndorsementPillar;
                  if (v) onUpdatePillar(endorsement.id, v);
                }}
                className="text-xs px-2 py-0.5 border border-teal/30 bg-cream text-teal-dark font-semibold focus:border-gold focus:outline-none"
                title="What pillar this endorsement testifies to"
              >
                <option value="" disabled>
                  {endorsement.pillar ? labelForPillar(endorsement.pillar) : "- set pillar -"}
                </option>
                {ENDORSEMENT_PILLARS.map((p) => (
                  <option key={p} value={p}>
                    {labelForPillar(p)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-cream p-4 mb-4 border-l-2 border-gold">
        <p className="text-ink leading-relaxed">{endorsement.endorsement}</p>
      </div>

      <label className="block mb-4">
        <span className="block text-xs font-bold text-teal uppercase tracking-wider mb-1.5">
          Zinger (editable)
        </span>
        <textarea
          rows={2}
          value={zinger}
          onChange={(e) => setZinger(e.target.value)}
          className="w-full px-3 py-2 bg-cream border-2 border-teal/20 text-ink focus:border-gold focus:outline-none text-sm italic"
        />
      </label>

      {showPreview && (
        <div className="mb-4 border-2 border-teal/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/og/endorsement/${endorsement.id}?format=square&t=${Date.now()}`}
            alt="Graphic preview"
            className="w-full h-auto"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowPreview((s) => !s)}
          className="px-4 py-2 text-sm font-semibold border-2 border-teal/20 text-teal hover:border-gold"
        >
          {showPreview ? "Hide" : "Preview"} graphic
        </button>
        {endorsement.status !== "approved" && (
          <button
            disabled={busy}
            onClick={() => doAction("approved")}
            className="px-4 py-2 text-sm font-semibold bg-teal-dark text-white hover:bg-teal disabled:opacity-50"
          >
            Approve
          </button>
        )}
        {endorsement.status !== "rejected" && (
          <button
            disabled={busy}
            onClick={() => doAction("rejected")}
            className="px-4 py-2 text-sm font-semibold border-2 border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Reject
          </button>
        )}
        {endorsement.status !== "pending" && (
          <button
            disabled={busy}
            onClick={() => doAction("pending")}
            className="px-4 py-2 text-sm font-semibold border-2 border-teal/20 text-teal hover:border-gold disabled:opacity-50"
          >
            Reset to pending
          </button>
        )}

        {/* Feature toggle - only on approved */}
        {isApproved && (
          endorsement.featured ? (
            <button
              disabled={busy}
              onClick={() => doFeature(false)}
              className="px-4 py-2 text-sm font-semibold bg-gold text-teal-dark hover:bg-gold-light disabled:opacity-50"
            >
              ★ Unfeature
            </button>
          ) : (
            <button
              disabled={busy || !canFeature}
              onClick={() => doFeature(true)}
              title={canFeature ? "Mark as featured on the public page" : `Max ${MAX_FEATURED} featured - unfeature one first`}
              className="px-4 py-2 text-sm font-semibold border-2 border-gold text-gold-dark hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ☆ Feature
            </button>
          )
        )}
      </div>
    </div>
  );
}
