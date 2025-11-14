/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 10.0 (Rescue - Fallback Data & Robust Logic)
// ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("System: DOM Loaded. Initializing V10.0...");

    /* 1. DADOS DE SEGURANÇA COMPLETOS (FALLBACKS) */
    const FALLBACK = {
        // Dados básicos para não quebrar a UI
        MATERIALS: { 
            'mat_scrap': { name: "Scrap", icon: "images/icons/materials/mat_scrap.png" },
            'mat_metal': { name: "Metal", icon: "images/icons/materials/mat_metal.png" },
            'mat_food': { name: "Food", icon: "images/icons/materials/mat_food.png" },
            'mat_water': { name: "Water", icon: "images/icons/materials/mat_water.png" }
        },
        EQUIPMENT: { 
            "eq_rust_helmet": { id: "eq_rust_helmet", name: "Rustic Helmet", slot: "helmet", synergy: "defense", base_stats: { hp: 10 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_helmet.png' },
            "eq_rust_weapon": { id: "eq_rust_weapon", name: "Rustic Blade", slot: "weapon", synergy: "damage", base_stats: { damage: 3 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_weapon.png' },
            "eq_rust_armor": { id: "eq_rust_armor", name: "Rustic Armor", slot: "armor", synergy: "defense", base_stats: { hp: 20 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_armor.png' }
        },
        COMPONENTS: { 
            "comp_def_1": { id: "comp_def_1", name: "Defense Plate", type: "defense", stats: { defense: 5 }, icon: 'images/icons/components/comp_def_1.png' },
            "comp_dmg_1": { id: "comp_dmg_1", name: "Volcanic Core", type: "damage", stats: { damage: 5 }, icon: 'images/icons/components/comp_dmg_1.png' }
        },
        WALLET: [ 
            { id: '#313', name: 'Blue Mutant', tribe: { name: 'Radioactives', biome: 'radioactives' }, expeditions: 0, equipped: {} },
            { id: '#111', name: 'Demo Kid', tribe: { name: 'Volcanics', biome: 'volcanics' }, expeditions: 10, equipped: {} } 
        ],
        TRIBES: { 
            VOLCANICS: { name: "Volcanics", biome: "volcanics", baseStats: { damage: 4, hp: 110, speed: 10 } },
            RADIOACTIVES: { name: "Radioactives", biome: "radioactives", baseStats: { damage: 3, hp: 90, speed: 12 } }
        },
        MAP: new Map([["0,0", {biome: "wasteland"}], ["1,0", {biome: "volcanics"}]]),
        SPAWN: {
            "Investigate": { cost: 1, chances: [{type: 'nothing', chance: 50}, {type: 'common', chance: 50}] },
            "Search Enemy": { cost: 2, chances: [{type: 'common', chance: 100}] }
        },
        DROPS: {
            "volcanics": { collect: [{ item: "mat_scrap", quantity: [1, 5] }], investigate: [{ chance: 50, type: 'common', item: "mat_scrap", quantity: [5, 10] }] },
            "wasteland": { collect: [{ item: "mat_scrap", quantity: [1, 5] }] },
            "radioactives": { collect: [{ item: "mat_scrap", quantity: [1, 5] }] }
        },
        ENEMIES: {
            "volcanics": { "common": { name: "Magma Crawler", stats: { hp: 20, strength: 5 } } },
            "wasteland": { "common": { name: "Rat", stats: { hp: 10, strength: 2 } } }
        }
    };

    /* 2. INTEGRAÇÃO DE DADOS (Tenta carregar externo, usa fallback se falhar) */
    const getDB = (varName, fallback) => {
        return (typeof window[varName] !== 'undefined') ? window[varName] : fallback;
    };

    const DB = {
        TRIBE: getDB('TRIBES', FALLBACK.TRIBES),
        MAT: getDB('MATERIALS_DB', FALLBACK.MATERIALS),
        COMP: getDB('COMPONENTS_DB', FALLBACK.COMPONENTS),
        EQUIP: getDB('EQUIPMENT_DB', FALLBACK.EQUIPMENT),
        MAP: getDB('STATIC_MAP_DATA', FALLBACK.MAP),
        RECIPE: getDB('RECIPES_DB', {}),
        WALLET: getDB('MOCK_WALLET', FALLBACK.WALLET),
        SYNERGY: getDB('SYNERGY_MAP', {}),
        SPAWN: getDB('SPAWN_LOGIC', FALLBACK.SPAWN),
        DROP: getDB('DROP_TABLES', FALLBACK.DROPS),
        ENEMY: getDB('ENEMIES_BY_BIOME', FALLBACK.ENEMIES)
    };

    // Diagnóstico no Console
    console.log("DB Loaded. Wallet Size:", DB.WALLET.length);

    const ITEM_DB = { ...DB.MAT, ...DB.COMP, ...DB.EQUIP };
    const RECIPES_CRAFT = {};
    for (const [id, recipeData] of Object.entries(DB.RECIPE)) {
        if (DB.EQUIP[id]) RECIPES_CRAFT[id] = { ...DB.EQUIP[id], cost: recipeData.cost };
    }

    const MAX_DAYS = 10;
    const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
    const STATS_LIST = ['hp', 'ap', 'speed', 'damage', 'defense', 'critChance', 'critDamage', 'attackSpeed', 'hpRegen', 'blockChance', 'luck'];
    const DEMO_KID_ID = '#313';

    /* 3. GAME STATE */
    let gameState = {
        currentScreen: 'logged-out-screen',
        player: {
            tezerium: 1000,
            inventory: {
                materials: { "mat_scrap": 100, "mat_water": 50 },
                components: { "comp_def_1": 2 },
                equipment: [] // Preenchido no init
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

    /* 4. DOM CACHE */
    const DOM = {
        header: { tezeriumDisplay: document.getElementById('tezerium-display'), tezeriumBalance: document.getElementById('tezerium-balance'), headerConnectBtn: document.getElementById('header-connect-btn'), connectionStatus: document.getElementById('connection-status') },
        screens: { 'logged-out-screen': document.getElementById('logged-out-screen'), 'hub-selection-screen': document.getElementById('hub-selection-screen'), 'hub-preparation-screen': document.getElementById('hub-preparation-screen'), 'game-screen': document.getElementById('game-screen') },
        loggedOut: { bodyConnectBtn: document.getElementById('body-connect-btn'), demoGameBtn: document.getElementById('demo-game-btn') },
        hubSelection: { nftGrid: document.getElementById('nft-selection-grid'), nftGridPlaceholder: document.getElementById('nft-grid-placeholder'), paginationPrev: document.getElementById('pagination-prev'), paginationNext: document.getElementById('pagination-next'), paginationInfo: document.getElementById('pagination-info'), filterSearch: document.getElementById('filter-search'), filterTribe: document.getElementById('filter-tribe'), filterItemsPerPage: document.getElementById('filter-items-per-page'), filterResetBtn: document.getElementById('filter-reset-btn') },
        hubPreparation: {
            backToSelectionBtn: document.getElementById('back-to-selection-btn'), startExpeditionBtn: document.getElementById('start-expedition-btn'), kidImage: document.getElementById('prep-kid-image'), kidName: document.getElementById('prep-kid-name-display'), editNameBtn: document.getElementById('edit-name-btn'), kidTribe: document.getElementById('prep-kid-tribe'), kidId: document.getElementById('prep-kid-id'), kidExpeditions: document.getElementById('prep-kid-expeditions'), mannequin: document.querySelector('.equipment-mannequin'), statsDisplay: document.getElementById('prep-stats-display'), workshopPanel: document.getElementById('workshop-panel'), mainTabs: document.querySelector('.main-tabs'), mainTabInventory: document.getElementById('main-tab-inventory'), mainTabWorkshop: document.getElementById('main-tab-workshop'), materialsTableBody: document.getElementById('materials-table-body'), embedUi: document.querySelector('.embed-ui'), embedSlotGear: document.getElementById('embed-slot-gear'), embedSlotComponent: document.getElementById('embed-slot-component'), embedBtn: document.getElementById('embed-btn'), craftRecipeList: document.getElementById('craft-recipe-list'), craftRecipeDetails: document.getElementById('craft-recipe-details')
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

    /* 5. HELPERS */
    function generateStartingInventory() {
        if (Object.keys(DB.EQUIP).length === 0) return [];
        return Object.values(DB.EQUIP).map((item, index) => {
            const slots = [];
            const totalSlots = item.slots_total || 3;
            for (let i = 0; i < totalSlots; i++) slots.push({ component: null });
            return {
                instance_id: `inst_${index + 1000}`, item_id: item.id, name: item.name, level: 1,
                slot: item.slot, synergy: item.synergy, stats: { ...item.base_stats },
                icon: item.icon, embed_slots: slots, slots_unlocked: item.slots_unlocked || 1
            };
        });
    }

    function generateItemCardHTML(item, actionButtonHTML) {
        const isEquipment = !!item.instance_id;
        let statsStr = "";
        const statsObj = item.stats || item.base_stats || {};
        Object.entries(statsObj).forEach(([k, v]) => { if (v !== 0) statsStr += `<div class="card-stat-row"><span>${k}</span><span class="card-stat-val">+${v}</span></div>`; });

        let slotsHTML = "";
        if (isEquipment) {
            const slots = item.embed_slots || Array(item.slots_total || 3).fill({component:null});
            slots.forEach((s, index) => {
                let slotClass = "locked", icon = "🔒", text = `Locked (Lvl ${index > 0 ? 5 * index : 1})`, bonus = "";
                const unlocked = item.slots_unlocked || 1;
                if (index < unlocked) {
                    if (s.component) {
                        slotClass = "filled";
                        const comp = DB.COMP[s.component];
                        if (comp) { icon = `<img src="${comp.icon}" class="slot-bar-icon">`; text = comp.name; const firstStat = Object.keys(comp.stats)[0]; bonus = `+${comp.stats[firstStat]} ${firstStat}`; } 
                        else { icon = "❓"; text = "Unknown"; }
                    } else { slotClass = "empty"; icon = "+"; text = "Empty Slot"; }
                }
                slotsHTML += `<div class="slot-bar ${slotClass}"><div style="width:24px; text-align:center;">${icon}</div><div class="slot-bar-text">${text}</div><div class="slot-bar-bonus">${bonus}</div></div>`;
            });
        } else { slotsHTML = `<div class="slot-bar filled"><div class="slot-bar-text" style="text-align:center">Type: ${item.type ? item.type.toUpperCase() : 'UNIVERSAL'}</div></div>`; }

        return `<div class="card-header"><div class="card-icon-frame"><img src="${item.icon}" onerror="this.src='images/kid-placeholder.png'"></div><div class="card-header-text"><h4>${item.name}</h4>${isEquipment ? `<span class="card-level">Lvl ${item.level || 1}</span>` : ''}</div></div><div class="card-body">${statsStr || '<div class="card-stat-row"><span>No Stats</span></div>'}</div><div class="card-footer">${slotsHTML}</div><div class="card-actions">${actionButtonHTML}</div>`;
    }

    function getRandomPlaceholderImg(tribeName) {
        return `images/kid-placeholder.png`; // Placeholder seguro
    }

    /* 6. LÓGICA DE TELAS */
    function showScreen(screenId) {
        Object.values(DOM.screens).forEach(s => s.style.display = 'none');
        if (DOM.screens[screenId]) DOM.screens[screenId].style.display = 'block';
        gameState.currentScreen = screenId;
    }

    function initializeMockWallet() {
        gameState.player.kidz = JSON.parse(JSON.stringify(DB.WALLET)).map(kid => {
            kid.equipped = {}; EQUIPMENT_SLOTS.forEach(slot => kid.equipped[slot] = null);
            const tName = (kid.tribe && kid.tribe.name) ? kid.tribe.name : "Volcanics";
            kid.placeholderImg = getRandomPlaceholderImg(tName);
            return kid;
        });
        gameState.player.inventory.equipment = generateStartingInventory();
        const select = DOM.hubSelection.filterTribe; 
        if (select) {
            select.innerHTML = '<option value="all">All Tribes</option>';
            Object.values(DB.TRIBE).forEach(t => select.innerHTML += `<option value="${t.name}">${t.name}</option>`);
        }
    }

    function handleConnectWallet() {
        console.log("Connecting...");
        initializeMockWallet();
        DOM.header.tezeriumDisplay.style.visibility = 'visible'; DOM.header.tezeriumBalance.textContent = gameState.player.tezerium;
        DOM.header.headerConnectBtn.style.display = 'none'; DOM.header.connectionStatus.style.display = 'inline';
        gameState.hub.pagination.currentPage = 1;
        renderHubSelectionScreen();
        showScreen('hub-selection-screen');
    }

    function handleDemoGame() {
        console.log("Starting Demo...");
        initializeMockWallet();
        const demoKid = gameState.player.kidz.find(k => k.id === DEMO_KID_ID) || gameState.player.kidz[0];
        if (demoKid) {
            gameState.hub.activeKidId = demoKid.id;
            startGameplay();
        }
    }

    function renderHubSelectionScreen() {
        const grid = DOM.hubSelection.nftGrid; grid.innerHTML = '';
        const pageItems = gameState.player.kidz; // Simplificado para teste
        if (pageItems.length === 0) DOM.hubSelection.nftGridPlaceholder.style.display = 'block';
        else {
            DOM.hubSelection.nftGridPlaceholder.style.display = 'none';
            pageItems.forEach(kid => {
                const card = document.createElement('div'); card.className = 'nft-card panel';
                const tribeName = kid.tribe ? kid.tribe.name : "Unknown";
                card.innerHTML = `<img src="${kid.placeholderImg}"><h4>${kid.name}</h4><p>ID: ${kid.id}</p><p>${tribeName}</p><button class="action-btn select-kid-btn" data-kid-id="${kid.id}">Manage</button>`;
                grid.appendChild(card);
            });
        }
    }

    function handleKidSelect(id) {
        console.log("Kid Select Clicked:", id);
        gameState.hub.activeKidId = id;
        renderHubPreparationScreen();
        showScreen('hub-preparation-screen');
    }

    // --- HUB PREPARATION ---
    function renderHubPreparationScreen() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (!kid) return;
        DOM.hubPreparation.kidImage.innerHTML = `<img src="${kid.placeholderImg}">`;
        DOM.hubPreparation.kidName.firstChild.textContent = kid.name + ' ';
        renderManequim(kid); renderWorkshopTabs();
    }

    function renderManequim(kid) {
        EQUIPMENT_SLOTS.forEach(slot => {
            const div = DOM.hubPreparation.mannequin.querySelector(`.equip-slot[data-slot="${slot}"]`);
            const btn = DOM.hubPreparation.mannequin.querySelector(`.equip-remove-btn[data-slot="${slot}"]`);
            const instanceId = kid.equipped[slot];
            const item = instanceId ? gameState.player.inventory.equipment.find(e => e.instance_id === instanceId) : null;
            if (item) { div.innerHTML = `<img src="${item.icon}" onerror="this.style.display='none'">`; div.classList.add('equipped'); btn.style.display = 'block'; }
            else { div.innerHTML = '<span>+</span>'; div.classList.remove('equipped'); btn.style.display = 'none'; }
        });
    }

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
        if (subTab === 'ws-craft') renderWsCraft();
    }

    function renderInvEquipments() {
        const el = document.getElementById('sub-tab-inv-equipments'); el.className = 'item-grid-container'; el.innerHTML = '';
        gameState.player.inventory.equipment.forEach(item => {
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = generateItemCardHTML(item, ''); 
            el.appendChild(card);
        });
    }
    function renderInvComponents() {
        const el = document.getElementById('sub-tab-inv-components'); el.className = 'item-grid-container'; el.innerHTML = '';
        Object.entries(gameState.player.inventory.components).forEach(([id, qty]) => {
            if (qty > 0 && DB.COMP[id]) {
                const card = document.createElement('div'); card.className = 'item-card';
                card.innerHTML = generateItemCardHTML(DB.COMP[id], `<div style="text-align:center; padding:5px;">Qty: ${qty}</div>`);
                el.appendChild(card);
            }
        });
    }
    function renderInvMaterials() {
        const tbody = DOM.hubPreparation.materialsTableBody; tbody.innerHTML = '';
        Object.entries(gameState.player.inventory.materials).forEach(([id, qty]) => {
            if (qty > 0 && ITEM_DB[id]) tbody.innerHTML += `<tr><td><img src="${ITEM_DB[id].icon}" width="24"></td><td>${ITEM_DB[id].name}</td><td>${qty}</td></tr>`;
        });
    }
    function renderWsCraft() {
        DOM.hubPreparation.craftRecipeList.innerHTML = '';
        for(const [id, recipe] of Object.entries(RECIPES_CRAFT)) {
            DOM.hubPreparation.craftRecipeList.innerHTML += `<div class="recipe-item" data-recipe-id="${id}">${recipe.name}</div>`;
        }
    }

    // --- EMBED LOGIC ---
    function renderWsEmbed() { 
        const { slotGear, slotComponent } = gameState.hub.embed;
        const ui = DOM.hubPreparation.embedUi;
        const gearDiv = DOM.hubPreparation.embedSlotGear; const compDiv = DOM.hubPreparation.embedSlotComponent;
        
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
            const cInfo = DB.COMP[slotComponent];
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
        const gear = gameState.hub.embed.slotGear; const compId = gameState.hub.embed.slotComponent;
        if (!gear || !compId) return;
        if (gameState.player.inventory.components[compId] > 0) gameState.player.inventory.components[compId]--; else { alert("Not enough components!"); return; }
        const slotIndex = gear.embed_slots.findIndex(s => s.component === null);
        if (slotIndex !== -1) { gear.embed_slots[slotIndex].component = compId; console.log("Embedded!"); } else { alert("No slots available!"); return; }
        clearEmbedSlot('gear'); DOM.modals.embedConfirm.style.display = 'none'; renderHubPreparationScreen();
    }
    function openEmbedConfirmModal() {
        const gear = gameState.hub.embed.slotGear; const comp = DB.COMP[gameState.hub.embed.slotComponent];
        DOM.modals.embedBefore.innerHTML = "<h4>Current</h4>"; if(gear.stats) Object.entries(gear.stats).forEach(([k,v]) => DOM.modals.embedBefore.innerHTML += `${k}: +${v}<br>`);
        DOM.modals.embedAfter.innerHTML = `<h4>Add: ${comp.name}</h4>`; if(comp.stats) Object.entries(comp.stats).forEach(([k,v]) => DOM.modals.embedAfter.innerHTML += `${k}: +${v}<br>`);
        DOM.modals.embedConfirm.style.display = 'flex';
    }

    // --- MODAL ---
    function openItemSelectionModal(context) {
        gameState.hub.itemModalContext = context;
        DOM.modals.itemSelect.style.display = 'flex';
        renderItemModalGrid('all');
    }
    function renderItemModalGrid(filter) {
        const grid = DOM.modals.itemSelectGrid; grid.innerHTML = '';
        const context = gameState.hub.itemModalContext;
        let items = [];
        
        if (context.startsWith('equip_')) items = gameState.player.inventory.equipment.filter(i => i.slot === context.split('_')[1]);
        else if (context === 'embed_gear') items = gameState.player.inventory.equipment;
        else if (context === 'embed_component') {
            const gear = gameState.hub.embed.slotGear;
            if (gear) {
                const base = DB.EQUIP[gear.item_id];
                const allowed = (base && DB.SYNERGY[base.synergy]) ? DB.SYNERGY[base.synergy] : ["universal"];
                Object.entries(gameState.player.inventory.components).forEach(([id, qty]) => {
                    if (qty > 0 && DB.COMP[id] && allowed.includes(DB.COMP[id].type)) items.push(DB.COMP[id]);
                });
            }
        }

        if (filter !== 'all') items = items.filter(i => { if (i.instance_id) return i.slot === filter; return true; });
        
        if (items.length === 0) { DOM.modals.itemSelectPlaceholder.style.display = 'block'; return; }
        DOM.modals.itemSelectPlaceholder.style.display = 'none';

        items.forEach(item => {
            const id = item.instance_id || item.id;
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = generateItemCardHTML(item, `<button class="action-btn small-btn select-item-btn" data-item-id="${id}">Select</button>`);
            grid.appendChild(card);
        });
    }
    function handleItemSelect(id) {
        const context = gameState.hub.itemModalContext;
        if (context.startsWith('equip_')) equipItem(id, context.split('_')[1]);
        else if (context === 'embed_gear') { gameState.hub.embed.slotGear = gameState.player.inventory.equipment.find(e => e.instance_id === id); renderWsEmbed(); }
        else if (context === 'embed_component') { gameState.hub.embed.slotComponent = id; renderWsEmbed(); }
        closeItemSelectionModal();
    }
    function closeItemSelectionModal() { DOM.modals.itemSelect.style.display = 'none'; gameState.hub.itemModalContext = null; }
    function equipItem(id, slot) { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (kid) { kid.equipped[slot] = id; renderHubPreparationScreen(); } }
    function unequipItem(slot) { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (kid) { kid.equipped[slot] = null; renderHubPreparationScreen(); } }

    // --- GAMEPLAY (Resumido) ---
    function startGameplay() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (!kid) return;
        gameState.expedition.kid = JSON.parse(JSON.stringify(kid));
        showScreen('game-screen');
    }
    function handleCollect() { alert("Collect!"); } // Stub
    function handleInvestigate() { alert("Investigate!"); } // Stub
    function handleSearchEnemy() { alert("Search!"); } // Stub
    function endDay() { alert("End Day!"); } // Stub
    function gameOver() { showScreen('hub-preparation-screen'); }

    // --- INITIALIZE ---
    function initialize() {
        console.log("Initializing Listeners...");
        
        // Home
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);

        // Hub Selection (Event Delegation Seguro)
        DOM.hubSelection.nftGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.select-kid-btn');
            if (btn) handleKidSelect(btn.dataset.kidId);
        });

        // Hub Prep
        DOM.hubPreparation.backToSelectionBtn.addEventListener('click', () => showScreen('hub-selection-screen'));
        DOM.hubPreparation.startExpeditionBtn.addEventListener('click', startGameplay);
        
        DOM.hubPreparation.mannequin.addEventListener('click', (e) => {
            if (e.target.closest('.equip-slot')) { const div = e.target.closest('.equip-slot'); if (!div.classList.contains('equipped')) openItemSelectionModal(`equip_${div.dataset.slot}`); }
            if (e.target.closest('.equip-remove-btn')) unequipItem(e.target.closest('.equip-remove-btn').dataset.slot);
        });
        
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
            else if (e.target.closest('#embed-slot-component')) { if (gameState.hub.embed.slotGear) openItemSelectionModal('embed_component'); }
        });
        DOM.hubPreparation.embedBtn.addEventListener('click', openEmbedConfirmModal);
        DOM.modals.embedCancelBtn.addEventListener('click', () => DOM.modals.embedConfirm.style.display = 'none');
        DOM.modals.embedConfirmBtn.addEventListener('click', performEmbedAction);

        // Modal Universal
        DOM.modals.itemSelectCloseBtn.addEventListener('click', closeItemSelectionModal);
        DOM.modals.itemSelectFilterBar.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-filter-btn')) renderItemModalGrid(e.target.dataset.filter);
        });
        DOM.modals.itemSelectGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.select-item-btn');
            if (btn) handleItemSelect(btn.dataset.itemId);
        });

        // Game
        DOM.game.exitExpeditionBtn.addEventListener('click', () => gameOver(true));
        DOM.game.collectBtn.addEventListener('click', handleCollect);
        DOM.game.investigateBtn.addEventListener('click', handleInvestigate);
        DOM.game.searchEnemyBtn.addEventListener('click', handleSearchEnemy);
        DOM.game.endTurnBtn.addEventListener('click', endDay);

        // Inicializa
        initializeMockWallet();
        showScreen('logged-out-screen');
    }

    initialize();
});
