/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 5.4 (Visual Rich Item Cards)
// ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("System: DOM Loaded. Initializing Game Engine...");

    /* ==================================================================== */
    /* 1. CONSTANTES LOCAIS
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
        { id: '#313', name: 'Blue Mutant', tribe: TRIBES.RADIOACTIVES, expeditions: 5, equipped: {} },
        { id: '#222', name: 'Demo Nocturnal', tribe: TRIBES.NOCTURNALS, expeditions: 2, equipped: {} },
        { id: '#111', name: 'Demo Volcanic', tribe: TRIBES.VOLCANICS, expeditions: 10, equipped: {} }
    ];
    const DEMO_KID_ID = '#313';

    /* ==================================================================== */
    /* 2. CARREGAMENTO SEGURO DE DBs EXTERNOS
    /* ==================================================================== */
    
    const EQUIPMENT_DB_SAFE = (typeof EQUIPMENT_DB !== 'undefined') ? EQUIPMENT_DB : {};
    const COMPONENTS_DB_SAFE = (typeof COMPONENTS_DB !== 'undefined') ? COMPONENTS_DB : {};
    const SYNERGY_MAP_SAFE = (typeof SYNERGY_MAP !== 'undefined') ? SYNERGY_MAP : {};
    const ENEMIES_BY_BIOME_SAFE = (typeof ENEMIES_BY_BIOME !== 'undefined') ? ENEMIES_BY_BIOME : {};
    const SPAWN_LOGIC_SAFE = (typeof SPAWN_LOGIC !== 'undefined') ? SPAWN_LOGIC : {};
    const DROP_TABLES_SAFE = (typeof DROP_TABLES !== 'undefined') ? DROP_TABLES : {};

    if (Object.keys(EQUIPMENT_DB_SAFE).length === 0) console.warn("Aviso: EQUIPMENT_DB não carregado.");
    
    const ITEM_DB = { ...MATERIALS_DB, ...COMPONENTS_DB_SAFE, ...EQUIPMENT_DB_SAFE };

    const RECIPES_CRAFT = {
        "eq_rust_helmet": { name: "Rustic Helmet", cost: { "mat_scrap": 8, "mat_metal": 2 }, ...(EQUIPMENT_DB_SAFE["eq_rust_helmet"] || {}) },
        "eq_rust_weapon": { name: "Rustic Blade", cost: { "mat_scrap": 10, "mat_metal": 1 }, ...(EQUIPMENT_DB_SAFE["eq_rust_weapon"] || {}) }
    };

    /* ==================================================================== */
    /* 3. HELPER FUNCTIONS (Geradores de Cards)
    /* ==================================================================== */

    function generateStartingInventory() {
        if (Object.keys(EQUIPMENT_DB_SAFE).length === 0) return [];
        return Object.values(EQUIPMENT_DB_SAFE).map((item, index) => {
            const slots = [];
            const totalSlots = item.slots_total || 3;
            for (let i = 0; i < totalSlots; i++) slots.push({ component: null });
            return {
                instance_id: `inst_${index + 100}`, 
                item_id: item.id,                 
                name: item.name,
                level: 1,
                slot: item.slot,
                synergy: item.synergy,
                stats: { ...item.base_stats },
                icon: item.icon,
                embed_slots: slots,
                slots_unlocked: item.slots_unlocked || 1
            };
        });
    }

    /**
     * NOVO: Gera o HTML "Rico" para Cards de Item
     */
    function generateItemCardHTML(item, actionButtonHTML) {
        const isEquipment = !!item.instance_id;
        
        // Renderiza Stats
        let statsStr = "";
        const statsObj = item.stats || {};
        
        // Se for equipamento, precisamos somar os stats dos componentes para visualização correta
        if (isEquipment) {
            // Stats Base
            Object.entries(statsObj).forEach(([k, v]) => {
                if (v !== 0) statsStr += `<div class="card-stat-row"><span>${k}</span><span class="card-stat-val">+${v}</span></div>`;
            });
            // Stats de Componentes (adicional visual)
            // (Para simplicidade do card, mostramos apenas base aqui, os slots mostram os bonus)
        } else {
            // Componente
            Object.entries(statsObj).forEach(([k, v]) => {
                if (v !== 0) statsStr += `<div class="card-stat-row"><span>${k}</span><span class="card-stat-val">+${v}</span></div>`;
            });
        }

        // Renderiza Slots (Barras Horizontais)
        let slotsHTML = "";
        if (isEquipment) {
            item.embed_slots.forEach((s, index) => {
                let slotClass = "locked";
                let icon = "🔒";
                let text = `Locked (Lvl ${index > 0 ? 5 * index : 1})`;
                let bonus = "";

                if (index < item.slots_unlocked) {
                    if (s.component) {
                        slotClass = "filled";
                        const comp = COMPONENTS_DB_SAFE[s.component];
                        if (comp) {
                            icon = `<img src="${comp.icon}" class="slot-bar-icon">`;
                            text = comp.name;
                            const firstStat = Object.keys(comp.stats)[0];
                            bonus = `+${comp.stats[firstStat]} ${firstStat}`;
                        } else {
                            // Caso de erro de dados
                            icon = "❓"; text = "Unknown";
                        }
                    } else {
                        slotClass = "empty";
                        icon = "+";
                        text = "Empty Slot";
                    }
                }

                slotsHTML += `
                    <div class="slot-bar ${slotClass}">
                        <div style="width:20px; text-align:center;">${icon}</div>
                        <div class="slot-bar-text">${text}</div>
                        <div class="slot-bar-bonus">${bonus}</div>
                    </div>
                `;
            });
        } else {
            // Para componentes, mostra o tipo
            slotsHTML = `<div class="slot-bar filled"><div class="slot-bar-text" style="text-align:center">Type: ${item.type ? item.type.toUpperCase() : 'UNIVERSAL'}</div></div>`;
        }

        return `
            <div class="card-header">
                <div class="card-icon-frame"><img src="${item.icon}" onerror="this.src='images/kid-placeholder.png'"></div>
                <h4>${item.name}</h4>
                ${isEquipment ? `<span class="card-level">Lvl ${item.level}</span>` : ''}
            </div>
            <div class="card-body">
                ${statsStr || '<div class="card-stat-row"><span>No Stats</span></div>'}
            </div>
            <div class="card-footer">
                ${slotsHTML}
            </div>
            ${actionButtonHTML}
        `;
    }

    function getRandomPlaceholderImg(tribeName) { return `images/${tribeName.toLowerCase()}_${Math.floor(Math.random() * MAX_PLACEHOLDER_IMAGES_PER_TRIBE) + 1}.png`; }
    function axialToPixelCenter(q, r, size) { return { x: size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r), y: size * (3/2 * r) }; }
    function getHexVertices(size, x, y) { const vertices = []; for (let i = 0; i < 6; i++) { const angle = Math.PI / 180 * (60 * i + 30); vertices.push(Math.round(x + size * Math.cos(angle)), Math.round(y + size * Math.sin(angle))); } return vertices; }
    function axialDistance(q1, r1, q2, r2) { return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2; }

    /* ==================================================================== */
    /* 4. GAME STATE
    /* ==================================================================== */

    let gameState = {
        currentScreen: 'logged-out-screen',
        player: {
            tezerium: 1000,
            inventory: {
                materials: { "mat_scrap": 100, "mat_water": 100, "mat_food": 100, "mat_metal": 10 },
                components: { "comp_def_1": 2, "comp_dmg_1": 2 }, 
                equipment: generateStartingInventory() 
            },
            kidz: []
        },
        hub: {
            activeKidId: null, 
            pagination: { currentPage: 1, itemsPerPage: 10, totalPages: 1, filteredKidz: [] },
            tabs: { activeMainTab: 'inventory', activeInvSubTab: 'inv-equipments', activeWsSubTab: 'ws-refine' },
            embed: { slotGear: null, slotComponent: null },
            itemModalContext: null 
        },
        expedition: {
            kid: null, stats: {}, currentDay: 1, playerPos: { q: 0, r: 0 },
            currentHP: 100, currentAP: 0, maxAP: 0, currentMP: 0, maxMP: 0,
            resourcesFound: {}, revealedHexes: new Set(), startTime: 0 
        },
        combat: { isActive: false, enemy: null, playerTurn: true, isAutoAttack: false },
        timers: { actionFeedback: null, endDay: null }
    };

    /* ==================================================================== */
    /* 5. DOM CACHE
    /* ==================================================================== */
    
    const DOM = {
        header: { tezeriumDisplay: document.getElementById('tezerium-display'), tezeriumBalance: document.getElementById('tezerium-balance'), headerConnectBtn: document.getElementById('header-connect-btn'), connectionStatus: document.getElementById('connection-status') },
        screens: { 'logged-out-screen': document.getElementById('logged-out-screen'), 'hub-selection-screen': document.getElementById('hub-selection-screen'), 'hub-preparation-screen': document.getElementById('hub-preparation-screen'), 'game-screen': document.getElementById('game-screen') },
        loggedOut: { bodyConnectBtn: document.getElementById('body-connect-btn'), demoGameBtn: document.getElementById('demo-game-btn') },
        hubSelection: { filterSearch: document.getElementById('filter-search'), filterTribe: document.getElementById('filter-tribe'), filterItemsPerPage: document.getElementById('filter-items-per-page'), filterResetBtn: document.getElementById('filter-reset-btn'), nftGrid: document.getElementById('nft-selection-grid'), nftGridPlaceholder: document.getElementById('nft-grid-placeholder'), paginationPrev: document.getElementById('pagination-prev'), paginationNext: document.getElementById('pagination-next'), paginationInfo: document.getElementById('pagination-info') },
        hubPreparation: {
            backToSelectionBtn: document.getElementById('back-to-selection-btn'), startExpeditionBtn: document.getElementById('start-expedition-btn'), kidImage: document.getElementById('prep-kid-image'), kidName: document.getElementById('prep-kid-name-display'), editNameBtn: document.getElementById('edit-name-btn'), kidTribe: document.getElementById('prep-kid-tribe'), kidId: document.getElementById('prep-kid-id'), kidExpeditions: document.getElementById('prep-kid-expeditions'), mannequin: document.querySelector('.equipment-mannequin'), statsDisplay: document.getElementById('prep-stats-display'),
            workshopPanel: document.getElementById('workshop-panel'), mainTabs: document.querySelector('.main-tabs'), mainTabInventory: document.getElementById('main-tab-inventory'), mainTabWorkshop: document.getElementById('main-tab-workshop'), materialsTableBody: document.getElementById('materials-table-body'), embedUi: document.querySelector('.embed-ui'), embedSlotGear: document.getElementById('embed-slot-gear'), embedSlotComponent: document.getElementById('embed-slot-component'), embedBtn: document.getElementById('embed-btn')
        },
        game: { kidImage: document.getElementById('game-kid-image'), kidTribe: document.getElementById('game-kid-tribe'), kidId: document.getElementById('game-kid-id'), hpBarFill: document.getElementById('game-hp-bar-fill'), hpBarText: document.getElementById('game-hp-bar-text'), statsDisplay: document.getElementById('game-stats-display'), resourceList: document.getElementById('game-resource-list'), exitExpeditionBtn: document.getElementById('exit-expedition-btn'), turnCounter: document.getElementById('turn-counter'), mapContainer: document.getElementById('game-map-container'), mapImage: document.getElementById('map-image'), mapAreas: document.getElementById('map-areas'), fogOverlay: document.getElementById('fog-of-war-overlay'), apDisplay: document.getElementById('game-kid-ap'), maxApDisplay: document.getElementById('game-kid-max-ap'), mpDisplay: document.getElementById('game-kid-mp'), maxMpDisplay: document.getElementById('game-kid-max-mp'), collectBtn: document.getElementById('collect-btn'), investigateBtn: document.getElementById('investigate-btn'), searchEnemyBtn: document.getElementById('search-enemy-btn'), endTurnBtn: document.getElementById('end-turn-btn'), skipAnimationsCheck: document.getElementById('skip-animations-check'), log: document.getElementById('game-log') },
        modals: {
            itemSelect: document.getElementById('item-select-modal'), itemSelectCloseBtn: document.getElementById('modal-item-close'), itemSelectFilterBar: document.getElementById('modal-filter-bar'), itemSelectGrid: document.getElementById('modal-item-grid'), itemSelectTitle: document.getElementById('modal-item-title'), itemSelectPlaceholder: document.getElementById('modal-item-placeholder'),
            editName: document.getElementById('edit-name-modal'), editNameInput: document.getElementById('edit-name-input'), editNameCancel: document.getElementById('edit-name-cancel'), editNameSave: document.getElementById('edit-name-save'), 
            feedback: document.getElementById('action-feedback-modal'), feedbackTitle: document.getElementById('feedback-title'), feedbackDesc: document.getElementById('feedback-description'), feedbackCloseBtn: document.getElementById('feedback-close-btn'), 
            combat: document.getElementById('combat-modal'), combatLog: document.getElementById('combat-log'), combatPhaseBattle: document.getElementById('combat-phase-battle'), combatPhaseVictory: document.getElementById('combat-phase-victory'), combatPhaseDefeat: document.getElementById('combat-phase-defeat'), combatPlayer: document.getElementById('combat-player'), combatPlayerHpFill: document.getElementById('combat-player-hp-fill'), combatPlayerHpText: document.getElementById('combat-player-hp-text'), combatEnemy: document.getElementById('combat-enemy'), combatEnemyName: document.getElementById('combat-enemy-name'), combatEnemyHpFill: document.getElementById('combat-enemy-hp-fill'), combatEnemyHpText: document.getElementById('combat-enemy-hp-text'), combatAttackBtn: document.getElementById('combat-attack-btn'), combatAutoBtn: document.getElementById('combat-auto-btn'), combatFleeBtn: document.getElementById('combat-flee-btn'), victoryRewardList: document.getElementById('victory-reward-list'), victoryEnemyName: document.getElementById('victory-enemy-name'), combatCloseVictoryBtn: document.getElementById('combat-close-victory-btn'), combatReturnHubBtn: document.getElementById('combat-return-hub-btn'), 
            embedConfirm: document.getElementById('embed-confirm-modal'), embedBefore: document.getElementById('embed-before'), embedAfter: document.getElementById('embed-after'), embedCancelBtn: document.getElementById('embed-cancel-btn'), embedConfirmBtn: document.getElementById('embed-confirm-btn'), embedWarningText: document.querySelector('.warning-text'),
            endDay: document.getElementById('end-day-modal'), endDayTitle: document.getElementById('end-day-title'), endDayCloseBtn: document.getElementById('end-day-close-btn'), 
            endExpedition: document.getElementById('end-expedition-modal'), endExpeditionTitle: document.getElementById('end-expedition-title'), endExpeditionList: document.getElementById('expedition-summary-list'), endExpeditionDuration: document.getElementById('expedition-duration'), endExpeditionCloseBtn: document.getElementById('end-expedition-close-btn'), endExpeditionReturnBtn: document.getElementById('end-expedition-return-btn') 
        }
    };

    /* ==================================================================== */
    /* 6. FUNÇÕES AUXILIARES & LÓGICA
    /* ==================================================================== */

    function showScreen(screenId) {
        Object.values(DOM.screens).forEach(s => s.style.display = 'none');
        if (DOM.screens[screenId]) DOM.screens[screenId].style.display = 'block';
        gameState.currentScreen = screenId;
    }

    function logMessage(msg, type='action') {
        const p = document.createElement('p'); p.className = `log-entry ${type}`; p.textContent = msg;
        DOM.game.log.prepend(p);
        if (DOM.game.log.children.length > 50) DOM.game.log.removeChild(DOM.game.log.lastChild);
    }

    function calculateFinalStats(kid) {
        const finalStats = { ...kid.tribe.baseStats };
        for (const slot of EQUIPMENT_SLOTS) {
            const instanceId = kid.equipped[slot];
            if (!instanceId) continue;
            const itemInstance = gameState.player.inventory.equipment.find(e => e.instance_id === instanceId);
            if (!itemInstance) continue;
            for (const stat in itemInstance.stats) { if (finalStats.hasOwnProperty(stat)) finalStats[stat] += itemInstance.stats[stat]; }
            itemInstance.embed_slots.forEach(slot => {
                if(slot.component) {
                    const component = COMPONENTS_DB_SAFE[slot.component];
                    if (component && component.stats) { for (const stat in component.stats) { if (finalStats.hasOwnProperty(stat)) finalStats[stat] += component.stats[stat]; } }
                }
            });
        }
        return finalStats;
    }

    // --- FUNÇÕES DE GERENCIAMENTO DE EQUIPAMENTO ---
    function calculateItemPower(itemInstance) {
        let score = 0;
        for (const stat in itemInstance.stats) score += itemInstance.stats[stat];
        if (itemInstance.embed_slots) {
            itemInstance.embed_slots.forEach(slot => {
                if (slot.component) {
                    const component = COMPONENTS_DB_SAFE[slot.component];
                    if (component && component.stats) { for (const stat in component.stats) score += component.stats[stat]; }
                }
            });
        }
        return score;
    }

    function autoEquip() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        let equippedCount = 0;
        EQUIPMENT_SLOTS.forEach(slot => {
            const itemsForSlot = gameState.player.inventory.equipment.filter(item => item.slot === slot);
            if (itemsForSlot.length > 0) {
                itemsForSlot.sort((a, b) => calculateItemPower(b) - calculateItemPower(a));
                const bestItem = itemsForSlot[0];
                const currentEquippedId = kid.equipped[slot];
                if (!currentEquippedId || currentEquippedId !== bestItem.instance_id) {
                    kid.equipped[slot] = bestItem.instance_id;
                    equippedCount++;
                }
            }
        });
        if (equippedCount > 0) renderHubPreparationScreen();
    }

    function removeAllEquipment() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        EQUIPMENT_SLOTS.forEach(slot => { kid.equipped[slot] = null; });
        renderHubPreparationScreen();
    }

    /* ==================================================================== */
    /* 7. LÓGICA HUB & PREPARAÇÃO
    /* ==================================================================== */

    function renderHubPreparationScreen() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        DOM.hubPreparation.kidImage.innerHTML = `<img src="${kid.placeholderImg}">`;
        DOM.hubPreparation.kidName.firstChild.textContent = kid.name + ' ';
        DOM.hubPreparation.kidTribe.textContent = kid.tribe.name; DOM.hubPreparation.kidId.textContent = kid.id;
        DOM.hubPreparation.kidExpeditions.textContent = kid.expeditions;
        renderManequim(kid); renderPrepStats(calculateFinalStats(kid)); renderWorkshopTabs();
    }

    function renderManequim(kid) {
        EQUIPMENT_SLOTS.forEach(slot => {
            const div = DOM.hubPreparation.mannequin.querySelector(`.equip-slot[data-slot="${slot}"]`);
            const btn = DOM.hubPreparation.mannequin.querySelector(`.equip-remove-btn[data-slot="${slot}"]`);
            const instanceId = kid.equipped[slot];
            const item = instanceId ? gameState.player.inventory.equipment.find(e => e.instance_id === instanceId) : null;
            if (item) { div.innerHTML = `<img src="${item.icon}">`; div.classList.add('equipped'); btn.style.display = 'block'; }
            else { div.innerHTML = '<span>+</span>'; div.classList.remove('equipped'); btn.style.display = 'none'; }
        });
    }

    function renderPrepStats(stats) {
        const display = DOM.hubPreparation.statsDisplay; display.innerHTML = '';
        STATS_LIST.forEach(stat => { if (stats[stat] > 0) display.innerHTML += `<p><strong>${stat}:</strong> ${stats[stat]}</p>`; });
    }

    // --- RENDERERS DE INVENTÁRIO (USANDO O NOVO CARD) ---
    function renderWorkshopTabs() {
        const tabs = gameState.hub.tabs;
        DOM.hubPreparation.mainTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.mainTab === tabs.activeMainTab));
        DOM.hubPreparation.mainTabInventory.style.display = tabs.activeMainTab === 'inventory' ? 'block' : 'none';
        DOM.hubPreparation.mainTabWorkshop.style.display = tabs.activeMainTab === 'workshop' ? 'block' : 'none';
        if (tabs.activeMainTab === 'inventory') renderInventoryTab(tabs.activeInvSubTab);
        else renderWorkshopSubTab(tabs.activeWsSubTab);
    }

    function renderInventoryTab(subTab) {
        DOM.hubPreparation.mainTabInventory.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.subTab === subTab));
        DOM.hubPreparation.mainTabInventory.querySelectorAll('.sub-tab-content').forEach(c => c.style.display = 'none');
        document.getElementById(`sub-tab-${subTab}`).style.display = 'block';
        if (subTab === 'inv-equipments') renderInvEquipments();
        if (subTab === 'inv-components') renderInvComponents();
        if (subTab === 'inv-materials') renderInvMaterials();
    }

    function renderWorkshopSubTab(subTab) {
        DOM.hubPreparation.mainTabWorkshop.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.subTab === subTab));
        DOM.hubPreparation.mainTabWorkshop.querySelectorAll('.sub-tab-content').forEach(c => c.style.display = 'none');
        document.getElementById(`sub-tab-${subTab}`).style.display = 'block';
        if (subTab === 'ws-embed') renderWsEmbed();
    }

    function renderInvEquipments() {
        const el = document.getElementById('sub-tab-inv-equipments');
        el.className = 'item-grid-container';
        el.innerHTML = '';
        gameState.player.inventory.equipment.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            // Gera HTML usando a função nova
            card.innerHTML = generateItemCardHTML(item, ''); 
            el.appendChild(card);
        });
    }

    function renderInvComponents() {
        const el = document.getElementById('sub-tab-inv-components');
        el.className = 'item-grid-container';
        el.innerHTML = '';
        Object.entries(gameState.player.inventory.components).forEach(([id, qty]) => {
            if (qty > 0 && COMPONENTS_DB_SAFE[id]) {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = generateItemCardHTML(COMPONENTS_DB_SAFE[id], `<div style="text-align:center; padding:5px;">Qty: ${qty}</div>`);
                el.appendChild(card);
            }
        });
    }

    function renderInvMaterials() {
        const tbody = DOM.hubPreparation.materialsTableBody; tbody.innerHTML = '';
        Object.entries(gameState.player.inventory.materials).forEach(([id, qty]) => {
            if (qty > 0 && ITEM_DB[id]) tbody.innerHTML += `<tr><td><img src="${ITEM_DB[id].icon}"></td><td>${ITEM_DB[id].name}</td><td>${qty}</td></tr>`;
        });
    }

    // --- MODAL UNIVERSAL ---
    function openItemSelectionModal(context, defaultFilter = 'all') {
        if (Object.keys(EQUIPMENT_DB_SAFE).length === 0) return;
        gameState.hub.itemModalContext = context;
        DOM.modals.itemSelect.style.display = 'flex';
        
        const title = context.startsWith('equip_') ? `Select ${context.split('_')[1]}` : (context === 'embed_gear' ? 'Select Gear' : 'Select Component');
        DOM.modals.itemSelectTitle.textContent = title;

        const isComp = context === 'embed_component';
        DOM.modals.itemSelectFilterBar.querySelectorAll('.modal-filter-btn').forEach(btn => {
            const f = btn.dataset.filter;
            if (f === 'all') btn.style.display = 'inline-block';
            else if (f === 'component') btn.style.display = isComp ? 'inline-block' : 'none';
            else btn.style.display = !isComp ? 'inline-block' : 'none';
        });
        renderItemModalGrid(defaultFilter);
    }

    function renderItemModalGrid(filter) {
        const grid = DOM.modals.itemSelectGrid; grid.innerHTML = '';
        const context = gameState.hub.itemModalContext;
        DOM.modals.itemSelectFilterBar.querySelectorAll('.modal-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));

        let items = [];
        if (context.startsWith('equip_')) {
            items = gameState.player.inventory.equipment.filter(i => i.slot === context.split('_')[1]);
        } else if (context === 'embed_gear') {
            items = gameState.player.inventory.equipment;
        } else if (context === 'embed_component') {
            const gear = gameState.hub.embed.slotGear;
            if (gear) {
                const base = EQUIPMENT_DB_SAFE[gear.item_id];
                const allowed = (base && SYNERGY_MAP_SAFE[base.synergy]) ? SYNERGY_MAP_SAFE[base.synergy] : ["universal"];
                Object.entries(gameState.player.inventory.components).forEach(([id, qty]) => {
                    if (qty > 0 && COMPONENTS_DB_SAFE[id] && allowed.includes(COMPONENTS_DB_SAFE[id].type)) items.push(COMPONENTS_DB_SAFE[id]);
                });
            }
        }

        if (filter !== 'all') {
            items = items.filter(i => {
                if (i.instance_id) return i.slot === filter; 
                return true; 
            });
        }

        if (items.length === 0) { DOM.modals.itemSelectPlaceholder.style.display = 'block'; return; }
        DOM.modals.itemSelectPlaceholder.style.display = 'none';

        items.forEach(item => {
            const id = item.instance_id || item.id;
            const card = document.createElement('div');
            card.className = 'item-card'; 
            // Usa a função de card HTML
            card.innerHTML = generateItemCardHTML(item, `<button class="action-btn small-btn select-item-btn" data-item-id="${id}">Select</button>`);
            grid.appendChild(card);
        });
    }

    function handleItemSelect(id) {
        const context = gameState.hub.itemModalContext;
        if (context.startsWith('equip_')) equipItem(id, context.split('_')[1]);
        else if (context === 'embed_gear') {
            gameState.hub.embed.slotGear = gameState.player.inventory.equipment.find(e => e.instance_id === id);
            renderWsEmbed();
        } else if (context === 'embed_component') {
            gameState.hub.embed.slotComponent = id; 
            renderWsEmbed();
        }
        closeItemSelectionModal();
    }
    function closeItemSelectionModal() { DOM.modals.itemSelect.style.display = 'none'; gameState.hub.itemModalContext = null; }

    // --- EQUIP & EMBED HELPERS ---
    function equipItem(id, slot) { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (kid) { kid.equipped[slot] = id; renderHubPreparationScreen(); } }
    function unequipItem(slot) { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (kid) { kid.equipped[slot] = null; renderHubPreparationScreen(); } }
    function openEditNameModal() { DOM.modals.editNameInput.value = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId).name; DOM.modals.editName.style.display = 'flex'; }
    function closeEditNameModal() { DOM.modals.editName.style.display = 'none'; }
    function saveEditName() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        const newName = DOM.modals.editNameInput.value;
        if (newName) { kid.name = newName; renderHubPreparationScreen(); closeEditNameModal(); }
    }

    // --- EMBED UI ---
    function renderWsEmbed() {
        const { slotGear, slotComponent } = gameState.hub.embed;
        const ui = DOM.hubPreparation.embedUi;
        const gearDiv = DOM.hubPreparation.embedSlotGear;
        const compDiv = DOM.hubPreparation.embedSlotComponent;

        if (slotGear) {
            gearDiv.innerHTML = `<img src="${slotGear.icon}" width="40"><br>${slotGear.name}`;
            gearDiv.classList.add('equipped');
            ui.querySelector('.embed-remove-btn[data-slot-type="gear"]').style.display = 'block';
        } else {
            gearDiv.innerHTML = '<span>Select Gear</span>';
            gearDiv.classList.remove('equipped');
            ui.querySelector('.embed-remove-btn[data-slot-type="gear"]').style.display = 'none';
        }

        if (slotComponent) {
            const cInfo = COMPONENTS_DB_SAFE[slotComponent];
            compDiv.innerHTML = `<img src="${cInfo.icon}" width="40"><br>${cInfo.name}`;
            compDiv.classList.add('equipped');
            ui.querySelector('.embed-remove-btn[data-slot-type="component"]').style.display = 'block';
        } else {
            compDiv.innerHTML = '<span>Select Comp</span>';
            compDiv.classList.remove('equipped');
            ui.querySelector('.embed-remove-btn[data-slot-type="component"]').style.display = 'none';
        }
        compDiv.classList.toggle('disabled', !slotGear);
        DOM.hubPreparation.embedBtn.disabled = !(slotGear && slotComponent);
    }

    function clearEmbedSlot(type) {
        if (type === 'gear') { gameState.hub.embed.slotGear = null; gameState.hub.embed.slotComponent = null; }
        else { gameState.hub.embed.slotComponent = null; }
        renderWsEmbed();
    }

    function performEmbedAction() {
        const gear = gameState.hub.embed.slotGear;
        const compId = gameState.hub.embed.slotComponent;
        if (!gear || !compId) return;

        if (gameState.player.inventory.components[compId] > 0) {
            gameState.player.inventory.components[compId]--;
        } else { alert("Not enough components!"); return; }

        const slotIndex = gear.embed_slots.findIndex(s => s.component === null);
        if (slotIndex !== -1) {
            gear.embed_slots[slotIndex].component = compId;
            console.log("Embedded!");
        } else { alert("No slots available!"); return; }

        clearEmbedSlot('gear');
        DOM.modals.embedConfirm.style.display = 'none';
        renderHubPreparationScreen();
    }

    function openEmbedConfirmModal() {
        const gear = gameState.hub.embed.slotGear;
        const comp = COMPONENTS_DB_SAFE[gameState.hub.embed.slotComponent];
        DOM.modals.embedBefore.innerHTML = "<h4>Current</h4>";
        if(gear.stats) Object.entries(gear.stats).forEach(([k,v]) => DOM.modals.embedBefore.innerHTML += `${k}: +${v}<br>`);
        DOM.modals.embedAfter.innerHTML = `<h4>Add: ${comp.name}</h4>`;
        if(comp.stats) Object.entries(comp.stats).forEach(([k,v]) => DOM.modals.embedAfter.innerHTML += `${k}: +${v}<br>`);
        DOM.modals.embedConfirm.style.display = 'flex';
    }
    function closeEmbedConfirmModal() { DOM.modals.embedConfirm.style.display = 'none'; }


    /* ==================================================================== */
    /* SEÇÃO 8: LÓGICA DA TELA 4 (GAME) E COMBATE
    /* ==================================================================== */
    // (Mesmas funções de V4.5, resumidas aqui para garantir funcionamento)
    function startGameplay() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if(!kid) return;
        gameState.expedition.kid = JSON.parse(JSON.stringify(kid));
        gameState.expedition.stats = calculateFinalStats(kid);
        gameState.expedition.currentDay = 1;
        gameState.expedition.playerPos = getSpawnPoint(kid.tribe.biome);
        gameState.expedition.currentHP = gameState.expedition.stats.hp;
        gameState.expedition.currentAP = gameState.expedition.stats.ap;
        gameState.expedition.maxAP = gameState.expedition.stats.ap;
        gameState.expedition.currentMP = gameState.expedition.stats.speed;
        gameState.expedition.maxMP = gameState.expedition.stats.speed;
        gameState.expedition.resourcesFound = {};
        gameState.expedition.revealedHexes.clear();
        gameState.expedition.startTime = Date.now();
        DOM.game.log.innerHTML = ''; logMessage("--- DAY 1 START ---", 'day');
        renderImageMap(); revealAdjacentHexes(gameState.expedition.playerPos); updateFogOfWar(); updatePlayerHexPosition(); renderGameStatusPanel();
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
            amount = Math.ceil(amount * (1 + luck)); 
            
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
            console.error("ERRO: Bancos de dados não carregados!");
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
        if (gameState.timers.actionFeedback) clearTimeout(gameState.timers.actionFeedback);
        DOM.modals.feedbackTitle.textContent = title;
        DOM.modals.feedbackDesc.textContent = description;
        DOM.modals.feedback.style.display = 'flex';
        gameState.timers.actionFeedback = setTimeout(() => { closeActionFeedbackModal(); }, 3000); 
    }
    function closeActionFeedbackModal() {
        if (gameState.timers.actionFeedback) { clearTimeout(gameState.timers.actionFeedback); gameState.timers.actionFeedback = null; }
        DOM.modals.feedback.style.display = 'none';
    }

    function endDay() {
        if (gameState.expedition.currentDay >= MAX_DAYS) {
            logMessage("Expedition finished (10 days).", 'day');
            gameOver(true);
            return;
        }
        gameState.expedition.currentDay++;
        if (DOM.game.skipAnimationsCheck.checked) { proceedToEndDayLogic(); } else { showEndDayModal(); }
    }
    function showEndDayModal() {
        if (gameState.timers.endDay) clearTimeout(gameState.timers.endDay);
        DOM.modals.endDayTitle.textContent = `DAY ${gameState.expedition.currentDay} START`;
        DOM.modals.endDay.style.display = 'flex';
        gameState.timers.endDay = setTimeout(() => { closeEndDayModal(); }, 3000); 
    }
    function closeEndDayModal() {
        if (gameState.timers.endDay) { clearTimeout(gameState.timers.endDay); gameState.timers.endDay = null; }
        DOM.modals.endDay.style.display = 'none';
        proceedToEndDayLogic();
    }
    function proceedToEndDayLogic() {
        gameState.expedition.currentAP = gameState.expedition.stats.ap;
        gameState.expedition.currentMP = gameState.expedition.stats.speed;
        gameState.expedition.currentHP += gameState.expedition.stats.hpRegen;
        if (gameState.expedition.currentHP > gameState.expedition.stats.hp) gameState.expedition.currentHP = gameState.expedition.stats.hp;
        logMessage(`--- DAY ${gameState.expedition.currentDay} START ---`, 'day');
        renderGameStatusPanel();
    }

    function gameOver(isSuccess) { showEndExpeditionModal(isSuccess); }
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
                    DOM.modals.endExpeditionList.innerHTML += `<li><img src="${itemDB.icon}" width="20"><span>${amount}x ${itemDB.name}</span></li>`;
                    found++;
                }
            }
            if (found === 0) DOM.modals.endExpeditionList.innerHTML = '<p>No resources found.</p>';
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
                    if (!gameState.player.inventory.materials[resId]) gameState.player.inventory.materials[resId] = 0;
                    gameState.player.inventory.materials[resId] += gameState.expedition.resourcesFound[resId];
                } else if (COMPONENTS_DB_SAFE[resId]) {
                    if (!gameState.player.inventory.components[resId]) gameState.player.inventory.components[resId] = 0;
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
    /* SEÇÃO: INICIALIZAÇÃO DE LISTENERS
    /* ==================================================================== */
    function initialize() {
        console.log("CyberKidz V5.4 Init (Rich Cards).");
        
        // Home
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);

        // Hub Selection
        DOM.hubSelection.nftGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('select-kid-btn')) handleKidSelect(e.target.dataset.kidId);
        });
        DOM.hubSelection.paginationNext.addEventListener('click', () => {
            gameState.hub.pagination.currentPage++; renderHubSelectionScreen();
        });
        DOM.hubSelection.paginationPrev.addEventListener('click', () => {
            gameState.hub.pagination.currentPage--; renderHubSelectionScreen();
        });

        // Hub Prep
        DOM.hubPreparation.backToSelectionBtn.addEventListener('click', () => showScreen('hub-selection-screen'));
        DOM.hubPreparation.startExpeditionBtn.addEventListener('click', startGameplay);
        
        // Mannequin
        DOM.hubPreparation.mannequin.addEventListener('click', (e) => {
            if (e.target.closest('.equip-slot')) {
                const div = e.target.closest('.equip-slot');
                if (!div.classList.contains('equipped')) openItemSelectionModal(`equip_${div.dataset.slot}`);
            }
            if (e.target.closest('.equip-remove-btn')) unequipItem(e.target.closest('.equip-remove-btn').dataset.slot);
        });

        // Workshop Tabs
        DOM.hubPreparation.workshopPanel.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-btn');
            if (btn) {
                if (btn.dataset.mainTab) gameState.hub.tabs.activeMainTab = btn.dataset.mainTab;
                if (btn.dataset.subTab) {
                    if (btn.dataset.subTab.startsWith('inv')) gameState.hub.tabs.activeInvSubTab = btn.dataset.subTab;
                    else gameState.hub.tabs.activeWsSubTab = btn.dataset.subTab;
                }
                renderWorkshopTabs();
            }
        });

        // Embed UI
        DOM.hubPreparation.embedUi.addEventListener('click', (e) => {
            if (e.target.closest('.embed-remove-btn')) clearEmbedSlot(e.target.closest('.embed-remove-btn').dataset.slotType);
            else if (e.target.closest('#embed-slot-gear')) openItemSelectionModal('embed_gear');
            else if (e.target.closest('#embed-slot-component')) {
                if (gameState.hub.embed.slotGear) openItemSelectionModal('embed_component');
            }
        });
        DOM.hubPreparation.embedBtn.addEventListener('click', openEmbedConfirmModal);
        DOM.modals.embedCancelBtn.addEventListener('click', () => DOM.modals.embedConfirm.style.display = 'none');
        DOM.modals.embedConfirmBtn.addEventListener('click', performEmbedAction);

        // Modal Item Select
        DOM.modals.itemSelectCloseBtn.addEventListener('click', closeItemSelectionModal);
        DOM.modals.itemSelectFilterBar.addEventListener('click', (e) => {
            if (e.target.dataset.filter) renderItemModalGrid(e.target.dataset.filter);
        });
        DOM.modals.itemSelectGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.select-item-btn');
            if (btn) handleItemSelect(btn.dataset.itemId);
        });

        // Auto Equip
        const autoBtn = document.getElementById('auto-equip-btn');
        if (autoBtn) autoBtn.addEventListener('click', autoEquip);
        const removeBtn = document.getElementById('remove-all-btn');
        if (removeBtn) removeBtn.addEventListener('click', removeAllEquipment);

        // Edit Name
        DOM.modals.editName.querySelector('button').addEventListener('click', () => DOM.modals.editName.style.display = 'none'); 
        DOM.hubPreparation.editNameBtn.addEventListener('click', () => DOM.modals.editName.style.display = 'flex');

        // Game
        DOM.game.exitExpeditionBtn.addEventListener('click', () => gameOver(true));
        DOM.game.collectBtn.addEventListener('click', handleCollect);
        DOM.game.investigateBtn.addEventListener('click', handleInvestigate);
        DOM.game.searchEnemyBtn.addEventListener('click', handleSearchEnemy);
        DOM.game.endTurnBtn.addEventListener('click', endDay);

        // Combat
        DOM.modals.combatAttackBtn.addEventListener('click', handleCombatAttack);
        DOM.modals.combatFleeBtn.addEventListener('click', handleCombatFlee);
        DOM.modals.combatAutoBtn.addEventListener('click', toggleAutoAttack);
        DOM.modals.combatCloseVictoryBtn.addEventListener('click', closeCombatModal);
        DOM.modals.combatReturnHubBtn.addEventListener('click', () => { closeCombatModal(); handleReturnToHub(false); });

        // Other Modais
        DOM.modals.feedbackCloseBtn.addEventListener('click', closeActionFeedbackModal);
        DOM.modals.endDayCloseBtn.addEventListener('click', closeEndDayModal);
        DOM.modals.endExpeditionReturnBtn.addEventListener('click', () => handleReturnToHub(DOM.modals.endExpeditionTitle.textContent.includes("Successful")));
        DOM.modals.endExpeditionCloseBtn.addEventListener('click', () => handleReturnToHub(DOM.modals.endExpeditionTitle.textContent.includes("Successful")));

        initializeMockWallet();
        showScreen('logged-out-screen');
    }

    initialize();
});
