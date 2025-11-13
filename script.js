/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 5.1 (Inventário Dinâmico Automático)
// ==================================================================== */

/* ==================================================================== */
/* SEÇÃO 1: DEFINIÇÕES GLOBAIS (Seguras para carregar)
/* ==================================================================== */

const MAX_DAYS = 10;
const MAX_PLACEHOLDER_IMAGES_PER_TRIBE = 5;
const HEX_SIZE_VISUAL = 50; 

const TRIBES = {
    VOLCANICS: { name: "Volcanics", biome: "volcanics", baseStats: { damage: 4, critDamage: 5, defense: 3, blockChance: 3, critChance: 2, speed: 15, attackSpeed: 1, hpRegen: 1, ap: 5, hp: 110, luck: 1 } },
    UNDERGROUNDERS: { name: "Undergrounders", biome: "undergrounders", baseStats: { damage: 2, critDamage: 2, defense: 5, blockChance: 5, critChance: 1, speed: 15, attackSpeed: 2, hpRegen: 2, ap: 6, hp: 120, luck: 2 } },
    NOCTURNALS: { name: "Nocturnals", biome: "nocturnals", baseStats: { damage: 3, critDamage: 3, defense: 2, blockChance: 1, critChance: 5, speed: 15, attackSpeed: 4, hpRegen: 1, ap: 6, hp: 100, luck: 3 } },
    RADIOACTIVES: { name: "Radioactives", biome: "radioactives", baseStats: { damage: 2, critDamage: 2, defense: 1, blockChance: 1, critChance: 3, speed: 20, attackSpeed: 5, hpRegen: 1, ap: 7, hp: 80, luck: 5 } },
    REPTILIANS: { name: "Reptilians", biome: "reptilians", baseStats: { damage: 3, critDamage: 2, defense: 3, blockChance: 2, critChance: 2, speed: 13, attackSpeed: 2, hpRegen: 5, ap: 5, hp: 100, luck: 2 } }
};

const BIOMES = {
    volcanics: { name: "Burning Ridge", resource: "mat_metal" }, 
    reptilians: { name: "Covenant Swamp", resource: "mat_food" },
    radioactives: { name: "Lake Rancid", resource: "mat_strange_fluid" },
    nocturnals: { name: "Ancient Ruins", resource: "mat_scrap" },
    undergrounders: { name: "Abandoned Mines", resource: "mat_water" },
    wasteland: { name: "Wasteland", resource: "mat_scrap" }
};

const MATERIALS_DB = {
    'mat_metal': { name: "Metal", icon: "images/icons/materials/mat_metal.png" },
    'mat_magma': { name: "Magma", icon: "images/icons/materials/mat_magma.png" },
    'mat_volcanic_pumice_stone': { name: "Volcanic Pumice Stone", icon: "images/icons/materials/mat_volcanic_pumice_stone.png" },
    'mat_obsidian_tears': { name: "Obsidian Tears", icon: "images/icons/materials/mat_obsidian_tears.png" },
    'mat_water': { name: "Water", icon: "images/icons/materials/mat_water.png" },
    'mat_energized_crystals': { name: "Energized Crystals", icon: "images/icons/materials/mat_energized_crystals.png" },
    'mat_thermal_water': { name: "Thermal Water", icon: "images/icons/materials/mat_thermal_water.png" },
    'mat_special_clay': { name: "Special Clay", icon: "images/icons/materials/mat_special_clay.png" },
    'mat_glass': { name: "Glass", icon: "images/icons/materials/mat_glass.png" },
    'mat_scrap': { name: "Scrap", icon: "images/icons/materials/mat_scrap.png" },
    'mat_polymer': { name: "Polymer", icon: "images/icons/materials/mat_polymer.png" },
    'mat_nanochips': { name: "Nanochips", icon: "images/icons/materials/mat_nanochips.png" },
    'mat_cybernetic_implants': { name: "Cybernetic Implants", icon: "images/icons/materials/mat_cybernetic_implants.png" },
    'mat_quantum_energy_core': { name: "Quantum Energy Core", icon: "images/icons/materials/mat_quantum_energy_core.png" },
    'mat_strange_fluid': { name: "Strange Fluid", icon: "images/icons/materials/mat_strange_fluid.png" },
    'mat_parasitic_fungus': { name: "Parasitic Fungus", icon: "images/icons/materials/mat_parasitic_fungus.png" },
    'mat_venom_glands': { name: "Venom Glands", icon: "images/icons/materials/mat_venom_glands.png" },
    'mat_luminescent_algae': { name: "Luminescent Algae", icon: "images/icons/materials/mat_luminescent_algae.png" },
    'mat_food': { name: "Food", icon: "images/icons/materials/mat_food.png" },
    'mat_healing_plants': { name: "Healing Plants", icon: "images/icons/materials/mat_healing_plants.png" },
    'mat_hallucinogenic_fungi': { name: "Hallucinogenic Fungi", icon: "images/icons/materials/mat_hallucinogenic_fungi.png" },
    'mat_animal_skin': { name: "Animal Skin", icon: "images/icons/materials/mat_animal_skin.png" },
    'mat_reptilian_blood': { name: "Reptilian Blood", icon: "images/icons/materials/mat_reptilian_blood.png" }
};
    
const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
const STATS_LIST = ['hp', 'ap', 'speed', 'damage', 'defense', 'critChance', 'critDamage', 'attackSpeed', 'hpRegen', 'blockChance', 'luck'];

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

