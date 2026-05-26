import Link from "next/link";
import type { FaqNavGroupResolved } from "@/lib/navigation";

export function ProductCard({
  product,
  variant = "default",
}: {
  product: FaqNavGroupResolved;
  variant?: "default" | "highlight";
}) {
  const firstArticle = product.items[0];
  const firstLink = product.links?.[0];
  const href = firstArticle?.href ?? firstLink?.href ?? `#${product.id}`;
  const isExternal = !firstArticle && !!firstLink?.external;

  return (
    <article
      className={`flex flex-col rounded-xl border p-5 transition hover:shadow-sm ${
        variant === "highlight"
          ? "border-[#4749B6]/25 bg-[#4749B6]/[0.03] hover:border-[#4749B6]/40"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{product.description}</p>

      {product.subgroups.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {product.subgroups.slice(0, 4).map((sg) => (
            <li
              key={sg.id}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {sg.title}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {firstArticle ? (
          <Link
            href={href}
            className="text-sm font-medium text-[#4749B6] underline-offset-2 hover:underline"
          >
            {variant === "highlight" ? "Ver preguntas frecuentes →" : "Ver guías →"}
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
        {product.items.length > 0 && (
          <span className="text-xs text-slate-400">
            {product.items.length} {product.items.length === 1 ? "artículo" : "artículos"}
          </span>
        )}
      </div>
    </article>
  );
}
