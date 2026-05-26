import faqData from "../../content/faq-data.json";
import gitbookData from "../../content/gitbook-comercios.json";
import pagoACuotasAppData from "../../content/pago-a-cuotas-app.json";

export type FaqArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  updatedAt?: string;
  intercomUrl?: string;
  sourceUrl?: string;
  gitbookUrl?: string;
  gitbookPageId?: string;
  images?: Array<{ fileId: string; url: string; sourceUrl?: string }>;
};

export type FaqCategory = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articles: FaqArticle[];
};

export type FaqData = {
  categories: FaqCategory[];
  scrapedAt?: string;
  source?: string;
};

export const SITE_NAME = "Centro de Ayuda Punto Pago";
export const SITE_DESCRIPTION =
  "Preguntas frecuentes, guías y soporte para usuarios y comercios de Punto Pago en Panamá. Pagos, recargas, tarjetas Mastercard, terminales y más.";

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export function getAllCategories(): FaqCategory[] {
  const intercom = (faqData as FaqData).categories;
  const gitbook = (gitbookData as FaqData).categories;
  const pagoCuotasApp = (pagoACuotasAppData as FaqData).categories;
  return [...intercom, ...pagoCuotasApp, ...gitbook];
}

export function getCategory(slug: string): FaqCategory | undefined {
  return getAllCategories().find((c) => c.slug === slug);
}

export function getAllArticles(): Array<FaqArticle & { categorySlug: string; categoryTitle: string }> {
  return getAllCategories().flatMap((category) =>
    category.articles.map((article) => ({
      ...article,
      categorySlug: category.slug,
      categoryTitle: category.title,
    })),
  );
}

export function getArticle(categorySlug: string, articleSlug: string) {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const article = category.articles.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { category, article };
}

export function searchArticles(query: string, limit = 20) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return getAllArticles()
    .map((article) => {
      const haystack = `${article.title} ${article.description} ${article.content}`.toLowerCase();
      const titleMatch = article.title.toLowerCase().includes(q);
      const score =
        (titleMatch ? 10 : 0) +
        (article.description.toLowerCase().includes(q) ? 4 : 0) +
        (haystack.includes(q) ? 2 : 0);
      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ article }) => article);
}

export function articlePath(categorySlug: string, articleSlug: string) {
  return `/articulo/${categorySlug}/${articleSlug}`;
}

export function categoryPath(slug: string) {
  return `/categoria/${slug}`;
}

export function excerpt(text: string, max = 160) {
  const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}
