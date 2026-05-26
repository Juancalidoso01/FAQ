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
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Buscar
        </h1>
        <div className="mt-4">
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
            <p className="text-slate-600">
              No encontramos artículos con ese término. Prueba con otras palabras como
              &ldquo;recarga&rdquo;, &ldquo;Mastercard&rdquo; o &ldquo;pago no reflejado&rdquo;.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 border-y border-slate-200">
              {results.map((article) => (
                <li key={`${article.categorySlug}-${article.slug}`}>
                  <Link
                    href={articlePath(article.categorySlug, article.slug)}
                    className="block py-4 transition hover:bg-slate-50"
                  >
                    <p className="text-xs font-medium text-slate-500">{article.categoryTitle}</p>
                    <h2 className="mt-0.5 font-medium text-[#4749B6]">{article.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {excerpt(article.description || article.content, 160)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500">Ingresa un término de búsqueda para comenzar.</p>
      )}
    </>
  );
}
