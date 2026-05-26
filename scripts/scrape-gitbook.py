#!/usr/bin/env python3
"""Importa artículos del GitBook de comercios (Cuotas) a content/gitbook-comercios.json."""

from __future__ import annotations

import html as html_lib
import json
import re
import time
import unicodedata
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE = "https://comercios.puntopago.net"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "gitbook-comercios.json"
IMAGE_MAP_OUT = ROOT / "content" / "gitbook-image-map.json"
IMAGE_OVERRIDES_OUT = ROOT / "content" / "gitbook-image-overrides.json"
ARTICLE_IMAGES_OUT = ROOT / "content" / "gitbook-article-images.json"
GITBOOK_SPACE = "d8RE1C5dzBxrh52rnK1o"

CATEGORY_META = {
    "Inicio": ("cuotas-inicio", "Cuotas by Punto Pago", "Guía principal de Cuotas para comercios.", "chart"),
    "Comenzando": ("cuotas-comenzando", "Comenzando con Cuotas", "Cómo funciona Cuotas, beneficios y condiciones para comercios.", "rocket"),
    "Registro & Contrato": (
        "cuotas-registro-contrato",
        "Registro y contrato",
        "Registro, documentos y acuerdos comerciales de Cuotas.",
        "document",
    ),
    "¿Qué debe hacer el cliente?": (
        "cuotas-cliente",
        "Qué debe hacer el cliente",
        "Pasos y requisitos para que tus clientes paguen con Cuotas.",
        "mobile",
    ),
    "Acceso para mis empleados": (
        "cuotas-empleados",
        "Acceso para empleados",
        "Invitaciones, permisos y control de empleados en Cuotas.",
        "terminal",
    ),
    "Comisiones & pagos": (
        "cuotas-comisiones-pagos",
        "Comisiones y pagos",
        "Planes tarifarios y uso del dinero recibido en Punto Pago.",
        "wallet",
    ),
    "Devoluciones & disputas": (
        "cuotas-devoluciones-disputas",
        "Devoluciones y disputas",
        "Devoluciones de clientes y resolución de disputas.",
        "alert",
    ),
}


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            )
        },
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read().decode("utf-8", errors="replace")


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    return re.sub(r"[\s_-]+", "-", text)


def normalize_image_url(url: str) -> str:
    url = html_lib.unescape(url)
    url = url.replace("\\u0026", "&").split("&width=")[0].split("&dpr=")[0]
    url = re.sub(r"\\+$", "", url)
    url = url.replace(
        "3686210280-files.gitbook.io/~/files/v0/b/",
        "files.gitbook.com/v0/b/",
    )
    return url.strip()


def extract_html_images(page_html: str) -> list[str]:
    found: list[str] = []

    for encoded in re.findall(r"/~gitbook/image\?url=([^\"'\s]+)", page_html):
        chunk = html_lib.unescape(encoded)
        decoded = urllib.parse.unquote(re.split(r"\\u0026|&", chunk)[0])
        if not decoded.startswith("http"):
            continue
        if any(token in decoded for token in ("favicon", "logo", "socialpreview", "google.com/s2")):
            continue
        found.append(normalize_image_url(decoded))

    for url in re.findall(r"https://images\.gitbook\.com/__img[^\"'\s]+", page_html):
        found.append(normalize_image_url(url))

    for url in re.findall(r"https://(?:content|files)\.gitbook\.com/[^\"'\s]+", page_html):
        found.append(normalize_image_url(url))

    unique: list[str] = []
    seen: set[str] = set()
    for url in found:
        if url and url not in seen:
            seen.add(url)
            unique.append(url)
    return unique


