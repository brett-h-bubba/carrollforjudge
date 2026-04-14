import type { MetadataRoute } from "next";
import { getServerSupabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carrollforjudge.com";

// Content freshness dates — bump manually when a page's copy changes.
// ISO 8601 format. Used as the lastmod for static pages so Google sees
// accurate change dates instead of "everything changed today."
const STATIC_CONTENT_UPDATED: Record<string, string> = {
  "/":                "2026-04-14",
  "/about":           "2026-04-14",
  "/chancery-court":  "2026-04-14",
  "/get-involved":    "2026-04-14",
  "/donate":          "2026-04-14",
};

async function latestEndorsementDate(): Promise<Date> {
  try {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("endorsements")
      .select("created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data?.created_at) return new Date(data.created_at);
  } catch {
    // Fall through to default
  }
  return new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const endorsementsLastMod = await latestEndorsementDate();

  const staticRoutes = [
    { path: "/",                priority: 1.0, changeFrequency: "weekly"  as const },
    { path: "/about",           priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/chancery-court",  priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/get-involved",    priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/donate",          priority: 0.8, changeFrequency: "monthly" as const },
    // { path: "/news", priority: 0.7, changeFrequency: "weekly" as const }, // hidden for now
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: STATIC_CONTENT_UPDATED[r.path]
      ? new Date(STATIC_CONTENT_UPDATED[r.path])
      : new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const endorsementsRoute = {
    url: `${SITE_URL}/endorsements`,
    lastModified: endorsementsLastMod,
    changeFrequency: "daily" as const,
    priority: 0.9,
  };

  return [...staticRoutes, endorsementsRoute];
}
