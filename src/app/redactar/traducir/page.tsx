import type { Metadata } from "next";
import { TraducirClient, type ArticleIndexItem } from "@/components/TraducirClient";
import { getAllCategories } from "@/lib/faq";
import { redactorRequiresPassword } from "@/lib/redactar-access";
import { getArticleTranslation } from "@/lib/translations";

export const metadata: Metadata = {
  title: "Traducir guías al ruso",
  description: "Herramienta interna para revisar y corregir las traducciones al ruso.",
  robots: { index: false, follow: false },
};

export default function TraducirPage() {
  const seen = new Set<string>();
  const index: ArticleIndexItem[] = [];

  for (const category of getAllCategories()) {
    for (const article of category.articles) {
      const key = `${category.slug}/${article.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      index.push({
        categorySlug: category.slug,
        articleSlug: article.slug,
        title: article.title,
        categoryTitle: category.title,
        translated: Boolean(getArticleTranslation(category.slug, article.slug)),
      });
    }
  }

  index.sort(
    (a, b) =>
      a.categoryTitle.localeCompare(b.categoryTitle) || a.title.localeCompare(b.title),
  );

  return <TraducirClient index={index} requiresPassword={redactorRequiresPassword()} />;
}
