"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import {
  getAudienceForCategory,
  getNavSections,
  type FaqNavGroupResolved,
  type FaqNavLink,
} from "@/lib/navigation";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function NavLinks({ links }: { links: FaqNavLink[] }) {
  return (
    <ul className="mt-1 space-y-0.5 border-l border-slate-200 pl-3">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="block rounded-md px-2 py-1.5 text-[13px] text-slate-500 transition hover:bg-slate-50 hover:text-[#4749B6]"
          >
            {link.title}
            {link.external ? " ↗" : ""}
          </a>
        </li>
      ))}
    </ul>
  );
}

function NavGroup({
  group,
  isOpen,
  onToggle,
  pathname,
  activeCategorySlug,
}: {
  group: FaqNavGroupResolved;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  activeCategorySlug: string | null;
}) {
  const hasActiveArticle = group.items.some((item) => pathname === item.href);
  const isActiveGroup = hasActiveArticle || group.items.some((i) => i.categorySlug === activeCategorySlug);

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-left text-sm font-medium transition ${
          isActiveGroup ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-50"
        }`}
        aria-expanded={isOpen}
      >
        <Chevron open={isOpen} />
        <span className="min-w-0 flex-1 truncate">{group.title}</span>
      </button>

      {isOpen && (
        <div className="ml-3 space-y-2 pb-1">
          {group.subgroups.map((subgroup) =>
            subgroup.items.length > 0 ? (
              <div key={subgroup.id}>
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {subgroup.title}
                </p>
                <ul className="space-y-0.5 border-l border-slate-200 pl-3">
                  {subgroup.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block rounded-md px-2 py-1.5 text-[13px] leading-snug transition ${
                            isActive
                              ? "bg-[#4749B6]/10 font-medium text-[#4749B6]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null,
          )}
          {group.links && group.links.length > 0 && <NavLinks links={group.links} />}
        </div>
      )}
    </li>
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
  const sections = useMemo(() => getNavSections(), []);

  const activeCategorySlug = useMemo(() => {
    const match = pathname.match(/^\/(?:categoria|articulo)\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const activeAudience = useMemo(() => {
    if (pathname === "/empresas") return "empresa";
    if (pathname === "/clientes") return "cliente";
    if (activeCategorySlug) return getAudienceForCategory(activeCategorySlug);
    return "cliente";
  }, [pathname, activeCategorySlug]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cliente: true,
    empresa: false,
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpandedSections((prev) => ({
      ...prev,
      [activeAudience]: true,
    }));
  }, [activeAudience]);

  useEffect(() => {
    if (!activeCategorySlug) return;
    for (const section of sections) {
      for (const group of section.groups) {
        const matches =
          group.items.some((i) => i.categorySlug === activeCategorySlug) ||
          pathname !== "/" && group.items.some((i) => i.href === pathname);
        if (matches) {
          setExpandedGroups((prev) => ({ ...prev, [group.id]: true }));
        }
      }
    }
  }, [activeCategorySlug, pathname, sections]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px] transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        className={`faq-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(100vw,19rem)] flex-col border-r border-white/70 bg-white/80 shadow-xl shadow-slate-900/[0.06] backdrop-blur-xl transition-transform lg:static lg:z-20 lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navegación del centro de ayuda"
      >
        <div className="flex h-14 shrink-0 items-center border-b border-slate-200/70 px-4">
          <Link href="/" className="text-sm font-bold text-[#0B0B13]">
            Centro de ayuda
          </Link>
          <span className="ml-1 text-sm text-slate-500">· Punto Pago</span>
        </div>

        <div className="border-b border-slate-100/80 px-3 py-3">
          <SearchBox compact />
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {sections.map((section) => {
            const sectionOpen = expandedSections[section.id] ?? section.id === activeAudience;

            return (
              <div key={section.id} className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-left"
                  aria-expanded={sectionOpen}
                >
                  <Chevron open={sectionOpen} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {section.title}
                  </span>
                </button>

                {sectionOpen && (
                  <ul className="mt-1 space-y-0.5">
                    {section.groups.map((group) => (
                      <NavGroup
                        key={group.id}
                        group={group}
                        isOpen={expandedGroups[group.id] ?? false}
                        onToggle={() => toggleGroup(group.id)}
                        pathname={pathname}
                        activeCategorySlug={activeCategorySlug}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
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
