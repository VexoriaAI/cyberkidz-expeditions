// ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT LÓGICO
// VERSÃO 3.3: Modal de Equipamento Interativo
// ====================================================================

// ====================================================================
// SEÇÃO 1: DEFINIÇÕES DE DADOS E CONSTANTES
// ====================================================================

const MAX_DAYS = 10;
const HEX_MAP_RADIUS = 3; 

// --- 1.1: Atributos Base das Tribos ---
const TRIBES = {
    VOLCANICS: {
        name: "Volcanics",
        bonus: "Burning Ridge",
        baseStats: { damage: 4, critDamage: 5, defense: 3, blockChance: 3, critChance: 2, speed: 12, attackSpeed: 1, hpRegen: 1, ap: 3, hp: 110, luck: 0 }
    },
    UNDERGROUNDERS: {
        name: "Undergrounders",
        bonus: "Abandoned Mines",
        baseStats: { damage: 2, critDamage: 2, defense: 5, blockChance: 5, critChance: 1, speed: 15, attackSpeed: 2, hpRegen: 2, ap: 4, hp: 120, luck: 0 }
    },
    NOCTURNALS: {
        name: "Nocturnals",
        bonus: "Ancient Ruins",
        baseStats: { damage: 3, critDamage: 3, defense: 2, blockChance: 1, critChance: 5, speed: 15, attackSpeed: 4, hpRegen: 1, ap: 4, hp: 100, luck: 0 }
    },
    RADIOACTIVES: {
        name: "Radioactives",
        bonus: "Lake Rancid",
        baseStats: { damage: 2, critDamage: 2, defense: 1, blockChance: 1, critChance: 3, speed: 20, attackSpeed: 5, hpRegen: 1, ap: 5, hp: 80, luck: 0 }
    },
    REPTILIANS: {
        name: "Reptilians",
        bonus: "Covenant Swamp",
        baseStats: { damage: 3, critDamage: 2, defense: 3, blockChance: 2, critChance: 2, speed: 13, attackSpeed: 2, hpRegen: 5, ap: 3, hp: 100, luck: 0 }
    }
};

// --- 1.2: Biomas do Jogo ---
const BIOMES = [
    { name: "Burning Ridge", resource: "scrap", affinity: "Volcanics", color: '#8B4513' },
    { name: "Covenant Swamp", resource: "food", affinity: "Reptilians", color: '#3CB371' },
    { name: "Lake Rancid", resource: "food", affinity: "Radioactives", color: '#20B2AA' },
    { name: "Ancient Ruins", resource: "scrap", affinity: "Nocturnals", color: '#4F4F4F' },
    { name: "Abandoned Mines", resource: "water", affinity: "Undergrounders", color: '#696969' },
    { name: "Wasteland", resource: "scrap", affinity: "None", color: '#555555' }
];

// --- 1.3: Inimigos ---
const ENEMY = {
    DRONE: { name: "CKC Drone", strength: 5, hp: 10, reward: 2 },
    MUTANT: { name: "Wasteland Mutant", strength: 8, hp: 15, reward: 5 }
};

