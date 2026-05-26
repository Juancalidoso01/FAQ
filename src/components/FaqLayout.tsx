import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4749B6]">{eyebrow}</p>
        )}
        <h2 id={id} className="mt-1 text-xl font-bold tracking-tight text-[#0B0B13] sm:text-2xl">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ContentPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`pp-content-panel rounded-2xl border border-white/80 bg-white/85 p-6 shadow-sm shadow-slate-900/[0.04] backdrop-blur-sm sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
