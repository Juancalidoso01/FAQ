# Punto Pago — Centro de Ayuda (FAQ)

Sitio de preguntas frecuentes importado desde [Intercom](https://intercom.help/punto-pago/es) y [GitBook Comercios](https://comercios.puntopago.net/), con diseño alineado a puntopago.net.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

En producción, usa la URL final del sitio (por ejemplo `https://ayuda.puntopago.net`).

## Actualizar contenido desde Intercom

```bash
npm run scrape
```

Esto regenera:

- `content/faq-data.json` — artículos de Intercom
- `content/gitbook-comercios.json` — guía Cuotas (GitBook comercios)

Solo Intercom: `npm run scrape:intercom`  
Solo GitBook: `npm run scrape:gitbook`

El scraper de GitBook resuelve imágenes desde el HTML publicado y guarda un mapa en `content/gitbook-image-map.json` (`fileId → url`) para futuras sincronizaciones con GitBook.

## SEO

- Schema.org: `WebSite`, `FAQPage`, `Article`, `BreadcrumbList`, `CollectionPage`
- `sitemap.xml` y `robots.txt` generados automáticamente
- URLs semánticas: `/categoria/[slug]` y `/articulo/[categoria]/[articulo]`
- Metadatos Open Graph y canonical por página

## Estructura

- `content/faq-data.json` — contenido Intercom
- `content/gitbook-comercios.json` — contenido GitBook Cuotas
- `src/app/` — rutas Next.js App Router
- `src/components/` — UI (incluye cursor/ambient de Punto Pago)
- `scripts/scrape-intercom.py` — scraper de Intercom
- `scripts/scrape-gitbook.py` — scraper de GitBook comercios
