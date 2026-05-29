import type { FaqData } from "./faq";

import faqData from "../../content/faq-data.json";
import gitbookData from "../../content/gitbook-comercios.json";
import gitbookGuiaData from "../../content/gitbook-guia.json";
import productosTarjetasCliente from "../../content/productos-tarjetas-cliente.json";
import productosPrepagoCliente from "../../content/productos-prepago-cliente.json";
import productosCreditoCliente from "../../content/productos-credito-cliente.json";
import productosMarketplaceCliente from "../../content/productos-marketplace-cliente.json";
import productosRemesasCliente from "../../content/productos-remesas-cliente.json";
import productosRecargaCliente from "../../content/productos-recarga-cliente.json";
import productosTarjetasMastercardCliente from "../../content/productos-tarjetas-mastercard-cliente.json";
import comunidadFaq from "../../content/comunidad-faq.json";

export type Audience = "cliente" | "empresa" | "general";

export type ContentSource = {
  /** Nombre del archivo dentro de /content (se usa para el commit en GitHub). */
  file: string;
  audience: Audience;
  data: FaqData;
};

/**
 * Archivo donde caen los artículos nuevos creados desde /redactar cuando no
 * encajan en una categoría existente.
 */
export const COMMUNITY_FILE = "comunidad-faq.json";

export const CONTENT_SOURCES: ContentSource[] = [
  { file: "faq-data.json", audience: "general", data: faqData as FaqData },
  { file: "productos-tarjetas-cliente.json", audience: "cliente", data: productosTarjetasCliente as FaqData },
  { file: "productos-tarjetas-mastercard-cliente.json", audience: "cliente", data: productosTarjetasMastercardCliente as FaqData },
  { file: "productos-prepago-cliente.json", audience: "cliente", data: productosPrepagoCliente as FaqData },
  { file: "productos-credito-cliente.json", audience: "cliente", data: productosCreditoCliente as FaqData },
  { file: "productos-marketplace-cliente.json", audience: "cliente", data: productosMarketplaceCliente as FaqData },
  { file: "productos-remesas-cliente.json", audience: "cliente", data: productosRemesasCliente as FaqData },
  { file: "productos-recarga-cliente.json", audience: "cliente", data: productosRecargaCliente as FaqData },
  { file: "gitbook-guia.json", audience: "cliente", data: gitbookGuiaData as FaqData },
  { file: "gitbook-comercios.json", audience: "empresa", data: gitbookData as FaqData },
  { file: COMMUNITY_FILE, audience: "general", data: comunidadFaq as FaqData },
];

export type TaxonomyCategory = {
  slug: string;
  title: string;
  audience: Audience;
  file: string;
  articleCount: number;
};

/** Lista de categorías existentes, con su archivo y audiencia, para la IA. */
export function getTaxonomy(): TaxonomyCategory[] {
  return CONTENT_SOURCES.flatMap((source) =>
    source.data.categories.map((category) => ({
      slug: category.slug,
      title: category.title,
      audience: source.audience,
      file: source.file,
      articleCount: category.articles.length,
    })),
  );
}

/** Devuelve el archivo que contiene una categoría dada (o undefined). */
export function getFileForCategory(slug: string): string | undefined {
  return getTaxonomy().find((c) => c.slug === slug)?.file;
}

/** Todos los slugs de artículos existentes (para sugerir y detectar duplicados). */
export function getAllArticleSlugs(): string[] {
  return CONTENT_SOURCES.flatMap((source) =>
    source.data.categories.flatMap((c) => c.articles.map((a) => a.slug)),
  );
}
