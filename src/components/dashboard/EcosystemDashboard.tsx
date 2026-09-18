"use client";

import { useMemo } from "react";
import { useDesignerStore } from "@/store/useDesignerStore";
import { computeEcosystem } from "@/lib/ecosystem";

const alertStyles = {
  warning: "bg-amber-100 text-amber-900 border-amber-300",
  success: "bg-green-100 text-green-900 border-green-300",
  info: "bg-slate-100 text-slate-700 border-slate-300",
};

export default function EcosystemDashboard() {
  const items = useDesignerStore((s) => s.items);
  const baseYield = useDesignerStore((s) => s.baseYield);

  const result = useMemo(() => computeEcosystem(items, baseYield), [items, baseYield]);
  const maxScale = Math.max(result.pestIndex, result.biocontrolIndex, 20);

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto no-scrollbar bg-white/90 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Ecosystem Balance
      </div>

      <div className="flex items-end gap-4">
        <BarStat label="Pest Pressure" value={result.pestIndex} max={maxScale} color="#ef4444" />
        <BarStat label="Biocontrol" value={result.biocontrolIndex} max={maxScale} color="#16a34a" />
        <div className="flex flex-col items-center justify-end gap-1 pb-1">
          <div className="text-2xl font-bold text-slate-800">{result.netBalance.toFixed(0)}</div>
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Net Balance</div>
        </div>
        <div className="flex flex-col items-center justify-end gap-1 pb-1">
          <div className="text-2xl font-bold text-paddy-600">
            {result.adjustedYield.toFixed(0)}
          </div>
          <div className="text-[10px] uppercase tracking-wide text-slate-500">Est. Yield (kg/ha)</div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {result.alerts.map((a, i) => (
          <div
            key={i}
            className={`rounded border px-2 py-1 text-xs ${alertStyles[a.level]}`}
          >
            {a.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function BarStat({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-16 w-6 overflow-hidden rounded bg-slate-100">
        <div
          className="absolute bottom-0 left-0 w-full rounded transition-all"
          style={{ height: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-xs font-semibold text-slate-700">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
