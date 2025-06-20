// fight.js
import { Character, player } from './character.js';
import { addLog } from './log.js';
import { updateUI } from './main.js';
import { Human, Insectoid, Feline, Robotic, Avian, Reptilian } from './species.js';
import { Bandits, Merchants, Explorers, Loyalists } from './faction.js';

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
  const age = randomInt(10, 20);
  const speciesList = [Human, Insectoid, Feline, Robotic, Avian, Reptilian];
  const factionList = [Bandits, Merchants, Explorers, Loyalists];

  const species = speciesList[randomInt(0, speciesList.length - 1)];
  const faction = factionList[randomInt(0, factionList.length - 1)];

  const enemy = new Character({ name, age, species, faction });
  addLog(`A wild ${enemy.species.name} from the ${enemy.faction.name} faction appears!`);
  return enemy;
}

function startFight(player, enemy) {
  const middleMenu = document.getElementById('middleMenu');
  const fightMenu = document.getElementById('middleMenuFight');
  if (middleMenu) {
    middleMenu.style.display = 'none';
  }

  const existingFightUI = document.getElementById('middleMenuFight');
  if (existingFightUI) existingFightUI.remove();

  const fightUI = document.createElement('div');
  fightUI.id = 'middleMenuFight';
  fightUI.className = 'fight-holder';
  fightUI.style.display = 'block';
 fightUI.innerHTML = `
  <div class="fight-top">
    <div class="hp-bar-wrap left"><div id="enemyHpBar" class="hp-bar-inner"></div></div>
    <img src="Assets/Sprites/${enemy.species.name}.png" alt="Enemy" class="fight-avatar right" />
  </div>
  <div class="enemy-stats">
    <span id="enemyStatStr">STR: ${enemy.baseStats.strength}</span>
    <span id="enemyStatAwa">AWA: ${enemy.baseStats.awareness}</span>
    <span id="enemyStatCha">CHA: ${enemy.baseStats.charisma}</span>
    <span id="enemyStatInt">INT: ${enemy.baseStats.intelligence}</span>
    <span id="enemyStatAgi">AGI: ${enemy.baseStats.agility}</span>
  </div>
  <p id="enemyName" class="hp-label top-label">${enemy.name}</p>


  <div class="vs-separator">VS</div>

  <div class="fight-bottom">
    <img src="Assets/Sprites/${player.species.name}.png" alt="Player" class="fight-avatar left" />
    <div class="hp-bar-wrap right"><div id="playerHpBar" class="hp-bar-inner"></div></div>
  </div>
  <div class="player-stats">
    <span id="playerStatStr">STR: ${player.baseStats.strength}</span>
    <span id="playerStatAwa">AWA: ${player.baseStats.awareness}</span>
    <span id="playerStatCha">CHA: ${player.baseStats.charisma}</span>
    <span id="playerStatInt">INT: ${player.baseStats.intelligence}</span>
    <span id="playerStatAgi">AGI: ${player.baseStats.agility}</span>
  </div>
  <p id="playerName" class="hp-label bottom-label">${player.name || 'You'}</p>

  <button id="attackBtn" class="btn">Attack</button>
  <button id="itemBtn" class="btn">Use Item</button>
  <button id="fleeBtn" class="btn">Flee</button>
`;

  document.getElementById('middleMenu').parentNode.appendChild(fightUI);

  let enemyHp = enemy.baseStats.health;
  let playerHp = player.baseStats.health;
  const enemyMaxHp = enemyHp;
  const playerMaxHp = playerHp;

  const updateBars = () => {
    document.getElementById('enemyHpBar').style.width = (enemyHp / enemyMaxHp) * 100 + '%';
    document.getElementById('playerHpBar').style.width = (playerHp / playerMaxHp) * 100 + '%';

   // Update text-based stats
    document.getElementById('enemyStatHp').textContent = `HP: ${enemyHp}`;
    document.getElementById('playerStatHp').textContent = `HP: ${playerHp}`;
  };

  updateBars();

  document.getElementById('attackBtn').onclick = () => {
    const damageToEnemy = randomInt(1, player.baseStats.strength);
    const damageToPlayer = randomInt(1, enemy.baseStats.strength);
    enemyHp = Math.max(0, enemyHp - damageToEnemy);
    playerHp = Math.max(0, playerHp - damageToPlayer);

    addLog(`You deal ${damageToEnemy} damage, take ${damageToPlayer} in return.`);
    updateBars();
    updateUI();

    if (enemyHp === 0 || playerHp === 0) endFight();
  };

  document.getElementById('itemBtn').onclick = () => {
    addLog('You use an item! (Not implemented)');
  };

  document.getElementById('fleeBtn').onclick = () => {
    const success = Math.random() < 0.5;
    if (success) {
      addLog('You successfully fled the fight!');
      closeFight();
    } else {
      addLog('Failed to flee!');
    }
  };

  function endFight() {
    document.getElementById('attackBtn').disabled = true;
    document.getElementById('itemBtn').disabled = true;
    document.getElementById('fleeBtn').disabled = true;

    if (enemyHp === 0 && playerHp === 0) {
      addLog("It's a draw!");
    } else if (enemyHp === 0) {
      addLog(`You defeated ${enemy.name}!`);
    } else {
      addLog("You were defeated...");
    }

    setTimeout(() => closeFight(), 2000);
  }

  function closeFight() {
    const fightUI = document.getElementById('middleMenuFight');
    if (fightUI) fightUI.remove();
    if (middleMenu) middleMenu.style.display = 'block';
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
