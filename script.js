// ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT LÓGICO
// ====================================================================

// --- CONFIGURAÇÕES E DADOS DO JOGO (FASE 2.1) ---
const GRID_SIZE = 6;
const MAX_TURNS = 10;
const TRIBES = {
    VOLCANICS: {
        name: "Volcanics",
        bonus: "Burning Ridge",
        stats: { strength: 12, hp: 100, luck: 0.2 },
        color: 'red'
    },
    UNDERGROUNDERS: {
        name: "Undergrounders",
        bonus: "Abandoned Mines",
        stats: { strength: 8, hp: 120, luck: 0.1 },
        color: 'brown'
    },
    REPTILIANS: {
        name: "Reptilians",
        bonus: "Covenant Swamp",
        stats: { strength: 15, hp: 90, luck: 0.3 },
        color: 'green'
    },
    RADIOACTIVES: {
        name: "Radioactives",
        bonus: "Lake Rancid",
        stats: { strength: 10, hp: 80, luck: 0.4 },
        color: 'lime'
    },
    NOCTURNALS: {
        name: "Nocturnals",
        bonus: "Ancient Ruins",
        stats: { strength: 9, hp: 100, luck: 0.25 },
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
    currentTurn: 0,
    isCombat: false,
    player: {
        tribe: null,
        x: 0,
        y: 0,
        stats: { strength: 0, hp: 0, maxHp: 0, luck: 0, upgrades: 0 },
        resources: { scrap: 0, water: 0, food: 0 }
    },
    gameMap: []
};

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

const collectBtn = document.getElementById('collect-btn');
const investigateBtn = document.getElementById('investigate-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const upgradeBtn = document.getElementById('upgrade-btn');


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
    // Atualiza os dados no painel esquerdo
    kidTribeElement.textContent = gameState.player.tribe.name;
    kidStrengthElement.textContent = gameState.player.stats.strength;
    kidHpElement.textContent = `${gameState.player.stats.hp}/${gameState.player.stats.maxHp}`;
    
    resScrapElement.textContent = gameState.player.resources.scrap;
    resWaterElement.textContent = gameState.player.resources.water;
    resFoodElement.textContent = gameState.player.resources.food;
    
    turnCounterElement.textContent = `${gameState.currentTurn}`;

    // Habilita/Desabilita o botão de upgrade (Custo fixo: 10 de cada recurso)
    upgradeBtn.disabled = (gameState.player.resources.scrap < 10 || 
                          gameState.player.resources.water < 10 || 
                          gameState.player.resources.food < 10);
}

// ====================================================================
// FUNÇÕES DE AÇÃO E MOVIMENTO (FASE 3)
// ====================================================================

/** Lida com a tentativa de mover o Kid para uma nova célula. */
function handleMoveAttempt(event) {
    if (gameState.currentTurn > MAX_TURNS || gameState.player.stats.hp <= 0 || gameState.isCombat) return;

    const targetX = parseInt(event.target.dataset.x);
    const targetY = parseInt(event.target.dataset.y);
    const currentX = gameState.player.x;
    const currentY = gameState.player.y;

    // Calcula a distância de Manhattan (apenas 1 passo na horizontal ou vertical)
    const distance = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);

    if (distance === 1) {
        // Movimento válido
        gameState.player.x = targetX;
        gameState.player.y = targetY;
        logMessage(`Moved to [${targetX}, ${targetY}] - Biome: ${getCell(targetX, targetY).biome.name}`);
        
        // Finaliza o turno após o movimento
        endTurn();
    } else {
        logMessage("Invalid move! You can only move one square horizontally or vertically.", 'yellow');
    }
}

