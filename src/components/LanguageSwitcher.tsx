"use client";

import { useLang } from "@/components/LanguageProvider";

/** Selector ES/RU. Solo visible cuando el modo equipo está activo. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, teamMode, ready } = useLang();

  if (!ready || !teamMode) return null;

  const options: { id: "es" | "ru"; label: string }[] = [
    { id: "es", label: "ES" },
    { id: "ru", label: "RU" },
  ];

  return (
    <div
      className={`inline-flex items-center rounded-lg bg-slate-100 p-0.5 ${className}`}
      role="group"
      aria-label="Idioma / Язык"
    >
      {options.map((option) => {
        const active = lang === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLang(option.id)}
            aria-pressed={active}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              active ? "bg-white text-[#4749B6] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
