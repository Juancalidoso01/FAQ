import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleListItem } from "@/components/CategoryCard";
import { Breadcrumbs, CategoryIcon, JsonLd } from "@/components/FaqUi";
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

      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: category.title },
        ]}
      />

      <header className="mb-8 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8E9F7] text-[#4749B6]">
          <CategoryIcon icon={category.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B0B13] sm:text-3xl">
            {category.title}
          </h1>
          <p className="mt-2 text-slate-600">{category.description}</p>
        </div>
      </header>

      {category.articles.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white/90 px-4 py-6 text-slate-600">
          No hay artículos publicados en esta categoría por el momento.
        </p>
      ) : (
        <ul className="space-y-3">
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
