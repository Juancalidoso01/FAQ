"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArticleContent } from "@/components/ArticleContent";
import { parseArticleContent } from "@/lib/content";

type TaxonomyItem = { slug: string; title: string; audience: string };

type Draft = {
  titulo: string;
  descripcion: string;
  contenidoMarkdown: string;
  slugSugerido: string;
  audiencia: "cliente" | "empresa" | "general";
  esNuevaCategoria: boolean;
  categoriaSlug: string;
  categoriaNuevaTitulo: string;
  posibleDuplicado: { existe: boolean; articuloSlug: string; motivo: string };
};

const NEW_CATEGORY = "__nueva__";

const audienceLabel: Record<string, string> = {
  cliente: "Clientes",
  empresa: "Empresas",
  general: "General",
};

export function RedactarClient({
  taxonomy,
  requiresPassword,
}: {
  taxonomy: TaxonomyItem[];
  requiresPassword: boolean;
}) {
  const [texto, setTexto] = useState("");
  const [structuring, setStructuring] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [published, setPublished] = useState<{ path: string } | null>(null);
  const [clave, setClave] = useState("");
  const [unlocked, setUnlocked] = useState(!requiresPassword);

  function authHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (requiresPassword && clave) headers["x-redactar-clave"] = clave;
    return headers;
  }

  const groupedTaxonomy = useMemo(() => {
    const groups: Record<string, TaxonomyItem[]> = {};
    for (const item of taxonomy) {
      (groups[item.audience] ??= []).push(item);
    }
    return groups;
  }, [taxonomy]);

  const preview = useMemo(() => {
    if (!draft) return null;
    return parseArticleContent(draft.contenidoMarkdown, draft.titulo);
  }, [draft]);

  const categorySelectValue = draft
    ? draft.esNuevaCategoria
      ? NEW_CATEGORY
      : draft.categoriaSlug
    : "";

  async function handleStructure() {
    setError(null);
    setStructuring(true);
    setPublished(null);
    try {
      const res = await fetch("/api/redactar/estructurar", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ texto }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo procesar el texto.");
      setDraft(data.draft as Draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setStructuring(false);
    }
  }

  async function handlePublish() {
    if (!draft) return;
    setError(null);
    setPublishing(true);
    try {
      const res = await fetch("/api/redactar/publicar", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          titulo: draft.titulo,
          descripcion: draft.descripcion,
          contenidoMarkdown: draft.contenidoMarkdown,
          slug: draft.slugSugerido,
          esNuevaCategoria: draft.esNuevaCategoria,
          categoriaSlug: draft.categoriaSlug,
          categoriaNuevaTitulo: draft.categoriaNuevaTitulo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo publicar.");
      setPublished({ path: data.path });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setPublishing(false);
    }
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function reset() {
    setDraft(null);
    setPublished(null);
    setError(null);
    setTexto("");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4749B6]">
          Herramienta del equipo
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0B0B13] sm:text-3xl">
          Redactar una guía con IA
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Pega aquí lo que sabes (una pregunta frecuente, una respuesta que das por teléfono o tus
          notas) y la IA lo convierte en una guía ordenada y la ubica en el tema correcto. Revisa el
          resultado antes de publicar.
        </p>
      </header>

      {requiresPassword && !unlocked ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="clave" className="text-sm font-semibold text-[#0B0B13]">
            Clave de acceso del equipo
          </label>
          <input
            id="clave"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && clave.trim()) setUnlocked(true);
            }}
            className="mt-2 w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4749B6]"
          />
          <div className="mt-4">
            <button
              type="button"
              onClick={() => clave.trim() && setUnlocked(true)}
              className="rounded-full bg-[#4749B6] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3b3da6]"
            >
              Entrar
            </button>
          </div>
        </div>
      ) : published ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-lg font-bold text-emerald-900">¡Guía publicada!</h2>
          <p className="mt-2 text-sm text-emerald-800">
            La guía se guardó y se está publicando. En 1–2 minutos estará disponible en línea.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={published.path}
              className="rounded-full bg-[#4749B6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b3da6]"
            >
              Ver la guía
            </Link>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#4749B6] hover:text-[#4749B6]"
            >
              Redactar otra
            </button>
          </div>
        </div>
      ) : !draft ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="texto" className="text-sm font-semibold text-[#0B0B13]">
            Información a convertir en guía
          </label>
          <textarea
            id="texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={10}
            placeholder="Ej: Cuando el cliente pregunta cómo recuperar su PIN, debe entrar a la app, ir a Tarjetas, seleccionar la tarjeta y tocar 'Ver PIN'. Necesita tener la app actualizada..."
            className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm leading-relaxed text-slate-800 outline-none focus:border-[#4749B6] focus:ring-2 focus:ring-[#4749B6]/20"
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleStructure}
            disabled={structuring || texto.trim().length < 15}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4749B6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3b3da6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {structuring ? "Estructurando con IA…" : "Estructurar con IA"}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Revisar y editar
            </h2>

            {draft.posibleDuplicado.existe && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <strong>Posible duplicado:</strong> {draft.posibleDuplicado.motivo || "Revisa si ya existe una guía similar."}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">Título</label>
                <input
                  value={draft.titulo}
                  onChange={(e) => updateDraft({ titulo: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4749B6]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">
                  Resumen ({draft.descripcion.length}/160)
                </label>
                <textarea
                  value={draft.descripcion}
                  onChange={(e) => updateDraft({ descripcion: e.target.value.slice(0, 200) })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4749B6]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Tema / categoría</label>
                <select
                  value={categorySelectValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === NEW_CATEGORY) {
                      updateDraft({ esNuevaCategoria: true });
                    } else {
                      updateDraft({ esNuevaCategoria: false, categoriaSlug: value });
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4749B6]"
                >
                  {Object.entries(groupedTaxonomy).map(([audience, items]) => (
                    <optgroup key={audience} label={audienceLabel[audience] ?? audience}>
                      {items.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <option value={NEW_CATEGORY}>➕ Crear tema nuevo…</option>
                </select>
              </div>

              {draft.esNuevaCategoria && (
                <div>
                  <label className="text-xs font-semibold text-slate-600">Nombre del tema nuevo</label>
                  <input
                    value={draft.categoriaNuevaTitulo}
                    onChange={(e) => updateDraft({ categoriaNuevaTitulo: e.target.value })}
                    placeholder="Ej: Pagos con QR"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#4749B6]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-600">Contenido (markdown)</label>
                <textarea
                  value={draft.contenidoMarkdown}
                  onChange={(e) => updateDraft({ contenidoMarkdown: e.target.value })}
                  rows={16}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-[#4749B6]"
                />
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing || !draft.titulo.trim() || !draft.contenidoMarkdown.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-[#4749B6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3b3da6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishing ? "Publicando…" : "Publicar guía"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
              >
                Empezar de nuevo
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Vista previa
            </h2>
            <h3 className="text-xl font-bold tracking-tight text-[#0B0B13]">{draft.titulo}</h3>
            {draft.descripcion && (
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{draft.descripcion}</p>
            )}
            <div className="mt-4 border-t border-slate-200 pt-4">
              {preview && <ArticleContent html={preview.html} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
