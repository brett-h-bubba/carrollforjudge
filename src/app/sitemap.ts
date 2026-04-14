import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carrollforjudge.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/chancery-court", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/endorsements", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/get-involved", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/donate", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/news", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
