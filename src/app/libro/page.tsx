import type { Metadata } from "next";
import { BookView, type BookChapter, type BookPart } from "@/components/BookView";
import { parseArticleContent } from "@/lib/content";
import { articlePath, getAllCategories, SITE_NAME } from "@/lib/faq";
import { getAudienceForCategory } from "@/lib/navigation";
import { getArticleTranslation } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Guía completa",
  description: "Libro digital con todas las guías del Centro de Ayuda Punto Pago.",
  robots: { index: false, follow: false },
};

function buildParts(): BookPart[] {
  const chapters: Record<"cliente" | "empresa", BookChapter[]> = { cliente: [], empresa: [] };

  for (const category of getAllCategories()) {
    if (!category.articles.length) continue;
    const audience = getAudienceForCategory(category.slug);

    const chapter: BookChapter = {
      id: `c-${category.slug}`,
      title: category.title,
      description: category.description ?? "",
      articles: category.articles.map((article) => {
        const es = parseArticleContent(article.content, article.title);
        const ruT = getArticleTranslation(category.slug, article.slug, "ru");
        const ru = ruT ? parseArticleContent(ruT.content, ruT.title) : null;
        return {
          id: `a-${category.slug}-${article.slug}`,
          href: articlePath(category.slug, article.slug),
          es: {
            title: article.title,
            description: article.description ?? "",
            html: es.html,
          },
          ru:
            ru && ruT
              ? { title: ruT.title, description: ruT.description, html: ru.html }
              : null,
        };
      }),
    };

    chapters[audience].push(chapter);
  }

  return (
    [
      { id: "cliente" as const, title: "Para clientes", chapters: chapters.cliente },
      { id: "empresa" as const, title: "Para empresas", chapters: chapters.empresa },
    ] satisfies BookPart[]
  ).filter((part) => part.chapters.length > 0);
}

export default function LibroPage() {
  const parts = buildParts();
  const totalArticles = parts.reduce(
    (sum, part) => sum + part.chapters.reduce((s, c) => s + c.articles.length, 0),
    0,
  );

  return (
    <BookView
      siteName={SITE_NAME}
      parts={parts}
      totalArticles={totalArticles}
      generatedAt={new Date().toISOString()}
    />
  );
}