/** Ação de Coletar Recurso */
function collectResource() {
    if (gameState.isCombat || gameState.currentTurn > MAX_TURNS) return;

    const currentCell = getCell(gameState.player.x, gameState.player.y);
    const resourceName = currentCell.biome.resource.toLowerCase();
    
    // Calcula a quantidade coletada (Base 1 + Sorte)
    let collectedAmount = 1 + Math.floor(Math.random() * 3); 
    
    // Bônus da Tribo: Se o Kid estiver no seu bioma de bônus, ganha +2
    if (currentCell.biome.name === gameState.player.tribe.bonus) {
        collectedAmount += 2;
        logMessage(`Tribe Bonus: Extra ${collectedAmount} ${resourceName} collected!`, 'lime');
    }

    gameState.player.resources[resourceName] += collectedAmount;
    logMessage(`Successfully collected ${collectedAmount} ${resourceName} from the ${currentCell.biome.name}.`);
    
    // Finaliza o turno após a ação
    endTurn();
}

/** Ação de Investigar (Chance de Inimigo ou Item) */
function investigate() {
    if (gameState.isCombat || gameState.currentTurn > MAX_TURNS) return;

    const currentCell = getCell(gameState.player.x, gameState.player.y);

    if (currentCell.hasEnemy) {
        logMessage("An enemy lurks here! Combat initiated!", 'red');
        startCombat();
    } else if (Math.random() < 0.5) { // 50% de chance de encontrar algo
        // Encontra um item raro (água ou scrap)
        const rareResource = (Math.random() < 0.5) ? 'water' : 'scrap';
        const amount = Math.floor(Math.random() * 5) + 1;
        gameState.player.resources[rareResource] += amount;
        logMessage(`Found a cache of ${amount} ${rareResource} hidden in the ${currentCell.biome.name} ruins!`, 'lime');
        endTurn();
    } else {
        logMessage("Investigation complete. Found nothing of value.", 'yellow');
        endTurn();
    }
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
function endTurn(advanceTurn = true) {
    if (advanceTurn) {
        gameState.currentTurn++;
    }

    if (gameState.currentTurn <= MAX_TURNS) {
        renderMap();
        updateStatusPanel();
        toggleActionButtons(true);
        logMessage("Turn ended. Waiting for your next move.");
    } else {
        gameOver(true); // Fim da expedição (sucesso se chegou ao fim)
    }
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
    // Escolhe uma tribo aleatória para iniciar o jogo
    const tribeKeys = Object.keys(TRIBES);
    const selectedTribeKey = tribeKeys[Math.floor(Math.random() * tribeKeys.length)];
    const selectedTribe = TRIBES[selectedTribeKey];

    // Configura o estado do jogador
    gameState.player.tribe = selectedTribe;
    gameState.player.stats.strength = selectedTribe.stats.strength;
    gameState.player.stats.hp = selectedTribe.stats.hp;
    gameState.player.stats.maxHp = selectedTribe.stats.hp;
    gameState.player.stats.luck = selectedTribe.stats.luck;
    gameState.player.x = 0; 
    gameState.player.y = GRID_SIZE - 1; // Posição inicial no canto inferior esquerdo

    // Inicia o mapa e o contador
    gameState.currentTurn = 1;
    generateMap();
    renderMap();
    updateStatusPanel();
    toggleActionButtons(true);
    
    logMessage(`Expedition started! You are a ${selectedTribe.name} Kid.`, 'lime');
    logMessage("Click on an adjacent square to move, then use an action.");
}

// --- LISTENERS DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    
    // Adiciona listeners aos botões
    collectBtn.addEventListener('click', collectResource);
    investigateBtn.addEventListener('click', investigate);
    endTurnBtn.addEventListener('click', endTurn); // Este é apenas um 'Skip Turn'
    upgradeBtn.addEventListener('click', performUpgrade);
    
    // Listener de conexão da Wallet (FUTURO)
    document.getElementById('connect-wallet-btn').addEventListener('click', () => {
        logMessage("Wallet Connection is a future feature (Phase 4)!", 'yellow');
        document.getElementById('connection-status').textContent = 'Simulated Connection';
        document.getElementById('connection-status').style.color = 'lime';
    });
});
