/**
 * Daily digest email builder.
 *
 * Queries Supabase for donation / endorsement / signup counts across three
 * windows (yesterday, 7-day, 30-day) and composes an admin email.
 *
 * "Yesterday" is calendar-yesterday in America/Chicago (campaign home TZ).
 * 7-day and 30-day are rolling windows ending at run time.
 */

import { sendAdminMail } from "@/lib/mailer";
import { getServerSupabase } from "@/lib/supabase";
import { getGA4Metrics, type GA4Metrics } from "@/lib/ga4-server";

type Window = "yesterday" | "7day" | "30day";

interface Metrics {
  donations: {
    count: Record<Window, number>;
    amount: Record<Window, number>;
  };
  endorsements: {
    count: Record<Window, number>;
  };
  signups: {
    count: Record<Window, number>;
    volunteer: Record<Window, number>;
    yard_sign: Record<Window, number>;
  };
  pending: {
    endorsements: number;
    signups: number;
    donations: number;
    inbound_emails: number;
  };
  ga4: GA4Metrics | null;
}

// Returns ISO timestamp for America/Chicago midnight N days before today.
// Uses a lightweight approach: compute Chicago date string, then parse as UTC
// offset (-5 CDT in summer, -6 CST in winter).
function chicagoDaysAgo(daysAgo: number): Date {
  // Get the America/Chicago offset at the current moment.
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const y = Number(parts.find((p) => p.type === "year")!.value);
  const m = Number(parts.find((p) => p.type === "month")!.value);
  const d = Number(parts.find((p) => p.type === "day")!.value);

  // Chicago "today at 00:00" as a UTC Date — we need the TZ offset
  // for that specific date.
  const chicagoMidnight = new Date(Date.UTC(y, m - 1, d));
  // Figure out Chicago offset at that moment by formatting.
  const offsetFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    timeZoneName: "shortOffset",
  });
  const offsetPart = offsetFormatter
    .formatToParts(chicagoMidnight)
    .find((p) => p.type === "timeZoneName")?.value; // e.g. "GMT-5"
  const offsetMatch = offsetPart?.match(/GMT([+-]\d+)/);
  const offsetHours = offsetMatch ? Number(offsetMatch[1]) : -5;

  // Shift UTC midnight by the Chicago offset to get the actual UTC instant
  // of Chicago midnight, then back off `daysAgo` days.
  const utcInstant = new Date(
    chicagoMidnight.getTime() - offsetHours * 3600_000 - daysAgo * 86_400_000,
  );
  return utcInstant;
}

function windowRanges() {
  // All "midnight Chicago" instants expressed as UTC Dates.
  const todayMidnight = chicagoDaysAgo(0);
  const yesterdayMidnight = chicagoDaysAgo(1);
  const sevenDaysAgo = chicagoDaysAgo(7);
  const thirtyDaysAgo = chicagoDaysAgo(30);

  return {
    yesterday: { start: yesterdayMidnight, end: todayMidnight },
    "7day": { start: sevenDaysAgo, end: todayMidnight },
    "30day": { start: thirtyDaysAgo, end: todayMidnight },
  } as const;
}

async function countDonations(
  supabase: ReturnType<typeof getServerSupabase>,
  start: Date,
  end: Date,
): Promise<{ count: number; amount: number }> {
  const { data, error } = await supabase
    .from("donations")
    .select("amount_dollars")
    .gte("donated_at", start.toISOString())
    .lt("donated_at", end.toISOString());
  if (error) {
    console.error("[digest] donations query failed:", error);
    return { count: 0, amount: 0 };
  }
  const count = data?.length ?? 0;
  const amount = (data ?? []).reduce(
    (acc, row: { amount_dollars: number | null }) => acc + (row.amount_dollars ?? 0),
    0,
  );
  return { count, amount };
}

async function countEndorsements(
  supabase: ReturnType<typeof getServerSupabase>,
  start: Date,
  end: Date,
): Promise<number> {
  const { count, error } = await supabase
    .from("endorsements")
    .select("id", { count: "exact", head: true })
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());
  if (error) {
    console.error("[digest] endorsements query failed:", error);
    return 0;
  }
  return count ?? 0;
}

