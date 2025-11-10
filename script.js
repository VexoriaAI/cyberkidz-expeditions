// ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT LÓGICO
// ====================================================================

// --- CONFIGURAÇÕES E DADOS DO JOGO (FASE 2.1) ---
const GRID_SIZE = 6;
const MAX_TURNS = 10;
// --- CONFIGURAÇÕES E DADOS DO JOGO ---
// ... (GRID_SIZE e MAX_TURNS permanecem)

const TRIBES = {
    VOLCANICS: {
        name: "Volcanics",
        bonus: "Burning Ridge",
        // Mais Fortes, mais lentos: Mais STR, menos MP
        stats: { strength: 14, hp: 110, luck: 0.2, AP: 3, MP: 12 }, 
        color: 'red'
    },
    UNDERGROUNDERS: {
        name: "Undergrounders",
        bonus: "Abandoned Mines",
        // Equilibrados
        stats: { strength: 9, hp: 120, luck: 0.1, AP: 4, MP: 15 }, 
        color: 'brown'
    },
    REPTILIANS: {
        name: "Reptilians",
        bonus: "Covenant Swamp",
        // Fortes e ligeiramente lentos
        stats: { strength: 16, hp: 90, luck: 0.3, AP: 3, MP: 13 }, 
        color: 'green'
    },
    RADIOACTIVES: {
        name: "Radioactives",
        bonus: "Lake Rancid",
        // Mais Velozes, mais fracos: Mais MP, menos STR
        stats: { strength: 8, hp: 80, luck: 0.4, AP: 5, MP: 20 }, 
        color: 'lime'
    },
    NOCTURNALS: {
        name: "Nocturnals",
        bonus: "Ancient Ruins",
        // Equilibrados, focados em stealth/ação
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

// --- ESTADO INICIAL DO JOGO ---
let gameState = {
    // ... (restante do gameState)
    player: {
        // ... (restante do player)
        stats: { 
            strength: 0, hp: 0, maxHp: 0, luck: 0, upgrades: 0, 
            AP: 0, maxAP: 0, 
            MP: 0, maxMP: 0 
        }, 
        resources: { scrap: 0, water: 0, food: 0 },
        imageURL: "https://via.placeholder.com/150/00e0ff/1a1a2e?text=NFT+Kid" // Placeholder
    },
    gameMap: []
};

let selectionState = {
    allNfts: [], // Simulação de todos os NFTs encontrados na wallet
    activeNft: null,
    idleNfts: []
};

// Dados de simulação para 20 NFTs (substituirá a chamada real à API Tezos)
const MOCK_NFTS = [
    { id: 'CKC-001', name: 'Nocturnals Stealth', tribe: TRIBES.NOCTURNALS, img: 'https://via.placeholder.com/100/4B0082/FFFFFF?text=NFT-001' },
    { id: 'CKC-002', name: 'Reptilians Hunter', tribe: TRIBES.REPTILIANS, img: 'https://via.placeholder.com/100/3CB371/FFFFFF?text=NFT-002' },
    { id: 'CKC-003', name: 'Volcanics Forger', tribe: TRIBES.VOLCANICS, img: 'https://via.placeholder.com/100/FF0000/FFFFFF?text=NFT-003' },
    { id: 'CKC-004', name: 'Radioactives Scavenger', tribe: TRIBES.RADIOACTIVES, img: 'https://via.placeholder.com/100/B2FF66/000000?text=NFT-004' },
    { id: 'CKC-005', name: 'Undergrounder Miner', tribe: TRIBES.UNDERGROUNDERS, img: 'https://via.placeholder.com/100/A0522D/FFFFFF?text=NFT-005' },
    // Adicione mais 15 NFTs mockados aqui para preencher a lista
    // Para simplificar, vamos duplicar 
];
for(let i = 6; i <= 20; i++) {
    const base = MOCK_NFTS[i % 5];
    selectionState.allNfts.push({ 
        id: `CKC-${String(i).padStart(3, '0')}`, 
        name: `${base.tribe.name} #${i}`, 
        tribe: base.tribe,
        img: `https://via.placeholder.com/100/${base.tribe.color.substring(1).toUpperCase()}/FFFFFF?text=NFT-${i}`
    });
}
selectionState.allNfts = [...MOCK_NFTS.slice(0, 5), ...selectionState.allNfts];

// --- ELEMENTOS DOM (Referências do HTML) ---
const mapElement = document.getElementById('game-map');
const logElement = document.getElementById('game-log');
const turnCounterElement = document.getElementById('turn-counter');
const kidTribeElement = document.getElementById('kid-tribe');
const kidStrengthElement = document.getElementById('kid-strength');
const kidHpElement = document.getElementById('kid-hp');
const resScrapElement = document.getElementById('res-scrap');
const resWaterElement = document.getElementById('res-water');
const resFoodElement = document.getElementById('res-food');
const kidApElement = document.getElementById('kid-ap');
const kidMpElement = document.getElementById('kid-mp');
const kidImageContainer = document.getElementById('kid-image-container');

const collectBtn = document.getElementById('collect-btn');
const investigateBtn = document.getElementById('investigate-btn');
const callAttentionBtn = document.getElementById('call-attention-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const upgradeBtn = document.getElementById('upgrade-btn');
// ... (outras referências DOM)

// NOVAS REFERÊNCIAS PARA O MODAL
const nftSelectionModal = document.getElementById('nft-selection-modal');
const connectWalletBtn = document.getElementById('connect-wallet-btn');
const startExpeditionBtn = document.getElementById('start-expedition-btn');
const simulatedWalletNftsContainer = document.getElementById('simulated-wallet-nfts');
const activeNftSlot = document.getElementById('active-nft-slot');
const idleNftSlotsContainer = document.getElementById('idle-nft-slots-container');
const selectionStatus = document.getElementById('selection-status');


// ====================================================================
// FUNÇÕES UTILITÁRIAS
// ====================================================================

/** Adiciona uma mensagem ao console do jogo. */
function logMessage(message, color = 'var(--color-accent-blue)') {
    const p = document.createElement('p');
    p.classList.add('log-entry');
    p.style.color = color;
    p.textContent = message;
    logElement.prepend(p);
    
    // Limita o log a 20 entradas
    while (logElement.children.length > 20) {
        logElement.removeChild(logElement.lastChild);
    }
}

/** Obtém a célula do mapa pelas coordenadas X e Y. */
function getCell(x, y) {
    const index = y * GRID_SIZE + x;
    return gameState.gameMap[index];
}

/** Habilita ou desabilita os botões de ação */
function toggleActionButtons(enable) {
    collectBtn.disabled = !enable;
    investigateBtn.disabled = !enable;
    endTurnBtn.disabled = !enable;
}

// ====================================================================
// FUNÇÕES DE MAPA E RENDERIZAÇÃO (FASE 2.2)
// ====================================================================

function generateMap() {
    gameState.gameMap = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            // Sorteia um bioma aleatório
            const randomBiome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
            
            gameState.gameMap.push({
                biome: randomBiome,
                hasKid: false,
                hasEnemy: Math.random() < randomBiome.rarity, // Chance de inimigo
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
        
        // Atribui cor e adiciona o evento de movimento
        cellDiv.style.backgroundColor = cell.biome.color;
        cellDiv.dataset.x = cell.coordinates.x;
        cellDiv.dataset.y = cell.coordinates.y;
        cellDiv.addEventListener('click', handleMoveAttempt);

        // Verifica se o Kid está na célula
        if (cell.coordinates.x === playerX && cell.coordinates.y === playerY) {
            cellDiv.classList.add('kid');
            cellDiv.textContent = '🤖'; // Kid está aqui
        } else if (cell.hasEnemy) {
            cellDiv.textContent = '⚠️'; // Inimigo à vista
        } else {
            // Ícone do bioma (opcional)
            cellDiv.textContent = cell.biome.name.charAt(0);
        }
        
        mapElement.appendChild(cellDiv);
    });
}

function updateStatusPanel() {
    kidTribeElement.textContent = gameState.player.tribe.name;
    kidStrengthElement.textContent = gameState.player.stats.strength;
    kidHpElement.textContent = `${gameState.player.stats.hp}/${gameState.player.stats.maxHp}`;
    
    // NOVO: Atualiza AP e MP
    kidApElement.textContent = gameState.player.stats.AP;
    kidMpElement.textContent = gameState.player.stats.MP;
    
    // NOVO: Exibe a imagem do NFT
    kidImageContainer.innerHTML = `<img src="${gameState.player.imageURL}" alt="Your CyberKid" style="width:100%; height:auto; border-radius:5px; margin-bottom: 10px;">`;

    resScrapElement.textContent = gameState.player.resources.scrap;
    resWaterElement.textContent = gameState.player.resources.water;
    resFoodElement.textContent = gameState.player.resources.food;
    
    turnCounterElement.textContent = `${gameState.currentTurn}`;

    // NOVO: Habilita/Desabilita botões com base no AP
    collectBtn.disabled = (gameState.player.stats.AP < 1);
    investigateBtn.disabled = (gameState.player.stats.AP < 1);
    document.getElementById('call-attention-btn').disabled = (gameState.player.stats.AP < 2); // Novo botão

    // Habilita/Desabilita o botão de END TURN (Agora só reseta AP/MP)
    endTurnBtn.disabled = (gameState.player.stats.AP === gameState.player.stats.maxAP && gameState.player.stats.MP === gameState.player.stats.maxMP);
    
    // Habilita/Desabilita o botão de upgrade (Custo fixo: 10 de cada recurso)
    upgradeBtn.disabled = (gameState.player.resources.scrap < 10 || gameState.player.resources.water < 10 || gameState.player.resources.food < 10);
}

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
}

function handleNftSelection(nft) {
    if (selectionState.activeNft && selectionState.activeNft.id === nft.id) {
        // Deselecionar Ativo
        selectionState.activeNft = null;
    } else if (selectionState.idleNfts.some(n => n.id === nft.id)) {
        // Deselecionar Idle
        selectionState.idleNfts = selectionState.idleNfts.filter(n => n.id !== nft.id);
    } else if (!selectionState.activeNft) {
        // Selecionar como Ativo
        selectionState.activeNft = nft;
        // Remove dos Idles se estiver lá
        selectionState.idleNfts = selectionState.idleNfts.filter(n => n.id !== nft.id);
    } else if (selectionState.idleNfts.length < 9) {
        // Selecionar como Idle
        selectionState.idleNfts.push(nft);
    } else {
        selectionStatus.textContent = "Error: Max 1 Active and 9 Idle NFTs selected.";
        return;
    }

    // Atualiza a visualização do modal
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
}

function closeNftSelectionAndStart() {
    if (!selectionState.activeNft) {
        selectionStatus.textContent = "Error: You must select ONE Active Kid.";
        return;
    }

    nftSelectionModal.style.display = 'none';
    
    // Configura o jogo com o NFT ativo escolhido
    const activeTribe = selectionState.activeNft.tribe;
    const placeholderURL = selectionState.activeNft.img;
    
    // NOVO: Sobrescreve a inicialização para usar o NFT selecionado
    gameState.player.tribe = activeTribe;
    gameState.player.stats.strength = activeTribe.stats.strength;
    gameState.player.stats.hp = activeTribe.stats.hp;
    gameState.player.stats.maxHp = activeTribe.stats.hp;
    gameState.player.stats.luck = activeTribe.stats.luck;
    gameState.player.stats.AP = activeTribe.stats.AP;
    gameState.player.stats.maxAP = activeTribe.stats.AP;
    gameState.player.stats.MP = activeTribe.stats.MP;
    gameState.player.stats.maxMP = activeTribe.stats.MP;
    gameState.player.imageURL = placeholderURL; // Define a imagem

    initializeGame(false); // Chama a inicialização sem resetar tudo
    
    logMessage(`Active Kid: ${selectionState.activeNft.name} (${selectionState.activeNft.tribe.name}) is ready!`, 'lime');
    logMessage(`${selectionState.idleNfts.length} Kidz assigned to Idle Expedition (Passive gain starting).`, 'yellow');

    // Mudar status da Wallet
    document.getElementById('connection-status').textContent = 'Connected (NFT Loaded)';
    document.getElementById('connection-status').style.color = 'lime';
}

// ====================================================================
// FUNÇÕES DE AÇÃO E MOVIMENTO (FASE 3)
// ====================================================================

/** Lida com a tentativa de mover o Kid para uma nova célula. */
function handleMoveAttempt(event) {
    if (gameState.currentTurn > MAX_TURNS || gameState.player.stats.hp <= 0 || gameState.isCombat || gameState.player.stats.MP <= 0) return;

    // ... (cálculo de distância e verificação)

    if (distance === 1) {
        // Movimento válido
        gameState.player.x = targetX;
        gameState.player.y = targetY;
        
        // NOVO: Consome 1 MP
        gameState.player.stats.MP--; 
        
        logMessage(`Moved to [${targetX}, ${targetY}]. MP remaining: ${gameState.player.stats.MP}`);
        
        // APENAS RENDERIZA E ATUALIZA O STATUS, NÃO ENCERRA O TURNO
        renderMap();
        updateStatusPanel();
        
    } else {
        logMessage("Invalid move! You can only move one square horizontally or vertically.", 'yellow');
    }
}

/** Ação de Coletar Recurso */
function collectResource() {
    if (gameState.isCombat || gameState.player.stats.AP < 1) return;

    const currentCell = getCell(gameState.player.x, gameState.player.y);
    const resourceName = currentCell.biome.resource.toLowerCase().replace(' ', ''); // Trata 'Clean Water'
    
    let collectedAmount = 1 + Math.floor(Math.random() * 3); 
    
    if (currentCell.biome.name === gameState.player.tribe.bonus) {
        collectedAmount += 2;
        logMessage(`Tribe Bonus: Extra ${collectedAmount} ${resourceName} collected!`, 'lime');
    }

    gameState.player.resources[resourceName] += collectedAmount;
    
    // NOVO: Consome 1 AP
    gameState.player.stats.AP--; 

    logMessage(`Successfully collected ${collectedAmount} ${resourceName}. AP remaining: ${gameState.player.stats.AP}.`);
    
    updateStatusPanel(); 
}

/** Ação de Investigar (Chance de Inimigo ou Item) */
function investigate() {
    if (gameState.isCombat || gameState.player.stats.AP < 1) return;

    const currentCell = getCell(gameState.player.x, gameState.player.y);

    gameState.player.stats.AP--; // Consome 1 AP
    
    if (currentCell.hasEnemy) {
        logMessage("An enemy lurks here! Combat initiated!", 'red');
        startCombat(ENEMY.MUTANT); // Passa um inimigo padrão
    } else if (Math.random() < 0.5) {
        const rareResource = (Math.random() < 0.5) ? 'water' : 'scrap';
        const amount = Math.floor(Math.random() * 5) + 1;
        gameState.player.resources[rareResource] += amount;
        logMessage(`Found a cache of ${amount} ${rareResource} hidden! AP remaining: ${gameState.player.stats.AP}.`, 'lime');
        updateStatusPanel();
    } else {
        logMessage("Investigation complete. Found nothing of value. AP remaining: ${gameState.player.stats.AP}.", 'yellow');
        updateStatusPanel();
    }
}

/** Ação de Chamar Atencao (Combate Imediato) */

function callAttention() {
    if (gameState.isCombat || gameState.player.stats.AP < 2) return;

    gameState.player.stats.AP -= 2; // Consome 2 AP
    
    logMessage("You called attention from the Wasteland! A fierce Drone is approaching!", 'red');
    startCombat(ENEMY.DRONE); // Garante um Drone (mais fraco, recompensa padrão)
}

/** Lógica de Combate Simples */
function startCombat() {
    gameState.isCombat = true;
    toggleActionButtons(false); // Desabilita outras ações
    
    const enemyType = (Math.random() < 0.5) ? ENEMY.DRONE : ENEMY.MUTANT;
    logMessage(`VS ${enemyType.name}! HP: ${enemyType.hp}, STR: ${enemyType.strength}`, 'red');

    // Lógica de ataque: Kid sempre ataca primeiro
    let playerDamage = gameState.player.stats.strength;
    let enemyDamage = enemyType.strength;

    // O combate é resolvido em um único turno para simplificar
    
    // 1. Dano do Kid no Inimigo
    let effectiveEnemyHP = enemyType.hp - playerDamage;

    if (effectiveEnemyHP <= 0) {
        // Vitória
        gameState.isCombat = false;
        const reward = enemyType.reward;
        gameState.player.resources.scrap += reward;
        getCell(gameState.player.x, gameState.player.y).hasEnemy = false; // Remove inimigo da célula
        logMessage(`Victory! Defeated the ${enemyType.name} and gained ${reward} Scrap.`, 'lime');
        endTurn(false); // Não gasta mais um turno, apenas limpa a célula
    } else {
        // 2. Dano do Inimigo no Kid
        gameState.player.stats.hp -= enemyDamage;
        logMessage(`Kid took ${enemyDamage} damage. Remaining HP: ${gameState.player.stats.hp}`, 'red');
        
        if (gameState.player.stats.hp <= 0) {
            logMessage("Your CyberKid has been decommissioned. Expedition Failed!", 'red');
            gameOver(false); // Não foi vitória
        } else {
            // Kid sobreviveu, mas o combate termina neste turno (simplificado)
            gameState.isCombat = false;
            logMessage(`The ${enemyType.name} escaped, but you survived.`, 'yellow');
            endTurn(true); // Termina o turno
        }
    }
}


/** Ação de Upgrade do Kid */
function performUpgrade() {
    if (gameState.player.stats.upgrades >= 3) {
         logMessage("Max upgrades reached! Prepare for the Siege!", 'lime');
         return;
    }
    
    const cost = 10;
    if (gameState.player.resources.scrap >= cost && 
        gameState.player.resources.water >= cost && 
        gameState.player.resources.food >= cost) {
        
        // Drena os recursos
        gameState.player.resources.scrap -= cost;
        gameState.player.resources.water -= cost;
        gameState.player.resources.food -= cost;
        
        // Aumenta os atributos
        gameState.player.stats.strength += 3;
        gameState.player.stats.maxHp += 10;
        gameState.player.stats.hp = gameState.player.stats.maxHp; // Cura completa
        gameState.player.stats.upgrades++;

        logMessage(`UPGRADE COMPLETE! Strength +3, Max HP +10. Fully healed.`, 'lime');
        updateStatusPanel();
    }
}


// ====================================================================
// GESTÃO DE FLUXO E EVENTOS
// ====================================================================

/** Lógica executada no final de cada turno. */
function endTurn() {
    // Apenas finaliza a expedição se o limite de turnos (dias) for atingido
    if (gameState.currentTurn >= MAX_TURNS) {
        gameOver(true);
        return;
    }
    
    // 1. Avança o contador da Expedição (Dias)
    gameState.currentTurn++;

    // 2. Reseta AP e MP para o próximo dia
    gameState.player.stats.AP = gameState.player.stats.maxAP;
    gameState.player.stats.MP = gameState.player.stats.maxMP;
    
    // 3. Spawna novos inimigos e eventos (para o próximo dia)
    generateMap(); // Regenera o mapa com novos inimigos
    
    renderMap();
    updateStatusPanel();
    logMessage(`--- DAY ${gameState.currentTurn} START --- AP and MP fully restored.`, 'yellow');
}

/** Lida com o fim do jogo. */
function gameOver(success) {
    toggleActionButtons(false);
    
    if (success) {
        logMessage("EXPEDITION SUCCESSFUL! You return to The Union base.", 'lime');
        // AQUI ENTRA A LÓGICA FUTURA DE CÁLCULO DE TOKENS (FASE 4)
        logMessage(`Final Resources: Scrap: ${gameState.player.resources.scrap}, Water: ${gameState.player.resources.water}, Food: ${gameState.player.resources.food}`);
        logMessage("Ready for token claiming via Wallet Integration.", 'yellow');
    } else {
        logMessage("EXPEDITION FAILED. Try again!", 'red');
    }
}

/** Inicializa o estado do jogo ao carregar a página. */
function initializeGame() {
    const tribeKeys = Object.keys(TRIBES);
    const selectedTribeKey = tribeKeys[Math.floor(Math.random() * tribeKeys.length)];
    const selectedTribe = TRIBES[selectedTribeKey];

    // Configurar o estado do jogador
    gameState.player.tribe = selectedTribe;
    gameState.player.stats.strength = selectedTribe.stats.strength;
    gameState.player.stats.hp = selectedTribe.stats.hp;
    gameState.player.stats.maxHp = selectedTribe.stats.hp;
    gameState.player.stats.luck = selectedTribe.stats.luck;
    
    // NOVO: Configurar Action/Movement Points
    gameState.player.stats.AP = selectedTribe.stats.AP;
    gameState.player.stats.maxAP = selectedTribe.stats.AP;
    gameState.player.stats.MP = selectedTribe.stats.MP;
    gameState.player.stats.maxMP = selectedTribe.stats.MP;
    
    // Iniciar o mapa e o contador de EXPEDIÇÃO (o contador de turno agora é por AP)
    gameState.currentTurn = 1;
    generateMap();
    
    // Posição inicial do Kid
    gameState.player.x = 0;
    gameState.player.y = GRID_SIZE - 1; 

    // Renderiza o UI
    renderMap();
    updateStatusPanel();
    toggleActionButtons(true); // Habilita botões no início

    logMessage(`Expedition started! You are a ${selectedTribe.name} Kid. AP: ${selectedTribe.stats.AP}, MP: ${selectedTribe.stats.MP}.`, 'lime');
    logMessage("Use Movement Points (MP) to move, then Action Points (AP) to interact.");
}

// --- LISTENERS DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    
    // Adiciona listeners aos botões
    collectBtn.addEventListener('click', collectResource);
    investigateBtn.addEventListener('click', investigate);
    callAttentionBtn.addEventListener('click', callAttention);
    endTurnBtn.addEventListener('click', endTurn); 
    upgradeBtn.addEventListener('click', performUpgrade);

      
    // Listener de conexão da Wallet (FUTURO)
    document.getElementById('connect-wallet-btn').addEventListener('click', () => {
        logMessage("Wallet Connection is a future feature (Phase 4)!", 'yellow');
        document.getElementById('connection-status').textContent = 'Simulated Connection';
        document.getElementById('connection-status').style.color = 'lime';
    });

    document.addEventListener('DOMContentLoaded', () => {
    // initializeGame(); // REMOVIDO: A inicialização agora acontece após a seleção do NFT

    // Adiciona listeners aos botões
    collectBtn.addEventListener('click', collectResource);
    investigateBtn.addEventListener('click', investigate);
    callAttentionBtn.addEventListener('click', callAttention); 
    endTurnBtn.addEventListener('click', endTurn); 
    upgradeBtn.addEventListener('click', performUpgrade);

    // LISTENERS DO MODAL
    connectWalletBtn.addEventListener('click', openNftSelection); // Abre o modal ao conectar
    startExpeditionBtn.addEventListener('click', closeNftSelectionAndStart); // Inicia o jogo
    
    // Opcional: Inicia o jogo no modo desconectado se necessário
    // Se o modal estiver escondido, o initializeGame precisa de um fallback
    if (nftSelectionModal.style.display !== 'block') {
         // Fallback: Se não conectar, inicia com Kid padrão.
         // Para este projeto, vamos forçar a seleção.
    }
});
});
