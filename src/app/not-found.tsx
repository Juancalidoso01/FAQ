import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-8 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Página no encontrada</h1>
      <p className="mt-3 text-slate-600">
        El artículo o categoría que buscas no existe o fue movido.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex text-sm font-medium text-[#4749B6] underline-offset-2 hover:underline"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
