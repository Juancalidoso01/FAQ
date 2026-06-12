import { NextResponse } from "next/server";
import { CONTENT_SOURCES, type Audience } from "@/lib/content-sources";
import { articlePath, excerpt, getSiteUrl, searchArticles } from "@/lib/faq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function categoryAudience(slug: string): Audience | "general" {
  for (const source of CONTENT_SOURCES) {
    if (source.data.categories.some((c) => c.slug === slug)) {
      return source.audience;
    }
  }
  return "general";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(8, Math.max(1, Number(searchParams.get("limit") || 4)));
  const audience = (searchParams.get("audience") || "all") as Audience | "all";

  if (!q) {
    return NextResponse.json({ ok: true, query: "", results: [] });
  }

  let articles = searchArticles(q, limit * 4);

  if (audience !== "all") {
    articles = articles.filter((a) => {
      const aud = categoryAudience(a.categorySlug);
      return aud === audience || aud === "general";
    });
  }

  articles = articles.slice(0, limit);
  const site = getSiteUrl().replace(/\/$/, "");

  return NextResponse.json({
    ok: true,
    query: q,
    results: articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description || "",
      categorySlug: a.categorySlug,
      categoryTitle: a.categoryTitle,
      url: `${site}${articlePath(a.categorySlug, a.slug)}`,
      contentExcerpt: excerpt(a.content, 1400),
    })),
  });
}
