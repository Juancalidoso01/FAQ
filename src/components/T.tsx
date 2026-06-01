"use client";

import { useLang } from "@/components/LanguageProvider";
import { RU } from "@/lib/i18n/dictionary";

/** Hook que devuelve una función de traducción de interfaz (ES → RU). */
export function useT(): (es: string) => string {
  const { lang } = useLang();
  return (es: string) => (lang === "ru" ? (RU[es] ?? es) : es);
}

/**
 * Traduce un texto de interfaz. Renderiza el español (children) por defecto y
 * lo cambia a ruso solo en el navegador del equipo con idioma ruso activo.
 * Es seguro usarlo dentro de componentes de servidor.
 */
export function T({ children }: { children: string }) {
  const t = useT();
  return <>{t(children)}</>;
}
