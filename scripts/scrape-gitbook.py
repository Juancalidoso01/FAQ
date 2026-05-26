#!/usr/bin/env python3
"""Importa artículos del GitBook de comercios (Cuotas) a content/gitbook-comercios.json."""

from __future__ import annotations

import json
import re
import unicodedata
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE = "https://comercios.puntopago.net"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "gitbook-comercios.json"

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
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=45) as response:
        return response.read().decode("utf-8", errors="replace")


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9\s-]", "", text).strip().lower()
    return re.sub(r"[\s_-]+", "-", text)


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
        lambda m: f"> {m.group(1).strip()}",
        text,
        flags=re.S,
    )
    text = re.sub(r"\{%\s*stepper\s*%\}", "", text)
    text = re.sub(r"\{%\s*step\s*%\}", "\n\n", text)
    text = re.sub(r"\{%\s*endstep\s*%\}", "", text)
    text = re.sub(r"\{%\s*endstepper\s*%\}", "", text)
    text = re.sub(r"\{%[^%]*%\}", "", text)

    text = re.sub(r"<mark[^>]*>\*\*(.+?)\*\*</mark>", r"**\1**", text, flags=re.S)
    text = re.sub(r"<mark[^>]*>(.+?)</mark>", r"\1", text, flags=re.S)
    text = re.sub(
        r"<figure>\s*<img src=\"([^\"]+)\"[^>]*>.*?</figure>",
        r"![](\1)",
        text,
        flags=re.S,
    )
    text = re.sub(r"<img src=\"([^\"]+)\"[^>]*>", r"![](\1)", text)
    text = re.sub(r"</?(figure|figcaption)[^>]*>", "", text)

    def absolutize_image(match: re.Match[str]) -> str:
        url = match.group(1)
        if url.startswith("/"):
            url = f"{BASE}{url}"
        return f"![]({url})"

    text = re.sub(r"!\[\]\(([^)]+)\)", absolutize_image, text)
    text = re.sub(r"\*\*\*", "---", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def markdown_path(page: dict) -> str:
    pathname = page.get("pathname") or "/"
    if pathname == "/":
        return f"{BASE}/cuotas-by-punto-pago.md"
    return f"{BASE}{pathname}.md"


def page_slug(page: dict) -> str:
    pathname = (page.get("pathname") or "/").strip("/")
    if not pathname:
        return "cuotas-by-punto-pago"
    return pathname.split("/")[-1]


def category_key(page: dict) -> str:
    breadcrumbs = page.get("breadcrumbs") or []
    return breadcrumbs[0]["label"] if breadcrumbs else "Inicio"


def excerpt_from_content(content: str, fallback: str = "") -> str:
    clean = re.sub(r"[#>*\[\]()!]", " ", content)
    clean = re.sub(r"\s+", " ", clean).strip()
    if not clean:
        return fallback
    return clean[:160] + ("…" if len(clean) > 160 else "")


def main() -> None:
    index = json.loads(fetch(f"{BASE}/~gitbook/site-index"))
    pages = index.get("pages") or []

    categories: dict[str, dict] = {}
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
        try:
            raw = fetch(md_url)
        except Exception as error:  # noqa: BLE001
            print(f"Skip {page.get('title')}: {error}")
            continue

        content = clean_gitbook_markdown(raw)
        if not content:
            continue

        title = page.get("title") or page_slug(page)
        description = page.get("description") or excerpt_from_content(content)
        public_url = f"{BASE}{page.get('pathname') or '/'}"

        categories[key]["articles"].append(
            {
                "id": page.get("id") or page_slug(page),
                "slug": page_slug(page),
                "title": title,
                "description": description,
                "content": content,
                "sourceUrl": public_url,
                "gitbookUrl": md_url,
            }
        )

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

    data = {
        "categories": result_categories,
        "scrapedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": BASE,
        "gitbookSpace": "d8RE1C5dzBxrh52rnK1o",
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(len(category["articles"]) for category in result_categories)
    print(f"Guardado en {OUT} ({total} artículos en {len(result_categories)} categorías)")


if __name__ == "__main__":
    main()
