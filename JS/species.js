export class Species {
  constructor({ 
    name,            // e.g. "Human"
    strength = 0,    // physical power
    awareness = 0,   // perception / vision
    health = 0,      // base max HP
    charisma = 0,    // social influence
    intelligence = 0,// smarts / skill bonus
    agility = 0,     // speed / dodge
    luck = 0         // crit / random bonus
  }) 
  {
    this.name         = name;
    this.strength     = strength;
    this.awareness    = awareness;
    this.health       = health;
    this.charisma     = charisma;
    this.intelligence = intelligence;
    this.agility      = agility;
    this.luck         = luck;
  }
}
export const Human = new Species({
  name: 'Human',
  strength:     5,
  awareness:    5,
  health:       25,
  charisma:     5,
  intelligence: 6,
  agility:      4,
  luck:         3
});
// Versatile and balanced—good all-rounders with a slight edge in smarts.

export const Insectoid = new Species({
  name: 'Insectoid',
  strength:     3,
  awareness:    6,
  health:       20,
  charisma:     1,
  intelligence: 2,
  agility:      7,
  luck:         2
});
// Fast, perceptive swarm-types; fragile and not very personable.

export const Feline = new Species({
  name: 'Feline',
  strength:     4,
  awareness:    7,
  health:       22,
  charisma:     4,
  intelligence: 3,
  agility:      8,
  luck:         3
});
// Stealthy hunters with high reflexes and keen senses.

export const Robotic = new Species({
  name: 'Robotic',
  strength:     7,
  awareness:    4,
  health:       30,
  charisma:     2,
  intelligence: 5,
  agility:      3,
  luck:         1
});
// Tough and powerful but slow and socially awkward.

export const Avian = new Species({
  name: 'Avian',
  strength:     2,
  awareness:    6,
  health:       18,
  charisma:     3,
  intelligence: 3,
  agility:      9,
  luck:         4
});
// Extremely nimble fliers with light builds and middling smarts.

export const Reptilian = new Species({
  name: 'Reptilian',
  strength:     6,
  awareness:    4,
  health:       28,
  charisma:     2,
  intelligence: 3,
  agility:      3,
  luck:         2
});
// Durable, tough-skinned warriors, but slow and a bit dull.

// Default empty species for when no selection is made
export const EmptySpecies = new Species({ name: "None" });