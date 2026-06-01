"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArticleContent } from "@/components/ArticleContent";
import { useLang } from "@/components/LanguageProvider";
import { parseArticleContent } from "@/lib/content";
import type { Lang } from "@/lib/translations";

export type ArticleIndexItem = {
  categorySlug: string;
  articleSlug: string;
  title: string;
  categoryTitle: string;
  originalLang: Lang;
  targetLang: Lang;
  translated: boolean;
};

type SourceData = { title: string; description: string; content: string };

const LANG_LABEL: Record<Lang, string> = { es: "Español", ru: "Русский" };

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
  const [source, setSource] = useState<SourceData | null>(null);
  const [targetTitle, setTargetTitle] = useState("");
  const [targetDescription, setTargetDescription] = useState("");
  const [targetContent, setTargetContent] = useState("");

  const [busy, setBusy] = useState<"translate" | "save" | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [batch, setBatch] = useState<{
    running: boolean;
    translated: number;
    total: number | null;
    failed: number;
  } | null>(null);

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
    if (!targetContent.trim()) return null;
    return parseArticleContent(targetContent, targetTitle);
  }, [targetContent, targetTitle]);

  async function selectArticle(item: ArticleIndexItem) {
    setSelected(item);
    setError(null);
    setSaved(false);
    setSource(null);
    setTargetTitle("");
    setTargetDescription("");
    setTargetContent("");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/redactar/traducir/articulo?cat=${encodeURIComponent(item.categorySlug)}&slug=${encodeURIComponent(item.articleSlug)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo cargar el artículo.");
      setSource(data.original as SourceData);
      const target = data[item.targetLang] as SourceData | null;
      if (target) {
        setTargetTitle(target.title);
        setTargetDescription(target.description);
        setTargetContent(target.content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  async function translate() {
    if (!source || !selected) return;
    setBusy("translate");
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/redactar/traducir", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          from: selected.originalLang,
          to: selected.targetLang,
          titulo: source.title,
          descripcion: source.description,
          contenidoMarkdown: source.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo traducir.");
      setTargetTitle(data.translation.titulo);
      setTargetDescription(data.translation.descripcion);
      setTargetContent(data.translation.contenidoMarkdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    if (!selected || !targetTitle.trim() || !targetContent.trim()) {
      setError("Faltan el título o el contenido a guardar.");
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
          lang: selected.targetLang,
          titulo: targetTitle,
          descripcion: targetDescription,
          contenidoMarkdown: targetContent,
          sourceTitle: source?.title ?? "",
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

  async function translateAll() {
    setError(null);
    setBatch({ running: true, translated: 0, total: null, failed: 0 });
    let skip: string[] = [];
    let translated = 0;
    let total: number | null = null;
    try {
      // Bucle por tandas hasta que no queden guías pendientes.
      for (let guard = 0; guard < 200; guard += 1) {
        const res = await fetch("/api/redactar/traducir/todo", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ skip, limit: 4 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "No se pudo traducir el lote.");
        translated += data.processed as number;
        if (total === null) total = (data.remaining as number) + (data.processed as number);
        if (Array.isArray(data.failed) && data.failed.length > 0) {
          skip = [...skip, ...(data.failed as string[])];
        }
        setBatch({ running: true, translated, total, failed: skip.length });
        if (data.done || (data.processed === 0 && (data.failed?.length ?? 0) === 0)) break;
      }
      // Marca como traducidas todas menos las que fallaron.
      const allKeys = new Set(index.map((i) => `${i.categorySlug}/${i.articleSlug}`));
      skip.forEach((k) => allKeys.delete(k));
      setTranslatedKeys(allKeys);
      setBatch((b) => (b ? { ...b, running: false } : b));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
      setBatch((b) => (b ? { ...b, running: false } : b));
    }
  }

  if (requiresPassword && !unlocked) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="text-xl font-bold text-[#0B0B13]">Revisar traducciones</h1>
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

  const targetLabel = selected ? LANG_LABEL[selected.targetLang] : "";
  const sourceLabel = selected ? LANG_LABEL[selected.originalLang] : "";

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B0B13]">
            Revisar traducciones
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Elige una guía, genera la traducción con IA y corrige el texto antes de guardar. Cada
            guía se traduce al idioma contrario al que se redactó.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={translateAll}
            disabled={batch?.running}
            className="rounded-lg bg-[#4749B6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3b3da6] disabled:opacity-50"
          >
            {batch?.running ? "Traduciendo todo…" : "Traducir todo lo que falta"}
          </button>
          <Link
            href="/redactar"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Volver
          </Link>
        </div>
      </header>

      {batch && (
        <div className="mb-5 rounded-xl border border-[#4749B6]/20 bg-[#4749B6]/[0.04] px-4 py-3 text-sm">
          {batch.running ? (
            <div>
              <p className="font-medium text-[#0B0B13]">
                Traduciendo todas las guías pendientes…{" "}
                {batch.total !== null && (
                  <span className="text-slate-600">
                    {batch.translated} de {batch.total}
                  </span>
                )}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#4749B6] transition-all"
                  style={{
                    width:
                      batch.total && batch.total > 0
                        ? `${Math.round((batch.translated / batch.total) * 100)}%`
                        : "10%",
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                No cierres esta página. Puede tardar varios minutos según la cantidad de guías.
              </p>
            </div>
          ) : (
            <p className="text-emerald-800">
              Listo: se tradujeron {batch.translated} guías.{" "}
              {batch.failed > 0 && (
                <span className="text-amber-700">
                  {batch.failed} no se pudieron traducir; puedes reintentar.
                </span>
              )}{" "}
              Los cambios se publican tras el redespliegue de Vercel (~1 min).
            </p>
          )}
        </div>
      )}

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
                          <span className="flex min-w-0 items-center gap-1.5">
                            {item.originalLang === "ru" && (
                              <span
                                className="shrink-0 rounded bg-sky-100 px-1 py-0.5 text-[9px] font-bold text-sky-700"
                                title="Redactada en ruso"
                              >
                                RU→ES
                              </span>
                            )}
                            <span className="truncate">{item.title}</span>
                          </span>
                          {translatedKeys.has(key) && (
                            <span
                              className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700"
                              title="Traducida"
                            >
                              ✓
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
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {sourceLabel} → {targetLabel}
                </span>
                <button
                  type="button"
                  onClick={translate}
                  disabled={busy !== null || !source}
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
                {/* Original (referencia) */}
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {sourceLabel} (original)
                  </h2>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <p className="text-sm font-bold text-[#0B0B13]">{source?.title}</p>
                    {source?.description && (
                      <p className="mt-1 text-sm text-slate-600">{source.description}</p>
                    )}
                    <div className="mt-3 border-t border-slate-200 pt-3">
                      <ArticleContent
                        html={parseArticleContent(source?.content ?? "", source?.title).html}
                      />
                    </div>
                  </div>
                </div>

                {/* Target (editable) */}
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#4749B6]">
                    {targetLabel} (editable)
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Título
                      </label>
                      <input
                        value={targetTitle}
                        onChange={(e) => setTargetTitle(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Descripción
                      </label>
                      <input
                        value={targetDescription}
                        onChange={(e) => setTargetDescription(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">
                        Contenido (markdown)
                      </label>
                      <textarea
                        value={targetContent}
                        onChange={(e) => setTargetContent(e.target.value)}
                        rows={20}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {showPreview && preview && (
                <div className="mt-6">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Vista previa ({targetLabel})
                  </h2>
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    {targetTitle && (
                      <h3 className="mb-3 text-xl font-bold text-[#0B0B13]">{targetTitle}</h3>
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
