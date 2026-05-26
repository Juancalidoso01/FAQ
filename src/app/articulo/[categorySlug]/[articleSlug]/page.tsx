import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";
import { JsonLd } from "@/components/FaqUi";
import {
  articlePath,
  getAllCategories,
  getArticle,
} from "@/lib/faq";
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
  const related = category.articles.filter((a) => a.slug !== article.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(category, article),
          breadcrumbJsonLd([
            { name: "Inicio", url: "/" },
            { name: category.title, url: `/categoria/${category.slug}` },
            { name: article.title, url: articlePath(category.slug, article.slug) },
          ]),
        ]}
      />

      <article itemScope itemType="https://schema.org/Article">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="text-sm text-slate-500">{category.title}</p>
          <h1 itemProp="headline" className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
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

        <div itemProp="articleBody">
          <ArticleContent content={article.content} />
        </div>

        {(article.sourceUrl || article.intercomUrl) && (
          <p className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400">
            Fuente:{" "}
            <a
              href={article.sourceUrl ?? article.intercomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4749B6] hover:underline"
            >
              {article.sourceUrl?.includes("comercios.puntopago.net")
                ? "GitBook Comercios"
                : "Intercom Help Center"}
            </a>
          </p>
        )}
      </article>

      {related.length > 0 && (
        <aside className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            En esta sección
          </h2>
          <ul className="space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={articlePath(category.slug, item.slug)}
                  className="text-sm font-medium text-[#4749B6] underline-offset-2 hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
}
