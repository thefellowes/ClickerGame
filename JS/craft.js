import { updateUI } from "./main.js";
import items from "./item.js";
import { state } from "./main.js";
import { populateInventory } from "./inventory.js";
import { inventory } from './inventory.js';
import { addLog } from "./log.js";

function Craft(item) {
  if (state.wood < item.wood || state.stone < item.stone) {
    addLog(`Need ${item.wood} wood and ${item.stone} stone.`);
    return;
  }

  state.wood -= item.wood;
  state.stone -= item.stone;

  const crafted = item.clone();

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

// Dynamically attach listeners for all items
for (const [key, item] of Object.entries(items)) {
  const button = document.getElementById(`craft${key.charAt(0).toUpperCase() + key.slice(1)}`);
  if (button) {
    button.addEventListener('click', () => Craft(item));
  }
}
