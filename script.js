/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 4.0 (Image Map / Correção de Visualização)
// ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================================================================== */
    /* SEÇÃO 1: BANCO DE DADOS E CONSTANTES (Simulados)
    /* ==================================================================== */

    const MAX_DAYS = 10;
    const MAX_PLACEHOLDER_IMAGES_PER_TRIBE = 5;
    const HEX_SIZE_VISUAL = 50; // Raio visual para cálculo do polígono (deve ser ajustado se a imagem mudar)

    // --- 1.1: Atributos Base das Tribos ---
    const TRIBES = {
        VOLCANICS: { name: "Volcanics", biome: "volcanics", baseStats: { damage: 4, critDamage: 5, defense: 3, blockChance: 3, critChance: 2, speed: 15, attackSpeed: 1, hpRegen: 1, ap: 5, hp: 110, luck: 1 } },
        UNDERGROUNDERS: { name: "Undergrounders", biome: "undergrounders", baseStats: { damage: 2, critDamage: 2, defense: 5, blockChance: 5, critChance: 1, speed: 15, attackSpeed: 2, hpRegen: 2, ap: 6, hp: 120, luck: 2 } },
        NOCTURNALS: { name: "Nocturnals", biome: "nocturnals", baseStats: { damage: 3, critDamage: 3, defense: 2, blockChance: 1, critChance: 5, speed: 15, attackSpeed: 4, hpRegen: 1, ap: 6, hp: 100, luck: 3 } },
        RADIOACTIVES: { name: "Radioactives", biome: "radioactives", baseStats: { damage: 2, critDamage: 2, defense: 1, blockChance: 1, critChance: 3, speed: 20, attackSpeed: 5, hpRegen: 1, ap: 7, hp: 80, luck: 5 } },
        REPTILIANS: { name: "Reptilians", biome: "reptilians", baseStats: { damage: 3, critDamage: 2, defense: 3, blockChance: 2, critChance: 2, speed: 13, attackSpeed: 2, hpRegen: 5, ap: 5, hp: 100, luck: 2 } }
    };

    // --- 1.2: Biomas ---
    const BIOMES = {
        volcanics: { name: "Burning Ridge", resource: "scrap" }, reptilians: { name: "Covenant Swamp", resource: "food" },
        radioactives: { name: "Lake Rancid", resource: "food" }, nocturnals: { name: "Ancient Ruins", resource: "scrap" },
        undergrounders: { name: "Abandoned Mines", resource: "water" }, wasteland: { name: "Wasteland", resource: "scrap" }
    };
    
    // --- 1.3: Inimigos ---
    const ENEMIES = {
        DRONE: { id: "drone", name: "CKC Drone", strength: 5, hp: 15, speed: 10, sprite: "images/drone-sprite.png", rewards: { scrap: 5, metal: 1 } },
        MUTANT: { id: "mutant", name: "Wasteland Mutant", strength: 8, hp: 25, speed: 5, sprite: "images/mutant-sprite.png", rewards: { scrap: 10, food: 3 } }
    };
    
    // --- 1.4: Banco de Dados de Crafting ---
    const MATERIALS = { scrap: { name: "Scrap", icon: "images/icon_scrap.png" }, water: { name: "Clean Water", icon: "images/icon_water.png" }, food: { name: "Food", icon: "images/icon_food.png" }, metal: { name: "Metal", icon: "images/icon_metal.png" } };
    const COMPONENTS = { volcanic_core: { name: "Volcanic Core", stats: { damage: 5 }, icon: "images/icon_component.png" }, defense_plate: { name: "Defense Plate", stats: { defense: 5 }, icon: "images/icon_component.png" } };
    const RECIPES_CRAFT = {
        empty_helmet: { name: "Rustic Helmet (Empty)", cost: { scrap: 8 }, type: "equipment", level: 1, stats: {}, slot: "helmet", icon: "images/icon_helmet.png" },
        empty_weapon: { name: "Rustic Blade (Empty)", cost: { scrap: 10 }, type: "equipment", level: 1, stats: {}, slot: "weapon", icon: "images/icon_weapon.png" }
    };
    const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
    const STATS_LIST = ['hp', 'ap', 'speed', 'damage', 'defense', 'critChance', 'critDamage', 'attackSpeed', 'hpRegen', 'blockChance', 'luck'];

    // --- 1.5: Definição do Mapa Estático (Coordenadas Fixas) ---
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

    // --- 1.6: Carteira Simulada ---
    const MOCK_WALLET = [
        { id: '#313', name: 'Blue Mutant', tribe: TRIBES.RADIOACTIVES, expeditions: 5, equipped: { helmet: 'h1', weapon: 'w1', accessory: null, armor: null, gloves: null, implant: null, boots: null } },
        { id: '#222', name: 'Demo Nocturnal', tribe: TRIBES.NOCTURNALS, expeditions: 2, equipped: { helmet: null, weapon: null, accessory: null, armor: null, gloves: null, implant: null, boots: null } },
        { id: '#111', name: 'Demo Volcanic', tribe: TRIBES.VOLCANICS, expeditions: 10, equipped: { helmet: null, weapon: 'w1', accessory: null, armor: null, gloves: null, implant: null, boots: null } },
        { id: '#444', name: 'Swamp Kid', tribe: TRIBES.REPTILIANS, expeditions: 0, equipped: {} },
        { id: '#555', name: 'Miner', tribe: TRIBES.UNDERGROUNDERS, expeditions: 1, equipped: {} },
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
    const DEMO_KID_ID = '#313';

    /* ==================================================================== */
    /* SEÇÃO 2: MASTER STATE (gameState)
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
            kidz: []
        },
        hub: {
            activeKidId: null, 
            pagination: {
                currentPage: 1, itemsPerPage: 10, totalPages: 1, filteredKidz: []
            },
            tabs: { activeMainTab: 'inventory', activeInvSubTab: 'inv-equipments', activeWsSubTab: 'ws-refine' },
            embed: { slotGear: null, slotComponent: null }
        },
        expedition: {
            kid: null, stats: {}, currentDay: 1, playerPos: { q: 0, r: 0 },
            currentHP: 100, currentAP: 0, maxAP: 0, currentMP: 0, maxMP: 0,
            resourcesFound: {}, revealedHexes: new Set()
        },
        combat: {
            isActive: false, enemy: null, playerTurn: true, isAutoAttack: false
        }
    };

    /* ==================================================================== */
    /* SEÇÃO 3: CACHE DE ELEMENTOS DO DOM
    /* ==================================================================== */

    const DOM = {
        header: {
            tezeriumDisplay: document.getElementById('tezerium-display'), tezeriumBalance: document.getElementById('tezerium-balance'),
            walletStatus: document.getElementById('wallet-status'), headerConnectBtn: document.getElementById('header-connect-btn'),
            connectionStatus: document.getElementById('connection-status')
        },
        screens: {
            'logged-out-screen': document.getElementById('logged-out-screen'), 'hub-selection-screen': document.getElementById('hub-selection-screen'),
            'hub-preparation-screen': document.getElementById('hub-preparation-screen'), 'game-screen': document.getElementById('game-screen')
        },
        loggedOut: { bodyConnectBtn: document.getElementById('body-connect-btn'), demoGameBtn: document.getElementById('demo-game-btn') },
        hubSelection: {
            filterSearch: document.getElementById('filter-search'), filterTribe: document.getElementById('filter-tribe'), filterItemsPerPage: document.getElementById('filter-items-per-page'),
            filterResetBtn: document.getElementById('filter-reset-btn'), nftGrid: document.getElementById('nft-selection-grid'),
            nftGridPlaceholder: document.getElementById('nft-grid-placeholder'), paginationControls: document.getElementById('pagination-controls'),
            paginationPrev: document.getElementById('pagination-prev'), paginationInfo: document.getElementById('pagination-info'), paginationNext: document.getElementById('pagination-next')
        },
        hubPreparation: {
            backToSelectionBtn: document.getElementById('back-to-selection-btn'), startExpeditionBtn: document.getElementById('start-expedition-btn'),
            kidImage: document.getElementById('prep-kid-image'), kidName: document.getElementById('prep-kid-name-display'), editNameBtn: document.getElementById('edit-name-btn'),
            kidTribe: document.getElementById('prep-kid-tribe'), kidId: document.getElementById('prep-kid-id'), kidExpeditions: document.getElementById('prep-kid-expeditions'),
            mannequin: document.querySelector('.equipment-mannequin'), statsDisplay: document.getElementById('prep-stats-display'),
            workshopPanel: document.getElementById('workshop-panel'), mainTabs: document.querySelector('.main-tabs'), mainTabInventory: document.getElementById('main-tab-inventory'),
            mainTabWorkshop: document.getElementById('main-tab-workshop'), materialsTableBody: document.getElementById('materials-table-body'),
            craftRecipeList: document.getElementById('craft-recipe-list'), craftRecipeDetails: document.getElementById('craft-recipe-details'),
            embedSlotGear: document.getElementById('embed-slot-gear'), embedSlotComponent: document.getElementById('embed-slot-component'), embedBtn: document.getElementById('embed-btn')
        },
        game: {
            kidImage: document.getElementById('game-kid-image'), kidTribe: document.getElementById('game-kid-tribe'), kidId: document.getElementById('game-kid-id'),
            hpBarFill: document.getElementById('game-hp-bar-fill'), hpBarText: document.getElementById('game-hp-bar-text'), statsDisplay: document.getElementById('game-stats-display'),
            resourceList: document.getElementById('game-resource-list'), exitExpeditionBtn: document.getElementById('exit-expedition-btn'), turnCounter: document.getElementById('turn-counter'),
            mapContainer: document.getElementById('game-map-container'), mapImage: document.getElementById('map-image'), mapAreas: document.getElementById('map-areas'), // Novos IDs
            fogOverlay: document.getElementById('fog-of-war-overlay'), // Novo ID
            apDisplay: document.getElementById('game-kid-ap'), maxApDisplay: document.getElementById('game-kid-max-ap'), mpDisplay: document.getElementById('game-kid-mp'),
            maxMpDisplay: document.getElementById('game-kid-max-mp'), collectBtn: document.getElementById('collect-btn'), investigateBtn: document.getElementById('investigate-btn'),
            searchEnemyBtn: document.getElementById('search-enemy-btn'), endTurnBtn: document.getElementById('end-turn-btn'), skipAnimationsCheck: document.getElementById('skip-animations-check'),
            log: document.getElementById('game-log')
        },
        modals: {
            equipSelect: document.getElementById('equipment-select-modal'), equipTitle: document.getElementById('modal-equip-title'), equipList: document.getElementById('modal-equip-list'),
            equipCloseBtn: document.getElementById('modal-equip-close'), editName: document.getElementById('edit-name-modal'), editNameInput: document.getElementById('edit-name-input'),
            editNameCancel: document.getElementById('edit-name-cancel'), editNameSave: document.getElementById('edit-name-save'), feedback: document.getElementById('action-feedback-modal'),
            feedbackTitle: document.getElementById('feedback-title'), feedbackDesc: document.getElementById('feedback-description'), combat: document.getElementById('combat-modal'),
            combatPhaseBattle: document.getElementById('combat-phase-battle'), combatPhaseVictory: document.getElementById('combat-phase-victory'), combatPhaseDefeat: document.getElementById('combat-phase-defeat'),
            combatPlayer: document.getElementById('combat-player'), combatPlayerHpFill: document.getElementById('combat-player-hp-fill'), combatPlayerHpText: document.getElementById('combat-player-hp-text'),
            combatEnemy: document.getElementById('combat-enemy'), combatEnemyName: document.getElementById('combat-enemy-name'), combatEnemyHpFill: document.getElementById('combat-enemy-hp-fill'),
            combatEnemyHpText: document.getElementById('combat-enemy-hp-text'), combatLog: document.getElementById('combat-log'), combatAttackBtn: document.getElementById('combat-attack-btn'),
            combatAutoBtn: document.getElementById('combat-auto-btn'), combatFleeBtn: document.getElementById('combat-flee-btn'), victoryRewardList: document.getElementById('victory-reward-list'),
            victoryEnemyName: document.getElementById('victory-enemy-name'), combatCloseVictoryBtn: document.getElementById('combat-close-victory-btn'), combatReturnHubBtn: document.getElementById('combat-return-hub-btn'),
            embedConfirm: document.getElementById('embed-confirm-modal'), embedBefore: document.getElementById('embed-before'), embedAfter: document.getElementById('embed-after'),
            embedCancelBtn: document.getElementById('embed-cancel-btn'), embedConfirmBtn: document.getElementById('embed-confirm-btn')
        }
    };

    /* ==================================================================== */
    /* SEÇÃO 4: MOTOR PRINCIPAL (Navegação e Funções Auxiliares)
    /* ==================================================================== */

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

    function logMessage(message, type = 'action') {
        const p = document.createElement('p');
        p.classList.add('log-entry', type);
        p.textContent = message;
        DOM.game.log.prepend(p);
        while (DOM.game.log.children.length > 50) {
            DOM.game.log.removeChild(DOM.game.log.lastChild);
        }
    }

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

    function getSpawnPoint(biomeName) {
        const validSpawns = [];
        STATIC_MAP_DATA.forEach((cell, key) => {
            if (cell.biome === biomeName) {
                const [q, r] = key.split(',').map(Number);
                validSpawns.push({ q, r });
            }
        });
        if (validSpawns.length === 0) return { q: 0, r: 0 }; 
        return validSpawns[Math.floor(Math.random() * validSpawns.length)];
    }

    function axialDistance(q1, r1, q2, r2) {
        return (Math.abs(q1 - q2) 
              + Math.abs(q1 + r1 - q2 - r2) 
              + Math.abs(r1 - r2)) / 2;
    }

    function getRandomPlaceholderImg(tribeName) {
        const tribeKey = tribeName.toLowerCase();
        const number = Math.floor(Math.random() * MAX_PLACEHOLDER_IMAGES_PER_TRIBE) + 1;
        return `images/${tribeKey}_${number}.png`;
    }

    // --- Funções de Mapeamento Image Map (NOVO) ---

    /**
     * NOVO: Converte coordenadas axiais (q, r) para o PONTO CENTRAL de pixel (x, y).
     * Adaptação para o centro da imagem estática.
     */
    function axialToPixelCenter(q, r, size) {
        // Fórmulas de Coordenadas Axiais (para Pointy Top Hexes)
        const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
        const y = size * (3/2 * r);
        return { x, y };
    }

    /**
     * NOVO: Define os 6 vértices (corners) de um hexágono a partir de seu centro (x, y).
     */
    function getHexVertices(size, x, y) {
        const vertices = [];
        for (let i = 0; i < 6; i++) {
            // Ângulo inicial de 30 graus para Pointy Top
            const angle_rad = Math.PI / 180 * (60 * i + 30); 
            const vx = x + size * Math.cos(angle_rad);
            const vy = y + size * Math.sin(angle_rad);
            vertices.push(Math.round(vx), Math.round(vy));
        }
        return vertices;
    }

    /* ==================================================================== */
    /* SEÇÃO 5: LÓGICA DA TELA 1 (LOGGED OUT) E INICIALIZAÇÃO DE DADOS
    /* ==================================================================== */

    function initializeMockWallet() {
        gameState.player.kidz = JSON.parse(JSON.stringify(MOCK_WALLET)).map(kid => {
            if (!kid.equipped) {
                kid.equipped = {};
            }
            EQUIPMENT_SLOTS.forEach(slot => {
                if (!kid.equipped[slot]) {
                    kid.equipped[slot] = null;
                }
            });
            kid.placeholderImg = getRandomPlaceholderImg(kid.tribe.name);
            return kid;
        });
        
        DOM.hubSelection.filterTribe.innerHTML = '<option value="all">All Tribes</option>';
        Object.values(TRIBES).forEach(tribe => {
            DOM.hubSelection.filterTribe.innerHTML += `<option value="${tribe.name}">${tribe.name}</option>`;
        });
    }

    function handleConnectWallet() {
        console.log("Simulating wallet connection...");
        
        initializeMockWallet();
        
        DOM.header.tezeriumDisplay.style.visibility = 'visible';
        DOM.header.tezeriumBalance.textContent = gameState.player.tezerium;
        DOM.header.headerConnectBtn.style.display = 'none';
        DOM.header.connectionStatus.style.display = 'inline';
        
        gameState.hub.pagination.currentPage = 1;
        gameState.hub.pagination.itemsPerPage = parseInt(DOM.hubSelection.filterItemsPerPage.value);
        renderHubSelectionScreen();
        
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
    /* SEÇÃO 6: LÓGICA DA TELA 2 (HUB SELECTION)
    /* ==================================================================== */

    function renderHubSelectionScreen() {
        DOM.hubSelection.nftGrid.innerHTML = ''; 
        const state = gameState.hub.pagination;
        
        const searchTerm = DOM.hubSelection.filterSearch.value.toLowerCase();
        const tribeFilter = DOM.hubSelection.filterTribe.value;
        state.itemsPerPage = parseInt(DOM.hubSelection.filterItemsPerPage.value);

        state.filteredKidz = gameState.player.kidz.filter(kid => {
            const nameMatch = kid.name.toLowerCase().includes(searchTerm);
            const idMatch = kid.id.toLowerCase().includes(searchTerm);
            const tribeMatch = (tribeFilter === 'all') || (kid.tribe.name === tribeFilter);
            return (nameMatch || idMatch) && tribeMatch;
        });
        
        state.totalPages = Math.ceil(state.filteredKidz.length / state.itemsPerPage);
        if (state.currentPage > state.totalPages) {
            state.currentPage = 1;
        }
        if (state.totalPages === 0) state.totalPages = 1;

        const startIndex = (state.currentPage - 1) * state.itemsPerPage;
        const endIndex = startIndex + state.itemsPerPage;
        const kidzOnPage = state.filteredKidz.slice(startIndex, endIndex);

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
                card.querySelector('.select-kid-btn').addEventListener('click', () => handleKidSelect(kid.id));
                DOM.hubSelection.nftGrid.appendChild(card);
            });
        }
        
        renderPaginationControls();
    }

    function renderPaginationControls() {
        const state = gameState.hub.pagination;
        DOM.hubSelection.paginationInfo.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
        DOM.hubSelection.paginationPrev.disabled = (state.currentPage === 1);
        DOM.hubSelection.paginationNext.disabled = (state.currentPage === state.totalPages);
    }

    function handlePageChange(direction) {
        const state = gameState.hub.pagination;
        if (direction === 'next' && state.currentPage < state.totalPages) {
            state.currentPage++;
        } else if (direction === 'prev' && state.currentPage > 1) {
            state.currentPage--;
        }
        renderHubSelectionScreen(); 
    }

    function handleKidSelect(kidId) {
        console.log(`Kid ${kidId} selected.`);
        gameState.hub.activeKidId = kidId;
        
        gameState.hub.tabs.activeMainTab = 'inventory';
        gameState.hub.tabs.activeInvSubTab = 'inv-equipments';
        
        renderHubPreparationScreen();
        showScreen('hub-preparation-screen');
    }

    /* ==================================================================== */
    /* SEÇÃO 7: LÓGICA DA TELA 3 (HUB PREPARATION)
    /* ==================================================================== */
    
    function renderHubPreparationScreen() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) {
            console.error("No active Kid selected!");
            showScreen('hub-selection-screen'); 
            return;
        }

        DOM.hubPreparation.kidImage.innerHTML = `<img src="${kid.placeholderImg}" alt="${kid.name}" onerror="this.src='images/kid-placeholder.png'">`;
        DOM.hubPreparation.kidName.firstChild.textContent = kid.name + ' ';
        DOM.hubPreparation.kidTribe.textContent = kid.tribe.name;
        DOM.hubPreparation.kidId.textContent = kid.id;
        DOM.hubPreparation.kidExpeditions.textContent = kid.expeditions;

        renderManequim(kid);
        const finalStats = calculateFinalStats(kid);
        renderPrepStats(finalStats);
        renderWorkshopTabs();
    }

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

    function renderPrepStats(stats) {
        DOM.hubPreparation.statsDisplay.innerHTML = ''; 
        STATS_LIST.forEach(stat => {
            const value = stats[stat] || 0;
            const p = document.createElement('p');
            p.innerHTML = `<strong>${stat}:</strong> ${value}`;
            DOM.hubPreparation.statsDisplay.appendChild(p);
        });
    }

    function renderWorkshopTabs() {
        const state = gameState.hub.tabs;

        DOM.hubPreparation.mainTabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mainTab === state.activeMainTab);
        });
        
        DOM.hubPreparation.mainTabInventory.style.display = state.activeMainTab === 'inventory' ? 'block' : 'none';
        DOM.hubPreparation.mainTabWorkshop.style.display = state.activeMainTab === 'workshop' ? 'block' : 'none';
        
        if (state.activeMainTab === 'inventory') {
            DOM.hubPreparation.mainTabInventory.querySelectorAll('.sub-tabs .tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.subTab === state.activeInvSubTab);
            });
            DOM.hubPreparation.mainTabInventory.querySelectorAll('.sub-tab-content').forEach(content => {
                content.style.display = content.id === `sub-tab-${state.activeInvSubTab}` ? 'block' : 'none';
            });
            if (state.activeInvSubTab === 'inv-equipments') renderInvEquipments();
            if (state.activeInvSubTab === 'inv-components') renderInvComponents();
            if (state.activeInvSubTab === 'inv-materials') renderInvMaterials();

        } else if (state.activeMainTab === 'workshop') {
            DOM.hubPreparation.mainTabWorkshop.querySelectorAll('.sub-tabs .tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.subTab === state.activeWsSubTab);
            });
            DOM.hubPreparation.mainTabWorkshop.querySelectorAll('.sub-tab-content').forEach(content => {
                content.style.display = content.id === `sub-tab-${state.activeWsSubTab}` ? 'block' : 'none';
            });
            if (state.activeWsSubTab === 'ws-refine') renderWsRefine();
            if (state.activeWsSubTab === 'ws-craft') renderWsCraft();
            if (state.activeWsSubTab === 'ws-embed') renderWsEmbed();
        }
    }
    
    // --- Funções de Renderização das Sub-Abas ---
    
    function renderInvEquipments() {
        const content = document.getElementById('sub-tab-inv-equipments');
        content.innerHTML = '<h4>Your Equipment</h4><p>Full list of equipment with image, title, stats, category, and level...</p>';
    }
    function renderInvComponents() {
        const content = document.getElementById('sub-tab-inv-components');
        content.innerHTML = '<h4>Your Components</h4><p>List of components with image and info...</p>';
    }
    function renderInvMaterials() {
        const tbody = DOM.hubPreparation.materialsTableBody;
        tbody.innerHTML = ''; 
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
    function renderWsRefine() { /* Visual only */ }
    function renderWsCraft() {
        DOM.hubPreparation.craftRecipeList.innerHTML = '';
        DOM.hubPreparation.craftRecipeDetails.innerHTML = '<p>Select a recipe from the left to see details.</p>';
        Object.keys(RECIPES_CRAFT).forEach(recipeId => {
            const recipe = RECIPES_CRAFT[recipeId];
            DOM.hubPreparation.craftRecipeList.innerHTML += `<div class="recipe-item" data-recipe-id="${recipeId}">${recipe.name}</div>`;
        });
    }
    function renderWsEmbed() { 
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

    function closeEquipmentModal() { DOM.modals.equipSelect.style.display = 'none'; }
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
    function closeEditNameModal() { DOM.modals.editName.style.display = 'none'; }
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
        DOM.modals.embedBefore.innerHTML = "<h4>Before</h4><p>...</p>";
        DOM.modals.embedAfter.innerHTML = "<h4>After</h4><p>...</p>";
        DOM.modals.embedConfirm.style.display = 'flex';
    }
    function closeEmbedConfirmModal() { DOM.modals.embedConfirm.style.display = 'none'; }


    /* ==================================================================== */
    /* SEÇÃO 8: LÓGICA DA TELA 4 (GAME SCREEN) - REESCRITA MAPA
    /* ==================================================================== */

    function startGameplay() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) { alert("Error: No Kid selected!"); return; }

        gameState.expedition.kid = JSON.parse(JSON.stringify(kid));
        gameState.expedition.stats = calculateFinalStats(kid);
        const stats = gameState.expedition.stats;

        gameState.expedition.currentDay = 1;
        gameState.expedition.playerPos = getSpawnPoint(kid.tribe.biome);
        gameState.expedition.currentHP = stats.hp; gameState.expedition.currentAP = stats.ap;
        gameState.expedition.maxAP = stats.ap; gameState.expedition.currentMP = stats.speed;
        gameState.expedition.maxMP = stats.speed; gameState.expedition.resourcesFound = {};
        gameState.expedition.revealedHexes.clear();

        DOM.game.log.innerHTML = ''; 
        logMessage(`--- DAY 1 START ---`, 'day');
        renderGameStatusPanel();
        renderImageMap(); // NOVO!
        revealAdjacentHexes(gameState.expedition.playerPos);
        updateFogOfWar();
        updatePlayerHexPosition();
        
        showScreen('game-screen');
    }

    /**
     * RENDERIZAÇÃO DO MAPA IMAGEM (NOVO)
     */
    function renderImageMap() {
        const mapAreas = DOM.game.mapAreas;
        const fogOverlay = DOM.game.fogOverlay;
        mapAreas.innerHTML = '';
        fogOverlay.innerHTML = '';
        
        // 1. Encontrar o deslocamento inicial (para centralizar o cálculo na imagem)
        let minX = Infinity, minY = Infinity;
        STATIC_MAP_DATA.forEach((cell, key) => {
            const [q, r] = key.split(',').map(Number);
            const { x, y } = axialToPixelCenter(q, r, HEX_SIZE_VISUAL);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
        });

        // 2. Renderizar Áreas e Fog Overlay
        STATIC_MAP_DATA.forEach((cell, key) => {
            const [q, r] = key.split(',').map(Number);
            const { x: centerX, y: centerY } = axialToPixelCenter(q, r, HEX_SIZE_VISUAL);
            
            // Aplica o deslocamento (offset) para começar no canto superior esquerdo (0,0)
            // Os valores '+ HEX_SIZE_VISUAL' são margens de segurança para o desenho do polígono.
            const mapX = centerX - minX + HEX_SIZE_VISUAL; 
            const mapY = centerY - minY + HEX_SIZE_VISUAL;
            
            // --- Geração da Área de Clique (<area>) ---
            const vertices = getHexVertices(HEX_SIZE_VISUAL, mapX, mapY);
            const areaTag = document.createElement('area');
            areaTag.shape = "poly";
            areaTag.coords = vertices.join(',');
            areaTag.alt = key;
            areaTag.dataset.q = q;
            areaTag.dataset.r = r;
            areaTag.dataset.key = key;
            areaTag.addEventListener('click', (e) => {
                e.preventDefault(); 
                handleHexMoveAttempt(q, r);
            });
            mapAreas.appendChild(areaTag);

            // --- Geração do Overlay de Fog of War (Divs) ---
            const fogDiv = document.createElement('div');
            fogDiv.className = 'hex-fog';
            fogDiv.dataset.key = key;
            // O posicionamento do div usa o ponto central (x, y)
            fogDiv.style.left = `${mapX}px`;
            fogDiv.style.top = `${mapY}px`;
            
            DOM.game.fogOverlay.appendChild(fogDiv);
        });
        
        // 3. Ajuste o tamanho da imagem e do overlay (Ajuste para sua imagem real de 500x400)
        // Estes valores devem corresponder ao tamanho da sua imagem wasteland_map_full.png
        DOM.game.mapImage.style.width = '500px'; 
        DOM.game.mapImage.style.height = '400px';
        DOM.game.fogOverlay.style.width = '500px';
        DOM.game.fogOverlay.style.height = '400px';
    }

    /**
     * ADAPTAÇÃO: Atualiza o Fog of War para Image Map.
     */
    function updateFogOfWar() {
        const hexFogs = document.querySelectorAll('.hex-fog');
        hexFogs.forEach(fogDiv => {
            const key = fogDiv.dataset.key;
            if (gameState.expedition.revealedHexes.has(key)) {
                // Hexágono explorado: remove neblina
                fogDiv.classList.remove('fog-active');
            } else {
                // Não explorado: adiciona neblina
                fogDiv.classList.add('fog-active');
            }
        });
    }

    /**
     * ADAPTAÇÃO: Atualiza a posição do marcador do Kid (Marker)
     */
    function updatePlayerHexPosition() {
        const { q, r } = gameState.expedition.playerPos;
        const key = `${q},${r}`;
        
        // Remove marcadores antigos
        document.querySelectorAll('.kid-marker').forEach(marker => marker.remove());
        
        const targetFogDiv = document.querySelector(`.hex-fog[data-key="${key}"]`);
        
        if (targetFogDiv) {
            const marker = document.createElement('div');
            marker.className = 'kid-marker';
            // Usa a posição do hexágono FogDiv
            marker.style.left = targetFogDiv.style.left;
            marker.style.top = targetFogDiv.style.top;
            
            // Ajuste para a posição do marcador (centro-fundo)
            marker.style.transform = 'translate(-50%, -100%)'; 
            marker.textContent = '🤖';
            
            DOM.game.mapContainer.appendChild(marker);
        }
    }


    function renderGameStatusPanel() { /* ... (Mantém a lógica de atualização do painel) ... */
        const kid = gameState.expedition.kid; const stats = gameState.expedition.stats; const hpPercent = (gameState.expedition.currentHP / stats.hp) * 100;
        DOM.game.kidImage.innerHTML = `<img src="${kid.placeholderImg}" alt="${kid.name}" onerror="this.src='images/kid-placeholder.png'">`;
        DOM.game.kidTribe.textContent = kid.tribe.name; DOM.game.kidId.textContent = kid.id;
        DOM.game.hpBarFill.style.width = `${hpPercent}%`; DOM.game.hpBarText.textContent = `${gameState.expedition.currentHP} / ${stats.hp}`;
        DOM.game.statsDisplay.innerHTML = STATS_LIST.map(stat => `<p><strong>${stat}:</strong> ${stats[stat] || 0}</p>`).join('');
        DOM.game.resourceList.innerHTML = ''; let found = 0;
        for (const resId in gameState.expedition.resourcesFound) {
            const amount = gameState.expedition.resourcesFound[resId];
            if (amount > 0 && MATERIALS[resId]) { DOM.game.resourceList.innerHTML += `<li>${MATERIALS[resId].name}: <span>${amount}</span></li>`; found++; }
        }
        if (found === 0) { DOM.game.resourceList.innerHTML = '<li>No resources found yet.</li>'; }
        DOM.game.turnCounter.textContent = gameState.expedition.currentDay;
        DOM.game.apDisplay.textContent = gameState.expedition.currentAP; DOM.game.maxApDisplay.textContent = gameState.expedition.maxAP;
        DOM.game.mpDisplay.textContent = gameState.expedition.currentMP; DOM.game.maxMpDisplay.textContent = gameState.expedition.maxMP;
        const inCombat = gameState.combat.isActive;
        DOM.game.collectBtn.disabled = (gameState.expedition.currentAP < 1) || inCombat;
        DOM.game.investigateBtn.disabled = (gameState.expedition.currentAP < 1) || inCombat;
        DOM.game.searchEnemyBtn.disabled = (gameState.expedition.currentAP < 2) || inCombat;
        DOM.game.endTurnBtn.disabled = inCombat; DOM.game.exitExpeditionBtn.disabled = inCombat;
    }

    function revealAdjacentHexes({ q, r }) {
        const neighbors = [ [q, r], [q + 1, r], [q - 1, r], [q, r + 1], [q, r - 1], [q + 1, r - 1], [q - 1, r + 1] ];
        neighbors.forEach(([nq, nr]) => {
            const key = `${nq},${nr}`;
            if (STATIC_MAP_DATA.has(key)) { gameState.expedition.revealedHexes.add(key); }
        });
    }

    function handleHexMoveAttempt(q, r) {
        if (gameState.combat.isActive) return;
        const { q: playerQ, r: playerR } = gameState.expedition.playerPos;
        const distance = axialDistance(playerQ, playerR, q, r);
        
        if (distance === 1) { 
            if (gameState.expedition.currentMP < 1) { logMessage("Out of Movement Points (MP)!", 'error'); return; }
            gameState.expedition.currentMP--;
            gameState.expedition.playerPos = { q, r };
            
            logMessage(`Moved to [${q},${r}]. MP remaining: ${gameState.expedition.currentMP}`);
            
            revealAdjacentHexes({ q, r }); updateFogOfWar(); updatePlayerHexPosition(); renderGameStatusPanel(); 
        } else {
             logMessage("Invalid move! Can only move to adjacent hex.", 'error'); 
        }
    }
    
    function handleCollect() { /* ... */ }
    function handleInvestigate() { /* ... */ }
    function handleSearchEnemy() { /* ... */ }
    function endDay() { /* ... */ }
    function gameOver(isSuccess) { /* ... */ }


    /* ==================================================================== */
    /* SEÇÃO 9: LÓGICA DA TELA 5 (COMBAT MODAL)
    /* ==================================================================== */

    function combatLog(message) { /* ... */
        const p = document.createElement('p'); p.textContent = message; DOM.modals.combatLog.prepend(p);
        while (DOM.modals.combatLog.children.length > 50) { DOM.modals.combatLog.removeChild(DOM.modals.combatLog.lastChild); }
    }
    function toggleAutoAttack() { /* ... */
        if (!gameState.combat.isActive) return; gameState.combat.isAutoAttack = !gameState.combat.isAutoAttack;
        if (gameState.combat.isAutoAttack) {
            DOM.modals.combatAutoBtn.textContent = "Cancel Auto"; DOM.modals.combatAutoBtn.classList.add('auto-active');
            if (gameState.combat.playerTurn) { setTimeout(handleCombatAttack, 500); }
        } else {
            DOM.modals.combatAutoBtn.textContent = "Auto Attack"; DOM.modals.combatAutoBtn.classList.remove('auto-active');
        }
    }
    function startCombat(enemy) { /* ... */
        gameState.combat.isActive = true; gameState.combat.enemy = { ...enemy, currentHp: enemy.hp }; const playerStats = gameState.expedition.stats;
        DOM.modals.combatEnemyName.textContent = enemy.name; DOM.modals.combatEnemy.querySelector('img').src = enemy.sprite;
        gameState.combat.playerTurn = playerStats.speed >= enemy.speed;
        updateCombatUI();
        DOM.modals.combatPhaseBattle.style.display = 'block'; DOM.modals.combatPhaseVictory.style.display = 'none'; DOM.modals.combatPhaseDefeat.style.display = 'none'; DOM.modals.combatLog.innerHTML = '';
        gameState.combat.isAutoAttack = false; DOM.modals.combatAutoBtn.textContent = "Auto Attack"; DOM.modals.combatAutoBtn.classList.remove('auto-active');
        DOM.modals.combat.style.display = 'flex'; renderGameStatusPanel();
        if (!gameState.combat.playerTurn) {
            combatLog(`${enemy.name} attacks first!`); DOM.modals.combatAttackBtn.disabled = true;
            DOM.modals.combatFleeBtn.disabled = true; DOM.modals.combatAutoBtn.disabled = true; setTimeout(runEnemyTurn, 1000);
        } else {
            combatLog("Your turn!"); DOM.modals.combatAttackBtn.disabled = false;
            DOM.modals.combatFleeBtn.disabled = false; DOM.modals.combatAutoBtn.disabled = false;
        }
    }
    function updateCombatUI() { /* ... */
        const playerHPPercent = (gameState.expedition.currentHP / gameState.expedition.stats.hp) * 100;
        DOM.modals.combatPlayerHpFill.style.width = `${playerHPPercent}%`; DOM.modals.combatPlayerHpText.textContent = `${gameState.expedition.currentHP} / ${gameState.expedition.stats.hp}`;
        const enemy = gameState.combat.enemy; const enemyHPPercent = (enemy.currentHp / enemy.hp) * 100;
        DOM.modals.combatEnemyHpFill.style.width = `${enemyHPPercent}%`; DOM.modals.combatEnemyHpText.textContent = `${enemy.currentHp} / ${enemy.hp}`;
    }
    function handleCombatAttack() { /* ... */
        if (!gameState.combat.playerTurn) return; DOM.modals.combatAttackBtn.disabled = true; DOM.modals.combatFleeBtn.disabled = true; DOM.modals.combatAutoBtn.disabled = true;
        const playerStats = gameState.expedition.stats; const enemy = gameState.combat.enemy;
        let damage = Math.max(1, playerStats.damage - (enemy.defense || 0)); enemy.currentHp -= damage;
        combatLog(`You attack ${enemy.name} for ${damage} damage.`);
        DOM.modals.combatEnemy.classList.add('hit'); setTimeout(() => DOM.modals.combatEnemy.classList.remove('hit'), 300); updateCombatUI();
        if (enemy.currentHp <= 0) { endCombat(true); return; }
        gameState.combat.playerTurn = false; setTimeout(runEnemyTurn, 1000);
    }
    function runEnemyTurn() { /* ... */
        if (gameState.combat.playerTurn) return;
        const playerStats = gameState.expedition.stats; const enemy = gameState.combat.enemy;
        let damage = Math.max(1, enemy.strength - (playerStats.defense || 0)); gameState.expedition.currentHP -= damage;
        combatLog(`${enemy.name} attacks you for ${damage} damage.`);
        DOM.modals.combatPlayer.classList.add('hit'); setTimeout(() => DOM.modals.combatPlayer.classList.remove('hit'), 300);
        updateCombatUI(); renderGameStatusPanel(); 
        if (gameState.expedition.currentHP <= 0) { endCombat(false); return; }
        gameState.combat.playerTurn = true; combatLog("Your turn!");
        if (gameState.combat.isAutoAttack) { setTimeout(handleCombatAttack, 500); } 
        else { DOM.modals.combatAttackBtn.disabled = false; DOM.modals.combatFleeBtn.disabled = false; DOM.modals.combatAutoBtn.disabled = false; }
    }
    function handleCombatFlee() { /* ... */
        if (!gameState.combat.playerTurn) return;
        if (gameState.combat.isAutoAttack) { toggleAutoAttack(); }
        const luck = gameState.expedition.stats.luck;
        if (Math.random() * 100 < (50 + luck)) { combatLog("You successfully fled!"); logMessage("Fled from combat.", 'action'); closeCombatModal(); } 
        else {
            combatLog("Flee attempt failed!"); gameState.combat.playerTurn = false; 
            DOM.modals.combatAttackBtn.disabled = true; DOM.modals.combatFleeBtn.disabled = true; DOM.modals.combatAutoBtn.disabled = true; 
            setTimeout(runEnemyTurn, 1000);
        }
    }
    function endCombat(isVictory) { /* ... */
        DOM.modals.combatPhaseBattle.style.display = 'none';
        if (isVictory) {
            const enemy = gameState.combat.enemy; DOM.modals.victoryEnemyName.textContent = enemy.name; DOM.modals.victoryRewardList.innerHTML = '';
            for (const resId in enemy.rewards) {
                const amount = enemy.rewards[resId];
                if (!gameState.expedition.resourcesFound[resId]) { gameState.expedition.resourcesFound[resId] = 0; }
                gameState.expedition.resourcesFound[resId] += amount; DOM.modals.victoryRewardList.innerHTML += `<li>${amount}x ${MATERIALS[resId].name}</li>`;
            }
            logMessage(`Victory! Defeated ${enemy.name}.`, 'reward'); DOM.modals.combatPhaseVictory.style.display = 'block';
        } else {
            logMessage(`Defeated! Expedition Failed.`, 'error'); DOM.modals.combatPhaseDefeat.style.display = 'block';
        }
    }
    function closeCombatModal() {
        gameState.combat.isActive = false; gameState.combat.isAutoAttack = false;
        DOM.modals.combatAutoBtn.textContent = "Auto Attack"; DOM.modals.combatAutoBtn.classList.remove('auto-active');
        DOM.modals.combat.style.display = 'none'; renderGameStatusPanel();
    }


    /* ==================================================================== */
    /* SEÇÃO 10: INICIALIZAÇÃO E LISTENERS DE EVENTOS
    /* ==================================================================== */
    function initialize() {
        console.log("CyberKidz Expedition v4.0 Initialized (Image Map).");

        // --- Tela 1 ---
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet); DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);
        
        // --- Tela 2 (Paginação e Filtros) ---
        DOM.hubSelection.filterSearch.addEventListener('input', renderHubSelectionScreen); DOM.hubSelection.filterTribe.addEventListener('change', renderHubSelectionScreen);
        DOM.hubSelection.filterItemsPerPage.addEventListener('change', () => { gameState.hub.pagination.currentPage = 1; renderHubSelectionScreen(); });
        DOM.hubSelection.filterResetBtn.addEventListener('click', () => {
            DOM.hubSelection.filterSearch.value = ''; DOM.hubSelection.filterTribe.value = 'all'; DOM.hubSelection.filterItemsPerPage.value = '10';
            gameState.hub.pagination.currentPage = 1; renderHubSelectionScreen();
        });
        DOM.hubSelection.paginationPrev.addEventListener('click', () => handlePageChange('prev')); DOM.hubSelection.paginationNext.addEventListener('click', () => handlePageChange('next'));

        // --- Tela 3 (Abas e Manequim) ---
        DOM.hubPreparation.backToSelectionBtn.addEventListener('click', () => showScreen('hub-selection-screen')); DOM.hubPreparation.startExpeditionBtn.addEventListener('click', startGameplay);
        DOM.hubPreparation.mannequin.addEventListener('click', (e) => {
            if (e.target.closest('.equip-slot')) {
                const slotDiv = e.target.closest('.equip-slot'); if (!slotDiv.classList.contains('equipped')) { openEquipmentModal(slotDiv.dataset.slot); }
            } else if (e.target.closest('.equip-remove-btn')) { const removeBtn = e.target.closest('.equip-remove-btn'); unequipItem(removeBtn.dataset.slot); }
        });
        DOM.hubPreparation.workshopPanel.addEventListener('click', (e) => {
            const mainTabBtn = e.target.closest('.tab-btn[data-main-tab]'); const subTabBtn = e.target.closest('.tab-btn[data-sub-tab]');
            if (mainTabBtn) { gameState.hub.tabs.activeMainTab = mainTabBtn.dataset.mainTab; renderWorkshopTabs(); } 
            else if (subTabBtn) {
                const newSubTab = subTabBtn.dataset.subTab;
                if (newSubTab.startsWith('inv-')) { gameState.hub.tabs.activeInvSubTab = newSubTab; } 
                else if (newSubTab.startsWith('ws-')) { gameState.hub.tabs.activeWsSubTab = newSubTab; }
                renderWorkshopTabs();
            }
        });
        
        // --- Modais ---
        DOM.modals.equipCloseBtn.addEventListener('click', closeEquipmentModal); DOM.hubPreparation.editNameBtn.addEventListener('click', openEditNameModal);
        DOM.modals.editNameCancel.addEventListener('click', closeEditNameModal); DOM.modals.editNameSave.addEventListener('click', saveEditName);
        
        // Modal de Embed
        DOM.hubPreparation.embedBtn.addEventListener('click', openEmbedConfirmModal); DOM.modals.embedCancelBtn.addEventListener('click', closeEmbedConfirmModal);
        DOM.modals.embedConfirmBtn.addEventListener('click', () => { console.log("Embedding confirmed (simulated)!"); closeEmbedConfirmModal(); });

        // Modal de Combate
        DOM.modals.combatAttackBtn.addEventListener('click', handleCombatAttack); DOM.modals.combatAutoBtn.addEventListener('click', toggleAutoAttack);
        DOM.modals.combatFleeBtn.addEventListener('click', handleCombatFlee); DOM.modals.combatCloseVictoryBtn.addEventListener('click', closeCombatModal);
        DOM.modals.combatReturnHubBtn.addEventListener('click', () => { DOM.modals.combat.style.display = 'none'; gameOver(false); });

        // Inicia na Tela 1
        showScreen('logged-out-screen');
    }

    initialize();
});
