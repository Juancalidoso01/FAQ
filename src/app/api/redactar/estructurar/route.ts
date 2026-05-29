import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getTaxonomy } from "@/lib/content-sources";
import { isRedactorAuthorized } from "@/lib/redactar-access";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const draftSchema = z.object({
  titulo: z.string().describe("Título claro y específico de la guía, sin la marca."),
  descripcion: z.string().describe("Resumen de 1 frase (máx. 160 caracteres) para listados y buscadores."),
  contenidoMarkdown: z
    .string()
    .describe(
      "Contenido en markdown: un párrafo introductorio breve y luego secciones con encabezados '## '. Usa listas con '- ' y pasos numerados cuando aplique. No incluyas el título como encabezado ni datos de soporte/contacto.",
    ),
  slugSugerido: z.string().describe("slug-en-minusculas-con-guiones derivado del título."),
  audiencia: z.enum(["cliente", "empresa", "general"]),
  esNuevaCategoria: z.boolean().describe("true si ninguna categoría existente encaja bien."),
  categoriaSlug: z
    .string()
    .describe("Si esNuevaCategoria=false, el slug EXACTO de una categoría existente. Si no, cadena vacía."),
  categoriaNuevaTitulo: z
    .string()
    .describe("Si esNuevaCategoria=true, nombre de la nueva categoría (ej. 'Pagos QR'). Si no, cadena vacía."),
  posibleDuplicado: z.object({
    existe: z.boolean(),
    articuloSlug: z.string().describe("slug del artículo parecido, o cadena vacía."),
    motivo: z.string().describe("Breve explicación, o cadena vacía."),
  }),
});

export async function POST(request: Request) {
  if (!isRedactorAuthorized(request)) {
    return NextResponse.json({ error: "Clave de acceso incorrecta." }, { status: 401 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "Falta configurar GOOGLE_GENERATIVE_AI_API_KEY en el entorno." },
      { status: 503 },
    );
  }

  let texto = "";
  try {
    const body = await request.json();
    texto = typeof body?.texto === "string" ? body.texto.trim() : "";
  } catch {
    return NextResponse.json({ error: "Cuerpo de la solicitud inválido." }, { status: 400 });
  }

  if (texto.length < 15) {
    return NextResponse.json(
      { error: "Escribe un poco más de información para poder estructurarla." },
      { status: 400 },
    );
  }

  const taxonomy = getTaxonomy();
  const taxonomyList = taxonomy
    .map((c) => `- ${c.slug} — ${c.title} [${c.audience}] (${c.articleCount} artículos)`)
    .join("\n");

  const system = [
    "Eres editor del Centro de Ayuda (FAQ) de Punto Pago, una fintech de Panamá.",
    "Conviertes notas o preguntas del equipo de call center en una guía clara para clientes.",
    "Reglas de estilo:",
    "- Español neutro de Panamá, tono cercano y profesional, tratando de 'tú'.",
    "- Sé directo y conciso. Usa pasos numerados para procedimientos y viñetas para listas.",
    "- No inventes datos (montos, plazos, requisitos). Si algo no está en el texto, no lo agregues.",
    "- No incluyas notas internas, fuentes, ni datos de contacto/soporte (se agregan automáticamente).",
    "- Estructura con encabezados '## '. No repitas el título como encabezado dentro del contenido.",
    "",
    "Clasifica el artículo en una de estas categorías existentes (usa el slug EXACTO) o marca esNuevaCategoria=true si ninguna encaja:",
    taxonomyList,
  ].join("\n");

  try {
    const result = await generateText({
      model: google("gemini-2.5-flash"),
      system,
      prompt: `Texto del equipo de call center a estructurar:\n\n"""\n${texto}\n"""`,
      output: Output.object({ schema: draftSchema }),
    });

    const draft = result.output;
    const cleanedSlug = slugify(draft.slugSugerido || draft.titulo) || "nueva-guia";

    return NextResponse.json({ draft: { ...draft, slugSugerido: cleanedSlug } });
  } catch (error) {
    console.error("Error al estructurar con IA:", error);
    return NextResponse.json(
      { error: "No se pudo procesar el texto con la IA. Intenta de nuevo." },
      { status: 502 },
    );
  }
}
