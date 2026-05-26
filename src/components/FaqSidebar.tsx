"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { articlePath, categoryPath, getAllCategories } from "@/lib/faq";

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

export function FaqSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const { intercom, comercios } = useMemo(() => {
    const all = getAllCategories();
    return {
      intercom: all.filter((c) => !c.slug.startsWith("cuotas-")),
      comercios: all.filter((c) => c.slug.startsWith("cuotas-")),
    };
  }, []);

  const activeCategorySlug = useMemo(() => {
    const match = pathname.match(/^\/(?:categoria|articulo)\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeCategorySlug) {
      setExpanded((prev) => ({ ...prev, [activeCategorySlug]: true }));
    }
  }, [activeCategorySlug]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const toggle = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const renderGroup = (title: string, items: ReturnType<typeof getAllCategories>) => (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((category) => {
          const isOpen = expanded[category.slug] ?? false;
          const isActiveCategory = activeCategorySlug === category.slug;

          return (
            <li key={category.slug}>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => toggle(category.slug)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Contraer" : "Expandir"} ${category.title}`}
                >
                  <Chevron open={isOpen} />
                </button>
                <Link
                  href={categoryPath(category.slug)}
                  className={`min-w-0 flex-1 truncate rounded-lg px-2 py-1.5 text-sm font-medium transition ${
                    isActiveCategory && pathname.startsWith("/categoria/")
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {category.title}
                </Link>
              </div>

              {isOpen && category.articles.length > 0 && (
                <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                  {category.articles.map((article) => {
                    const href = articlePath(category.slug, article.slug);
                    const isActive = pathname === href;

                    return (
                      <li key={article.slug}>
                        <Link
                          href={href}
                          className={`block rounded-md px-2 py-1.5 text-[13px] leading-snug transition ${
                            isActive
                              ? "bg-[#4749B6]/10 font-medium text-[#4749B6]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {article.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

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
        className={`faq-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(100vw,18.5rem)] flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:z-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navegación del centro de ayuda"
      >
        <div className="flex h-14 shrink-0 items-center border-b border-slate-200 px-4">
          <Link href="/" className="min-w-0 truncate text-sm font-semibold text-slate-900">
            Centro de ayuda
          </Link>
          <span className="ml-1 truncate text-sm text-slate-500">· Punto Pago</span>
        </div>

        <div className="border-b border-slate-100 px-3 py-3">
          <SearchBox compact />
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {renderGroup("Ayuda general", intercom)}
          {comercios.length > 0 && renderGroup("Cuotas para comercios", comercios)}
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
