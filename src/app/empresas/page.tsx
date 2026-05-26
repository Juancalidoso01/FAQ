import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getNavGroupById, getNavSections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para empresas",
  description:
    "Ayuda para comercios: Cuotas BNPL, kioscos, agente corresponsal y servicios corporativos Punto Pago.",
  alternates: { canonical: "/empresas" },
};

export default function EmpresasPage() {
  const section = getNavSections().find((s) => s.id === "empresa");
  const products = section?.groups.filter((g) => !["faq-empresas"].includes(g.id)) ?? [];
  const faq = getNavGroupById("faq-empresas");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para empresas
      </h1>
      <p className="mt-2 text-slate-600">
        Soluciones para comercios, corresponsales y empresas — las mismas líneas del formulario de
        afiliación.
      </p>

      <section aria-labelledby="productos-heading" className="mt-8">
        <h2 id="productos-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Líneas de negocio
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {faq && faq.items.length > 0 && (
        <section aria-labelledby="faq-heading" className="mt-10">
          <h2 id="faq-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Preguntas frecuentes
          </h2>
          <div className="mt-4 space-y-6">
            {faq.subgroups.map((subgroup) => (
              <div key={subgroup.id}>
                <h3 className="text-sm font-semibold text-slate-900">{subgroup.title}</h3>
                <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
                  {subgroup.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block py-3 text-sm font-medium text-[#4749B6] hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
