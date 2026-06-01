import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Lang } from "@/lib/translations";

export const translationResultSchema = z.object({
  titulo: z.string().describe("Título traducido."),
  descripcion: z.string().describe("Descripción traducida (una frase)."),
  contenidoMarkdown: z
    .string()
    .describe(
      "Contenido traducido conservando EXACTAMENTE la estructura markdown original (encabezados '## ', listas '- ', pasos numerados, enlaces, tablas).",
    ),
});

export type TranslationInput = {
  from: Lang;
  to: Lang;
  titulo: string;
  descripcion: string;
  contenidoMarkdown: string;
};

export type TranslationOutput = z.infer<typeof translationResultSchema>;

const LANG_NAME: Record<Lang, string> = { es: "español", ru: "ruso" };

/** Acepta varios nombres comunes para evitar errores al nombrar la variable. */
export function resolveGoogleApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    undefined
  );
}

export async function translateArticle(
  apiKey: string,
  { from, to, titulo, descripcion, contenidoMarkdown }: TranslationInput,
): Promise<TranslationOutput> {
  const fromName = LANG_NAME[from];
  const toName = LANG_NAME[to];

  const system = [
    "Eres un traductor profesional especializado en contenido financiero (fintech).",
    `Traduces del ${fromName} al ${toName.toUpperCase()} una guía del Centro de Ayuda de Punto Pago (Panamá).`,
    "Reglas:",
    `- Traduce con precisión y naturalidad al ${toName}. Tono claro y profesional.`,
    "- Conserva EXACTAMENTE la estructura markdown: encabezados '## ', listas '- ', pasos numerados, enlaces [texto](url), tablas y saltos de línea.",
    "- NO traduzcas URLs ni rutas (ej. /articulo/...). NO cambies números, montos, ni datos.",
    "- Mantén sin traducir los nombres propios y de producto: Punto Pago, Mastercard, Dream Card, Marketplace, WhatsApp, PayPal, ACH, Clave, APC.",
    "- No agregues ni quites información. No agregues notas del traductor.",
  ].join("\n");

  const prompt = [
    `TÍTULO (${fromName}): ${titulo}`,
    descripcion ? `DESCRIPCIÓN (${fromName}): ${descripcion}` : `DESCRIPCIÓN (${fromName}): (vacía)`,
    "",
    `CONTENIDO (${fromName}, markdown):`,
    '"""',
    contenidoMarkdown,
    '"""',
  ].join("\n");

  const google = createGoogleGenerativeAI({ apiKey });
  const result = await generateText({
    model: google("gemini-2.5-flash"),
    system,
    prompt,
    output: Output.object({ schema: translationResultSchema }),
  });
  return result.output;
}
