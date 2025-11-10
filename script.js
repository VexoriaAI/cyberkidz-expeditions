// ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT LÓGICO
// Versão com AP/MP e Modal de Seleção de NFT
// ====================================================================

// --- CONFIGURAÇÕES E DADOS DO JOGO ---
const GRID_SIZE = 6;
const MAX_DAYS = 10; // 10 Dias de Expedição
const TRIBES = {
    VOLCANICS: {
        name: "Volcanics",
        bonus: "Burning Ridge",
        stats: { strength: 14, hp: 110, luck: 0.2, AP: 3, MP: 12 }, 
        color: 'red'
    },
    UNDERGROUNDERS: {
        name: "Undergrounders",
        bonus: "Abandoned Mines",
        stats: { strength: 9, hp: 120, luck: 0.1, AP: 4, MP: 15 }, 
        color: 'brown'
    },
    REPTILIANS: {
        name: "Reptilians",
        bonus: "Covenant Swamp",
        stats: { strength: 16, hp: 90, luck: 0.3, AP: 3, MP: 13 }, 
        color: 'green'
    },
    RADIOACTIVES: {
        name: "Radioactives",
        bonus: "Lake Rancid",
        stats: { strength: 8, hp: 80, luck: 0.4, AP: 5, MP: 20 }, 
        color: 'lime'
    },
    NOCTURNALS: {
        name: "Nocturnals",
        bonus: "Ancient Ruins",
        stats: { strength: 10, hp: 100, luck: 0.25, AP: 4, MP: 15 }, 
        color: 'purple'
    }
};

const BIOMES = [
    { name: "Burning Ridge", resource: "Scrap", rarity: 0.1, color: '#8B4513' },
    { name: "Covenant Swamp", resource: "Food", rarity: 0.15, color: '#3CB371' },
    { name: "Lake Rancid", resource: "Food", rarity: 0.2, color: '#20B2AA' },
    { name: "Ancient Ruins", resource: "Scrap", rarity: 0.05, color: '#4F4F4F' },
    { name: "Abandoned Mines", resource: "Clean Water", rarity: 0.1, color: '#696969' },
    { name: "Wasteland", resource: "Scrap", rarity: 0.3, color: '#555555' }
];

const ENEMY = {
    DRONE: { name: "CKC Drone", strength: 5, hp: 10, reward: 2 },
    MUTANT: { name: "Wasteland Mutant", strength: 8, hp: 15, reward: 5 }
};

// --- MOCK NFTS (SIMULAÇÃO DE DADOS DA CARTEIRA TEZOS) ---
const MOCK_NFTS = [];
const tribeKeysArray = Object.values(TRIBES);
for(let i = 1; i <= 20; i++) {
    const baseTribe = tribeKeysArray[i % tribeKeysArray.length];
    MOCK_NFTS.push({ 
        id: `CKC-${String(i).padStart(3, '0')}`, 
        name: `${baseTribe.name} #${i}`, 
        tribe: baseTribe,
        img: `https://via.placeholder.com/150/${baseTribe.color.substring(1).toUpperCase()}/FFFFFF?text=NFT-${i}`
    });
}


// --- ESTADO INICIAL DO JOGO ---
let gameState = {
    currentDay: 0,
    isCombat: false,
    player: {
        tribe: null,
        x: 0,
        y: 0,
        stats: { strength: 0, hp: 0, maxHp: 0, luck: 0, upgrades: 0, AP: 0, maxAP: 0, MP: 0, maxMP: 0 },
        resources: { scrap: 0, water: 0, food: 0 },
        imageURL: "https://via.placeholder.com/150/000000/FFFFFF?text=SELECT+NFT" 
    },
    idleNfts: [], // NFTs selecionados para expedição passiva
    gameMap: []
};

// ESTADO DE SELEÇÃO DE NFT (ANTES DO JOGO INICIAR)
let selectionState = {
    allNfts: MOCK_NFTS, 
    activeNft: null,
    idleNfts: []
};


