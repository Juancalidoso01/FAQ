import esData from "../../content/translations/es.json";
import ruData from "../../content/translations/ru.json";

export type Lang = "es" | "ru";

export const TRANSLATIONS_FILES: Record<Lang, string> = {
  es: "translations/es.json",
  ru: "translations/ru.json",
};

/** Compatibilidad: nombre anterior del archivo ruso. */
export const TRANSLATIONS_RU_FILE = TRANSLATIONS_FILES.ru;

export type ArticleTranslation = {
  title: string;
  description: string;
  /** Contenido en markdown traducido. */
  content: string;
  /** Fecha de la última edición/guardado de la traducción. */
  updatedAt?: string;
};

export type TranslationStore = Record<string, ArticleTranslation>;

const STORES: Record<Lang, TranslationStore> = {
  es: esData as TranslationStore,
  ru: ruData as TranslationStore,
};

export function translationKey(categorySlug: string, articleSlug: string): string {
  return `${categorySlug}/${articleSlug}`;
}

/**
 * Devuelve la traducción del artículo al idioma `lang` (si existe).
 * El idioma original del artículo vive en el propio JSON de contenido, no aquí.
 */
export function getArticleTranslation(
  categorySlug: string,
  articleSlug: string,
  lang: Lang,
): ArticleTranslation | null {
  const store = STORES[lang];
  return store[translationKey(categorySlug, articleSlug)] ?? null;
}
