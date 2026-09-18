"use client";

import { useState } from "react";
import { PALETTE_CATEGORIES } from "@/data/paletteCategories";
import { getDef } from "@/lib/definitions";
import { useDesignerStore } from "@/store/useDesignerStore";

export default function Sidebar() {
  const [openCategory, setOpenCategory] = useState<string | null>("rice_plant");
  const selectedDefId = useDesignerStore((s) => s.selectedDefId);
  const setSelectedDef = useDesignerStore((s) => s.setSelectedDef);

  return (
    <div className="flex h-full w-full flex-col bg-neutral-500 text-white">
      <div className="flex h-14 items-center justify-center border-b border-neutral-400/60 bg-neutral-500">
        <span className="text-lg font-bold tracking-wide">MLO</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3">
        <div className="grid grid-cols-2 gap-2">
          {PALETTE_CATEGORIES.map((cat) => {
            const isOpen = openCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                className={`flex flex-col items-center gap-1 rounded-md p-2 transition ${
                  isOpen ? "bg-neutral-300/40 ring-2 ring-white" : "bg-neutral-400/30 hover:bg-neutral-400/50"
                }`}
              >
                <div className="flex h-14 w-full items-center justify-center rounded bg-white text-2xl">
                  {cat.icon}
                </div>
                <span className="text-center text-xs leading-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {openCategory && (
          <div className="mt-3 rounded-md bg-neutral-600/60 p-2">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-200">
              {PALETTE_CATEGORIES.find((c) => c.id === openCategory)?.label}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PALETTE_CATEGORIES.find((c) => c.id === openCategory)?.defIds.map((defId) => {
                const def = getDef(defId);
                if (!def) return null;
                const isSelected = selectedDefId === defId;
                return (
                  <button
                    key={defId}
                    title={def.tooltip}
                    onClick={() => setSelectedDef(isSelected ? null : defId)}
                    className={`group relative flex flex-col items-center gap-0.5 rounded p-1.5 text-center ${
                      isSelected ? "bg-paddy-400/80 ring-2 ring-white" : "bg-neutral-500/60 hover:bg-neutral-400/60"
                    }`}
                  >
                    <span className="text-xl">{def.icon}</span>
                    <span className="text-[10px] leading-tight">{def.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedDefId && (
        <div className="border-t border-neutral-400/60 bg-neutral-600 p-2 text-center text-xs">
          Placing <strong>{getDef(selectedDefId)?.name}</strong> — click the map
          <button
            className="ml-2 rounded bg-white/20 px-2 py-0.5 hover:bg-white/30"
            onClick={() => setSelectedDef(null)}
          >
            cancel
          </button>
        </div>
      )}
    </div>
  );
}