// --- ELEMENTOS DOM (Referências do HTML) ---
const mapElement = document.getElementById('game-map');
const logElement = document.getElementById('game-log');
const turnCounterElement = document.getElementById('turn-counter');

// Painel de Status
const kidTribeElement = document.getElementById('kid-tribe');
const kidStrengthElement = document.getElementById('kid-strength');
const kidHpElement = document.getElementById('kid-hp');
const kidApElement = document.getElementById('kid-ap');
const kidMpElement = document.getElementById('kid-mp');
const resScrapElement = document.getElementById('res-scrap');
const resWaterElement = document.getElementById('res-water');
const resFoodElement = document.getElementById('res-food');
const kidImageContainer = document.getElementById('kid-image-container');

// Botões de Ação
const collectBtn = document.getElementById('collect-btn');
const investigateBtn = document.getElementById('investigate-btn');
const callAttentionBtn = document.getElementById('call-attention-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const upgradeBtn = document.getElementById('upgrade-btn');

// Modal
const nftSelectionModal = document.getElementById('nft-selection-modal');
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const startExpeditionBtn = document.getElementById('start-expedition-btn');
const simulatedWalletNftsContainer = document.getElementById('simulated-wallet-nfts');
const activeNftSlot = document.getElementById('active-nft-slot');
const idleNftSlotsContainer = document.getElementById('idle-nft-slots-container');
const selectionStatus = document.getElementById('selection-status');


// ====================================================================
// FUNÇÕES UTILITÁRIAS E DE UI
// ====================================================================

function logMessage(message, color = 'var(--color-accent-blue)') {
    const p = document.createElement('p');
    p.classList.add('log-entry');
    p.style.color = color;
    p.textContent = message;
    logElement.prepend(p);
    
    while (logElement.children.length > 20) {
        logElement.removeChild(logElement.lastChild);
    }
}

function getCell(x, y) {
    const index = y * GRID_SIZE + x;
    return gameState.gameMap[index];
}

function toggleActionButtons(enable) {
    collectBtn.disabled = !enable;
    investigateBtn.disabled = !enable;
    callAttentionBtn.disabled = !enable;
    endTurnBtn.disabled = !enable;
}

// ====================================================================
// LÓGICA DO MODAL DE SELEÇÃO DE NFT
// ====================================================================

function renderNftList() {
    simulatedWalletNftsContainer.innerHTML = '<h4>WALLET NFTS FOUND (Click to Assign)</h4>';
    selectionState.allNfts.forEach(nft => {
        const item = document.createElement('div');
        item.classList.add('simulated-nft-item');
        item.dataset.nftId = nft.id;
        item.dataset.tribe = nft.tribe.name;
        item.innerHTML = `<img src="${nft.img}" style="width: 50px; height: 50px;"><br>#${nft.id.slice(-3)} (${nft.tribe.name.charAt(0)})`;
        item.addEventListener('click', () => handleNftSelection(nft));
        simulatedWalletNftsContainer.appendChild(item);
    });
    
    // Gera 9 slots Idle
    idleNftSlotsContainer.innerHTML = '<h4>IDLE KIDZ (Max 9)</h4>';
    for (let i = 0; i < 9; i++) {
        const slot = document.createElement('div');
        slot.classList.add('nft-slot', 'idle-slot');
        slot.innerHTML = `Slot ${i + 1} (Empty)`;
        idleNftSlotsContainer.appendChild(slot);
    }
    updateNftSelectionUI();
}

function handleNftSelection(nft) {
    const isCurrentlyActive = selectionState.activeNft && selectionState.activeNft.id === nft.id;
    const isCurrentlyIdle = selectionState.idleNfts.some(n => n.id === nft.id);

    if (isCurrentlyActive) {
        // Deselecionar Ativo
        selectionState.activeNft = null;
    } else if (isCurrentlyIdle) {
        // Deselecionar Idle
        selectionState.idleNfts = selectionState.idleNfts.filter(n => n.id !== nft.id);
    } else if (!selectionState.activeNft) {
        // Selecionar como Ativo
        selectionState.activeNft = nft;
    } else if (selectionState.idleNfts.length < 9) {
        // Selecionar como Idle
        selectionState.idleNfts.push(nft);
    } else {
        selectionStatus.textContent = "Error: Max 9 Idle NFTs selected.";
        return;
    }

    updateNftSelectionUI();
}

function updateNftSelectionUI() {
    // 1. Limpa classes de seleção e status
    document.querySelectorAll('.simulated-nft-item').forEach(item => {
        item.classList.remove('selected-active', 'selected-idle');
        item.style.backgroundColor = 'transparent';
    });
    
    // 2. Atualiza slot Ativo
    activeNftSlot.innerHTML = selectionState.activeNft 
        ? `<img src="${selectionState.activeNft.img}" style="width: 100%; height: auto;"><br>Active: ${selectionState.activeNft.tribe.name}`
        : '<h4>ACTIVE KID (Main Game)</h4><p>Click to select.</p>';
    
    // 3. Atualiza slots Idle
    const idleSlots = idleNftSlotsContainer.querySelectorAll('.idle-slot');
    idleSlots.forEach((slot, index) => {
        const idleNft = selectionState.idleNfts[index];
        slot.innerHTML = idleNft 
            ? `<img src="${idleNft.img}" style="width: 100%; height: auto;"><br>Idle: #${idleNft.id.slice(-3)}`
            : `Slot ${index + 1} (Empty)`;
    });

    // 4. Marca NFTs na lista da Wallet
    document.querySelectorAll('.simulated-nft-item').forEach(item => {
        const id = item.dataset.nftId;
        if (selectionState.activeNft && selectionState.activeNft.id === id) {
            item.classList.add('selected-active');
            item.style.backgroundColor = 'var(--color-bg-dark)';
        } else if (selectionState.idleNfts.some(n => n.id === id)) {
            item.classList.add('selected-idle');
            item.style.backgroundColor = 'var(--color-bg-dark)';
        }
    });

    // 5. Habilita/Desabilita botão START
    const ready = selectionState.activeNft !== null;
    startExpeditionBtn.disabled = !ready;
    selectionStatus.textContent = ready 
        ? `Ready to go! ${selectionState.idleNfts.length} Kidz idle.`
        : "Please select ONE Active Kid to start the expedition.";
}

function openNftSelection() {
    nftSelectionModal.style.display = 'block';
    renderNftList();
    document.getElementById('connection-status').textContent = 'Connecting... (Simulated)';
}

function closeNftSelectionAndStart() {
    if (!selectionState.activeNft) return;

    nftSelectionModal.style.display = 'none';
    
    // Configura o jogo com o NFT ativo escolhido
    const activeTribe = selectionState.activeNft.tribe;
    const placeholderURL = selectionState.activeNft.img;
    
    gameState.player.tribe = activeTribe;
    gameState.player.stats.strength = activeTribe.stats.strength;
    gameState.player.stats.hp = activeTribe.stats.hp;
    gameState.player.stats.maxHp = activeTribe.stats.hp;
    gameState.player.stats.luck = activeTribe.stats.luck;
    
    gameState.player.stats.AP = activeTribe.stats.AP;
    gameState.player.stats.maxAP = activeTribe.stats.AP;
    gameState.player.stats.MP = activeTribe.stats.MP;
    gameState.player.stats.maxMP = activeTribe.stats.MP;
    gameState.player.imageURL = placeholderURL; 

    // Define os NFTs Idle
    gameState.idleNfts = selectionState.idleNfts;

    initializeGame();
    
    logMessage(`Active Kid: ${selectionState.activeNft.name} (${selectionState.activeNft.tribe.name}) is ready!`, 'lime');
    logMessage(`${gameState.idleNfts.length} Kidz assigned to Idle Expedition.`, 'yellow');

    // Mudar status da Wallet
    document.getElementById('connection-status').textContent = 'Connected (NFT Loaded)';
    document.getElementById('connection-status').style.color = 'lime';
}


// ====================================================================
// FUNÇÕES DE MAPA E RENDERIZAÇÃO
// ====================================================================

function initializeGame() {
    // A tribo e stats já estão definidos via closeNftSelectionAndStart()
    gameState.currentDay = 1;
    generateMap();
    renderMap();
    updateStatusPanel();
    toggleActionButtons(true);
    
    logMessage(`Day ${gameState.currentDay} started! You have ${gameState.player.stats.AP} AP and ${gameState.player.stats.MP} MP.`, 'lime');
}

function generateMap() {
    gameState.gameMap = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const randomBiome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
            
            gameState.gameMap.push({
                biome: randomBiome,
                hasKid: false,
                hasEnemy: Math.random() < randomBiome.rarity,
                coordinates: { x: x, y: y }
            });
        }
    }
}

