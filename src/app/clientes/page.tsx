import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getNavSections } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Para clientes",
  description: "Ayuda sobre tarjeta de crédito, adelantos, línea de crédito, cuotas y la app Punto Pago.",
  alternates: { canonical: "/clientes" },
};

export default function ClientesPage() {
  const section = getNavSections().find((s) => s.id === "cliente");
  const groups = section?.groups ?? [];

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Punto Pago para clientes
      </h1>
      <p className="mt-2 text-slate-600">
        Productos financieros, recargas y soporte de la app para usuarios finales.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <ProductCard key={group.id} product={group} />
        ))}
      </div>

      {groups.some((g) => g.items.length > 0) && (
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Todas las guías
          </h2>
          <ul className="mt-4 divide-y divide-slate-200">
            {groups.flatMap((group) =>
              group.items.map((item) => (
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
            )}
          </ul>
        </section>
      )}
    </>
  );
}
