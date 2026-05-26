import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { SectionAccordion } from "@/components/SectionAccordion";
import {
  CLIENTE_HUB_ANCHORS,
  getClienteHubHref,
  getFeaturedGroups,
} from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para clientes",
  description:
    "Hub de ayuda para clientes Punto Pago: crédito, débito, tarjetas Mastercard, recargas, Marketplace y remesas.",
  alternates: { canonical: "/clientes" },
};

export default function ClientesPage() {
  const topicGroups = getFeaturedGroups("cliente");

  const accordionSections = topicGroups.map((group) => ({
    id: CLIENTE_HUB_ANCHORS[group.id as keyof typeof CLIENTE_HUB_ANCHORS],
    title: group.title,
    description: group.description,
    items: group.items.map((item) => ({
      title: item.title,
      href: item.href,
    })),
  }));

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para clientes
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Elige un tema para ver las guías. Usa la búsqueda si ya sabes qué necesitas.
      </p>

      <div className="mt-6 max-w-xl">
        <SearchBox compact placeholder="Buscar en el centro de ayuda…" />
      </div>

      <section aria-labelledby="temas-heading" className="mt-10">
        <h2
          id="temas-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Temas
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicGroups.map((group) => (
            <ProductCard
              key={group.id}
              product={group}
              hubHref={getClienteHubHref(group.id)}
              variant={group.id === "preguntas-frecuentes" ? "highlight" : "default"}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="guias-heading" className="mt-12">
        <h2
          id="guias-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Todas las guías por tema
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Expande un tema para ver cada artículo. Los enlaces del menú lateral también llevan aquí.
        </p>
        <div className="mt-4">
          <SectionAccordion sections={accordionSections} />
        </div>
      </section>
    </>
  );
}
