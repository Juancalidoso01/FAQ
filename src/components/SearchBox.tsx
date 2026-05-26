"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox({
  defaultValue = "",
  large = false,
  compact = false,
}: {
  defaultValue?: string;
  large?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/buscar?q=${encodeURIComponent(q)}` : "/buscar");
  };

  return (
    <form onSubmit={onSubmit} role="search" aria-label="Buscar en el centro de ayuda">
      <label htmlFor="faq-search" className="sr-only">
        Buscar artículos
      </label>
      <div
        className={`relative ${large ? "mx-auto max-w-xl" : ""} ${!compact && !large ? "" : ""}`}
      >
        <input
          id="faq-search"
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={large ? "Buscar en el centro de ayuda…" : "Buscar…"}
          className={`w-full border border-slate-200/90 bg-white/95 text-[#0B0B13] shadow-sm placeholder:text-slate-400 focus:border-[#4749B6]/50 focus:outline-none focus:ring-2 focus:ring-[#4749B6]/20 ${
            compact
              ? "rounded-xl py-2 pl-3 pr-9 text-sm"
              : large
                ? "rounded-2xl py-4 pl-5 pr-28 text-base sm:text-lg"
                : "rounded-xl px-4 py-2.5 pr-24 text-sm"
          }`}
        />
        <button
          type="submit"
          className={`absolute top-1/2 -translate-y-1/2 font-semibold transition ${
            compact
              ? "right-1.5 rounded-lg px-2 py-1 text-[#4749B6] hover:bg-slate-100"
              : large
                ? "pp-btn-primary right-2 px-5 py-2.5 text-sm"
                : "pp-btn-primary right-1.5 px-4 py-1.5 text-xs"
          }`}
          aria-label="Buscar"
        >
          {compact ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            "Buscar"
          )}
        </button>
      </div>
    </form>
  );
}
