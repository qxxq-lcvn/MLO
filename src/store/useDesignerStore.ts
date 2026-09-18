"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { PlacedItem, PlacedKind } from "@/types/map";
import { MAP_ELEMENT_BY_ID } from "@/data/mapElementDefinitions";
import { FAUNA_BY_ID } from "@/data/faunaDefinitions";

export type ToolMode = "select" | "place" | "erase";

interface DesignerState {
  items: PlacedItem[];
  selectedDefId: string | null;
  selectedPlacedId: string | null;
  tool: ToolMode;
  baseYield: number;
  show3D: boolean;

  setSelectedDef: (defId: string | null) => void;
  setTool: (tool: ToolMode) => void;
  setBaseYield: (v: number) => void;
  toggle3D: () => void;

  addItem: (defId: string, x: number, y: number) => string;
  moveItem: (id: string, x: number, y: number) => void;
  removeItem: (id: string) => void;
  rotateItem: (id: string, delta: number) => void;
  selectPlaced: (id: string | null) => void;

  updatePlantData: (id: string, patch: Partial<NonNullable<PlacedItem["plantData"]>>) => void;
  attachFaunaToPlant: (plantId: string, faunaPlacedId: string) => void;
  detachFaunaFromPlant: (plantId: string, faunaPlacedId: string) => void;

  clearAll: () => void;
  loadItems: (items: PlacedItem[]) => void;
}

function kindForDef(defId: string): PlacedKind {
  if (FAUNA_BY_ID[defId]) return "fauna";
  const mapEl = MAP_ELEMENT_BY_ID[defId];
  if (!mapEl) return "other";
  if (mapEl.kind === "plant") return "plant";
  if (mapEl.kind === "field") return "field";
  if (mapEl.kind === "water") return "water";
  return "other";
}

export const useDesignerStore = create<DesignerState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedDefId: null,
      selectedPlacedId: null,
      tool: "select",
      baseYield: 5000,
      show3D: false,

      setSelectedDef: (defId) => set({ selectedDefId: defId, tool: defId ? "place" : "select" }),
      setTool: (tool) => set({ tool }),
      setBaseYield: (v) => set({ baseYield: v }),
      toggle3D: () => set((s) => ({ show3D: !s.show3D })),

      addItem: (defId, x, y) => {
        const id = nanoid(8);
        const kind = kindForDef(defId);
        const item: PlacedItem = {
          id,
          defId,
          kind,
          x,
          y,
          rotation: 0,
          createdAt: Date.now(),
          plantData:
            kind === "plant"
              ? { damagePercent: 0, note: "", attachedFauna: [] }
              : undefined,
        };
        set((s) => ({ items: [...s.items, item] }));
        return id;
      },

      moveItem: (id, x, y) =>
        set((s) => ({
          items: s.items.map((it) => (it.id === id ? { ...it, x, y } : it)),
        })),

      removeItem: (id) =>
        set((s) => ({
          items: s.items
            .filter((it) => it.id !== id)
            .map((it) =>
              it.plantData
                ? {
                    ...it,
                    plantData: {
                      ...it.plantData,
                      attachedFauna: it.plantData.attachedFauna.filter((f) => f !== id),
                    },
                  }
                : it
            ),
          selectedPlacedId: s.selectedPlacedId === id ? null : s.selectedPlacedId,
        })),

      rotateItem: (id, delta) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id ? { ...it, rotation: (it.rotation + delta) % 360 } : it
          ),
        })),

      selectPlaced: (id) => set({ selectedPlacedId: id }),

      updatePlantData: (id, patch) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id && it.plantData
              ? { ...it, plantData: { ...it.plantData, ...patch } }
              : it
          ),
        })),

      attachFaunaToPlant: (plantId, faunaPlacedId) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === plantId && it.plantData
              ? {
                  ...it,
                  plantData: {
                    ...it.plantData,
                    attachedFauna: Array.from(
                      new Set([...it.plantData.attachedFauna, faunaPlacedId])
                    ),
                  },
                }
              : it
          ),
        })),

      detachFaunaFromPlant: (plantId, faunaPlacedId) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === plantId && it.plantData
              ? {
                  ...it,
                  plantData: {
                    ...it.plantData,
                    attachedFauna: it.plantData.attachedFauna.filter((f) => f !== faunaPlacedId),
                  },
                }
              : it
          ),
        })),

      clearAll: () => set({ items: [], selectedPlacedId: null }),
      loadItems: (items) => set({ items, selectedPlacedId: null }),
    }),
    { name: "mlo-rice-paddy-designer" }
  )
);
