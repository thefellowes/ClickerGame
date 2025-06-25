import { Character, player } from './character.js';
import { addLog } from './log.js';
import { updateUI, state } from './main.js';
import { Human, Insectoid, Feline, Robotic, Avian, Reptilian } from './species.js';
import { Bandits, Merchants, Explorers, Loyalists } from './faction.js';
import { addItemToInventory } from './inventory.js';
import items from './item.js';
import { rollLoot } from './loot.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function updateUIThenDelay(callback, delay = 1000) {
  callback();
  await new Promise(requestAnimationFrame);
  await sleep(delay);
}

const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

document.getElementById('startFight').onclick = () => {
  const enemy = createRandomEnemy();
  if (!enemy) {
    addLog('Error: Unable to start fight.');
    return;
  }
  startFight(player, enemy);
};

function createRandomEnemy() {
  const name = 'Enemy';
  const age = rndInt(10, 20);
  const speciesList = [Human, Insectoid, Feline, Robotic, Avian, Reptilian];
  const factionList  = [Bandits, Merchants, Explorers, Loyalists];
  const species = speciesList[rndInt(0, speciesList.length - 1)];
  const faction = factionList[rndInt(0, factionList.length - 1)];
  return new Character({ name, age, species, faction });
}

function startFight(player, enemy) {
  const middleMenu = document.getElementById('middleMenu');
  if (middleMenu) middleMenu.style.display = 'none';
  const existing = document.getElementById('middleMenuFight');
  if (existing) existing.remove();

  // Build fight UI
  const ui = document.createElement('div');
  ui.id = 'middleMenuFight';
  ui.className = 'menu';
  ui.style.display = 'block';
  ui.innerHTML = `
    <div class="fight-top">
      <div class="hp-bar-wrap left"><div id="enemyHpBar" class="hp-bar-inner"></div></div>
      <img src="Assets/Sprites/${enemy.species.name}.png" alt="Enemy" class="fight-avatar right" />
    </div>
    <p class="hp-label top-label">${enemy.name}</p>
    <div class="vs-separator">VS</div>
    <div class="fight-bottom">
      <img src="Assets/Sprites/${player.species.name}.png" alt="Player" class="fight-avatar left" />
      <div class="hp-bar-wrap right"><div id="playerHpBar" class="hp-bar-inner"></div></div>
    </div>
    <p class="hp-label bottom-label">${player.name || 'You'}</p>
    <div class="fight-controls">
      <button id="attackBtn" class="btn">Attack</button>
      <button id="itemBtn"   class="btn">Use Item</button>
      <button id="fleeBtn"   class="btn">Flee</button>
    </div>`;
  middleMenu.parentNode.insertBefore(ui, middleMenu.nextSibling);

  // HP state
  let enemyHp  = enemy.baseStats.health;
  let playerHp = player.baseStats.health;
  const enemyMax  = enemyHp;
  const playerMax = playerHp;

  // Turn order
  let playerTurn = player.baseStats.agility >= enemy.baseStats.agility;

  // ----------------------------------------------------------
  // UI update helpers
  // ----------------------------------------------------------
  const setBars = () => {
    document.getElementById('enemyHpBar').style.width  = `${(enemyHp  / enemyMax ) * 100}%`;
    document.getElementById('playerHpBar').style.width = `${(playerHp / playerMax) * 100}%`;
  };
  setBars();

  const disableBtns = () => ['attackBtn','itemBtn','fleeBtn'].forEach(id => document.getElementById(id).disabled = true);
  const enableBtns  = () => ['attackBtn','itemBtn','fleeBtn'].forEach(id => document.getElementById(id).disabled = false);

  // ----------------------------------------------------------
  // Combat actions
  // ----------------------------------------------------------
  async function doAttack(attacker, defender, isPlayer) {
    const dmg = rndInt(1, attacker.baseStats.strength);
    if (isPlayer) enemyHp  = Math.max(0, enemyHp  - dmg);
    else          playerHp = Math.max(0, playerHp - dmg);

    await updateUIThenDelay(() => {
      addLog(`${attacker.name} deals ${dmg} damage.`);
      setBars();
    });
  }

  async function tryFlee() {
    disableBtns();
    const success = Math.random() < 0.5;
    await updateUIThenDelay(() => addLog(success ? 'You fled the fight!' : 'Failed to flee!'), 1500);
    if (success) closeFight(); else enableBtns();
  }

  function endCombatSequence(resultMsg) {
    disableBtns();
    addLog(resultMsg);
    setTimeout(closeFight, 3000);
  }

  function handleLoot() {
    const loot = rollLoot(enemy);
    if (!loot) {
      addLog('You search for loot but find nothing.');
      return;
    }

    if (typeof loot === 'string' && loot.includes('Coins')) {
      const amount = parseInt(loot.match(/\d+/)[0], 10);
      state.gold += amount;
      addLog(`You found: ${loot}`);
      updateUI();
      return;
    }

    // Item drop
    addItemToInventory(loot);
    addLog(`You found: ${loot.name}`);
    updateUI();
  }

  function closeFight() {
    ui.remove();
    if (middleMenu) middleMenu.style.display = 'block';
  }

  // ----------------------------------------------------------
  // Button wiring
  // ----------------------------------------------------------
  document.getElementById('attackBtn').onclick = async () => {
    disableBtns();

    // Attacker order for this round
    const attacker = playerTurn ? player : enemy;
    const defender = playerTurn ? enemy  : player;

    await doAttack(attacker, defender, playerTurn);

    // Check outcome after first attack
    if (enemyHp === 0 || playerHp === 0) {
      if (enemyHp === 0 && playerHp === 0) endCombatSequence("It's a draw!");
      else if (enemyHp === 0) {
        addLog(`You defeated ${enemy.name}!`);
        handleLoot();
        endCombatSequence('Victory!');
      } else endCombatSequence('You were defeated...');
      return;
    }

    // Second attack (other combatant)
    await doAttack(defender, attacker, !playerTurn);

    // Final outcome check
    if (enemyHp === 0 || playerHp === 0) {
      if (enemyHp === 0 && playerHp === 0) endCombatSequence("It's a draw!");
      else if (enemyHp === 0) {
        addLog(`You defeated ${enemy.name}!`);
        handleLoot();
        endCombatSequence('Victory!');
      } else endCombatSequence('You were defeated...');
      return;
    }

    // Next round, switch who starts
    playerTurn = !playerTurn;
    enableBtns();
  };

  document.getElementById('itemBtn').onclick = () => addLog('Using items is not implemented yet.');
  document.getElementById('fleeBtn').onclick  = tryFlee;
}