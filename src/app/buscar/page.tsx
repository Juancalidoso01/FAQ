import type { Metadata } from "next";
import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { articlePath, excerpt, searchArticles } from "@/lib/faq";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca respuestas en el centro de ayuda de Punto Pago.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = searchArticles(q);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#0B0B13] sm:text-3xl">
          Buscar en el centro de ayuda
        </h1>
        <p className="mt-2 text-slate-600">
          Escribe tu pregunta para encontrar guías y respuestas.
        </p>
        <div className="mt-6">
          <SearchBox defaultValue={q} large />
        </div>
      </header>

      {q.trim() ? (
        <>
          <p className="mb-4 text-sm text-slate-500">
            {results.length}{" "}
            {results.length === 1 ? "resultado" : "resultados"} para &ldquo;{q}&rdquo;
          </p>
          {results.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white/90 px-4 py-6 text-slate-600">
              No encontramos artículos con ese término. Prueba con otras palabras como
              &ldquo;recarga&rdquo;, &ldquo;Mastercard&rdquo; o &ldquo;pago no reflejado&rdquo;.
            </p>
          ) : (
            <ul className="space-y-3">
              {results.map((article) => (
                <li key={`${article.categorySlug}-${article.slug}`}>
                  <Link
                    href={articlePath(article.categorySlug, article.slug)}
                    className="group block rounded-xl border border-slate-200/80 bg-white/90 px-4 py-4 shadow-sm transition hover:border-[#4749B6]/30 hover:shadow-md"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-[#4749B6]">
                      {article.categoryTitle}
                    </p>
                    <h2 className="mt-1 font-semibold text-[#0B0B13] group-hover:text-[#4749B6]">
                      {article.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600">
                      {excerpt(article.description || article.content, 160)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500">
          Ingresa un término de búsqueda para comenzar.
        </p>
      )}
    </>
  );
}
