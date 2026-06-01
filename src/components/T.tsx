"use client";

import { useLang } from "@/components/LanguageProvider";
import { RU } from "@/lib/i18n/dictionary";
import { buildTitleMaps } from "@/lib/translations";

// Mapas de títulos de contenido ya traducidos (livianos: solo guías traducidas).
const TITLE_MAPS = buildTitleMaps();

/**
 * Hook que devuelve una función de traducción de interfaz.
 * - En ruso: usa el diccionario de interfaz y, si no, el título traducido al ruso.
 * - En español: para guías redactadas en ruso, muestra su título en español.
 * Si no hay traducción, devuelve el texto original (degradación segura).
 */
export function useT(): (es: string) => string {
  const { lang } = useLang();
  return (text: string) => {
    if (lang === "ru") return RU[text] ?? TITLE_MAPS.ru[text] ?? text;
    return TITLE_MAPS.es[text] ?? text;
  };
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
