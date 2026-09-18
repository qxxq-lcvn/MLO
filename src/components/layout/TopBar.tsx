"use client";

import { useRef } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";

export default function TopBar() {
  const tool = useDesignerStore((s) => s.tool);
  const setTool = useDesignerStore((s) => s.setTool);
  const setSelectedDef = useDesignerStore((s) => s.setSelectedDef);
  const items = useDesignerStore((s) => s.items);
  const loadItems = useDesignerStore((s) => s.loadItems);
  const clearAll = useDesignerStore((s) => s.clearAll);
  const show3D = useDesignerStore((s) => s.show3D);
  const toggle3D = useDesignerStore((s) => s.toggle3D);
  const baseYield = useDesignerStore((s) => s.baseYield);
  const setBaseYield = useDesignerStore((s) => s.setBaseYield);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rice-paddy-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLoadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (Array.isArray(data)) loadItems(data);
      } catch {
        alert("Could not read that file — expected a layout JSON exported from this app.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleClear() {
    if (items.length === 0) return;
    if (confirm("Clear the entire map? This cannot be undone.")) clearAll();
  }

  const toolBtn = (id: "select" | "erase", label: string) => (
    <button
      onClick={() => {
        setTool(id);
        setSelectedDef(null);
      }}
      className={`rounded px-3 py-1.5 text-sm font-medium transition ${
        tool === id ? "bg-paddy-500 text-white" : "bg-white/80 text-slate-700 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-14 w-full items-center gap-3 border-b border-neutral-400/60 bg-neutral-500 px-4 text-white">
      <span className="mr-2 text-sm font-semibold uppercase tracking-wide text-neutral-100">
        Editing tools
      </span>
      <div className="flex items-center gap-2">
        {toolBtn("select", "Select / Move")}
        {toolBtn("erase", "Erase")}
      </div>

      <div className="mx-2 h-6 w-px bg-white/20" />

      <button
        onClick={toggle3D}
        className={`rounded px-3 py-1.5 text-sm font-medium transition ${
          show3D ? "bg-paddy-500 text-white" : "bg-white/80 text-slate-700 hover:bg-white"
        }`}
      >
        {show3D ? "Hide 3D Side View" : "3D Side View"}
      </button>

      <div className="mx-2 h-6 w-px bg-white/20" />

      <button onClick={handleSave} className="rounded bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">
        Save
      </button>
      <button onClick={handleLoadClick} className="rounded bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">
        Load
      </button>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
      <button onClick={handleClear} className="rounded bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500">
        Clear map
      </button>

      <div className="ml-auto flex items-center gap-2 text-sm">
        <label htmlFor="baseYield" className="text-neutral-100">
          Base yield (kg/ha)
        </label>
        <input
          id="baseYield"
          type="number"
          min={0}
          value={baseYield}
          onChange={(e) => setBaseYield(Number(e.target.value) || 0)}
          className="w-24 rounded px-2 py-1 text-slate-900"
        />
      </div>
    </div>
  );
}
