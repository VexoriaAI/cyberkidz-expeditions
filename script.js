/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 3.0 (Refatoração Pós-Consultoria V2)
// ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================================================================== */
    /* SEÇÃO 1: BANCO DE DADOS E CONSTANTES (Simulados)
    /* ==================================================================== */

    const MAX_DAYS = 10;
    const MAX_PLACEHOLDER_IMAGES_PER_TRIBE = 5;

    // --- 1.1: Atributos Base das Tribos ---
    const TRIBES = {
        VOLCANICS: {
            name: "Volcanics",
            biome: "volcanics", 
            baseStats: { damage: 4, critDamage: 5, defense: 3, blockChance: 3, critChance: 2, speed: 15, attackSpeed: 1, hpRegen: 1, ap: 5, hp: 110, luck: 1 }
        },
        UNDERGROUNDERS: {
            name: "Undergrounders",
            biome: "undergrounders",
            baseStats: { damage: 2, critDamage: 2, defense: 5, blockChance: 5, critChance: 1, speed: 15, attackSpeed: 2, hpRegen: 2, ap: 6, hp: 120, luck: 2 }
        },
        NOCTURNALS: {
            name: "Nocturnals",
            biome: "nocturnals",
            baseStats: { damage: 3, critDamage: 3, defense: 2, blockChance: 1, critChance: 5, speed: 15, attackSpeed: 4, hpRegen: 1, ap: 6, hp: 100, luck: 3 }
        },
        RADIOACTIVES: {
            name: "Radioactives",
            biome: "radioactives",
            baseStats: { damage: 2, critDamage: 2, defense: 1, blockChance: 1, critChance: 3, speed: 20, attackSpeed: 5, hpRegen: 1, ap: 7, hp: 80, luck: 5 }
        },
        REPTILIANS: {
            name: "Reptilians",
            biome: "reptilians",
            baseStats: { damage: 3, critDamage: 2, defense: 3, blockChance: 2, critChance: 2, speed: 13, attackSpeed: 2, hpRegen: 5, ap: 5, hp: 100, luck: 2 }
        }
    };

    // --- 1.2: Biomas ---
    const BIOMES = {
        volcanics: { name: "Burning Ridge", resource: "scrap" },
        reptilians: { name: "Covenant Swamp", resource: "food" },
        radioactives: { name: "Lake Rancid", resource: "food" },
        nocturnals: { name: "Ancient Ruins", resource: "scrap" },
        undergrounders: { name: "Abandoned Mines", resource: "water" },
        wasteland: { name: "Wasteland", resource: "scrap" }
    };
    
    // --- 1.3: Inimigos ---
    const ENEMIES = {
        DRONE: { 
            id: "drone", name: "CKC Drone", strength: 5, hp: 15, speed: 10,
            sprite: "images/drone-sprite.png",
            rewards: { scrap: 5, metal: 1 }
        },
        MUTANT: { 
            id: "mutant", name: "Wasteland Mutant", strength: 8, hp: 25, speed: 5,
            sprite: "images/mutant-sprite.png",
            rewards: { scrap: 10, food: 3 }
        }
    };
    
    // --- 1.4: Banco de Dados de Crafting (Atualizado) ---
    const MATERIALS = {
        scrap: { name: "Scrap", icon: "images/icon_scrap.png" }, 
        water: { name: "Clean Water", icon: "images/icon_water.png" }, 
        food: { name: "Food", icon: "images/icon_food.png" },
        metal: { name: "Metal", icon: "images/icon_metal.png" }
    };
    const COMPONENTS = {
        volcanic_core: { name: "Volcanic Core", stats: { damage: 5 }, icon: "images/icon_component.png" },
        defense_plate: { name: "Defense Plate", stats: { defense: 5 }, icon: "images/icon_component.png" }
    };
    const RECIPES_REFINE = {
        volcanic_core: { name: "Volcanic Core", cost: { scrap: 10, metal: 5 } },
        defense_plate: { name: "Defense Plate", cost: { scrap: 20 } }
    };
    const RECIPES_CRAFT = {
        empty_helmet: { name: "Rustic Helmet (Empty)", cost: { scrap: 8 }, type: "equipment", level: 1, stats: {}, slot: "helmet", icon: "images/icon_helmet.png" },
        empty_weapon: { name: "Rustic Blade (Empty)", cost: { scrap: 10 }, type: "equipment", level: 1, stats: {}, slot: "weapon", icon: "images/icon_weapon.png" }
    };
    const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
    const STATS_LIST = ['hp', 'ap', 'speed', 'damage', 'defense', 'critChance', 'critDamage', 'attackSpeed', 'hpRegen', 'blockChance', 'luck'];

    // --- 1.5: Definição do Mapa Estático ---
    const STATIC_MAP_DATA = new Map([
        ["-3,0", { biome: "volcanics" }], ["-3,1", { biome: "volcanics" }], ["-3,2", { biome: "volcanics" }],
        ["-2,-1", { biome: "volcanics" }], ["-2,0", { biome: "volcanics" }], ["-2,1", { biome: "volcanics" }],
        ["-1,-2", { biome: "undergrounders" }], ["-1,-1", { biome: "undergrounders" }], ["-1,0", { biome: "undergrounders" }],
        ["0,-2", { biome: "undergrounders" }], ["0,-1", { biome: "undergrounders" }],
        ["0,0", { biome: "wasteland" }], ["-1,1", { biome: "wasteland" }], ["1,-1", { biome: "wasteland" }],
        ["1,0", { biome: "wasteland" }], ["0,1", { biome: "wasteland" }],
        ["-2,2", { biome: "nocturnals" }], ["-2,3", { biome: "nocturnals" }],
        ["-1,2", { biome: "nocturnals" }], ["-1,3", { biome: "nocturnals" }],
        ["0,2", { biome: "nocturnals" }], ["0,3", { biome: "nocturnals" }],
        ["1,-2", { biome: "radioactives" }], ["2,-3", { biome: "radioactives" }],
        ["2,-2", { biome: "radioactives" }], ["3,-3", { biome: "radioactives" }],
        ["3,-2", { biome: "radioactives" }],
        ["1,1", { biome: "reptilians" }], ["1,2", { biome: "reptilians" }],
        ["2,0", { biome: "reptilians" }], ["2,1", { biome: "reptilians" }],
        ["3,-1", { biome: "reptilians" }], ["3,0", { biome: "reptilians" }],
    ]);

    // --- 1.6: Carteira Simulada (MOCK_WALLET) ---
    // A lógica de placeholder de imagem será aplicada na INICIALIZAÇÃO
    const MOCK_WALLET = [
        { id: '#313', name: 'Blue Mutant', tribe: TRIBES.RADIOACTIVES, expeditions: 5, equipped: { helmet: 'h1', weapon: 'w1', accessory: null, armor: null, gloves: null, implant: null, boots: null } },
        { id: '#222', name: 'Demo Nocturnal', tribe: TRIBES.NOCTURNALS, expeditions: 2, equipped: { helmet: null, weapon: null, accessory: null, armor: null, gloves: null, implant: null, boots: null } },
        { id: '#111', name: 'Demo Volcanic', tribe: TRIBES.VOLCANICS, expeditions: 10, equipped: { helmet: null, weapon: 'w1', accessory: null, armor: null, gloves: null, implant: null, boots: null } },
        { id: '#444', name: 'Swamp Kid', tribe: TRIBES.REPTILIANS, expeditions: 0, equipped: {} },
        { id: '#555', name: 'Miner', tribe: TRIBES.UNDERGROUNDERS, expeditions: 1, equipped: {} },
        // ... (Adicione mais 15+ Kidz aqui para testar a paginação)
        { id: '#001', name: 'Rookie-1', tribe: TRIBES.VOLCANICS, expeditions: 0, equipped: {} },
        { id: '#002', name: 'Rookie-2', tribe: TRIBES.VOLCANICS, expeditions: 0, equipped: {} },
        { id: '#003', name: 'Rookie-3', tribe: TRIBES.NOCTURNALS, expeditions: 0, equipped: {} },
        { id: '#004', name: 'Rookie-4', tribe: TRIBES.RADIOACTIVES, expeditions: 0, equipped: {} },
        { id: '#005', name: 'Rookie-5', tribe: TRIBES.REPTILIANS, expeditions: 0, equipped: {} },
        { id: '#006', name: 'Rookie-6', tribe: TRIBES.UNDERGROUNDERS, expeditions: 0, equipped: {} },
        { id: '#007', name: 'Rookie-7', tribe: TRIBES.VOLCANICS, expeditions: 0, equipped: {} },
        { id: '#008', name: 'Rookie-8', tribe: TRIBES.NOCTURNALS, expeditions: 0, equipped: {} },
        { id: '#009', name: 'Rookie-9', tribe: TRIBES.RADIOACTIVES, expeditions: 0, equipped: {} },
        { id: '#010', name: 'Rookie-10', tribe: TRIBES.REPTILIANS, expeditions: 0, equipped: {} },
        { id: '#011', name: 'Rookie-11', tribe: TRIBES.UNDERGROUNDERS, expeditions: 0, equipped: {} },
    ];
    const DEMO_KID_ID = '#313'; // O ID do Blue Mutant

    /* ==================================================================== */
    /* SEÇÃO 2: MASTER STATE (gameState) (Refatorado)
    /* ==================================================================== */

    let gameState = {
        currentScreen: 'logged-out-screen',
        player: {
            tezerium: 1000,
            inventory: {
                materials: { scrap: 100, water: 100, food: 100, metal: 5 },
                components: { volcanic_core: 1, defense_plate: 1 },
                equipment: [
                    { id: 'h1', name: 'Plate Helmet', level: 1, slot: 'helmet', stats: { defense: 5, blockChance: 3 }, icon: 'images/icon_helmet.png' },
                    { id: 'h2', name: 'Rustic Helmet', level: 1, slot: 'helmet', stats: { defense: 2 }, icon: 'images/icon_helmet.png' },
                    { id: 'w1', name: 'Volcanic Blade', level: 1, slot: 'weapon', stats: { damage: 5, critDamage: 5 }, icon: 'images/icon_weapon.png' }
                ]
            },
            kidz: [] // Será preenchido pelo MOCK_WALLET
        },
        hub: {
            activeKidId: null, 
            // Novo estado de Paginação
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                totalPages: 1,
                filteredKidz: [] // Cache dos Kidz filtrados
            },
            // Novo estado de Abas
            tabs: {
                activeMainTab: 'inventory',
                activeInvSubTab: 'inv-equipments',
                activeWsSubTab: 'ws-refine'
            },
            // Novo estado do Embed
            embed: {
                slotGear: null, // ID do item
                slotComponent: null // ID do componente
            }
        },
        expedition: {
            kid: null, stats: {}, currentDay: 1, playerPos: { q: 0, r: 0 },
            currentHP: 100, currentAP: 0, maxAP: 0, currentMP: 0, maxMP: 0,
            resourcesFound: {}, revealedHexes: new Set()
        },
        combat: {
            isActive: false, enemy: null, playerTurn: true
        }
    };

    /* ==================================================================== */
    /* SEÇÃO 3: CACHE DE ELEMENTOS DO DOM (Refatorado)
    /* ==================================================================== */
    // Documentação: Cache de todos os elementos que usamos
    const DOM = {
        header: {
            tezeriumDisplay: document.getElementById('tezerium-display'),
            tezeriumBalance: document.getElementById('tezerium-balance'),
            walletStatus: document.getElementById('wallet-status'),
            headerConnectBtn: document.getElementById('header-connect-btn'),
            connectionStatus: document.getElementById('connection-status')
        },
        screens: {
            'logged-out-screen': document.getElementById('logged-out-screen'),
            'hub-selection-screen': document.getElementById('hub-selection-screen'),
            'hub-preparation-screen': document.getElementById('hub-preparation-screen'),
            'game-screen': document.getElementById('game-screen')
        },
        // --- Tela 1 (Logged Out) ---
        loggedOut: {
            bodyConnectBtn: document.getElementById('body-connect-btn'),
            demoGameBtn: document.getElementById('demo-game-btn')
        },
        // --- Tela 2 (Hub Selection) ---
        hubSelection: {
            filterSearch: document.getElementById('filter-search'),
            filterTribe: document.getElementById('filter-tribe'),
            filterItemsPerPage: document.getElementById('filter-items-per-page'), // Novo
            filterResetBtn: document.getElementById('filter-reset-btn'),
            nftGrid: document.getElementById('nft-selection-grid'),
            nftGridPlaceholder: document.getElementById('nft-grid-placeholder'),
            paginationControls: document.getElementById('pagination-controls'), // Novo
            paginationPrev: document.getElementById('pagination-prev'), // Novo
            paginationInfo: document.getElementById('pagination-info'), // Novo
            paginationNext: document.getElementById('pagination-next') // Novo
        },
        // --- Tela 3 (Hub Preparation) ---
        hubPreparation: {
            backToSelectionBtn: document.getElementById('back-to-selection-btn'),
            startExpeditionBtn: document.getElementById('start-expedition-btn'),
            // Kid Info
            kidImage: document.getElementById('prep-kid-image'),
            kidName: document.getElementById('prep-kid-name-display'),
            editNameBtn: document.getElementById('edit-name-btn'),
            kidTribe: document.getElementById('prep-kid-tribe'),
            kidId: document.getElementById('prep-kid-id'),
            kidExpeditions: document.getElementById('prep-kid-expeditions'),
            // Manequim
            mannequin: document.querySelector('.equipment-mannequin'),
            statsDisplay: document.getElementById('prep-stats-display'),
            // Workshop (Containers das Abas)
            workshopPanel: document.getElementById('workshop-panel'),
            mainTabs: document.querySelector('.main-tabs'),
            mainTabInventory: document.getElementById('main-tab-inventory'),
            mainTabWorkshop: document.getElementById('main-tab-workshop'),
            // Conteúdo das Sub-Abas
            materialsTableBody: document.getElementById('materials-table-body'),
            craftRecipeList: document.getElementById('craft-recipe-list'),
            craftRecipeDetails: document.getElementById('craft-recipe-details'),
            embedSlotGear: document.getElementById('embed-slot-gear'),
            embedSlotComponent: document.getElementById('embed-slot-component'),
            embedBtn: document.getElementById('embed-btn')
        },
        // --- Tela 4 (Game) ---
        game: {
            kidImage: document.getElementById('game-kid-image'),
            kidTribe: document.getElementById('game-kid-tribe'),
            kidId: document.getElementById('game-kid-id'),
            hpBarFill: document.getElementById('game-hp-bar-fill'),
            hpBarText: document.getElementById('game-hp-bar-text'),
            statsDisplay: document.getElementById('game-stats-display'),
            resourceList: document.getElementById('game-resource-list'),
            exitExpeditionBtn: document.getElementById('exit-expedition-btn'),
            turnCounter: document.getElementById('turn-counter'),
            mapContainer: document.getElementById('game-map-container'),
            mapContent: document.getElementById('game-map-content'),
            apDisplay: document.getElementById('game-kid-ap'),
            maxApDisplay: document.getElementById('game-kid-max-ap'),
            mpDisplay: document.getElementById('game-kid-mp'),
            maxMpDisplay: document.getElementById('game-kid-max-mp'),
            collectBtn: document.getElementById('collect-btn'),
            investigateBtn: document.getElementById('investigate-btn'),
            searchEnemyBtn: document.getElementById('search-enemy-btn'),
            endTurnBtn: document.getElementById('end-turn-btn'),
            skipAnimationsCheck: document.getElementById('skip-animations-check'),
            log: document.getElementById('game-log')
        },
        // --- Modais ---
        modals: {
            equipSelect: document.getElementById('equipment-select-modal'),
            equipTitle: document.getElementById('modal-equip-title'),
            equipList: document.getElementById('modal-equip-list'),
            equipCloseBtn: document.getElementById('modal-equip-close'),
            editName: document.getElementById('edit-name-modal'),
            editNameInput: document.getElementById('edit-name-input'),
            editNameCancel: document.getElementById('edit-name-cancel'),
            editNameSave: document.getElementById('edit-name-save'),
            feedback: document.getElementById('action-feedback-modal'),
            feedbackTitle: document.getElementById('feedback-title'),
            feedbackDesc: document.getElementById('feedback-description'),
            combat: document.getElementById('combat-modal'),
            combatPhaseBattle: document.getElementById('combat-phase-battle'),
            combatPhaseVictory: document.getElementById('combat-phase-victory'),
            combatPhaseDefeat: document.getElementById('combat-phase-defeat'),
            combatPlayer: document.getElementById('combat-player'),
            combatPlayerHpFill: document.getElementById('combat-player-hp-fill'),
            combatPlayerHpText: document.getElementById('combat-player-hp-text'),
            combatEnemy: document.getElementById('combat-enemy'),
            combatEnemyName: document.getElementById('combat-enemy-name'),
            combatEnemyHpFill: document.getElementById('combat-enemy-hp-fill'),
            combatEnemyHpText: document.getElementById('combat-enemy-hp-text'),
            combatLog: document.getElementById('combat-log'),
            combatAttackBtn: document.getElementById('combat-attack-btn'),
            combatFleeBtn: document.getElementById('combat-flee-btn'),
            victoryRewardList: document.getElementById('victory-reward-list'),
            victoryEnemyName: document.getElementById('victory-enemy-name'),
            combatCloseVictoryBtn: document.getElementById('combat-close-victory-btn'),
            combatReturnHubBtn: document.getElementById('combat-return-hub-btn'),
            embedConfirm: document.getElementById('embed-confirm-modal'), // Novo
            embedBefore: document.getElementById('embed-before'), // Novo
            embedAfter: document.getElementById('embed-after'), // Novo
            embedCancelBtn: document.getElementById('embed-cancel-btn'), // Novo
            embedConfirmBtn: document.getElementById('embed-confirm-btn') // Novo
        }
    };

    /* ==================================================================== */
    /* SEÇÃO 4: MOTOR PRINCIPAL (Navegação e Funções Auxiliares)
    /* ==================================================================== */

    /**
     * Mostra uma tela principal e esconde as outras. (Versão Corrigida)
     */
    function showScreen(screenId) {
        Object.values(DOM.screens).forEach(screen => {
            screen.style.display = 'none';
        });
        if (DOM.screens[screenId]) {
            DOM.screens[screenId].style.display = 'block';
        } else {
            console.error(`showScreen: Screen with ID '${screenId}' not found in DOM cache.`);
        }
        gameState.currentScreen = screenId;
    }

    /**
     * Adiciona uma mensagem ao log do jogo (Tela 4).
     */
    function logMessage(message, type = 'action') {
        const p = document.createElement('p');
        p.classList.add('log-entry', type);
        p.textContent = message;
        DOM.game.log.prepend(p);
        while (DOM.game.log.children.length > 50) {
            DOM.game.log.removeChild(DOM.game.log.lastChild);
        }
    }

    /**
     * Calcula os stats finais de um Kid (base + equipamentos).
     */
    function calculateFinalStats(kid) {
        const finalStats = { ...kid.tribe.baseStats };
        for (const slot of EQUIPMENT_SLOTS) {
            const itemId = kid.equipped[slot];
            if (!itemId) continue;
            const item = gameState.player.inventory.equipment.find(e => e.id === itemId);
            if (!item || !item.stats) continue;
            for (const stat in item.stats) {
                if (finalStats.hasOwnProperty(stat)) {
                    finalStats[stat] += item.stats[stat];
                }
            }
        }
        return finalStats;
    }

    /**
     * Retorna um ponto de spawn aleatório para uma tribo.
     */
    function getSpawnPoint(biomeName) {
        const validSpawns = [];
        STATIC_MAP_DATA.forEach((cell, key) => {
            if (cell.biome === biomeName) {
                const [q, r] = key.split(',').map(Number);
                validSpawns.push({ q, r });
            }
        });
        if (validSpawns.length === 0) return { q: 0, r: 0 }; // Fallback
        return validSpawns[Math.floor(Math.random() * validSpawns.length)];
    }

    // --- Funções Auxiliares do Mapa Hexagonal ---
    function axialToPixel(q, r) {
        // Pegamos a largura completa (var(--hex-size) ) e a altura (var(--hex-height))
        const hexWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-size'));
        const hexHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-height'));
    
        // A compensação é baseada na largura (3/4 da largura total por coluna)
        const x = hexWidth * (3/4 * q); 
        
        // A compensação vertical depende de Q (para o offset) e de R (para a linha)
        // q/2 faz a compensação de offset (metade da altura) a cada nova coluna
        const y = hexHeight * (r + q / 2); 
        
        return { x, y };
    }
    function axialDistance(q1, r1, q2, r2) {
        return (Math.abs(q1 - q2) 
              + Math.abs(q1 + r1 - q2 - r2) 
              + Math.abs(r1 - r2)) / 2;
    }

    /**
     * NOVO: Gera um nome de arquivo de placeholder de imagem aleatório.
     */
    function getRandomPlaceholderImg(tribeName) {
        const tribeKey = tribeName.toLowerCase();
        const number = Math.floor(Math.random() * MAX_PLACEHOLDER_IMAGES_PER_TRIBE) + 1;
        return `images/${tribeKey}_${number}.png`;
    }

    /* ==================================================================== */
    /* SEÇÃO 5: LÓGICA DA TELA 1 (LOGGED OUT) E INICIALIZAÇÃO DE DADOS
    /* ==================================================================== */

    /**
     * NOVO: Prepara o MOCK_WALLET com dados dinâmicos (placeholders).
     */
    function initializeMockWallet() {
        gameState.player.kidz = JSON.parse(JSON.stringify(MOCK_WALLET)).map(kid => {
            // Garante que todo kid tenha um objeto 'equipped'
            if (!kid.equipped) {
                kid.equipped = {};
            }
            EQUIPMENT_SLOTS.forEach(slot => {
                if (!kid.equipped[slot]) {
                    kid.equipped[slot] = null;
                }
            });
            // Atribui a imagem placeholder aleatória
            kid.placeholderImg = getRandomPlaceholderImg(kid.tribe.name);
            return kid;
        });
        
        // Preenche o seletor de tribos na Tela 2
        DOM.hubSelection.filterTribe.innerHTML = '<option value="all">All Tribes</option>'; // Reseta
        Object.values(TRIBES).forEach(tribe => {
            DOM.hubSelection.filterTribe.innerHTML += `<option value="${tribe.name}">${tribe.name}</option>`;
        });
    }

    function handleConnectWallet() {
        console.log("Simulating wallet connection...");
        
        // 1. Prepara os dados (placeholders, etc)
        initializeMockWallet();
        
        // 2. Atualiza o Header
        DOM.header.tezeriumDisplay.style.visibility = 'visible';
        DOM.header.tezeriumBalance.textContent = gameState.player.tezerium;
        DOM.header.headerConnectBtn.style.display = 'none';
        DOM.header.connectionStatus.style.display = 'inline';
        
        // 3. Renderiza a próxima tela (Seleção)
        // Reseta a paginação e renderiza
        gameState.hub.pagination.currentPage = 1;
        gameState.hub.pagination.itemsPerPage = parseInt(DOM.hubSelection.filterItemsPerPage.value);
        renderHubSelectionScreen();
        
        // 4. Muda para a próxima tela
        showScreen('hub-selection-screen');
    }

    function handleDemoGame() {
        console.log("Starting Demo Mode...");
        handleConnectWallet();
        
        const demoKid = gameState.player.kidz.find(k => k.id === DEMO_KID_ID);
        if (!demoKid) {
            console.error("Demo Kid not found!");
            return;
        }
        
        gameState.hub.activeKidId = demoKid.id;
        startGameplay();
    }

    /* ==================================================================== */
    /* SEÇÃO 6: LÓGICA DA TELA 2 (HUB SELECTION) (Refatorada)
    /* ==================================================================== */

    /**
     * NOVO: Renderiza o grid de Kidz com paginação e filtros.
     */
    function renderHubSelectionScreen() {
        DOM.hubSelection.nftGrid.innerHTML = ''; // Limpa o grid
        const state = gameState.hub.pagination;
        
        // 1. Obter Filtros
        const searchTerm = DOM.hubSelection.filterSearch.value.toLowerCase();
        const tribeFilter = DOM.hubSelection.filterTribe.value;
        state.itemsPerPage = parseInt(DOM.hubSelection.filterItemsPerPage.value);

        // 2. Aplicar Filtros
        state.filteredKidz = gameState.player.kidz.filter(kid => {
            const nameMatch = kid.name.toLowerCase().includes(searchTerm);
            const idMatch = kid.id.toLowerCase().includes(searchTerm);
            const tribeMatch = (tribeFilter === 'all') || (kid.tribe.name === tribeFilter);
            return (nameMatch || idMatch) && tribeMatch;
        });
        
        // 3. Calcular Paginação
        state.totalPages = Math.ceil(state.filteredKidz.length / state.itemsPerPage);
        if (state.currentPage > state.totalPages) {
            state.currentPage = 1;
        }
        if (state.totalPages === 0) state.totalPages = 1; // Evita "Página 1 de 0"

        // 4. Obter a "fatia" da página atual
        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const kidzOnPage = state.filteredKidz.slice(startIndex, endIndex);

        // 5. Renderizar Cards
        if (kidzOnPage.length === 0) {
            DOM.hubSelection.nftGridPlaceholder.style.display = 'block';
        } else {
            DOM.hubSelection.nftGridPlaceholder.style.display = 'none';
            kidzOnPage.forEach(kid => {
                const card = document.createElement('div');
                card.className = 'nft-card panel';
                card.dataset.nftId = kid.id;
                
                card.innerHTML = `
                    <img src="${kid.placeholderImg}" alt="${kid.name}" onerror="this.src='images/kid-placeholder.png'">
                    <h4>${kid.name}</h4>
                    <p>ID: ${kid.id}</p>
                    <p>Tribe: ${kid.tribe.name}</p>
                    <button class="action-btn select-kid-btn" data-kid-id="${kid.id}">Manage & Equip</button>
                `;
                // Adiciona listener direto no botão (mais seguro)
                card.querySelector('.select-kid-btn').addEventListener('click', () => handleKidSelect(kid.id));
                DOM.hubSelection.nftGrid.appendChild(card);
            });
        }
        
        // 6. Renderizar Controles de Paginação
        renderPaginationControls();
    }

    /**
     * NOVO: Atualiza os botões e texto da paginação.
     */
    function renderPaginationControls() {
        const state = gameState.hub.pagination;
        DOM.hubSelection.paginationInfo.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
        DOM.hubSelection.paginationPrev.disabled = (state.currentPage === 1);
        DOM.hubSelection.paginationNext.disabled = (state.currentPage === state.totalPages);
    }

    /**
     * NOVO: Muda a página e re-renderiza.
     */
    function handlePageChange(direction) {
        const state = gameState.hub.pagination;
        if (direction === 'next' && state.currentPage < state.totalPages) {
            state.currentPage++;
        } else if (direction === 'prev' && state.currentPage > 1) {
            state.currentPage--;
        }
        renderHubSelectionScreen(); // Re-renderiza o grid com a nova página
    }

    function handleKidSelect(kidId) {
        console.log(`Kid ${kidId} selected.`);
        gameState.hub.activeKidId = kidId;
        
        // Reseta as abas para o padrão
        gameState.hub.tabs.activeMainTab = 'inventory';
        gameState.hub.tabs.activeInvSubTab = 'inv-equipments';
        
        renderHubPreparationScreen();
        showScreen('hub-preparation-screen');
    }

    /* ==================================================================== */
    /* SEÇÃO 7: LÓGICA DA TELA 3 (HUB PREPARATION) (Refatorada)
    /* ==================================================================== */
    
    /**
     * Renderiza TUDO na tela de preparação.
     */
    function renderHubPreparationScreen() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) {
            console.error("No active Kid selected!");
            showScreen('hub-selection-screen'); // Go back
            return;
        }

        // 1. Preenche Bloco de Informações
        DOM.hubPreparation.kidImage.innerHTML = `<img src="${kid.placeholderImg}" alt="${kid.name}" onerror="this.src='images/kid-placeholder.png'">`;
        DOM.hubPreparation.kidName.firstChild.textContent = kid.name + ' ';
        DOM.hubPreparation.kidTribe.textContent = kid.tribe.name;
        DOM.hubPreparation.kidId.textContent = kid.id;
        DOM.hubPreparation.kidExpeditions.textContent = kid.expeditions;

        // 2. Renderiza o Manequim
        renderManequim(kid);

        // 3. Calcula e Renderiza Stats
        const finalStats = calculateFinalStats(kid);
        renderPrepStats(finalStats);

        // 4. Renderiza a Aba Ativa do Workshop
        renderWorkshopTabs();
    }

    /**
     * Atualiza o DOM do Manequim de Equipamentos.
     */
    function renderManequim(kid) {
        EQUIPMENT_SLOTS.forEach(slot => {
            const slotDiv = DOM.hubPreparation.mannequin.querySelector(`.equip-slot[data-slot="${slot}"]`);
            const removeBtn = DOM.hubPreparation.mannequin.querySelector(`.equip-remove-btn[data-slot="${slot}"]`);
            const itemId = kid.equipped[slot];

            if (itemId) {
                const item = gameState.player.inventory.equipment.find(e => e.id === itemId);
                slotDiv.innerHTML = `<img src="${item.icon}" alt="${item.name}" title="${item.name}" onerror="this.style.display='none'">`;
                slotDiv.classList.add('equipped');
                removeBtn.style.display = 'block';
            } else {
                slotDiv.innerHTML = '<span>+</span>';
                slotDiv.classList.remove('equipped');
                removeBtn.style.display = 'none';
            }
        });
    }

    /**
     * Preenche o grid de stats na tela de preparação.
     */
    function renderPrepStats(stats) {
        DOM.hubPreparation.statsDisplay.innerHTML = ''; // Limpa
        STATS_LIST.forEach(stat => {
            const value = stats[stat] || 0;
            const p = document.createElement('p');
            p.innerHTML = `<strong>${stat}:</strong> ${value}`;
            DOM.hubPreparation.statsDisplay.appendChild(p);
        });
    }

    /**
     * NOVO: Gerenciador de Abas do Workshop (Nível 1 e 2)
     */
    function renderWorkshopTabs() {
        const state = gameState.hub.tabs;

        // 1. Gerencia Abas Principais (Inventory/Workshop)
        DOM.hubPreparation.mainTabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mainTab === state.activeMainTab);
        });
        
        DOM.hubPreparation.mainTabInventory.style.display = state.activeMainTab === 'inventory' ? 'block' : 'none';
        DOM.hubPreparation.mainTabWorkshop.style.display = state.activeMainTab === 'workshop' ? 'block' : 'none';
        
        if (state.activeMainTab === 'inventory') {
            // 2. Gerencia Sub-Abas do Inventory
            DOM.hubPreparation.mainTabInventory.querySelectorAll('.sub-tabs .tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.subTab === state.activeInvSubTab);
            });
            DOM.hubPreparation.mainTabInventory.querySelectorAll('.sub-tab-content').forEach(content => {
                content.style.display = content.id === `sub-tab-${state.activeInvSubTab}` ? 'block' : 'none';
            });
            // 3. Renderiza o conteúdo da sub-aba ativa
            if (state.activeInvSubTab === 'inv-equipments') renderInvEquipments();
            if (state.activeInvSubTab === 'inv-components') renderInvComponents();
            if (state.activeInvSubTab === 'inv-materials') renderInvMaterials();

        } else if (state.activeMainTab === 'workshop') {
            // 2. Gerencia Sub-Abas do Workshop
            DOM.hubPreparation.mainTabWorkshop.querySelectorAll('.sub-tabs .tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.subTab === state.activeWsSubTab);
            });
            DOM.hubPreparation.mainTabWorkshop.querySelectorAll('.sub-tab-content').forEach(content => {
                content.style.display = content.id === `sub-tab-${state.activeWsSubTab}` ? 'block' : 'none';
            });
            // 3. Renderiza o conteúdo da sub-aba ativa
            if (state.activeWsSubTab === 'ws-refine') renderWsRefine();
            if (state.activeWsSubTab === 'ws-craft') renderWsCraft();
            if (state.activeWsSubTab === 'ws-embed') renderWsEmbed();
        }
    }
    
    // --- Novas Funções de Renderização das Sub-Abas ---
    
    function renderInvEquipments() {
        const content = document.getElementById('sub-tab-inv-equipments');
        content.innerHTML = '<h4>Your Equipment</h4><p>Full list of equipment with image, title, stats, category, and level...</p>';
        // TODO: Implementar lista
    }
    function renderInvComponents() {
        const content = document.getElementById('sub-tab-inv-components');
        content.innerHTML = '<h4>Your Components</h4><p>List of components with image and info...</p>';
        // TODO: Implementar lista
    }
    function renderInvMaterials() {
        const tbody = DOM.hubPreparation.materialsTableBody;
        tbody.innerHTML = ''; // Limpa
        for (const matId in gameState.player.inventory.materials) {
            const material = MATERIALS[matId];
            const quantity = gameState.player.inventory.materials[matId];
            if (material) {
                tbody.innerHTML += `
                    <tr>
                        <td><img src="${material.icon}" alt="${material.name}" onerror="this.style.display='none'"></td>
                        <td>${material.name}</td>
                        <td>${quantity}</td>
                    </tr>
                `;
            }
        }
    }
    function renderWsRefine() {
        // Apenas visual por enquanto
    }
    function renderWsCraft() {
        // Apenas visual por enquanto
        DOM.hubPreparation.craftRecipeList.innerHTML = '';
        DOM.hubPreparation.craftRecipeDetails.innerHTML = '<p>Select a recipe from the left to see details.</p>';
        
        Object.keys(RECIPES_CRAFT).forEach(recipeId => {
            const recipe = RECIPES_CRAFT[recipeId];
            DOM.hubPreparation.craftRecipeList.innerHTML += `<div class="recipe-item" data-recipe-id="${recipeId}">${recipe.name}</div>`;
        });
    }
    function renderWsEmbed() {
        // Apenas visual por enquanto
        DOM.hubPreparation.embedBtn.disabled = !(gameState.hub.embed.slotGear && gameState.hub.embed.slotComponent);
    }
    
    // --- Funções de Ação do Hub (Modais) ---
    let currentSlotToEquip = null;
    function openEquipmentModal(slotName) {
        currentSlotToEquip = slotName;
        DOM.modals.equipTitle.textContent = `Select ${slotName}`;
        DOM.modals.equipList.innerHTML = '';

        const itemsForSlot = gameState.player.inventory.equipment.filter(item => item.slot === slotName);

        if (itemsForSlot.length === 0) {
            DOM.modals.equipList.innerHTML = '<p>No items found for this slot.</p>';
        } else {
            itemsForSlot.forEach(item => {
                const statsHtml = Object.entries(item.stats).map(([stat, value]) => `<p class="item-stats">${stat}: +${value}</p>`).join('');
                const itemDiv = document.createElement('div');
                itemDiv.className = 'equip-list-item';
                itemDiv.dataset.itemId = item.id;
                itemDiv.innerHTML = `
                    <h4>${item.name} (Lvl ${item.level})</h4>
                    ${statsHtml}
                `;
                itemDiv.addEventListener('click', () => equipItem(item.id, slotName));
                DOM.modals.equipList.appendChild(itemDiv);
            });
        }
        DOM.modals.equipSelect.style.display = 'flex';
    }

    function closeEquipmentModal() {
        DOM.modals.equipSelect.style.display = 'none';
    }

    function equipItem(itemId, slotName) {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        kid.equipped[slotName] = itemId;
        renderHubPreparationScreen(); 
        closeEquipmentModal();
    }

    function unequipItem(slotName) {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        kid.equipped[slotName] = null;
        renderHubPreparationScreen();
    }
    
    function openEditNameModal() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        DOM.modals.editNameInput.value = kid.name;
        DOM.modals.editName.style.display = 'flex';
    }

    function closeEditNameModal() {
        DOM.modals.editName.style.display = 'none';
    }
    
    function saveEditName() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        const newName = DOM.modals.editNameInput.value;
        if (newName && newName.trim() !== "") {
            kid.name = newName;
            renderHubPreparationScreen(); 
            closeEditNameModal();
        }
    }
    
    function openEmbedConfirmModal() {
        // TODO: Adicionar lógica "Antes/Depois"
        DOM.modals.embedBefore.innerHTML = "<h4>Before</h4><p>...</p>";
        DOM.modals.embedAfter.innerHTML = "<h4>After</h4><p>...</p>";
        DOM.modals.embedConfirm.style.display = 'flex';
    }
    function closeEmbedConfirmModal() {
        DOM.modals.embedConfirm.style.display = 'none';
    }

    /* ==================================================================== */
    /* SEÇÃO 8: LÓGICA DA TELA 4 (GAME SCREEN)
    /* ==================================================================== */

    function startGameplay() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) {
            alert("Error: No Kid selected!");
            return;
        }

        gameState.expedition.kid = JSON.parse(JSON.stringify(kid));
        gameState.expedition.stats = calculateFinalStats(kid);
        const stats = gameState.expedition.stats;

        gameState.expedition.currentDay = 1;
        gameState.expedition.playerPos = getSpawnPoint(kid.tribe.biome);
        gameState.expedition.currentHP = stats.hp;
        gameState.expedition.currentAP = stats.ap;
        gameState.expedition.maxAP = stats.ap;
        gameState.expedition.currentMP = stats.speed;
        gameState.expedition.maxMP = stats.speed;
        gameState.expedition.resourcesFound = {};
        gameState.expedition.revealedHexes.clear();

        DOM.game.log.innerHTML = ''; 
        logMessage(`--- DAY 1 START ---`, 'day');
        renderGameStatusPanel();
        renderStaticHexMap(); 
        revealAdjacentHexes(gameState.expedition.playerPos);
        updateFogOfWar();
        updatePlayerHexPosition();
        
        showScreen('game-screen');
    }

    function renderGameStatusPanel() {
        const kid = gameState.expedition.kid;
        const stats = gameState.expedition.stats;
        const hpPercent = (gameState.expedition.currentHP / stats.hp) * 100;

        DOM.game.kidImage.innerHTML = `<img src="${kid.placeholderImg}" alt="${kid.name}" onerror="this.src='images/kid-placeholder.png'">`;
        DOM.game.kidTribe.textContent = kid.tribe.name;
        DOM.game.kidId.textContent = kid.id;

        DOM.game.hpBarFill.style.width = `${hpPercent}%`;
        DOM.game.hpBarText.textContent = `${gameState.expedition.currentHP} / ${stats.hp}`;
        DOM.game.statsDisplay.innerHTML = STATS_LIST.map(stat => 
            `<p><strong>${stat}:</strong> ${stats[stat] || 0}</p>`
        ).join('');

        DOM.game.resourceList.innerHTML = '';
        let found = 0;
        for (const resId in gameState.expedition.resourcesFound) {
            const amount = gameState.expedition.resourcesFound[resId];
            if (amount > 0 && MATERIALS[resId]) {
                DOM.game.resourceList.innerHTML += `<li>${MATERIALS[resId].name}: <span>${amount}</span></li>`;
                found++;
            }
        }
        if (found === 0) {
            DOM.game.resourceList.innerHTML = '<li>No resources found yet.</li>';
        }

        DOM.game.turnCounter.textContent = gameState.expedition.currentDay;
        DOM.game.apDisplay.textContent = gameState.expedition.currentAP;
        DOM.game.maxApDisplay.textContent = gameState.expedition.maxAP;
        DOM.game.mpDisplay.textContent = gameState.expedition.currentMP;
        DOM.game.maxMpDisplay.textContent = gameState.expedition.maxMP;

        const inCombat = gameState.combat.isActive;
        DOM.game.collectBtn.disabled = (gameState.expedition.currentAP < 1) || inCombat;
        DOM.game.investigateBtn.disabled = (gameState.expedition.currentAP < 1) || inCombat;
        DOM.game.searchEnemyBtn.disabled = (gameState.expedition.currentAP < 2) || inCombat;
        DOM.game.endTurnBtn.disabled = inCombat;
        DOM.game.exitExpeditionBtn.disabled = inCombat;
    }

    function renderStaticHexMap() {
        DOM.game.mapContent.innerHTML = '';
        
        const hexWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-size')) * 2;
        const hexHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-height')) * 2;
        
        // Calcula as dimensões mínimas e máximas do mapa (para determinar o centro)
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        const positions = [];
        
        STATIC_MAP_DATA.forEach((cell, key) => {
            const [q, r] = key.split(',').map(Number);
            const pixel = axialToPixel(q, r);
            
            positions.push({ pixel, cell, q, r, key });
            
            // Determina as fronteiras do mapa
            minX = Math.min(minX, pixel.x);
            minY = Math.min(minY, pixel.y);
            maxX = Math.max(maxX, pixel.x);
            maxY = Math.max(maxY, pixel.y);
        });
    
        // Calcula o centro de todos os hexágonos
        const mapCenterCorrectionX = (maxX + minX) / 2;
        const mapCenterCorrectionY = (maxY + minY) / 2;
    
        // Ajuste: Centralizamos o mapa e garantimos que o container acomode
        positions.forEach(({ pixel, cell, q, r, key }) => {
            
            // Centraliza o mapa dentro do contentor (map-content)
            const leftPos = pixel.x - mapCenterCorrectionX;
            const topPos = pixel.y - mapCenterCorrectionY;
    
            const cellDiv = document.createElement('div');
            cellDiv.className = 'hex-cell';
            
            // Posição ajustada, subtraindo metade da largura/altura do hex para centralizar o DIV
            cellDiv.style.left = `${leftPos - (hexWidth / 2)}px`;
            cellDiv.style.top = `${topPos - (hexHeight / 2)}px`;
            
            cellDiv.dataset.q = q;
            cellDiv.dataset.r = r;
            cellDiv.dataset.key = key;
            cellDiv.dataset.biome = cell.biome;
            
            cellDiv.addEventListener('click', () => handleHexMoveAttempt(q, r));
            
            DOM.game.mapContent.appendChild(cellDiv);
        });
        
        // NOVO: Centraliza o mapa inteiro dentro do container
        // O mapa-content agora tem a largura e altura necessárias.
        const finalMapWidth = maxX - minX + hexWidth;
        const finalMapHeight = maxY - minY + hexHeight;
    
        DOM.game.mapContent.style.width = `${finalMapWidth}px`;
        DOM.game.mapContent.style.height = `${finalMapHeight}px`;
    
        // Remove o overflow/interação de Pan/Zoom (pois queremos que ele seja estático)
        DOM.game.mapContainer.style.overflow = 'hidden'; 
    }

    function updateFogOfWar() {
        const hexes = DOM.game.mapContent.querySelectorAll('.hex-cell');
        hexes.forEach(hex => {
            const key = hex.dataset.key;
            if (gameState.expedition.revealedHexes.has(key)) {
                hex.classList.remove('fog-of-war');
                hex.classList.add(hex.dataset.biome); 
            } else {
                hex.classList.add('fog-of-war');
                hex.classList.remove(hex.dataset.biome);
            }
        });
    }

    function revealAdjacentHexes({ q, r }) {
        const neighbors = [
            [q, r], [q + 1, r], [q - 1, r],
            [q, r + 1], [q, r - 1],
            [q + 1, r - 1], [q - 1, r + 1]
        ];
        neighbors.forEach(([nq, nr]) => {
            const key = `${nq},${nr}`;
            if (STATIC_MAP_DATA.has(key)) {
                gameState.expedition.revealedHexes.add(key);
            }
        });
    }

    function updatePlayerHexPosition() {
        const { q, r } = gameState.expedition.playerPos;
        const key = `${q},${r}`;
        DOM.game.mapContent.querySelectorAll('.hex-kid').forEach(hex => hex.classList.remove('hex-kid'));
        const playerHex = DOM.game.mapContent.querySelector(`.hex-cell[data-key="${key}"]`);
        if (playerHex) {
            playerHex.classList.add('hex-kid');
        }
    }

    function handleHexMoveAttempt(q, r) {
        if (gameState.combat.isActive) return;
        const { q: playerQ, r: playerR } = gameState.expedition.playerPos;
        const distance = axialDistance(playerQ, playerR, q, r);
        
        if (distance === 1) { 
            if (gameState.expedition.currentMP < 1) {
                logMessage("Out of Movement Points (MP)!", 'error');
                return;
            }
            gameState.expedition.currentMP--;
            gameState.expedition.playerPos = { q, r };
            
            logMessage(`Moved to [${q},${r}]. MP remaining: ${gameState.expedition.currentMP}`);
            
            revealAdjacentHexes({ q, r });
            updateFogOfWar();
            updatePlayerHexPosition();
            renderGameStatusPanel(); 
        }
    }

    function handleCollect() {
        gameState.expedition.currentAP--;
        const luck = gameState.expedition.stats.luck / 100;
        let amount = Math.ceil((Math.floor(Math.random() * 3) + 1) * (1 + luck));
        const biome = STATIC_MAP_DATA.get(`${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`).biome;
        const resourceId = BIOMES[biome].resource;
        
        if (!gameState.expedition.resourcesFound[resourceId]) {
            gameState.expedition.resourcesFound[resourceId] = 0;
        }
        gameState.expedition.resourcesFound[resourceId] += amount;

        logMessage(`Collected ${amount}x ${MATERIALS[resourceId].name}!`, 'reward');
        showActionFeedback("Collection Succeeded!", `You found ${amount}x ${MATERIALS[resourceId].name}`);
        renderGameStatusPanel();
    }

    function handleInvestigate() {
        gameState.expedition.currentAP--;
        const luck = gameState.expedition.stats.luck;
        const roll = Math.random() * 100;

        if (roll < (10 + luck)) { 
            logMessage("You found a secret stash!", 'reward');
            showActionFeedback("Success!", `You found a secret stash! (+10 Scrap)`);
            if (!gameState.expedition.resourcesFound.scrap) gameState.expedition.resourcesFound.scrap = 0;
            gameState.expedition.resourcesFound.scrap += 10;
        } else if (roll < (30 + luck)) { 
             logMessage("It's an ambush!", 'combat');
             showActionFeedback("Ambush!", `A Drone appeared!`);
             startCombat(ENEMIES.DRONE);
        } else {
            logMessage("Investigation revealed nothing.");
            showActionFeedback("Nothing Found", `You found nothing of interest.`);
        }
        renderGameStatusPanel();
    }
    
    function handleSearchEnemy() {
        gameState.expedition.currentAP -= 2;
        logMessage("Searching for trouble...", 'combat');
        showActionFeedback("Searching...", `A Mutant appeared!`);
        startCombat(ENEMIES.MUTANT);
        renderGameStatusPanel();
    }
    
    function showActionFeedback(title, description) {
        if (DOM.game.skipAnimationsCheck.checked) return;
        DOM.modals.feedbackTitle.textContent = title;
        DOM.modals.feedbackDesc.textContent = description;
        DOM.modals.feedback.style.display = 'flex';
        setTimeout(() => {
            DOM.modals.feedback.style.display = 'none';
        }, 3000); // 3 seconds
    }

    function endDay() {
        if (gameState.expedition.currentDay >= MAX_DAYS) {
            logMessage("Expedition finished (10 days).", 'day');
            gameOver(true); // Success
            return;
        }
        
        gameState.expedition.currentDay++;
        gameState.expedition.currentAP = gameState.expedition.stats.ap;
        gameState.expedition.currentMP = gameState.expedition.stats.speed;
        
        gameState.expedition.currentHP += gameState.expedition.stats.hpRegen;
        if (gameState.expedition.currentHP > gameState.expedition.stats.hp) {
            gameState.expedition.currentHP = gameState.expedition.stats.hp;
        }
        
        logMessage(`--- DAY ${gameState.expedition.currentDay} START ---`, 'day');
        renderGameStatusPanel();
    }

    function gameOver(isSuccess) {
        if (isSuccess) {
            for (const resId in gameState.expedition.resourcesFound) {
                if (!gameState.player.inventory.materials[resId]) {
                    gameState.player.inventory.materials[resId] = 0;
                }
                gameState.player.inventory.materials[resId] += gameState.expedition.resourcesFound[resId];
            }
            const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
            if (kid) kid.expeditions++;
            
            alert("Expedition Successful! Resources transferred to Hub.");
        } else {
            alert("Expedition Failed! All resources found were lost.");
        }
        
        renderHubPreparationScreen(); 
        showScreen('hub-preparation-screen');
    }

    /* ==================================================================== */
    /* SEÇÃO 9: LÓGICA DA TELA 5 (COMBAT MODAL)
    /* ==================================================================== */

    function combatLog(message) {
        const p = document.createElement('p');
        p.textContent = message;
        DOM.modals.combatLog.prepend(p);
    }
    
    function startCombat(enemy) {
        gameState.combat.isActive = true;
        gameState.combat.enemy = { ...enemy, currentHp: enemy.hp }; 
        const playerStats = gameState.expedition.stats;
        
        DOM.modals.combatEnemyName.textContent = enemy.name;
        DOM.modals.combatEnemy.querySelector('img').src = enemy.sprite;
        
        gameState.combat.playerTurn = playerStats.speed >= enemy.speed;
        updateCombatUI();
        
        DOM.modals.combatPhaseBattle.style.display = 'block';
        DOM.modals.combatPhaseVictory.style.display = 'none';
        DOM.modals.combatPhaseDefeat.style.display = 'none';
        DOM.modals.combatLog.innerHTML = '';
        
        DOM.modals.combat.style.display = 'flex';
        renderGameStatusPanel(); 

        if (!gameState.combat.playerTurn) {
            combatLog(`${enemy.name} attacks first!`);
            DOM.modals.combatAttackBtn.disabled = true;
            DOM.modals.combatFleeBtn.disabled = true;
            setTimeout(runEnemyTurn, 1000);
        } else {
            combatLog("Your turn!");
            DOM.modals.combatAttackBtn.disabled = false;
            DOM.modals.combatFleeBtn.disabled = false;
        }
    }

    function updateCombatUI() {
        const playerHPPercent = (gameState.expedition.currentHP / gameState.expedition.stats.hp) * 100;
        DOM.modals.combatPlayerHpFill.style.width = `${playerHPPercent}%`;
        DOM.modals.combatPlayerHpText.textContent = `${gameState.expedition.currentHP} / ${gameState.expedition.stats.hp}`;
        
        const enemy = gameState.combat.enemy;
        const enemyHPPercent = (enemy.currentHp / enemy.hp) * 100;
        DOM.modals.combatEnemyHpFill.style.width = `${enemyHPPercent}%`;
        DOM.modals.combatEnemyHpText.textContent = `${enemy.currentHp} / ${enemy.hp}`;
    }
    
    function handleCombatAttack() {
        if (!gameState.combat.playerTurn) return;
        
        const playerStats = gameState.expedition.stats;
        const enemy = gameState.combat.enemy;
        
        let damage = Math.max(1, playerStats.damage - (enemy.defense || 0));
        enemy.currentHp -= damage;
        combatLog(`You attack ${enemy.name} for ${damage} damage.`);
        
        DOM.modals.combatEnemy.classList.add('hit');
        setTimeout(() => DOM.modals.combatEnemy.classList.remove('hit'), 300);
        updateCombatUI();

        if (enemy.currentHp <= 0) {
            endCombat(true);
            return;
        }

        gameState.combat.playerTurn = false;
        DOM.modals.combatAttackBtn.disabled = true;
        DOM.modals.combatFleeBtn.disabled = true;
        setTimeout(runEnemyTurn, 1000);
    }
    
    function runEnemyTurn() {
        if (gameState.combat.playerTurn) return;
        
        const playerStats = gameState.expedition.stats;
        const enemy = gameState.combat.enemy;
        
        let damage = Math.max(1, enemy.strength - (playerStats.defense || 0));
        gameState.expedition.currentHP -= damage;
        combatLog(`${enemy.name} attacks you for ${damage} damage.`);
        
        DOM.modals.combatPlayer.classList.add('hit');
        setTimeout(() => DOM.modals.combatPlayer.classList.remove('hit'), 300);
        
        updateCombatUI();
        renderGameStatusPanel(); 

        if (gameState.expedition.currentHP <= 0) {
            endCombat(false);
            return;
        }

        gameState.combat.playerTurn = true;
        DOM.modals.combatAttackBtn.disabled = false;
        DOM.modals.combatFleeBtn.disabled = false;
        combatLog("Your turn!");
    }

    function handleCombatFlee() {
        if (!gameState.combat.playerTurn) return;
        
        const luck = gameState.expedition.stats.luck;
        if (Math.random() * 100 < (50 + luck)) { 
            combatLog("You successfully fled!");
            logMessage("Fled from combat.", 'action');
            closeCombatModal();
        } else {
            combatLog("Flee attempt failed!");
            gameState.combat.playerTurn = false;
            DOM.modals.combatAttackBtn.disabled = true;
            DOM.modals.combatFleeBtn.disabled = true;
            setTimeout(runEnemyTurn, 1000);
        }
    }

    function endCombat(isVictory) {
        DOM.modals.combatPhaseBattle.style.display = 'none';
        
        if (isVictory) {
            const enemy = gameState.combat.enemy;
            DOM.modals.victoryEnemyName.textContent = enemy.name;
            DOM.modals.victoryRewardList.innerHTML = '';
            
            for (const resId in enemy.rewards) {
                const amount = enemy.rewards[resId];
                if (!gameState.expedition.resourcesFound[resId]) {
                    gameState.expedition.resourcesFound[resId] = 0;
                }
                gameState.expedition.resourcesFound[resId] += amount;
                DOM.modals.victoryRewardList.innerHTML += `<li>${amount}x ${MATERIALS[resId].name}</li>`;
            }
            logMessage(`Victory! Defeated ${enemy.name}.`, 'reward');
            DOM.modals.combatPhaseVictory.style.display = 'block';
        } else {
            logMessage(`Defeated! Expedition Failed.`, 'error');
            DOM.modals.combatPhaseDefeat.style.display = 'block';
        }
    }
    
    function closeCombatModal() {
        gameState.combat.isActive = false;
        DOM.modals.combat.style.display = 'none';
        renderGameStatusPanel(); // Re-enable map buttons
    }


    /* ==================================================================== */
    /* SEÇÃO 10: INICIALIZAÇÃO E LISTENERS DE EVENTOS (Refatorada)
    /* ==================================================================== */
    function initialize() {
        console.log("CyberKidz Expedition v3.0 Initialized.");

        // --- Tela 1 ---
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);
        
        // --- Tela 2 (Paginação e Filtros) ---
        DOM.hubSelection.filterSearch.addEventListener('input', renderHubSelectionScreen);
        DOM.hubSelection.filterTribe.addEventListener('change', renderHubSelectionScreen);
        DOM.hubSelection.filterItemsPerPage.addEventListener('change', () => {
            gameState.hub.pagination.currentPage = 1; // Reseta a página
            renderHubSelectionScreen();
        });
        DOM.hubSelection.filterResetBtn.addEventListener('click', () => {
            DOM.hubSelection.filterSearch.value = '';
            DOM.hubSelection.filterTribe.value = 'all';
            DOM.hubSelection.filterItemsPerPage.value = '10';
            gameState.hub.pagination.currentPage = 1;
            renderHubSelectionScreen();
        });
        DOM.hubSelection.paginationPrev.addEventListener('click', () => handlePageChange('prev'));
        DOM.hubSelection.paginationNext.addEventListener('click', () => handlePageChange('next'));

        // --- Tela 3 (Abas e Manequim) ---
        DOM.hubPreparation.backToSelectionBtn.addEventListener('click', () => showScreen('hub-selection-screen'));
        DOM.hubPreparation.startExpeditionBtn.addEventListener('click', startGameplay);
        
        // Listeners do Manequim (Delegação)
        DOM.hubPreparation.mannequin.addEventListener('click', (e) => {
            if (e.target.closest('.equip-slot')) {
                const slotDiv = e.target.closest('.equip-slot');
                if (!slotDiv.classList.contains('equipped')) {
                    openEquipmentModal(slotDiv.dataset.slot);
                }
            } else if (e.target.closest('.equip-remove-btn')) {
                const removeBtn = e.target.closest('.equip-remove-btn');
                unequipItem(removeBtn.dataset.slot);
            }
        });
        
        // Listeners do Workshop (Delegação de Abas)
        DOM.hubPreparation.workshopPanel.addEventListener('click', (e) => {
            const mainTabBtn = e.target.closest('.tab-btn[data-main-tab]');
            const subTabBtn = e.target.closest('.tab-btn[data-sub-tab]');

            if (mainTabBtn) {
                gameState.hub.tabs.activeMainTab = mainTabBtn.dataset.mainTab;
                renderWorkshopTabs();
            } else if (subTabBtn) {
                const newSubTab = subTabBtn.dataset.subTab;
                if (newSubTab.startsWith('inv-')) {
                    gameState.hub.tabs.activeInvSubTab = newSubTab;
                } else if (newSubTab.startsWith('ws-')) {
                    gameState.hub.tabs.activeWsSubTab = newSubTab;
                }
                renderWorkshopTabs();
            }
        });
        
        // --- Tela 4 ---
        DOM.game.exitExpeditionBtn.addEventListener('click', () => gameOver(true));
        DOM.game.collectBtn.addEventListener('click', handleCollect);
        DOM.game.investigateBtn.addEventListener('click', handleInvestigate);
        DOM.game.searchEnemyBtn.addEventListener('click', handleSearchEnemy);
        DOM.game.endTurnBtn.addEventListener('click', endDay);

        // --- Modais ---
        DOM.modals.equipCloseBtn.addEventListener('click', closeEquipmentModal);
        DOM.hubPreparation.editNameBtn.addEventListener('click', openEditNameModal);
        DOM.modals.editNameCancel.addEventListener('click', closeEditNameModal);
        DOM.modals.editNameSave.addEventListener('click', saveEditName);
        
        // Modal de Embed
        DOM.hubPreparation.embedBtn.addEventListener('click', openEmbedConfirmModal);
        DOM.modals.embedCancelBtn.addEventListener('click', closeEmbedConfirmModal);
        DOM.modals.embedConfirmBtn.addEventListener('click', () => {
            // TODO: Adicionar lógica real de Embed
            console.log("Embedding confirmed (simulated)!");
            closeEmbedConfirmModal();
        });

        // Modal de Combate
        DOM.modals.combatAttackBtn.addEventListener('click', handleCombatAttack);
        DOM.modals.combatFleeBtn.addEventListener('click', handleCombatFlee);
        DOM.modals.combatCloseVictoryBtn.addEventListener('click', closeCombatModal);
        DOM.modals.combatReturnHubBtn.addEventListener('click', () => {
            DOM.modals.combat.style.display = 'none';
            gameOver(false);
        });

        // Inicia na Tela 1
        showScreen('logged-out-screen');
    }

    // Inicia o jogo!
    initialize();
});
