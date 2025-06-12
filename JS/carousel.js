import { Human, Insectoid, Feline, Robotic, Avian, Reptilian } from './species.js';
import { Bandits, Merchants, Explorers, Loyalists } from './faction.js';
import { player } from './character.js';
import { initialiseGame } from './init.js';

// Array of species keys matching image filenames and imports
const speciesList = [
  'Human', 'Robotic', 'Feline', 'Avian', 'Reptilian', 'Insectoid'
];
const factionList = [
  'Bandits', 'Merchants', 'Explorers', 'Loyalists'
];
let currentIndex = 0;



// Elements displaying species statistics in the selector
const speciesStrengthEl = document.getElementById('species-strength');
const speciesAwarenessEl = document.getElementById('species-awareness');
const speciesHealthEl = document.getElementById('species-health');
const speciesCharismaEl = document.getElementById('species-charisma');
const speciesIntelligenceEl = document.getElementById('species-intelligence');
const speciesAgilityEl = document.getElementById('species-agility');
const speciesLuckEl = document.getElementById('species-luck');

const leftMenu = document.getElementById('leftMenu');
const middleMenu = document.getElementById('middleMenu');
const rightMenu = document.getElementById('rightMenu');

//Species
const nameEl = document.getElementById('speciesName');
const carouselSpecies = document.getElementById('speciesSelection');
const imgElSpecies = document.getElementById('carouselImageSpecies');
const prevBtnSpecies = document.getElementById('prevBtnSpecies');
const nextBtnSpecies = document.getElementById('nextBtnSpecies');
const selectBtnSpecies = document.getElementById('selectBtnSpecies');

//Faction
const nameElFaction = document.getElementById('factionName');
const carouselFaction = document.getElementById('factionSelection');
const imgElFaction = document.getElementById('carouselImageFaction');
const prevBtnFactions = document.getElementById('prevBtnFactions');
const nextBtnFactions = document.getElementById('nextBtnFactions');
const selectBtnFactions = document.getElementById('selectBtnFaction');

// Map species names to Species objects
const speciesMap = {
  'Human': Human,
  'Robotic': Robotic,
  'Feline': Feline,
  'Avian': Avian,
  'Reptilian': Reptilian,
  'Insectoid': Insectoid
};
const factionMap = {
  'Bandits': Bandits,
  'Merchants': Merchants,
  'Explorers': Explorers,
  'Loyalists': Loyalists
};

function updateCarouselSpecies() {
  const name = speciesList[currentIndex];
  imgElSpecies.src = `Assets/Sprites/${name}.png`;
  imgElSpecies.alt = name;
  nameEl.textContent = name;
  speciesStrengthEl.textContent = `Strength: ${speciesMap[name].strength}`;
  speciesAwarenessEl.textContent = `Awareness: ${speciesMap[name].awareness}`;
  speciesHealthEl.textContent = `Health: ${speciesMap[name].health}`;
  speciesCharismaEl.textContent = `Charisma: ${speciesMap[name].charisma}`;
  speciesIntelligenceEl.textContent = `Intelligence: ${speciesMap[name].intelligence}`;
  speciesAgilityEl.textContent = `Agility: ${speciesMap[name].agility}`;
  speciesLuckEl.textContent = `Luck: ${speciesMap[name].luck}`;
}

function updateCarouselFaction() {
  const name = factionList[currentIndex];
  imgElFaction.src = `Assets/Sprites/Factions/${name}_Logo.png`;
  imgElFaction.alt = name;
  nameElFaction.textContent = name;
}

prevBtnSpecies.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + speciesList.length) % speciesList.length;
  updateCarouselSpecies();
});
nextBtnSpecies.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % speciesList.length;
  updateCarouselSpecies();
});

prevBtnFactions.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + factionList.length) % factionList.length;
  updateCarouselFaction();
});
nextBtnFactions.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % factionList.length;
  updateCarouselFaction();
});

selectBtnSpecies.addEventListener('click', () => {
  const selectedName = speciesList[currentIndex];
  const selectedSpecies = speciesMap[selectedName];
  player.updateSpecies(selectedSpecies);
  console.log('Player species set to:', player.species);
  carouselSpecies.style.display = 'none';
  carouselFaction.style.display = 'flex';
  updateCarouselFaction();
  currentIndex = 0; // Reset index for factions
});

selectBtnFactions.addEventListener('click', () => {
  const selectedName = factionList[currentIndex];
  const selectedFaction = factionMap[selectedName];
  player.faction = selectedFaction;
  console.log('Player faction set to:', player.faction);
  selectedFaction.addMember(player);
  console.log('Player added to faction:', player.faction.name);
  carouselFaction.style.display = 'none';
  leftMenu.style.display = 'block';
  middleMenu.style.display = 'block';
  rightMenu.style.display = 'block';

  // Set player name and age

  initialiseGame(player);
});


// Initialize
updateCarouselSpecies();