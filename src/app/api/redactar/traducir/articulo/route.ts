import { NextResponse } from "next/server";
import { getArticle } from "@/lib/faq";
import { getArticleTranslation } from "@/lib/translations";

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

  const ru = getArticleTranslation(cat, slug);

  return NextResponse.json({
    es: {
      title: result.article.title,
      description: result.article.description ?? "",
      content: result.article.content,
    },
    ru: ru
      ? { title: ru.title, description: ru.description, content: ru.content, updatedAt: ru.updatedAt }
      : null,
  });
}
