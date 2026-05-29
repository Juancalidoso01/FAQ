import type { Metadata } from "next";
import { RedactarClient } from "@/components/RedactarClient";
import { getTaxonomy } from "@/lib/content-sources";
import { redactorRequiresPassword } from "@/lib/redactar-access";

export const metadata: Metadata = {
  title: "Redactar guía con IA",
  description: "Herramienta interna para crear artículos del Centro de Ayuda con ayuda de IA.",
  robots: { index: false, follow: false },
};

export default function RedactarPage() {
  const taxonomy = getTaxonomy()
    .filter((c) => c.audience !== "general" || c.articleCount > 0)
    .map((c) => ({ slug: c.slug, title: c.title, audience: c.audience }));

  return <RedactarClient taxonomy={taxonomy} requiresPassword={redactorRequiresPassword()} />;
}
