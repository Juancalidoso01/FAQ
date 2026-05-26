import type { Metadata } from "next";
import Link from "next/link";
import { CreditProductCard } from "@/components/CreditProductCard";
import { ProductCard } from "@/components/ProductCard";
import { getCreditProducts, getNavGroupById, getDebitProducts, getMarketplaceProducts, getRemesasProducts } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para clientes",
  description:
    "Productos de crédito, débito, Marketplace, remesas internacionales, recargas y preguntas frecuentes de la app Punto Pago.",
  alternates: { canonical: "/clientes" },
};

export default function ClientesPage() {
  const creditProducts = getCreditProducts();
  const debitProducts = getDebitProducts();
  const marketplaceProducts = getMarketplaceProducts();
  const remesasProducts = getRemesasProducts();
  const creditSection = getNavGroupById("productos-credito");
  const debitoSection = getNavGroupById("productos-debito");
  const marketplaceSection = getNavGroupById("marketplace");
  const remesasSection = getNavGroupById("remesas-internacionales");
  const recarga = getNavGroupById("recarga-billetera");
  const faq = getNavGroupById("preguntas-frecuentes");

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para clientes
      </h1>
      <p className="mt-2 text-slate-600">
        Guías de crédito, débito, Marketplace, remesas y soporte de la app.
      </p>

      <section id="creditos" aria-labelledby="creditos-heading" className="mt-8 scroll-mt-8">
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

      <section id="debito" aria-labelledby="debito-heading" className="mt-10 scroll-mt-8">
        <h2 id="debito-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Productos débito
        </h2>
        {debitoSection && (
          <p className="mt-1 text-sm text-slate-600">{debitoSection.description}</p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {debitProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      <section id="marketplace" aria-labelledby="marketplace-heading" className="mt-10 scroll-mt-8">
        <h2 id="marketplace-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Marketplace
        </h2>
        {marketplaceSection && (
          <p className="mt-1 text-sm text-slate-600">{marketplaceSection.description}</p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {marketplaceProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      <section id="remesas" aria-labelledby="remesas-heading" className="mt-10 scroll-mt-8">
        <h2 id="remesas-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Remesas internacionales
        </h2>
        {remesasSection && (
          <p className="mt-1 text-sm text-slate-600">{remesasSection.description}</p>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {remesasProducts.map((product) => (
            <CreditProductCard key={product.href} product={product} />
          ))}
        </div>
      </section>

      {recarga && (
        <section aria-labelledby="otros-heading" className="mt-10">
          <h2 id="otros-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recarga y billetera
          </h2>
          <div className="mt-4">
            <ProductCard product={recarga} />
          </div>
        </section>
      )}

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
