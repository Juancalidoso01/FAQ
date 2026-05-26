"use client";

import { useState } from "react";
import Link from "next/link";

export type FaqAccordionItem = {
  question: string;
  answer: string;
  href?: string;
};

export function FaqAccordion({ items }: { items: FaqAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pp-faq-accordion divide-y divide-slate-200/90 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[#0B0B13]">{item.question}</span>
              <span
                className={`mt-0.5 shrink-0 text-[#4749B6] transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                <p>{item.answer}</p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex text-sm font-semibold text-[#4749B6] hover:underline"
                  >
                    Leer guía completa →
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
