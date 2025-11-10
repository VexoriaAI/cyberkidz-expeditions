// ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT LÓGICO
// VERSÃO FINAL COM 3 TELAS, DASHBOARD DE CRAFTING E MAPA HEXAGONAL
// ====================================================================

// ====================================================================
// SEÇÃO 1: DEFINIÇÕES DE DADOS E CONSTANTES
// ====================================================================

const MAX_DAYS = 10;
const HEX_MAP_RADIUS = 3; // O "tamanho" do mapa. Raio 3 = 37 células.

// --- 1.1: Atributos Base das Tribos ---
const TRIBES = {
    VOLCANICS: {
        name: "Volcanics",
        bonus: "Burning Ridge",
        baseStats: { damage: 4, critDamage: 5, defense: 3, blockChance: 3, critChance: 2, speed: 2, attackSpeed: 1, hpRegen: 1 }
    },
    UNDERGROUNDERS: {
        name: "Undergrounders",
        bonus: "Abandoned Mines",
        baseStats: { damage: 2, critDamage: 2, defense: 5, blockChance: 5, critChance: 1, speed: 2, attackSpeed: 2, hpRegen: 2 }
    },
    NOCTURNALS: {
        name: "Nocturnals",
        bonus: "Ancient Ruins",
        baseStats: { damage: 3, critDamage: 3, defense: 2, blockChance: 1, critChance: 5, speed: 4, attackSpeed: 4, hpRegen: 1 }
    },
    RADIOACTIVES: {
        name: "Radioactives",
        bonus: "Lake Rancid",
        baseStats: { damage: 2, critDamage: 2, defense: 1, blockChance: 1, critChance: 3, speed: 5, attackSpeed: 5, hpRegen: 1 }
    },
    REPTILIANS: {
        name: "Reptilians",
        bonus: "Covenant Swamp",
        baseStats: { damage: 3, critDamage: 2, defense: 3, blockChance: 2, critChance: 2, speed: 3, attackSpeed: 2, hpRegen: 5 }
    }
};

// --- 1.2: Biomas do Jogo ---
const BIOMES = [
    { name: "Burning Ridge", resource: "Scrap", affinity: "Volcanics", color: '#8B4513' },
    { name: "Covenant Swamp", resource: "Food", affinity: "Reptilians", color: '#3CB371' },
    { name: "Lake Rancid", resource: "Food", affinity: "Radioactives", color: '#20B2AA' },
    { name: "Ancient Ruins", resource: "Scrap", affinity: "Nocturnals", color: '#4F4F4F' },
    { name: "Abandoned Mines", resource: "Clean Water", affinity: "Undergrounders", color: '#696969' },
    { name: "Wasteland", resource: "Scrap", affinity: "None", color: '#555555' }
];

// --- 1.3: Inimigos ---
const ENEMY = {
    DRONE: { name: "CKC Drone", strength: 5, hp: 10, reward: 2 },
    MUTANT: { name: "Wasteland Mutant", strength: 8, hp: 15, reward: 5 }
};

// --- 1.4: Materiais, Componentes e Equipamentos (O Banco de Dados de Crafting) ---

