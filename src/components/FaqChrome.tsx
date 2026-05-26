"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PpAmbient } from "@/components/PpAmbient";

const BUSINESS_HUB_URL = "https://puntopago.net/business/paymentshub/";

export function FaqChrome({ children }: { children: ReactNode }) {
  return (
    <div className="pp-page-bg relative min-h-screen">
      <PpAmbient />
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 shadow-sm shadow-slate-900/[0.04] backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
          <Link href="/" className="group flex min-w-0 flex-1 items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4749B6] to-[#3B3DA6] text-sm font-bold text-white shadow-md shadow-[#4749B6]/30 ring-1 ring-white/20 transition duration-300 group-hover:scale-105 group-hover:shadow-lg"
              aria-hidden
            >
              PP
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[15px] font-bold tracking-tight text-[#0B0B13]">
                Punto Pago
              </span>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-500">
                Centro de ayuda
              </span>
            </span>
          </Link>
          <nav className="flex shrink-0 flex-wrap items-center justify-end gap-1" aria-label="Principal">
            <Link
              href="/"
              className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#4749B6] sm:px-3 sm:text-sm"
            >
              Inicio
            </Link>
            <Link
              href="/buscar"
              className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#4749B6] sm:px-3 sm:text-sm"
            >
              Buscar
            </Link>
            <a
              href="https://comercios.puntopago.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#4749B6] sm:px-3 sm:text-sm"
            >
              Comercios
            </a>
            <a
              href={BUSINESS_HUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#4749B6] sm:px-3 sm:text-sm"
            >
              Negocios
            </a>
            <a
              href="https://puntopago.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#4749B6] sm:px-3 sm:text-sm"
            >
              puntopago.net
            </a>
          </nav>
        </div>
        <div
          className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#4749B6]/40 to-transparent"
          aria-hidden
        />
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        {children}
      </main>

      <footer className="relative z-0 border-t border-white/50 bg-white/55 py-8 text-center text-xs text-slate-500 backdrop-blur-md">
        <p>
          <span className="font-medium text-slate-600">Grupo Punto Pago</span>
          {" · "}
          Centro de ayuda ·{" "}
          <a
            href="https://puntopago.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#4749B6] underline-offset-2 hover:underline"
          >
            puntopago.net
          </a>
        </p>
        <p className="mt-2">
          Soporte:{" "}
          <a href="tel:+5073993999" className="text-[#4749B6] hover:underline">
            +507 399-3999
          </a>
          {" · "}
          <a
            href="https://wa.me/50768252816"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4749B6] hover:underline"
          >
            WhatsApp
          </a>
        </p>
      </footer>
    </div>
  );
}
