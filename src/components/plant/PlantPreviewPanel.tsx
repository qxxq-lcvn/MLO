"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";
import { FAUNA_BY_ID } from "@/data/faunaDefinitions";
import { FaunaCategory, CATEGORY_LABEL } from "@/types/fauna";
import type { PlacedItem } from "@/types/map";

const PlantSideView3D = dynamic(() => import("./PlantSideView3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-md bg-sky-50 text-xs text-slate-400">
      Loading 3D preview…
    </div>
  ),
});

type TabId = "position" | "damage" | "pest" | "predator" | "parasitoid" | "neutral" | "note" | "other";

const TABS: { id: TabId; label: string }[] = [
  { id: "position", label: "Position" },
  { id: "damage", label: "Damage" },
  { id: "pest", label: "Pests" },
  { id: "predator", label: "Predators" },
  { id: "parasitoid", label: "Parasitoids" },
  { id: "neutral", label: "Neutral animals" },
  { id: "note", label: "Note" },
  { id: "other", label: "Others" },
];

export default function PlantPreviewPanel() {
  const [tab, setTab] = useState<TabId>("position");
  const items = useDesignerStore((s) => s.items);
  const selectedPlacedId = useDesignerStore((s) => s.selectedPlacedId);
  const selectPlaced = useDesignerStore((s) => s.selectPlaced);
  const moveItem = useDesignerStore((s) => s.moveItem);
  const rotateItem = useDesignerStore((s) => s.rotateItem);
  const removeItem = useDesignerStore((s) => s.removeItem);
  const updatePlantData = useDesignerStore((s) => s.updatePlantData);
  const attachFaunaToPlant = useDesignerStore((s) => s.attachFaunaToPlant);
  const detachFaunaFromPlant = useDesignerStore((s) => s.detachFaunaFromPlant);

  const plant = items.find((it) => it.id === selectedPlacedId && it.kind === "plant");
  if (!plant) return null;

  const attached = new Set(plant.plantData?.attachedFauna ?? []);

  function faunaListForCategory(category: FaunaCategory) {
    return items.filter((it) => it.kind === "fauna" && FAUNA_BY_ID[it.defId]?.category === category);
  }

  function toggleAttach(faunaPlacedId: string) {
    if (attached.has(faunaPlacedId)) detachFaunaFromPlant(plant!.id, faunaPlacedId);
    else attachFaunaToPlant(plant!.id, faunaPlacedId);
  }

  function CategoryTab({ category }: { category: FaunaCategory }) {
    const list = faunaListForCategory(category);
    if (list.length === 0) {
      return (
        <p className="text-xs text-slate-500">
          No {CATEGORY_LABEL[category].toLowerCase()} placed on the map yet. Add some from the MLO
          palette, then attach them here to model their effect on this plant.
        </p>
      );
    }
    return (
      <div className="flex flex-col gap-1.5">
        {list.map((f) => {
          const def = FAUNA_BY_ID[f.defId];
          const isAttached = attached.has(f.id);
          return (
            <label
              key={f.id}
              className={`flex cursor-pointer items-center gap-2 rounded border px-2 py-1.5 text-sm ${
                isAttached ? "border-paddy-400 bg-paddy-50" : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input type="checkbox" checked={isAttached} onChange={() => toggleAttach(f.id)} />
              <span>{def?.icon}</span>
              <span className="flex-1">{def?.name}</span>
              <span className="text-[10px] text-slate-400">{def?.impactSummary}</span>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        <div className="text-sm font-semibold text-slate-700">Plant Preview</div>
        <button
          onClick={() => selectPlaced(null)}
          className="rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
        >
          Close ✕
        </button>
      </div>

      <div className="border-b border-slate-200 p-3">
        <PlantSideView3D plant={plant} allItems={items} />
        <p className="mt-1 text-center text-[11px] text-slate-400">Side view — drag to rotate</p>
      </div>

      <div className="grid grid-cols-2 gap-2 border-b border-slate-200 p-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded p-2 text-xs font-medium ${
              tab === t.id ? "bg-paddy-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === "position" && <PositionTab plant={plant} moveItem={moveItem} rotateItem={rotateItem} />}
        {tab === "damage" && <DamageTab plant={plant} updatePlantData={updatePlantData} />}
        {tab === "pest" && <CategoryTab category="pest" />}
        {tab === "predator" && <CategoryTab category="predator" />}
        {tab === "parasitoid" && <CategoryTab category="parasitoid" />}
        {tab === "neutral" && <CategoryTab category="neutral" />}
        {tab === "note" && <NoteTab plant={plant} updatePlantData={updatePlantData} />}
        {tab === "other" && (
          <OthersTab plant={plant} onDelete={() => { removeItem(plant.id); selectPlaced(null); }} />
        )}
      </div>
    </div>
  );
}

function PositionTab({
  plant,
  moveItem,
  rotateItem,
}: {
  plant: PlacedItem;
  moveItem: (id: string, x: number, y: number) => void;
  rotateItem: (id: string, delta: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center gap-2">
        <label className="w-16 text-slate-500">X</label>
        <input
          type="number"
          value={Math.round(plant.x)}
          onChange={(e) => moveItem(plant.id, Number(e.target.value), plant.y)}
          className="w-24 rounded border border-slate-300 px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="w-16 text-slate-500">Y</label>
        <input
          type="number"
          value={Math.round(plant.y)}
          onChange={(e) => moveItem(plant.id, plant.x, Number(e.target.value))}
          className="w-24 rounded border border-slate-300 px-2 py-1"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="w-16 text-slate-500">Rotation</label>
        <button
          onClick={() => rotateItem(plant.id, -15)}
          className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
        >
          ⟲ -15°
        </button>
        <span className="w-12 text-center">{plant.rotation}°</span>
        <button
          onClick={() => rotateItem(plant.id, 15)}
          className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200"
        >
          ⟳ +15°
        </button>
      </div>
    </div>
  );
}

function DamageTab({
  plant,
  updatePlantData,
}: {
  plant: PlacedItem;
  updatePlantData: (id: string, patch: Partial<NonNullable<PlacedItem["plantData"]>>) => void;
}) {
  const damage = plant.plantData?.damagePercent ?? 0;
  return (
    <div className="flex flex-col gap-3">
      <input
        type="range"
        min={0}
        max={100}
        value={damage}
        onChange={(e) => updatePlantData(plant.id, { damagePercent: Number(e.target.value) })}
        className="w-full"
      />
      <div className="text-sm text-slate-600">
        Damage: <strong>{damage}%</strong>{" "}
        {damage >= 60 ? "— severe, consider harvesting early or replanting." : damage >= 25 ? "— moderate, monitor pest pressure." : "— healthy."}
      </div>
    </div>
  );
}

function NoteTab({
  plant,
  updatePlantData,
}: {
  plant: PlacedItem;
  updatePlantData: (id: string, patch: Partial<NonNullable<PlacedItem["plantData"]>>) => void;
}) {
  return (
    <textarea
      value={plant.plantData?.note ?? ""}
      onChange={(e) => updatePlantData(plant.id, { note: e.target.value })}
      placeholder="Field notes for this plant instance…"
      className="h-40 w-full resize-none rounded border border-slate-300 p-2 text-sm"
    />
  );
}

function OthersTab({ plant, onDelete }: { plant: PlacedItem; onDelete: () => void }) {
  return (
    <div className="flex flex-col gap-3 text-sm text-slate-600">
      <div>
        ID: <code className="text-xs">{plant.id}</code>
      </div>
      <div>Placed: {new Date(plant.createdAt).toLocaleString()}</div>
      <div>Attached fauna: {plant.plantData?.attachedFauna.length ?? 0}</div>
      <button
        onClick={onDelete}
        className="mt-2 w-fit rounded bg-red-500 px-3 py-1.5 text-white hover:bg-red-600"
      >
        Delete this plant
      </button>
    </div>
  );
}
