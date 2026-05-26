import type { MetadataRoute } from "next";
import { articlePath, categoryPath, getAllArticles, getAllCategories, getSiteUrl } from "@/lib/faq";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/buscar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  for (const category of getAllCategories()) {
    entries.push({
      url: `${siteUrl}${categoryPath(category.slug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const article of getAllArticles()) {
    entries.push({
      url: `${siteUrl}${articlePath(article.categorySlug, article.slug)}`,
      lastModified: article.updatedAt ? new Date(article.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