// --- 1.4: Banco de Dados de Crafting ---
const MATERIALS = {
    scrap: { name: "Scrap", type: "Base", icon: "icon_scrap.png" }, 
    water: { name: "Clean Water", type: "Base", icon: "icon_water.png" }, 
    food: { name: "Food", type: "Base", icon: "icon_food.png" },
    metal: { name: "Metal", type: "Volcanic", icon: "icon_metal.png" }, 
    magma: { name: "Magma", type: "Volcanic", icon: "icon_magma.png" }, 
    pumice: { name: "Volcanic Pumice Stone", type: "Volcanic", icon: "icon_pumice.png" }, 
    obsidian: { name: "Obsidian Tears", type: "Volcanic", icon: "icon_obsidian.png" },
    crystal: { name: "Energized Crystals", type: "Undergrounder", icon: "icon_crystal.png" }, 
    pure_water: { name: "Pure Water", type: "Undergrounder", icon: "icon_pure_water.png" }, 
    clay: { name: "Special Clay", type: "Undergrounder", icon: "icon_clay.png" }, 
    glass: { name: "Glass", type: "Undergrounder", icon: "icon_glass.png" },
    polymer: { name: "Polymer", type: "Nocturnal", icon: "icon_polymer.png" }, 
    nanochips: { name: "Nanochips", type: "Nocturnal", icon: "icon_nanochips.png" }, 
    implants: { name: "Cybernetic Implants", type: "Nocturnal", icon: "icon_implants.png" }, 
    quantum_core: { name: "Quantum Energy Core", type: "Nocturnal", icon: "icon_quantum_core.png" },
    healing_plants: { name: "Healing Plants", type: "Reptilian", icon: "icon_healing_plants.png" }, 
    fungi: { name: "Hallucinogenic Fungi", type: "Reptilian", icon: "icon_fungi.png" }, 
    reptile_blood: { name: "Reptilian Blood", type: "Reptilian", icon: "icon_reptile_blood.png" }, 
    animal_skin: { name: "Animal Skin", type: "Reptilian", icon: "icon_animal_skin.png" },
    strange_fluid: { name: "Strange Fluid", type: "Radioactive", icon: "icon_strange_fluid.png" }, 
    parasitic_fungus: { name: "Parasitic Fungus", type: "Radioactive", icon: "icon_parasitic_fungus.png" }, 
    venom_glands: { name: "Venom Glands", type: "Radioactive", icon: "icon_venom_glands.png" }, 
    luminescent_algae: { name: "Luminescent Algae", type: "Radioactive", icon: "icon_luminescent_algae.png" }
};
const COMPONENTS = {
    volcanic_core: { name: "Volcanic Core", type: "Damage", stats: { damage: 5, critDamage: 5 } },
    defense_plate: { name: "Defense Plate", type: "Defense", stats: { defense: 5, blockChance: 3 } },
    precision_lens: { name: "Precision Lens", type: "Crit", stats: { critChance: 5 } },
    speed_injector: { name: "Speed Injector", type: "Speed", stats: { speed: 2, attackSpeed: 3 } },
    heal_totem: { name: "Heal Totem", type: "Heal", stats: { hpRegen: 3 } },
    lucky_clover: { name: "Lucky Clover", type: "Universal", stats: { luck: 5 } }
};
const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
const SYNERGY_MAP = {
    helmet: ['Defense', 'Crit', 'Universal'], weapon: ['Damage', 'Crit', 'Speed', 'Universal'],
    accessory: ['Damage', 'Crit', 'Speed', 'Heal', 'Defense', 'Universal'], armor: ['Defense', 'Heal', 'Universal'],
    gloves: ['Damage', 'Speed', 'Crit', 'Universal'], implant: ['Damage', 'Crit', 'Speed', 'Heal', 'Defense', 'Universal'],
    boots: ['Defense', 'Speed', 'Universal']
};
const RECIPES_CRAFT_EMPTY = {
    empty_helmet: { name: "Rustic Helmet (Empty)", cost: { scrap: 8 } },
    empty_weapon: { name: "Rustic Blade (Empty)", cost: { scrap: 10 } },
    empty_armor: { name: "Rustic Chestplate (Empty)", cost: { scrap: 15 } },
};
const RECIPES_REFINE = {
    volcanic_core: { name: "Volcanic Core", cost: { metal: 10, magma: 5, pumice: 2 } },
    defense_plate: { name: "Defense Plate", cost: { crystal: 10, clay: 5, glass: 2 } },
    lucky_clover: { name: "Lucky Clover", cost: { scrap: 20, water: 20, food: 20 } }
};


// ====================================================================
// SEÇÃO 2: ESTADO GLOBAL DO JOGO (MASTER STATE)
// ====================================================================

let gameState = {
    currentDay: 0,
    isCombat: false,
    player: {
        activeKid: null,
        tezerium: 1000, 
        inventory: {
            materials: { scrap: 100, water: 100, food: 100, metal: 5, magma: 2, pumice: 1, crystal: 5, clay: 2, glass: 1, polymer: 0, nanochips: 0, implants: 0, quantum_core: 0, healing_plants: 0, fungi: 0, reptile_blood: 0, animal_skin: 0, strange_fluid: 0, parasitic_fungus: 0, venom_glands: 0, luminescent_algae: 0 },
            components: { volcanic_core: 1, defense_plate: 1, precision_lens: 1, speed_injector: 1, heal_totem: 1, lucky_clover: 1 },
            // NOVO: Inventário de equipamento simulado
            equipment: [
                { id: 'h1', name: 'Capacete de Cristal (Nv 1)', slot: 'helmet', stats: { defense: 5, blockChance: 3 }, components: ['defense_plate'], icon: '🛡️' },
                { id: 'a1', name: 'Armadura da Sorte (Nv 1)', slot: 'armor', stats: { luck: 5 }, components: ['lucky_clover'], icon: '🍀' },
                { id: 'w1', name: 'Lâmina Vulcânica (Nv 1)', slot: 'weapon', stats: { damage: 5, critDamage: 5 }, components: ['volcanic_core'], icon: '⚔️' }
            ]
        },
        equipped: { helmet: null, weapon: null, accessory: null, armor: null, gloves: null, implant: null, boots: null }
    },
    expedition: {
        playerPos: { q: 0, r: 0 },
        stats: {},
        currentHP: 100,
        currentAP: 0,
        maxAP: 0,
        currentMP: 0,
        maxMP: 0,
        resourcesFound: { scrap: 0, water: 0, food: 0 }
    },
    gameMap: new Map()
};

