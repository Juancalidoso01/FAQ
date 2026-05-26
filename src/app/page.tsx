import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ContentPanel, SectionHeading } from "@/components/FaqLayout";
import { JsonLd } from "@/components/FaqUi";
import { SearchBox } from "@/components/SearchBox";
import { ProductCard } from "@/components/ProductCard";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  excerpt,
  getArticle,
} from "@/lib/faq";
import { getFeaturedGroups, getNavGroupById } from "@/lib/navigation";
import { faqPageJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const STEPS = [
  { n: "1", title: "Busca tu duda", text: "Usa el buscador o el menú lateral por producto." },
  { n: "2", title: "Elige tu guía", text: "Cliente, empresa o preguntas frecuentes." },
  { n: "3", title: "Sigue los pasos", text: "Instrucciones claras como en puntopago.net." },
];

export default function HomePage() {
  const clienteProducts = getFeaturedGroups("cliente").filter(
    (g) => g.id !== "preguntas-frecuentes",
  );
  const faqCliente = getNavGroupById("preguntas-frecuentes");
  const empresaProducts = getFeaturedGroups("empresa").filter((g) => g.id !== "faq-empresas");

  const faqPreview =
    faqCliente?.items.slice(0, 5).map((item) => {
      const result = getArticle(item.categorySlug, item.articleSlug);
      return {
        question: item.title,
        answer: excerpt(result?.article.description || result?.article.content || item.title, 180),
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

      <section className="pp-hero mb-10 text-center sm:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4749B6]">Centro de ayuda</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
          <span className="pp-brand-sheen">¿En qué te podemos ayudar?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">{SITE_DESCRIPTION}</p>
        <div className="mx-auto mt-8 max-w-xl">
          <SearchBox large />
        </div>
      </section>

      <section aria-labelledby="steps-heading" className="mb-12">
        <SectionHeading eyebrow="Cómo funciona" title="Encuentra respuestas en minutos" id="steps-heading" />
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="pp-step-card rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4749B6] text-sm font-bold text-white">
                {step.n}
              </span>
              <h3 className="mt-3 font-semibold text-[#0B0B13]">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="clientes-heading" className="mb-12">
        <SectionHeading
          eyebrow="Para clientes"
          title="Productos y servicios"
          action={
            <Link href="/clientes" className="pp-btn-ghost text-sm">
              Ver todo →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {clienteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {faqCliente && (
          <div className="mt-4">
            <ProductCard product={faqCliente} variant="highlight" />
          </div>
        )}
      </section>

      <section aria-labelledby="empresas-heading" className="mb-12">
        <SectionHeading
          eyebrow="Para empresas"
          title="Soluciones para comercios"
          action={
            <Link href="/empresas" className="pp-btn-ghost text-sm">
              Ver todo →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {empresaProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {faqPreview.length > 0 && (
        <section aria-labelledby="faq-heading" className="mb-4">
          <SectionHeading
            eyebrow="Saber más"
            title="Preguntas frecuentes"
            description="Hemos respondido las dudas más comunes de nuestros clientes."
          />
          <FaqAccordion items={faqPreview} />
        </section>
      )}
    </>
  );
}
