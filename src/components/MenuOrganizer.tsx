"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { useMemo, useState } from "react";

export type OrganizerItem = { key: string; title: string; href: string };
export type OrganizerGroup = { id: string; title: string; items: OrganizerItem[] };
export type OrganizerBoard = {
  audience: "cliente" | "empresa";
  label: string;
  groups: OrganizerGroup[];
  unplaced: OrganizerItem[];
};

const UNPLACED = "__unplaced";
const SEP = "::";

function containerId(audience: string, groupId: string) {
  return `${audience}${SEP}${groupId}`;
}

function parseContainer(id: string): { audience: string; groupId: string } {
  const [audience, groupId] = id.split(SEP);
  return { audience, groupId };
}

export function MenuOrganizer({
  boards,
  labels,
  requiresPassword,
}: {
  boards: OrganizerBoard[];
  labels: Record<string, string>;
  requiresPassword: boolean;
}) {
  // Mapa global de datos de cada guía.
  const itemData = useMemo(() => {
    const map: Record<string, OrganizerItem> = {};
    for (const board of boards) {
      for (const group of board.groups) for (const item of group.items) map[item.key] = item;
      for (const item of board.unplaced) map[item.key] = item;
    }
    return map;
  }, [boards]);

  // Estado de contenedores: containerId -> claves ordenadas.
  const initialContainers = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const board of boards) {
      for (const group of board.groups) {
        map[containerId(board.audience, group.id)] = group.items.map((i) => i.key);
      }
      map[containerId(board.audience, UNPLACED)] = board.unplaced.map((i) => i.key);
    }
    return map;
  }, [boards]);

  const [containers, setContainers] = useState<Record<string, string[]>>(initialContainers);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeAudience, setActiveAudience] = useState<"cliente" | "empresa">(
    boards[0]?.audience ?? "cliente",
  );

  const [unlocked, setUnlocked] = useState(!requiresPassword);
  const [clave, setClave] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const board = boards.find((b) => b.audience === activeAudience) ?? boards[0];

  function findContainer(key: string): string | undefined {
    if (containers[key]) return key; // ya es un id de contenedor
    return Object.keys(containers).find((cid) => containers[cid].includes(key));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveKey(String(event.active.id));
    setMessage(null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    const from = findContainer(activeId);
    const to = containers[overId] ? overId : findContainer(overId);
    if (!from || !to || from === to) return;

    setContainers((prev) => {
      const fromItems = [...prev[from]];
      const toItems = [...prev[to]];
      const fromIndex = fromItems.indexOf(activeId);
      if (fromIndex === -1) return prev;
      fromItems.splice(fromIndex, 1);
      const overIndex = toItems.indexOf(overId);
      const insertAt = overIndex === -1 ? toItems.length : overIndex;
      toItems.splice(insertAt, 0, activeId);
      return { ...prev, [from]: fromItems, [to]: toItems };
    });
    setDirty(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveKey(null);
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const from = findContainer(activeId);
    const to = containers[overId] ? overId : findContainer(overId);
    if (!from || !to) return;

    if (from === to) {
      const items = containers[from];
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setContainers((prev) => ({ ...prev, [from]: arrayMove(prev[from], oldIndex, newIndex) }));
        setDirty(true);
      }
    }
  }

  function authHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (requiresPassword && clave) headers["x-redactar-clave"] = clave;
    return headers;
  }

  function buildGroupsPayload(): Record<string, string[]> {
    const groups: Record<string, string[]> = {};
    for (const cid of Object.keys(containers)) {
      const { groupId } = parseContainer(cid);
      if (groupId === UNPLACED) continue;
      groups[groupId] = containers[cid];
    }
    return groups;
  }

  async function save(reset = false) {
    setSaving(true);
    setMessage(null);
    try {
      const payload = reset
        ? { groups: {}, labels: {} }
        : { groups: buildGroupsPayload(), labels };
      const res = await fetch("/api/redactar/menu", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar.");
      setDirty(false);
      setMessage({
        type: "ok",
        text: reset
          ? "Orden restaurado. Vercel desplegará los cambios en ~1 minuto."
          : "Orden guardado. Vercel desplegará los cambios en ~1 minuto.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (requiresPassword && !unlocked) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="text-xl font-bold text-[#0B0B13]">Organizar el menú</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ingresa la clave del equipo para continuar.
        </p>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Clave de acceso"
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => setUnlocked(clave.length > 0)}
          className="mt-3 w-full rounded-lg bg-[#4749B6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#3b3da6]"
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0B0B13]">
              Organizar el menú
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Arrastra las guías entre secciones para decidir dónde aparece cada una. Las
              guías nuevas comienzan en <strong>Sin ubicar</strong>.
            </p>
          </div>
          <Link
            href="/redactar"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Volver a redactar
          </Link>
        </div>
      </header>

      <div className="mb-5 flex items-center gap-2">
        {boards.map((b) => (
          <button
            key={b.audience}
            type="button"
            onClick={() => setActiveAudience(b.audience)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              activeAudience === b.audience
                ? "bg-[#4749B6] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Column
            id={containerId(board.audience, UNPLACED)}
            title="Sin ubicar (nuevas)"
            highlight
            keys={containers[containerId(board.audience, UNPLACED)] ?? []}
            itemData={itemData}
          />
          {board.groups.map((group) => (
            <Column
              key={group.id}
              id={containerId(board.audience, group.id)}
              title={group.title}
              keys={containers[containerId(board.audience, group.id)] ?? []}
              itemData={itemData}
            />
          ))}
        </div>

        <DragOverlay>
          {activeKey ? <CardBody title={itemData[activeKey]?.title ?? activeKey} dragging /> : null}
        </DragOverlay>
      </DndContext>

      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/90 py-4 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            if (confirm("¿Restaurar el orden original y borrar todas las ubicaciones manuales?")) {
              save(true);
            }
          }}
          disabled={saving}
          className="text-sm font-medium text-slate-500 underline hover:text-slate-700 disabled:opacity-50"
        >
          Restaurar orden original
        </button>
        <button
          type="button"
          onClick={() => save(false)}
          disabled={saving || !dirty}
          className="rounded-lg bg-[#4749B6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3b3da6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Guardando…" : dirty ? "Guardar orden" : "Sin cambios"}
        </button>
      </div>
    </div>
  );
}

function Column({
  id,
  title,
  keys,
  itemData,
  highlight,
}: {
  id: string;
  title: string;
  keys: string[];
  itemData: Record<string, OrganizerItem>;
  highlight?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <section
      className={`rounded-2xl border p-3 ${
        highlight ? "border-[#4749B6]/40 bg-[#4749B6]/[0.04]" : "border-slate-200 bg-white/80"
      } ${isOver ? "ring-2 ring-[#4749B6]/40" : ""}`}
    >
      <h2 className="mb-2 flex items-center justify-between px-1 text-sm font-semibold text-[#0B0B13]">
        <span>{title}</span>
        <span className="text-xs font-normal text-slate-400">{keys.length}</span>
      </h2>
      <SortableContext items={keys} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="min-h-16 space-y-2">
          {keys.length === 0 && (
            <li className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">
              Suelta guías aquí
            </li>
          )}
          {keys.map((key) => (
            <SortableCard key={key} id={key} title={itemData[key]?.title ?? key} />
          ))}
        </ul>
      </SortableContext>
    </section>
  );
}

function SortableCard({ id, title }: { id: string; title: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardBody title={title} />
    </li>
  );
}

function CardBody({ title, dragging }: { title: string; dragging?: boolean }) {
  return (
    <div
      className={`flex cursor-grab items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm active:cursor-grabbing ${
        dragging ? "shadow-md ring-2 ring-[#4749B6]/30" : ""
      }`}
    >
      <span className="text-slate-300" aria-hidden>
        ⠿
      </span>
      <span className="font-medium">{title}</span>
    </div>
  );
}
