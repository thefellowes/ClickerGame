class Item {
  constructor(
    name,
    description = '',
    wood = 0,
    stone = 0,
    food = 0,
    water = 0,
    gold = 0,
    icon = '',
    outputCount = 1,
    slotType = '',
    modifierHealth = 0,
    modifierStrength = 0,
    modifierAwareness = 0,
    modifierCharisma = 0,
    modifierIntelligence = 0,
    modifierAgility = 0,
    modifierLuck = 0
  ) {
    this.name = name;
    this.description = description;
    this.wood = wood;
    this.stone = stone;
    this.food = food;
    this.water = water;
    this.gold = gold;
    this.icon = icon;
    this.outputCount = outputCount;
    this.slotType = slotType;

    // New stat modifiers
    this.modifierHealth = modifierHealth;
    this.modifierStrength = modifierStrength;
    this.modifierAwareness = modifierAwareness;
    this.modifierCharisma = modifierCharisma;
    this.modifierIntelligence = modifierIntelligence;
    this.modifierAgility = modifierAgility;
    this.modifierLuck = modifierLuck;
  }

  clone() {
    return new Item(
      this.name,
      this.description,
      this.wood,
      this.stone,
      this.food,
      this.water,
      this.gold,
      this.icon,
      this.outputCount,
      this.slotType,
      this.modifierHealth,
      this.modifierStrength,
      this.modifierAwareness,
      this.modifierCharisma,
      this.modifierIntelligence,
      this.modifierAgility,
      this.modifierLuck
    );
  }
}

// Exported items (if using modules)
const woodenClub = new Item(
  'Wooden Club', // Name of the item
  "A big stick", // Description of the item
  10, // Amount of wood required to craft
  0, // Amount of stone required to craft
  0, // Amount of food required to craft
  0, // Amount of water required to craft
  0, // Amount of gold required to craft
  'Assets/Sprites/Weapon/WoodenClub.png',
  1, // Output count when crafted
  'Weapon1', // Slot type for the item
  0, // Modifier for health
  2, // Modifier for strength
  0, // Modifier for awareness
  0, // Modifier for charisma
  0, // Modifier for intelligence
  -1, // Modifier for agility
  0  // Modifier for luck
);

const stoneAxe = new Item(
  'Stone Axe', // Name of the item
  "A stick with a rock attached to it", // Description of the item
  20, // Amount of wood required to craft
  5, // Amount of stone required to craft
  5, // Amount of food required to craft
  0, // Amount of water required to craft
  0, // Amount of gold required to craft
  'Assets/Sprites/Weapon/StoneAxe.png', // Icon path
  1, // Output count when crafted
  'Weapon1', // Slot type for the item
  0, // Modifier for health
  1, // Modifier for strength
  0, // Modifier for awareness
  0, // Modifier for charisma
  0, // Modifier for intelligence
  1, // Modifier for agility
  0  // Modifier for luck
);

const woodenHelmet = new Item(
  'Wooden Helmet', // Name of the item
  "A flexible twig tied around your head", // Description of the item
  15, // Amount of wood required to craft
  0, // Amount of stone required to craft
  0, // Amount of food required to craft
  0, // Amount of water required to craft
  0, // Amount of gold required to craft
  'Assets/Sprites/Helmet/WoodenHelmet.png', // Icon path
  1, // Output count when crafted
  'Helmet', // Slot type for the item
  5, // Modifier for health
  0, // Modifier for strength
  0, // Modifier for awareness
  0, // Modifier for charisma
  0, // Modifier for intelligence
  1, // Modifier for agility
  0  // Modifier for luck
);

const items= {
  woodenClub,
  stoneAxe, 
  woodenHelmet
};

export default items