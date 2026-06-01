import type { ArticleBrief } from "@/lib/content-sources";

/** Palabras vacías comunes en español/ruso que no aportan a la comparación. */
const STOPWORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "a", "en", "y", "o",
  "que", "con", "por", "para", "se", "su", "sus", "mi", "tu", "lo", "como", "es", "tu", "the", "of",
  "и", "в", "на", "с", "по", "для", "как", "это", "к", "от", "за", "из",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9а-я\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(text: string): Set<string> {
  return new Set(
    normalize(text)
      .split(" ")
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

/** Coeficiente de Jaccard entre dos conjuntos de palabras (0–1). */
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  return inter / (a.size + b.size - inter);
}

export type SimilarLevel = "alta" | "media" | "baja";
export type SimilarArticle = ArticleBrief & { score: number; level: SimilarLevel };

/** Umbral mínimo para mostrar una guía como candidata parecida. */
const MIN_SCORE = 0.18;

function levelFor(score: number): SimilarLevel {
  if (score >= 0.5) return "alta";
  if (score >= 0.3) return "media";
  return "baja";
}

/**
 * Califica qué tan parecido es el contenido nuevo a cada guía existente, de
 * forma determinista (sin IA), comparando títulos y descripciones por
 * solapamiento de palabras. NO decide por sí mismo si es duplicado: devuelve
 * una calificación (0–1) para que el agente humano tome la decisión.
 */
export function findSimilarArticles(
  title: string,
  description: string,
  articles: ArticleBrief[],
  limit = 5,
): SimilarArticle[] {
  const titleTokens = tokenSet(title);
  const newTokens = tokenSet(`${title} ${description}`);

  const scored = articles
    .map((article) => {
      const aTitleTokens = tokenSet(article.title);
      const aAllTokens = tokenSet(`${article.title} ${article.description}`);
      // Pondera el parecido del título por encima del de la descripción.
      const score = 0.7 * jaccard(titleTokens, aTitleTokens) + 0.3 * jaccard(newTokens, aAllTokens);
      return { ...article, score, level: levelFor(score) };
    })
    .filter((a) => a.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
