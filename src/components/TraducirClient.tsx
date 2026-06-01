"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArticleContent } from "@/components/ArticleContent";
import { useLang } from "@/components/LanguageProvider";
import { parseArticleContent } from "@/lib/content";

export type ArticleIndexItem = {
  categorySlug: string;
  articleSlug: string;
  title: string;
  categoryTitle: string;
  translated: boolean;
};

type EsData = { title: string; description: string; content: string };

export function TraducirClient({
  index,
  requiresPassword,
}: {
  index: ArticleIndexItem[];
  requiresPassword: boolean;
}) {
  const { enableTeamMode } = useLang();
  useEffect(() => {
    enableTeamMode();
  }, [enableTeamMode]);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ArticleIndexItem | null>(null);
  const [translatedKeys, setTranslatedKeys] = useState<Set<string>>(
    () => new Set(index.filter((i) => i.translated).map((i) => `${i.categorySlug}/${i.articleSlug}`)),
  );

  const [loading, setLoading] = useState(false);
  const [es, setEs] = useState<EsData | null>(null);
  const [ruTitle, setRuTitle] = useState("");
  const [ruDescription, setRuDescription] = useState("");
  const [ruContent, setRuContent] = useState("");

  const [busy, setBusy] = useState<"translate" | "save" | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const [unlocked, setUnlocked] = useState(!requiresPassword);
  const [clave, setClave] = useState("");

  function authHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (requiresPassword && clave) headers["x-redactar-clave"] = clave;
    return headers;
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index;
    return index.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.categoryTitle.toLowerCase().includes(q),
    );
  }, [index, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, ArticleIndexItem[]>();
    for (const item of filtered) {
      const list = map.get(item.categoryTitle) ?? [];
      list.push(item);
      map.set(item.categoryTitle, list);
    }
    return [...map.entries()];
  }, [filtered]);

  const preview = useMemo(() => {
    if (!ruContent.trim()) return null;
    return parseArticleContent(ruContent, ruTitle);
  }, [ruContent, ruTitle]);

  async function selectArticle(item: ArticleIndexItem) {
    setSelected(item);
    setError(null);
    setSaved(false);
    setEs(null);
    setRuTitle("");
    setRuDescription("");
    setRuContent("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/redactar/traducir/articulo?cat=${encodeURIComponent(item.categorySlug)}&slug=${encodeURIComponent(item.articleSlug)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo cargar el artículo.");
      setEs(data.es as EsData);
      if (data.ru) {
        setRuTitle(data.ru.title);
        setRuDescription(data.ru.description);
        setRuContent(data.ru.content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  async function translate() {
    if (!es) return;
    setBusy("translate");
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/redactar/traducir", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          titulo: es.title,
          descripcion: es.description,
          contenidoMarkdown: es.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo traducir.");
      setRuTitle(data.translation.titulo);
      setRuDescription(data.translation.descripcion);
      setRuContent(data.translation.contenidoMarkdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    if (!selected || !ruTitle.trim() || !ruContent.trim()) {
      setError("Faltan el título o el contenido en ruso.");
      return;
    }
    setBusy("save");
    setError(null);
    try {
      const res = await fetch("/api/redactar/traducir/guardar", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          categorySlug: selected.categorySlug,
          articleSlug: selected.articleSlug,
          titulo: ruTitle,
          descripcion: ruDescription,
          contenidoMarkdown: ruContent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar.");
      setSaved(true);
      setTranslatedKeys((prev) =>
        new Set(prev).add(`${selected.categorySlug}/${selected.articleSlug}`),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setBusy(null);
    }
  }

  if (requiresPassword && !unlocked) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="text-xl font-bold text-[#0B0B13]">Traducir guías al ruso</h1>
        <p className="mt-2 text-sm text-slate-600">Ingresa la clave del equipo para continuar.</p>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Clave de acceso"
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setUnlocked(clave.length > 0)}
          className="mt-3 w-full rounded-lg bg-[#4749B6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3b3da6]"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B0B13]">
            Traducir guías al ruso
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Elige una guía, genera la traducción con IA y corrige el texto en ruso antes de
            guardar.
          </p>
        </div>
        <Link
          href="/redactar"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Volver a redactar
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        {/* Lista de artículos */}
        <aside className="lg:sticky lg:top-4 lg:max-h-[80vh] lg:self-start lg:overflow-y-auto">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar guía…"
            className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="space-y-4">
            {grouped.map(([categoryTitle, items]) => (
              <div key={categoryTitle}>
                <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {categoryTitle}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const key = `${item.categorySlug}/${item.articleSlug}`;
                    const isSelected =
                      selected?.categorySlug === item.categorySlug &&
                      selected?.articleSlug === item.articleSlug;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => selectArticle(item)}
                          className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                            isSelected
                              ? "bg-[#4749B6]/10 font-medium text-[#4749B6]"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {translatedKeys.has(key) && (
                            <span
                              className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700"
                              title="Traducida"
                            >
                              RU
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {grouped.length === 0 && (
              <p className="px-1 text-sm text-slate-400">Sin resultados.</p>
            )}
          </div>
        </aside>

        {/* Editor */}
        <section>
          {!selected ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center text-slate-500">
              Elige una guía de la lista para empezar.
            </div>
          ) : loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-16 text-center text-slate-500">
              Cargando…
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={translate}
                  disabled={busy !== null || !es}
                  className="rounded-lg bg-[#4749B6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3b3da6] disabled:opacity-50"
                >
                  {busy === "translate" ? "Traduciendo…" : "Traducir con IA"}
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={busy !== null}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {busy === "save" ? "Guardando…" : "Guardar traducción"}
                </button>
                <label className="ml-auto flex items-center gap-1.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                  />
                  Vista previa
                </label>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {saved && (
                <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Traducción guardada. Se publicará tras el redespliegue de Vercel (~1 min).
                </div>
              )}

              <div className="grid gap-5 lg:grid-cols-2">
                {/* Español (referencia) */}
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Español (original)
                  </h2>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <p className="text-sm font-bold text-[#0B0B13]">{es?.title}</p>
                    {es?.description && (
                      <p className="mt-1 text-sm text-slate-600">{es.description}</p>
                    )}
                    <div className="mt-3 border-t border-slate-200 pt-3">
                      <ArticleContent html={parseArticleContent(es?.content ?? "", es?.title).html} />
                    </div>
                  </div>
                </div>

                {/* Ruso (editable) */}
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#4749B6]">
                    Ruso (editable)
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Título
                      </label>
                      <input
                        value={ruTitle}
                        onChange={(e) => setRuTitle(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Заголовок…"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Descripción
                      </label>
                      <input
                        value={ruDescription}
                        onChange={(e) => setRuDescription(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        placeholder="Описание…"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Contenido (markdown)
                      </label>
                      <textarea
                        value={ruContent}
                        onChange={(e) => setRuContent(e.target.value)}
                        rows={20}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs leading-relaxed"
                        placeholder="Содержание в формате markdown…"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {showPreview && preview && (
                <div className="mt-6">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vista previa en ruso
                  </h2>
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    {ruTitle && (
                      <h3 className="mb-3 text-xl font-bold text-[#0B0B13]">{ruTitle}</h3>
                    )}
                    <ArticleContent html={preview.html} />
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