function renderMap() {
    mapElement.innerHTML = '';
    const playerX = gameState.player.x;
    const playerY = gameState.player.y;
    
    gameState.gameMap.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('map-cell');
        
        cellDiv.style.backgroundColor = cell.biome.color;
        cellDiv.dataset.x = cell.coordinates.x;
        cellDiv.dataset.y = cell.coordinates.y;
        cellDiv.addEventListener('click', handleMoveAttempt);

        if (cell.coordinates.x === playerX && cell.coordinates.y === playerY) {
            cellDiv.classList.add('kid');
            cellDiv.textContent = '🤖';
        } else if (cell.hasEnemy) {
            cellDiv.textContent = '⚠️';
        } else {
            cellDiv.textContent = cell.biome.name.charAt(0);
        }
        
        mapElement.appendChild(cellDiv);
    });
}

function updateStatusPanel() {
    kidTribeElement.textContent = gameState.player.tribe.name;
    kidStrengthElement.textContent = gameState.player.stats.strength;
    kidHpElement.textContent = `${gameState.player.stats.hp}/${gameState.player.stats.maxHp}`;
    
    kidApElement.textContent = gameState.player.stats.AP;
    kidMpElement.textContent = gameState.player.stats.MP;
    
    kidImageContainer.innerHTML = `<img src="${gameState.player.imageURL}" alt="Your CyberKid">`;

    resScrapElement.textContent = gameState.player.resources.scrap;
    resWaterElement.textContent = gameState.player.resources.water;
    resFoodElement.textContent = gameState.player.resources.food;
    
    turnCounterElement.textContent = `${gameState.currentDay}`;

    // Habilita/Desabilita botões de ação com base no AP
    collectBtn.disabled = (gameState.player.stats.AP < 1 || gameState.isCombat);
    investigateBtn.disabled = (gameState.player.stats.AP < 1 || gameState.isCombat);
    callAttentionBtn.disabled = (gameState.player.stats.AP < 2 || gameState.isCombat);

    // Habilita/Desabilita o botão de END DAY se AP/MP não foram totalmente gastos
    const apSpent = gameState.player.stats.AP < gameState.player.stats.maxAP;
    const mpSpent = gameState.player.stats.MP < gameState.player.stats.maxMP;
    endTurnBtn.disabled = !(apSpent || mpSpent);

    // Habilita/Desabilita o botão de upgrade
    const cost = 10;
    upgradeBtn.disabled = (gameState.player.resources.scrap < cost || 
                          gameState.player.resources.water < cost || 
                          gameState.player.resources.food < cost);
}

