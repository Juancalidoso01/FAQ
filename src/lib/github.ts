const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "Juancalidoso01";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "FAQ";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

type GithubFile = { content: string; sha: string };

export function githubRequest(path: string, token: string, init?: RequestInit) {
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

/** Lee un JSON dentro de content/ y devuelve su contenido + sha (para sobreescribir). */
export async function readJsonFile<T>(
  file: string,
  token: string,
): Promise<{ data: T; sha: string }> {
  const res = await githubRequest(`contents/content/${file}?ref=${GITHUB_BRANCH}`, token);
  if (!res.ok) {
    throw new Error(`No se pudo leer content/${file} (${res.status}).`);
  }
  const json = (await res.json()) as GithubFile;
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded) as T, sha: json.sha };
}

/** Lee un JSON; devuelve null si el archivo aún no existe en el repo. */
export async function readJsonFileOptional<T>(
  file: string,
  token: string,
): Promise<{ data: T; sha: string } | null> {
  const res = await githubRequest(`contents/content/${file}?ref=${GITHUB_BRANCH}`, token);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`No se pudo leer content/${file} (${res.status}).`);
  }
  const json = (await res.json()) as GithubFile;
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded) as T, sha: json.sha };
}

/** Sobreescribe (commit) un JSON dentro de content/. Si no hay sha, lo crea. */
export async function writeJsonFile(
  file: string,
  data: unknown,
  sha: string | null,
  message: string,
  token: string,
) {
  const content = Buffer.from(`${JSON.stringify(data, null, 2)}\n`, "utf-8").toString("base64");
  const body: Record<string, unknown> = { message, content, branch: GITHUB_BRANCH };
  if (sha) body.sha = sha;
  const res = await githubRequest(`contents/content/${file}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`No se pudo guardar content/${file} (${res.status}): ${detail.slice(0, 200)}`);
  }
}
