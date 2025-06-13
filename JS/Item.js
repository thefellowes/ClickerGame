class Item {
  constructor(name, wood = 0, stone = 0, food = 0, water = 0, gold = 0, icon = '', outputCount = 1, slotType = '') {
    this.name = name;
    this.wood = wood;
    this.stone = stone;
    this.food = food;
    this.water = water;
    this.gold = gold;
    this.icon = icon;
    this.outputCount = outputCount;
    this.slotType = slotType; // ✅ Correctly assigned
  }
}

// Create all your craftable items
// Wood, Stone, Food, Water, Gold
const woodenClub = new Item('Wooden Club', 10, 0, 0, 0, 0, 'Assets/Sprites/Weapons/WoodenClub.png', 1, 'Weapon');
const stoneAxe = new Item('Stone Axe',   5, 5, 0, 0, 0, 'Assets/Sprites/Weapons/StoneAxe.png', 1, 'Weapon');
// …etc.

function Craft(item) {
  if (state.wood < item.wood || state.stone < item.stone) {
    addLog(`Need ${item.wood} wood and ${item.stone} stone.`);
    return;
  }

  state.wood -= item.wood;
  state.stone -= item.stone;

  const crafted = {
    name: item.name,
    icon: item.icon,
    count: item.outputCount
  };

  let placed = false;
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i] && inventory[i].name === crafted.name) {
      inventory[i].count += crafted.count;
      placed = true;
      break;
    }
  }

  if (!placed) {
    for (let i = 0; i < inventory.length; i++) {
      if (!inventory[i]) {
        inventory[i] = crafted;
        placed = true;
        break;
      }
    }
  }

  if (placed) {
    addLog(`Crafted ${item.name}!`);
    populateInventory();
  } else {
    addLog('No inventory space.');
  }

  updateUI();
}
