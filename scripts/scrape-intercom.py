#!/usr/bin/env python3
"""Importa artículos del Help Center de Intercom a content/faq-data.json."""

from __future__ import annotations

import html
import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE = "https://intercom.help/punto-pago/es"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "faq-data.json"

COLLECTIONS = [
    ("nuestros-servicios", "9054195-nuestros-servicios", "Nuestros servicios", "Conoce los servicios de Punto Pago: pagos, recargas, tarjetas y más."),
    ("adquiere-tu-mastercard", "7598674-adquiere-tu-mastercard", "Adquiere tu Mastercard", "Guía para solicitar y usar tu tarjeta Mastercard Punto Pago."),
    ("terminos-y-condiciones", "3347459-terminos-y-condiciones", "Términos y condiciones", "Políticas, términos legales y condiciones de uso de Punto Pago."),
    ("aumenta-tus-ventas-con-punto-pago", "6739977-aumenta-tus-ventas-con-punto-pago", "Aumenta tus ventas", "Soluciones para comercios que quieren crecer con Punto Pago."),
    ("recarga-tu-app", "9054443-recarga-tu-app", "Recarga tu app", "Formas de recargar saldo en tu wallet Punto Pago."),
    ("contacto-de-operadores", "11446830-contacto-de-operadores", "Contacto de operadores", "Información de contacto de operadores telefónicos."),
    ("cambio-de-numero-de-telefono", "11447546-cambio-de-numero-de-telefono", "Cambio de número", "Cómo actualizar tu número de teléfono en Punto Pago."),
    ("pago-no-reflejado", "11466988-pago-no-reflejado", "Pago no reflejado", "Qué hacer si tu pago no aparece en la app."),
    ("reporte-de-terminal", "11468029-reporte-de-terminal", "Reporte de terminal", "Reportes y soporte para terminales Punto Pago."),
    ("aumento-de-credito", "11468552-aumento-de-credito", "Aumento de crédito", "Solicitud y gestión de aumento de línea de crédito."),
]

ICONS = {
    "nuestros-servicios": "rocket",
    "adquiere-tu-mastercard": "credit-card",
    "terminos-y-condiciones": "document",
    "aumenta-tus-ventas-con-punto-pago": "chart",
    "recarga-tu-app": "wallet",
    "contacto-de-operadores": "phone",
    "cambio-de-numero-de-telefono": "mobile",
    "pago-no-reflejado": "alert",
    "reporte-de-terminal": "terminal",
    "aumento-de-credito": "credit",
}

EXTRA_ARTICLES = {
    "contacto-de-operadores": [
        f"{BASE}/articles/10439711-contacto-de-operadores-punto-pago",
    ],
}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def blocks_to_markdown(blocks: list[dict] | None) -> str:
    parts: list[str] = []
    for block in blocks or []:
        block_type = block.get("type")
        if block_type == "paragraph":
            text = (block.get("text") or "").strip()
            if text:
                parts.append(text)
        elif block_type in ("heading", "header"):
            level = min(block.get("level", 2), 6)
            parts.append(f"{'#' * level} {block.get('text', '')}")
        elif block_type in ("unorderedList", "orderedList"):
            items = block.get("items") or []
            for index, item in enumerate(items):
                prefix = f"{index + 1}." if block_type == "orderedList" else "-"
                text = item if isinstance(item, str) else item.get("text", "")
                parts.append(f"{prefix} {text}")
        elif block_type == "image":
            alt = block.get("alt") or "Imagen"
            url = block.get("url") or block.get("src") or ""
            if url:
                parts.append(f"![{alt}]({url})")
        elif block_type == "video":
            video_id = block.get("id") or block.get("videoId")
            provider = block.get("provider", "youtube")
            if video_id and provider == "youtube":
                parts.append(f"[Ver video en YouTube](https://www.youtube.com/watch?v={video_id})")
        elif block_type == "callout":
            text = block.get("text") or block.get("body") or ""
            if text:
                parts.append(f"> {text}")
        elif block_type == "code":
            parts.append(f"```\n{block.get('text', '')}\n```")
        elif block_type == "attachment":
            url = block.get("url") or ""
            name = block.get("name") or "Archivo"
            if url:
                parts.append(f"[{name}]({url})")
        elif block_type == "table":
            rows = block.get("rows") or []
            for row in rows:
                cells = row.get("cells") or []
                cell_texts = []
                for cell in cells:
                    cell_parts = []
                    for nested in cell.get("content") or []:
                        if nested.get("type") == "paragraph":
                            text = (nested.get("text") or "").strip()
                            if text:
                                cell_parts.append(text)
                    cell_texts.append(" ".join(cell_parts))
                if cell_texts:
                    parts.append(" | ".join(cell_texts))
    return "\n\n".join(parts).strip()


def parse_article(url: str) -> dict | None:
    raw = fetch(url)
    match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', raw, re.S)
    if not match:
        return None

    article_content = json.loads(match.group(1))["props"]["pageProps"].get("articleContent") or {}
    slug = url.split("/articles/")[-1]
    article_id = article_content.get("articleId") or slug.split("-")[0]
    clean_slug = re.sub(r"^\d+-", "", slug)
    content = blocks_to_markdown(article_content.get("blocks"))

    if not content:
        return None

    description = article_content.get("description") or content[:160].replace("\n", " ")
    return {
        "id": article_id,
        "slug": clean_slug,
        "title": article_content.get("title") or clean_slug,
        "description": html.unescape(description),
        "content": html.unescape(content),
        "updatedAt": article_content.get("lastUpdatedDate") or article_content.get("lastUpdated"),
        "intercomUrl": url,
    }


def main() -> None:
    data = {
        "categories": [],
        "scrapedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": BASE,
    }
    seen: set[str] = set()

    for slug, path, title, description in COLLECTIONS:
        collection_html = fetch(f"{BASE}/collections/{path}")
        article_urls = re.findall(
            r'href="(https://intercom\.help/punto-pago/es/articles/\d+-[^"]+)"',
            collection_html,
        )
        for extra in EXTRA_ARTICLES.get(slug, []):
            article_urls.append(extra)

        category = {
            "slug": slug,
            "title": title,
            "description": description,
            "icon": ICONS.get(slug, "folder"),
            "articles": [],
        }

        for article_url in dict.fromkeys(article_urls):
            if article_url in seen:
                continue
            seen.add(article_url)
            article = parse_article(article_url)
            if article:
                category["articles"].append(article)

        data["categories"].append(category)
        print(f"{title}: {len(category['articles'])} artículos")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    total = sum(len(category["articles"]) for category in data["categories"])
    print(f"Guardado en {OUT} ({total} artículos)")


if __name__ == "__main__":
    main()
