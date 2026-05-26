import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getNavSections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para empresas",
  description:
    "Ayuda para comercios: Cuotas, kioscos, agente corresponsal y servicios corporativos Punto Pago.",
  alternates: { canonical: "/empresas" },
};

export default function EmpresasPage() {
  const section = getNavSections().find((s) => s.id === "empresa");
  const groups = section?.groups ?? [];

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para empresas
      </h1>
      <p className="mt-2 text-slate-600">
        Soluciones para comercios, corresponsales y empresas — las mismas líneas del formulario de
        afiliación.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <ProductCard key={group.id} product={group} />
        ))}
      </div>

      <section className="mt-10 border-t border-slate-200 pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Guías y recursos
        </h2>
        <ul className="mt-4 divide-y divide-slate-200">
          {groups.flatMap((group) => [
            ...group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between gap-4 py-3 text-sm transition hover:text-[#4749B6]"
                >
                  <span>
                    <span className="block font-medium text-slate-900">{item.title}</span>
                    <span className="text-xs text-slate-500">{group.title}</span>
                  </span>
                  <span className="text-slate-400">→</span>
                </Link>
              </li>
            )),
            ...(group.links ?? []).map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-between gap-4 py-3 text-sm transition hover:text-[#4749B6]"
                >
                  <span>
                    <span className="block font-medium text-slate-900">{link.title}</span>
                    <span className="text-xs text-slate-500">{group.title}</span>
                  </span>
                  <span className="text-slate-400">↗</span>
                </a>
              </li>
            )),
          ])}
        </ul>
      </section>
    </>
  );
}
