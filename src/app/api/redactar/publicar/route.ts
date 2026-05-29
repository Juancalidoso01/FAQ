import { NextResponse } from "next/server";
import type { FaqData } from "@/lib/faq";
import { COMMUNITY_FILE, getFileForCategory } from "@/lib/content-sources";
import { isRedactorAuthorized } from "@/lib/redactar-access";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "Juancalidoso01";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "FAQ";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

type GithubFile = { content: string; sha: string };

async function githubRequest(path: string, token: string, init?: RequestInit) {
  return fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

async function readContentFile(file: string, token: string): Promise<{ data: FaqData; sha: string }> {
  const res = await githubRequest(`contents/content/${file}?ref=${GITHUB_BRANCH}`, token);
  if (!res.ok) {
    throw new Error(`No se pudo leer content/${file} (${res.status}).`);
  }
  const json = (await res.json()) as GithubFile;
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded) as FaqData, sha: json.sha };
}

async function writeContentFile(
  file: string,
  data: FaqData,
  sha: string,
  message: string,
  token: string,
) {
  const content = Buffer.from(`${JSON.stringify(data, null, 2)}\n`, "utf-8").toString("base64");
  const res = await githubRequest(`contents/content/${file}`, token, {
    method: "PUT",
    body: JSON.stringify({ message, content, sha, branch: GITHUB_BRANCH }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`No se pudo guardar content/${file} (${res.status}): ${detail.slice(0, 200)}`);
  }
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base || "guia";
  let n = 2;
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export async function POST(request: Request) {
  if (!isRedactorAuthorized(request)) {
    return NextResponse.json({ error: "Clave de acceso incorrecta." }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Falta configurar GITHUB_TOKEN en el entorno para publicar." },
      { status: 503 },
    );
  }

  let body: {
    titulo?: string;
    descripcion?: string;
    contenidoMarkdown?: string;
    slug?: string;
    esNuevaCategoria?: boolean;
    categoriaSlug?: string;
    categoriaNuevaTitulo?: string;
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
    return NextResponse.json({ error: "Faltan el título o el contenido." }, { status: 400 });
  }

  const esNueva = Boolean(body.esNuevaCategoria);
  let targetFile: string;
  let categorySlug: string;

  if (esNueva) {
    targetFile = COMMUNITY_FILE;
    categorySlug = slugify(body.categoriaNuevaTitulo || titulo) || "general";
  } else {
    categorySlug = (body.categoriaSlug ?? "").trim();
    const file = getFileForCategory(categorySlug);
    if (!file) {
      return NextResponse.json(
        { error: `La categoría "${categorySlug}" no existe. Marca "nueva categoría" o elige otra.` },
        { status: 400 },
      );
    }
    targetFile = file;
  }

  try {
    const { data, sha } = await readContentFile(targetFile, token);

    let category = data.categories.find((c) => c.slug === categorySlug);
    if (!category) {
      if (!esNueva) {
        return NextResponse.json(
          { error: `La categoría "${categorySlug}" no se encontró en ${targetFile}.` },
          { status: 400 },
        );
      }
      category = {
        slug: categorySlug,
        title: (body.categoriaNuevaTitulo || titulo).trim(),
        description: descripcion,
        icon: "folder",
        articles: [],
      };
      data.categories.push(category);
    }

    const takenSlugs = new Set(category.articles.map((a) => a.slug));
    const articleSlug = uniqueSlug(slugify(body.slug || titulo), takenSlugs);

    category.articles.push({
      id: `${categorySlug}-${articleSlug}`,
      slug: articleSlug,
      title: titulo,
      description: descripcion,
      content: contenido,
      updatedAt: new Date().toISOString(),
      team: true,
    });

    await writeContentFile(
      targetFile,
      data,
      sha,
      `FAQ: agrega "${titulo}" en ${categorySlug}`,
      token,
    );

    return NextResponse.json({
      ok: true,
      path: `/articulo/${categorySlug}/${articleSlug}`,
      categorySlug,
      articleSlug,
    });
  } catch (error) {
    console.error("Error al publicar:", error);
    const message = error instanceof Error ? error.message : "Error desconocido al publicar.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