const MATERIALS = {
    // Básicos
    scrap: { name: "Scrap", type: "Base" },
    water: { name: "Clean Water", type: "Base" },
    food: { name: "Food", type: "Base" },
    // Volcanics
    metal: { name: "Metal", type: "Volcanic" },
    magma: { name: "Magma", type: "Volcanic" },
    pumice: { name: "Volcanic Pumice Stone", type: "Volcanic" },
    obsidian: { name: "Obsidian Tears", type: "Volcanic" },
    // Undergrounders
    crystal: { name: "Energized Crystals", type: "Undergrounder" },
    pure_water: { name: "Pure Water", type: "Undergrounder" },
    clay: { name: "Special Clay", type: "Undergrounder" },
    glass: { name: "Glass", type: "Undergrounder" },
    // Nocturnals
    polymer: { name: "Polymer", type: "Nocturnal" },
    nanochips: { name: "Nanochips", type: "Nocturnal" },
    implants: { name: "Cybernetic Implants", type: "Nocturnal" },
    quantum_core: { name: "Quantum Energy Core", type: "Nocturnal" },
    // Reptilians
    healing_plants: { name: "Healing Plants", type: "Reptilian" },
    fungi: { name: "Hallucinogenic Fungi", type: "Reptilian" },
    reptile_blood: { name: "Reptilian Blood", type: "Reptilian" },
    animal_skin: { name: "Animal Skin", type: "Reptilian" },
    // Radioactives
    strange_fluid: { name: "Strange Fluid", type: "Radioactive" },
    parasitic_fungus: { name: "Parasitic Fungus", type: "Radioactive" },
    venom_glands: { name: "Venom Glands", type: "Radioactive" },
    luminescent_algae: { name: "Luminescent Algae", type: "Radioactive" }
};

const COMPONENTS = {
    volcanic_core: { name: "Volcanic Core", type: "Damage", stats: { damage: 5, critDamage: 5 } },
    defense_plate: { name: "Defense Plate", type: "Defense", stats: { defense: 5, blockChance: 3 } },
    precision_lens: { name: "Precision Lens", type: "Crit", stats: { critChance: 5 } },
    speed_injector: { name: "Speed Injector", type: "Speed", stats: { speed: 2, attackSpeed: 3 } },
    heal_totem: { name: "Heal Totem", type: "Heal", stats: { hpRegen: 3 } },
    lucky_clover: { name: "Lucky Clover", type: "Universal", stats: { dropChance: 5 } }
};

const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];

// Regras de Sinergia: Quais tipos de componentes cada slot aceita
const SYNERGY_MAP = {
    helmet: ['Defense', 'Crit', 'Universal'],
    weapon: ['Damage', 'Crit', 'Speed', 'Universal'],
    accessory: ['Damage', 'Crit', 'Speed', 'Heal', 'Defense', 'Universal'], // Aceita tudo
    armor: ['Defense', 'Heal', 'Universal'],
    gloves: ['Damage', 'Speed', 'Crit', 'Universal'],
    implant: ['Damage', 'Crit', 'Speed', 'Heal', 'Defense', 'Universal'], // Aceita tudo
    boots: ['Defense', 'Speed', 'Universal']
};

const RECIPES_CRAFT_EMPTY = {
    empty_helmet: { name: "Rustic Helmet (Empty)", cost: { scrap: 8 } },
    empty_weapon: { name: "Rustic Blade (Empty)", cost: { scrap: 10 } },
    empty_armor: { name: "Rustic Chestplate (Empty)", cost: { scrap: 15 } },
    // ...etc para todos os 7 slots
};

const RECIPES_REFINE = {
    volcanic_core: { name: "Volcanic Core", cost: { metal: 10, magma: 5, pumice: 2 } },
    defense_plate: { name: "Defense Plate", cost: { crystal: 10, clay: 5, glass: 2 } },
    // ...etc para todos os 5 componentes tribais
    lucky_clover: { name: "Lucky Clover", cost: { scrap: 20, water: 20, food: 20 } }
};


// ====================================================================
// SEÇÃO 2: ESTADO GLOBAL DO JOGO (MASTER STATE)
// ====================================================================

