import { updateUI } from './main.js';
import { addLog } from './log.js';

const playerImage = document.getElementById('characterImage');
const menuHealth = document.getElementById('health');
const menuStrength = document.getElementById('strength');
const menuAwareness = document.getElementById('awareness'); 
const menuCharisma = document.getElementById('charisma');
const menuIntelligence = document.getElementById('intelligence');
const menuAgility = document.getElementById('agility');
const menuLuck = document.getElementById('luck');

function initialiseGame(Player) {
    // Set initial player stats
    playerImage.src = `Assets/Sprites/${Player.species.name.toLowerCase()}.png`;
    menuHealth.textContent = `${Player.health}`;
    menuStrength.textContent = `${Player.strength}`;
    menuAwareness.textContent = `${Player.awareness}`;
    menuCharisma.textContent = `${Player.charisma}`;
    menuIntelligence.textContent = `${Player.intelligence}`;
    menuAgility.textContent = `${Player.agility}`;
    menuLuck.textContent = `${Player.luck}`;
    
    // Initialize other game elements as needed
    updateUI();
    addLog('Game initialized. Good luck!');
}

export { initialiseGame };