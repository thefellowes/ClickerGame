import items from "./item.js";

export function rollLoot(enemy) {
  const lootTable = getLootTable(enemy.species.name);
  const totalWeight = lootTable.reduce((sum, entry) => sum + entry.weight, 0);
  const roll = Math.random() * totalWeight;
  let cumulative = 0;

  for (const entry of lootTable) {
    cumulative += entry.weight;
    if (roll < cumulative) return entry.item;
  }
  return null;
}

function getLootTable(speciesName) {
  switch (speciesName) {
    case "Human":
      return [
        { item: "Coins x10", weight: 0 },
        { item: "Coins x25", weight: 0 },
        { item: "Coins x50", weight: 0 },
        { item: items.woodenClub, weight: 100 }
      ];
    case "Insectoid":
      return [
        { item: "Coins x10", weight: 40 },
        { item: "Coins x25", weight: 35 },
        { item: "Coins x50", weight: 15 },
        { item: items.woodenClub, weight: 100 }
      ];
    case "Feline":
      return [
        { item: "Coins x10", weight: 40 },
        { item: "Coins x25", weight: 35 },
        { item: "Coins x50", weight: 15 },
        { item: items.woodenClub, weight: 100 }
      ];
    case "Robotic":
      return [
        { item: "Coins x10", weight: 40 },
        { item: "Coins x25", weight: 35 },
        { item: "Coins x50", weight: 15 },
        { item: items.woodenClub, weight: 100 }
      ];
    case "Avian":
      return [
        { item: "Coins x10", weight: 40 },
        { item: "Coins x25", weight: 35 },
        { item: "Coins x50", weight: 15 },
        { item: items.woodenClub, weight: 100 }
      ];
    case "Reptilian":
      return [
        { item: "Coins x10", weight: 40 },
        { item: "Coins x25", weight: 35 },
        { item: "Coins x50", weight: 15 },
        { item: items.woodenClub, weight: 100 }
      ];
    default:
      return [];
  }
}
