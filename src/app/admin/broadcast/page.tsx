"use client";

import { useEffect, useState, useCallback } from "react";
import type { EmailCampaign } from "@/lib/supabase";
import AdminTabs from "@/components/AdminTabs";

interface Preview {
  count: number;
  sample: Array<{ email: string; name: string }>;
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminBroadcastPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState(
    "<p>Hi {{first_name}},</p>\n<p>Write your message here. Use plain HTML - paragraphs, links, lists.</p>\n<p>- Keri</p>",
  );
  const [bodyText, setBodyText] = useState(
    "Hi {{first_name}},\n\nWrite your message here. Paragraphs work, links too.\n\n- Keri",
  );
  const [fromName, setFromName] = useState("Keri Carroll for Judge");
  const [fromAddress, setFromAddress] = useState("campaign@carrollforjudge.com");
  const [replyTo, setReplyTo] = useState("");
  const [reviewedBy, setReviewedBy] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(async () => {
    const res = await fetch("/api/admin/broadcast");
    if (res.ok) {
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    }
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  async function runPreview() {
    setError(null);
    const res = await fetch("/api/admin/broadcast?preview=true&interests=updates");
    if (res.ok) {
      setPreview(await res.json());
    } else {
      setError("Preview failed");
    }
  }

  async function send(isTest: boolean) {
    setError(null);
    setResult(null);

    if (!reviewedBy.trim()) {
      setError("Reviewed-by name is required before sending.");
      return;
    }
    if (isTest && !testEmail.trim()) {
      setError("Enter a test email address.");
      return;
    }
    if (!isTest) {
      const typed = prompt(
        `About to email ${preview?.count ?? "?"} recipients. Type SEND to confirm:`,
      );
      if (typed !== "SEND") {
        setError("Send cancelled.");
        return;
      }
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subject,
          body_html: bodyHtml,
          body_text: bodyText,
          from_name: fromName,
          from_address: fromAddress,
          reply_to: replyTo || null,
          reviewed_by: reviewedBy,
          interests_any: ["updates"],
          test_email: isTest ? testEmail : null,
          confirm: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Send failed");
      } else {
        setResult(
          `✓ ${data.sent_count}/${data.recipient_count} sent (${data.failed_count} failed). Campaign ${data.campaign_id}.`,
        );
        loadCampaigns();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <p className="text-gold font-semibold tracking-[0.3em] uppercase text-xs mb-1">
            Campaign Admin
          </p>
          <h1 className="text-3xl font-bold text-teal-dark">Broadcast Email</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Send email blasts to supporters who opted in via{" "}
            <code className="bg-cream-dark px-1.5 py-0.5 text-xs">/get-involved</code>.
          </p>
        </div>

        <AdminTabs />

        {error && (
          <div className="mb-6 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {result && (
          <div className="mb-6 border-l-4 border-green-600 bg-green-50 px-4 py-3 text-sm text-green-800">
            {result}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 space-y-4">
            <Field label="Subject">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Your subject line…"
                className="w-full border border-teal/20 bg-white px-3 py-2"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="From name">
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full border border-teal/20 bg-white px-3 py-2"
                />
              </Field>
              <Field label="From address">
                <input
                  type="email"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  className="w-full border border-teal/20 bg-white px-3 py-2"
                />
              </Field>
            </div>

            <Field label="Reply-To (optional)">
              <input
                type="email"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="Where replies should go"
                className="w-full border border-teal/20 bg-white px-3 py-2"
              />
            </Field>

            <Field label="HTML body (use {{first_name}} for personalization)">
              <textarea
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                rows={10}
                className="w-full border border-teal/20 bg-white px-3 py-2 font-mono text-sm"
              />
            </Field>

            <Field label="Plain-text body (required for compliance)">
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={8}
                className="w-full border border-teal/20 bg-white px-3 py-2 font-mono text-sm"
              />
            </Field>

            <Field label="Reviewed by (name of person who approved this send - required)">
              <input
                type="text"
                value={reviewedBy}
                onChange={(e) => setReviewedBy(e.target.value)}
                placeholder="e.g. Keri Carroll / Campaign Counsel"
                className="w-full border border-teal/20 bg-white px-3 py-2"
              />
            </Field>
          </div>

          <div className="space-y-4">
            <div className="border border-teal/20 bg-cream/40 p-4">
              <h3 className="font-bold text-teal-dark mb-2">Recipients</h3>
              <p className="text-sm text-ink-muted mb-3">
                Supporters with <code className="text-xs">updates</code> in their
                interests, minus anyone on the suppression list.
              </p>
              <button
                onClick={runPreview}
                className="w-full px-4 py-2 bg-teal-dark text-cream text-sm font-semibold tracking-wider uppercase hover:bg-teal transition-colors"
              >
                Count recipients
              </button>
              {preview && (
                <div className="mt-3 text-sm">
                  <p className="font-bold text-teal-dark text-2xl">{preview.count}</p>
                  <p className="text-xs text-ink-muted">
                    Sample:{" "}
                    {preview.sample
                      .map((s) => `${s.name || s.email}`)
                      .join(", ") || "none"}
                  </p>
                </div>
              )}
            </div>

            <div className="border border-gold/40 bg-gold/5 p-4">
              <h3 className="font-bold text-teal-dark mb-2">Send a test first</h3>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-teal/20 bg-white px-3 py-2 text-sm mb-2"
              />
              <button
                onClick={() => send(true)}
                disabled={sending}
                className="w-full px-4 py-2 border border-teal-dark text-teal-dark text-sm font-semibold tracking-wider uppercase hover:bg-teal-dark hover:text-cream transition-colors disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send test"}
              </button>
            </div>

            <div className="border border-red-600/40 bg-red-50 p-4">
              <h3 className="font-bold text-red-900 mb-2">Send to everyone</h3>
              <p className="text-xs text-red-800 mb-3">
                This will email all {preview?.count ?? "?"} recipients. You&apos;ll be
                asked to confirm by typing SEND.
              </p>
              <button
                onClick={() => send(false)}
                disabled={sending || !preview || preview.count === 0}
                className="w-full px-4 py-2 bg-red-700 text-cream text-sm font-semibold tracking-wider uppercase hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send blast"}
              </button>
            </div>
          </div>
        </div>

        {/* Campaign history */}
        <h2 className="text-xl font-bold text-teal-dark mb-3">Past campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-sm text-ink-muted">No campaigns sent yet.</p>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((c) => (
              <li
                key={c.id}
                className="border border-teal/10 bg-white px-4 py-3 text-sm"
              >
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-teal-dark">{c.subject}</p>
                  <p className="text-xs text-ink-muted">{formatDate(c.sent_at)}</p>
                </div>
                <p className="text-xs text-ink-muted mt-1">
                  Status: {c.status} · Sent {c.sent_count}/{c.recipient_count} · Failed{" "}
                  {c.failed_count} · Reviewed by {c.reviewed_by || "-"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
