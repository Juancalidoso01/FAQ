import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ContentPanel, SectionHeading } from "@/components/FaqLayout";
import { JsonLd } from "@/components/FaqUi";
import { SearchBox } from "@/components/SearchBox";
import { ProductCard } from "@/components/ProductCard";
import { CreditProductCard } from "@/components/CreditProductCard";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  excerpt,
  getArticle,
} from "@/lib/faq";
import { getCreditProducts, getFeaturedGroups, getNavGroupById } from "@/lib/navigation";
import { faqPageJsonLd } from "@/lib/seo";
import { HERO_PRODUCTS_IMAGE } from "@/lib/site-images";

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
  const creditProducts = getCreditProducts();
  const creditSection = getNavGroupById("productos-credito");
  const otherClienteProducts = getFeaturedGroups("cliente").filter(
    (g) => !["productos-credito", "preguntas-frecuentes"].includes(g.id),
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

      <section className="pp-hero mb-10 sm:mb-12">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10 lg:text-left">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4749B6]">Centro de ayuda</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
              <span className="pp-brand-sheen">¿En qué te podemos ayudar?</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 lg:mx-0">
              {SITE_DESCRIPTION}
            </p>
            <div className="mx-auto mt-8 max-w-xl lg:mx-0">
              <SearchBox large />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <Image
              src={HERO_PRODUCTS_IMAGE}
              alt="Productos Punto Pago: tarjeta de crédito, adelantos de saldo, línea de crédito y pago con cuotas"
              width={1248}
              height={832}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full rounded-2xl border border-white/80 bg-white/60 shadow-lg shadow-slate-900/[0.08]"
            />
          </div>
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
          title="Productos de crédito"
          description={creditSection?.description}
          action={
            <Link href="/clientes" className="pp-btn-ghost text-sm">
              Ver todo →
            </Link>
          }
          id="clientes-heading"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creditProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>

        {otherClienteProducts.length > 0 && (
          <div className="mt-10">
            <SectionHeading
              eyebrow="También en la app"
              title="Otros servicios"
              action={
                <Link href="/clientes" className="pp-btn-ghost text-sm">
                  Ver todo →
                </Link>
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {otherClienteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

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
