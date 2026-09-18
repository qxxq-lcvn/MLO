export type MapElementKind = "plant" | "field" | "water" | "other";

export interface MapElementDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  kind: MapElementKind;
  footprint: { w: number; h: number };
  description: string;
}

export const MAP_ELEMENT_DEFINITIONS: MapElementDefinition[] = [
  {
    id: "rice_plant",
    name: "Rice plant",
    icon: "🌾",
    color: "#8fbf3f",
    kind: "plant",
    footprint: { w: 28, h: 28 },
    description: "A single rice plant instance. Select it to open the Plant Preview inspector.",
  },
  {
    id: "rice_field",
    name: "Rice field",
    icon: "🟩",
    color: "#a2c974",
    kind: "field",
    footprint: { w: 120, h: 90 },
    description: "A paddy field block — the growing area that hosts plants and fauna.",
  },
  {
    id: "water",
    name: "Water",
    icon: "💧",
    color: "#3a8fc0",
    kind: "water",
    footprint: { w: 100, h: 70 },
    description: "Flooded paddy water — habitat for fish and amphibians.",
  },
  {
    id: "bund",
    name: "Bund / Ridge",
    icon: "🪨",
    color: "#8a6a4b",
    kind: "other",
    footprint: { w: 90, h: 20 },
    description: "Earth bund separating paddies — a corridor for snakes and rats.",
  },
  {
    id: "scarecrow",
    name: "Scarecrow",
    icon: "🎋",
    color: "#c2a24d",
    kind: "other",
    footprint: { w: 24, h: 40 },
    description: "Deters birds from grain heads.",
  },
  {
    id: "marker",
    name: "Note marker",
    icon: "📍",
    color: "#ef4444",
    kind: "other",
    footprint: { w: 20, h: 20 },
    description: "A freeform annotation pin for field notes.",
  },
];

export const MAP_ELEMENT_BY_ID: Record<string, MapElementDefinition> = Object.fromEntries(
  MAP_ELEMENT_DEFINITIONS.map((m) => [m.id, m])
);