// Carteira Simulada (MOCK_WALLET)
const MOCK_WALLET = [
    { 
        id: '#313', 
        name: 'Blue Mutant', 
        tribe: TRIBES.RADIOACTIVES, 
        img: 'https://i.imgur.com/L8J3tS2.png' 
    },
    { 
        id: '#222', 
        name: 'Demo Nocturnal', 
        tribe: TRIBES.NOCTURNALS, 
        img: 'https://via.placeholder.com/150/4B0082/FFFFFF?text=CKC+222' 
    },
    { 
        id: '#111', 
        name: 'Demo Volcanic', 
        tribe: TRIBES.VOLCANICS, 
        img: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=CKC+111'
    }
];
const DEMO_KID = MOCK_WALLET[0];


// ====================================================================
// SEÇÃO 3: GERENCIAMENTO DE TELA
// ====================================================================

function showScreen(screenId) {
    document.getElementById('logged-out-screen').style.display = 'none';
    document.getElementById('dashboard-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'block';
    }
}

// ====================================================================
// SEÇÃO 4: LÓGICA DO DASHBOARD (HUB)
// ====================================================================

function setupDashboardTabs() {
    const craftingPanel = document.getElementById('crafting-panel');
    craftingPanel.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-btn')) return;
        const tabName = e.target.dataset.tab;
        
        craftingPanel.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        craftingPanel.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
}

function renderDashboard() {
    const nftListContainer = document.getElementById('nft-list-container');
    nftListContainer.innerHTML = '<h4>Your Kidz (Simulated)</h4>';
    
    document.getElementById('kid-details-placeholder').style.display = 'block';
    document.getElementById('kid-details-content').style.display = 'none';
    document.getElementById('start-expedition-btn').disabled = true;

    MOCK_WALLET.forEach(nft => {
        const nftDiv = document.createElement('div');
        nftDiv.className = 'nft-list-item';
        nftDiv.dataset.nftId = nft.id; 
        
        nftDiv.innerHTML = `
            <img src="${nft.img}" alt="${nft.name}">
            <div class="nft-list-item-info">
                <p><strong>${nft.tribe.name}</strong></p>
                <p>${nft.id}</p>
            </div>
        `;
        nftDiv.onclick = () => selectActiveKid(nft);
        nftListContainer.appendChild(nftDiv);
    });

    renderInventory();
    renderCraftingRecipes();
}

function selectActiveKid(nft) {
    gameState.player.activeKid = nft;

    document.querySelectorAll('.nft-list-item').forEach(item => {
        item.classList.remove('selected');
        if (item.dataset.nftId === nft.id) {
            item.classList.add('selected');
        }
    });

    document.getElementById('kid-details-placeholder').style.display = 'none';
    document.getElementById('kid-details-content').style.display = 'block';

    document.getElementById('dash-kid-name').textContent = nft.name;
    document.getElementById('dash-kid-id').textContent = nft.id;
    document.getElementById('dash-kid-tribe').textContent = nft.tribe.name;
    document.getElementById('dash-kid-image').innerHTML = `<img src="${nft.img}" alt="${nft.name}">`;

    document.getElementById('start-expedition-btn').disabled = false;
    
    renderEquippedItems();
    calculateFinalStats();
}

// ATUALIZADO: Gerencia os botões '+' e 'X'
function renderEquippedItems() {
    for (const slotName of EQUIPMENT_SLOTS) {
        const slotDiv = document.getElementById(`equip-slot-${slotName}`);
        const removeBtn = document.querySelector(`.equip-remove-btn[data-slot="${slotName}"]`);
        
        const itemId = gameState.player.equipped[slotName];
        const item = gameState.player.inventory.equipment.find(e => e.id === itemId);

        if (item) {
            // Item Equipado
            slotDiv.innerHTML = `<img src="images/icon_item_placeholder.png" alt="${item.name}" title="${item.name}">`; // Usar item.icon se tiver
            slotDiv.classList.add('equipped');
            removeBtn.style.display = 'block';
        } else {
            // Slot Vazio
            slotDiv.innerHTML = '<span>+</span>';
            slotDiv.classList.remove('equipped');
            removeBtn.style.display = 'none';
        }
    }
}


