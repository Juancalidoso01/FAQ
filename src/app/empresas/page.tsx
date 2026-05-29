import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { SearchBox } from "@/components/SearchBox";
import { SectionAccordion } from "@/components/SectionAccordion";
import {
  EMPRESA_HUB_ANCHORS,
  getEmpresaHubHref,
  getFeaturedGroups,
  getOrganizedMenu,
} from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para empresas",
  description:
    "Ayuda para comercios: Pago en cuotas merchant, kioscos, agente corresponsal y servicios corporativos.",
  alternates: { canonical: "/empresas" },
};

export default function EmpresasPage() {
  const topicGroups = getFeaturedGroups("empresa");
  const menu = getOrganizedMenu("empresa");
  const itemsByGroup = new Map(menu.groups.map((group) => [group.id, group.items]));

  const accordionSections = topicGroups.map((group) => {
    const items = itemsByGroup.get(group.id) ?? group.items;
    return {
      id: EMPRESA_HUB_ANCHORS[group.id as keyof typeof EMPRESA_HUB_ANCHORS],
      title: group.title,
      description: group.description,
      items:
        items.length > 0
          ? items.map((item) => ({ title: item.title, href: item.href }))
          : (group.links?.map((link) => ({
              title: link.title,
              href: link.href,
            })) ?? []),
    };
  });

  if (menu.unplaced.length > 0) {
    accordionSections.push({
      id: "novedades",
      title: "Nuevas guías",
      description: "Guías agregadas recientemente por el equipo de Punto Pago.",
      items: menu.unplaced.map((item) => ({ title: item.title, href: item.href })),
    });
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para empresas
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Soluciones para comercios, corresponsales y empresas. Elige una línea de negocio para ver las
        guías.
      </p>

      <div className="mt-6 max-w-xl">
        <SearchBox compact placeholder="Buscar en el centro de ayuda…" />
      </div>

      <section aria-labelledby="soluciones-heading" className="mt-10">
        <h2
          id="soluciones-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Soluciones
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {topicGroups.map((group) => (
            <div
              key={group.id}
              id={EMPRESA_HUB_ANCHORS[group.id as keyof typeof EMPRESA_HUB_ANCHORS]}
              className="scroll-mt-24"
            >
              <ProductCard
                product={group}
                hubHref={getEmpresaHubHref(group.id)}
                variant={group.id === "faq-empresas" ? "highlight" : "default"}
              />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="guias-heading" className="mt-12">
        <h2
          id="guias-heading"
          className="text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          Todas las guías por solución
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Expande una solución para ver cada artículo disponible.
        </p>
        <div className="mt-4">
          <SectionAccordion sections={accordionSections} />
        </div>
      </section>
    </>
  );
}