// ====================================================================
// FUNÇÕES DE AÇÃO E MOVIMENTO
// ====================================================================

function handleMoveAttempt(event) {
    if (gameState.player.stats.MP <= 0 || gameState.player.stats.hp <= 0 || gameState.isCombat) {
        logMessage("Out of Movement Points (MP) or currently in combat!", 'yellow');
        return;
    }

    const targetX = parseInt(event.target.dataset.x);
    const targetY = parseInt(event.target.dataset.y);
    const currentX = gameState.player.x;
    const currentY = gameState.player.y;

    const distance = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);

    if (distance === 1) {
        gameState.player.x = targetX;
        gameState.player.y = targetY;
        
        gameState.player.stats.MP--; 
        
        logMessage(`Moved to [${targetX}, ${targetY}]. MP remaining: ${gameState.player.stats.MP}`);
        
        renderMap();
        updateStatusPanel();
        
    } else {
        logMessage("Invalid move! You can only move one square.", 'yellow');
    }
}

function collectResource() {
    if (gameState.isCombat || gameState.player.stats.AP < 1) return;

    const currentCell = getCell(gameState.player.x, gameState.player.y);
    const resourceName = currentCell.biome.resource.toLowerCase().replace(' ', '');
    
    let collectedAmount = 1 + Math.floor(Math.random() * 3); 
    
    if (currentCell.biome.name === gameState.player.tribe.bonus) {
        collectedAmount += 2;
        logMessage(`Tribe Bonus: Extra ${collectedAmount} ${resourceName} collected!`, 'lime');
    }

    gameState.player.resources[resourceName] += collectedAmount;
    gameState.player.stats.AP--; 

    logMessage(`Collected ${collectedAmount} ${resourceName}. AP remaining: ${gameState.player.stats.AP}.`);
    updateStatusPanel(); 
}

