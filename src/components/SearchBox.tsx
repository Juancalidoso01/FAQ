"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox({
  defaultValue = "",
  large = false,
}: {
  defaultValue?: string;
  large?: boolean;
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
      <div className={`relative ${large ? "max-w-2xl mx-auto" : ""}`}>
        <input
          id="faq-search"
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar artículos…"
          className={`w-full rounded-2xl border border-slate-200/90 bg-white/95 text-[#0B0B13] shadow-sm ring-1 ring-slate-200/50 placeholder:text-slate-400 focus:border-[#4749B6]/40 focus:outline-none focus:ring-2 focus:ring-[#4749B6]/25 ${
            large ? "px-5 py-4 text-base sm:text-lg" : "px-4 py-2.5 text-sm"
          }`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#4749B6] font-semibold text-white shadow-md shadow-[#4749B6]/25 transition hover:bg-[#3B3DA6] ${
            large ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs"
          }`}
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
