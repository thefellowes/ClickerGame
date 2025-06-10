// Define an Item class
class Item {
  constructor(name, wood = 0, stone = 0, food = 0, water = 0, gold = 0) {
    this.name  = name;
    this.wood  = wood;
    this.stone = stone;
    this.food  = food;
    this.water = water;
    this.gold  = gold;
  }
}

// Create all your craftable items
const woodenClub = new Item('Wooden Club', 10, 0, 0, 0, 0);
const stoneAxe  = new Item('Stone Axe',  5, 5, 0, 0, 0);
// …etc.

// Your existing Craft function
function Craft(Item) {
  if (state.wood >= Item.wood && state.stone >= Item.stone) {
    state.wood  -= Item.wood;
    state.stone -= Item.stone;
    addLog(`Crafted ${Item.name}!`);
    updateUI();
  } else {
    addLog(`Need ${Item.wood} wood and ${Item.stone} stone.`);
  }
}

// Wire up your buttons to each item
document.getElementById('craftClub').addEventListener('click', () => {
  Craft(woodenClub);
});
document.getElementById('craftAxe').addEventListener('click', () => {
  Craft(stoneAxe);
});
