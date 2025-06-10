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
    menuHealth.textContent = `Health: ${Player.health}`;
    menuStrength.textContent = `Strength: ${Player.strength}`;
    menuAwareness.textContent = `Awareness: ${Player.awareness}`;
    menuCharisma.textContent = `Charisma: ${Player.charisma}`;
    menuIntelligence.textContent = `Intelligence: ${Player.intelligence}`;
    menuAgility.textContent = `Agility: ${Player.agility}`;
    menuLuck.textContent = `Luck: ${Player.luck}`;
    
    // Initialize other game elements as needed
    updateUI();
    addLog('Game initialized. Good luck!');
}