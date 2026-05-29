import overridesData from "../../content/menu-overrides.json";
import type { FaqNavItem } from "@/lib/navigation";

export const MENU_OVERRIDES_FILE = "menu-overrides.json";

export type MenuOverrides = {
  /** groupId -> lista ordenada y completa de claves "categorySlug/articleSlug". */
  groups: Record<string, string[]>;
  /** clave "categorySlug/articleSlug" -> etiqueta corta a mostrar en el menú. */
  labels: Record<string, string>;
};

export type SimpleGroup = { id: string; title: string; items: FaqNavItem[] };

export type OrganizedMenu = {
  groups: SimpleGroup[];
  /** Guías del equipo que aún no fueron ubicadas en ningún grupo. */
  unplaced: FaqNavItem[];
};

export function navKey(item: { categorySlug: string; articleSlug: string }): string {
  return `${item.categorySlug}/${item.articleSlug}`;
}

export function loadMenuOverrides(): MenuOverrides {
  const raw = overridesData as Partial<MenuOverrides>;
  return {
    groups: raw.groups ?? {},
    labels: raw.labels ?? {},
  };
}

export function emptyMenuOverrides(): MenuOverrides {
  return { groups: {}, labels: {} };
}

/**
 * Reorganiza los grupos curados aplicando las ubicaciones manuales.
 * No muta la entrada. Las guías sin ubicación manual conservan su grupo natural.
 */
export function organizeMenu(
  baseGroups: SimpleGroup[],
  teamItems: FaqNavItem[],
  overrides: MenuOverrides,
): OrganizedMenu {
  const labelOf = (item: FaqNavItem): FaqNavItem => {
    const label = overrides.labels[navKey(item)];
    return label ? { ...item, title: label } : item;
  };

  // Pool global de artículos disponibles para ubicar.
  const pool = new Map<string, FaqNavItem>();
  for (const group of baseGroups) {
    for (const item of group.items) pool.set(navKey(item), item);
  }
  for (const item of teamItems) pool.set(navKey(item), item);

  // Asignación manual: clave -> groupId (primera ocurrencia gana).
  const assigned = new Map<string, string>();
  for (const [groupId, keys] of Object.entries(overrides.groups)) {
    for (const key of keys) {
      if (!assigned.has(key)) assigned.set(key, groupId);
    }
  }

  const hasOverrides = assigned.size > 0;

  const groups: SimpleGroup[] = baseGroups.map((group) => {
    if (!hasOverrides) {
      return { ...group, items: group.items.map(labelOf) };
    }

    const list = overrides.groups[group.id] ?? [];
    const seen = new Set<string>();
    const items: FaqNavItem[] = [];

    // 1) Ubicadas manualmente en este grupo, en el orden indicado.
    for (const key of list) {
      if (assigned.get(key) !== group.id) continue;
      const item = pool.get(key);
      if (!item || seen.has(key)) continue;
      items.push(item);
      seen.add(key);
    }

    // 2) Guías naturales del grupo que nadie movió (ej. nuevas guías curadas
    //    agregadas por código que aún no están en el override).
    for (const item of group.items) {
      const key = navKey(item);
      if (assigned.has(key) || seen.has(key)) continue;
      items.push(item);
      seen.add(key);
    }

    return { ...group, items: items.map(labelOf) };
  });

  const unplaced = teamItems
    .filter((item) => !assigned.has(navKey(item)))
    .map(labelOf);

  return { groups, unplaced };
}
