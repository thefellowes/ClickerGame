// farming.js
const farmBtn = document.getElementById('Farm');
const farmOverlay = document.createElement('div');
farmOverlay.className = 'menu-overlay';
farmOverlay.id = 'farmOverlay';
farmOverlay.style.display = 'none';

const farmContent = document.createElement('div');
farmContent.className = 'menu-content farm-container';

// Close button
const closeBtn = document.createElement('button');
closeBtn.textContent = 'X';
closeBtn.className = 'close-btn';
closeBtn.onclick = () => farmOverlay.style.display = 'none';
farmContent.appendChild(closeBtn);

// Farm grid
const farmGrid = document.createElement('div');
farmGrid.className = 'farm-grid'; // <-- this now creates it properly
farmContent.appendChild(farmGrid); // <-- add it to the visible DOM

// Create 3x3 clusters for a 9x9 grid
for (let yCluster = 0; yCluster < 3; yCluster++) {
  for (let xCluster = 0; xCluster < 3; xCluster++) {
    const cluster = document.createElement('div');
    cluster.className = 'farm-cluster';

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const tile = document.createElement('div');
        tile.className = 'farm-tile';
        tile.dataset.row = yCluster * 3 + y;
        tile.dataset.col = xCluster * 3 + x;
        cluster.appendChild(tile);
      }
    }

    farmGrid.appendChild(cluster);
  }
}

const tooltip = document.getElementById('tooltip');   // reuse global tooltip

const seedPanel = document.createElement('div');
seedPanel.className = 'seed-panel';

const seeds = [
  { name: 'Turnip',  img: 'turnipSeed.png'  },
  { name: 'Onion',   img: 'onionSeed.png'   },
  { name: 'Carrot',  img: 'carrotSeed.png'  },
  { name: 'Potato',  img: 'potatoSeed.png'  },
  { name: 'Radish',  img: 'radishSeed.png'  },
  { name: 'Spinach', img: 'spinachSeed.png' }
];

seeds.forEach(seed => {
  const slot = document.createElement('div');
  slot.className = 'seed-slot';

  const img = document.createElement('img');
  img.src = `Assets/Farming/Crops/${seed.img}`;
  img.alt = seed.name;

  /* tooltip on hover */
  img.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block';
    tooltip.innerHTML = seed.name;
  });
  img.addEventListener('mousemove', e => {
    tooltip.style.top  = `${e.pageY + 10}px`;
    tooltip.style.left = `${e.pageX + 10}px`;
  });
  img.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  slot.appendChild(img);
  seedPanel.appendChild(slot);
});

farmContent.appendChild(seedPanel);

farmOverlay.appendChild(farmContent);
document.body.appendChild(farmOverlay);

// Show farm when clicked
farmBtn.onclick = () => {
  farmOverlay.style.display = 'flex';
};

// Close farm when clicking outside the container
farmOverlay.addEventListener('click', (e) => {
  if (!farmContent.contains(e.target)) {
    farmOverlay.style.display = 'none';
  }
});