import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isRedactorAuthorized } from "@/lib/redactar-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resultSchema = z.object({
  titulo: z.string().describe("Título traducido al ruso."),
  descripcion: z.string().describe("Descripción traducida al ruso (una frase)."),
  contenidoMarkdown: z
    .string()
    .describe(
      "Contenido traducido al ruso, conservando EXACTAMENTE la estructura markdown original (encabezados '## ', listas '- ', pasos numerados, enlaces, tablas).",
    ),
});

function resolveGoogleApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    undefined
  );
}

export async function POST(request: Request) {
  if (!isRedactorAuthorized(request)) {
    return NextResponse.json({ error: "Clave de acceso incorrecta." }, { status: 401 });
  }

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

  let body: { titulo?: string; descripcion?: string; contenidoMarkdown?: string };
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

  const system = [
    "Eres un traductor profesional especializado en contenido financiero (fintech).",
    "Traduces del español al RUSO una guía del Centro de Ayuda de Punto Pago (Panamá).",
    "Reglas:",
    "- Traduce con precisión y naturalidad al ruso. Tono claro y profesional.",
    "- Conserva EXACTAMENTE la estructura markdown: encabezados '## ', listas '- ', pasos numerados, enlaces [texto](url), tablas y saltos de línea.",
    "- NO traduzcas URLs ni rutas (ej. /articulo/...). NO cambies números, montos, ni datos.",
    "- Mantén sin traducir los nombres propios y de producto: Punto Pago, Mastercard, Dream Card, Marketplace, WhatsApp, PayPal, ACH, Clave, APC.",
    "- No agregues ni quites información. No agregues notas del traductor.",
  ].join("\n");

  const prompt = [
    `TÍTULO (español): ${titulo}`,
    descripcion ? `DESCRIPCIÓN (español): ${descripcion}` : "DESCRIPCIÓN (español): (vacía)",
    "",
    "CONTENIDO (español, markdown):",
    '"""',
    contenido,
    '"""',
  ].join("\n");

  try {
    const google = createGoogleGenerativeAI({ apiKey });
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      system,
      prompt,
      output: Output.object({ schema: resultSchema }),
    });
    return NextResponse.json({ translation: result.output });
  } catch (error) {
    console.error("Error al traducir con IA:", error);
    return NextResponse.json(
      { error: "No se pudo traducir el contenido. Intenta de nuevo." },
      { status: 502 },
    );
  }
}