async function countSignups(
  supabase: ReturnType<typeof getServerSupabase>,
  start: Date,
  end: Date,
): Promise<{ count: number; volunteer: number; yard_sign: number }> {
  const { data, error } = await supabase
    .from("signups")
    .select("interests")
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString());
  if (error) {
    console.error("[digest] signups query failed:", error);
    return { count: 0, volunteer: 0, yard_sign: 0 };
  }
  const count = data?.length ?? 0;
  let volunteer = 0,
    yard_sign = 0;
  for (const row of data ?? []) {
    const interests = Array.isArray(row.interests) ? row.interests : [];
    if (interests.includes("volunteer")) volunteer++;
    if (interests.includes("yard_sign")) yard_sign++;
  }
  return { count, volunteer, yard_sign };
}

async function countPending(
  supabase: ReturnType<typeof getServerSupabase>,
  table: "endorsements" | "signups" | "donations" | "inbound_emails",
): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .is("reviewed_at", null);
  if (error) {
    console.error(`[digest] pending ${table} query failed:`, error);
    return 0;
  }
  return count ?? 0;
}

export async function buildMetrics(): Promise<Metrics> {
  const supabase = getServerSupabase();
  const ranges = windowRanges();
  const windows: Window[] = ["yesterday", "7day", "30day"];

  const donations = await Promise.all(
    windows.map((w) => countDonations(supabase, ranges[w].start, ranges[w].end)),
  );
  const endorsements = await Promise.all(
    windows.map((w) => countEndorsements(supabase, ranges[w].start, ranges[w].end)),
  );
  const signups = await Promise.all(
    windows.map((w) => countSignups(supabase, ranges[w].start, ranges[w].end)),
  );
  const [pendingEndorsements, pendingSignups, pendingDonations, pendingInbound, ga4] =
    await Promise.all([
      countPending(supabase, "endorsements"),
      countPending(supabase, "signups"),
      countPending(supabase, "donations"),
      countPending(supabase, "inbound_emails"),
      getGA4Metrics(),
    ]);

  const byWindow = <T>(arr: T[]): Record<Window, T> =>
    windows.reduce(
      (acc, w, i) => {
        acc[w] = arr[i];
        return acc;
      },
      {} as Record<Window, T>,
    );

  return {
    donations: {
      count: byWindow(donations.map((d) => d.count)),
      amount: byWindow(donations.map((d) => d.amount)),
    },
    endorsements: {
      count: byWindow(endorsements),
    },
    signups: {
      count: byWindow(signups.map((s) => s.count)),
      volunteer: byWindow(signups.map((s) => s.volunteer)),
      yard_sign: byWindow(signups.map((s) => s.yard_sign)),
    },
    pending: {
      endorsements: pendingEndorsements,
      signups: pendingSignups,
      donations: pendingDonations,
      inbound_emails: pendingInbound,
    },
    ga4,
  };
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function renderDigest(metrics: Metrics): { subject: string; html: string; text: string } {
  const today = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const pendingTotal =
    metrics.pending.endorsements +
    metrics.pending.signups +
    metrics.pending.donations +
    metrics.pending.inbound_emails;
  const subject = pendingTotal > 0
    ? `Carroll for Judge — ${pendingTotal} pending · ${today}`
    : `Carroll for Judge — Morning Digest, ${today}`;

  const teal = "#215b64";
  const gold = "#b08a49";
  const cream = "#f7f1e8";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.carrollforjudge.com";
  const vercelAnalyticsUrl = process.env.DIGEST_VERCEL_ANALYTICS_URL ?? "";
  const ga4DashboardUrl = process.env.DIGEST_GA4_DASHBOARD_URL ?? "";

  const row = (label: string, yesterday: string, seven: string, thirty: string, bold = false) => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #e5dfd3;${bold ? "font-weight:700;" : ""}color:${teal};">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e5dfd3;text-align:right;${bold ? "font-weight:700;" : ""}color:${teal};">${yesterday}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e5dfd3;text-align:right;${bold ? "font-weight:700;" : ""}color:${teal};">${seven}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e5dfd3;text-align:right;${bold ? "font-weight:700;" : ""}color:${teal};">${thirty}</td>
    </tr>
  `;

  const pendingRow = (label: string, count: number, href: string) => {
    if (count === 0) return "";
    return `
      <tr>
        <td style="padding:12px 20px;border-bottom:1px solid #e5dfd3;color:${teal};font-weight:600;">${label}</td>
        <td style="padding:12px 20px;border-bottom:1px solid #e5dfd3;text-align:right;color:${gold};font-weight:700;font-size:18px;">${count}</td>
        <td style="padding:12px 20px;border-bottom:1px solid #e5dfd3;text-align:right;">
          <a href="${href}" style="color:${teal};text-decoration:underline;font-size:13px;">Review →</a>
        </td>
      </tr>
    `;
  };

  const pendingSection = pendingTotal > 0
    ? `
      <tr>
        <td style="padding:24px 24px 8px;">
          <p style="margin:0;color:${gold};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Needs your attention</p>
          <h2 style="margin:4px 0 12px;font-size:18px;color:${teal};">${pendingTotal} pending review</h2>
          <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
            ${pendingRow("Pending endorsements", metrics.pending.endorsements, `${siteUrl}/admin`)}
            ${pendingRow("New signups", metrics.pending.signups, `${siteUrl}/admin/signups`)}
            ${pendingRow("New donations", metrics.pending.donations, `${siteUrl}/admin/donations`)}
            ${pendingRow("Unread inbox messages", metrics.pending.inbound_emails, `${siteUrl}/admin/inbox`)}
          </table>
        </td>
      </tr>
    `
    : `
      <tr>
        <td style="padding:24px 24px 8px;">
          <p style="margin:0;color:${gold};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Needs your attention</p>
          <p style="margin:8px 0 0;color:${teal};font-size:15px;">✓ Inbox zero — no items pending review.</p>
        </td>
      </tr>
    `;

  const ga4Section = metrics.ga4
    ? (() => {
        const g = metrics.ga4!;
        const topPages = g.topPages
          .map(
            (p) =>
              `<tr><td style="padding:6px 0;color:${teal};font-size:13px;">${p.path}</td><td style="padding:6px 0;text-align:right;color:#6b6b6b;font-size:13px;">${p.views}</td></tr>`,
          )
          .join("");
        const topRefs = g.topReferrers
          .map(
            (r) =>
              `<tr><td style="padding:6px 0;color:${teal};font-size:13px;">${r.source}</td><td style="padding:6px 0;text-align:right;color:#6b6b6b;font-size:13px;">${r.users}</td></tr>`,
          )
          .join("");
        return `
          <tr>
            <td style="padding:24px 24px 8px;">
              <p style="margin:0;color:${gold};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Site traffic</p>
              <h2 style="margin:4px 0 12px;font-size:18px;color:${teal};">Google Analytics</h2>
              <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:14px;">
                <thead>
                  <tr style="background:${teal};color:${cream};">
                    <th style="padding:8px 16px;text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;"></th>
                    <th style="padding:8px 16px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Visitors</th>
                    <th style="padding:8px 16px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Sessions</th>
                    <th style="padding:8px 16px;text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Pageviews</th>
                  </tr>
                </thead>
                <tbody>
                  ${row("Yesterday", String(g.yesterday.users), String(g.yesterday.sessions), String(g.yesterday.pageViews), true)}
                  ${row("7 days", String(g.sevenDay.users), String(g.sevenDay.sessions), String(g.sevenDay.pageViews))}
                </tbody>
              </table>
              ${
                topPages || topRefs
                  ? `
                <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;margin-top:16px;">
                  <tr>
                    <td style="width:50%;vertical-align:top;padding-right:12px;">
                      <p style="margin:0 0 6px;color:${gold};font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Top pages (7d)</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;">${topPages}</table>
                    </td>
                    <td style="width:50%;vertical-align:top;padding-left:12px;">
                      <p style="margin:0 0 6px;color:${gold};font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Top referrers (7d)</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;">${topRefs}</table>
                    </td>
                  </tr>
                </table>
              `
                  : ""
              }
            </td>
          </tr>
        `;
      })()
    : `
      <tr>
        <td style="padding:24px 24px 8px;">
          <p style="margin:0;color:${gold};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Site traffic</p>
          <p style="margin:8px 0 0;color:#6b6b6b;font-size:13px;">Google Analytics not configured yet. Set <code>GA4_PROPERTY_ID</code> and <code>GA4_SERVICE_ACCOUNT_JSON</code> in Vercel to see visitor stats here.</p>
        </td>
      </tr>
    `;

  const footerLinks = [
    `<a href="${siteUrl}/admin" style="color:${teal};text-decoration:underline;">Admin panel</a>`,
    vercelAnalyticsUrl
      ? `<a href="${vercelAnalyticsUrl}" style="color:${teal};text-decoration:underline;">Vercel Analytics</a>`
      : "",
    ga4DashboardUrl
      ? `<a href="${ga4DashboardUrl}" style="color:${teal};text-decoration:underline;">Google Analytics</a>`
      : "",
  ]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");

  const html = `
<!doctype html>
<html>
<body style="margin:0;padding:24px;background:${cream};font-family:Georgia,serif;color:${teal};">
  <table role="presentation" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5dfd3;">
    <tr>
      <td style="padding:20px 24px;border-bottom:3px solid ${gold};">
        <p style="margin:0;color:${gold};font-size:12px;letter-spacing:4px;text-transform:uppercase;font-weight:700;">Carroll for Judge</p>
        <h1 style="margin:4px 0 0;font-size:22px;color:${teal};">Morning Digest</h1>
        <p style="margin:4px 0 0;color:#6b6b6b;font-size:14px;">${today}</p>
      </td>
    </tr>
    ${pendingSection}
    <tr>
      <td style="padding:24px 24px 8px;">
        <p style="margin:0;color:${gold};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Campaign metrics</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:${teal};color:${cream};">
              <th style="padding:10px 16px;text-align:left;font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:11px;"></th>
              <th style="padding:10px 16px;text-align:right;font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:11px;">Yesterday</th>
              <th style="padding:10px 16px;text-align:right;font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:11px;">7 days</th>
              <th style="padding:10px 16px;text-align:right;font-weight:600;letter-spacing:2px;text-transform:uppercase;font-size:11px;">30 days</th>
            </tr>
          </thead>
          <tbody>
            ${row("Donations", String(metrics.donations.count.yesterday), String(metrics.donations.count["7day"]), String(metrics.donations.count["30day"]), true)}
            ${row("&nbsp;&nbsp;Amount raised", formatCurrency(metrics.donations.amount.yesterday), formatCurrency(metrics.donations.amount["7day"]), formatCurrency(metrics.donations.amount["30day"]))}
            ${row("Endorsements", String(metrics.endorsements.count.yesterday), String(metrics.endorsements.count["7day"]), String(metrics.endorsements.count["30day"]), true)}
            ${row("Signups", String(metrics.signups.count.yesterday), String(metrics.signups.count["7day"]), String(metrics.signups.count["30day"]), true)}
            ${row("&nbsp;&nbsp;Volunteers", String(metrics.signups.volunteer.yesterday), String(metrics.signups.volunteer["7day"]), String(metrics.signups.volunteer["30day"]))}
            ${row("&nbsp;&nbsp;Yard signs", String(metrics.signups.yard_sign.yesterday), String(metrics.signups.yard_sign["7day"]), String(metrics.signups.yard_sign["30day"]))}
          </tbody>
        </table>
      </td>
    </tr>
    ${ga4Section}
    <tr>
      <td style="padding:20px 24px;color:#6b6b6b;font-size:12px;border-top:1px solid #e5dfd3;">
        ${footerLinks}
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textLines: string[] = [
    `Carroll for Judge — Morning Digest`,
    today,
    ``,
    `NEEDS YOUR ATTENTION`,
  ];
  if (pendingTotal === 0) {
    textLines.push(`  Inbox zero — no items pending review.`);
  } else {
    if (metrics.pending.endorsements > 0)
      textLines.push(`  ${metrics.pending.endorsements} pending endorsements → ${siteUrl}/admin`);
    if (metrics.pending.signups > 0)
      textLines.push(`  ${metrics.pending.signups} new signups → ${siteUrl}/admin/signups`);
    if (metrics.pending.donations > 0)
      textLines.push(`  ${metrics.pending.donations} new donations → ${siteUrl}/admin/donations`);
    if (metrics.pending.inbound_emails > 0)
      textLines.push(`  ${metrics.pending.inbound_emails} unread inbox messages → ${siteUrl}/admin/inbox`);
  }
  textLines.push(
    ``,
    `CAMPAIGN METRICS`,
    `                           Yesterday   7 days   30 days`,
    `Donations                  ${metrics.donations.count.yesterday.toString().padStart(4)}      ${metrics.donations.count["7day"].toString().padStart(4)}     ${metrics.donations.count["30day"].toString().padStart(4)}`,
    `  Amount raised          ${formatCurrency(metrics.donations.amount.yesterday).padStart(8)}   ${formatCurrency(metrics.donations.amount["7day"]).padStart(7)}  ${formatCurrency(metrics.donations.amount["30day"]).padStart(7)}`,
    `Endorsements               ${metrics.endorsements.count.yesterday.toString().padStart(4)}      ${metrics.endorsements.count["7day"].toString().padStart(4)}     ${metrics.endorsements.count["30day"].toString().padStart(4)}`,
    `Signups                    ${metrics.signups.count.yesterday.toString().padStart(4)}      ${metrics.signups.count["7day"].toString().padStart(4)}     ${metrics.signups.count["30day"].toString().padStart(4)}`,
    `  Volunteers               ${metrics.signups.volunteer.yesterday.toString().padStart(4)}      ${metrics.signups.volunteer["7day"].toString().padStart(4)}     ${metrics.signups.volunteer["30day"].toString().padStart(4)}`,
    `  Yard signs               ${metrics.signups.yard_sign.yesterday.toString().padStart(4)}      ${metrics.signups.yard_sign["7day"].toString().padStart(4)}     ${metrics.signups.yard_sign["30day"].toString().padStart(4)}`,
    ``,
  );
  if (metrics.ga4) {
    const g = metrics.ga4;
    textLines.push(
      `SITE TRAFFIC (Google Analytics)`,
      `  Yesterday: ${g.yesterday.users} visitors, ${g.yesterday.sessions} sessions, ${g.yesterday.pageViews} pageviews`,
      `  7 days:    ${g.sevenDay.users} visitors, ${g.sevenDay.sessions} sessions, ${g.sevenDay.pageViews} pageviews`,
    );
    if (g.topPages.length > 0) {
      textLines.push(`  Top pages (7d):`);
      for (const p of g.topPages) textLines.push(`    ${p.path}  —  ${p.views}`);
    }
    if (g.topReferrers.length > 0) {
      textLines.push(`  Top referrers (7d):`);
      for (const r of g.topReferrers) textLines.push(`    ${r.source}  —  ${r.users}`);
    }
    textLines.push(``);
  } else {
    textLines.push(`SITE TRAFFIC: Google Analytics not configured.`, ``);
  }
  textLines.push(
    `Admin panel: ${siteUrl}/admin`,
  );
  if (vercelAnalyticsUrl) textLines.push(`Vercel Analytics: ${vercelAnalyticsUrl}`);
  if (ga4DashboardUrl) textLines.push(`Google Analytics: ${ga4DashboardUrl}`);

  const text = textLines.join("\n");

  return { subject, html, text };
}

export async function sendDigest(recipients: string[]): Promise<{
  sent: boolean;
  recipient_count: number;
  error?: string;
}> {
  if (recipients.length === 0) {
    return { sent: false, recipient_count: 0, error: "No recipients" };
  }

  const metrics = await buildMetrics();
  const { subject, html, text } = renderDigest(metrics);

  try {
    const ok = await sendAdminMail({
      to: recipients,
      subject,
      html,
      text,
      headers: { "X-Entity-Ref-ID": `digest-${Date.now()}` },
    });
    if (!ok) {
      return { sent: false, recipient_count: recipients.length, error: "sendAdminMail returned false" };
    }
    return { sent: true, recipient_count: recipients.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Send failed";
    console.error("[digest] send failed:", msg);
    return { sent: false, recipient_count: recipients.length, error: msg };
  }
}
