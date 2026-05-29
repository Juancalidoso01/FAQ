"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import {
  CLIENTE_HUB_ANCHORS,
  EMPRESA_HUB_ANCHORS,
  getAudienceForCategory,
  getNavGroupIdForArticle,
  getSidebarNav,
  type FaqAudience,
  type SidebarEntry,
} from "@/lib/navigation";

function AudienceTabs({
  active,
  onSelect,
}: {
  active: FaqAudience | null;
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

function sidebarEntryKey(entry: SidebarEntry, index: number) {
  if (entry.type === "heading") return `heading-${entry.label}-${index}`;
  return `link-${entry.hubId ?? entry.href}-${entry.title}-${index}`;
}

function SidebarLink({
  entry,
  pathname,
  activeHubId,
}: {
  entry: Extract<SidebarEntry, { type: "link" }>;
  pathname: string;
  activeHubId: string | null;
}) {
  const isHubActive =
    entry.hubId === "hub"
      ? (pathname === "/clientes" || pathname === "/empresas") && !activeHubId
      : entry.hubId === "home"
        ? pathname === "/"
        : entry.hubId === "cliente-portal"
          ? pathname === "/clientes" && !activeHubId
          : entry.hubId === "empresa-portal"
            ? pathname === "/empresas" && !activeHubId
            : entry.hubId != null && activeHubId === entry.hubId;

  const isArticleActive =
    !entry.external &&
    !entry.hubId &&
    (pathname === entry.href ||
      (entry.href.startsWith("/articulo/") && pathname === entry.href));

  const isActive = isHubActive || isArticleActive;

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
  const [hashAnchor, setHashAnchor] = useState<string | null>(null);

  const activeCategorySlug = useMemo(() => {
    const match = pathname.match(/^\/(?:categoria|articulo)\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const activeArticleSlug = useMemo(() => {
    const match = pathname.match(/^\/articulo\/[^/]+\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const contentAudience = useMemo((): FaqAudience => {
    if (pathname === "/empresas") return "empresa";
    if (pathname === "/clientes") return "cliente";
    if (activeCategorySlug) return getAudienceForCategory(activeCategorySlug);
    return "cliente";
  }, [pathname, activeCategorySlug]);

  const tabAudience = useMemo((): FaqAudience | null => {
    if (pathname === "/empresas") return "empresa";
    if (pathname === "/clientes") return "cliente";
    if (pathname === "/" || pathname.startsWith("/buscar")) return null;
    if (activeCategorySlug) return getAudienceForCategory(activeCategorySlug);
    return null;
  }, [pathname, activeCategorySlug]);

  useEffect(() => {
    const readHash = () => {
      const anchor = window.location.hash.replace("#", "");
      setHashAnchor(anchor || null);
    };
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  }, [pathname]);

  const activeHubId = useMemo(() => {
    if (pathname === "/clientes" && hashAnchor) {
      const match = Object.entries(CLIENTE_HUB_ANCHORS).find(([, anchor]) => anchor === hashAnchor);
      return match?.[0] ?? null;
    }
    if (pathname === "/empresas" && hashAnchor) {
      const match = Object.entries(EMPRESA_HUB_ANCHORS).find(([, anchor]) => anchor === hashAnchor);
      return match?.[0] ?? null;
    }
    if (activeCategorySlug && activeArticleSlug) {
      return getNavGroupIdForArticle(activeCategorySlug, activeArticleSlug) ?? null;
    }
    return null;
  }, [pathname, hashAnchor, activeCategorySlug, activeArticleSlug]);

  const navEntries = useMemo(
    () => getSidebarNav(contentAudience, activeCategorySlug, activeArticleSlug, pathname),
    [contentAudience, activeCategorySlug, activeArticleSlug, pathname],
  );

  const handleAudienceSelect = (audience: FaqAudience) => {
    const href = audience === "cliente" ? "/clientes" : "/empresas";
    if (pathname !== href) {
      router.push(href);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

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
        className={`faq-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(100vw,17.5rem)] flex-col border-r border-slate-200 bg-white transition-transform lg:relative lg:sticky lg:top-0 lg:z-20 lg:shrink-0 lg:translate-x-0 lg:self-start ${
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
          <AudienceTabs active={tabAudience} onSelect={handleAudienceSelect} />
        </div>

        <nav key={`${pathname}-${contentAudience}`} className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {navEntries.map((entry, index) => {
              if (entry.type === "heading") {
                return (
                  <li
                    key={sidebarEntryKey(entry, index)}
                    className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400 first:pt-1"
                  >
                    {entry.label}
                  </li>
                );
              }
              return (
                <li key={sidebarEntryKey(entry, index)}>
                  <SidebarLink entry={entry} pathname={pathname} activeHubId={activeHubId} />
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-slate-200 px-3 py-3">
          <Link
            href="/redactar"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#4749B6] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3b3da6]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Agregar contenido
          </Link>
          <p className="mt-1.5 text-center text-[11px] text-slate-400">Para el equipo Punto Pago</p>
        </div>

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
