/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 2.0 (Refatoração Pós-Consultoria)
// ==================================================================== */

// Espera o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    /* ==================================================================== */
    /* SEÇÃO 1: BANCO DE DADOS E CONSTANTES (Simulados)
    /* ==================================================================== */

    const MAX_DAYS = 10;
    const HEX_MAP_RADIUS = 3; // Usado para cálculos de zoom, mas o mapa é estático

    // --- 1.1: Atributos Base das Tribos ---
    const TRIBES = {
        VOLCANICS: {
            name: "Volcanics",
            biome: "volcanics", // Chave para o mapa
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

    // --- 1.2: Biomas (Chaves correspondem aos nomes das tribos + 'wasteland') ---
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
    
    // --- 1.4: Banco de Dados de Crafting (Simplificado) ---
    const MATERIALS = {
        scrap: { name: "Scrap", icon: "icon_scrap.png" }, 
        water: { name: "Clean Water", icon: "icon_water.png" }, 
        food: { name: "Food", icon: "icon_food.png" },
        metal: { name: "Metal", icon: "icon_metal.png" }
    };
    const COMPONENTS = {
        volcanic_core: { name: "Volcanic Core", stats: { damage: 5 } },
        defense_plate: { name: "Defense Plate", stats: { defense: 5 } }
    };
    const RECIPES_REFINE = {
        volcanic_core: { name: "Volcanic Core", cost: { scrap: 10, metal: 5 } },
        defense_plate: { name: "Defense Plate", cost: { scrap: 20 } }
    };
    const RECIPES_CRAFT_EMPTY = {
        empty_helmet: { name: "Rustic Helmet (Empty)", cost: { scrap: 8 } },
        empty_weapon: { name: "Rustic Blade (Empty)", cost: { scrap: 10 } }
    };
    const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
    const STATS_LIST = ['hp', 'ap', 'speed', 'damage', 'defense', 'critChance', 'critDamage', 'attackSpeed', 'hpRegen', 'blockChance', 'luck'];

    // --- 1.5: Definição do Mapa Estático ---
    // Documentação: Este objeto define nosso mapa fixo.
    // As chaves "q,r" são coordenadas axiais hexagonais.
    const STATIC_MAP_DATA = new Map([
        // Bioma Volcanics (Vermelho)
        ["-3,0", { biome: "volcanics" }], ["-3,1", { biome: "volcanics" }], ["-3,2", { biome: "volcanics" }],
        ["-2,-1", { biome: "volcanics" }], ["-2,0", { biome: "volcanics" }], ["-2,1", { biome: "volcanics" }],
        // Bioma Undergrounders (Marrom)
        ["-1,-2", { biome: "undergrounders" }], ["-1,-1", { biome: "undergrounders" }], ["-1,0", { biome: "undergrounders" }],
        ["0,-2", { biome: "undergrounders" }], ["0,-1", { biome: "undergrounders" }],
        // Bioma Wasteland (Amarelo) - Centro
        ["0,0", { biome: "wasteland" }], ["-1,1", { biome: "wasteland" }], ["1,-1", { biome: "wasteland" }],
        ["1,0", { biome: "wasteland" }], ["0,1", { biome: "wasteland" }],
        // Bioma Nocturnals (Azul)
        ["-2,2", { biome: "nocturnals" }], ["-2,3", { biome: "nocturnals" }],
        ["-1,2", { biome: "nocturnals" }], ["-1,3", { biome: "nocturnals" }],
        ["0,2", { biome: "nocturnals" }], ["0,3", { biome: "nocturnals" }],
        // Bioma Radioactives (Verde Claro)
        ["1,-2", { biome: "radioactives" }], ["2,-3", { biome: "radioactives" }],
        ["2,-2", { biome: "radioactives" }], ["3,-3", { biome: "radioactives" }],
        ["3,-2", { biome: "radioactives" }],
        // Bioma Reptilians (Verde Escuro)
        ["1,1", { biome: "reptilians" }], ["1,2", { biome: "reptilians" }],
        ["2,0", { biome: "reptilians" }], ["2,1", { biome: "reptilians" }],
        ["3,-1", { biome: "reptilians" }], ["3,0", { biome: "reptilians" }],
    ]);

    // --- 1.6: Carteira Simulada (MOCK_WALLET) ---
    // Documentação: Adicionamos o estado (equipped, expeditions) dentro do Kid.
    const MOCK_WALLET = [
        { 
            id: '#313', 
            name: 'Blue Mutant', 
            tribe: TRIBES.RADIOACTIVES, 
            img: 'images/kid-placeholder.png',
            expeditions: 5,
            equipped: { helmet: 'h1', weapon: 'w1', accessory: null, armor: null, gloves: null, implant: null, boots: null }
        },
        { 
            id: '#222', 
            name: 'Demo Nocturnal', 
            tribe: TRIBES.NOCTURNALS, 
            img: 'images/kid-placeholder.png',
            expeditions: 2,
            equipped: { helmet: null, weapon: null, accessory: null, armor: null, gloves: null, implant: null, boots: null }
        },
        { 
            id: '#111', 
            name: 'Demo Volcanic', 
            tribe: TRIBES.VOLCANICS, 
            img: 'images/kid-placeholder.png',
            expeditions: 10,
            equipped: { helmet: null, weapon: 'w1', accessory: null, armor: null, gloves: null, implant: null, boots: null }
        }
    ];
    const DEMO_KID = MOCK_WALLET[0];

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
                    { id: 'h1', name: 'Capacete de Placa (Nv 1)', slot: 'helmet', stats: { defense: 5, blockChance: 3 }, icon: 'images/icon-helmet.png' },
                    { id: 'h2', name: 'Capacete Rústico (Nv 1)', slot: 'helmet', stats: { defense: 2 }, icon: 'images/icon-helmet.png' },
                    { id: 'w1', name: 'Lâmina Vulcânica (Nv 1)', slot: 'weapon', stats: { damage: 5, critDamage: 5 }, icon: 'images/icon-weapon.png' }
                ]
            },
            kidz: [] // Será preenchido pelo MOCK_WALLET
        },
        hub: {
            activeKidId: null, // ID do Kid selecionado para a Tela 3
            activeWorkshopTab: 'equipments'
        },
        expedition: {
            kid: null, // Um clone do Kid, para não afetar o original
            stats: {}, // Stats finais calculados (base + items)
            currentDay: 1,
            playerPos: { q: 0, r: 0 },
            currentHP: 100,
            currentAP: 0,
            maxAP: 0,
            currentMP: 0,
            maxMP: 0,
            resourcesFound: {},
            revealedHexes: new Set() // Para o Fog of War
        },
        combat: {
            isActive: false,
            enemy: null, // Um clone do inimigo
            playerTurn: true
        }
    };

    /* ==================================================================== */
    /* SEÇÃO 3: CACHE DE ELEMENTOS DO DOM
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
            loggedOut: document.getElementById('logged-out-screen'),
            hubSelection: document.getElementById('hub-selection-screen'),
            hubPreparation: document.getElementById('hub-preparation-screen'),
            game: document.getElementById('game-screen')
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
            filterResetBtn: document.getElementById('filter-reset-btn'),
            nftGrid: document.getElementById('nft-selection-grid'),
            nftGridPlaceholder: document.getElementById('nft-grid-placeholder')
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
            // Workshop
            workshopTabs: document.querySelector('#workshop-panel .tabs'),
            workshopContent: document.querySelector('#workshop-panel')
        },
        // --- Tela 4 (Game) ---
        game: {
            // Status Panel
            kidImage: document.getElementById('game-kid-image'),
            kidTribe: document.getElementById('game-kid-tribe'),
            kidId: document.getElementById('game-kid-id'),
            hpBarFill: document.getElementById('game-hp-bar-fill'),
            hpBarText: document.getElementById('game-hp-bar-text'),
            statsDisplay: document.getElementById('game-stats-display'),
            resourceList: document.getElementById('game-resource-list'),
            exitExpeditionBtn: document.getElementById('exit-expedition-btn'),
            // Map Panel
            turnCounter: document.getElementById('turn-counter'),
            mapContainer: document.getElementById('game-map-container'),
            mapContent: document.getElementById('game-map-content'),
            // Action Panel
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
            // Equip Select
            equipSelect: document.getElementById('equipment-select-modal'),
            equipTitle: document.getElementById('modal-equip-title'),
            equipList: document.getElementById('modal-equip-list'),
            equipCloseBtn: document.getElementById('modal-equip-close'),
            // Edit Name
            editName: document.getElementById('edit-name-modal'),
            editNameInput: document.getElementById('edit-name-input'),
            editNameCancel: document.getElementById('edit-name-cancel'),
            editNameSave: document.getElementById('edit-name-save'),
            // Action Feedback
            feedback: document.getElementById('action-feedback-modal'),
            feedbackTitle: document.getElementById('feedback-title'),
            feedbackDesc: document.getElementById('feedback-description'),
            // Combat
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
            combatReturnHubBtn: document.getElementById('combat-return-hub-btn')
        }
    };

    /* ==================================================================== */
    /* SEÇÃO 4: MOTOR PRINCIPAL (Navegação e Funções Auxiliares)
    /* ==================================================================== */

    /**
     * Mostra uma tela principal e esconde as outras.
     * @param {string} screenId (ex: 'logged-out-screen')
     */
    function showScreen(screenId) {
        Object.values(DOM.screens).forEach(screen => {
            screen.style.display = 'none';
        });
        DOM.screens[screenId.replace(/-/g, '_').replace('_screen', '')].style.display = 'block';
        gameState.currentScreen = screenId;
    }

    /**
     * Adiciona uma mensagem ao log do jogo (Tela 4).
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - Classe CSS (ex: 'combat', 'reward', 'day').
     */
    function logMessage(message, type = 'action') {
        const p = document.createElement('p');
        p.classList.add('log-entry', type);
        p.textContent = message;
        // Adiciona no topo
        DOM.game.log.prepend(p);
        // Limita o log a 50 entradas
        while (DOM.game.log.children.length > 50) {
            DOM.game.log.removeChild(DOM.game.log.lastChild);
        }
    }

    /**
     * Calcula os stats finais de um Kid (base + equipamentos).
     * @param {object} kid - O objeto Kid (do MOCK_WALLET).
     * @returns {object} - Objeto com todos os stats finais.
     */
    function calculateFinalStats(kid) {
        // 1. Começa com os stats base da tribo
        const finalStats = { ...kid.tribe.baseStats };

        // 2. Itera sobre todos os slots de equipamento
        for (const slot of EQUIPMENT_SLOTS) {
            const itemId = kid.equipped[slot];
            if (!itemId) continue;

            // Encontra o item no inventário
            const item = gameState.player.inventory.equipment.find(e => e.id === itemId);
            if (!item || !item.stats) continue;

            // 3. Adiciona os stats do item aos stats finais
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
     * @param {string} biomeName - O nome do bioma (ex: 'volcanics').
     * @returns {object} - Posição { q, r }.
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

    // --- Funções Auxiliares do Mapa Hexagonal (Portadas) ---
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

    /* ==================================================================== */
    /* SEÇÃO 5: LÓGICA DA TELA 1 (LOGGED OUT)
    /* ==================================================================== */

    function handleConnectWallet() {
        console.log("Simulando conexão de carteira...");
        
        // 1. Carrega os Kidz (simulado)
        gameState.player.kidz = JSON.parse(JSON.stringify(MOCK_WALLET)); // Clona os dados
        
        // 2. Atualiza o Header
        DOM.header.tezeriumDisplay.style.visibility = 'visible';
        DOM.header.tezeriumBalance.textContent = gameState.player.tezerium;
        DOM.header.headerConnectBtn.style.display = 'none';
        DOM.header.connectionStatus.style.display = 'inline';
        
        // 3. Renderiza a próxima tela (Seleção)
        renderHubSelectionScreen();
        
        // 4. Muda para a próxima tela
        showScreen('hub-selection-screen');
    }

    function handleDemoGame() {
        console.log("Iniciando Modo Demo...");
        // 1. Conecta a carteira (necessário para ter o inventário)
        handleConnectWallet();

        // 2. Seleciona o Kid de demonstração
        gameState.hub.activeKidId = DEMO_KID.id;

        // 3. Inicia o jogo
        startGameplay();
    }

    /* ==================================================================== */
    /* SEÇÃO 6: LÓGICA DA TELA 2 (HUB SELECTION)
    /* ==================================================================== */

    function renderHubSelectionScreen() {
        DOM.hubSelection.nftGrid.innerHTML = ''; // Limpa o grid
        
        const searchTerm = DOM.hubSelection.filterSearch.value.toLowerCase();
        const tribeFilter = DOM.hubSelection.filterTribe.value;

        let kidFound = false;
        
        gameState.player.kidz.forEach(kid => {
            // Lógica de Filtro
            const nameMatch = kid.name.toLowerCase().includes(searchTerm);
            const idMatch = kid.id.toLowerCase().includes(searchTerm);
            const tribeMatch = (tribeFilter === 'all') || (kid.tribe.name === tribeFilter);

            if ((nameMatch || idMatch) && tribeMatch) {
                kidFound = true;
                const card = document.createElement('div');
                card.className = 'nft-card panel';
                card.dataset.nftId = kid.id;
                
                card.innerHTML = `
                    <img src="${kid.img}" alt="${kid.name}">
                    <h4>${kid.name}</h4>
                    <p>ID: ${kid.id}</p>
                    <p>Tribe: ${kid.tribe.name}</p>
                    <button class="action-btn select-kid-btn" data-kid-id="${kid.id}">Manage & Equip</button>
                `;
                DOM.hubSelection.nftGrid.appendChild(card);
            }
        });

        // Adiciona listeners aos novos botões
        DOM.hubSelection.nftGrid.querySelectorAll('.select-kid-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleKidSelect(e.target.dataset.kidId));
        });

        // Mostra placeholder se nenhum Kid for encontrado
        DOM.hubSelection.nftGridPlaceholder.style.display = kidFound ? 'none' : 'block';
    }

    function handleKidSelect(kidId) {
        console.log(`Kid ${kidId} selecionado.`);
        gameState.hub.activeKidId = kidId;
        
        // Renderiza a próxima tela (Preparação)
        renderHubPreparationScreen();
        
        // Muda para a próxima tela
        showScreen('hub-preparation-screen');
    }

    /* ==================================================================== */
    /* SEÇÃO 7: LÓGICA DA TELA 3 (HUB PREPARATION)
    /* ==================================================================== */
    
    /**
     * Renderiza TUDO na tela de preparação.
     */
    function renderHubPreparationScreen() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) {
            console.error("Nenhum Kid ativo selecionado!");
            showScreen('hub-selection-screen'); // Volta
            return;
        }

        // 1. Preenche Bloco de Informações
        DOM.hubPreparation.kidImage.innerHTML = `<img src="${kid.img}" alt="${kid.name}">`;
        DOM.hubPreparation.kidName.firstChild.textContent = kid.name + ' '; // Atualiza o nome
        DOM.hubPreparation.kidTribe.textContent = kid.tribe.name;
        DOM.hubPreparation.kidId.textContent = kid.id;
        DOM.hubPreparation.kidExpeditions.textContent = kid.expeditions;

        // 2. Renderiza o Manequim
        renderManequim(kid);

        // 3. Calcula e Renderiza Stats
        const finalStats = calculateFinalStats(kid);
        renderPrepStats(finalStats);

        // 4. Renderiza a Aba Ativa do Workshop
        renderWorkshopTabContent();
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
                slotDiv.innerHTML = `<img src="${item.icon}" alt="${item.name}" title="${item.name}">`;
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
     * Renderiza o conteúdo da aba selecionada no Workshop.
     */
    function renderWorkshopTabContent() {
        // 1. Atualiza botões das abas
        DOM.hubPreparation.workshopTabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === gameState.hub.activeWorkshopTab);
        });

        // 2. Atualiza conteúdo das abas
        const allTabs = DOM.hubPreparation.workshopContent.querySelectorAll('.tab-content');
        allTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.innerHTML = ''; // Limpa o conteúdo anterior
        });

        const activeTab = DOM.hubPreparation.workshopContent.querySelector(`#tab-${gameState.hub.activeWorkshopTab}`);
        if (!activeTab) return;

        // 3. Preenche a aba ativa
        switch (gameState.hub.activeWorkshopTab) {
            case 'equipments':
                activeTab.innerHTML = '<h4>Seu Inventário de Equipamentos</h4>';
                gameState.player.inventory.equipment.forEach(item => {
                    activeTab.innerHTML += `<p>${item.name} (Slot: ${item.slot})</p>`;
                });
                break;
            case 'materials':
                activeTab.innerHTML = '<h4>Seus Materiais Brutos</h4>';
                for (const matId in gameState.player.inventory.materials) {
                    const qty = gameState.player.inventory.materials[matId];
                    activeTab.innerHTML += `<p>${MATERIALS[matId].name}: ${qty}</p>`;
                }
                break;
            case 'components':
                activeTab.innerHTML = '<h4>Seus Componentes</h4>';
                 for (const compId in gameState.player.inventory.components) {
                    const qty = gameState.player.inventory.components[compId];
                    activeTab.innerHTML += `<p>${COMPONENTS[compId].name}: ${qty}</p>`;
                }
                break;
            case 'refine':
                activeTab.innerHTML = '<h4>Refinar Componentes</h4>';
                // Lógica de Receitas
                break;
            case 'craft':
                activeTab.innerHTML = '<h4>Criar Equipamento Vazio</h4>';
                // Lógica de Receitas
                break;
            case 'embed':
                activeTab.innerHTML = '<h4>Embutir Componente</h4>';
                // Lógica de UI
                break;
        }
        activeTab.classList.add('active');
    }

    // --- Funções de Ação do Hub (Modais) ---
    let currentSlotToEquip = null;
    function openEquipmentModal(slotName) {
        currentSlotToEquip = slotName;
        DOM.modals.equipTitle.textContent = `Select ${slotName}`;
        DOM.modals.equipList.innerHTML = ''; // Limpa

        const itemsForSlot = gameState.player.inventory.equipment.filter(item => item.slot === slotName);

        if (itemsForSlot.length === 0) {
            DOM.modals.equipList.innerHTML = '<p>Nenhum item encontrado para este slot.</p>';
        } else {
            itemsForSlot.forEach(item => {
                const statsHtml = Object.entries(item.stats).map(([stat, value]) => `<p class="item-stats">${stat}: +${value}</p>`).join('');
                const itemDiv = document.createElement('div');
                itemDiv.className = 'equip-list-item';
                itemDiv.dataset.itemId = item.id;
                itemDiv.innerHTML = `
                    <h4>${item.name}</h4>
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
        
        renderHubPreparationScreen(); // Re-renderiza tudo
        closeEquipmentModal();
    }

    function unequipItem(slotName) {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;

        kid.equipped[slotName] = null;
        renderHubPreparationScreen(); // Re-renderiza tudo
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
            renderHubPreparationScreen(); // Re-renderiza
            closeEditNameModal();
        }
    }


    /* ==================================================================== */
    /* SEÇÃO 8: LÓGICA DA TELA 4 (GAME SCREEN)
    /* ==================================================================== */

    /**
     * Inicia a expedição.
     */
    function startGameplay() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) {
            alert("Erro: Nenhum Kid selecionado!");
            return;
        }

        // 1. Clona o Kid e calcula stats
        gameState.expedition.kid = JSON.parse(JSON.stringify(kid));
        gameState.expedition.stats = calculateFinalStats(kid);
        const stats = gameState.expedition.stats;

        // 2. Define o estado inicial da expedição
        gameState.expedition.currentDay = 1;
        gameState.expedition.playerPos = getSpawnPoint(kid.tribe.biome);
        gameState.expedition.currentHP = stats.hp;
        gameState.expedition.currentAP = stats.ap;
        gameState.expedition.maxAP = stats.ap;
        gameState.expedition.currentMP = stats.speed;
        gameState.expedition.maxMP = stats.speed;
        gameState.expedition.resourcesFound = {};
        gameState.expedition.revealedHexes.clear();

        // 3. Renderiza a UI do Jogo
        DOM.game.log.innerHTML = ''; // Limpa o log
        logMessage(`--- DAY 1 START ---`, 'day');
        renderGameStatusPanel();
        renderStaticHexMap(); // Renderiza o mapa (com Fog of War)
        revealAdjacentHexes(gameState.expedition.playerPos);
        updateFogOfWar();
        updatePlayerHexPosition();
        
        showScreen('game-screen');
    }

    /**
     * Renderiza o painel de status do jogo (esquerda).
     */
    function renderGameStatusPanel() {
        const kid = gameState.expedition.kid;
        const stats = gameState.expedition.stats;
        const hpPercent = (gameState.expedition.currentHP / stats.hp) * 100;

        // Bloco 1: Identidade
        DOM.game.kidImage.innerHTML = `<img src="${kid.img}" alt="${kid.name}">`;
        DOM.game.kidTribe.textContent = kid.tribe.name;
        DOM.game.kidId.textContent = kid.id;

        // Bloco 2: Atributos e HP
        DOM.game.hpBarFill.style.width = `${hpPercent}%`;
        DOM.game.hpBarText.textContent = `${gameState.expedition.currentHP} / ${stats.hp}`;
        DOM.game.statsDisplay.innerHTML = STATS_LIST.map(stat => 
            `<p><strong>${stat}:</strong> ${stats[stat] || 0}</p>`
        ).join('');

        // Bloco 3: Recursos
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

        // Bloco 4: Painel de Ações (AP/MP, Botões)
        DOM.game.turnCounter.textContent = gameState.expedition.currentDay;
        DOM.game.apDisplay.textContent = gameState.expedition.currentAP;
        DOM.game.maxApDisplay.textContent = gameState.expedition.maxAP;
        DOM.game.mpDisplay.textContent = gameState.expedition.currentMP;
        DOM.game.maxMpDisplay.textContent = gameState.expedition.maxMP;

        // Habilita/Desabilita botões
        const inCombat = gameState.combat.isActive;
        DOM.game.collectBtn.disabled = (gameState.expedition.currentAP < 1) || inCombat;
        DOM.game.investigateBtn.disabled = (gameState.expedition.currentAP < 1) || inCombat;
        DOM.game.searchEnemyBtn.disabled = (gameState.expedition.currentAP < 2) || inCombat;
        DOM.game.endTurnBtn.disabled = inCombat;
        DOM.game.exitExpeditionBtn.disabled = inCombat;
    }

    /**
     * Renderiza o mapa estático (só precisa ser chamado uma vez por jogo).
     */
    function renderStaticHexMap() {
        DOM.game.mapContent.innerHTML = '';
        const mapRect = DOM.game.mapContainer.getBoundingClientRect();
        const centerX = mapRect.width / 2;
        const centerY = mapRect.height / 2;

        STATIC_MAP_DATA.forEach((cell, key) => {
            const [q, r] = key.split(',').map(Number);
            const pixel = axialToPixel(q, r);
            
            const cellDiv = document.createElement('div');
            cellDiv.className = 'hex-cell';
            cellDiv.style.left = `${centerX + pixel.x - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-size')) / 2)}px`;
            cellDiv.style.top = `${centerY + pixel.y - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hex-height')) / 2)}px`;
            
            cellDiv.dataset.q = q;
            cellDiv.dataset.r = r;
            cellDiv.dataset.key = key;
            cellDiv.dataset.biome = cell.biome;
            
            // Adiciona listener para movimento
            cellDiv.addEventListener('click', () => handleHexMoveAttempt(q, r));
            
            DOM.game.mapContent.appendChild(cellDiv);
        });
    }

    /**
     * Atualiza o Fog of War.
     */
    function updateFogOfWar() {
        const hexes = DOM.game.mapContent.querySelectorAll('.hex-cell');
        hexes.forEach(hex => {
            const key = hex.dataset.key;
            if (gameState.expedition.revealedHexes.has(key)) {
                // Revelado: remove 'fog' e adiciona cor do bioma
                hex.classList.remove('fog-of-war');
                hex.classList.add(hex.dataset.biome); 
            } else {
                // Escondido
                hex.classList.add('fog-of-war');
                hex.classList.remove(hex.dataset.biome);
            }
        });
    }

    /**
     * Revela hexágonos adjacentes.
     */
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

    /**
     * Atualiza a posição do ícone do Kid no mapa.
     */
    function updatePlayerHexPosition() {
        const { q, r } = gameState.expedition.playerPos;
        const key = `${q},${r}`;
        
        // Remove .hex-kid de todos
        DOM.game.mapContent.querySelectorAll('.hex-kid').forEach(hex => hex.classList.remove('hex-kid'));
        
        // Adiciona .hex-kid ao hex correto
        const playerHex = DOM.game.mapContent.querySelector(`.hex-cell[data-key="${key}"]`);
        if (playerHex) {
            playerHex.classList.add('hex-kid');
        }
    }

    /**
     * Tenta mover o jogador para um novo hex.
     */
    function handleHexMoveAttempt(q, r) {
        if (gameState.combat.isActive) return;

        const { q: playerQ, r: playerR } = gameState.expedition.playerPos;
        const distance = axialDistance(playerQ, playerR, q, r);
        
        if (distance === 1) { // Movimento adjacente
            if (gameState.expedition.currentMP < 1) {
                logMessage("Sem MP (Movement Points)!", 'error');
                return;
            }
            gameState.expedition.currentMP--;
            gameState.expedition.playerPos = { q, r };
            
            logMessage(`Movido para [${q},${r}]. MP restante: ${gameState.expedition.currentMP}`);
            
            revealAdjacentHexes({ q, r });
            updateFogOfWar();
            updatePlayerHexPosition();
            renderGameStatusPanel(); // Atualiza MP
        }
    }

    /**
     * Ação: Coletar Recursos (1 AP)
     */
    function handleCollect() {
        gameState.expedition.currentAP--;
        
        const luck = gameState.expedition.stats.luck / 100;
        let amount = Math.floor(Math.random() * 3) + 1; // 1-3
        amount = Math.ceil(amount * (1 + luck)); // Bônus de Sorte
        
        const biome = STATIC_MAP_DATA.get(`${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`).biome;
        const resourceId = BIOMES[biome].resource;
        
        if (!gameState.expedition.resourcesFound[resourceId]) {
            gameState.expedition.resourcesFound[resourceId] = 0;
        }
        gameState.expedition.resourcesFound[resourceId] += amount;

        logMessage(`Coletou ${amount}x ${MATERIALS[resourceId].name}!`, 'reward');
        showActionFeedback("Coleta Sucedida!", `Você encontrou ${amount}x ${MATERIALS[resourceId].name}`);
        renderGameStatusPanel();
    }

    /**
     * Ação: Investigar (1 AP)
     */
    function handleInvestigate() {
        gameState.expedition.currentAP--;
        const luck = gameState.expedition.stats.luck;
        const roll = Math.random() * 100; // 0-99

        if (roll < (10 + luck)) { // Chance de Recurso Alto
            logMessage("Você encontrou um esconderijo secreto!", 'reward');
            // ... lógica de recompensa alta ...
            showActionFeedback("Sucesso!", `Você encontrou um esconderijo secreto! (+10 Scrap)`);
            if (!gameState.expedition.resourcesFound.scrap) gameState.expedition.resourcesFound.scrap = 0;
            gameState.expedition.resourcesFound.scrap += 10;
        } else if (roll < (30 + luck)) { // Chance de Emboscada (menor com sorte)
             logMessage("É uma emboscada!", 'combat');
             showActionFeedback("Emboscada!", `Um Drone apareceu!`);
             startCombat(ENEMIES.DRONE);
        } else {
            logMessage("Investigação não revelou nada.");
            showActionFeedback("Nada Encontrado", `Você não encontrou nada de especial.`);
        }
        renderGameStatusPanel();
    }
    
    /**
     * Ação: Procurar Inimigos (2 AP)
     */
    function handleSearchEnemy() {
        gameState.expedition.currentAP -= 2;
        logMessage("Procurando por problemas...", 'combat');
        showActionFeedback("Procurando...", `Um Mutante apareceu!`);
        startCombat(ENEMIES.MUTANT);
        renderGameStatusPanel();
    }
    
    /**
     * Mostra o modal de feedback e o esconde.
     */
    function showActionFeedback(title, description) {
        if (DOM.game.skipAnimationsCheck.checked) return; // Pula se marcado

        DOM.modals.feedbackTitle.textContent = title;
        DOM.modals.feedbackDesc.textContent = description;
        DOM.modals.feedback.style.display = 'flex';
        
        setTimeout(() => {
            DOM.modals.feedback.style.display = 'none';
        }, 3000); // 3 segundos
    }

    /**
     * Termina o dia e recarrega AP/MP.
     */
    function endDay() {
        if (gameState.expedition.currentDay >= MAX_DAYS) {
            logMessage("Expedição concluída (10 dias).", 'day');
            gameOver(true); // Sucesso
            return;
        }
        
        gameState.expedition.currentDay++;
        gameState.expedition.currentAP = gameState.expedition.stats.ap;
        gameState.expedition.currentMP = gameState.expedition.stats.speed;
        
        // Regenera HP (se tiver)
        gameState.expedition.currentHP += gameState.expedition.stats.hpRegen;
        if (gameState.expedition.currentHP > gameState.expedition.stats.hp) {
            gameState.expedition.currentHP = gameState.expedition.stats.hp;
        }
        
        logMessage(`--- DAY ${gameState.expedition.currentDay} START ---`, 'day');
        renderGameStatusPanel();
    }

    /**
     * Termina a expedição (sucesso ou falha).
     */
    function gameOver(isSuccess) {
        if (isSuccess) {
            // 1. Adiciona recursos ao inventário principal
            for (const resId in gameState.expedition.resourcesFound) {
                if (!gameState.player.inventory.materials[resId]) {
                    gameState.player.inventory.materials[resId] = 0;
                }
                gameState.player.inventory.materials[resId] += gameState.expedition.resourcesFound[resId];
            }
            // 2. Incrementa contador de expedições do Kid
            const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
            if (kid) kid.expeditions++;
            
            alert("Expedição Concluída! Recursos transferidos para o Hub.");
        } else {
            alert("Expedição Falhou! Todos os recursos encontrados foram perdidos.");
        }
        
        // Retorna à tela de preparação
        renderHubPreparationScreen(); // Atualiza o inventário e expedições
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
        // Clona o inimigo para o combate
        gameState.combat.enemy = { ...enemy, currentHp: enemy.hp }; 
        
        const playerStats = gameState.expedition.stats;
        
        // 1. Prepara a UI
        DOM.modals.combatEnemyName.textContent = enemy.name;
        DOM.modals.combatEnemy.querySelector('img').src = enemy.sprite;
        
        // Define quem começa (baseado na speed)
        gameState.combat.playerTurn = playerStats.speed >= enemy.speed;

        // 2. Atualiza as barras de HP
        updateCombatUI();
        
        // 3. Mostra as fases corretas
        DOM.modals.combatPhaseBattle.style.display = 'block';
        DOM.modals.combatPhaseVictory.style.display = 'none';
        DOM.modals.combatPhaseDefeat.style.display = 'none';
        DOM.modals.combatLog.innerHTML = '';
        
        // 4. Mostra o modal
        DOM.modals.combat.style.display = 'flex';
        renderGameStatusPanel(); // Desabilita botões do mapa

        if (!gameState.combat.playerTurn) {
            combatLog(`${enemy.name} ataca primeiro!`);
            DOM.modals.combatAttackBtn.disabled = true;
            DOM.modals.combatFleeBtn.disabled = true;
            setTimeout(runEnemyTurn, 1000);
        } else {
            combatLog("Seu turno!");
            DOM.modals.combatAttackBtn.disabled = false;
            DOM.modals.combatFleeBtn.disabled = false;
        }
    }

    function updateCombatUI() {
        // HP do Jogador
        const playerHPPercent = (gameState.expedition.currentHP / gameState.expedition.stats.hp) * 100;
        DOM.modals.combatPlayerHpFill.style.width = `${playerHPPercent}%`;
        DOM.modals.combatPlayerHpText.textContent = `${gameState.expedition.currentHP} / ${gameState.expedition.stats.hp}`;
        
        // HP do Inimigo
        const enemy = gameState.combat.enemy;
        const enemyHPPercent = (enemy.currentHp / enemy.hp) * 100;
        DOM.modals.combatEnemyHpFill.style.width = `${enemyHPPercent}%`;
        DOM.modals.combatEnemyHpText.textContent = `${enemy.currentHp} / ${enemy.hp}`;
    }
    
    function handleCombatAttack() {
        if (!gameState.combat.playerTurn) return;
        
        const playerStats = gameState.expedition.stats;
        const enemy = gameState.combat.enemy;
        
        // 1. Calcula Dano
        let damage = playerStats.damage - (enemy.defense || 0);
        if (damage < 1) damage = 1; // Dano mínimo
        
        enemy.currentHp -= damage;
        combatLog(`Você ataca ${enemy.name} e causa ${damage} de dano.`);
        
        // 2. Animação de Hit
        DOM.modals.combatEnemy.classList.add('hit');
        setTimeout(() => DOM.modals.combatEnemy.classList.remove('hit'), 300);
        
        updateCombatUI();

        // 3. Verifica Vitória
        if (enemy.currentHp <= 0) {
            endCombat(true);
            return;
        }

        // 4. Passa o turno
        gameState.combat.playerTurn = false;
        DOM.modals.combatAttackBtn.disabled = true;
        DOM.modals.combatFleeBtn.disabled = true;
        setTimeout(runEnemyTurn, 1000);
    }
    
    function runEnemyTurn() {
        if (gameState.combat.playerTurn) return;
        
        const playerStats = gameState.expedition.stats;
        const enemy = gameState.combat.enemy;
        
        // 1. Calcula Dano
        let damage = enemy.strength - (playerStats.defense || 0);
        if (damage < 1) damage = 1;
        
        gameState.expedition.currentHP -= damage;
        combatLog(`${enemy.name} ataca e causa ${damage} de dano.`);
        
        // 2. Animação de Hit
        DOM.modals.combatPlayer.classList.add('hit');
        setTimeout(() => DOM.modals.combatPlayer.classList.remove('hit'), 300);

        // Atualiza UI de combate E a UI principal (barra de HP)
        updateCombatUI();
        renderGameStatusPanel(); 

        // 3. Verifica Derrota
        if (gameState.expedition.currentHP <= 0) {
            endCombat(false);
            return;
        }

        // 4. Passa o turno
        gameState.combat.playerTurn = true;
        DOM.modals.combatAttackBtn.disabled = false;
        DOM.modals.combatFleeBtn.disabled = false;
        combatLog("Seu turno!");
    }

    function handleCombatFlee() {
        if (!gameState.combat.playerTurn) return;
        
        const luck = gameState.expedition.stats.luck;
        if (Math.random() * 100 < (50 + luck)) { // 50% de chance + sorte
            combatLog("Você conseguiu escapar!");
            logMessage("Escapou da batalha.", 'action');
            closeCombatModal();
        } else {
            combatLog("A fuga falhou!");
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
            
            // Adiciona recompensas
            for (const resId in enemy.rewards) {
                const amount = enemy.rewards[resId];
                if (!gameState.expedition.resourcesFound[resId]) {
                    gameState.expedition.resourcesFound[resId] = 0;
                }
                gameState.expedition.resourcesFound[resId] += amount;
                DOM.modals.victoryRewardList.innerHTML += `<li>${amount}x ${MATERIALS[resId].name}</li>`;
            }
            logMessage(`Vitória! Derrotou ${enemy.name}.`, 'reward');
            DOM.modals.combatPhaseVictory.style.display = 'block';
        } else {
            logMessage(`Derrotado! Expedição falhou.`, 'error');
            DOM.modals.combatPhaseDefeat.style.display = 'block';
            // O botão "Return to Hub" no modal de derrota chamará gameOver(false)
        }
    }
    
    function closeCombatModal() {
        gameState.combat.isActive = false;
        DOM.modals.combat.style.display = 'none';
        renderGameStatusPanel(); // Re-habilita botões do mapa
    }


    /* ==================================================================== */
    /* SEÇÃO 10: INICIALIZAÇÃO E LISTENERS DE EVENTOS
    /* ==================================================================== */
    function initialize() {
        console.log("CyberKidz Expedition v2.0 Inicializado.");

        // --- Tela 1 ---
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);
        
        // --- Tela 2 ---
        DOM.hubSelection.filterSearch.addEventListener('input', renderHubSelectionScreen);
        DOM.hubSelection.filterTribe.addEventListener('change', renderHubSelectionScreen);
        DOM.hubSelection.filterResetBtn.addEventListener('click', () => {
            DOM.hubSelection.filterSearch.value = '';
            DOM.hubSelection.filterTribe.value = 'all';
            renderHubSelectionScreen();
        });

        // --- Tela 3 ---
        DOM.hubPreparation.backToSelectionBtn.addEventListener('click', () => showScreen('hub-selection-screen'));
        DOM.hubPreparation.startExpeditionBtn.addEventListener('click', startGameplay);
        
        // Listeners do Manequim (usando delegação de eventos)
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
        
        // Listeners do Workshop (Tabs)
        DOM.hubPreparation.workshopTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                gameState.hub.activeWorkshopTab = e.target.dataset.tab;
                renderWorkshopTabContent(); // Re-renderiza o conteúdo
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
        
        // --- Modal de Combate ---
        DOM.modals.combatAttackBtn.addEventListener('click', handleCombatAttack);
        DOM.modals.combatFleeBtn.addEventListener('click', handleCombatFlee);
        DOM.modals.combatCloseVictoryBtn.addEventListener('click', closeCombatModal);
        DOM.modals.combatReturnHubBtn.addEventListener('click', () => {
            // Primeiro fecha o modal, DEPOIS chama o gameOver
            DOM.modals.combat.style.display = 'none';
            gameOver(false);
        });

        // Inicia na Tela 1
        showScreen('logged-out-screen');
    }

    // Inicia o jogo!
    initialize();
});
