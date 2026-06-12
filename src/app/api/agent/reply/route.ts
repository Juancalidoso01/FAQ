import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isWhatsappAgentAuthorized, resolveGoogleApiKey } from "@/lib/whatsapp-agent-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const responseSchema = z.object({
  reply: z.string().describe("Respuesta corta para WhatsApp (máx. 900 caracteres)."),
  escalate: z.boolean(),
  escalationReason: z.string(),
  confidence: z.number().min(0).max(1),
  sources: z.array(z.string()),
  internalNote: z.string().optional(),
});

type AiSettings = {
  role?: string;
  instructions?: string;
};

type Correction = { when: string; prefer: string };

type HistoryItem = { direction: string; text: string };

function buildSystemPrompt(ai: AiSettings, corrections: Correction[]) {
  const lines = [
    `Rol: ${ai.role || "Asistente virtual de Punto Pago"}.`,
    "Eres el asistente de WhatsApp Business de Punto Pago (fintech en Panamá).",
    "Responde en español neutro de Panamá, claro y breve (mensaje de chat, no email).",
    "Usa SOLO la información del FAQ proporcionado. No inventes montos, plazos, requisitos ni políticas.",
    "Si el FAQ no alcanza para responder con certeza, marca escalate=true.",
    "Si el usuario pide agente humano o muestra frustración extrema, marca escalate=true.",
    "Incluye en sources los slugs de artículos que usaste.",
  ];

  if (ai.instructions?.trim()) {
    lines.push("", "Instrucciones adicionales del equipo:", ai.instructions.trim());
  }

  const corr = (corrections || []).slice(0, 15);
  if (corr.length) {
    lines.push("", "Correcciones aprendidas (prioridad alta):");
    corr.forEach((c) => {
      lines.push(`- Cuando: «${c.when}» → Responder/mejorar: «${c.prefer}»`);
    });
  }

  return lines.join("\n");
}

function buildUserPrompt(input: {
  message: string;
  contactName?: string;
  faqContext: string;
  history?: HistoryItem[];
}) {
  const hist = (input.history || [])
    .slice(-6)
    .map((m) => `${m.direction === "out" ? "Empresa" : "Cliente"}: ${m.text}`)
    .join("\n");

  return [
    input.contactName ? `Contacto: ${input.contactName}` : "",
    hist ? `Historial reciente:\n${hist}` : "",
    "",
    "Mensaje actual del cliente:",
    input.message,
    "",
    "=== BASE DE CONOCIMIENTO (FAQ Punto Pago) ===",
    input.faqContext,
    "",
    "Genera la respuesta según el esquema.",
  ].filter(Boolean).join("\n");
}

export async function POST(request: Request) {
  if (!isWhatsappAgentAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const apiKey = resolveGoogleApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Gemini no configurado en el FAQ." },
      { status: 503 },
    );
  }

  let body: {
    ai?: AiSettings;
    corrections?: Correction[];
    message?: string;
    contactName?: string;
    faqContext?: string;
    history?: HistoryItem[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const message = String(body.message || "").trim();
  if (!message) {
    return NextResponse.json({ ok: false, error: "Falta message." }, { status: 400 });
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const system = buildSystemPrompt(body.ai || {}, body.corrections || []);
  const prompt = buildUserPrompt({
    message,
    contactName: body.contactName,
    faqContext: body.faqContext || "(Sin contexto FAQ.)",
    history: body.history,
  });

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      system,
      prompt,
      schema: responseSchema,
      temperature: 0.25,
    });

    return NextResponse.json({
      ok: true,
      reply: String(object.reply || "").trim().slice(0, 900),
      escalate: Boolean(object.escalate),
      escalationReason: String(object.escalationReason || "").trim(),
      confidence: Math.max(0, Math.min(1, Number(object.confidence) || 0)),
      sources: Array.isArray(object.sources) ? object.sources.map(String) : [],
      internalNote: String(object.internalNote || "").trim(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error Gemini.";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
