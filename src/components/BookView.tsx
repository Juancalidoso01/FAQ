"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArticleContent } from "@/components/ArticleContent";
import { useLang } from "@/components/LanguageProvider";
import { useT } from "@/components/T";

export type BookArticleContent = { title: string; description: string; html: string };
export type BookArticle = {
  id: string;
  href: string;
  es: BookArticleContent;
  ru: BookArticleContent | null;
};
export type BookChapter = {
  id: string;
  title: string;
  description: string;
  articles: BookArticle[];
};
export type BookPart = {
  id: "cliente" | "empresa";
  title: string;
  chapters: BookChapter[];
};

function pick(article: BookArticle, ru: boolean): BookArticleContent {
  return ru && article.ru ? article.ru : article.es;
}

export function BookView({
  siteName,
  parts,
  totalArticles,
  generatedAt,
}: {
  siteName: string;
  parts: BookPart[];
  totalArticles: number;
  generatedAt: string;
}) {
  const { lang, setLang } = useLang();
  const t = useT();
  const ru = lang === "ru";

  const dateLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(ru ? "ru-RU" : "es-PA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(generatedAt));
    } catch {
      return generatedAt.slice(0, 10);
    }
  }, [generatedAt, ru]);

  function buildHtmlDocument(): string {
    const styles = `
      *{box-sizing:border-box}
      body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B0B13;max-width:46rem;margin:0 auto;padding:2.5rem 1.5rem;line-height:1.6}
      h1{font-size:2rem;margin:0 0 .25rem}
      h2{font-size:1.5rem;margin:2.5rem 0 .5rem;border-top:2px solid #4749B6;padding-top:1rem}
      h3{font-size:1.2rem;margin:1.75rem 0 .35rem}
      h4{font-size:1.02rem;margin:1.5rem 0 .25rem;color:#4749B6}
      p{margin:.6rem 0}
      ul{margin:.6rem 0;padding-left:1.25rem}
      a{color:#4749B6}
      table{border-collapse:collapse;width:100%;margin:1rem 0}
      th,td{border:1px solid #e2e8f0;padding:.5rem .65rem;text-align:left;font-size:.92rem}
      th{background:#f1f5f9}
      hr{border:0;border-top:1px solid #e2e8f0;margin:1.5rem 0}
      .cover{text-align:center;padding:4rem 0 3rem;border-bottom:1px solid #e2e8f0;margin-bottom:2rem}
      .muted{color:#64748b;font-size:.9rem}
      .toc a{display:block;text-decoration:none;color:#0B0B13;padding:.15rem 0}
      .toc .chap{font-weight:700;margin-top:.75rem}
      .art{margin:1.75rem 0;padding-bottom:1rem;border-bottom:1px solid #eef2f7}
      .art p.lead{color:#475569}
    `;
    const esc = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const head = `<!doctype html><html lang="${ru ? "ru" : "es"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(siteName)}</title><style>${styles}</style></head><body>`;

    const cover = `<div class="cover"><h1>${esc(siteName)}</h1><p class="muted">${esc(t("Guía completa"))} · ${esc(dateLabel)}</p></div>`;

    const toc = [
      `<h2>${esc(t("Índice"))}</h2><div class="toc">`,
      ...parts.flatMap((part) => [
        `<p class="chap">${esc(t(part.title))}</p>`,
        ...part.chapters.map(
          (c) => `<a href="#${c.id}">${esc(t(c.title))}</a>`,
        ),
      ]),
      `</div>`,
    ].join("");

    const body = parts
      .map((part) => {
        const chaptersHtml = part.chapters
          .map((chapter) => {
            const arts = chapter.articles
              .map((article) => {
                const c = pick(article, ru);
                const lead = c.description
                  ? `<p class="lead">${esc(c.description)}</p>`
                  : "";
                return `<div class="art" id="${article.id}"><h4>${esc(c.title)}</h4>${lead}${c.html}</div>`;
              })
              .join("");
            return `<h3 id="${chapter.id}">${esc(t(chapter.title))}</h3>${arts}`;
          })
          .join("");
        return `<h2>${esc(t(part.title))}</h2>${chaptersHtml}`;
      })
      .join("");

    return `${head}${cover}${toc}${body}</body></html>`;
  }

  function downloadHtml() {
    const html = buildHtmlDocument();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `centro-ayuda-punto-pago-${ru ? "ru" : "es"}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="book-page">
      <div className="book-toolbar no-print">
        <div className="book-toolbar__left">
          <Link href="/" className="book-back">
            {t("← Volver al inicio")}
          </Link>
        </div>
        <div className="book-toolbar__right">
          <div className="book-lang" role="group" aria-label={t("Idioma")}>
            <button
              type="button"
              onClick={() => setLang("es")}
              className={!ru ? "is-active" : ""}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLang("ru")}
              className={ru ? "is-active" : ""}
            >
              RU
            </button>
          </div>
          <button type="button" onClick={downloadHtml} className="book-btn book-btn--ghost">
            {t("Descargar HTML")}
          </button>
          <button type="button" onClick={() => window.print()} className="book-btn">
            {t("Imprimir / Guardar PDF")}
          </button>
        </div>
      </div>

      <article className="book-content">
        <header className="book-cover">
          <p className="book-cover__eyebrow">{t("Centro de ayuda")}</p>
          <h1 className="book-cover__title">{siteName}</h1>
          <p className="book-cover__subtitle">{t("Guía completa")}</p>
          <p className="book-cover__meta">
            {totalArticles} {t("guías")} · {dateLabel}
          </p>
          {ru && (
            <p className="book-cover__note">
              {t("Las guías sin traducción se muestran en español.")}
            </p>
          )}
        </header>

        <nav className="book-toc" aria-label={t("Índice")}>
          <h2>{t("Índice")}</h2>
          {parts.map((part) => (
            <div key={part.id} className="book-toc__part">
              <p className="book-toc__part-title">{t(part.title)}</p>
              <ul>
                {part.chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <a href={`#${chapter.id}`}>{t(chapter.title)}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {parts.map((part) => (
          <section key={part.id} className="book-part">
            <h2 className="book-part__title">{t(part.title)}</h2>
            {part.chapters.map((chapter) => (
              <section key={chapter.id} id={chapter.id} className="book-chapter">
                <h3 className="book-chapter__title">{t(chapter.title)}</h3>
                {chapter.articles.map((article) => {
                  const c = pick(article, ru);
                  return (
                    <section key={article.id} id={article.id} className="book-article-block">
                      <h4 className="book-article-block__title">{c.title}</h4>
                      {c.description && (
                        <p className="book-article-block__lead">{c.description}</p>
                      )}
                      <ArticleContent html={c.html} />
                    </section>
                  );
                })}
              </section>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