let gameState = {
    currentDay: 0,
    isCombat: false,
    
    // Perfil do Jogador (Salvo no DB)
    player: {
        activeKid: null, // Objeto do Kid selecionado
        inventory: {
            materials: { scrap: 100, water: 100, food: 100, metal: 5, magma: 2, pumice: 1, crystal: 5, clay: 2, glass: 1, polymer: 0, nanochips: 0, implants: 0, quantum_core: 0, healing_plants: 0, fungi: 0, reptile_blood: 0, animal_skin: 0, strange_fluid: 0, parasitic_fungus: 0, venom_glands: 0, luminescent_algae: 0 },
            components: { volcanic_core: 0, defense_plate: 0, precision_lens: 0, speed_injector: 0, heal_totem: 0, lucky_clover: 0 },
            equipment: [] // Array de todos os equipamentos (Ex: { id: 'item_1', name: 'Crystal Chest (Lvl 1)', ... })
        },
        equipped: { // IDs dos itens equipados no Kid ativo
            helmet: null,
            weapon: null,
            accessory: null,
            armor: null,
            gloves: null,
            implant: null,
            boots: null
        }
    },
    
    // Status da Expedição (Resetado a cada expedição)
    expedition: {
        playerPos: { q: 0, r: 0 }, // Posição no mapa Hex
        stats: {}, // Stats Finais (Base + Equipamento)
        currentAP: 0,
        maxAP: 0,
        currentMP: 0,
        maxMP: 0,
        resourcesFound: { scrap: 0, water: 0, food: 0 } // Coletados nesta viagem
    },

    gameMap: new Map() // Usar um Map para coordenadas hex { 'q,r': { biome, ... } }
};


// ====================================================================
// SEÇÃO 3: REFERÊNCIAS DO DOM
// ====================================================================

