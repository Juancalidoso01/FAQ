/** Convierte contenido importado de Intercom (HTML inline + markdown simple) a HTML seguro. */
export function renderArticleContent(raw: string): string {
  const lines = raw.split("\n");
  const html: string[] = [];
  let inList = false;
  let index = 0;

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
      html.push(`<h3>${inlineHtml(trimmed.slice(4))}</h3>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineHtml(trimmed.slice(3))}</h2>`);
      index += 1;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h2>${inlineHtml(trimmed.slice(2))}</h2>`);
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
  return html.join("\n");
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
  let out = escapeHtml(text);
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
  try {
    const url = new URL(href);
    if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") {
      return url.href;
    }
    return null;
  } catch {
    return null;
  }
}
