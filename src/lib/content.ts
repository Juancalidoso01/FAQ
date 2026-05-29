export type ArticleHeading = { id: string; text: string; level: 2 | 3 };

export type ParsedArticle = {
  html: string;
  headings: ArticleHeading[];
  readingMinutes: number;
};

/** Convierte texto a un slug apto para anclas (#id). */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Devuelve solo el texto plano (sin etiquetas ni markdown) de un encabezado. */
function plainText(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Elimina el primer encabezado del contenido cuando duplica el título del
 * artículo (que ya se muestra como <h1> en la página).
 */
function stripDuplicateTitle(raw: string, title?: string): string {
  if (!title) return raw;
  const lines = raw.split("\n");
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i += 1;
  if (i >= lines.length) return raw;
  const match = lines[i].trim().match(/^#{1,3}\s+(.*)$/);
  if (match && slugify(plainText(match[1])) === slugify(title)) {
    lines.splice(0, i + 1);
    while (lines.length && !lines[0].trim()) lines.shift();
    return lines.join("\n");
  }
  return raw;
}

/** Convierte contenido importado de Intercom (HTML inline + markdown simple) a HTML seguro. */
export function renderArticleContent(raw: string, title?: string): string {
  return parseArticleContent(raw, title).html;
}

/**
 * Procesa el contenido del artículo y devuelve el HTML seguro, la lista de
 * encabezados (para la tabla de contenido) y el tiempo de lectura estimado.
 */
export function parseArticleContent(raw: string, title?: string): ParsedArticle {
  const source = stripDuplicateTitle(raw, title);
  const lines = source.split("\n");
  const html: string[] = [];
  const headings: ArticleHeading[] = [];
  const usedIds = new Set<string>();
  let inList = false;
  let index = 0;

  const makeId = (text: string) => {
    const base = slugify(text) || "seccion";
    let id = base;
    let n = 2;
    while (usedIds.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    usedIds.add(id);
    return id;
  };

  const pushHeading = (rawText: string, level: 2 | 3) => {
    const text = plainText(rawText);
    const id = makeId(text);
    headings.push({ id, text, level });
    html.push(`<h${level} id="${id}">${inlineHtml(rawText)}</h${level}>`);
  };

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  const isTableRow = (line: string) => line.includes("|") && line.trim().startsWith("|");
  const isTableSeparator = (line: string) =>
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      index += 1;
      continue;
    }

    if (
      isTableRow(trimmed) &&
      index + 1 < lines.length &&
      isTableSeparator(lines[index + 1].trim())
    ) {
      closeList();
      const tableLines: string[] = [trimmed];
      index += 2;
      while (index < lines.length && isTableRow(lines[index].trim())) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      html.push(renderMarkdownTable(tableLines));
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      pushHeading(trimmed.slice(4), 3);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      pushHeading(trimmed.slice(3), 2);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      closeList();
      pushHeading(trimmed.slice(2), 2);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineHtml(trimmed.slice(2))}</li>`);
      index += 1;
      continue;
    }

    const linkMatch = trimmed.match(/^\[(.+?)\]\((.+?)\)$/);
    if (linkMatch) {
      closeList();
      const [, label, href] = linkMatch;
      const safeHref = sanitizeHref(href);
      if (safeHref) {
        html.push(
          `<p><a href="${safeHref}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></p>`,
        );
      }
      index += 1;
      continue;
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imageMatch) {
      closeList();
      const [, alt, href] = imageMatch;
      const safeHref = sanitizeHref(href);
      if (safeHref) {
        html.push(
          `<figure class="faq-figure"><img src="${safeHref}" alt="${escapeHtml(alt || "Imagen")}" loading="lazy" decoding="async" /></figure>`,
        );
      }
      index += 1;
      continue;
    }

    if (trimmed === "---") {
      closeList();
      html.push("<hr />");
      index += 1;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      closeList();
      html.push(`<blockquote><p>${inlineHtml(trimmed.slice(2))}</p></blockquote>`);
      index += 1;
      continue;
    }

    closeList();
    html.push(`<p>${inlineHtml(trimmed)}</p>`);
    index += 1;
  }

  closeList();

  const words = plainText(source).split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));

  return { html: html.join("\n"), headings, readingMinutes };
}

function renderMarkdownTable(rows: string[]): string {
  const parsed = rows.map((row) =>
    row
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => inlineHtml(cell.trim())),
  );

  if (parsed.length === 0) return "";

  const [head, ...body] = parsed;
  const headHtml = head.map((cell) => `<th>${cell}</th>`).join("");
  const bodyHtml = body
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("");

  return `<div class="faq-table-wrap"><table class="faq-table"><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

function inlineHtml(text: string): string {
  const chunks: string[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(text)) !== null) {
    chunks.push(escapeHtml(text.slice(lastIndex, match.index)));
    const safe = sanitizeHref(match[2]);
    if (safe) {
      const external =
        safe.startsWith("http") || safe.startsWith("mailto:")
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";
      chunks.push(`<a href="${safe}"${external}>${escapeHtml(match[1])}</a>`);
    } else {
      chunks.push(escapeHtml(match[0]));
    }
    lastIndex = match.index + match[0].length;
  }

  chunks.push(escapeHtml(text.slice(lastIndex)));
  let out = chunks.join("");
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/&lt;b&gt;(.*?)&lt;\/b&gt;/g, "<strong>$1</strong>");
  out = out.replace(/&lt;i&gt;(.*?)&lt;\/i&gt;/g, "<em>$1</em>");
  out = out.replace(/&lt;u&gt;(.*?)&lt;\/u&gt;/g, "<u>$1</u>");
  out = out.replace(
    /&lt;a href=&quot;([^&]+)&quot;&gt;(.*?)&lt;\/a&gt;/g,
    (_, href, label) => {
      const safe = sanitizeHref(href);
      return safe
        ? `<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>`
        : label;
    },
  );
  return out;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeHref(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") {
      return url.href;
    }
    return null;
  } catch {
    return null;
  }
}
