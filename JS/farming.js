// farming.js
import { state, updateUI } from './main.js';
import { addLog }         from './log.js';

const farmBtn      = document.getElementById('Farm');
const farmOverlay  = document.createElement('div');
farmOverlay.className = 'menu-overlay';

autoHide(farmOverlay);

const harvestFood = {
  Turnip: 1,
  Onion: 2,
  Carrot: 5,
  Potato: 10,
  Radish: 25,
  Spinach: 50
};

const seeds = [
  { name: 'Turnip',  img: 'turnipSeed.png',  cost: 0,  food: 1,  growth: 10 },
  { name: 'Onion',   img: 'onionSeed.png',   cost: 1,  food: 2,  growth: 20 },
  { name: 'Carrot',  img: 'carrotSeed.png',  cost: 2,  food: 5,  growth: 180 },
  { name: 'Potato',  img: 'potatoSeed.png',  cost: 5,  food: 10, growth: 240 },
  { name: 'Radish',  img: 'radishSeed.png',  cost: 10,  food: 25, growth: 300 },
  { name: 'Spinach', img: 'spinachSeed.png', cost: 25,  food: 50, growth: 360 }
];

let selectedSeedSlot = null;

autoBuildOverlay();
const MAX_STAGE  = 4;

setInterval(checkGrowth, 1000);

farmBtn.onclick = () => {
  farmOverlay.style.display = 'flex';
};

function autoBuildOverlay() {
  const farmContent     = document.createElement('div');
  farmContent.className = 'menu-content farm-container';

  const closeBtn        = document.createElement('button');
  closeBtn.className    = 'close-btn';
  closeBtn.textContent  = 'X';
  closeBtn.onclick      = () => farmOverlay.style.display = 'none';

  farmContent.appendChild(closeBtn);
  farmContent.appendChild(buildGrid());
  farmContent.appendChild(buildSeedPanel());
  farmOverlay.appendChild(farmContent);
  document.body.appendChild(farmOverlay);
}

function buildGrid() {
  const grid = document.createElement('div');
  grid.className = 'farm-grid';

  for (let yc = 0; yc < 3; yc++) {
    for (let xc = 0; xc < 3; xc++) {
      const cluster = document.createElement('div');
      cluster.className = 'farm-cluster';

      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const tile = document.createElement('div');
          tile.className = 'farm-tile';
          tile.dataset.row = yc * 3 + y;
          tile.dataset.col = xc * 3 + x;

          tile.addEventListener('mouseenter', () => tile.classList.add('hover'));
          tile.addEventListener('mouseleave', () => tile.classList.remove('hover'));
          tile.addEventListener('click', () => onTileClick(tile));

          cluster.appendChild(tile);
        }
      }
      grid.appendChild(cluster);
    }
  }
  return grid;
}

function buildSeedPanel() {
  const tooltip   = document.getElementById('tooltip');
  const panel     = document.createElement('div');
  panel.className = 'seed-panel';

    seeds.forEach((s, index) => {
    const slot = document.createElement('div');
    slot.className = 'seed-slot';
    slot.dataset.index = index; // ← Properly defined here
    const img = document.createElement('img');
    img.src = `Assets/Farming/Crops/${s.img}`;
    img.alt = s.name;
    img.title = s.name;

    slot.appendChild(img);

    img.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
      tooltip.textContent   = s.name;
    });
    img.addEventListener('mousemove', e => {
      tooltip.style.top  = `${e.pageY + 10}px`;
      tooltip.style.left = `${e.pageX + 10}px`;
    });
    img.addEventListener('mouseleave', () => tooltip.style.display = 'none');

    img.addEventListener('click', () => toggleSeed(slot));

    slot.appendChild(img);

    const details = document.createElement('div');
    details.className = 'seed-details';
    details.innerHTML = `
        <span style="color: #3498db;">💧 -${s.cost}</span>
        <span style="color: #c0392b;">🍽️ +${s.food}</span>
        <span style="color: #888;">⏱ ${String(Math.floor(s.growth / 60)).padStart(2, '0')}:${String(s.growth % 60).padStart(2, '0')}</span>
        `;
    slot.appendChild(details);

    panel.appendChild(slot);
  });
  return panel;
}

