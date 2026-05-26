import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/faq";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/buscar"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
