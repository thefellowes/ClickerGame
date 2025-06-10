// State
const state = { wood: 0, stone: 0, food: 0, water: 0, gold: 0, weapon: null };
function updateUI() {
  document.getElementById('wood').innerText = state.wood;
  document.getElementById('stone').innerText = state.stone;
  document.getElementById('food').innerText = state.food;
  document.getElementById('water').innerText = state.water;
  document.getElementById('gold').innerText = state.gold;
}
const craftBtn = document.getElementById('Craft');
const overlay = document.getElementById('craftMenu');

// Resources
document.getElementById('gatherWood').onclick = () => {
  state.wood++; 
  addLog("Gathered wood!");
  updateUI();
};
document.getElementById('gatherStone').onclick = () => {
  state.stone++; 
  addLog("Gathered stone!");
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

// Fight
document.getElementById('startFight').onclick = () => { 
  if(!state.weapon){
    addLog('You need a weapon to fight!');
    return;} 
  startFight(); 
};
function startFight(){ 
  const enemy={hp:20,maxHp:20,name:'Bandit'}; 
  let playerHp=30;
  const fightContainer=document.createElement('div'); 
  fightContainer.id='fight';
  fightContainer.innerHTML=`<h3>Fighting ${enemy.name}</h3><div id="enemy"><p>${enemy.name} HP: ${enemy.hp}/${enemy.maxHp}</p><div class="bar"><div id="enemyBar" class="bar-inner"></div></div></div><div id="player"><p>Player HP: ${playerHp}/30</p><div class="bar"><div id="playerBar" class="bar-inner"></div></div></div><button class="btn" id="attackBtn">Attack</button>`;
  document.body.appendChild(fightContainer);
  document.getElementById('attackBtn').onclick = ()=>{
    enemy.hp-=state.weapon.damage; 
    enemy.hp=Math.max(enemy.hp,0); 
    updateBars();
    if(enemy.hp===0){
      endFight(true);
      return;
    } 
    playerHp-=3; 
    playerHp=Math.max(playerHp,0); 
    updateBars(); 
    if(playerHp===0){
      endFight(false);
    }
  };
  function updateBars(){ 
    document.querySelector('#enemy p').innerText=`${enemy.name} HP: ${enemy.hp}/${enemy.maxHp}`; 
    document.getElementById('enemyBar').style.width=(enemy.hp/enemy.maxHp*100)+'%'; 
    document.querySelector('#player p').innerText=`Player HP: ${playerHp}/30`; 
    document.getElementById('playerBar').style.width=(playerHp/30*100)+'%'; 
  }
  function endFight(v){ 
    document.getElementById('fight').remove(); 
    if(v){ 
      const loot=Math.floor(Math.random()*5)+1; 
      state.gold+=loot; 
      addLog(`You defeated the ${enemy.name} and looted ${loot} gold!`);
      updateUI(); 
    } else addLog('You were defeated!'); 
  }
}
updateUI();
