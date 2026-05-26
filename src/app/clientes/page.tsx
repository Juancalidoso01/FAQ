import type { Metadata } from "next";
import Link from "next/link";
import { CreditProductCard } from "@/components/CreditProductCard";
import { ProductCard } from "@/components/ProductCard";
import { getCreditProducts, getNavGroupById } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para clientes",
  description:
    "Productos de crédito, BCL, recargas y preguntas frecuentes de la app Punto Pago.",
  alternates: { canonical: "/clientes" },
};

export default function ClientesPage() {
  const creditProducts = getCreditProducts();
  const creditSection = getNavGroupById("productos-credito");
  const bcl = getNavGroupById("bcl-pago-con-credito");
  const recarga = getNavGroupById("recarga-billetera");
  const faq = getNavGroupById("preguntas-frecuentes");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para clientes
      </h1>
      <p className="mt-2 text-slate-600">
        Guías oficiales de productos de crédito, préstamo en la app, recargas y soporte.
      </p>

      <section aria-labelledby="creditos-heading" className="mt-8">
        <h2 id="creditos-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Productos de crédito
        </h2>
        {creditSection && (
          <p className="mt-1 text-sm text-slate-600">{creditSection.description}</p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creditProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      <section aria-labelledby="otros-heading" className="mt-10">
        <h2 id="otros-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Otros servicios
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {bcl && <ProductCard product={bcl} />}
          {recarga && <ProductCard product={recarga} />}
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
          <div className="mt-6">
            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {faq.items.map((item) => (
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
        </section>
      )}
    </>
  );
}
