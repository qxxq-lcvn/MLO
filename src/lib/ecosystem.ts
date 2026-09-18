import { PlacedItem } from "@/types/map";

export interface EcosystemResult {
  counts: Record<string, number>;
  pestIndex: number;
  biocontrolIndex: number;
  netBalance: number;
  adjustedYield: number;
  alerts: { level: "warning" | "success" | "info"; message: string }[];
}

function countOf(counts: Record<string, number>, id: string) {
  return counts[id] ?? 0;
}

export function computeEcosystem(items: PlacedItem[], baseYield: number): EcosystemResult {
  const faunaItems = items.filter((i) => i.kind === "fauna");
  const counts: Record<string, number> = {};
  for (const item of faunaItems) {
    counts[item.defId] = (counts[item.defId] ?? 0) + 1;
  }

  const crickets = countOf(counts, "cricket");
  const rats = countOf(counts, "rat");
  const trichogramma = countOf(counts, "trichogramma");
  const spiders = countOf(counts, "spider");
  const ladybugs = countOf(counts, "ladybug");
  const frogs = countOf(counts, "frog");
  const snakes = countOf(counts, "snake");

  // Pest Index: P = sum(Crickets*10 + Rats*35)
  const pestIndex = crickets * 10 + rats * 35;

  // Biological Control Index: B = sum(Trichogramma*40 + Spiders*30 + Ladybugs*25 + Frogs*20 + Snakes*35 [if Rats > 0])
  const biocontrolIndex =
    trichogramma * 40 +
    spiders * 30 +
    ladybugs * 25 +
    frogs * 20 +
    (rats > 0 ? snakes * 35 : 0);

  // Net Ecosystem Balance Score: E = max(0, 100 - P + B)
  const netBalance = Math.max(0, 100 - pestIndex + biocontrolIndex);

  // Adjusted Crop Yield: Y_adj = Y_base * (1 + (E - 50) / 100)
  const adjustedYield = baseYield * (1 + (netBalance - 50) / 100);

  const alerts: EcosystemResult["alerts"] = [];

  if (rats > 0 && snakes === 0) {
    alerts.push({
      level: "warning",
      message: "Warning: High Rat Population! Add Snakes to protect yield.",
    });
  }
  if (crickets >= 3 && frogs === 0 && spiders === 0) {
    alerts.push({
      level: "warning",
      message: "Cricket infestation risk — add Frogs or Spiders to control the population.",
    });
  }
  if (trichogramma > 0 && spiders > 0) {
    alerts.push({
      level: "success",
      message: "Optimal Biocontrol: Trichogramma and Spiders active.",
    });
  }
  if (faunaItems.length === 0) {
    alerts.push({
      level: "info",
      message: "No fauna placed yet — add pests, predators, or parasitoids to simulate the ecosystem.",
    });
  }
  if (netBalance >= 70) {
    alerts.push({ level: "success", message: "Ecosystem balance is healthy." });
  } else if (netBalance < 40) {
    alerts.push({ level: "warning", message: "Ecosystem balance is poor — pest pressure outweighs biocontrol." });
  }

  return { counts, pestIndex, biocontrolIndex, netBalance, adjustedYield, alerts };
}