def to_cdn_image_url(source_url: str, width: int = 760, dpr: int = 2) -> str:
    """Prefer GitBook CDN when possible; fall back to the direct asset URL."""
    normalized = normalize_image_url(source_url)
    encoded = urllib.parse.quote(normalized, safe="")
    candidates = [
        f"https://images.gitbook.com/__img/dpr={dpr},width={width},onerror=redirect,format=auto/{encoded}",
        normalized,
    ]
    for candidate in candidates:
        try:
            req = urllib.request.Request(candidate, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as response:
                if response.status == 200:
                    return candidate
        except Exception:  # noqa: BLE001
            continue
    return normalized


def resolve_file_images(content: str, file_ids: list[str], image_urls: list[str]) -> tuple[str, list[dict]]:
    resolved: list[dict] = []
    mapping = dict(zip(file_ids, image_urls))

    for file_id, source_url in mapping.items():
        cdn_url = to_cdn_image_url(source_url)
        resolved.append({"fileId": file_id, "url": cdn_url, "sourceUrl": source_url})
        content = content.replace(f"{BASE}/files/{file_id}", cdn_url)
        content = content.replace(f"/files/{file_id}", cdn_url)
        content = re.sub(
            rf"!\[\]\({re.escape(BASE)}/files/{re.escape(file_id)}\)",
            f"![]({cdn_url})",
            content,
        )
        content = re.sub(
            rf"!\[\]\(/files/{re.escape(file_id)}\)",
            f"![]({cdn_url})",
            content,
        )

    return content, resolved


def html_table_to_markdown(table_html: str) -> str:
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table_html, flags=re.S | re.I)
    parsed_rows: list[list[str]] = []
    for row in rows:
        cells = re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", row, flags=re.S | re.I)
        clean_cells = []
        for cell in cells:
            text = re.sub(r"<[^>]+>", " ", cell)
            text = html_lib.unescape(re.sub(r"\s+", " ", text)).strip()
            clean_cells.append(text)
        if clean_cells:
            parsed_rows.append(clean_cells)

    if not parsed_rows:
        return ""

    width = max(len(row) for row in parsed_rows)
    normalized = [row + [""] * (width - len(row)) for row in parsed_rows]
    lines = [
        "| " + " | ".join(normalized[0]) + " |",
        "| " + " | ".join(["---"] * width) + " |",
    ]
    for row in normalized[1:]:
        lines.append("| " + " | ".join(row) + " |")
    return "\n".join(lines)


