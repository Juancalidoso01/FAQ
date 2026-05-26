import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-[#0B0B13]">Página no encontrada</h1>
      <p className="mt-3 text-slate-600">
        El artículo o categoría que buscas no existe o fue movido.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-xl bg-[#4749B6] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#3B3DA6]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