// Telas
const loggedOutScreen = document.getElementById('logged-out-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const gameScreen = document.getElementById('game-screen');

// Header
const connectionStatus = document.getElementById('connection-status');

// Tela 1: Login
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const demoGameBtn = document.getElementById('demo-game-btn');

// Tela 2: Dashboard
const nftListContainer = document.getElementById('nft-list-container');
const startExpeditionBtn = document.getElementById('start-expedition-btn');
const dashKidName = document.getElementById('dash-kid-name');
const equipmentGrid = document.querySelector('.equipment-grid');
// ... (refs para todos os 7 slots e 8 stats)
const inventoryListMaterials = document.getElementById('inventory-list-materials');
const tabInventory = document.getElementById('tab-inventory');
const tabRefine = document.getElementById('tab-refine');
const tabCraft = document.getElementById('tab-craft');
const craftingPanel = document.getElementById('crafting-panel');


// Tela 3: Jogo
const mapElement = document.getElementById('game-map');
const logElement = document.getElementById('game-log');
const turnCounterElement = document.getElementById('turn-counter');
const kidTribeElement = document.getElementById('kid-tribe');
const kidStrengthElement = document.getElementById('kid-strength');
const kidHpElement = document.getElementById('kid-hp');
const kidDefenseElement = document.getElementById('kid-defense');
const kidDropChanceElement = document.getElementById('kid-drop-chance');
const kidApElement = document.getElementById('kid-ap');
const kidMpElement = document.getElementById('kid-mp');
const resScrapElement = document.getElementById('res-scrap');
const resWaterElement = document.getElementById('res-water');
const resFoodElement = document.getElementById('res-food');
const kidImageContainer = document.getElementById('kid-image-container');
const collectBtn = document.getElementById('collect-btn');
const investigateBtn = document.getElementById('investigate-btn');
const callAttentionBtn = document.getElementById('call-attention-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const exitExpeditionBtn = document.getElementById('exit-expedition-btn');


// ====================================================================
// SEÇÃO 4: GERENCIAMENTO DE TELA
// ====================================================================

function showScreen(screenId) {
    loggedOutScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'block';
    } else {
        console.error(`Screen ID "${screenId}" not found.`);
    }
}


// ====================================================================
// SEÇÃO 5: LÓGICA DO DASHBOARD (HUB)
// ====================================================================

// --- 5.1: Gerenciamento de Abas (Tabs) ---
function setupDashboardTabs() {
    craftingPanel.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-btn')) return;

        const tabName = e.target.dataset.tab;
        
        // Remove 'active' de todos
        craftingPanel.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        craftingPanel.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Adiciona 'active' ao clicado
        e.target.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
}

// --- 5.2: Renderização do Dashboard ---
function renderDashboard() {
    // 1. Renderizar lista de NFTs (simulado)
    // (Em um jogo real, isso viria da wallet)
    nftListContainer.innerHTML = '<h4>Your Kidz (Simulated)</h4>';
    const mockNfts = [
        { id: 'CKC-001', name: 'Demo Nocturnal', tribe: TRIBES.NOCTURNALS, img: `https://via.placeholder.com/150/purple/FFFFFF?text=DEMO-KID` },
        { id: 'CKC-002', name: 'Demo Volcanic', tribe: TRIBES.VOLCANICS, img: `https://via.placeholder.com/150/red/FFFFFF?text=VOLC-KID` }
    ];
    
    mockNfts.forEach(nft => {
        const nftDiv = document.createElement('div');
        nftDiv.className = 'nft-list-item'; // (Estilo a ser adicionado no CSS)
        nftDiv.innerHTML = `<img src="${nft.img}" width="50"><p>${nft.name}</p>`;
        nftDiv.onclick = () => selectActiveKid(nft);
        nftListContainer.appendChild(nftDiv);
    });

    // 2. Renderizar Inventário
    renderInventory();
    
    // 3. Renderizar Receitas
    renderCraftingRecipes();
}

function selectActiveKid(nft) {
    gameState.player.activeKid = nft;
    dashKidName.textContent = nft.name;
    startExpeditionBtn.disabled = false;
    logMessage(`Kid ${nft.name} selected. Ready for expedition.`, 'lime');
    
    // Renderizar equipamento e stats
    renderEquippedItems();
    calculateFinalStats();
}

function renderEquippedItems() {
    // Limpa todos os slots
    equipmentGrid.querySelectorAll('.equip-slot').forEach(slot => {
        slot.innerHTML = `<span>${slot.id.replace('equip-slot-', '')}</span>`;
    });
    
    // Preenche com itens equipados
    for (const slotName of EQUIPMENT_SLOTS) {
        const itemId = gameState.player.equipped[slotName];
        if (itemId) {
            const item = gameState.player.inventory.equipment.find(e => e.id === itemId);
            if (item) {
                document.getElementById(`equip-slot-${slotName}`).innerHTML = `<img src="${item.img}" alt="${item.name}"><p>${item.name}</p>`;
            }
        }
    }
}

function renderInventory() {
    // Atualiza a lista de materiais
    for (const materialId in gameState.player.inventory.materials) {
        const span = document.getElementById(`inv-${materialId}`);
        if (span) {
            span.textContent = gameState.player.inventory.materials[materialId];
        }
    }
    // (Fazer o mesmo para componentes e equipamentos)
}

function renderCraftingRecipes() {
    // Limpa receitas
    tabRefine.innerHTML = '<h4>Refine Components</h4>';
    tabCraft.innerHTML = '<h4>Craft & Embed</h4>';

    // Adiciona Receitas de Refino
    for (const compId in RECIPES_REFINE) {
        const recipe = RECIPES_REFINE[compId];
        let costText = Object.entries(recipe.cost).map(([matId, amt]) => `${amt} ${MATERIALS[matId].name}`).join(' + ');
        tabRefine.innerHTML += `
            <div class="crafting-recipe">
                <span>${costText} = <strong>1 ${recipe.name}</strong></span>
                <button class="action-btn small-btn" onclick="refineComponent('${compId}')">Refine</button>
            </div>`;
    }

    // Adiciona Receitas de Craft (Vazio)
    for (const itemId in RECIPES_CRAFT_EMPTY) {
        const recipe = RECIPES_CRAFT_EMPTY[itemId];
        let costText = Object.entries(recipe.cost).map(([matId, amt]) => `${amt} ${MATERIALS[matId].name}`).join(' + ');
        tabCraft.innerHTML += `
            <div class="crafting-recipe">
                <span>${costText} = <strong>1 ${recipe.name}</strong></span>
                <button class="action-btn small-btn" onclick="craftEmptyItem('${itemId}')">Craft</button>
            </div>`;
    }
    
    // (A lógica de "Embed" seria mais complexa, com menus dropdown, e fica para um próximo passo)
}


// --- 5.3: Lógica de Crafting (Simulada) ---
// (Estas funções seriam chamadas pelos botões gerados em renderCraftingRecipes)
function craftEmptyItem(itemId) {
    // Lógica para verificar recursos, subtrair e adicionar item vazio ao inventário
    logMessage(`(Simulado) Crafting: ${RECIPES_CRAFT_EMPTY[itemId].name}`, 'yellow');
    // ... (implementar verificação de 'scrap')
}

function refineComponent(compId) {
    // Lógica para verificar materiais raros, subtrair e adicionar componente ao inventário
    logMessage(`(Simulado) Refining: ${RECIPES_REFINE[compId].name}`, 'yellow');
    // ... (implementar verificação de materiais)
}

function calculateFinalStats() {
    // Começa com os stats base da tribo do Kid ativo
    let baseStats = gameState.player.activeKid.tribe.baseStats;
    let finalStats = { ...baseStats }; // Copia os stats base

    // Adiciona o novo atributo
    finalStats.dropChance = 0;

    // Itera sobre os 7 slots de equipamento
    for (const slot of EQUIPMENT_SLOTS) {
        const itemId = gameState.player.equipped[slot];
        if (!itemId) continue;

        const item = gameState.player.inventory.equipment.find(e => e.id === itemId);
        if (!item) continue;

        // Adiciona os stats do item aos stats finais
        for (const stat in item.stats) {
            if (finalStats.hasOwnProperty(stat)) {
                finalStats[stat] += item.stats[stat];
            }
        }
    }

    // Salva os stats calculados no estado da expedição
    gameState.expedition.stats = finalStats;

    // Atualiza o display do Dashboard
    // (Adicionar todos os 8 spans de stats no HTML do dashboard)
    document.getElementById('dash-stat-dmg').textContent = finalStats.damage;
    document.getElementById('dash-stat-def').textContent = finalStats.defense;
    document.getElementById('dash-stat-crit').textContent = `${finalStats.critChance}%`;
    document.getElementById('dash-stat-drop').textContent = `${finalStats.dropChance}%`;
}


// ====================================================================
// SEÇÃO 6: LÓGICA DO MAPA HEXAGONAL
// ====================================================================

// --- 6.1: Funções de Coordenadas Hex (Axial) ---
// (Não mexer, matemática de grid hex)
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

// --- 6.2: Geração e Renderização do Mapa ---
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
                    hasEnemy: Math.random() < 0.2 // 20% de chance de inimigo
                });
            }
        }
    }
    // Define a posição inicial do jogador
    gameState.expedition.playerPos = { q: 0, r: 0 };
}