def clean_gitbook_markdown(raw: str) -> str:
    text = raw

    text = re.sub(
        r"\{%\s*content-ref[^%]*%\}.*?\{%\s*endcontent-ref\s*%\}",
        "",
        text,
        flags=re.S,
    )
    text = re.sub(
        r"\{%\s*hint[^%]*%\}\s*(.*?)\s*\{%\s*endhint\s*%\}",
        lambda match: f"> {match.group(1).strip()}",
        text,
        flags=re.S,
    )
    text = re.sub(r"\{%\s*stepper\s*%\}", "", text)
    text = re.sub(r"\{%\s*step\s*%\}", "\n\n", text)
    text = re.sub(r"\{%\s*endstep\s*%\}", "", text)
    text = re.sub(r"\{%\s*endstepper\s*%\}", "", text)
    text = re.sub(r"\{%[^%]*%\}", "", text)

    text = re.sub(r"</?mark[^>]*>", "", text)
    text = re.sub(
        r"<figure>\s*<img src=\"([^\"]+)\"[^>]*>.*?</figure>",
        r"![](\1)",
        text,
        flags=re.S,
    )
    text = re.sub(r"<img src=\"([^\"]+)\"[^>]*>", r"![](\1)", text)
    text = re.sub(r"</?(figure|figcaption)[^>]*>", "", text)

    def replace_table(match: re.Match[str]) -> str:
        converted = html_table_to_markdown(match.group(0))
        return f"\n{converted}\n" if converted else ""

    text = re.sub(r"<table[^>]*>.*?</table>", replace_table, text, flags=re.S | re.I)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"\*\*\*", "---", text)
    text = strip_agent_instructions(text)
    text = re.sub(r"&#x20;", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def strip_agent_instructions(text: str) -> str:
    return re.sub(r"\n# Agent Instructions: Querying This Documentation[\s\S]*$", "", text)


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def insert_image_after_heading(content: str, heading: str, image_url: str) -> str:
    marker = f"![]({image_url})"
    if marker in content:
        return content

    needle = heading.strip()
    index = content.find(needle)
    if index == -1:
        return f"{content}\n\n{marker}\n"

    line_end = content.find("\n", index)
    if line_end == -1:
        return f"{content}\n\n{marker}\n"

    return f"{content[: line_end + 1]}\n{marker}\n{content[line_end + 1:]}"


def apply_manual_images(
    categories: list[dict],
    overrides: dict[str, dict],
    placements: dict[str, list[dict]],
) -> dict[str, str]:
    image_map: dict[str, str] = {}

    for override_id, meta in overrides.items():
        image_map[override_id] = meta["url"]

    for category in categories:
        for article in category["articles"]:
            slug = article["slug"]
            placements_for_article = placements.get(slug, [])
            if not placements_for_article:
                continue

            article_images = list(article.get("images") or [])
            content = strip_agent_instructions(article["content"])

            for placement in placements_for_article:
                upload_id = placement["uploadId"]
                meta = overrides.get(upload_id)
                if not meta:
                    continue

                content = insert_image_after_heading(
                    content,
                    placement["after"],
                    meta["url"],
                )
                article_images.append(
                    {
                        "fileId": upload_id,
                        "url": meta["url"],
                        "sourceUrl": meta.get("sourceUrl", meta["url"]),
                        "label": meta.get("label", upload_id),
                    }
                )

            article["content"] = content.strip()
            article["images"] = article_images

    return image_map


def markdown_path(page: dict) -> str:
    pathname = page.get("pathname") or "/"
    if pathname == "/":
        return f"{BASE}/cuotas-by-punto-pago.md"
    return f"{BASE}{pathname}.md"


def page_path(page: dict) -> str:
    pathname = page.get("pathname") or "/"
    return BASE if pathname == "/" else f"{BASE}{pathname}"


def page_slug(page: dict) -> str:
    pathname = (page.get("pathname") or "/").strip("/")
    if not pathname:
        return "cuotas-by-punto-pago"
    return pathname.split("/")[-1]


def category_key(page: dict) -> str:
    breadcrumbs = page.get("breadcrumbs") or []
    return breadcrumbs[0]["label"] if breadcrumbs else "Inicio"


def excerpt_from_content(content: str, fallback: str = "") -> str:
    clean = re.sub(r"[#>*\[\]()!|]", " ", content)
    clean = re.sub(r"\s+", " ", clean).strip()
    if not clean:
        return fallback
    return clean[:160] + ("…" if len(clean) > 160 else "")


def main() -> None:
    index = json.loads(fetch(f"{BASE}/~gitbook/site-index"))
    pages = index.get("pages") or []

    categories: dict[str, dict] = {}
    image_map: dict[str, str] = {}

    for key, (slug, title, description, icon) in CATEGORY_META.items():
        categories[key] = {
            "slug": slug,
            "title": title,
            "description": description,
            "icon": icon,
            "articles": [],
        }

    for page in pages:
        key = category_key(page)
        if key not in categories:
            slug = slugify(key)
            categories[key] = {
                "slug": slug,
                "title": key,
                "description": f"Guías de {key} para comercios Punto Pago.",
                "icon": "folder",
                "articles": [],
            }

        md_url = markdown_path(page)
        html_url = page_path(page)

        try:
            raw_md = fetch(md_url)
            raw_html = fetch(html_url)
        except Exception as error:  # noqa: BLE001
            print(f"Skip {page.get('title')}: {error}")
            continue

        content = clean_gitbook_markdown(raw_md)
        if not content:
            continue

        file_ids = re.findall(r"/files/([A-Za-z0-9]+)", raw_md)
        html_images = extract_html_images(raw_html)
        content, article_images = resolve_file_images(content, file_ids, html_images)

        for item in article_images:
            image_map[item["fileId"]] = item["url"]

        title = page.get("title") or page_slug(page)
        description = page.get("description") or excerpt_from_content(content)
        public_url = page_path(page)

        categories[key]["articles"].append(
            {
                "id": page.get("id") or page_slug(page),
                "slug": page_slug(page),
                "title": title,
                "description": description,
                "content": content,
                "sourceUrl": public_url,
                "gitbookUrl": md_url,
                "gitbookPageId": page.get("id"),
                "images": article_images,
            }
        )

        if file_ids:
            print(f"{title}: {len(file_ids)} imagen(es) resueltas")

        time.sleep(0.25)

    ordered_keys = list(CATEGORY_META.keys()) + [
        key for key in categories if key not in CATEGORY_META
    ]
    result_categories = []
    seen = set()
    for key in ordered_keys:
        if key in seen or key not in categories:
            continue
        seen.add(key)
        category = categories[key]
        if category["articles"]:
            result_categories.append(category)

    overrides = load_json(IMAGE_OVERRIDES_OUT)
    placements = load_json(ARTICLE_IMAGES_OUT)
    manual_map = apply_manual_images(result_categories, overrides, placements)
    image_map.update(manual_map)

    data = {
        "categories": result_categories,
        "scrapedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": BASE,
        "gitbookSpace": GITBOOK_SPACE,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    IMAGE_MAP_OUT.write_text(json.dumps(image_map, ensure_ascii=False, indent=2), encoding="utf-8")

    total = sum(len(category["articles"]) for category in result_categories)
    manual_count = sum(len(v) for v in placements.values())
    print(
        f"Guardado en {OUT} ({total} artículos, "
        f"{len(image_map)} imágenes mapeadas, {manual_count} inserciones manuales)"
    )


if __name__ == "__main__":
    main()