function toggleSeed(slot) {
  if (selectedSeedSlot === slot) {
    slot.classList.remove('selected');
    selectedSeedSlot = null;
  } else {
    if (selectedSeedSlot) selectedSeedSlot.classList.remove('selected');
    slot.classList.add('selected');
    selectedSeedSlot = slot;
  }
}

function onTileClick(tile) {
  const existingCrop = tile.querySelector('.crop-image');

  if (existingCrop) {
    const stage = Number(existingCrop.dataset.stage);
    const cropName = existingCrop.dataset.crop;

    if (stage === MAX_STAGE) {
      if (selectedSeedSlot) {
        addLog('Put the seeds away before harvesting!');
        return;
      }
      tile.innerHTML = '';
      delete tile.dataset.plantedTime;
      state.food += harvestFood[cropName] || 0;
      updateUI();
      addLog(`You harvested some ${cropName} (+${harvestFood[cropName]} food)`);
    }
    return;
  }

  if (!selectedSeedSlot) return;
  const seedName = selectedSeedSlot.querySelector('img').alt;
  plantCrop(tile, seedName);
}

function plantCrop(tile, name) {
  if (tile.querySelector('.crop-image')) return;
  
  const index = selectedSeedSlot.dataset.index;
  const seed = seeds[index];
  if (state.water < seed.cost) {
    addLog(`Not enough water to plant ${seed.name}.`);
    return;
  }
  
  state.water -= seed.cost;
  updateUI();

  const img = document.createElement('img');
  img.className = 'crop-image';
  img.src   = `Assets/Farming/Crops/${name.toLowerCase()}1.png`;
  img.alt   = `${name} (Growing)`;
  img.title = `${name} (1/4)`;
  img.dataset.stage       = '1';
  img.dataset.plantedTime = Date.now();
  img.dataset.crop        = name;
  img.dataset.growTime    = seeds[selectedSeedSlot.dataset.index].growth * 1000;

  const tooltip = document.getElementById('tooltip');
  img.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block';
    tooltip.textContent   = img.title;
  });
  img.addEventListener('mousemove', e => {
    tooltip.style.top  = `${e.pageY + 10}px`;
    tooltip.style.left = `${e.pageX + 10}px`;
  });
  img.addEventListener('mouseleave', () => tooltip.style.display = 'none');

  tile.appendChild(img);
}

function checkGrowth() {
  const tooltip = document.getElementById('tooltip');
  document.querySelectorAll('.crop-image').forEach(img => {
    const stage        = Number(img.dataset.stage);
    const plantedTime  = Number(img.dataset.plantedTime);
    const name         = img.dataset.crop;
    const growTime     = Number(img.dataset.growTime);

    if (stage >= MAX_STAGE) return;

    if (Date.now() - plantedTime >= growTime * stage) {
      const nextStage = stage + 1;
      img.dataset.stage = String(nextStage);
      if (nextStage === MAX_STAGE) {
        img.src   = `Assets/Farming/Crops/${name.toLowerCase()}.png`;
        img.title = `${name} (Fully grown)`;
        img.classList.add('fully-grown');
      } else {
        img.src   = `Assets/Farming/Crops/${name.toLowerCase()}${nextStage}.png`;
        img.title = `${name} (${nextStage}/4)`;
      }

      if (tooltip.style.display === 'block' && tooltip.textContent.startsWith(name)) {
        tooltip.textContent = img.title;
      }
    }
  });
}


function autoHide(overlay) {
  overlay.addEventListener('click', e => {
    const content = overlay.querySelector('.menu-content');
    if (!content.contains(e.target)) overlay.style.display = 'none';
  });
}
