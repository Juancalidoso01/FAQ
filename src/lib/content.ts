/** Convierte contenido importado de Intercom (HTML inline + markdown simple) a HTML seguro. */
export function renderArticleContent(raw: string): string {
  const lines = raw.split("\n");
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${inlineHtml(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h2>${inlineHtml(trimmed.slice(2))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineHtml(trimmed.slice(2))}</li>`);
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
      continue;
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imageMatch) {
      closeList();
      const [, alt, href] = imageMatch;
      const safeHref = sanitizeHref(href);
      if (safeHref) {
        html.push(
          `<figure class="faq-figure"><img src="${safeHref}" alt="${escapeHtml(alt || "Imagen")}" loading="lazy" /></figure>`,
        );
      }
      continue;
    }

    if (trimmed === "---") {
      closeList();
      html.push("<hr />");
      continue;
    }

    if (trimmed.startsWith("> ")) {
      closeList();
      html.push(`<blockquote><p>${inlineHtml(trimmed.slice(2))}</p></blockquote>`);
      continue;
    }

    if (trimmed.includes(" | ")) {
      closeList();
      const cells = trimmed.split(" | ").map((cell) => inlineHtml(cell.trim()));
      html.push(`<p class="faq-table-row">${cells.join('<span class="faq-table-sep"> · </span>')}</p>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineHtml(trimmed)}</p>`);
  }

  closeList();
  return html.join("\n");
}

function inlineHtml(text: string): string {
  let out = escapeHtml(text);
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
