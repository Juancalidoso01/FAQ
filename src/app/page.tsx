import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/FaqUi";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  articlePath,
  categoryPath,
  excerpt,
  getAllCategories,
} from "@/lib/faq";
import { faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const categories = getAllCategories();
  const featuredArticles = categories
    .flatMap((category) =>
      category.articles.slice(0, 1).map((article) => ({ category, article })),
    )
    .slice(0, 6);

  const faqItems = featuredArticles.map(({ category, article }) => ({
    question: article.title,
    answer: excerpt(article.description || article.content, 280),
    url: articlePath(category.slug, article.slug),
  }));

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqItems)} />

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Centro de ayuda
      </h1>
      <p className="mt-3 text-base leading-relaxed text-slate-600">{SITE_DESCRIPTION}</p>

      <section aria-labelledby="start-heading" className="mt-10">
        <h2 id="start-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Empezar aquí
        </h2>
        <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
          {categories.slice(0, 8).map((category) => (
            <li key={category.slug}>
              <Link
                href={categoryPath(category.slug)}
                className="group flex items-center justify-between gap-4 py-3.5 transition hover:text-[#4749B6]"
              >
                <span>
                  <span className="block font-medium text-slate-900 group-hover:text-[#4749B6]">
                    {category.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-500">{category.description}</span>
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {category.articles.length} artículos →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="popular-heading" className="mt-10">
        <h2 id="popular-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Artículos populares
        </h2>
        <ul className="mt-4 space-y-2">
          {featuredArticles.map(({ category, article }) => (
            <li key={`${category.slug}-${article.slug}`}>
              <Link
                href={articlePath(category.slug, article.slug)}
                className="text-[15px] font-medium text-[#4749B6] underline-offset-2 hover:underline"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
