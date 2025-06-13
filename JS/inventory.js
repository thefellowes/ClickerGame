const inventoryButton = document.getElementById('backpackImage');
const inventoryMenu = document.getElementById('inventoryMenu');
const tooltip = document.getElementById('tooltip');

inventoryButton.addEventListener('click', () => {
  inventoryMenu.style.display = inventoryMenu.style.display === 'block' ? 'none' : 'block';
});

const inventoryGrid = document.getElementById('inventoryGrid');
const totalSlots = 30; // 10 wide x 3 tall
const inventory = new Array(totalSlots).fill(null); // Initialize an array with 30 slots
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
  'Weapon', 'Legs', 'Weapon',
  'Ring', 'Feet', 'Ring'
];

const equipmentItems = new Array(equipmentSlots.length).fill(null);

let draggedIndex = null;

function populateEquipment() {
  equipmentGrid.innerHTML = '';

  for (let i = 0; i < equipmentSlots.length; i++) {
    const slot = document.createElement('div');
    slot.classList.add('equipment-slot');
    slot.dataset.slot = equipmentSlots[i];
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
        tooltip.innerHTML = item.name;
      });

      img.addEventListener('mousemove', (e) => {
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.left = `${e.pageX + 10}px`;
      });

      img.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    }

    // Drag and drop handlers
    slot.addEventListener('dragstart', () => {
      draggedIndex = `e${i}`; // 'e' = equipment
    });

    slot.addEventListener('dragover', (e) => e.preventDefault());

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const toIndex = i;

      if (draggedIndex !== null) {
        // Get item being dragged
        let draggedItem = null;
        if (!draggedIndex.startsWith('e')) {
          draggedItem = inventory[parseInt(draggedIndex)];
        } else {
          draggedItem = equipmentItems[parseInt(draggedIndex.slice(1))];
        }

        // Check if allowed in this slot
        if (
          draggedItem &&
          draggedItem.slotType !== equipmentSlots[toIndex]
        ) {
          addLog(`Can't equip ${draggedItem.name} in ${equipmentSlots[toIndex]} slot.`);
          return;
        }

        // Swap inventory ↔ equipment or equipment ↔ equipment
        if (!draggedIndex.startsWith('e')) {
          const fromIndex = parseInt(draggedIndex);
          const temp = equipmentItems[toIndex];
          equipmentItems[toIndex] = inventory[fromIndex];
          inventory[fromIndex] = temp;
        } else {
          const fromIndex = parseInt(draggedIndex.slice(1));
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

function populateInventory() {
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
        tooltip.innerHTML = item.name;
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

    // Drag start
    slot.addEventListener('dragstart', () => {
      draggedIndex = slot.dataset.index;
    });

    // Drag over
    slot.addEventListener('dragover', (e) => e.preventDefault());

    // Drop handler
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const toIndex = parseInt(slot.dataset.index);

      if (draggedIndex !== null) {
        // From equipment
        if (draggedIndex.startsWith('e')) {
          const fromIndex = parseInt(draggedIndex.slice(1));
          const temp = inventory[toIndex];
          inventory[toIndex] = equipmentItems[fromIndex];
          equipmentItems[fromIndex] = temp;
        }
        // From another inventory slot
        else {
          const fromIndex = parseInt(draggedIndex);
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

populateEquipment();
populateInventory();