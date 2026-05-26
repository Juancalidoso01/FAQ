import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleListItem } from "@/components/CategoryCard";
import { JsonLd } from "@/components/FaqUi";
import { categoryPath, getAllCategories, getCategory } from "@/lib/faq";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: categoryPath(slug) },
    openGraph: {
      title: category.title,
      description: category.description,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd(category),
          breadcrumbJsonLd([
            { name: "Inicio", url: "/" },
            { name: category.title, url: categoryPath(slug) },
          ]),
        ]}
      />

      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {category.title}
        </h1>
        <p className="mt-2 text-slate-600">{category.description}</p>
      </header>

      {category.articles.length === 0 ? (
        <p className="text-slate-600">No hay artículos publicados en esta categoría por el momento.</p>
      ) : (
        <ul className="space-y-1">
          {category.articles.map((article) => (
            <ArticleListItem
              key={article.slug}
              categorySlug={category.slug}
              slug={article.slug}
              title={article.title}
              description={article.description || article.content}
            />
          ))}
        </ul>
      )}
    </>
  );
}
