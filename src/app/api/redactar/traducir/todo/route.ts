import { NextResponse } from "next/server";
import { resolveGoogleApiKey, translateArticle } from "@/lib/ai-translate";
import { getAllCategories } from "@/lib/faq";
import { readJsonFileOptional, writeJsonFile } from "@/lib/github";
import { isRedactorAuthorized } from "@/lib/redactar-access";
import {
  TRANSLATIONS_FILES,
  translationKey,
  type Lang,
  type TranslationStore,
} from "@/lib/translations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Margen amplio: traduce una tanda pequeña por llamada.
export const maxDuration = 60;

type Pending = {
  key: string;
  categorySlug: string;
  articleSlug: string;
  originalLang: Lang;
  targetLang: Lang;
  title: string;
  description: string;
  content: string;
};

/** Lista de guías que aún no tienen traducción al idioma contrario. */
function buildPending(stores: Record<Lang, TranslationStore>, skip: Set<string>): Pending[] {
  const seen = new Set<string>();
  const pending: Pending[] = [];
  for (const category of getAllCategories()) {
    for (const article of category.articles) {
      const key = translationKey(category.slug, article.slug);
      if (seen.has(key)) continue;
      seen.add(key);
      if (skip.has(key)) continue;
      const originalLang: Lang = article.lang === "ru" ? "ru" : "es";
      const targetLang: Lang = originalLang === "es" ? "ru" : "es";
      if (stores[targetLang][key]) continue; // ya traducida
      pending.push({
        key,
        categorySlug: category.slug,
        articleSlug: article.slug,
        originalLang,
        targetLang,
        title: article.title,
        description: article.description ?? "",
        content: article.content,
      });
    }
  }
  return pending;
}

export async function POST(request: Request) {
  if (!isRedactorAuthorized(request)) {
    return NextResponse.json({ error: "Clave de acceso incorrecta." }, { status: 401 });
  }

  const apiKey = resolveGoogleApiKey();
  const token = process.env.GITHUB_TOKEN;
  if (!apiKey) {
    return NextResponse.json({ error: "Falta la clave de Gemini." }, { status: 503 });
  }
  if (!token) {
    return NextResponse.json({ error: "Falta configurar GITHUB_TOKEN." }, { status: 503 });
  }

  let body: { skip?: string[]; limit?: number };
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const skip = new Set(Array.isArray(body.skip) ? body.skip : []);
  const limit = Math.min(Math.max(body.limit ?? 4, 1), 8);

  try {
    // Lee el estado vivo de ambos almacenes desde GitHub.
    const ruFile = TRANSLATIONS_FILES.ru;
    const esFile = TRANSLATIONS_FILES.es;
    const ruRead = await readJsonFileOptional<TranslationStore>(ruFile, token);
    const esRead = await readJsonFileOptional<TranslationStore>(esFile, token);
    const stores: Record<Lang, TranslationStore> = {
      ru: ruRead?.data ?? {},
      es: esRead?.data ?? {},
    };

    const pending = buildPending(stores, skip);
    const batch = pending.slice(0, limit);

    const failed: string[] = [];
    const touched = new Set<Lang>();
    let processed = 0;

    for (const item of batch) {
      try {
        const tr = await translateArticle(apiKey, {
          from: item.originalLang,
          to: item.targetLang,
          titulo: item.title,
          descripcion: item.description,
          contenidoMarkdown: item.content,
        });
        stores[item.targetLang][item.key] = {
          title: tr.titulo,
          description: tr.descripcion,
          content: tr.contenidoMarkdown,
          sourceTitle: item.title,
          updatedAt: new Date().toISOString(),
        };
        touched.add(item.targetLang);
        processed += 1;
      } catch (err) {
        console.error(`No se pudo traducir ${item.key}:`, err);
        failed.push(item.key);
      }
    }

    // Guarda una sola vez por idioma tocado.
    if (touched.has("ru")) {
      await writeJsonFile(
        ruFile,
        stores.ru,
        ruRead?.sha ?? null,
        `FAQ: traducción al ruso por lote (${processed} guías)`,
        token,
      );
    }
    if (touched.has("es")) {
      await writeJsonFile(
        esFile,
        stores.es,
        esRead?.sha ?? null,
        `FAQ: traducción al español por lote`,
        token,
      );
    }

    const remaining = pending.length - processed;
    return NextResponse.json({
      processed,
      failed,
      remaining,
      done: remaining <= 0,
    });
  } catch (error) {
    console.error("Error en traducción por lote:", error);
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
