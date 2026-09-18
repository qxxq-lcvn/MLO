"use client";

import { useCallback, useRef, useState } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";
import { getDef } from "@/lib/definitions";
import { MAP_ELEMENT_BY_ID } from "@/data/mapElementDefinitions";
import { PlacedItem } from "@/types/map";

const CANVAS_W = 2000;
const CANVAS_H = 1300;

function itemFootprint(item: PlacedItem) {
  const mapEl = MAP_ELEMENT_BY_ID[item.defId];
  return mapEl?.footprint ?? { w: 32, h: 32 };
}

export default function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  const items = useDesignerStore((s) => s.items);
  const tool = useDesignerStore((s) => s.tool);
  const selectedDefId = useDesignerStore((s) => s.selectedDefId);
  const selectedPlacedId = useDesignerStore((s) => s.selectedPlacedId);
  const addItem = useDesignerStore((s) => s.addItem);
  const moveItem = useDesignerStore((s) => s.moveItem);
  const removeItem = useDesignerStore((s) => s.removeItem);
  const selectPlaced = useDesignerStore((s) => s.selectPlaced);

  const getRelativePoint = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return {
      x: clientX - rect.left + el.scrollLeft,
      y: clientY - rect.top + el.scrollTop,
    };
  }, []);

  function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    if (dragId) return;
    if (tool === "place" && selectedDefId) {
      const { x, y } = getRelativePoint(e.clientX, e.clientY);
      addItem(selectedDefId, x, y);
    } else if (e.target === containerRef.current) {
      selectPlaced(null);
    }
  }

  function handleItemPointerDown(e: React.PointerEvent, item: PlacedItem) {
    e.stopPropagation();
    if (tool === "erase") {
      removeItem(item.id);
      return;
    }
    selectPlaced(item.id);
    if (tool === "select" || tool === "place") {
      const { x, y } = getRelativePoint(e.clientX, e.clientY);
      dragOffset.current = { dx: x - item.x, dy: y - item.y };
      setDragId(item.id);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragId) return;
    const { x, y } = getRelativePoint(e.clientX, e.clientY);
    moveItem(dragId, x - dragOffset.current.dx, y - dragOffset.current.dy);
  }

  function handlePointerUp() {
    setDragId(null);
  }

  // Render lowest z-order first: field, water, then plant/other, then fauna on top
  const zOrder: Record<PlacedItem["kind"], number> = {
    field: 0,
    water: 1,
    other: 2,
    plant: 3,
    fauna: 4,
  };
  const sorted = [...items].sort((a, b) => zOrder[a.kind] - zOrder[b.kind]);

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`relative h-full w-full overflow-auto bg-paddy-100 ${
        tool === "place" ? "cursor-crosshair" : tool === "erase" ? "cursor-not-allowed" : "cursor-default"
      }`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(101,151,50,0.08) 0px, rgba(101,151,50,0.08) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(101,151,50,0.08) 0px, rgba(101,151,50,0.08) 1px, transparent 1px, transparent 40px)",
      }}
    >
      <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
        {sorted.map((item) => {
          const def = getDef(item.defId);
          if (!def) return null;
          const fp = itemFootprint(item);
          const isSelected = selectedPlacedId === item.id;
          const isAreaKind = item.kind === "field" || item.kind === "water";

          return (
            <div
              key={item.id}
              onPointerDown={(e) => handleItemPointerDown(e, item)}
              title={`${def.name} — ${def.tooltip}`}
              className={`absolute flex select-none items-center justify-center rounded ${
                isAreaKind ? "" : "text-2xl"
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              style={{
                left: item.x - fp.w / 2,
                top: item.y - fp.h / 2,
                width: fp.w,
                height: fp.h,
                transform: `rotate(${item.rotation}deg)`,
                backgroundColor: isAreaKind ? `${def.color}55` : "transparent",
                border: isAreaKind ? `1px dashed ${def.color}` : undefined,
                zIndex: isSelected ? 50 : undefined,
                touchAction: "none",
              }}
            >
              {isAreaKind ? (
                <span className="pointer-events-none text-xs font-medium text-slate-700/70">
                  {def.icon} {def.name}
                </span>
              ) : (
                <span className="pointer-events-none drop-shadow">{def.icon}</span>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 text-center text-sm text-slate-500">
            Pick an item from the MLO palette on the left, then click anywhere on the map to place
            it. Select &quot;Rice plant&quot; and click a plant to open its inspector.
          </div>
        )}
      </div>
    </div>
  );
}
