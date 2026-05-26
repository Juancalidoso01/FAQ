import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/ArticleContent";
import { Breadcrumbs, JsonLd } from "@/components/FaqUi";
import {
  articlePath,
  categoryPath,
  excerpt,
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
  const description = article.description || excerpt(article.content, 160);

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
            { name: category.title, url: categoryPath(category.slug) },
            { name: article.title, url: articlePath(category.slug, article.slug) },
          ]),
        ]}
      />

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: category.title, href: categoryPath(category.slug) },
          { label: article.title },
        ]}
      />

      <article itemScope itemType="https://schema.org/Article">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-[#4749B6]">
            {category.title}
          </p>
          <h1 itemProp="headline" className="mt-2 text-2xl font-bold tracking-tight text-[#0B0B13] sm:text-3xl">
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
          <p className="mt-8 text-xs text-slate-400">
            Fuente original:{" "}
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
        <aside className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="mb-4 text-lg font-semibold text-[#0B0B13]">
            Artículos relacionados
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
