import Link from "next/link";
import type { CreditProduct } from "@/lib/navigation";

export function CreditProductCard({ product }: { product: CreditProduct }) {
  return (
    <article className="pp-product-card flex h-full flex-col rounded-2xl border border-white/90 bg-white/90 p-5 shadow-sm shadow-slate-900/[0.04] transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-[#0B0B13]">{product.title}</h3>
        {product.badge && (
          <span className="shrink-0 rounded-full bg-[#E8E9F7] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#4749B6]">
            {product.badge}
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{product.description}</p>
      <Link href={product.href} className="pp-btn-primary mt-5 inline-flex w-fit text-sm">
        Ver guía
      </Link>
    </article>
  );
}
