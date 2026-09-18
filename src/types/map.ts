export type PlacedKind = "fauna" | "plant" | "field" | "water" | "other";

export interface PlantData {
  damagePercent: number;
  note: string;
  /** ids of PlacedItem (fauna) associated with this plant instance */
  attachedFauna: string[];
}

export interface PlacedItem {
  id: string;
  /** references a FaunaDefinition id or MapElementDefinition id */
  defId: string;
  kind: PlacedKind;
  x: number;
  y: number;
  rotation: number;
  createdAt: number;
  plantData?: PlantData;
}

export type PaletteCategoryId =
  | "rice_plant"
  | "rice_field"
  | "pest"
  | "predator"
  | "parasitoid"
  | "neutral"
  | "water"
  | "other";
