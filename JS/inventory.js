//Inventory.js
import { player } from './character.js';
import { updateUI, state } from './main.js';
import { updateStats } from './character.js';

const inventoryButton = document.getElementById('backpackImage');
const inventoryMenu = document.getElementById('inventoryMenu');
const tooltip = document.getElementById('tooltip');
const inventoryOverlay   = document.getElementById('inventoryMenu');
const inventoryCard      = inventoryOverlay.querySelector('.menu-content');

const invCloseBtn = document.createElement('button');
invCloseBtn.className = 'close-btn';
invCloseBtn.textContent = '✕';     // nicer glyph, but keep plain "X" if you prefer
invCloseBtn.onclick = () => inventoryOverlay.style.display = 'none';
inventoryCard.appendChild(invCloseBtn);

inventoryButton.addEventListener('click', () =>{
  inventoryOverlay.style.display = 'flex';   // same as farming overlay
});

inventoryOverlay.addEventListener('click', (e)=>{
  if(e.target === inventoryOverlay) inventoryOverlay.style.display = 'none';
});

inventoryButton.addEventListener('click', () => {
  inventoryMenu.style.display = inventoryMenu.style.display === 'block' ? 'none' : 'block';
});

const inventoryGrid = document.getElementById('inventoryGrid');
const totalSlots = 30; // 10 wide x 3 tall
export const inventory = new Array(totalSlots).fill(null); // Initialize an array with 30 slots
const equipmentGrid = document.getElementById('equipmentGrid');

const equipmentSlots = [
  'Amulet', 'Helmet', 'Ammo',
  'Shoulder', 'Chest', 'Cape',
  'Weapon', 'Legs', 'Weapon',
  'Ring', 'Feet', 'Ring'
];
const equipmentSlotTypes = [
  'Amulet', 'Helmet', 'Ammo',
  'Shoulder', 'Chest', 'Cape',
  'Weapon1', 'Legs', 'Weapon2',
  'Ring', 'Feet', 'Ring'
];

const equipmentItems = new Array(equipmentSlots.length).fill(null);

let draggedIndex = null;

export function populateEquipment() {
  equipmentGrid.innerHTML = '';

  for (let i = 0; i < equipmentSlotTypes.length; i++) {
    const slot = document.createElement('div');
    slot.classList.add('equipment-slot');
    slot.dataset.slot = equipmentSlotTypes[i];
    slot.dataset.index = i;
    slot.draggable = true;

    const item = equipmentItems[i];
    if (item) {
      const img = document.createElement('img');
      img.src = item.icon;
      img.alt = item.name;
      img.classList.add('item-icon');
      slot.appendChild(img);

      img.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        tooltip.innerHTML = generateItemTooltip(item);
      });

      img.addEventListener('mousemove', (e) => {
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.left = `${e.pageX + 10}px`;
      });

      img.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    }

    slot.addEventListener('dragstart', (e) => {
      draggedIndex = `e${i}`;
      e.dataTransfer.setData('text/plain', '');
    });

    slot.addEventListener('dragover', (e) => e.preventDefault());

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const toIndex = i;

      if (draggedIndex !== null) {
        let draggedItem = null;

        if (draggedIndex.startsWith('i')) {
          draggedItem = inventory[parseInt(draggedIndex.slice(1))];
        } else if (draggedIndex.startsWith('e')) {
          draggedItem = equipmentItems[parseInt(draggedIndex.slice(1))];
        }

        if (!draggedItem) {
          console.warn('Dragged item is null or undefined');
          return;
        }

        if (!equipmentSlotTypes[toIndex].startsWith(draggedItem.slotType)) {
          addLog(`Can't equip ${draggedItem.name} in ${equipmentSlotTypes[toIndex]} slot.`);
          slot.classList.add('shake-red');
          setTimeout(() => slot.classList.remove('shake-red'), 300);
          return;
        }

        if (draggedIndex.startsWith('i')) {
          const fromIndex = parseInt(draggedIndex.slice(1));
          const oldItem = equipmentItems[toIndex];
          const newItem = inventory[fromIndex];

          player.applyModifiers(oldItem, 'remove');
          player.applyModifiers(newItem, 'add');
          updateStats(player);
          updateUI();

          equipmentItems[toIndex] = inventory[fromIndex];
          inventory[fromIndex] = oldItem;
        } else {
          const fromIndex = parseInt(draggedIndex.slice(1));
          const oldItem = equipmentItems[toIndex];
          const newItem = equipmentItems[fromIndex];

          player.applyModifiers(oldItem, 'remove');
          player.applyModifiers(newItem, 'add');
          updateStats(player);
          updateUI();

          const temp = equipmentItems[toIndex];
          equipmentItems[toIndex] = equipmentItems[fromIndex];
          equipmentItems[fromIndex] = temp;
        }

        draggedIndex = null;
        populateInventory();
        populateEquipment();
      }
    });

    equipmentGrid.appendChild(slot);
  }
}

