"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { SearchBox } from "@/components/SearchBox";
import {
  getAudienceForCategory,
  getSidebarNav,
  type FaqAudience,
  type SidebarEntry,
} from "@/lib/navigation";

function AudienceTabs({
  active,
  onSelect,
}: {
  active: FaqAudience;
  onSelect: (audience: FaqAudience) => void;
}) {
  const tabs: { id: FaqAudience; label: string }[] = [
    { id: "cliente", label: "Clientes" },
    { id: "empresa", label: "Empresas" },
  ];

  return (
    <div className="flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Tipo de usuario">
      {tabs.map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              selected
                ? "bg-white text-[#0B0B13] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function SidebarLink({
  entry,
  pathname,
}: {
  entry: Extract<SidebarEntry, { type: "link" }>;
  pathname: string;
}) {
  const isActive =
    !entry.external &&
    (pathname === entry.href ||
      (entry.href.startsWith("/articulo/") && pathname === entry.href));
  const className = `block rounded-md px-3 py-2 text-sm leading-snug transition ${
    isActive
      ? "bg-[#4749B6]/10 font-medium text-[#4749B6]"
      : "text-slate-700 hover:bg-slate-50 hover:text-[#0B0B13]"
  }`;

  if (entry.external) {
    return (
      <a
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {entry.title}
        <span className="ml-1 text-slate-400" aria-hidden>
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link href={entry.href} className={className} aria-current={isActive ? "page" : undefined}>
      {entry.title}
    </Link>
  );
}

export function FaqSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const activeCategorySlug = useMemo(() => {
    const match = pathname.match(/^\/(?:categoria|articulo)\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const audience = useMemo((): FaqAudience => {
    if (pathname === "/empresas") return "empresa";
    if (pathname === "/clientes") return "cliente";
    if (activeCategorySlug) return getAudienceForCategory(activeCategorySlug);
    return "cliente";
  }, [pathname, activeCategorySlug]);

  const navEntries = useMemo(
    () => getSidebarNav(audience, activeCategorySlug),
    [audience, activeCategorySlug],
  );

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`faq-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(100vw,17.5rem)] flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:z-20 lg:translate-x-0 ${
          open ? "translate-x-0 shadow-xl" : "-translate-x-full lg:shadow-none"
        }`}
        aria-label="Navegación del centro de ayuda"
      >
        <div className="flex h-14 shrink-0 items-center border-b border-slate-200 px-4">
          <Link href="/" className="font-semibold text-[#0B0B13] hover:text-[#4749B6]">
            Centro de ayuda
          </Link>
        </div>

        <div className="border-b border-slate-100 px-3 py-3">
          <SearchBox compact />
        </div>

        <div className="border-b border-slate-100 px-3 py-3">
          <AudienceTabs
            active={audience}
            onSelect={(id) => router.push(id === "cliente" ? "/clientes" : "/empresas")}
          />
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {navEntries.map((entry, index) => {
              if (entry.type === "heading") {
                return (
                  <li
                    key={`${entry.label}-${index}`}
                    className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400 first:pt-1"
                  >
                    {entry.label}
                  </li>
                );
              }
              return (
                <li key={entry.href}>
                  <SidebarLink entry={entry} pathname={pathname} />
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <a
            href="https://puntopago.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#4749B6] hover:underline"
          >
            puntopago.net
          </a>
          {" · "}
          <a href="tel:+5073993999" className="hover:text-slate-700">
            +507 399-3999
          </a>
        </div>
      </aside>
    </>
  );
}
