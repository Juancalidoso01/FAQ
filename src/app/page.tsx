import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/FaqUi";
import { ProductCard } from "@/components/ProductCard";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  excerpt,
  getArticle,
} from "@/lib/faq";
import { getFeaturedGroups, getNavSections } from "@/lib/navigation";
import { faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const clienteProducts = getFeaturedGroups("cliente");
  const empresaProducts = getFeaturedGroups("empresa");
  const sections = getNavSections();

  const featuredArticles = sections
    .flatMap((s) => s.groups)
    .flatMap((g) => g.items.slice(0, 1))
    .slice(0, 6);

  const faqItems = featuredArticles.map((item) => {
    const result = getArticle(item.categorySlug, item.articleSlug);
    return {
      question: item.title,
      answer: excerpt(result?.article.description || result?.article.content || item.title, 120),
      url: item.href,
    };
  });

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqItems)} />

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Centro de ayuda
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{SITE_DESCRIPTION}</p>

      <section aria-labelledby="clientes-heading" className="mt-10">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="clientes-heading" className="text-lg font-semibold text-slate-900">
            Punto Pago para clientes
          </h2>
          <Link href="/clientes" className="text-sm font-medium text-[#4749B6] hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {clienteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section aria-labelledby="empresas-heading" className="mt-12">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="empresas-heading" className="text-lg font-semibold text-slate-900">
            Punto Pago para empresas
          </h2>
          <Link href="/empresas" className="text-sm font-medium text-[#4749B6] hover:underline">
            Ver todo →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {empresaProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
