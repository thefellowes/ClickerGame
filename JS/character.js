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
}

export const player = new Character({
  name: "",
  age: 0,
  species: EmptySpecies,
  faction: null
});