export function populateInventory() {
  inventoryGrid.innerHTML = '';

  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement('div');
    slot.classList.add('inventory-slot');
    slot.dataset.index = i;
    slot.draggable = true;

    const item = inventory[i];
    if (item) {
      const img = document.createElement('img');
      img.src = item.icon;
      img.alt = item.name;
      img.classList.add('item-icon');
      slot.appendChild(img);

      img.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        tooltip.innerHTML = generateItemTooltip(item);
      });

      img.addEventListener('mousemove', (e) => {
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.left = `${e.pageX + 10}px`;
      });

      img.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });

      if (item.count > 1) {
        const count = document.createElement('span');
        count.classList.add('item-count');
        count.textContent = item.count;
        slot.appendChild(count);
      }
    }

    slot.addEventListener('dragstart', (e) => {
      draggedIndex = `i${i}`;
      e.dataTransfer.setData('text/plain', '');
    });

    slot.addEventListener('dragover', (e) => e.preventDefault());

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const toIndex = parseInt(slot.dataset.index);

      if (draggedIndex !== null) {
        let fromIndex;
        if (draggedIndex.startsWith('e')) {
          fromIndex = parseInt(draggedIndex.slice(1));
          const removedItem = equipmentItems[fromIndex];
          player.applyModifiers(removedItem, 'remove');

          const temp = inventory[toIndex];
          inventory[toIndex] = equipmentItems[fromIndex];
          equipmentItems[fromIndex] = temp;
          updateStats(player);
          updateUI();
        } else {
          fromIndex = parseInt(draggedIndex.slice(1));
          if (fromIndex === toIndex) return; // No action if dropped on itself

          const temp = inventory[toIndex];
          inventory[toIndex] = inventory[fromIndex];
          inventory[fromIndex] = temp;
        }

        draggedIndex = null;
        populateInventory();
        populateEquipment();
      }
    });

    inventoryGrid.appendChild(slot);
  }
}

function parseCoinAmount(name) {
  const match = name.match(/coins\s*x\s*(\d+)/i); // e.g. "Coins x25"
  return match ? parseInt(match[1], 10) : 0;
}

export function addItemToInventory(item) {

  /* ─── 1. COINS ────────────────────────────────────────────── */
  //  a. drop came in as a *string*  →  "Coins x25"
  if (typeof item === 'string' && /coins/i.test(item)) {
    const amount = parseCoinAmount(item);     // "25"
    state.gold += amount;
    updateUI();                               // refresh resource panel
    return;                                   // nothing to store in slots
  }

  //  b. drop is an object that *represents* coins
  if (item && /coins/i.test(item.name)) {
    const amount = item.amount ?? parseCoinAmount(item.name);
    state.gold += amount;
    updateUI();
    return;
  }

  /* ─── 2. REGULAR ITEMS ───────────────────────────────────── */
  const slot = inventory.findIndex(s => s === null);
  if (slot !== -1) {
    inventory[slot] = item;
    populateInventory();
  } else {
    addLog('Your backpack is full!');
  }
}


function generateItemTooltip(item) {
  let html = `<strong>${item.name}</strong><br>`;
  if (item.description) {
    html += `<div style="font-size: 0.85em; color: #ccc; margin-bottom: 4px;">${item.description}</div>`;
  }
  const stats = [
    { label: 'Health', key: 'modifierHealth' },
    { label: 'Strength', key: 'modifierStrength' },
    { label: 'Awareness', key: 'modifierAwareness' },
    { label: 'Charisma', key: 'modifierCharisma' },
    { label: 'Intelligence', key: 'modifierIntelligence' },
    { label: 'Agility', key: 'modifierAgility' },
    { label: 'Luck', key: 'modifierLuck' }
  ];

  for (const { label, key } of stats) {
    const val = item[key] || 0;
    if (val !== 0) {
      const color = val > 0 ? 'green' : 'red';
      const sign = val > 0 ? '+' : '';
      html += `<span style="color:${color};">${label}: ${sign}${val}</span><br>`;
    }
  }

  return html;
}

populateEquipment();
populateInventory();