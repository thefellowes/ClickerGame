import { EmptySpecies, Species } from './species.js';
import { Faction } from './faction.js';

export class Character {
  constructor({ 
    name,           // e.g. "Gorax"
    age = 0,        
    species,        // Species instance
    faction = null  // Faction instance (optional)
  }) {
    this.name    = name;
    this.age     = age;
    if (!(species instanceof Species)) {
      throw new Error('species must be a Species');
    }
    this.species = species;
    this.faction = null;       // set via faction.addMember()

    if (faction) {
      if (!(faction instanceof Faction)) {
        throw new Error('faction must be a Faction');
      }
      faction.addMember(this);
    }
    
  }
  updateSpecies(newSpecies) {
    this.species = newSpecies;
    this.health = newSpecies.health;
    this.strength = newSpecies.strength;
    this.awareness = newSpecies.awareness;
    this.charisma = newSpecies.charisma;
    this.intelligence = newSpecies.intelligence;
    this.agility = newSpecies.agility;
    this.luck = newSpecies.luck;
  }
}

export const player = new Character({
  name: "",
  age: 0,
  species: EmptySpecies,
  faction: null,
  health: 1,
  strength: 1,
  awareness: 1,
  charisma: 1,
  intelligence: 1,
  agility: 1,
  luck: 1
});
