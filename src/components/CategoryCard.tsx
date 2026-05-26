import Link from "next/link";
import { CategoryIcon } from "@/components/FaqUi";
import { categoryPath, excerpt, type FaqCategory } from "@/lib/faq";

export function CategoryCard({ category }: { category: FaqCategory }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm ring-1 ring-slate-200/50 transition hover:shadow-md">
      <Link href={categoryPath(category.slug)} className="group block flex-1 p-5">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8E9F7] text-[#4749B6]">
            <CategoryIcon icon={category.icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-[#0B0B13] group-hover:text-[#4749B6]">
              {category.title}
            </h2>
            <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">{category.description}</p>
            <p className="mt-3 text-xs font-medium text-slate-500">
              {category.articles.length}{" "}
              {category.articles.length === 1 ? "artículo" : "artículos"}
            </p>
          </div>
        </div>
      </Link>
      {category.articles.length > 0 && (
        <ul className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          {category.articles.slice(0, 3).map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articulo/${category.slug}/${article.slug}`}
                className="block py-1.5 text-sm text-[#4749B6] underline-offset-2 hover:underline"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function ArticleListItem({
  categorySlug,
  title,
  description,
  slug,
}: {
  categorySlug: string;
  title: string;
  description: string;
  slug: string;
}) {
  return (
    <li>
      <Link
        href={`/articulo/${categorySlug}/${slug}`}
        className="group block rounded-xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm transition hover:border-[#4749B6]/30 hover:shadow-md"
      >
        <h3 className="font-semibold text-[#0B0B13] group-hover:text-[#4749B6]">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-600">{excerpt(description, 140)}</p>
      </Link>
    </li>
  );
}
