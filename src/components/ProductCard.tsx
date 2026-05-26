import Link from "next/link";
import type { FaqNavGroupResolved } from "@/lib/navigation";

export function ProductCard({
  product,
  variant = "default",
  hubHref,
}: {
  product: FaqNavGroupResolved;
  variant?: "default" | "highlight";
  /** Enlace al hub de sección (ej. /clientes#creditos) en lugar del primer artículo. */
  hubHref?: string;
}) {
  const firstArticle = product.items[0];
  const firstLink = product.links?.[0];
  const href = hubHref ?? firstArticle?.href ?? firstLink?.href ?? `#${product.id}`;
  const isExternal = !hubHref && !firstArticle && !!firstLink?.external;

  return (
    <article
      className={`pp-product-card flex flex-col rounded-2xl border p-6 transition duration-300 ${
        variant === "highlight"
          ? "border-[#4749B6]/30 bg-gradient-to-br from-white to-[#4749B6]/[0.06] shadow-md shadow-[#4749B6]/10 hover:shadow-lg"
          : "border-white/90 bg-white/90 shadow-sm shadow-slate-900/[0.04] hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-[#0B0B13]">{product.title}</h3>
        {product.badge && (
          <span className="shrink-0 rounded-full bg-[#E8E9F7] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#4749B6]">
            {product.badge}
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{product.description}</p>

      {product.subgroups.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {product.subgroups.slice(0, 4).map((sg) => (
            <li
              key={sg.id}
              className="rounded-full bg-slate-100/90 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {sg.title}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {hubHref || firstArticle ? (
          <Link href={href} className="pp-btn-primary text-sm">
            {variant === "highlight" ? "Ver preguntas frecuentes" : hubHref ? "Ver tema" : "Ver guía"}
          </Link>
        ) : isExternal ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="pp-btn-primary text-sm">
            Más información
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
