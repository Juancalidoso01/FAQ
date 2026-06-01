import ruData from "../../content/translations/ru.json";

export const TRANSLATIONS_RU_FILE = "translations/ru.json";

export type ArticleTranslation = {
  title: string;
  description: string;
  /** Contenido en markdown traducido. */
  content: string;
  /** Fecha de la última edición/guardado de la traducción. */
  updatedAt?: string;
};

export type TranslationStore = Record<string, ArticleTranslation>;

export function translationKey(categorySlug: string, articleSlug: string): string {
  return `${categorySlug}/${articleSlug}`;
}

export function getArticleTranslation(
  categorySlug: string,
  articleSlug: string,
): ArticleTranslation | null {
  const store = ruData as TranslationStore;
  return store[translationKey(categorySlug, articleSlug)] ?? null;
}
