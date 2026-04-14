"use client";

import { useEffect, useState, useCallback } from "react";
import type { InboundEmail, InboundStatus, InboundAttachment } from "@/lib/supabase";
import AdminTabs from "@/components/AdminTabs";

type StatusFilter = InboundStatus | "all";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminInboxPage() {
  const [emails, setEmails] = useState<InboundEmail[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("new");
  const [selected, setSelected] = useState<InboundEmail | null>(null);
  const [selectedAttachments, setSelectedAttachments] = useState<InboundAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/inbox?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setEmails(data.emails || []);
    } else {
      setEmails([]);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [filter, load]);

  async function openEmail(email: InboundEmail) {
    setError(null);
    const res = await fetch(`/api/admin/inbox?id=${email.id}`);
    if (res.ok) {
      const data = await res.json();
      setSelected(data.email);
      setSelectedAttachments(data.attachments || []);
      if (data.email.status === "new") {
        await updateStatus(data.email.id, "read");
      }
    } else {
      setError("Could not load email.");
    }
  }

  async function updateStatus(id: string, status: InboundStatus) {
    setError(null);
    await fetch(`/api/admin/inbox`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : prev));
    }
    await load();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-1">
            Campaign Admin
          </p>
          <h1 className="text-3xl font-bold text-teal-dark">Inbox</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Emails received at any <code className="bg-cream-dark px-1.5 py-0.5 text-xs">@carrollforjudge.com</code> address, via Resend.
          </p>
        </div>

        <AdminTabs />

        {error && (
          <div className="mb-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b border-teal/10 flex-wrap">
          {(["new", "read", "replied", "archived", "spam", "all"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold tracking-wider uppercase border-b-2 transition-colors ${
                filter === f ? "border-gold text-teal-dark" : "border-transparent text-ink-muted hover:text-teal"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-ink-muted">Loading…</p>
        ) : emails.length === 0 ? (
          <p className="text-sm text-ink-muted">No emails in this view.</p>
        ) : (
          <ul className="space-y-2 mb-8">
            {emails.map((e) => (
              <li key={e.id}>
                <button
                  onClick={() => openEmail(e)}
                  className="w-full text-left border border-teal/10 bg-white hover:bg-cream/40 px-4 py-3 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-teal-dark truncate">
                        {e.from_name || e.from_addr || "(unknown sender)"}
                      </p>
                      <p className="text-sm text-ink truncate">{e.subject || "(no subject)"}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        to {e.to_addrs.join(", ")}
                      </p>
                    </div>
                    <p className="text-xs text-ink-muted whitespace-nowrap">
                      {formatDate(e.received_at)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {selected && (
          <div className="border border-teal/20 bg-white p-6 mt-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-teal-dark">
                  {selected.subject || "(no subject)"}
                </h2>
                <p className="text-sm text-ink-muted mt-1">
                  From: {selected.from_name ? `${selected.from_name} <${selected.from_addr}>` : selected.from_addr}
                </p>
                <p className="text-xs text-ink-muted">
                  To: {selected.to_addrs.join(", ")} · {formatDate(selected.received_at)}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-ink-muted hover:text-teal uppercase tracking-wider"
              >
                Close ✕
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-teal/5">
              <span className="text-xs uppercase tracking-wider text-ink-muted mr-2">Status:</span>
              {(["new", "read", "replied", "archived", "spam"] as InboundStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected.id, s)}
                  className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                    selected.status === s
                      ? "border-gold bg-gold/10 text-teal-dark"
                      : "border-teal/20 text-ink-muted hover:border-teal/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {selectedAttachments.length > 0 && (
              <div className="mb-4 text-sm">
                <p className="font-semibold text-teal-dark mb-1">Attachments:</p>
                <ul className="list-disc pl-5 text-ink">
                  {selectedAttachments.map((a) => (
                    <li key={a.id}>
                      {a.filename || "(unnamed)"}{" "}
                      <span className="text-xs text-ink-muted">({a.content_type})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selected.html ? (
              <div
                className="prose prose-sm max-w-none border-t border-teal/5 pt-4"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: selected.html }}
              />
            ) : selected.text ? (
              <pre className="whitespace-pre-wrap text-sm text-ink border-t border-teal/5 pt-4">
                {selected.text}
              </pre>
            ) : (
              <p className="text-sm text-ink-muted italic border-t border-teal/5 pt-4">
                Body not yet fetched. Reload to retry.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
