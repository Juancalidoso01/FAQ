import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBox } from "@/components/SearchBox";
import { JsonLd } from "@/components/FaqUi";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  articlePath,
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
    .slice(0, 8);

  const faqItems = featuredArticles.map(({ category, article }) => ({
    question: article.title,
    answer: excerpt(article.description || article.content, 280),
    url: articlePath(category.slug, article.slug),
  }));

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqItems)} />

      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0B0B13] sm:text-4xl">
          <span className="pp-brand-sheen">Centro de ayuda</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          {SITE_DESCRIPTION}
        </p>
        <div className="mt-8">
          <SearchBox large />
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="mb-12">
        <h2 id="categories-heading" className="mb-5 text-lg font-semibold text-[#0B0B13]">
          Explorar por categoría
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="mb-5 text-lg font-semibold text-[#0B0B13]">
          Artículos destacados
        </h2>
        <ul className="space-y-3">
          {featuredArticles.map(({ category, article }) => (
            <li key={`${category.slug}-${article.slug}`}>
              <a
                href={articlePath(category.slug, article.slug)}
                className="group block rounded-xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm transition hover:border-[#4749B6]/30 hover:shadow-md"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[#4749B6]">
                  {category.title}
                </p>
                <h3 className="mt-1 font-semibold text-[#0B0B13] group-hover:text-[#4749B6]">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-600">
                  {excerpt(article.description || article.content, 120)}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
