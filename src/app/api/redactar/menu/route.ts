import { NextResponse } from "next/server";
import { z } from "zod";
import { readJsonFileOptional, writeJsonFile } from "@/lib/github";
import { MENU_OVERRIDES_FILE, type MenuOverrides } from "@/lib/menu-overrides";
import { isRedactorAuthorized } from "@/lib/redactar-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  groups: z.record(z.string(), z.array(z.string())),
  labels: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: Request) {
  if (!isRedactorAuthorized(request)) {
    return NextResponse.json({ error: "Clave de acceso incorrecta." }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Falta configurar GITHUB_TOKEN en el entorno para guardar el orden." },
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
    return NextResponse.json({ error: "Datos del menú inválidos." }, { status: 400 });
  }

  // Limpia grupos vacíos para no inflar el archivo.
  const groups: Record<string, string[]> = {};
  for (const [groupId, keys] of Object.entries(parsed.data.groups)) {
    if (keys.length > 0) groups[groupId] = keys;
  }

  const overrides: MenuOverrides = {
    groups,
    labels: parsed.data.labels ?? {},
  };

  try {
    const existing = await readJsonFileOptional<MenuOverrides>(MENU_OVERRIDES_FILE, token);
    await writeJsonFile(
      MENU_OVERRIDES_FILE,
      overrides,
      existing?.sha ?? null,
      "FAQ: actualiza orden del menú lateral",
      token,
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al guardar el orden del menú:", error);
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