function renderInventory() {
    const inventoryGrid = document.getElementById('inventory-grid-materials');
    inventoryGrid.innerHTML = ''; 
    for (const materialId in gameState.player.inventory.materials) {
        const material = MATERIALS[materialId];
        const amount = gameState.player.inventory.materials[materialId];
        if (material) {
            inventoryGrid.innerHTML += `
                <img src="images/${material.icon}" alt="${material.name}" class="inventory-item-icon" title="${material.name}" onerror="this.style.display='none'">
                <span class="inventory-item-name">${material.name}:</span>
                <span class="inventory-item-qty" id="inv-${materialId}">${amount}</span>
            `;
        }
    }
}

function renderCraftingRecipes() {
    const tabRefine = document.getElementById('tab-refine');
    const tabCraft = document.getElementById('tab-craft');
    tabRefine.innerHTML = '<h4>Refine Components</h4>';
    tabCraft.innerHTML = '<h4>Craft Empty Gear</h4>';

    for (const compId in RECIPES_REFINE) {
        const recipe = RECIPES_REFINE[compId];
        let costHtml = Object.entries(recipe.cost).map(([matId, amt]) => {
            if (MATERIALS[matId]) {
                return `<img src="images/${MATERIALS[matId].icon}" class="recipe-icon" title="${MATERIALS[matId].name}" onerror="this.style.display='none'"> x${amt}`;
            }
            return `? x${amt}`;
        }).join(' + ');

        tabRefine.innerHTML += `
            <div class="crafting-recipe">
                <span class="recipe-cost">${costHtml} = <strong>${recipe.name}</strong></span>
                <button class="action-btn small-btn" onclick="refineComponent('${compId}')">Refine</button>
            </div>`;
    }

    for (const itemId in RECIPES_CRAFT_EMPTY) {
        const recipe = RECIPES_CRAFT_EMPTY[itemId];
        let costHtml = Object.entries(recipe.cost).map(([matId, amt]) => {
            if (MATERIALS[matId]) {
                return `<img src="images/${MATERIALS[matId].icon}" class="recipe-icon" title="${MATERIALS[matId].name}" onerror="this.style.display='none'"> x${amt}`;
            }
            return `? x${amt}`;
        }).join(' + ');

        tabCraft.innerHTML += `
            <div class="crafting-recipe">
                <span class="recipe-cost">${costHtml} = <strong>${recipe.name}</strong></span>
                <button class="action-btn small-btn" onclick="craftEmptyItem('${itemId}')">Craft</button>
            </div>`;
    }
}

function craftEmptyItem(itemId) {
    alert(`(Simulado) Crafting: ${RECIPES_CRAFT_EMPTY[itemId].name}`);
}

function refineComponent(compId) {
    alert(`(Simulado) Refining: ${RECIPES_REFINE[compId].name}`);
}

function calculateFinalStats() {
    if (!gameState.player.activeKid) return;

    let baseStats = gameState.player.activeKid.tribe.baseStats;
    let finalStats = { ...baseStats }; 
    
    if (!finalStats.luck) finalStats.luck = 0;
    if (!finalStats.hp) finalStats.hp = 100;

    for (const slot of EQUIPMENT_SLOTS) {
        const itemId = gameState.player.equipped[slot];
        if (!itemId) continue;
        const item = gameState.player.inventory.equipment.find(e => e.id === itemId);
        if (!item || !item.stats) continue;
        for (const stat in item.stats) {
            if (finalStats.hasOwnProperty(stat)) {
                finalStats[stat] += item.stats[stat];
            }
        }
    }

    gameState.expedition.stats = finalStats;

    // Atualiza display do Dashboard
    document.getElementById('dash-stat-dmg').textContent = finalStats.damage;
    document.getElementById('dash-stat-def').textContent = finalStats.defense;
    document.getElementById('dash-stat-crit').textContent = `${finalStats.critChance}%`;
    document.getElementById('dash-stat-luck').textContent = `${finalStats.luck}%`;
}

