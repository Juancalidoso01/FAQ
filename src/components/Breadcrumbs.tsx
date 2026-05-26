import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/navigation";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length <= 1) return null;

  return (
    <nav aria-label="Ruta de navegación" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.href}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="text-slate-300" aria-hidden>
                  /
                </span>
              )}
              {isLast ? (
                <span className="font-medium text-slate-700" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[#4749B6] hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
