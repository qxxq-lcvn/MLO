import { PaletteCategoryId } from "@/types/map";

export interface PaletteCategoryConfig {
  id: PaletteCategoryId;
  label: string;
  icon: string;
  defIds: string[];
}

export const PALETTE_CATEGORIES: PaletteCategoryConfig[] = [
  { id: "rice_plant", label: "Rice plant", icon: "🌾", defIds: ["rice_plant"] },
  { id: "rice_field", label: "Rice field", icon: "🟩", defIds: ["rice_field"] },
  { id: "pest", label: "Pests", icon: "🦗", defIds: ["cricket", "rat"] },
  {
    id: "predator",
    label: "Predators",
    icon: "🐸",
    defIds: ["dragonfly", "duck", "frog", "ladybug", "spider", "snake", "wasp", "weaverant"],
  },
  { id: "parasitoid", label: "Parasitoids", icon: "🐝", defIds: ["trichogramma"] },
  {
    id: "neutral",
    label: "Neutral animals",
    icon: "🦋",
    defIds: ["bee", "bird", "butterfly", "fish", "worm"],
  },
  { id: "water", label: "Water", icon: "💧", defIds: ["water"] },
  { id: "other", label: "Others", icon: "📍", defIds: ["bund", "scarecrow", "marker"] },
];
