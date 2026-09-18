export type FaunaCategory =
  | "pest"
  | "predator"
  | "parasitoid"
  | "neutral";

export type FaunaLayer = "air" | "canopy" | "ground" | "water" | "subsoil";

export interface FaunaDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: FaunaCategory;
  preferredLayer: FaunaLayer;
  /** 3D Y-axis elevation range relative to ground (0 = ground level) */
  elevationRange: [number, number];
  role: string;
  impactSummary: string;
  ecoImpact: {
    pestControlRate: number;
    yieldMultiplier: number;
    preysOn?: string[];
  };
  animationType: "hover" | "crawl" | "swim" | "burrow" | "static";
}

export const CATEGORY_LABEL: Record<FaunaCategory, string> = {
  pest: "Pests",
  predator: "Predators",
  parasitoid: "Parasitoids",
  neutral: "Neutral animals",
};

export const LAYER_LABEL: Record<FaunaLayer, string> = {
  air: "Air / Canopy",
  canopy: "Foliage",
  ground: "Ground / Mud",
  water: "Water",
  subsoil: "Subsoil",
};
