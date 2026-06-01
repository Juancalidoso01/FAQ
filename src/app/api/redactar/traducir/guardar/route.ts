import { NextResponse } from "next/server";
import { z } from "zod";
import { readJsonFileOptional, writeJsonFile } from "@/lib/github";
import { isRedactorAuthorized } from "@/lib/redactar-access";
import {
  TRANSLATIONS_RU_FILE,
  translationKey,
  type TranslationStore,
} from "@/lib/translations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  categorySlug: z.string().min(1),
  articleSlug: z.string().min(1),
  titulo: z.string().min(1),
  descripcion: z.string().optional().default(""),
  contenidoMarkdown: z.string().min(1),
});

export async function POST(request: Request) {
  if (!isRedactorAuthorized(request)) {
    return NextResponse.json({ error: "Clave de acceso incorrecta." }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Falta configurar GITHUB_TOKEN para guardar la traducción." },
      { status: 503 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos de traducción inválidos." }, { status: 400 });
  }

  const { categorySlug, articleSlug, titulo, descripcion, contenidoMarkdown } = parsed.data;

  try {
    const existing = await readJsonFileOptional<TranslationStore>(TRANSLATIONS_RU_FILE, token);
    const store: TranslationStore = existing?.data ?? {};

    store[translationKey(categorySlug, articleSlug)] = {
      title: titulo,
      description: descripcion,
      content: contenidoMarkdown,
      updatedAt: new Date().toISOString(),
    };

    await writeJsonFile(
      TRANSLATIONS_RU_FILE,
      store,
      existing?.sha ?? null,
      `FAQ: traducción al ruso de ${categorySlug}/${articleSlug}`,
      token,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al guardar la traducción:", error);
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
