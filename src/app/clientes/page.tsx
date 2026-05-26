import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getNavGroupById, getNavSections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para clientes",
  description: "Ayuda sobre tarjeta de crédito, adelantos, línea de crédito, Cuotas débito, BCL y la app Punto Pago.",
  alternates: { canonical: "/clientes" },
};

export default function ClientesPage() {
  const section = getNavSections().find((s) => s.id === "cliente");
  const products = section?.groups.filter((g) => g.id !== "preguntas-frecuentes") ?? [];
  const faq = getNavGroupById("preguntas-frecuentes");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para clientes
      </h1>
      <p className="mt-2 text-slate-600">
        Productos financieros, recargas y soporte de la app para usuarios finales.
      </p>

      <section aria-labelledby="productos-heading" className="mt-8">
        <h2 id="productos-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Productos
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {faq && (
        <section aria-labelledby="faq-heading" className="mt-10">
          <h2 id="faq-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Preguntas frecuentes
          </h2>
          <p className="mt-1 text-sm text-slate-600">{faq.description}</p>
          <div className="mt-4">
            <ProductCard product={faq} variant="highlight" />
          </div>
          <div className="mt-6 space-y-6">
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
