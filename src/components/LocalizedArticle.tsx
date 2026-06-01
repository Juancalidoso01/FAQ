"use client";

import { useMemo, useState } from "react";
import { ArticleContent } from "@/components/ArticleContent";
import { ArticleToc } from "@/components/ArticleToc";
import { useLang } from "@/components/LanguageProvider";
import { RemesasCalculator } from "@/components/RemesasCalculator";
import { useT } from "@/components/T";
import { parseArticleContent, type ArticleHeading } from "@/lib/content";

type Rendered = {
  title: string;
  description: string;
  html: string;
  headings: ArticleHeading[];
  readingMinutes: number;
};

export type LocalizedArticleProps = {
  categorySlug: string;
  articleSlug: string;
  eyebrow: string | null;
  updatedAt: string | null;
  showLead: boolean;
  isRemesas: boolean;
  /** Versión en español (fuente, ya renderizada). */
  es: Rendered;
  /** Markdown fuente en español, para pedir la traducción a la IA. */
  esSource: { title: string; description: string; content: string };
  /** Traducción al ruso ya guardada y renderizada (si existe). */
  ru: Rendered | null;
};

export function LocalizedArticle({
  categorySlug,
  articleSlug,
  eyebrow,
  updatedAt,
  showLead,
  isRemesas,
  es,
  esSource,
  ru,
}: LocalizedArticleProps) {
  const { lang, teamMode } = useLang();
  const t = useT();

  const [draft, setDraft] = useState<{ rendered: Rendered; markdown: string } | null>(null);
  const [busy, setBusy] = useState<"translate" | "save" | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showRu = lang === "ru";
  const effectiveRu: Rendered | null = draft?.rendered ?? ru;
  const active = showRu && effectiveRu ? effectiveRu : es;

  const dateText = useMemo(() => {
    if (!updatedAt) return null;
    try {
      return new Date(updatedAt).toLocaleDateString(showRu ? "ru-RU" : "es-PA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return null;
    }
  }, [updatedAt, showRu]);

  async function translate() {
    setBusy("translate");
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/redactar/traducir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: esSource.title,
          descripcion: esSource.description,
          contenidoMarkdown: esSource.content,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo traducir.");
      const tr = data.translation as { titulo: string; descripcion: string; contenidoMarkdown: string };
      const parsedRu = parseArticleContent(tr.contenidoMarkdown, tr.titulo);
      setDraft({
        rendered: {
          title: tr.titulo,
          description: tr.descripcion,
          html: parsedRu.html,
          headings: parsedRu.headings,
          readingMinutes: parsedRu.readingMinutes,
        },
        markdown: tr.contenidoMarkdown,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    if (!draft) return;
    setBusy("save");
    setError(null);
    try {
      const res = await fetch("/api/redactar/traducir/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug,
          articleSlug,
          titulo: draft.rendered.title,
          descripcion: draft.rendered.description,
          contenidoMarkdown: draft.markdown,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar.");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <article itemScope itemType="https://schema.org/Article">
        <header className="mb-8 border-b border-slate-200 pb-6">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#4749B6]">
              {t(eyebrow)}
            </p>
          )}
          <h1
            itemProp="headline"
            className="text-2xl font-bold tracking-tight text-[#0B0B13] sm:text-3xl"
          >
            {active.title}
          </h1>
          {showLead && active.description && (
            <p className="mt-3 text-base leading-relaxed text-slate-600">{active.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                className="h-4 w-4"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6l4 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {active.readingMinutes} {t("min de lectura")}
            </span>
            {dateText && (
              <>
                <span aria-hidden className="text-slate-300">
                  ·
                </span>
                <span>
                  {t("Actualizado:")}{" "}
                  <time itemProp="dateModified" dateTime={updatedAt ?? undefined}>
                    {dateText}
                  </time>
                </span>
              </>
            )}
          </div>
        </header>

        {showRu && <TranslationBanner
          hasTranslation={Boolean(effectiveRu)}
          isDraft={Boolean(draft)}
          teamMode={teamMode}
          busy={busy}
          saved={saved}
          error={error}
          onTranslate={translate}
          onSave={save}
          onDiscard={() => {
            setDraft(null);
            setSaved(false);
            setError(null);
          }}
        />}

        {isRemesas && <RemesasCalculator />}

        <ArticleToc key={showRu ? "ru" : "es"} headings={active.headings} />

        <div itemProp="articleBody">
          <ArticleContent html={active.html} />
        </div>
      </article>
    </>
  );
}

function TranslationBanner({
  hasTranslation,
  isDraft,
  teamMode,
  busy,
  saved,
  error,
  onTranslate,
  onSave,
  onDiscard,
}: {
  hasTranslation: boolean;
  isDraft: boolean;
  teamMode: boolean;
  busy: "translate" | "save" | null;
  saved: boolean;
  error: string | null;
  onTranslate: () => void;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const t = useT();

  const message = hasTranslation
    ? isDraft
      ? t("Mostrando borrador sin guardar.")
      : t("Traducción automática generada con IA. Revísala antes de confiar en ella.")
    : t("Este artículo aún no está traducido al ruso. Se muestra en español.");

  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden>🤖</span>
          {message}
        </span>
        {teamMode && (
          <div className="flex flex-wrap items-center gap-2">
            {!hasTranslation && (
              <button
                type="button"
                onClick={onTranslate}
                disabled={busy !== null}
                className="rounded-lg bg-[#4749B6] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3b3da6] disabled:opacity-50"
              >
                {busy === "translate" ? t("Traduciendo…") : t("Traducir con IA")}
              </button>
            )}
            {hasTranslation && (
              <button
                type="button"
                onClick={onTranslate}
                disabled={busy !== null}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
              >
                {busy === "translate" ? t("Traduciendo…") : t("Regenerar")}
              </button>
            )}
            {isDraft && (
              <>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={busy !== null}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {busy === "save" ? t("Guardando…") : t("Guardar traducción")}
                </button>
                <button
                  type="button"
                  onClick={onDiscard}
                  disabled={busy !== null}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-900 underline hover:text-amber-700 disabled:opacity-50"
                >
                  {t("Descartar")}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {saved && (
        <p className="mt-2 text-xs text-emerald-700">
          {t("Traducción guardada. Se publicará tras el redespliegue.")}
        </p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
