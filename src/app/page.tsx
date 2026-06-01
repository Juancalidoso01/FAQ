import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroBanner } from "@/components/HeroBanner";
import { SectionHeading } from "@/components/FaqLayout";
import { JsonLd } from "@/components/FaqUi";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { T } from "@/components/T";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  excerpt,
  getArticle,
} from "@/lib/faq";
import {
  getClienteHubHref,
  getFeaturedGroups,
  getNavGroupById,
  POPULAR_CLIENT_LINKS,
} from "@/lib/navigation";
import { faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const topicGroups = getFeaturedGroups("cliente");
  const faqCliente = getNavGroupById("preguntas-frecuentes");

  const faqPreview =
    faqCliente?.items.slice(0, 5).map((item) => {
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

      <section className="pp-hero mb-10">
        <HeroBanner />

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B0B13] sm:text-4xl">
            <T>¿En qué te podemos ayudar?</T>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            <T>{SITE_DESCRIPTION}</T>
          </p>
          <div className="mt-8">
            <SearchBox large placeholder="Ej: activar tarjeta, recargar, remesas…" />
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/clientes"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4749B6]/30 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0B0B13]">
            <T>Soy cliente</T>
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            <T>Tarjetas, recargas, Marketplace, remesas y soporte de la app.</T>
          </p>
        </Link>
        <Link
          href="/empresas"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#4749B6]/30 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-[#0B0B13]">
            <T>Soy empresa</T>
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            <T>Cuotas en comercio, kioscos, corresponsales y soluciones B2B.</T>
          </p>
        </Link>
      </section>

      <section aria-labelledby="populares-heading" className="mb-10">
        <SectionHeading
          title={<T>Temas populares</T>}
          description={<T>Accesos directos a lo que más consultan nuestros clientes.</T>}
          id="populares-heading"
        />
        <div className="flex flex-wrap gap-2">
          {POPULAR_CLIENT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#4749B6] shadow-sm transition hover:border-[#4749B6]/30 hover:bg-[#4749B6]/5"
            >
              <T>{link.title}</T>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="temas-heading" className="mb-12">
        <SectionHeading
          title={<T>Explorar por tema</T>}
          description={<T>Elige una categoría para ver todas las guías disponibles.</T>}
          action={
            <Link href="/clientes" className="pp-btn-ghost text-sm">
              <T>Ver hub clientes →</T>
            </Link>
          }
          id="temas-heading"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicGroups.map((group) => (
            <ProductCard
              key={group.id}
              product={group}
              hubHref={getClienteHubHref(group.id)}
            />
          ))}
        </div>
      </section>

      {faqPreview.length > 0 && (
        <section aria-labelledby="faq-heading" className="mb-8">
          <SectionHeading
            title={<T>Preguntas frecuentes</T>}
            description={<T>Respuestas rápidas a dudas comunes.</T>}
            action={
              faqCliente?.items[0] ? (
                <Link href="/clientes#faq" className="pp-btn-ghost text-sm">
                  <T>Ver todas →</T>
                </Link>
              ) : undefined
            }
            id="faq-heading"
          />
          <FaqAccordion items={faqPreview} />
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 text-sm text-slate-600 shadow-sm">
        <p className="font-semibold text-[#0B0B13]">
          <T>¿Necesitas más ayuda?</T>
        </p>
        <p className="mt-1">
          <T>Teléfono</T>{" "}
          <a href="tel:+5073993999" className="font-medium text-[#4749B6] hover:underline">
            +507 399-3999
          </a>
          {" · "}
          WhatsApp{" "}
          <a
            href="https://wa.me/50768252816"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#4749B6] hover:underline"
          >
            +507 6825-2816
          </a>
        </p>
        <p className="mt-3 border-t border-slate-100 pt-3">
          <Link href="/libro" className="font-medium text-[#4749B6] hover:underline">
            <T>Descargar guía completa</T>
          </Link>{" "}
          <T>(libro digital en PDF o HTML)</T>
        </p>
      </section>
    </>
  );
}