// --- 5.4: Lógica do Modal de Equipamento ---
function openEquipmentModal(slotName) {
    const modal = document.getElementById('equipment-select-modal');
    const title = document.getElementById('modal-equip-title');
    const list = document.getElementById('modal-equip-list');
    
    title.textContent = `Select ${slotName}`;
    list.innerHTML = ''; // Limpa a lista

    // Filtra o inventário por itens que correspondem ao slot
    const itemsForSlot = gameState.player.inventory.equipment.filter(item => item.slot === slotName);

    if (itemsForSlot.length === 0) {
        list.innerHTML = '<p>No items found for this slot. Go craft some!</p>';
    } else {
        itemsForSlot.forEach(item => {
            // Constrói a string de stats
            const statsHtml = Object.entries(item.stats).map(([stat, value]) => {
                return `<p class="item-stats">${stat}: +${value}</p>`;
            }).join('');
            
            // Constrói a string de componentes
            const componentsHtml = `<p class="item-components">Components: ${item.components.join(', ')}</p>`;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'equip-list-item';
            itemDiv.innerHTML = `
                <h4>${item.name}</h4>
                ${statsHtml}
                ${componentsHtml}
            `;
            itemDiv.onclick = () => equipItem(item.id, slotName);
            list.appendChild(itemDiv);
        });
    }
    
    modal.style.display = 'flex';
}

function closeEquipmentModal() {
    document.getElementById('equipment-select-modal').style.display = 'none';
}

function equipItem(itemId, slotName) {
    gameState.player.equipped[slotName] = itemId;
    renderEquippedItems();
    calculateFinalStats();
    closeEquipmentModal();
}

function unequipItem(slotName) {
    gameState.player.equipped[slotName] = null;
    renderEquippedItems();
    calculateFinalStats();
}


// ====================================================================
// SEÇÃO 6: LÓGICA DO MAPA HEXAGONAL
// ====================================================================

function axialToPixel(q, r) {
    const size = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-size')) / 2;
    const x = size * (3/2 * q);
    const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x, y };
}

function axialDistance(q1, r1, q2, r2) {
    return (Math.abs(q1 - q2) 
          + Math.abs(q1 + r1 - q2 - r2) 
          + Math.abs(r1 - r2)) / 2;
}

function generateHexMap() {
    gameState.gameMap.clear();
    for (let q = -HEX_MAP_RADIUS; q <= HEX_MAP_RADIUS; q++) {
        for (let r = -HEX_MAP_RADIUS; r <= HEX_MAP_RADIUS; r++) {
            if (q + r >= -HEX_MAP_RADIUS && q + r <= HEX_MAP_RADIUS) {
                const randomBiome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
                const key = `${q},${r}`;
                gameState.gameMap.set(key, {
                    q: q, r: r,
                    biome: randomBiome,
                    hasEnemy: Math.random() < 0.2 
                });
            }
        }
    }
    gameState.expedition.playerPos = { q: 0, r: 0 };
}

function renderHexMap() {
    const mapElement = document.getElementById('game-map');
    mapElement.innerHTML = ''; 
    const { q: playerQ, r: playerR } = gameState.expedition.playerPos;

    const mapRect = mapElement.getBoundingClientRect();
    if (mapRect.width === 0) {
        console.error("Map Panel not visible. Cannot render hex map.");
        return;
    }
    
    const centerX = mapRect.width / 2;
    const centerY = mapRect.height / 2;

    gameState.gameMap.forEach(cell => {
        const { q, r, biome, hasEnemy } = cell;
        const pixel = axialToPixel(q, r);
        
        const cellDiv = document.createElement('div');
        cellDiv.className = 'hex-cell';
        
        let leftPos = centerX + pixel.x - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-size')) / 2);
        let topPos = centerY + pixel.y - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-height')) / 2);

        cellDiv.style.left = `${leftPos}px`;
        cellDiv.style.top = `${topPos}px`;
        cellDiv.style.backgroundColor = biome.color;
        cellDiv.dataset.q = q;
        cellDiv.dataset.r = r;
        cellDiv.onclick = () => handleHexMoveAttempt(q, r);

        if (q === playerQ && r === playerR) {
            cellDiv.classList.add('hex-kid');
            cellDiv.textContent = '🤖';
        } else if (hasEnemy) {
            cellDiv.textContent = '⚠️';
        }
        
        mapElement.appendChild(cellDiv);
    });
}


// ====================================================================
// SEÇÃO 7: LÓGICA DO JOGO (TELA 3)
// ====================================================================

function logMessage(message, color = 'var(--color-accent-blue)') {
    const logElement = document.getElementById('game-log');
    if (!logElement) return;
    const p = document.createElement('p');
    p.classList.add('log-entry');
    p.style.color = color;
    p.textContent = message;
    logElement.prepend(p);
    while (logElement.children.length > 20) {
        logElement.removeChild(logElement.lastChild);
    }
}

