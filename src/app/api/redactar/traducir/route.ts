import { NextResponse } from "next/server";
import { resolveGoogleApiKey, translateArticle } from "@/lib/ai-translate";
import type { Lang } from "@/lib/translations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asLang(value: unknown, fallback: Lang): Lang {
  return value === "es" || value === "ru" ? value : fallback;
}

export async function POST(request: Request) {
  // Sin candado: este endpoint solo genera la traducción (sin escribir nada),
  // para que la traducción automática al abrir una guía funcione siempre.
  const apiKey = resolveGoogleApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta la clave de Gemini. Configura GOOGLE_GENERATIVE_AI_API_KEY (o GEMINI_API_KEY) en Vercel y redespliega.",
      },
      { status: 503 },
    );
  }

  let body: {
    titulo?: string;
    descripcion?: string;
    contenidoMarkdown?: string;
    from?: string;
    to?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido." }, { status: 400 });
  }

  const titulo = (body.titulo ?? "").trim();
  const descripcion = (body.descripcion ?? "").trim();
  const contenido = (body.contenidoMarkdown ?? "").trim();
  if (!titulo || !contenido) {
    return NextResponse.json({ error: "Falta el título o el contenido a traducir." }, { status: 400 });
  }

  const from = asLang(body.from, "es");
  const to = asLang(body.to, from === "es" ? "ru" : "es");

  try {
    const translation = await translateArticle(apiKey, {
      from,
      to,
      titulo,
      descripcion,
      contenidoMarkdown: contenido,
    });
    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Error al traducir con IA:", error);
    return NextResponse.json(
      { error: "No se pudo traducir el contenido. Intenta de nuevo." },
      { status: 502 },
    );
  }
}
