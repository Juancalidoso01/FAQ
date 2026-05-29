import type { Metadata } from "next";
import { MenuOrganizer, type OrganizerBoard } from "@/components/MenuOrganizer";
import { loadMenuOverrides, navKey } from "@/lib/menu-overrides";
import { getOrganizedMenu } from "@/lib/navigation";
import { redactorRequiresPassword } from "@/lib/redactar-access";

export const metadata: Metadata = {
  title: "Organizar el menú",
  description: "Herramienta interna para ordenar y ubicar las guías del Centro de Ayuda.",
  robots: { index: false, follow: false },
};

const AUDIENCES = [
  { id: "cliente" as const, label: "Clientes" },
  { id: "empresa" as const, label: "Empresas" },
];

export default function OrganizarPage() {
  const boards: OrganizerBoard[] = AUDIENCES.map(({ id, label }) => {
    const menu = getOrganizedMenu(id);
    return {
      audience: id,
      label,
      groups: menu.groups.map((group) => ({
        id: group.id,
        title: group.title,
        items: group.items.map((item) => ({
          key: navKey(item),
          title: item.title,
          href: item.href,
        })),
      })),
      unplaced: menu.unplaced.map((item) => ({
        key: navKey(item),
        title: item.title,
        href: item.href,
      })),
    };
  });

  return (
    <MenuOrganizer
      boards={boards}
      labels={loadMenuOverrides().labels}
      requiresPassword={redactorRequiresPassword()}
    />
  );
}
