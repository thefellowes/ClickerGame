const inventoryButton = document.getElementById('backpackImage');
const inventoryMenu = document.getElementById('inventoryMenu');

inventoryButton.addEventListener('click', () => {
  inventoryMenu.style.display = inventoryMenu.style.display === 'block' ? 'none' : 'block';
});

const inventoryGrid = document.getElementById('inventoryGrid');
const totalSlots = 30; // 10 wide x 3 tall

function populateInventory() {
  inventoryGrid.innerHTML = ''; // Clear previous content

  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement('div');
    slot.classList.add('inventory-slot');

    // Example: add an icon to the first 3 slots only
    if (i === 0) {
      const img = document.createElement('img');
      img.src = 'Assets/Sprites/Weapons/WoodenClub.png';
      img.classList.add('item-icon');
      slot.appendChild(img);
    }

    inventoryGrid.appendChild(slot);
  }
}

populateInventory();