const MOCK_WALLET = [
    { id: '#313', name: 'Blue Mutant', tribe: TRIBES.RADIOACTIVES, expeditions: 5, equipped: { helmet: null, weapon: null, accessory: null, armor: null, gloves: null, implant: null, boots: null } },
    { id: '#222', name: 'Demo Nocturnal', tribe: TRIBES.NOCTURNALS, expeditions: 2, equipped: { helmet: null, weapon: null, accessory: null, armor: null, gloves: null, implant: null, boots: null } },
    { id: '#111', name: 'Demo Volcanic', tribe: TRIBES.VOLCANICS, expeditions: 10, equipped: { helmet: null, weapon: null, accessory: null, armor: null, gloves: null, implant: null, boots: null } },
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


let COMPONENTS_DB_SAFE, EQUIPMENT_DB_SAFE, ITEM_DB, RECIPES_CRAFT;


document.addEventListener('DOMContentLoaded', () => {

    /* ==================================================================== */
    /* SEÇÃO 1.9: PÓS-CARREGAMENTO DE BANCO DE DADOS
    /* ==================================================================== */
    
    COMPONENTS_DB_SAFE = (typeof COMPONENTS_DB !== 'undefined' ? COMPONENTS_DB : {});
    EQUIPMENT_DB_SAFE = (typeof EQUIPMENT_DB !== 'undefined' ? EQUIPMENT_DB : {});
    // Assegura que outras variáveis globais estejam definidas
    const SYNERGY_MAP_SAFE = (typeof SYNERGY_MAP !== 'undefined' ? SYNERGY_MAP : {});
    const ENEMIES_BY_BIOME_SAFE = (typeof ENEMIES_BY_BIOME !== 'undefined' ? ENEMIES_BY_BIOME : {});
    const SPAWN_LOGIC_SAFE = (typeof SPAWN_LOGIC !== 'undefined' ? SPAWN_LOGIC : {});
    const DROP_TABLES_SAFE = (typeof DROP_TABLES !== 'undefined' ? DROP_TABLES : {});

    ITEM_DB = { 
        ...MATERIALS_DB, 
        ...COMPONENTS_DB_SAFE, 
        ...EQUIPMENT_DB_SAFE 
    };

    RECIPES_CRAFT = {
        "eq_rust_helmet": { name: "Rustic Helmet", cost: { "mat_scrap": 8, "mat_metal": 2 }, ...(EQUIPMENT_DB_SAFE["eq_rust_helmet"] || {}) },
        "eq_rust_weapon": { name: "Rustic Blade", cost: { "mat_scrap": 10, "mat_metal": 1 }, ...(EQUIPMENT_DB_SAFE["eq_rust_weapon"] || {}) }
    };

    // *** FUNÇÃO NOVA PARA GERAR INVENTÁRIO INICIAL ***
    function generateStartingInventory() {
        if (Object.keys(EQUIPMENT_DB_SAFE).length === 0) {
            console.warn("Equipment DB is empty or not loaded.");
            return [];
        }

        // Mapeia cada entrada do EQUIPMENT_DB para um item no inventário do jogador
        return Object.values(EQUIPMENT_DB_SAFE).map((item, index) => {
            // Cria slots vazios baseados no slots_total do item
            const slots = [];
            const totalSlots = item.slots_total || 3; // Fallback para 3
            for (let i = 0; i < totalSlots; i++) {
                slots.push({ component: null });
            }

            return {
                instance_id: `inst_${index + 1}`, // ID único para esta instância
                item_id: item.id,                 // ID do modelo (Database ID)
                name: item.name,
                level: 1,
                slot: item.slot,
                stats: { ...item.base_stats },    // Clona os stats base
                icon: item.icon,
                embed_slots: slots,
                slots_unlocked: item.slots_unlocked || 1
            };
        });
    }


    /* ==================================================================== */
    /* SEÇÃO 2: MASTER STATE (gameState)
    /* ==================================================================== */

    let gameState = {
        currentScreen: 'logged-out-screen',
        player: {
            tezerium: 1000,
            inventory: {
                materials: { 
                    "mat_scrap": 100, "mat_water": 100, "mat_food": 100, "mat_metal": 5, "mat_magma": 0, "mat_volcanic_pumice_stone": 0, "mat_obsidian_tears": 0,
                    "mat_energized_crystals": 0, "mat_thermal_water": 0, "mat_special_clay": 0, "mat_glass": 0, "mat_polymer": 0, "mat_nanochips": 0, "mat_cybernetic_implants": 0, "mat_quantum_energy_core": 0,
                    "mat_strange_fluid": 0, "mat_parasitic_fungus": 0, "mat_venom_glands": 0, "mat_luminescent_algae": 0, "mat_healing_plants": 0, "mat_hallucinogenic_fungi": 0, "mat_animal_skin": 0, "mat_reptilian_blood": 0
                },
                // Damos alguns componentes iniciais para teste
                components: { "comp_def_1": 2, "comp_dmg_1": 2, "comp_luck_1": 2, "comp_hp_1": 2, "comp_spd_1": 2 }, 
                // O inventário de equipamento é gerado dinamicamente agora
                equipment: generateStartingInventory() 
            },
            kidz: []
        },
        hub: {
            activeKidId: null, 
            pagination: {
                currentPage: 1, itemsPerPage: 10, totalPages: 1, filteredKidz: []
            },
            tabs: { activeMainTab: 'inventory', activeInvSubTab: 'inv-equipments', activeWsSubTab: 'ws-refine' },
            embed: { slotGear: null, slotComponent: null },
            itemModalContext: null 
        },
        expedition: {
            kid: null, stats: {}, currentDay: 1, playerPos: { q: 0, r: 0 },
            currentHP: 100, currentAP: 0, maxAP: 0, currentMP: 0, maxMP: 0,
            resourcesFound: {}, revealedHexes: new Set(),
            startTime: 0 
        },
        combat: {
            isActive: false, enemy: null, playerTurn: true, isAutoAttack: false
        },
        timers: {
            actionFeedback: null,
            endDay: null
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
            embedUi: document.querySelector('.embed-ui'),
            embedSlotGear: document.getElementById('embed-slot-gear'), 
            embedSlotComponent: document.getElementById('embed-slot-component'), 
            embedBtn: document.getElementById('embed-btn')
        },
        game: {
            kidImage: document.getElementById('game-kid-image'), kidTribe: document.getElementById('game-kid-tribe'), kidId: document.getElementById('game-kid-id'),
            hpBarFill: document.getElementById('game-hp-bar-fill'), hpBarText: document.getElementById('game-hp-bar-text'), statsDisplay: document.getElementById('game-stats-display'),
            resourceList: document.getElementById('game-resource-list'), exitExpeditionBtn: document.getElementById('exit-expedition-btn'), turnCounter: document.getElementById('turn-counter'),
            mapContainer: document.getElementById('game-map-container'), mapImage: document.getElementById('map-image'), mapAreas: document.getElementById('map-areas'),
            fogOverlay: document.getElementById('fog-of-war-overlay'), 
            apDisplay: document.getElementById('game-kid-ap'), maxApDisplay: document.getElementById('game-kid-max-ap'), mpDisplay: document.getElementById('game-kid-mp'),
            maxMpDisplay: document.getElementById('game-kid-max-mp'), collectBtn: document.getElementById('collect-btn'), investigateBtn: document.getElementById('investigate-btn'),
            searchEnemyBtn: document.getElementById('search-enemy-btn'), endTurnBtn: document.getElementById('end-turn-btn'), skipAnimationsCheck: document.getElementById('skip-animations-check'),
            log: document.getElementById('game-log')
        },
        modals: {
            itemSelect: document.getElementById('item-select-modal'),
            itemSelectTitle: document.getElementById('modal-item-title'),
            itemSelectFilterBar: document.getElementById('modal-filter-bar'),
            itemSelectGrid: document.getElementById('modal-item-grid'),
            itemSelectPlaceholder: document.getElementById('modal-item-placeholder'),
            itemSelectCloseBtn: document.getElementById('modal-item-close'),
            
            editName: document.getElementById('edit-name-modal'), editNameInput: document.getElementById('edit-name-input'),
            editNameCancel: document.getElementById('edit-name-cancel'), editNameSave: document.getElementById('edit-name-save'), 
            feedback: document.getElementById('action-feedback-modal'),
            feedbackTitle: document.getElementById('feedback-title'), feedbackDesc: document.getElementById('feedback-description'),
            feedbackCloseBtn: document.getElementById('feedback-close-btn'), 
            combat: document.getElementById('combat-modal'),
            combatPhaseBattle: document.getElementById('combat-phase-battle'), combatPhaseVictory: document.getElementById('combat-phase-victory'), combatPhaseDefeat: document.getElementById('combat-phase-defeat'),
            combatPlayer: document.getElementById('combat-player'), combatPlayerHpFill: document.getElementById('combat-player-hp-fill'), combatPlayerHpText: document.getElementById('combat-player-hp-text'),
            combatEnemy: document.getElementById('combat-enemy'), combatEnemyName: document.getElementById('combat-enemy-name'), combatEnemyHpFill: document.getElementById('combat-enemy-hp-fill'),
            combatEnemyHpText: document.getElementById('combat-enemy-hp-text'), combatLog: document.getElementById('combat-log'), combatAttackBtn: document.getElementById('combat-attack-btn'),
            combatAutoBtn: document.getElementById('combat-auto-btn'), combatFleeBtn: document.getElementById('combat-flee-btn'), victoryRewardList: document.getElementById('victory-reward-list'),
            victoryEnemyName: document.getElementById('victory-enemy-name'), combatCloseVictoryBtn: document.getElementById('combat-close-victory-btn'), combatReturnHubBtn: document.getElementById('combat-return-hub-btn'),
            embedConfirm: document.getElementById('embed-confirm-modal'), embedBefore: document.getElementById('embed-before'), embedAfter: document.getElementById('embed-after'),
            embedCancelBtn: document.getElementById('embed-cancel-btn'), embedConfirmBtn: document.getElementById('embed-confirm-btn'),
            embedWarningText: document.querySelector('.warning-text'),
            endDay: document.getElementById('end-day-modal'), 
            endDayTitle: document.getElementById('end-day-title'), 
            endDayCloseBtn: document.getElementById('end-day-close-btn'), 
            endExpedition: document.getElementById('end-expedition-modal'), 
            endExpeditionTitle: document.getElementById('end-expedition-title'), 
            endExpeditionList: document.getElementById('expedition-summary-list'), 
            endExpeditionDuration: document.getElementById('expedition-duration'), 
            endExpeditionCloseBtn: document.getElementById('end-expedition-close-btn'), 
            endExpeditionReturnBtn: document.getElementById('end-expedition-return-btn') 
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
            const instanceId = kid.equipped[slot];
            if (!instanceId) continue;
            
            const itemInstance = gameState.player.inventory.equipment.find(e => e.instance_id === instanceId);
            if (!itemInstance) continue;

            for (const stat in itemInstance.stats) {
                if (finalStats.hasOwnProperty(stat)) {
                    finalStats[stat] += itemInstance.stats[stat];
                }
            }
            
            itemInstance.embed_slots.forEach(slot => {
                if(slot.component) {
                    const component = COMPONENTS_DB_SAFE[slot.component];
                    if (component && component.stats) {
                        for (const stat in component.stats) {
                             if (finalStats.hasOwnProperty(stat)) {
                                finalStats[stat] += component.stats[stat];
                            }
                        }
                    }
                }
            });
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

    function axialToPixelCenter(q, r, size) {
        const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
        const y = size * (3/2 * r);
        return { x, y };
    }

    function getHexVertices(size, x, y) {
        const vertices = [];
        for (let i = 0; i < 6; i++) {
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
            const instanceId = kid.equipped[slot]; 

            if (instanceId) {
                const item = gameState.player.inventory.equipment.find(e => e.instance_id === instanceId);
                if (item) {
                    slotDiv.innerHTML = `<img src="${item.icon}" alt="${item.name}" title="${item.name}" onerror="this.style.display='none'">`;
                    slotDiv.classList.add('equipped');
                    removeBtn.style.display = 'block';
                }
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
            if (value > 0) { 
                const p = document.createElement('p');
                p.innerHTML = `<strong>${stat}:</strong> ${value}`;
                DOM.hubPreparation.statsDisplay.appendChild(p);
            }
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
        content.innerHTML = '<h4>Your Equipment (Inventory)</h4>';
        gameState.player.inventory.equipment.forEach(item => {
             content.innerHTML += `<p>${item.name} (Lvl ${item.level}) [${item.instance_id}]</p>`;
        });
    }
    function renderInvComponents() {
        const content = document.getElementById('sub-tab-inv-components');
        content.innerHTML = '<h4>Your Components</h4>';
        for (const compId in gameState.player.inventory.components) {
            const qty = gameState.player.inventory.components[compId];
            if (qty > 0 && COMPONENTS_DB_SAFE[compId]) {
                content.innerHTML += `<p>${COMPONENTS_DB_SAFE[compId].name}: ${qty}</p>`;
            }
        }
    }
    function renderInvMaterials() {
        const tbody = DOM.hubPreparation.materialsTableBody;
        tbody.innerHTML = ''; 
        for (const matId in gameState.player.inventory.materials) {
            const material = ITEM_DB[matId]; 
            const quantity = gameState.player.inventory.materials[matId];
            if (quantity > 0 && material) {
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
        const { slotGear, slotComponent } = gameState.hub.embed;
        
        if (slotGear) {
            DOM.hubPreparation.embedSlotGear.innerHTML = `<img src="${slotGear.icon}" alt="${slotGear.name}" style="width: 50px;"> <p>${slotGear.name}</p>`;
            DOM.hubPreparation.embedSlotGear.classList.add('equipped');
        } else {
            DOM.hubPreparation.embedSlotGear.innerHTML = '<span>Select Empty Equipment</span>';
            DOM.hubPreparation.embedSlotGear.classList.remove('equipped');
        }

        if (slotComponent) {
            const component = COMPONENTS_DB_SAFE[slotComponent];
            DOM.hubPreparation.embedSlotComponent.innerHTML = `<img src="${component.icon}" alt="${component.name}" style="width: 50px;"> <p>${component.name}</p>`;
            DOM.hubPreparation.embedSlotComponent.classList.add('equipped');
        } else {
            DOM.hubPreparation.embedSlotComponent.innerHTML = '<span>Select Component</span>';
            DOM.hubPreparation.embedSlotComponent.classList.remove('equipped');
        }
        
        DOM.hubPreparation.embedSlotComponent.classList.toggle('disabled', !slotGear);
        DOM.hubPreparation.embedBtn.disabled = !(slotGear && slotComponent);
        
        DOM.hubPreparation.embedUi.querySelector('.embed-remove-btn[data-slot-type="gear"]').style.display = slotGear ? 'block' : 'none';
        DOM.hubPreparation.embedUi.querySelector('.embed-remove-btn[data-slot-type="component"]').style.display = slotComponent ? 'block' : 'none';
    }
    
    function clearEmbedSlot(slotType) {
        if (slotType === 'gear') {
            gameState.hub.embed.slotGear = null;
            gameState.hub.embed.slotComponent = null; 
        } else if (slotType === 'component') {
            gameState.hub.embed.slotComponent = null;
        }
        renderWsEmbed(); 
    }

    
    // --- Funções de Ação do Hub (Modais) ---
    
    function openItemSelectionModal(context, defaultFilter = 'all') {
        if (typeof EQUIPMENT_DB_SAFE === 'undefined' || typeof COMPONENTS_DB_SAFE === 'undefined' || typeof SYNERGY_MAP_SAFE === 'undefined') {
            console.error("ERRO: Bancos de dados (equipment.js, components.js, ou crafting_rules.js) não carregados!");
            return;
        }
        
        gameState.hub.itemModalContext = context;
        DOM.modals.itemSelect.style.display = 'flex';
        
        if (context.startsWith('equip_')) {
            DOM.modals.itemSelectTitle.textContent = `Select ${context.split('_')[1]}`;
        } else if (context === 'embed_gear') {
            DOM.modals.itemSelectTitle.textContent = "Select Equipment to Embed";
        } else if (context === 'embed_component') {
            DOM.modals.itemSelectTitle.textContent = "Select Component";
        }

        const showEquipmentFilters = (context.startsWith('equip_') || context === 'embed_gear');
        const showComponentFilters = (context === 'embed_component');
        
        DOM.modals.itemSelectFilterBar.querySelectorAll('[data-filter]').forEach(btn => {
            const filter = btn.dataset.filter;
            if (filter === 'all') btn.style.display = 'inline-block';
            else if (filter === 'component') btn.style.display = showComponentFilters ? 'inline-block' : 'none';
            else btn.style.display = showEquipmentFilters ? 'inline-block' : 'none';
        });

        renderItemModalGrid(defaultFilter);
    }

    function renderItemModalGrid(filter = 'all') {
        const { itemModalContext, embed } = gameState.hub;
        const grid = DOM.modals.itemSelectGrid;
        grid.innerHTML = '';
        
        DOM.modals.itemSelectFilterBar.querySelectorAll('.modal-filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        let itemsToShow = [];

        if (itemModalContext.startsWith('equip_')) {
            const slot = itemModalContext.split('_')[1];
            itemsToShow = gameState.player.inventory.equipment.filter(item => item.slot === slot);
        
        } else if (itemModalContext === 'embed_gear') {
            itemsToShow = gameState.player.inventory.equipment;
        
        } else if (itemModalContext === 'embed_component') {
            const gear = embed.slotGear;
            if (gear) {
                const baseItem = EQUIPMENT_DB_SAFE[gear.item_id];
                const allowedTypes = (typeof SYNERGY_MAP_SAFE !== 'undefined' && SYNERGY_MAP_SAFE[baseItem.synergy]) ? SYNERGY_MAP_SAFE[baseItem.synergy] : ["universal"];
                
                Object.keys(gameState.player.inventory.components).forEach(compId => {
                    const component = COMPONENTS_DB_SAFE[compId];
                    const qty = gameState.player.inventory.components[compId];
                    if (qty > 0 && component && allowedTypes.includes(component.type)) {
                        itemsToShow.push(component); 
                    }
                });
            }
        }
        
        if (filter !== 'all') {
            itemsToShow = itemsToShow.filter(item => {
                if (filter === 'component') return !!COMPONENTS_DB_SAFE[item.id];
                const itemData = EQUIPMENT_DB_SAFE[item.item_id] || {};
                return itemData.slot === filter;
            });
        }
        
        if (itemsToShow.length === 0) {
            DOM.modals.itemSelectPlaceholder.style.display = 'block';
            return;
        }
        
        DOM.modals.itemSelectPlaceholder.style.display = 'none';
        itemsToShow.forEach(item => {
            const isEquipment = !!item.instance_id;
            const itemData = isEquipment ? item : COMPONENTS_DB_SAFE[item.id]; 
            const itemId = isEquipment ? item.instance_id : item.id;
            
            const statsHtml = Object.entries(itemData.stats || {}).map(([stat, value]) => `<p>${stat}: +${value}</p>`).join('');
            
            let slotsHtml = '';
            if (isEquipment) {
                slotsHtml = '<ul>';
                item.embed_slots.forEach((slot, index) => {
                    if (index < item.slots_unlocked) {
                        slotsHtml += `<li>Slot ${index + 1}: [${slot.component ? COMPONENTS_DB_SAFE[slot.component].name : 'EMPTY'}]</li>`;
                    } else {
                        slotsHtml += `<li>Slot ${index + 1}: [LOCKED]</li>`;
                    }
                });
                slotsHtml += '</ul>';
            }

            const card = document.createElement('div');
            card.className = 'modal-item-card panel';
            card.innerHTML = `
                <img src="${itemData.icon}" alt="${itemData.name}" onerror="this.src='images/kid-placeholder.png'">
                <div class="card-info">
                    <h4>${itemData.name} ${isEquipment ? `(Lvl ${itemData.level})` : ''}</h4>
                    <div class="item-stats">
                        ${statsHtml}
                    </div>
                    <div class="item-components">
                        ${slotsHtml}
                    </div>
                </div>
                <button class="action-btn small-btn select-item-btn" data-item-id="${itemId}">Select</button>
            `;
            grid.appendChild(card);
        });
    }

    function handleItemSelect(selectedId) {
        const context = gameState.hub.itemModalContext;

        if (context.startsWith('equip_')) {
            const slot = context.split('_')[1];
            equipItem(selectedId, slot); 
        
        } else if (context === 'embed_gear') {
            const itemInstance = gameState.player.inventory.equipment.find(e => e.instance_id === selectedId);
            gameState.hub.embed.slotGear = itemInstance;
            renderWsEmbed();
        
        } else if (context === 'embed_component') {
            gameState.hub.embed.slotComponent = selectedId; 
            renderWsEmbed();
        }
        
        closeItemSelectionModal();
    }
    
    function closeItemSelectionModal() {
        DOM.modals.itemSelect.style.display = 'none';
        gameState.hub.itemModalContext = null;
    }


    function equipItem(instanceId, slotName) {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        kid.equipped[slotName] = instanceId;
        renderHubPreparationScreen(); 
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
        const gear = gameState.hub.embed.slotGear;
        const componentId = gameState.hub.embed.slotComponent;
        const component = COMPONENTS_DB_SAFE[componentId];
        
        let beforeHtml = '<h4>Before</h4>';
        Object.entries(gear.stats).forEach(([stat, val]) => beforeHtml += `<p>${stat}: +${val}</p>`);
        DOM.modals.embedBefore.innerHTML = beforeHtml;
        
        let afterHtml = '<h4>After</h4>';
        let afterStats = {...gear.stats};
        for (const stat in component.stats) {
            if (afterStats.hasOwnProperty(stat)) {
                afterStats[stat] += component.stats[stat];
            } else {
                afterStats[stat] = component.stats[stat];
            }
        }
        Object.entries(afterStats).forEach(([stat, val]) => afterHtml += `<p>${stat}: +${val}</p>`);
        DOM.modals.embedAfter.innerHTML = afterHtml;
        
        DOM.modals.embedConfirm.style.display = 'flex';
    }
    
    function closeEmbedConfirmModal() { DOM.modals.embedConfirm.style.display = 'none'; }


    /* ==================================================================== */
    /* SEÇÃO 8: LÓGICA DA TELA 4 (GAME SCREEN)
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
        gameState.expedition.startTime = Date.now(); 

        DOM.game.log.innerHTML = ''; 
        logMessage(`--- DAY 1 START ---`, 'day');
        
        renderImageMap(); 
        revealAdjacentHexes(gameState.expedition.playerPos);
        updateFogOfWar();
        updatePlayerHexPosition();
        
        renderGameStatusPanel(); 
        
        showScreen('game-screen');
    }

    function renderImageMap() {
        const mapAreas = DOM.game.mapAreas;
        const fogOverlay = DOM.game.fogOverlay;
        mapAreas.innerHTML = '';
        fogOverlay.innerHTML = '';
        
        let minX = Infinity, minY = Infinity;
        STATIC_MAP_DATA.forEach((cell, key) => {
            const [q, r] = key.split(',').map(Number);
            const { x, y } = axialToPixelCenter(q, r, HEX_SIZE_VISUAL);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
        });

        STATIC_MAP_DATA.forEach((cell, key) => {
            const [q, r] = key.split(',').map(Number);
            const { x: centerX, y: centerY } = axialToPixelCenter(q, r, HEX_SIZE_VISUAL);
            
            const mapX = centerX - minX + HEX_SIZE_VISUAL; 
            const mapY = centerY - minY + HEX_SIZE_VISUAL;
            
            const vertices = getHexVertices(HEX_SIZE_VISUAL, mapX, mapY);
            const areaTag = document.createElement('area');
            areaTag.shape = "poly";
            areaTag.coords = vertices.join(',');
            areaTag.alt = key;
            areaTag.dataset.q = q;
            areaTag.dataset.r = r;
            areaTag.dataset.key = key;
            areaTag.href = "#"; 
            areaTag.addEventListener('click', (e) => {
                e.preventDefault(); 
                handleHexMoveAttempt(q, r);
            });
            mapAreas.appendChild(areaTag);

            const fogDiv = document.createElement('div');
            fogDiv.className = 'hex-fog'; 
            fogDiv.dataset.key = key;
            fogDiv.style.left = `${mapX}px`;
            fogDiv.style.top = `${mapY}px`;
            
            DOM.game.fogOverlay.appendChild(fogDiv);
        });
    }

    function updateFogOfWar() {
        const hexFogs = document.querySelectorAll('.hex-fog');
        hexFogs.forEach(fogDiv => {
            const key = fogDiv.dataset.key;
            if (gameState.expedition.revealedHexes.has(key)) {
                fogDiv.classList.add('revealed');
            } else {
                fogDiv.classList.remove('revealed');
            }
        });
    }

    function updatePlayerHexPosition() {
        const { q, r } = gameState.expedition.playerPos;
        const key = `${q},${r}`;
        
        document.querySelectorAll('.kid-marker').forEach(marker => marker.remove());
        
        const targetFogDiv = DOM.game.fogOverlay.querySelector(`.hex-fog[data-key="${key}"]`);
        
        if (targetFogDiv) {
            const marker = document.createElement('div');
            marker.className = 'kid-marker';
            marker.style.left = targetFogDiv.style.left;
            marker.style.top = targetFogDiv.style.top;
            marker.style.transform = 'translate(-50%, -100%)'; 
            marker.textContent = '🤖';
            DOM.game.mapContainer.appendChild(marker);
        }
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
        DOM.game.statsDisplay.innerHTML = STATS_LIST.map(stat => `<p><strong>${stat}:</strong> ${stats[stat] || 0}</p>`).join('');
        
        DOM.game.resourceList.innerHTML = ''; 
        let found = 0;
        for (const resId in gameState.expedition.resourcesFound) {
            const amount = gameState.expedition.resourcesFound[resId];
            if (amount > 0 && ITEM_DB[resId]) { 
                DOM.game.resourceList.innerHTML += `<li>${ITEM_DB[resId].name}: <span>${amount}</span></li>`; 
                found++; 
            }
        }
        if (found === 0) { DOM.game.resourceList.innerHTML = '<li>No resources found yet.</li>'; }
        
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
            
            revealAdjacentHexes({ q, r }); 
            updateFogOfWar(); 
            updatePlayerHexPosition(); 
            renderGameStatusPanel(); 
        } else {
             logMessage("Invalid move! Can only move to adjacent hex.", 'error'); 
        }
    }
    
    function handleCollect() {
        if (typeof DROP_TABLES_SAFE === 'undefined') { console.error("ERRO: database/drops.js não carregado!"); return; }

        gameState.expedition.currentAP--;
        
        const biomeKey = `${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`;
        const biome = STATIC_MAP_DATA.get(biomeKey).biome;
        const luck = gameState.expedition.stats.luck / 100;
        
        const collectTable = DROP_TABLES_SAFE[biome]?.collect;
        if (!collectTable) {
            logMessage("This land is barren. Nothing to collect.", 'error');
            renderGameStatusPanel();
            return;
        }

        collectTable.forEach(drop => {
            const [min, max] = drop.quantity;
            let amount = Math.floor(Math.random() * (max - min + 1)) + min;
            amount = Math.ceil(amount * (1 + luck)); // Bônus de Sorte
            
            const resourceId = drop.item;
            
            if (!gameState.expedition.resourcesFound[resourceId]) {
                gameState.expedition.resourcesFound[resourceId] = 0;
            }
            gameState.expedition.resourcesFound[resourceId] += amount;

            logMessage(`Collected ${amount}x ${ITEM_DB[resourceId].name}!`, 'reward');
            showActionFeedback("Collection Succeeded!", `You found ${amount}x ${ITEM_DB[resourceId].name}`);
        });

        renderGameStatusPanel();
    }
    
    function handleInvestigate() {
        if (typeof DROP_TABLES_SAFE === 'undefined') { console.error("ERRO: database/drops.js não carregado!"); return; }

        gameState.expedition.currentAP--;
        const luck = gameState.expedition.stats.luck;
        
        const enemy = getRandomEnemy("Investigate");
        if (enemy) {
             logMessage(`It's an ambush! A ${enemy.name} appeared!`, 'combat');
             showActionFeedback("Ambush!", `A ${enemy.name} appeared!`);
             startCombat(enemy);
             renderGameStatusPanel();
             return; 
        }

        const biomeKey = `${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`;
        const biome = STATIC_MAP_DATA.get(biomeKey).biome;
        const investigateTable = DROP_TABLES_SAFE[biome]?.investigate;
        
        if (!investigateTable) {
             logMessage("Investigation revealed nothing.");
             showActionFeedback("Nothing Found", `You found nothing of interest.`);
             renderGameStatusPanel();
             return;
        }

        let roll = (Math.random() * 100) + luck; 
        let dropFound = null;

        for (const drop of investigateTable) {
            if (roll <= drop.chance) {
                dropFound = drop;
                break;
            }
        }

        if (dropFound && dropFound.type !== 'nothing') {
            const [min, max] = dropFound.quantity;
            const amount = Math.floor(Math.random() * (max - min + 1)) + min;
            const resourceId = dropFound.item;
            
            if (!gameState.expedition.resourcesFound[resourceId]) {
                gameState.expedition.resourcesFound[resourceId] = 0;
            }
            gameState.expedition.resourcesFound[resourceId] += amount;

            logMessage(`You found a secret stash! (+${amount}x ${ITEM_DB[resourceId].name})`, 'reward');
            showActionFeedback("Success!", `You found ${amount}x ${ITEM_DB[resourceId].name}!`);
        } else {
            logMessage("Investigation revealed nothing.");
            showActionFeedback("Nothing Found", `You found nothing of interest.`);
        }
        
        renderGameStatusPanel();
    }
    
    function handleSearchEnemy() {
        gameState.expedition.currentAP -= 2;
        
        const enemy = getRandomEnemy("Search Enemy");

        if (enemy) {
             logMessage(`You found a ${enemy.name}!`, 'combat');
             showActionFeedback("Enemy Found!", `A ${enemy.name} appeared!`);
             startCombat(enemy);
        } else {
             logMessage("You searched, but found nothing.");
             showActionFeedback("Nothing Found", `The area seems clear.`);
        }
        renderGameStatusPanel();
    }

    function getRandomEnemy(actionType) {
        if (typeof SPAWN_LOGIC_SAFE === 'undefined' || typeof ENEMIES_BY_BIOME_SAFE === 'undefined') {
            console.error("ERRO: Bancos de dados (spawn_logic.js ou enemies.js) não carregados!");
            return null;
        }
        
        const logic = SPAWN_LOGIC_SAFE[actionType];
        if (!logic) return null;

        const roll = Math.random() * 100; 
        let cumulativeChance = 0;

        for (const tier of logic.chances) {
            cumulativeChance += tier.chance;
            if (roll < cumulativeChance) {
                if (tier.type === "nothing") {
                    return null; 
                }
                
                const biomeKey = `${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`;
                const biome = STATIC_MAP_DATA.get(biomeKey).biome;
                
                if (ENEMIES_BY_BIOME_SAFE[biome] && ENEMIES_BY_BIOME_SAFE[biome][tier.type]) {
                    return JSON.parse(JSON.stringify(ENEMIES_BY_BIOME_SAFE[biome][tier.type]));
                } else {
                    console.warn(`Inimigo ${tier.type} não encontrado para bioma ${biome}. Usando fallback.`);
                    return JSON.parse(JSON.stringify(ENEMIES_BY_BIOME_SAFE["wasteland"]["common"]));
                }
            }
        }
        return null; 
    }

    
    function showActionFeedback(title, description) {
        if (DOM.game.skipAnimationsCheck.checked) return;
        
        if (gameState.timers.actionFeedback) {
            clearTimeout(gameState.timers.actionFeedback);
        }
        DOM.modals.feedbackTitle.textContent = title;
        DOM.modals.feedbackDesc.textContent = description;
        DOM.modals.feedback.style.display = 'flex';
        
        gameState.timers.actionFeedback = setTimeout(() => {
            closeActionFeedbackModal();
        }, 3000); 
    }

    function closeActionFeedbackModal() {
        if (gameState.timers.actionFeedback) {
            clearTimeout(gameState.timers.actionFeedback);
            gameState.timers.actionFeedback = null;
        }
        DOM.modals.feedback.style.display = 'none';
    }


    function endDay() {
        if (gameState.expedition.currentDay >= MAX_DAYS) {
            logMessage("Expedition finished (10 days).", 'day');
            gameOver(true);
            return;
        }
        
        gameState.expedition.currentDay++;
        
        if (DOM.game.skipAnimationsCheck.checked) {
            proceedToEndDayLogic();
        } else {
            showEndDayModal();
        }
    }

    function showEndDayModal() {
        if (gameState.timers.endDay) {
            clearTimeout(gameState.timers.endDay);
        }
        DOM.modals.endDayTitle.textContent = `DAY ${gameState.expedition.currentDay} START`;
        DOM.modals.endDay.style.display = 'flex';
        
        gameState.timers.endDay = setTimeout(() => {
            closeEndDayModal();
        }, 3000); 
    }

    function closeEndDayModal() {
        if (gameState.timers.endDay) {
            clearTimeout(gameState.timers.endDay);
            gameState.timers.endDay = null;
        }
        DOM.modals.endDay.style.display = 'none';
        proceedToEndDayLogic();
    }

    function proceedToEndDayLogic() {
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
        showEndExpeditionModal(isSuccess);
    }

    function showEndExpeditionModal(isSuccess) {
        if (isSuccess) {
            DOM.modals.endExpeditionTitle.textContent = "Expedition Successful";
            
            const durationMs = Date.now() - gameState.expedition.startTime;
            const minutes = Math.floor(durationMs / 60000);
            const seconds = ((durationMs % 60000) / 1000).toFixed(0);
            DOM.modals.endExpeditionDuration.textContent = `Duration: ${minutes}m ${seconds}s`;
            
            DOM.modals.endExpeditionList.innerHTML = '';
            let found = 0;
            for (const resId in gameState.expedition.resourcesFound) {
                const amount = gameState.expedition.resourcesFound[resId];
                const itemDB = ITEM_DB[resId]; 
                
                if (amount > 0 && itemDB) {
                    DOM.modals.endExpeditionList.innerHTML += `
                        <li>
                            <img src="${itemDB.icon}" alt="${itemDB.name}" onerror="this.style.display='none'">
                            <span>${amount}x ${itemDB.name}</span>
                        </li>
                    `;
                    found++;
                }
            }
            if (found === 0) {
                DOM.modals.endExpeditionList.innerHTML = '<p>No resources found on this trip.</p>';
            }

        } else {
            DOM.modals.endExpeditionTitle.textContent = "Expedition Failed";
            DOM.modals.endExpeditionList.innerHTML = '<p>All resources found were lost.</p>';
            DOM.modals.endExpeditionDuration.textContent = '';
        }
        
        DOM.modals.endExpedition.style.display = 'flex';
    }

    function handleReturnToHub(isSuccess) {
        if (isSuccess) {
            for (const resId in gameState.expedition.resourcesFound) {
                if (MATERIALS_DB[resId]) {
                    if (!gameState.player.inventory.materials[resId]) {
                        gameState.player.inventory.materials[resId] = 0;
                    }
                    gameState.player.inventory.materials[resId] += gameState.expedition.resourcesFound[resId];
                } else if (COMPONENTS_DB_SAFE[resId]) {
                    if (!gameState.player.inventory.components[resId]) {
                        gameState.player.inventory.components[resId] = 0;
                    }
                    gameState.player.inventory.components[resId] += gameState.expedition.resourcesFound[resId];
                }
            }
            const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
            if (kid) kid.expeditions++;
            
            logMessage("Expedition Successful! Resources transferred.", 'day');
        } else {
            logMessage("Expedition Failed! Resources lost.", 'error');
        }
        
        DOM.modals.endExpedition.style.display = 'none';
        
        renderHubPreparationScreen(); 
        showScreen('hub-preparation-screen');
    }


    /* ==================================================================== */
    /* SEÇÃO 9: LÓGICA DA TELA 5 (COMBAT MODAL)
    /* ==================================================================== */

    function combatLog(message) {
        const p = document.createElement('p'); p.textContent = message; DOM.modals.combatLog.prepend(p);
    }
    
    function toggleAutoAttack() {
        if (!gameState.combat.isActive) return; gameState.combat.isAutoAttack = !gameState.combat.isAutoAttack;
        if (gameState.combat.isAutoAttack) {
            DOM.modals.combatAutoBtn.textContent = "Cancel Auto"; DOM.modals.combatAutoBtn.classList.add('auto-active');
            if (gameState.combat.playerTurn) { setTimeout(handleCombatAttack, 500); }
        } else {
            DOM.modals.combatAutoBtn.textContent = "Auto Attack"; DOM.modals.combatAutoBtn.classList.remove('auto-active');
        }
    }
    
    function startCombat(enemy) {
        gameState.combat.isActive = true; 
        gameState.combat.enemy = { ...enemy, currentHp: enemy.stats.hp }; 
        const playerStats = gameState.expedition.stats;
        
        DOM.modals.combatEnemyName.textContent = enemy.name; 
        DOM.modals.combatEnemy.querySelector('img').src = enemy.sprite;
        
        gameState.combat.playerTurn = playerStats.speed >= enemy.stats.speed;
        
        updateCombatUI();
        
        DOM.modals.combatPhaseBattle.style.display = 'block'; 
        DOM.modals.combatPhaseVictory.style.display = 'none'; 
        DOM.modals.combatPhaseDefeat.style.display = 'none'; 
        DOM.modals.combatLog.innerHTML = '';
        
        gameState.combat.isAutoAttack = false; 
        DOM.modals.combatAutoBtn.textContent = "Auto Attack"; 
        DOM.modals.combatAutoBtn.classList.remove('auto-active');
        
        DOM.modals.combat.style.display = 'flex'; 
        renderGameStatusPanel(); 
        
        if (!gameState.combat.playerTurn) {
            combatLog(`${enemy.name} attacks first!`); 
            DOM.modals.combatAttackBtn.disabled = true;
            DOM.modals.combatFleeBtn.disabled = true; 
            DOM.modals.combatAutoBtn.disabled = true; 
            setTimeout(runEnemyTurn, 1000);
        } else {
            combatLog("Your turn!"); 
            DOM.modals.combatAttackBtn.disabled = false;
            DOM.modals.combatFleeBtn.disabled = false; 
            DOM.modals.combatAutoBtn.disabled = false;
        }
    }

    function updateCombatUI() {
        const playerHPPercent = (gameState.expedition.currentHP / gameState.expedition.stats.hp) * 100;
        DOM.modals.combatPlayerHpFill.style.width = `${playerHPPercent}%`; 
        DOM.modals.combatPlayerHpText.textContent = `${gameState.expedition.currentHP} / ${gameState.expedition.stats.hp}`;
        
        const enemy = gameState.combat.enemy; 
        const enemyHPPercent = (enemy.currentHp / enemy.stats.hp) * 100; 
        DOM.modals.combatEnemyHpFill.style.width = `${enemyHPPercent}%`; 
        DOM.modals.combatEnemyHpText.textContent = `${enemy.currentHp} / ${enemy.stats.hp}`; 
    }
    
    function handleCombatAttack() {
        if (!gameState.combat.playerTurn) return; 
        DOM.modals.combatAttackBtn.disabled = true; 
        DOM.modals.combatFleeBtn.disabled = true; 
        DOM.modals.combatAutoBtn.disabled = true;
        
        const playerStats = gameState.expedition.stats; 
        const enemy = gameState.combat.enemy;
        
        let damage = Math.max(1, playerStats.damage - (enemy.stats.defense || 0)); 
        enemy.currentHp -= damage;
        combatLog(`You attack ${enemy.name} for ${damage} damage.`);
        
        DOM.modals.combatEnemy.classList.add('hit'); 
        setTimeout(() => DOM.modals.combatEnemy.classList.remove('hit'), 300); 
        updateCombatUI();
        
        if (enemy.currentHp <= 0) { endCombat(true); return; }
        
        gameState.combat.playerTurn = false; 
        setTimeout(runEnemyTurn, 1000);
    }
    
    function runEnemyTurn() {
        if (gameState.combat.playerTurn) return;
        
        const playerStats = gameState.expedition.stats; 
        const enemy = gameState.combat.enemy;
        
        let damage = Math.max(1, enemy.stats.strength - (playerStats.defense || 0)); 
        gameState.expedition.currentHP -= damage;
        combatLog(`${enemy.name} attacks you for ${damage} damage.`);
        
        DOM.modals.combatPlayer.classList.add('hit'); 
        setTimeout(() => DOM.modals.combatPlayer.classList.remove('hit'), 300);
        
        updateCombatUI(); 
        renderGameStatusPanel(); 
        
        if (gameState.expedition.currentHP <= 0) { endCombat(false); return; }
        
        gameState.combat.playerTurn = true; 
        combatLog("Your turn!");
        
        if (gameState.combat.isAutoAttack) { 
            setTimeout(handleCombatAttack, 500); 
        } else { 
            DOM.modals.combatAttackBtn.disabled = false; 
            DOM.modals.combatFleeBtn.disabled = false; 
            DOM.modals.combatAutoBtn.disabled = false; 
        }
    }
    
    function handleCombatFlee() {
        if (!gameState.combat.playerTurn) return;
        if (gameState.combat.isAutoAttack) { toggleAutoAttack(); }
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
            DOM.modals.combatAutoBtn.disabled = true; 
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
                const reward = enemy.rewards[resId];
                const roll = Math.random() * 100; 
                
                if (roll <= reward.chance) {
                    const [min, max] = reward.quantity;
                    const amount = Math.floor(Math.random() * (max - min + 1)) + min;
                    
                    if (!gameState.expedition.resourcesFound[resId]) {
                        gameState.expedition.resourcesFound[resId] = 0;
                    }
                    gameState.expedition.resourcesFound[resId] += amount;
                    
                    const itemDB = ITEM_DB[resId]; 
                    const itemName = itemDB ? itemDB.name : resId;
                    
                    DOM.modals.victoryRewardList.innerHTML += `<li>${amount}x ${itemName}</li>`;
                }
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
        gameState.combat.isAutoAttack = false;
        DOM.modals.combatAutoBtn.textContent = "Auto Attack"; 
        DOM.modals.combatAutoBtn.classList.remove('auto-active');
        DOM.modals.combat.style.display = 'none'; 
        renderGameStatusPanel();
    }


    /* ==================================================================== */
    /* SEÇÃO 10: INICIALIZAÇÃO E LISTENERS DE EVENTOS
    /* ==================================================================== */
    function initialize() {
        console.log("CyberKidz Expedition v5.0 Initialized (Button Fix).");

        // --- Tela 1 ---
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet); 
        DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);
        
        // --- Tela 2 (Paginação e Filtros) ---
        DOM.hubSelection.filterSearch.addEventListener('input', renderHubSelectionScreen); 
        DOM.hubSelection.filterTribe.addEventListener('change', renderHubSelectionScreen);
        DOM.hubSelection.filterItemsPerPage.addEventListener('change', () => { gameState.hub.pagination.currentPage = 1; renderHubSelectionScreen(); });
        DOM.hubSelection.filterResetBtn.addEventListener('click', () => {
            DOM.hubSelection.filterSearch.value = ''; DOM.hubSelection.filterTribe.value = 'all'; DOM.hubSelection.filterItemsPerPage.value = '10';
            gameState.hub.pagination.currentPage = 1; renderHubSelectionScreen();
        });
        DOM.hubSelection.paginationPrev.addEventListener('click', () => handlePageChange('prev')); 
        DOM.hubSelection.paginationNext.addEventListener('click', () => handlePageChange('next'));

        DOM.hubSelection.nftGrid.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('select-kid-btn')) {
                const kidId = e.target.dataset.kidId;
                handleKidSelect(kidId);
            }
        });

        // --- Tela 3 (Abas e Manequim) ---
        DOM.hubPreparation.backToSelectionBtn.addEventListener('click', () => showScreen('hub-selection-screen')); 
        DOM.hubPreparation.startExpeditionBtn.addEventListener('click', startGameplay);
        
        DOM.hubPreparation.mannequin.addEventListener('click', (e) => {
            if (e.target.closest('.equip-slot')) {
                const slotDiv = e.target.closest('.equip-slot');
                if (!slotDiv.classList.contains('equipped')) {
                    const slotName = slotDiv.dataset.slot;
                    openItemSelectionModal(`equip_${slotName}`, slotName);
                }
            } else if (e.target.closest('.equip-remove-btn')) { 
                const removeBtn = e.target.closest('.equip-remove-btn'); 
                unequipItem(removeBtn.dataset.slot); 
            }
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

        DOM.hubPreparation.embedUi.addEventListener('click', (e) => {
            if (e.target.closest('.embed-remove-btn')) {
                const slotType = e.target.closest('.embed-remove-btn').dataset.slotType; 
                clearEmbedSlot(slotType);
            }
            else if (e.target.closest('#embed-slot-gear')) {
                openItemSelectionModal('embed_gear', 'all'); 
            }
            else if (e.target.closest('#embed-slot-component')) {
                if (!gameState.hub.embed.slotGear) {
                    console.log("Select equipment first!");
                    return;
                }
                openItemSelectionModal('embed_component', 'component'); 
            }
        });
        
        // --- Tela 4 ---
        DOM.game.exitExpeditionBtn.addEventListener('click', () => gameOver(true));
        DOM.game.collectBtn.addEventListener('click', handleCollect);
        DOM.game.investigateBtn.addEventListener('click', handleInvestigate);
        DOM.game.searchEnemyBtn.addEventListener('click', handleSearchEnemy);
        DOM.game.endTurnBtn.addEventListener('click', endDay);
        
        // --- Modais ---
        
        // ** CORREÇÃO V5.0: Referência corrigida de DOM.modals para DOM.hubPreparation **
        DOM.hubPreparation.editNameBtn.addEventListener('click', openEditNameModal); 
        DOM.modals.editNameCancel.addEventListener('click', closeEditNameModal); 
        DOM.modals.editNameSave.addEventListener('click', saveEditName);
        
        // Modal Universal de Itens
        DOM.modals.itemSelectCloseBtn.addEventListener('click', closeItemSelectionModal);
        DOM.modals.itemSelectFilterBar.addEventListener('click', (e) => {
            if(e.target.classList.contains('modal-filter-btn')) {
                const filter = e.target.dataset.filter;
                renderItemModalGrid(filter);
            }
        });
        DOM.modals.itemSelectGrid.addEventListener('click', (e) => {
            const selectBtn = e.target.closest('.select-item-btn');
            if(selectBtn) {
                const itemId = selectBtn.dataset.itemId;
                handleItemSelect(itemId);
            }
        });

        // Modal de Embed
        DOM.hubPreparation.embedBtn.addEventListener('click', openEmbedConfirmModal); 
        DOM.modals.embedCancelBtn.addEventListener('click', closeEmbedConfirmModal);
        DOM.modals.embedConfirmBtn.addEventListener('click', () => { 
            // TODO: Adicionar lógica real de Embed (modificar o item no inventário)
            console.log("Embedding confirmed (simulated)!");
            clearEmbedSlot('gear'); // Limpa os slots
            closeEmbedConfirmModal(); 
        });

        // Modal de Combate
        DOM.modals.combatAttackBtn.addEventListener('click', handleCombatAttack); 
        DOM.modals.combatAutoBtn.addEventListener('click', toggleAutoAttack);
        DOM.modals.combatFleeBtn.addEventListener('click', handleCombatFlee); 
        DOM.modals.combatCloseVictoryBtn.addEventListener('click', closeCombatModal);
        DOM.modals.combatReturnHubBtn.addEventListener('click', () => { 
            closeCombatModal(); 
            handleReturnToHub(false); 
        });

        // Modais de Ação/Dia
        DOM.modals.feedbackCloseBtn.addEventListener('click', closeActionFeedbackModal);
        DOM.modals.endDayCloseBtn.addEventListener('click', closeEndDayModal);
        DOM.modals.endExpeditionReturnBtn.addEventListener('click', () => {
            const isSuccess = DOM.modals.endExpeditionTitle.textContent.includes("Successful");
            handleReturnToHub(isSuccess);
        });
        DOM.modals.endExpeditionCloseBtn.addEventListener('click', () => {
            const isSuccess = DOM.modals.endExpeditionTitle.textContent.includes("Successful");
            handleReturnToHub(isSuccess);
        });

        // Inicia na Tela 1
        showScreen('logged-out-screen');
    }

    // Inicia o jogo!
    initialize();
});