function investigate() {
    if (gameState.isCombat || gameState.player.stats.AP < 1) return;

    gameState.player.stats.AP--;
    const currentCell = getCell(gameState.player.x, gameState.player.y);

    if (currentCell.hasEnemy || Math.random() < 0.2) { // 20% chance de encontrar inimigo na investigação
        logMessage("Investigation reveals an enemy! Combat initiated!", 'red');
        startCombat(ENEMY.MUTANT);
    } else if (Math.random() < 0.5) {
        const rareResource = (Math.random() < 0.5) ? 'water' : 'scrap';
        const amount = Math.floor(Math.random() * 5) + 1;
        gameState.player.resources[rareResource] += amount;
        logMessage(`Found a cache of ${amount} ${rareResource} hidden! AP remaining: ${gameState.player.stats.AP}.`, 'lime');
    } else {
        logMessage(`Investigation complete. Found nothing. AP remaining: ${gameState.player.stats.AP}.`, 'yellow');
    }
    updateStatusPanel();
}

function callAttention() {
    if (gameState.isCombat || gameState.player.stats.AP < 2) return;

    gameState.player.stats.AP -= 2; 
    
    logMessage("You called attention from the Wasteland! A fierce Drone is approaching!", 'red');
    startCombat(ENEMY.DRONE);
    updateStatusPanel();
}

function startCombat(enemyType) {
    gameState.isCombat = true;
    toggleActionButtons(false);
    
    logMessage(`VS ${enemyType.name}! HP: ${enemyType.hp}, STR: ${enemyType.strength}`, 'red');

    let playerDamage = gameState.player.stats.strength;
    let enemyDamage = enemyType.strength;

    // 1. Dano do Kid no Inimigo
    let effectiveEnemyHP = enemyType.hp - playerDamage;

    if (effectiveEnemyHP <= 0) {
        // Vitória
        gameState.isCombat = false;
        const reward = enemyType.reward;
        gameState.player.resources.scrap += reward;
        getCell(gameState.player.x, gameState.player.y).hasEnemy = false;
        logMessage(`Victory! Defeated the ${enemyType.name} and gained ${reward} Scrap.`, 'lime');
        toggleActionButtons(true);
    } else {
        // 2. Dano do Inimigo no Kid
        gameState.player.stats.hp -= enemyDamage;
        logMessage(`Kid took ${enemyDamage} damage. Remaining HP: ${gameState.player.stats.hp}`, 'red');
        
        if (gameState.player.stats.hp <= 0) {
            logMessage("Your CyberKid has been decommissioned. Expedition Failed!", 'red');
            gameOver(false);
        } else {
            gameState.isCombat = false;
            logMessage(`The ${enemyType.name} escaped, but you survived.`, 'yellow');
            toggleActionButtons(true);
        }
    }
    renderMap();
    updateStatusPanel();
}