function toggleActionButtons(enable) {
    document.getElementById('collect-btn').disabled = !enable;
    document.getElementById('investigate-btn').disabled = !enable;
    document.getElementById('call-attention-btn').disabled = !enable;
    document.getElementById('end-turn-btn').disabled = !enable;
}

function startDemoGame() {
    logMessage("Starting DEMO MODE...", 'yellow');
    selectActiveKid(DEMO_KID); 
    startGameplay(); 
}

function startGameplay() {
    if (!gameState.player.activeKid) {
        alert("ERROR: No active kid selected!");
        showScreen('dashboard-screen');
        return;
    }
    
    showScreen('game-screen');
    
    calculateFinalStats(); 
    
    const stats = gameState.expedition.stats;
    gameState.expedition.currentAP = stats.ap;
    gameState.expedition.maxAP = stats.ap;
    gameState.expedition.currentMP = stats.speed; 
    gameState.expedition.maxMP = stats.speed;
    gameState.expedition.currentHP = stats.hp;
    gameState.expedition.resourcesFound = { scrap: 0, water: 0, food: 0 };

    initializeGame();
    
    setTimeout(renderHexMap, 0);
}

function initializeGame() {
    gameState.currentDay = 1;
    generateHexMap();
    updateGameStatusPanel();
    toggleActionButtons(true);
    
    logMessage(`Day ${gameState.currentDay} started! You have ${gameState.expedition.currentAP} AP and ${gameState.expedition.currentMP} MP.`, 'lime');
}

function updateGameStatusPanel() {
    const kid = gameState.player.activeKid;
    const stats = gameState.expedition.stats;

    // Seção 1: Kid Info
    document.getElementById('kid-tribe').textContent = kid.tribe.name;
    document.getElementById('kid-id').textContent = kid.id;
    document.getElementById('kid-image-container').innerHTML = `<img src="${kid.img}" alt="Your CyberKid">`;
    
    // Seção 2: Attributes
    const hpPercent = (gameState.expedition.currentHP / stats.hp) * 100;
    document.getElementById('hp-bar-fill').style.width = `${hpPercent}%`;
    document.getElementById('hp-bar-text').textContent = `${gameState.expedition.currentHP} / ${stats.hp}`;
    
    document.getElementById('kid-strength').textContent = stats.damage;
    document.getElementById('kid-defense').textContent = stats.defense;
    document.getElementById('kid-crit-chance').textContent = `${stats.critChance}%`;
    document.getElementById('kid-crit-dmg').textContent = `${stats.critDamage}%`;
    document.getElementById('kid-atk-speed').textContent = stats.attackSpeed;
    document.getElementById('kid-hp-regen').textContent = stats.hpRegen;
    document.getElementById('kid-block').textContent = `${stats.blockChance}%`;
    document.getElementById('kid-luck').textContent = `${stats.luck}%`;

    // Seção 3: Resources Found
    const resourceList = document.getElementById('resource-list');
    resourceList.innerHTML = ''; 
    let found = 0;
    for (const res in gameState.expedition.resourcesFound) {
        const amount = gameState.expedition.resourcesFound[res];
        if (amount > 0 && MATERIALS[res]) { 
            resourceList.innerHTML += `<li>${MATERIALS[res].name}: <span>${amount}</span></li>`;
            found++;
        }
    }
    if (found === 0) {
        resourceList.innerHTML = '<li>No resources found yet.</li>';
    }

    // Painel de Ações (AP/MP)
    document.getElementById('kid-ap').textContent = gameState.expedition.currentAP;
    document.getElementById('kid-max-ap').textContent = gameState.expedition.maxAP;
    document.getElementById('kid-mp').textContent = gameState.expedition.currentMP;
    document.getElementById('kid-max-mp').textContent = gameState.expedition.maxMP;
    
    document.getElementById('turn-counter').textContent = `${gameState.currentDay}`;

    // Lógica de habilitação de botões
    document.getElementById('collect-btn').disabled = (gameState.expedition.currentAP < 1 || gameState.isCombat);
    document.getElementById('investigate-btn').disabled = (gameState.expedition.currentAP < 1 || gameState.isCombat);
    document.getElementById('call-attention-btn').disabled = (gameState.expedition.currentAP < 2 || gameState.isCombat);
    
    const apSpent = gameState.expedition.currentAP < gameState.expedition.maxAP;
    const mpSpent = gameState.expedition.currentMP < gameState.expedition.maxMP;
    document.getElementById('end-turn-btn').disabled = !(apSpent || mpSpent) || gameState.isCombat;
}

