import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroBanner } from "@/components/HeroBanner";
import { SectionHeading } from "@/components/FaqLayout";
import { JsonLd } from "@/components/FaqUi";
import { SearchBox } from "@/components/SearchBox";
import { CreditProductCard } from "@/components/CreditProductCard";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  excerpt,
  getArticle,
} from "@/lib/faq";
import { getCreditProducts, getNavGroupById, getDebitProducts, getMarketplaceProducts, getRemesasProducts } from "@/lib/navigation";
import { faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const creditProducts = getCreditProducts();
  const debitProducts = getDebitProducts();
  const marketplaceProducts = getMarketplaceProducts();
  const remesasProducts = getRemesasProducts();
  const faqCliente = getNavGroupById("preguntas-frecuentes");

  const faqPreview =
    faqCliente?.items.slice(0, 6).map((item) => {
      const result = getArticle(item.categorySlug, item.articleSlug);
      return {
        question: item.title,
        answer: excerpt(result?.article.description || result?.article.content || item.title, 160),
        href: item.href,
      };
    }) ?? [];

  const faqItems = faqPreview.map((item) => ({
    question: item.question,
    answer: item.answer,
    url: item.href ?? "/",
  }));

  return (
    <>
      <JsonLd data={faqPageJsonLd(faqItems)} />

      <section className="pp-hero mb-12">
        <HeroBanner />

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B0B13] sm:text-4xl">
            ¿En qué te podemos ayudar?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{SITE_DESCRIPTION}</p>
          <div className="mt-8">
            <SearchBox large />
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/clientes"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4749B6]/30 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0B0B13]">Soy cliente</h2>
          <p className="mt-2 text-sm text-slate-600">
            Productos de crédito, débito, Marketplace, remesas y preguntas sobre la app.
          </p>
        </Link>
        <Link
          href="/empresas"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4749B6]/30 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0B0B13]">Soy empresa</h2>
          <p className="mt-2 text-sm text-slate-600">
            Cuotas en comercio, kioscos, corresponsales y soluciones B2B.
          </p>
        </Link>
      </section>

      <section aria-labelledby="creditos-heading" className="mb-12">
        <SectionHeading
          title="Productos de crédito"
          description="Guías oficiales para clientes Punto Pago."
          action={
            <Link href="/clientes#creditos" className="pp-btn-ghost text-sm">
              Ver todas →
            </Link>
          }
          id="creditos-heading"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creditProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      <section aria-labelledby="debito-heading" className="mb-12">
        <SectionHeading
          title="Productos débito"
          description="Tarjeta prepago y Tarjeta Junior — débito prepago, no crédito."
          action={
            <Link href="/clientes#debito" className="pp-btn-ghost text-sm">
              Ver todas →
            </Link>
          }
          id="debito-heading"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {debitProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      <section aria-labelledby="marketplace-heading" className="mb-12">
        <SectionHeading
          title="Marketplace"
          description="Compra en la tienda de la app con entrega a domicilio y pago al contado."
          action={
            <Link href="/clientes#marketplace" className="pp-btn-ghost text-sm">
              Ver más →
            </Link>
          }
          id="marketplace-heading"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {marketplaceProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      <section aria-labelledby="remesas-heading" className="mb-12">
        <SectionHeading
          title="Remesas internacionales"
          description="Envía dinero a Colombia, Nicaragua y República Dominicana. Promo: 2 remesas gratis."
          action={
            <Link href="/clientes#remesas" className="pp-btn-ghost text-sm">
              Ver más →
            </Link>
          }
          id="remesas-heading"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {remesasProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      {faqPreview.length > 0 && (
        <section aria-labelledby="faq-heading" className="mb-4">
          <SectionHeading
            title="Preguntas frecuentes"
            description="Lo más consultado por nuestros usuarios."
            action={
              faqCliente?.items[0] ? (
                <Link href={faqCliente.items[0].href} className="pp-btn-ghost text-sm">
                  Ver todas →
                </Link>
              ) : undefined
            }
            id="faq-heading"
          />
          <FaqAccordion items={faqPreview} />
        </section>
      )}
    </>
  );
}
