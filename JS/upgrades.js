import { state, updateUI } from './main.js';
import { addLog } from './log.js';

class Upgrade {
  constructor(name, resourceType, wood = 0, stone = 0, food = 0, water = 0, gold = 0) {
    this.name = name;
    this.resourceType = resourceType;
    this.level = 1;
    this.hired = false;
    this.cost = { wood, stone, food, water, gold };
  }

  canAfford() {
    return Object.entries(this.cost).every(([res, val]) => state[res] >= val);
  }

  pay() {
    Object.entries(this.cost).forEach(([res, val]) => state[res] -= val);
  }

  increaseCost() {
    Object.keys(this.cost).forEach(res => this.cost[res] += 1);
  }

  getProduction() {
    if (!this.hired || this.level === 0) return 0;
    const r = 1.2;
    return 0.1 * Math.pow(r, this.level);
  }
}

const upgrades = {
  woodcutter: new Upgrade('Woodcutter', 'wood', 1, 1, 1, 1, 1),
  miner: new Upgrade('Miner', 'stone', 1, 1, 1, 1, 1),
  farmer: new Upgrade('Farmer', 'food', 1, 1, 1, 1, 1)
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCost(cost) {
  return Object.entries(cost).map(([key, value]) => {
    let color = '';
    switch (key) {
      case 'wood': color = 'green'; break;
      case 'stone': color = 'gray'; break;
      case 'food': color = 'red'; break;
      case 'water': color = 'blue'; break;
      case 'gold': color = 'goldenrod'; break;
    }
    return `<span style="color: ${color};">${value} ${key}</span>`;
  }).join('');
}

function updateUpgradeUI(role) {
  const up = upgrades[role];

  document.getElementById(`${role}Level`).innerHTML = `<span style="color: #444; padding: 0px 0px 5px 0px"><b>(Lv. ${up.level})</b></span>`;
  document.getElementById(`${role}Cost`).innerHTML = formatCost(up.cost);  // ✅ fix here

  const slot = document.getElementById(`${role}Slot`);
  const speed = up.hired ? `+${up.getProduction().toFixed(2)} ${up.resourceType} per second` : '';

  if (up.hired) {
    slot.innerHTML = `
      <img src="Assets/Sprites/${capitalize(role)}.gif" alt="${up.name}" style="height: 48px;"><br>
      <div>${up.name} working… ${speed}</div>
    `;
  } else {
    slot.innerHTML = '';
  }

  const hireBtn = document.getElementById(`hire${capitalize(role)}`);
  const upgradeBtn = document.getElementById(`upgrade${capitalize(role)}`);

  if (up.hired) {
    hireBtn.style.display = 'none';
    upgradeBtn.style.display = 'inline-block';
  } else {
    hireBtn.style.display = 'inline-block';
    upgradeBtn.style.display = 'none';
  }
}

function handleHire(role) {
  const up = upgrades[role];
  if (up.hired) {
    addLog(`${up.name} is already hired.`);
    return;
  }
  if (!up.canAfford()) {
    addLog(`Not enough resources to hire ${up.name}.`);
    return;
  }

  up.pay();
  up.hired = true;

  if (role === 'woodcutter') {
    addLog(`You pin a random person to the ground and force an axe in their hands. "You're now a ${up.name}!" you exclaim`);
  } else if (role === 'miner') {
    addLog(`You find a random person smashing a stone with another stone. You convince them to mine for you instead.`);
  } else if (role === 'farmer') {
    addLog(`You find a random person and tell them to start plucking every leaf they see and bring it to you.`);
  } else {
    throw new Error(`Unknown role: ${role}`);
  }

  updateUI();
  updateUpgradeUI(role);
}

function handleUpgrade(role) {
  const up = upgrades[role];
  if (!up.hired) {
    addLog(`You need to hire the ${up.name} first.`);
    return;
  }
  if (!up.canAfford()) {
    addLog(`Not enough resources to upgrade ${up.name}.`);
    return;
  }

  up.pay();
  up.level += 1;
  up.increaseCost();

  addLog(`${up.name} upgraded to Lv. ${up.level}.`);
  updateUI();
  updateUpgradeUI(role);
}

window.addEventListener('DOMContentLoaded', () => {
  ['woodcutter', 'miner', 'farmer'].forEach(role => {
    const hireBtn = document.getElementById(`hire${capitalize(role)}`);
    const upgradeBtn = document.getElementById(`upgrade${capitalize(role)}`);

    if (hireBtn) hireBtn.addEventListener('click', () => handleHire(role));
    if (upgradeBtn) upgradeBtn.addEventListener('click', () => handleUpgrade(role));

    updateUpgradeUI(role);
  });
});

export function tickUpgrades() {
  for (const role in upgrades) {
    const up = upgrades[role];
    if (up.hired) {
      const res = up.resourceType;
      state[res] += up.getProduction();
    }
  }
  updateUI();
}

export { upgrades };
