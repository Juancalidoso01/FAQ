import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleFeedback } from "@/components/ArticleFeedback";
import { ArticleSupport } from "@/components/ArticleSupport";
import { ArticleToc } from "@/components/ArticleToc";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContentPanel } from "@/components/FaqLayout";
import { JsonLd } from "@/components/FaqUi";
import { RemesasCalculator } from "@/components/RemesasCalculator";
import { parseArticleContent } from "@/lib/content";
import {
  articlePath,
  getAllCategories,
  getArticle,
} from "@/lib/faq";
import { getArticleBreadcrumbs, getSectionArticles } from "@/lib/navigation";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

/** Normaliza texto para comparar la descripción con el inicio del contenido. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type Props = { params: Promise<{ categorySlug: string; articleSlug: string }> };

export async function generateStaticParams() {
  return getAllCategories().flatMap((category) =>
    category.articles.map((article) => ({
      categorySlug: category.slug,
      articleSlug: article.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug, articleSlug } = await params;
  const result = getArticle(categorySlug, articleSlug);
  if (!result) return {};

  const { article } = result;
  const description = article.description || article.content.slice(0, 160);

  return {
    title: article.title,
    description,
    alternates: {
      canonical: articlePath(categorySlug, articleSlug),
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { categorySlug, articleSlug } = await params;
  const result = getArticle(categorySlug, articleSlug);
  if (!result) notFound();

  const { category, article } = result;
  const parsed = parseArticleContent(article.content, article.title);
  const sectionArticles = getSectionArticles(categorySlug, articleSlug);
  const sectionSiblings = sectionArticles.filter((item) => item.articleSlug !== articleSlug);
  const categoryRelated = category.articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4)
    .map((a) => ({
      title: a.title,
      href: articlePath(category.slug, a.slug),
    }));
  const related =
    sectionSiblings.length > 0
      ? sectionSiblings.map((item) => ({ title: item.title, href: item.href }))
      : categoryRelated;
  const breadcrumbs = getArticleBreadcrumbs(categorySlug, articleSlug);
  const isRemesasArticle =
    categorySlug === "remesas-internacionales" && articleSlug === "remesas-internacionales";

  const eyebrow = breadcrumbs.length >= 2 ? breadcrumbs[breadcrumbs.length - 2].label : null;
  const contentStart = normalize(article.content).slice(0, 80);
  const descNorm = article.description ? normalize(article.description) : "";
  const showLead =
    descNorm.length > 0 && !contentStart.startsWith(descNorm.slice(0, 40));

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(category, article),
          breadcrumbJsonLd(breadcrumbs.map((b) => ({ name: b.label, url: b.href }))),
        ]}
      />

      <Breadcrumbs items={breadcrumbs} />

      <ContentPanel>
        <article itemScope itemType="https://schema.org/Article">
          <header className="mb-8 border-b border-slate-200 pb-6">
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#4749B6]">
                {eyebrow}
              </p>
            )}
            <h1
              itemProp="headline"
              className="text-2xl font-bold tracking-tight text-[#0B0B13] sm:text-3xl"
            >
              {article.title}
            </h1>
            {showLead && (
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {article.description}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                {parsed.readingMinutes} min de lectura
              </span>
              {article.updatedAt && (
                <>
                  <span aria-hidden className="text-slate-300">
                    ·
                  </span>
                  <span>
                    Actualizado:{" "}
                    <time itemProp="dateModified" dateTime={article.updatedAt}>
                      {new Date(article.updatedAt).toLocaleDateString("es-PA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </span>
                </>
              )}
            </div>
          </header>

          {isRemesasArticle && <RemesasCalculator />}

          <ArticleToc headings={parsed.headings} />

          <div itemProp="articleBody">
            <ArticleContent html={parsed.html} />
          </div>
        </article>

        <ArticleFeedback />

        <ArticleSupport />

        {related.length > 0 && (
          <aside className="mt-10 border-t border-slate-200/80 pt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#4749B6]">
              En esta sección
            </h2>
            <ul className="space-y-2">
              {related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 transition hover:border-[#4749B6]/40 hover:bg-[#4749B6]/[0.04]"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-[#4749B6]">
                      {item.title}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#4749B6]"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </ContentPanel>
    </>
  );
}
