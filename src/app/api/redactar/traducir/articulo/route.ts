import { NextResponse } from "next/server";
import { getArticle } from "@/lib/faq";
import { getArticleTranslation, type Lang } from "@/lib/translations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cat = (searchParams.get("cat") ?? "").trim();
  const slug = (searchParams.get("slug") ?? "").trim();

  const result = getArticle(cat, slug);
  if (!result) {
    return NextResponse.json({ error: "Artículo no encontrado." }, { status: 404 });
  }

  const { article } = result;
  const originalLang: Lang = article.lang === "ru" ? "ru" : "es";

  const original = {
    title: article.title,
    description: article.description ?? "",
    content: article.content,
  };

  const tr = (lang: Lang) => {
    const t = getArticleTranslation(cat, slug, lang);
    return t ? { title: t.title, description: t.description, content: t.content, updatedAt: t.updatedAt } : null;
  };

  return NextResponse.json({
    originalLang,
    original,
    es: originalLang === "es" ? original : tr("es"),
    ru: originalLang === "ru" ? original : tr("ru"),
  });
}
