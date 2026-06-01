/**
 * Logotipo de Punto Pago como SVG vectorial autocontenido (sin red).
 * Se usa tanto en la portada del libro (React) como en la exportación HTML,
 * por eso vive como string reutilizable. Los colores son rellenos SVG
 * (foreground), de modo que se imprimen siempre, sin depender de
 * "gráficos de fondo" del navegador.
 */

export const BRAND_PURPLE = "#4749B6";

/** Marca (tile con pin de ubicación). Cuadrada, escalable por viewBox. */
export function puntoPagoMarkSvg(size = 64, idSuffix = ""): string {
  const gid = `ppGrad${idSuffix}`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Punto Pago">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4749B6"/>
      <stop offset="1" stop-color="#7C5CFC"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="72" height="72" rx="18" fill="url(#${gid})"/>
  <path d="M36 16c-9.4 0-17 7.2-17 16.1 0 11.9 17 23.9 17 23.9s17-12 17-23.9C53 23.2 45.4 16 36 16z" fill="#ffffff"/>
  <circle cx="36" cy="31.5" r="6.4" fill="#4749B6"/>
</svg>`;
}

/** Lockup completo: marca + wordmark "Punto Pago". */
export function puntoPagoLockupSvg(idSuffix = ""): string {
  const gid = `ppGradL${idSuffix}`;
  return `<svg viewBox="0 0 392 88" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Punto Pago" style="height:64px;width:auto;max-width:100%">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4749B6"/>
      <stop offset="1" stop-color="#7C5CFC"/>
    </linearGradient>
  </defs>
  <rect x="8" y="8" width="72" height="72" rx="18" fill="url(#${gid})"/>
  <path d="M44 24c-9.4 0-17 7.2-17 16.1 0 11.9 17 23.9 17 23.9s17-12 17-23.9C61 31.2 53.4 24 44 24z" fill="#ffffff"/>
  <circle cx="44" cy="39.5" r="6.4" fill="#4749B6"/>
  <text x="98" y="58" font-family="'Plus Jakarta Sans', -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="42" font-weight="700" letter-spacing="-1">
    <tspan fill="#0B0B13">Punto</tspan><tspan fill="#4749B6"> Pago</tspan>
  </text>
</svg>`;
}
