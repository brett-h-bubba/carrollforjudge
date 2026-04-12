"use client";

import { useEffect, useState, useCallback } from "react";
import { getBrowserSupabase } from "@/lib/supabase";
import type { Endorsement, EndorsementStatus } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type StatusFilter = "pending" | "approved" | "rejected" | "all";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [loginSent, setLoginSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("pending");

  const supabase = getBrowserSupabase();

  // ─ Auth state ────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // ─ Data fetch ────────────────────────────────────────
  const loadEndorsements = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const res = await fetch(`/api/admin/endorsements?status=${filter}`, {
      headers: { "x-admin-token": session.access_token },
    });
    if (res.ok) {
      const data = await res.json();
      setEndorsements(data.endorsements || []);
    } else {
      setEndorsements([]);
    }
    setLoading(false);
  }, [session, filter]);

  useEffect(() => {
    if (session) loadEndorsements();
  }, [session, filter, loadEndorsements]);

  // ─ Actions ───────────────────────────────────────────
  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      setLoginError(error.message);
    } else {
      setLoginSent(true);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function updateStatus(id: string, status: EndorsementStatus, zinger?: string) {
    if (!session) return;
    await fetch(`/api/admin/endorsements`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-admin-token": session.access_token,
      },
      body: JSON.stringify({ id, status, zinger }),
    });
    await loadEndorsements();
  }

  // ─ Render ────────────────────────────────────────────
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/30 border-t-gold animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-teal/20 p-8 sm:p-10">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-3">
            Campaign Admin
          </p>
          <h1 className="text-3xl font-bold text-teal-dark mb-2">Sign In</h1>
          <div className="w-12 h-[2px] bg-gold mb-6" />

          {loginSent ? (
            <div className="border-l-2 border-gold bg-gold/10 px-4 py-4 text-sm text-teal-dark">
              Check your inbox for a sign-in link.
            </div>
          ) : (
            <form onSubmit={sendMagicLink} className="space-y-4">
              <label className="block">
                <span className="block text-sm font-semibold text-teal mb-1.5">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-cream border-2 border-teal/20 text-ink focus:border-gold focus:outline-none"
                />
              </label>
              {loginError && (
                <div className="border-l-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-teal-dark text-cream px-6 py-3 font-semibold tracking-wide hover:bg-teal transition-colors"
              >
                Send Magic Link
              </button>
              <p className="text-xs text-ink-muted italic pt-2">
                Only allowlisted campaign staff can access this page.
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─ Logged in ─
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink-muted hidden sm:inline">
              {session.user.email}
            </span>
            <button
              onClick={signOut}
              className="text-sm text-teal hover:text-gold font-semibold"
            >
              Sign out
            </button>
          </div>
        </div>

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
              <EndorsementCard key={e.id} endorsement={e} onAction={updateStatus} />
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
}: {
  endorsement: Endorsement;
  onAction: (id: string, status: EndorsementStatus, zinger?: string) => Promise<void>;
}) {
  const [zinger, setZinger] = useState(endorsement.zinger || "");
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  async function doAction(status: EndorsementStatus) {
    setBusy(true);
    await onAction(endorsement.id, status, zinger !== endorsement.zinger ? zinger : undefined);
    setBusy(false);
  }

  const statusColor =
    endorsement.status === "approved" ? "bg-green-600"
    : endorsement.status === "rejected" ? "bg-red-600"
    : "bg-gold";

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
            {!endorsement.safe_to_publish && (
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white px-2 py-0.5 bg-red-700">
                Flagged
              </span>
            )}
          </div>
          <div className="text-sm text-ink-muted">
            {endorsement.email} · {new Date(endorsement.created_at).toLocaleString()}
          </div>
          <div className="text-xs text-gold font-semibold tracking-wider uppercase mt-1">
            {endorsement.category?.replace(/_/g, " ")}
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
      </div>
    </div>
  );
}
