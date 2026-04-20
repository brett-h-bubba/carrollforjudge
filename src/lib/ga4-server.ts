/**
 * Google Analytics (GA4) Data API — server-side report reader.
 *
 * Optional. If GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_JSON are missing,
 * getGA4Metrics() returns null and the digest falls back gracefully.
 *
 * Setup:
 * 1. GCP console → IAM → Service Accounts → create (e.g. "carrollforjudge-digest").
 * 2. Keys tab on that service account → Add key → JSON → download.
 * 3. GA4 → Admin → Property access management → add the service-account email
 *    as Viewer on the carrollforjudge.com property.
 * 4. In Vercel set env vars:
 *      GA4_PROPERTY_ID=<numeric property id; NOT the G-XXXX measurement id>
 *      GA4_SERVICE_ACCOUNT_JSON=<base64-encoded contents of the JSON key>
 *    (base64 to avoid newline/quote escape hell in the Vercel UI)
 *    Redeploy.
 *
 * Named ga4-server.ts to avoid colliding with the existing client-side
 * analytics.ts (which is for browser gtag events, not reporting).
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type { google } from "@google-analytics/data/build/protos/protos";

type RunReportRow = google.analytics.data.v1beta.IRow;

export interface GA4Metrics {
  yesterday: { users: number; sessions: number; pageViews: number };
  sevenDay: { users: number; sessions: number; pageViews: number };
  thirtyDay: { users: number; sessions: number; pageViews: number };
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ source: string; users: number }>;
}

let cachedClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient | null {
  if (cachedClient) return cachedClient;
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  let creds: { client_email: string; private_key: string };
  try {
    const decoded = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf-8");
    creds = JSON.parse(decoded);
  } catch (err) {
    console.error("[ga4] GA4_SERVICE_ACCOUNT_JSON unparseable:", err);
    return null;
  }
  cachedClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key.replace(/\\n/g, "\n"),
    },
  });
  return cachedClient;
}

export async function getGA4Metrics(): Promise<GA4Metrics | null> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const client = getClient();
  if (!propertyId || !client) return null;

  const property = `properties/${propertyId}`;
  try {
    const [yesterdayRes, sevenDayRes, thirtyDayRes, topPagesRes, topReferrersRes] =
      await Promise.all([
        client.runReport({
          property,
          dateRanges: [{ startDate: "yesterday", endDate: "yesterday" }],
          metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
        }),
        client.runReport({
          property,
          dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
          metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
        }),
        client.runReport({
          property,
          dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
          metrics: [{ name: "totalUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
        }),
        client.runReport({
          property,
          dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 5,
        }),
        client.runReport({
          property,
          dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
          dimensions: [{ name: "sessionSource" }],
          metrics: [{ name: "totalUsers" }],
          orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
          limit: 5,
        }),
      ]);

    const readSingle = (rows: RunReportRow[] | null | undefined) => ({
      users: Number(rows?.[0]?.metricValues?.[0]?.value ?? 0),
      sessions: Number(rows?.[0]?.metricValues?.[1]?.value ?? 0),
      pageViews: Number(rows?.[0]?.metricValues?.[2]?.value ?? 0),
    });

    return {
      yesterday: readSingle(yesterdayRes[0].rows),
      sevenDay: readSingle(sevenDayRes[0].rows),
      thirtyDay: readSingle(thirtyDayRes[0].rows),
      topPages: (topPagesRes[0].rows || []).map((r) => ({
        path: r.dimensionValues?.[0]?.value || "/",
        views: Number(r.metricValues?.[0]?.value ?? 0),
      })),
      topReferrers: (topReferrersRes[0].rows || []).map((r) => ({
        source: r.dimensionValues?.[0]?.value || "(direct)",
        users: Number(r.metricValues?.[0]?.value ?? 0),
      })),
    };
  } catch (err) {
    console.error("[ga4] query failed:", err);
    return null;
  }
}
