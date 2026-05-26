import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContentPanel } from "@/components/FaqLayout";
import { JsonLd } from "@/components/FaqUi";
import { RemesasCalculator } from "@/components/RemesasCalculator";
import {
  articlePath,
  getAllCategories,
  getArticle,
} from "@/lib/faq";
import { getArticleBreadcrumbs, getSectionArticles } from "@/lib/navigation";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

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
            <h1
              itemProp="headline"
              className="text-2xl font-bold tracking-tight text-[#0B0B13] sm:text-3xl"
            >
              {article.title}
            </h1>
            {article.updatedAt && (
              <p className="mt-3 text-sm text-slate-500">
                Actualizado:{" "}
                <time itemProp="dateModified" dateTime={article.updatedAt}>
                  {new Date(article.updatedAt).toLocaleDateString("es-PA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </p>
            )}
          </header>

          {isRemesasArticle && <RemesasCalculator />}

          <div itemProp="articleBody">
            <ArticleContent content={article.content} />
          </div>
        </article>

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
                    className="text-sm font-semibold text-[#4749B6] underline-offset-2 hover:underline"
                  >
                    {item.title}
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