function renderHexMap() {
    mapElement.innerHTML = ''; // Limpa o mapa
    const { q: playerQ, r: playerR } = gameState.expedition.playerPos;

    // Encontra o centro do contêiner para centralizar o hex (0,0)
    const mapRect = mapElement.getBoundingClientRect();
    const centerX = mapRect.width / 2;
    const centerY = mapRect.height / 2;

    gameState.gameMap.forEach(cell => {
        const { q, r, biome, hasEnemy } = cell;
        
        const pixel = axialToPixel(q, r);
        
        const cellDiv = document.createElement('div');
        cellDiv.className = 'hex-cell';
        cellDiv.style.left = `${centerX + pixel.x - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-size')) / 2)}px`;
        cellDiv.style.top = `${centerY + pixel.y - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-height')) / 2)}px`;
        
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

// --- 7.1: Início e Atualização do Jogo ---
function startGameplay() {
    // 1. Calcular stats finais
    calculateFinalStats(); 
    
    // 2. Definir stats da expedição
    const stats = gameState.expedition.stats;
    gameState.expedition.currentAP = stats.AP; // (Atributo AP precisa ser adicionado)
    gameState.expedition.maxAP = stats.AP;
    gameState.expedition.currentMP = stats.speed; // STAT DE VELOCIDADE = PONTOS DE MOVIMENTO
    gameState.expedition.maxMP = stats.speed;
    gameState.expedition.resourcesFound = { scrap: 0, water: 0, food: 0 };

    // 3. Configurar UI
    gameState.currentDay = 1;
    generateHexMap();
    renderHexMap();
    updateStatusPanel();
    toggleActionButtons(true);
    
    logMessage(`Day 1 started! You have ${gameState.expedition.currentAP} AP and ${gameState.expedition.currentMP} MP.`, 'lime');
    showScreen('game-screen');
}

function updateStatusPanel() {
    const kid = gameState.player.activeKid;
    const stats = gameState.expedition.stats;

    kidTribeElement.textContent = kid.tribe.name;
    kidImageContainer.innerHTML = `<img src="${kid.img}" alt="Your CyberKid">`;
    
    // Atualiza com stats calculados
    kidStrengthElement.textContent = stats.damage;
    kidHpElement.textContent = `${stats.hp}/${stats.hp}`; // (Lógica de HP atual precisa ser adicionada)
    kidDefenseElement.textContent = stats.defense;
    kidDropChanceElement.textContent = `${stats.dropChance}%`;

    // Atualiza AP/MP
    kidApElement.textContent = gameState.expedition.currentAP;
    kidMpElement.textContent = gameState.expedition.currentMP;
    
    // Atualiza recursos da viagem
    resScrapElement.textContent = gameState.expedition.resourcesFound.scrap;
    resWaterElement.textContent = gameState.expedition.resourcesFound.water;
    resFoodElement.textContent = gameState.expedition.resourcesFound.food;
    
    turnCounterElement.textContent = `${gameState.currentDay}`;

    // Lógica de habilitação de botões
    collectBtn.disabled = (gameState.expedition.currentAP < 1 || gameState.isCombat);
    investigateBtn.disabled = (gameState.expedition.currentAP < 1 || gameState.isCombat);
    callAttentionBtn.disabled = (gameState.expedition.currentAP < 2 || gameState.isCombat);
    
    const apSpent = gameState.expedition.currentAP < gameState.expedition.maxAP;
    const mpSpent = gameState.expedition.currentMP < gameState.expedition.maxMP;
    endTurnBtn.disabled = !(apSpent || mpSpent) || gameState.isCombat;
}

// --- 7.2: Ações do Jogo ---
function handleHexMoveAttempt(q, r) {
    if (gameState.expedition.currentMP <= 0 || gameState.isCombat) {
        logMessage("Out of Movement Points (MP) or in combat!", 'yellow');
        return;
    }

    const { q: playerQ, r: playerR } = gameState.expedition.playerPos;
    const distance = axialDistance(playerQ, playerR, q, r);

    if (distance === 1) { // Movimento adjacente
        gameState.expedition.playerPos = { q, r };
        gameState.expedition.currentMP--; 
        logMessage(`Moved to [${q},${r}]. MP remaining: ${gameState.expedition.currentMP}`);
        renderHexMap(); // Re-renderiza para mover o '🤖'
        updateStatusPanel();
    } else {
        logMessage("Invalid move! Can only move to adjacent hex.", 'yellow');
    }
}

function collectResource() {
    if (gameState.isCombat || gameState.expedition.currentAP < 1) return;
    gameState.expedition.currentAP--; 
    
    const { q, r } = gameState.expedition.playerPos;
    const cell = gameState.gameMap.get(`${q},${r}`);
    const resourceName = cell.biome.resource.toLowerCase().replace(' ', '');
    
    let collectedAmount = 1 + Math.floor(Math.random() * 3); 

    // Adiciona bônus de Drop Chance
    let dropBonus = 1 + (gameState.expedition.stats.dropChance / 100);
    collectedAmount = Math.ceil(collectedAmount * dropBonus);
    
    // Adiciona à contagem da expedição
    if (gameState.expedition.resourcesFound.hasOwnProperty(resourceName)) {
        gameState.expedition.resourcesFound[resourceName] += collectedAmount;
    }

    logMessage(`Collected ${collectedAmount} ${resourceName}. AP remaining: ${gameState.expedition.currentAP}.`);
    updateStatusPanel(); 
}

function investigate() {
    // (Lógica similar, consome AP, chance de combate ou achar materiais raros)
    logMessage("Investigate (Not Implemented)", 'yellow');
}

function callAttention() {
    // (Lógica similar, consome 2 AP, força combate)
    logMessage("Call Attention (Not Implemented)", 'yellow');
}

function startCombat(enemyType) {
    // (Esta função precisará ser reescrita para usar todos os 8 stats)
    logMessage(`Combat with ${enemyType.name}! (Not Implemented)`, 'red');
}

function endDay() {
    if (gameState.currentDay >= MAX_DAYS) {
        gameOver(true);
        return;
    }
    
    gameState.currentDay++;

    // Reseta AP e MP (baseado nos stats calculados)
    gameState.expedition.currentAP = gameState.expedition.stats.AP;
    gameState.expedition.currentMP = gameState.expedition.stats.speed;
    
    // Lógica de Ganhos IDLE (FUTURO)
    // ...
    
    generateHexMap(); // Novo mapa para o novo dia
    renderHexMap();
    updateStatusPanel();
    logMessage(`--- DAY ${gameState.currentDay} START --- AP and MP fully restored.`, 'yellow');
}

function gameOver(success) {
    // 1. Adicionar recursos da expedição ao inventário principal
    for (const res in gameState.expedition.resourcesFound) {
        gameState.player.inventory.materials[res] += gameState.expedition.resourcesFound[res];
    }
    
    // 2. Logar e voltar ao Dashboard
    if (success) {
        logMessage("Expedition Successful. Resources transferred to inventory.", 'lime');
    } else {
        logMessage("Expedition Failed. Returning to Hub.", 'red');
    }
    
    showScreen('dashboard-screen');
    renderInventory(); // Atualiza o inventário no Dashboard
}


// ====================================================================
// SEÇÃO 8: INICIALIZAÇÃO E LISTENERS DE EVENTOS
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configurar Listeners das Telas
    connectWalletBtn.addEventListener('click', () => {
        logMessage("Connecting to wallet... (Simulated)", 'lime');
        connectionStatus.textContent = 'Connected (Simulated)';
        connectionStatus.style.color = 'lime';
        showScreen('dashboard-screen');
        renderDashboard(); // Renderiza o Dashboard
    });

    demoGameBtn.addEventListener('click', () => {
        // Seleciona o Kid Demo e inicia o jogo
        selectActiveKid(DEMO_KID); // Usa o DEMO_KID definido no Topo
        startGameplay();
    });
    
    startExpeditionBtn.addEventListener('click', startGameplay);

    // 2. Configurar Listeners do Jogo
    collectBtn.addEventListener('click', collectResource);
    investigateBtn.addEventListener('click', investigate);
    callAttentionBtn.addEventListener('click', callAttention); 
    endTurnBtn.addEventListener('click', endDay); 
    exitExpeditionBtn.addEventListener('click', () => gameOver(true)); // Saída manual

    // 3. Configurar Abas do Dashboard
    setupDashboardTabs();

    // 4. Iniciar na Tela 1
    showScreen('logged-out-screen');
});
