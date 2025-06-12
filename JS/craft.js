// Craft
document.getElementById('craftClub').onclick = () => {
  if(state.wood>=10){ 
    state.wood-=10; 
    state.weapon={name:'Wooden Club',damage:5}; 
    updateUI(); 
  } else {
    addLog('Need 10 wood.');
  }
};

function Craft(Item){
  if(state.wood>=Item.wood && state.stone>=Item.stone){ 
    state.wood-=Item.wood; 
    state.stone-=Item.stone; 
    addLog(`Crafted ${Item.name}!`); 
    updateUI(); 
  } else {
    addLog(`Need ${Item.wood} wood and ${Item.stone} stone.`);
  }
}