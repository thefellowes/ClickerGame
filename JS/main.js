// JS/main.js
// State
export const state = { wood: 50, stone: 50, food: 50, water: 50, gold: 50, weapon: null };

import './log.js';
import './carousel.js';
import './item.js';
import './inventory.js';
import './floating.js';
import './craft.js';
import { player } from './character.js';
import { upgrades, tickUpgrades } from './upgrades.js';
import { addLog } from './log.js';
import {  } from './upgrades.js';

export function updateUI() {

  // Resource display
document.getElementById('wood').innerText = Math.floor(state.wood);
document.getElementById('stone').innerText = Math.floor(state.stone);
document.getElementById('food').innerText = Math.floor(state.food);
document.getElementById('water').innerText = Math.floor(state.water);
document.getElementById('gold').innerText = Math.floor(state.gold);
document.getElementById('wood').innerHTML  = `<span class="green"><b>${Math.floor(state.wood)}</b></span>`;
document.getElementById('stone').innerHTML = `<span class="gray"><b>${Math.floor(state.stone)}</span>`;
document.getElementById('food').innerHTML  = `<span class="red"><b>${Math.floor(state.food)}</b></span>`;
document.getElementById('water').innerHTML = `<span class="blue"><b>${Math.floor(state.water)}</b></span>`;
document.getElementById('gold').innerHTML  = `<span class="yellow"><b>${Math.floor(state.gold)}</b></span>`;

  // Player stat display
  try {
    if (player !== '') {
      const formatStat = (base, mod) => {
        if (mod === 0) return `${base}`;
        const sign = mod > 0 ? '+' : '−';
        const color = mod > 0 ? 'green' : 'red';
        return `${base} <span style="color:${color}; font-size: 0.9em;">${sign}${Math.abs(mod)}</span>`;
      };
      document.getElementById('health').innerHTML       = formatStat(player.baseStats.health, player.modifiers.health);
      document.getElementById('strength').innerHTML     = formatStat(player.baseStats.strength, player.modifiers.strength);
      document.getElementById('awareness').innerHTML    = formatStat(player.baseStats.awareness, player.modifiers.awareness);
      document.getElementById('charisma').innerHTML     = formatStat(player.baseStats.charisma, player.modifiers.charisma);
      document.getElementById('intelligence').innerHTML = formatStat(player.baseStats.intelligence, player.modifiers.intelligence);
      document.getElementById('agility').innerHTML      = formatStat(player.baseStats.agility, player.modifiers.agility);
      document.getElementById('luck').innerHTML         = formatStat(player.baseStats.luck, player.modifiers.luck);
    } else {
      console.warn('Player is not yet initialized');
    }
  } catch (err) {
    console.error('Failed to update player stats UI:', err);
  }
}

// Game clock
setInterval(tickUpgrades, 1000); // every second

const craftBtn = document.getElementById('Craft');
const overlay = document.getElementById('craftMenu');

// Resources
document.getElementById('gatherWood').onclick = () => {
  state.wood++; 
  addLog("Chopped wood!");
  updateUI();
};
document.getElementById('gatherStone').onclick = () => {
  state.stone++; 
  addLog("Mined stone!");
  updateUI();
};

// Toggle menu on button click
craftBtn.addEventListener('click', () => {
  overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
});

// Clicking outside the menu closes it
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.style.display = 'none';
  }
});
// Close menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    overlay.style.display = 'none';
  }
});