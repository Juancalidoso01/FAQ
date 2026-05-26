import Link from "next/link";
import type { FaqNavGroupResolved } from "@/lib/navigation";

export function ProductCard({ product }: { product: FaqNavGroupResolved }) {
  const firstArticle = product.items[0];
  const firstLink = product.links?.[0];
  const href = firstArticle?.href ?? firstLink?.href ?? `#${product.id}`;
  const isExternal = !firstArticle && !!firstLink?.external;

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{product.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {firstArticle ? (
          <Link
            href={href}
            className="text-sm font-medium text-[#4749B6] underline-offset-2 hover:underline"
          >
            Ver guías →
          </Link>
        ) : isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#4749B6] underline-offset-2 hover:underline"
          >
            Más información →
          </a>
        ) : null}
        {product.items.length > 1 && (
          <span className="text-xs text-slate-400">{product.items.length} artículos</span>
        )}
      </div>
    </article>
  );
}
