import { EmptySpecies, Species } from './species.js';
import { Faction } from './faction.js';

export class Character {
  constructor({ name, age = 0, species, faction = null }) {
    this.name = name;
    this.age = age;

    if (!(species instanceof Species)) {
      throw new Error('species must be a Species');
    }

    this.species = species;

    this.baseStats = {
      health: species.health,
      strength: species.strength,
      awareness: species.awareness,
      charisma: species.charisma,
      intelligence: species.intelligence,
      agility: species.agility,
      luck: species.luck
    };

    this.modifiers = {
      health: 0,
      strength: 0,
      awareness: 0,
      charisma: 0,
      intelligence: 0,
      agility: 0,
      luck: 0
    };

    this.updateEffectiveStats();

    this.faction = null;
    if (faction) {
      if (!(faction instanceof Faction)) {
        throw new Error('faction must be a Faction');
      }
      faction.addMember(this);
    }
  }

  updateSpecies(newSpecies) {
    if (!(newSpecies instanceof Species)) return;
    this.species = newSpecies;

    this.baseStats = {
      health: newSpecies.health,
      strength: newSpecies.strength,
      awareness: newSpecies.awareness,
      charisma: newSpecies.charisma,
      intelligence: newSpecies.intelligence,
      agility: newSpecies.agility,
      luck: newSpecies.luck
    };

    this.updateEffectiveStats();
  }

  updateEffectiveStats() {
    console.log('Updating effective stats for', this.name);
    console.log('Base stats:', this.baseStats);
    console.log('Modifiers:', this.modifiers);
    this.health       = this.baseStats.health       + this.modifiers.health;
    this.strength     = this.baseStats.strength     + this.modifiers.strength;
    this.awareness    = this.baseStats.awareness    + this.modifiers.awareness;
    this.charisma     = this.baseStats.charisma     + this.modifiers.charisma;
    this.intelligence = this.baseStats.intelligence + this.modifiers.intelligence;
    this.agility      = this.baseStats.agility      + this.modifiers.agility;
    this.luck         = this.baseStats.luck         + this.modifiers.luck;
  }

  applyModifiers(item, direction = 'add') {
    if (!item) return;
    const sign = direction === 'add' ? 1 : -1;

    const apply = (key, modKey) => {
      const prev = this.modifiers[key];
      const mod = (item[modKey] || 0) * sign;
      const newVal = prev + mod;
      console.log(`[${direction}] ${key.toUpperCase()}: ${prev} ${sign > 0 ? '+' : '-'} ${Math.abs(mod)} = ${newVal}`);
      this.modifiers[key] = newVal;
    };

    apply('health', 'modifierHealth');
    apply('strength', 'modifierStrength');
    apply('awareness', 'modifierAwareness');
    apply('charisma', 'modifierCharisma');
    apply('intelligence', 'modifierIntelligence');
    apply('agility', 'modifierAgility');
    apply('luck', 'modifierLuck');

    this.updateEffectiveStats();
  }
}
export function updateStats(character) {
  character.updateEffectiveStats();
}

export const player = new Character({
  name: 'Player',
  age: 0,
  species: EmptySpecies,
  faction: null
});