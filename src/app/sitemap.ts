import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";
import { listPublicSubmissions } from "@/lib/db/submissions";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const projects = await listPublicSubmissions();

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/projetos`, changeFrequency: "daily", priority: 0.8 },
    ...(process.env.RESULTS_PUBLISHED === "true"
      ? [{ url: `${siteUrl}/resultados`, changeFrequency: "weekly" as const, priority: 0.8 }]
      : []),
    ...projects.map((project) => ({
      url: `${siteUrl}/projetos/${project.slug}`,
      lastModified: project.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