function handleHexMoveAttempt(q, r) {
    if (gameState.expedition.currentMP <= 0 || gameState.isCombat) {
        logMessage("Out of Movement Points (MP) or in combat!", 'yellow');
        return;
    }
    const { q: playerQ, r: playerR } = gameState.expedition.playerPos;
    const distance = axialDistance(playerQ, playerR, q, r);

    if (distance === 1) { 
        gameState.expedition.playerPos = { q, r };
        gameState.expedition.currentMP--; 
        logMessage(`Moved to [${q},${r}]. MP remaining: ${gameState.expedition.currentMP}`);
        renderHexMap(); 
        updateGameStatusPanel();
    } else {
        logMessage("Invalid move! Can only move to adjacent hex.", 'yellow');
    }
}

function collectResource() {
    if (gameState.isCombat || gameState.expedition.currentAP < 1) return;
    gameState.expedition.currentAP--; 
    
    const { q, r } = gameState.expedition.playerPos;
    const cellKey = `${q},${r}`;
    if (!gameState.gameMap.has(cellKey)) return;

    const cell = gameState.gameMap.get(cellKey);
    const resourceName = cell.biome.resource.toLowerCase().replace(' ', '');
    
    let collectedAmount = 1 + Math.floor(Math.random() * 3); 
    let luckBonus = 1 + (gameState.expedition.stats.luck / 100);
    collectedAmount = Math.ceil(collectedAmount * luckBonus);
    
    if (gameState.expedition.resourcesFound.hasOwnProperty(resourceName)) {
        gameState.expedition.resourcesFound[resourceName] += collectedAmount;
    }

    logMessage(`Collected ${collectedAmount} ${resourceName}. AP remaining: ${gameState.expedition.currentAP}.`);
    updateGameStatusPanel(); 
}

function investigate() {
    if (gameState.isCombat || gameState.expedition.currentAP < 1) return;
    gameState.expedition.currentAP--;
    updateGameStatusPanel();

    const { q, r } = gameState.expedition.playerPos;
    const cellKey = `${q},${r}`;
    if (!gameState.gameMap.has(cellKey)) return;
    const cell = gameState.gameMap.get(cellKey);

    if (cell.hasEnemy || Math.random() < 0.2) { 
        logMessage("Investigation reveals an enemy! Combat initiated!", 'red');
        startCombat(ENEMY.MUTANT);
    } else if (Math.random() < 0.5) {
        const rareResource = (Math.random() < 0.5) ? 'water' : 'scrap';
        const amount = Math.floor(Math.random() * 5) + 1;
        gameState.expedition.resourcesFound[rareResource] += amount;
        logMessage(`Found a cache of ${amount} ${rareResource} hidden! AP remaining: ${gameState.expedition.currentAP}.`, 'lime');
    } else {
        logMessage(`Investigation complete. Found nothing. AP remaining: ${gameState.expedition.currentAP}.`, 'yellow');
    }
}

function callAttention() {
    if (gameState.isCombat || gameState.expedition.currentAP < 2) return;
    gameState.expedition.currentAP -= 2; 
    updateGameStatusPanel();
    logMessage("You called attention from the Wasteland! A fierce Drone is approaching!", 'red');
    startCombat(ENEMY.DRONE);
}

function startCombat(enemyType) {
    gameState.isCombat = true;
    toggleActionButtons(false); 
    logMessage(`VS ${enemyType.name}! HP: ${enemyType.hp}, STR: ${enemyType.strength}`, 'red');
    
    let playerDamage = gameState.expedition.stats.damage;
    let enemyDamage = enemyType.strength - gameState.expedition.stats.defense;
    if (enemyDamage < 1) enemyDamage = 1;

    let effectiveEnemyHP = enemyType.hp - playerDamage;

    if (effectiveEnemyHP <= 0) {
        gameState.isCombat = false;
        const reward = enemyType.reward;
        gameState.expedition.resourcesFound.scrap += reward;
        const { q, r } = gameState.expedition.playerPos;
        gameState.gameMap.get(`${q},${r}`).hasEnemy = false;
        logMessage(`Victory! Defeated ${enemyType.name} and gained ${reward} Scrap.`, 'lime');
        toggleActionButtons(true);
    } else {
        gameState.expedition.currentHP -= enemyDamage;
        logMessage(`Kid took ${enemyDamage} damage. ${gameState.expedition.currentHP} HP remaining.`, 'red');
        
        if (gameState.expedition.currentHP <= 0) {
            logMessage("Your CyberKid has been decommissioned. Expedition Failed!", 'red');
            gameOver(false);
            return;
        }
        
        gameState.isCombat = false;
        logMessage(`The ${enemyType.name} escaped, but you survived.`, 'yellow');
        toggleActionButtons(true);
    }
    renderHexMap();
    updateGameStatusPanel();
}

