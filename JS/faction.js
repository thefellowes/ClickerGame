import { Character } from './character.js';

export class Faction {
  constructor(name) {
    this.name    = name;      // e.g. "Bandits"
    this.members = [];        // will hold Character instances
  }

  addMember(char) {
    if (!(char instanceof Character)) {
      throw new Error('Can only add Character instances');
    }
    this.members.push(char);
    char.faction = this;      // back‐link so char.faction always points here
  }

  removeMember(char) {
    this.members = this.members.filter(c => c !== char);
    if (char.faction === this) char.faction = null;
  }
}

export const Bandits = new Faction('Bandits');
export const Merchants = new Faction('Merchants');
export const Explorers = new Faction('Explorers');
export const Loyalists = new Faction('Loyalists');