function performUpgrade() {
    const cost = 10;
    if (gameState.player.resources.scrap < cost || gameState.player.resources.water < cost || gameState.player.resources.food < cost) return;
    
    // Drena os recursos
    gameState.player.resources.scrap -= cost;
    gameState.player.resources.water -= cost;
    gameState.player.resources.food -= cost;
    
    // Aumenta os atributos
    gameState.player.stats.strength += 3;
    gameState.player.stats.maxHp += 10;
    gameState.player.stats.hp = gameState.player.stats.maxHp;
    gameState.player.stats.upgrades++;

    logMessage(`UPGRADE COMPLETE! Strength +3, Max HP +10. Fully healed.`, 'lime');
    updateStatusPanel();
}


// ====================================================================
// GESTÃO DE FLUXO DE JOGO
// ====================================================================

function endTurn() {
    // Apenas finaliza a expedição se o limite de dias for atingido
    if (gameState.currentDay >= MAX_DAYS) {
        gameOver(true);
        return;
    }
    
    // 1. Avança o contador da Expedição (Dia)
    gameState.currentDay++;

    // 2. Reseta AP e MP para o próximo dia
    gameState.player.stats.AP = gameState.player.stats.maxAP;
    gameState.player.stats.MP = gameState.player.stats.maxMP;
    
    // 3. Spawna novos inimigos e eventos
    generateMap(); 
    
    // 4. Lógica de Ganhos IDLE (FUTURO)
    if (gameState.idleNfts.length > 0) {
        const passiveScrap = gameState.idleNfts.length * 1; // 1 scrap por Kid idle
        gameState.player.resources.scrap += passiveScrap;
        logMessage(`Idle Kidz returned: +${passiveScrap} Scrap collected passively.`, 'yellow');
    }
    
    renderMap();
    updateStatusPanel();
    logMessage(`--- DAY ${gameState.currentDay} START --- AP and MP fully restored.`, 'yellow');
}

function gameOver(success) {
    toggleActionButtons(false);
    
    if (success) {
        logMessage("EXPEDITION SUCCESSFUL! Resources earned will be converted to Tokens.", 'lime');
        logMessage(`FINAL TALLY: Scrap: ${gameState.player.resources.scrap}, Water: ${gameState.player.resources.water}, Food: ${gameState.player.resources.food}`);
        logMessage("Click 'Connect Wallet' to claim rewards (Phase 4).", 'yellow');
    } else {
        logMessage("EXPEDITION FAILED. Your Kid was decommissioned.", 'red');
    }
}


// --- LISTENERS DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a UI do jogo no estado "desconectado"
    renderMap();
    updateStatusPanel();
    toggleActionButtons(false);

    // Adiciona listeners aos botões de Ação
    collectBtn.addEventListener('click', collectResource);
    investigateBtn.addEventListener('click', investigate);
    callAttentionBtn.addEventListener('click', callAttention); 
    endTurnBtn.addEventListener('click', endTurn); 
    upgradeBtn.addEventListener('click', performUpgrade);

    // LISTENERS DO MODAL
    connectWalletBtn.addEventListener('click', openNftSelection); 
    startExpeditionBtn.addEventListener('click', closeNftSelectionAndStart); 
});