function endDay() {
    if (gameState.currentDay >= MAX_DAYS) {
        gameOver(true);
        return;
    }
    
    gameState.currentDay++;
    gameState.expedition.currentAP = gameState.expedition.stats.ap;
    gameState.expedition.currentMP = gameState.expedition.stats.speed;
    
    gameState.expedition.currentHP += gameState.expedition.stats.hpRegen;
    if (gameState.expedition.currentHP > gameState.expedition.stats.hp) {
        gameState.expedition.currentHP = gameState.expedition.stats.hp;
    }
    
    generateHexMap(); 
    renderHexMap();
    updateGameStatusPanel();
    logMessage(`--- DAY ${gameState.currentDay} START --- AP/MP restored. HP regenerated.`, 'yellow');
}

function gameOver(success) {
    for (const res in gameState.expedition.resourcesFound) {
        if (gameState.player.inventory.materials.hasOwnProperty(res)) {
            gameState.player.inventory.materials[res] += gameState.expedition.resourcesFound[res];
        }
    }
    
    if (success) {
        logMessage("Expedition Successful. Resources transferred to inventory.", 'lime');
    } else {
        logMessage("Expedition Failed. Returning to Hub.", 'red');
    }
    
    showScreen('dashboard-screen');
    renderInventory(); 
    calculateFinalStats(); 
}


// ====================================================================
// SEÇÃO 8: INICIALIZAÇÃO E LISTENERS DE EVENTOS
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configurar Listeners das Telas
    document.getElementById('connect-wallet-btn').addEventListener('click', () => {
        console.log("Connect Wallet button clicked");
        document.getElementById('connection-status').textContent = 'Connected (Simulated)';
        document.getElementById('connection-status').style.color = 'lime';
        showScreen('dashboard-screen');
        renderDashboard(); 
    });

    document.getElementById('demo-game-btn').addEventListener('click', startDemoGame);
    
    document.getElementById('start-expedition-btn').addEventListener('click', startGameplay);

    // 2. Configurar Listeners do Jogo (TELA 3)
    document.getElementById('collect-btn').addEventListener('click', collectResource);
    document.getElementById('investigate-btn').addEventListener('click', investigate);
    document.getElementById('call-attention-btn').addEventListener('click', callAttention); 
    document.getElementById('end-turn-btn').addEventListener('click', endDay); 
    document.getElementById('exit-expedition-btn').addEventListener('click', () => gameOver(true));

    // 3. Configurar Abas do Dashboard
    setupDashboardTabs();
    
    // 4. Atualizar Saldo de Tezerium (Simulado)
    document.getElementById('tezerium-balance').textContent = gameState.player.tezerium;

    // 5. Adicionar listener de Edição de Nome
    document.getElementById('edit-name-icon').addEventListener('click', () => {
        if (!gameState.player.activeKid) return;
        
        const newName = prompt("Enter a new name for your Kid:", gameState.player.activeKid.name);
        if (newName && newName.trim() !== "") {
            const kidInWallet = MOCK_WALLET.find(k => k.id === gameState.player.activeKid.id);
            if (kidInWallet) {
                kidInWallet.name = newName;
            }
            gameState.player.activeKid.name = newName;
            document.getElementById('dash-kid-name').textContent = newName;
            console.log(`Kid name updated to ${newName}`);
        }
    });

    // 6. NOVO: Listeners para o Modal de Equipamento
    document.getElementById('modal-equip-close').addEventListener('click', closeEquipmentModal);

    // Adiciona listeners aos 7 slots de equipamento e 7 botões de remover
    document.querySelectorAll('.equip-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const slotName = slot.dataset.slot;
            if (!gameState.player.equipped[slotName]) { // Só abre o modal se o slot estiver vazio
                openEquipmentModal(slotName);
            }
        });
    });

    document.querySelectorAll('.equip-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const slotName = btn.dataset.slot;
            unequipItem(slotName);
        });
    });

    // 7. Iniciar na Tela 1
    showScreen('logged-out-screen');
});
