"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type SectionAccordionPanel = {
  id: string;
  title: string;
  description?: string;
  items: Array<{ title: string; href: string }>;
};

export function SectionAccordion({ sections }: { sections: SectionAccordionPanel[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && sections.some((section) => section.id === hash)) {
        setOpenId(hash);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [sections]);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
      {sections.map((section) => {
        const isOpen = openId === section.id;
        return (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : section.id)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80"
              aria-expanded={isOpen}
            >
              <span>
                <span className="block font-semibold text-[#0B0B13]">{section.title}</span>
                {section.description && (
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                    {section.description}
                  </span>
                )}
              </span>
              <span
                className={`mt-1 shrink-0 text-[#4749B6] transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen && (
              <ul className="border-t border-slate-100 px-5 pb-4 pt-2">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block py-2.5 text-sm font-medium text-[#4749B6] hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
