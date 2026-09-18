import { FAUNA_BY_ID } from "@/data/faunaDefinitions";
import { MAP_ELEMENT_BY_ID } from "@/data/mapElementDefinitions";

export interface UnifiedDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  tooltip: string;
  isFauna: boolean;
}

export function getDef(id: string): UnifiedDef | null {
  const fauna = FAUNA_BY_ID[id];
  if (fauna) {
    return {
      id: fauna.id,
      name: fauna.name,
      icon: fauna.icon,
      color: fauna.color,
      tooltip: `${fauna.role} — ${fauna.impactSummary}`,
      isFauna: true,
    };
  }
  const mapEl = MAP_ELEMENT_BY_ID[id];
  if (mapEl) {
    return {
      id: mapEl.id,
      name: mapEl.name,
      icon: mapEl.icon,
      color: mapEl.color,
      tooltip: mapEl.description,
      isFauna: false,
    };
  }
  return null;
}
