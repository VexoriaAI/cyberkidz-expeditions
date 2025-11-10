// script.js

// --- CONFIGURAÇÕES DO JOGO ---
const GRID_SIZE = 6;
const MAX_TURNS = 10;
const TRIBES = {
    VOLCANICS: {
        name: "Volcanics",
        bonus: "Burning Ridge",
        [cite_start]stats: { strength: 12, hp: 100, luck: 0.2 }, // Master Forgers, high strength [cite: 21, 22]
        color: 'red'
    },
    UNDERGROUNDERS: {
        name: "Undergrounders",
        bonus: "Abandoned Mines",
        [cite_start]stats: { strength: 8, hp: 120, luck: 0.1 }, // Adapted to darkness, high resilience [cite: 31, 32]
        color: 'brown'
    },
    REPTILIANS: {
        name: "Reptilians",
        bonus: "Covenant Swamp",
        [cite_start]stats: { strength: 15, hp: 90, luck: 0.3 }, // Unnatural strength, animal instincts, highly skilled hunters [cite: 27, 28]
        color: 'green'
    },
    RADIOACTIVES: {
        name: "Radioactives",
        bonus: "Lake Rancid",
        [cite_start]stats: { strength: 10, hp: 80, luck: 0.4 }, // Most mutated, wreckless and resistant [cite: 35, 38]
        color: 'lime'
    },
    NOCTURNALS: {
        name: "Nocturnals",
        bonus: "Ancient Ruins",
        [cite_start]stats: { strength: 9, hp: 100, luck: 0.25 }, // Technologically advanced, least mutated [cite: 40, 44]
        color: 'purple'
    }
};

const BIOMES = [
    { name: "Burning Ridge", resource: "Scrap", rarity: 0.1, color: '#8B4513' },
    { name: "Covenant Swamp", resource: "Food", rarity: 0.15, color: '#3CB371' },
    { name: "Lake Rancid", resource: "Food", rarity: 0.2, color: '#20B2AA' },
    { name: "Ancient Ruins", resource: "Scrap", rarity: 0.05, color: '#4F4F4F' },
    { name: "Abandoned Mines", resource: "Clean Water", rarity: 0.1, color: '#696969' },
    { name: "Wasteland", resource: "Scrap", rarity: 0.3, color: '#555555' } // Área neutra, mais comum
];

// --- ESTADO INICIAL DO JOGO ---
let gameState = {
    currentTurn: 0,
    player: {
        tribe: null, // Será definido ao iniciar
        x: 0,
        y: 0,
        stats: { strength: 0, hp: 0, maxHp: 0, luck: 0 },
        resources: { scrap: 0, water: 0, food: 0 }
    },
    gameMap: Array(GRID_SIZE * GRID_SIZE).fill(null)
};

// --- ELEMENTOS DOM (Obtendo referências do HTML) ---
const mapElement = document.getElementById('game-map');
const logElement = document.getElementById('game-log');
const turnCounterElement = document.getElementById('turn-counter');
const statusPanelElement = document.getElementById('status-panel');

// Funções utilitárias de DOM
function logMessage(message, color = 'var(--color-accent-blue)') {
    const p = document.createElement('p');
    p.classList.add('log-entry');
    p.style.color = color;
    p.textContent = `[Turn ${gameState.currentTurn}]: ${message}`;
    logElement.prepend(p);
    // Limita o log a 20 entradas para performance
    while (logElement.children.length > 20) {
        logElement.removeChild(logElement.lastChild);
    }
}

function initializeGame() {
    // Escolher uma tribo aleatória (temporariamente, antes da integração NFT)
    const tribeKeys = Object.keys(TRIBES);
    const selectedTribeKey = tribeKeys[Math.floor(Math.random() * tribeKeys.length)];
    const selectedTribe = TRIBES[selectedTribeKey];

    // Configurar o estado do jogador
    gameState.player.tribe = selectedTribe;
    gameState.player.stats.strength = selectedTribe.stats.strength;
    gameState.player.stats.hp = selectedTribe.stats.hp;
    gameState.player.stats.maxHp = selectedTribe.stats.hp;
    gameState.player.stats.luck = selectedTribe.stats.luck;
    
    // Iniciar o mapa e o contador
    gameState.currentTurn = 1;
    generateMap();
    renderMap();
    updateStatusPanel();
    
    // Posição inicial do Kid (canto inferior esquerdo, por exemplo)
    gameState.player.x = 0;
    gameState.player.y = GRID_SIZE - 1; 
    
    logMessage(`Expedition started! You are a ${selectedTribe.name} Kid.`);
    // Habilitar botões após iniciar o jogo (será feito na próxima fase)
}

function generateMap() {
    gameState.gameMap = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        // Seleciona um bioma aleatório com base na raridade (para mais complexidade)
        const randomBiome = BIOMES[Math.floor(Math.random() * BIOMES.length)];
        gameState.gameMap.push({
            biome: randomBiome,
            hasKid: false,
            hasEnemy: Math.random() < randomBiome.rarity, // Inimigo depende da raridade do bioma
            coordinates: { 
                x: i % GRID_SIZE, 
                y: Math.floor(i / GRID_SIZE) 
            }
        });
    }
}

function renderMap() {
    mapElement.innerHTML = ''; // Limpa o mapa anterior
    const playerX = gameState.player.x;
    const playerY = gameState.player.y;
    
    gameState.gameMap.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('map-cell');
        
        // Atribui cor e nome do bioma
        cellDiv.style.backgroundColor = cell.biome.color;
        
        // Verifica se o Kid está nesta célula
        if (cell.coordinates.x === playerX && cell.coordinates.y === playerY) {
            cellDiv.classList.add('kid');
            cellDiv.textContent = '🤖'; // Representação do Kid
        } else {
            // Adiciona um ícone de inimigo se houver
            if (cell.hasEnemy) {
                 cellDiv.textContent = '⚠️';
            }
        }
        
        // Permite o clique na célula (para movimento, a ser implementado na Fase 3)
        cellDiv.dataset.x = cell.coordinates.x;
        cellDiv.dataset.y = cell.coordinates.y;
        
        mapElement.appendChild(cellDiv);
    });
}

function updateStatusPanel() {
    // Atualiza os dados no painel esquerdo
    document.getElementById('kid-tribe').textContent = gameState.player.tribe.name;
    document.getElementById('kid-strength').textContent = gameState.player.stats.strength;
    document.getElementById('kid-hp').textContent = `${gameState.player.stats.hp}/${gameState.player.stats.maxHp}`;
    
    document.getElementById('res-scrap').textContent = gameState.player.resources.scrap;
    document.getElementById('res-water').textContent = gameState.player.resources.water;
    document.getElementById('res-food').textContent = gameState.player.resources.food;
    
    turnCounterElement.textContent = `${gameState.currentTurn}`;
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', initializeGame);
