"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaqSidebar } from "@/components/FaqSidebar";
import { PpAmbient } from "@/components/PpAmbient";

export function FaqChrome({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const pathname = usePathname();
  const isWideHub = pathname === "/" || pathname === "/clientes" || pathname === "/empresas";

  return (
    <div className="pp-page-bg faq-shell relative flex min-h-screen items-start bg-[#fafafa] text-[#0B0B13]">
      <PpAmbient subtle={pathname !== "/"} />
      <FaqSidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-white/70 bg-white/75 px-4 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm hover:bg-white"
            aria-label="Abrir menú de navegación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#0B0B13]">Centro de ayuda</span>
          <Link
            href="/redactar"
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[#4749B6] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#3b3da6]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Agregar
          </Link>
        </div>

        <main className="faq-main flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div
            key={pathname}
            className={`faq-main-inner mx-auto w-full ${isWideHub ? "max-w-6xl" : "max-w-3xl"}`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
