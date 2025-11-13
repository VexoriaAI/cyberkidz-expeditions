/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 8.2 (Correção Definitiva de Carregamento e Navegação)
// ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("System: DOM Loaded. Initializing Game Engine V8.2...");

    /* ==================================================================== */
    /* 1. DADOS DE FALLBACK (Garante funcionamento offline/erro)
    /* ==================================================================== */
    const FALLBACK_DATA = {
        MATERIALS: { 'mat_scrap': { name: "Scrap", icon: "images/icons/materials/mat_scrap.png" } },
        EQUIPMENT: { 
            "eq_rust_helmet": { id: "eq_rust_helmet", name: "Rustic Helmet", slot: "helmet", synergy: "defense", base_stats: { hp: 10 }, slots_total: 3, slots_unlocked: 1, icon: '' },
            "eq_rust_weapon": { id: "eq_rust_weapon", name: "Rustic Blade", slot: "weapon", synergy: "damage", base_stats: { damage: 3 }, slots_total: 3, slots_unlocked: 1, icon: '' }
        },
        COMPONENTS: { "comp_def_1": { id: "comp_def_1", name: "Defense Plate", type: "defense", stats: { defense: 5 }, icon: '' } },
        WALLET: [ { id: '#313', name: 'Blue Mutant', tribe: { name: 'Radioactives', biome: 'radioactives' }, expeditions: 0, equipped: {} } ],
        TRIBES: {
            VOLCANICS: { name: "Volcanics", biome: "volcanics", baseStats: { damage: 4, hp: 110 } },
            UNDERGROUNDERS: { name: "Undergrounders", biome: "undergrounders", baseStats: { damage: 2, hp: 120 } },
            NOCTURNALS: { name: "Nocturnals", biome: "nocturnals", baseStats: { damage: 3, hp: 100 } },
            RADIOACTIVES: { name: "Radioactives", biome: "radioactives", baseStats: { damage: 2, hp: 80 } },
            REPTILIANS: { name: "Reptilians", biome: "reptilians", baseStats: { damage: 3, hp: 100 } }
        }
    };

    /* ==================================================================== */
    /* 2. INTEGRAÇÃO DE DADOS (Carregamento Seguro)
    /* ==================================================================== */
    
    // Função helper para verificar existência de variáveis globais
    const getDB = (varName, fallback) => {
        return (typeof window[varName] !== 'undefined') ? window[varName] : fallback;
    };

    // Carrega dados ou usa fallback
    const DB = {
        TRIBE: getDB('TRIBES', FALLBACK_DATA.TRIBES),
        MAT: getDB('MATERIALS_DB', FALLBACK_DATA.MATERIALS),
        COMP: getDB('COMPONENTS_DB', FALLBACK_DATA.COMPONENTS),
        EQUIP: getDB('EQUIPMENT_DB', FALLBACK_DATA.EQUIPMENT),
        MAP: getDB('STATIC_MAP_DATA', new Map()),
        RECIPE: getDB('RECIPES_DB', {}),
        WALLET: getDB('MOCK_WALLET', FALLBACK_DATA.WALLET),
        SYNERGY: getDB('SYNERGY_MAP', {}),
        SPAWN: getDB('SPAWN_LOGIC', {}),
        DROP: getDB('DROP_TABLES', {}),
        ENEMY: getDB('ENEMIES_BY_BIOME', {})
    };

    // Consolida Item Master DB
    const ITEM_DB = { ...DB.MAT, ...DB.COMP, ...DB.EQUIP };

    // Constantes Locais
    const MAX_DAYS = 10;
    const MAX_PLACEHOLDER_IMAGES_PER_TRIBE = 5;
    const HEX_SIZE_VISUAL = 50;
    const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
    const STATS_LIST = ['hp', 'ap', 'speed', 'damage', 'defense', 'critChance', 'critDamage', 'attackSpeed', 'hpRegen', 'blockChance', 'luck'];
    const DEMO_KID_ID = '#313';

    /* ==================================================================== */
    /* 3. GAME STATE
    /* ==================================================================== */
    let gameState = {
        currentScreen: 'logged-out-screen',
        player: {
            tezerium: 1000,
            inventory: {
                materials: { "mat_scrap": 100, "mat_water": 50 },
                components: { "comp_def_1": 2 },
                equipment: [] 
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
    /* 4. DOM CACHE
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
    /* 5. HELPER FUNCTIONS
    /* ==================================================================== */

    function generateStartingInventory() {
        // Usa DB.EQUIP que agora é garantido (original ou fallback)
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
        
        if (statsObj) {
            Object.entries(statsObj).forEach(([k, v]) => {
                if (v !== 0) statsStr += `<div class="card-stat-row"><span>${k}</span><span class="card-stat-val">+${v}</span></div>`;
            });
        }

        let slotsHTML = "";
        if (isEquipment) {
            item.embed_slots.forEach((s, index) => {
                let slotClass = "locked"; let icon = "🔒"; let text = `Locked (Lvl ${index > 0 ? 5 * index : 1})`; let bonus = "";
                if (index < item.slots_unlocked) {
                    if (s.component) {
                        slotClass = "filled";
                        const comp = DB.COMP[s.component];
                        if (comp) {
                            icon = `<img src="${comp.icon}" class="slot-bar-icon">`; text = comp.name;
                            const firstStat = Object.keys(comp.stats)[0]; bonus = `+${comp.stats[firstStat]} ${firstStat}`;
                        } else { icon = "❓"; text = "Unknown"; }
                    } else { slotClass = "empty"; icon = "+"; text = "Empty Slot"; }
                }
                slotsHTML += `<div class="slot-bar ${slotClass}"><div style="width:24px; text-align:center;">${icon}</div><div class="slot-bar-text">${text}</div><div class="slot-bar-bonus">${bonus}</div></div>`;
            });
        } else {
            slotsHTML = `<div class="slot-bar filled"><div class="slot-bar-text" style="text-align:center">Type: ${item.type ? item.type.toUpperCase() : 'UNIVERSAL'}</div></div>`;
        }

        return `
            <div class="card-header"><div class="card-icon-frame"><img src="${item.icon}" onerror="this.src='images/kid-placeholder.png'"></div><div class="card-header-text"><h4>${item.name}</h4>${isEquipment ? `<span class="card-level">Lvl ${item.level || 1}</span>` : ''}</div></div>
            <div class="card-body">${statsStr || '<div class="card-stat-row"><span>No Stats</span></div>'}</div>
            <div class="card-footer">${slotsHTML}</div>
            <div class="card-actions">${actionButtonHTML}</div>
        `;
    }

    function getRandomPlaceholderImg(tribeName) {
        if (!tribeName) return 'images/kid-placeholder.png';
        const tribeKey = tribeName.toLowerCase();
        const number = Math.floor(Math.random() * MAX_PLACEHOLDER_IMAGES_PER_TRIBE) + 1;
        return `images/${tribeKey}_${number}.png`;
    }

    function axialToPixelCenter(q, r, size) { return { x: size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r), y: size * (3/2 * r) }; }
    function getHexVertices(size, x, y) { const vertices = []; for (let i = 0; i < 6; i++) { const angle = Math.PI / 180 * (60 * i + 30); vertices.push(Math.round(x + size * Math.cos(angle)), Math.round(y + size * Math.sin(angle))); } return vertices; }
    function axialDistance(q1, r1, q2, r2) { return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2; }
    function calculateItemPower(item) { let p = 0; if(item.stats) Object.values(item.stats).forEach(v => p += v); return p; }

    /* ==================================================================== */
    /* 6. LÓGICA DE TELAS (Hub, Selection, Game)
    /* ==================================================================== */

    function showScreen(screenId) {
        Object.values(DOM.screens).forEach(s => s.style.display = 'none');
        if (DOM.screens[screenId]) DOM.screens[screenId].style.display = 'block';
        gameState.currentScreen = screenId;
    }

    function initializeMockWallet() {
        // Usa DB.WALLET, que agora é garantido pelo fallback
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
        initializeMockWallet();
        DOM.header.tezeriumDisplay.style.visibility = 'visible'; 
        DOM.header.tezeriumBalance.textContent = gameState.player.tezerium;
        DOM.header.headerConnectBtn.style.display = 'none'; 
        DOM.header.connectionStatus.style.display = 'inline';
        
        gameState.hub.pagination.currentPage = 1;
        renderHubSelectionScreen();
        showScreen('hub-selection-screen');
    }

    function handleDemoGame() {
        initializeMockWallet(); // Garante dados
        const demoKid = gameState.player.kidz.find(k => k.id === DEMO_KID_ID) || gameState.player.kidz[0];
        if (demoKid) {
            gameState.hub.activeKidId = demoKid.id;
            // Atualiza header também no demo
            DOM.header.tezeriumDisplay.style.visibility = 'visible'; 
            DOM.header.tezeriumBalance.textContent = gameState.player.tezerium;
            startGameplay();
        }
    }

    function renderHubSelectionScreen() {
        const grid = DOM.hubSelection.nftGrid; grid.innerHTML = '';
        const searchTerm = DOM.hubSelection.filterSearch.value.toLowerCase();
        const tribeFilter = DOM.hubSelection.filterTribe.value;
        const itemsPerPage = DOM.hubSelection.filterItemsPerPage ? parseInt(DOM.hubSelection.filterItemsPerPage.value) : 10;
        const page = gameState.hub.pagination.currentPage;

        const filtered = gameState.player.kidz.filter(kid => {
            const tribeName = kid.tribe ? kid.tribe.name : "";
            return (kid.name.toLowerCase().includes(searchTerm) || kid.id.toLowerCase().includes(searchTerm)) && (tribeFilter === 'all' || tribeName === tribeFilter);
        });

        gameState.hub.pagination.totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        const start = (page - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        if (pageItems.length === 0) {
            DOM.hubSelection.nftGridPlaceholder.style.display = 'block';
        } else {
            DOM.hubSelection.nftGridPlaceholder.style.display = 'none';
            pageItems.forEach(kid => {
                const card = document.createElement('div'); card.className = 'nft-card panel';
                const tribeName = kid.tribe ? kid.tribe.name : "Unknown";
                card.innerHTML = `<img src="${kid.placeholderImg}" onerror="this.src='images/kid-placeholder.png'"><h4>${kid.name}</h4><p>ID: ${kid.id}</p><p>${tribeName}</p><button class="action-btn select-kid-btn" data-kid-id="${kid.id}">Manage</button>`;
                grid.appendChild(card);
            });
        }
        DOM.hubSelection.paginationInfo.textContent = `Page ${page} of ${gameState.hub.pagination.totalPages}`;
        DOM.hubSelection.paginationPrev.disabled = page <= 1; DOM.hubSelection.paginationNext.disabled = page >= gameState.hub.pagination.totalPages;
    }

    function handleKidSelect(id) {
        gameState.hub.activeKidId = id;
        renderHubPreparationScreen();
        showScreen('hub-preparation-screen');
    }

    // --- HUB PREPARATION ---
    function renderHubPreparationScreen() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (!kid) return;
        DOM.hubPreparation.kidImage.innerHTML = `<img src="${kid.placeholderImg}">`;
        DOM.hubPreparation.kidName.firstChild.textContent = kid.name + ' ';
        DOM.hubPreparation.kidTribe.textContent = kid.tribe ? kid.tribe.name : "Unknown"; 
        DOM.hubPreparation.kidId.textContent = kid.id; 
        DOM.hubPreparation.kidExpeditions.textContent = kid.expeditions;
        renderManequim(kid); renderPrepStats(calculateFinalStats(kid)); renderWorkshopTabs();
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

    function renderPrepStats(stats) {
        const display = DOM.hubPreparation.statsDisplay; display.innerHTML = '';
        STATS_LIST.forEach(stat => { if (stats[stat] > 0) display.innerHTML += `<p><strong>${stat}:</strong> ${stats[stat]}</p>`; });
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
            if (qty > 0 && ITEM_DB[id]) tbody.innerHTML += `<tr><td><img src="${ITEM_DB[id].icon}"></td><td>${ITEM_DB[id].name}</td><td>${qty}</td></tr>`;
        });
    }
    function renderWsCraft() {
        DOM.hubPreparation.craftRecipeList.innerHTML = '';
        DOM.hubPreparation.craftRecipeDetails.innerHTML = '<p>Select a recipe.</p>';
        // Placeholder para craft (usará RECIPES_CRAFT no futuro)
        DOM.hubPreparation.craftRecipeList.innerHTML += `<div class="recipe-item">Recipes Coming Soon</div>`;
    }
    
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
        
        DOM.hubPreparation.embedUi.querySelector('.embed-remove-btn[data-slot-type="gear"]').style.display = slotGear ? 'block' : 'none';
        DOM.hubPreparation.embedUi.querySelector('.embed-remove-btn[data-slot-type="component"]').style.display = slotComponent ? 'block' : 'none';
    }
    
    function clearEmbedSlot(type) {
        if (type === 'gear') { gameState.hub.embed.slotGear = null; gameState.hub.embed.slotComponent = null; }
        else { gameState.hub.embed.slotComponent = null; }
        renderWsEmbed();
    }

    // --- MODAL UNIVERSAL ---
    function openItemSelectionModal(context, defaultFilter = 'all') {
        gameState.hub.itemModalContext = context;
        DOM.modals.itemSelect.style.display = 'flex';
        
        const title = context.startsWith('equip_') ? `Select ${context.split('_')[1]}` : (context === 'embed_gear' ? 'Select Gear to Embed' : 'Select Component');
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
            const slot = context.split('_')[1];
            items = gameState.player.inventory.equipment.filter(i => i.slot === slot);
        } else if (context === 'embed_gear') {
            items = gameState.player.inventory.equipment;
        } else if (context === 'embed_component') {
            const gear = gameState.hub.embed.slotGear;
            if (gear) {
                const base = DB.EQUIP[gear.item_id];
                const allowed = (base && DB.SYNERGY[base.synergy]) ? DB.SYNERGY[base.synergy] : ["universal"];
                Object.entries(gameState.player.inventory.components).forEach(([id, qty]) => {
                    if (qty > 0 && DB.COMP[id] && allowed.includes(DB.COMP[id].type)) items.push(DB.COMP[id]);
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
            const card = document.createElement('div'); card.className = 'item-card';
            card.innerHTML = generateItemCardHTML(item, `<button class="action-btn small-btn select-item-btn" data-item-id="${id}">Select</button>`);
            grid.appendChild(card);
        });
    }

    function handleItemSelect(selectedId) {
        const context = gameState.hub.itemModalContext;
        if (context.startsWith('equip_')) equipItem(selectedId, context.split('_')[1]);
        else if (context === 'embed_gear') { gameState.hub.embed.slotGear = gameState.player.inventory.equipment.find(e => e.instance_id === selectedId); renderWsEmbed(); }
        else if (context === 'embed_component') { gameState.hub.embed.slotComponent = selectedId; renderWsEmbed(); }
        closeItemSelectionModal();
    }
    function closeItemSelectionModal() { DOM.modals.itemSelect.style.display = 'none'; gameState.hub.itemModalContext = null; }

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
    function openEditNameModal() { DOM.modals.editNameInput.value = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId).name; DOM.modals.editName.style.display = 'flex'; }
    function closeEditNameModal() { DOM.modals.editName.style.display = 'none'; }
    function saveEditName() { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); const newName = DOM.modals.editNameInput.value; if (newName) { kid.name = newName; renderHubPreparationScreen(); closeEditNameModal(); } }
    
    function openEmbedConfirmModal() { 
        const gear = gameState.hub.embed.slotGear;
        const componentId = gameState.hub.embed.slotComponent;
        const component = DB.COMP[componentId];
        
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

    function calculateItemPower(itemInstance) {
        let score = 0;
        for (const stat in itemInstance.stats) score += itemInstance.stats[stat];
        if (itemInstance.embed_slots) {
            itemInstance.embed_slots.forEach(slot => {
                if (slot.component) {
                    const component = DB.COMP[slot.component];
                    if (component && component.stats) { for (const stat in component.stats) score += component.stats[stat]; }
                }
            });
        }
        return score;
    }

    function autoEquip() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
        if (!kid) return;
        EQUIPMENT_SLOTS.forEach(slot => {
            const options = gameState.player.inventory.equipment.filter(e => e.slot === slot);
            if (options.length) {
                options.sort((a, b) => calculateItemPower(b) - calculateItemPower(a));
                const bestItem = options[0];
                const currentEquippedId = kid.equipped[slot];
                if (!currentEquippedId || currentEquippedId !== bestItem.instance_id) {
                    kid.equipped[slot] = bestItem.instance_id;
                }
            }
        });
        renderHubPreparationScreen();
    }
    function removeAllEquipment() { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); EQUIPMENT_SLOTS.forEach(slot => kid.equipped[slot] = null); renderHubPreparationScreen(); }

    /* ==================================================================== */
    /* 7. GAMEPLAY & COMBAT
    /* ==================================================================== */

    function startGameplay() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (!kid) return;
        gameState.expedition.kid = JSON.parse(JSON.stringify(kid));
        gameState.expedition.stats = calculateFinalStats(kid);
        gameState.expedition.currentDay = 1; gameState.expedition.playerPos = getSpawnPoint(kid.tribe ? kid.tribe.biome : "wasteland");
        gameState.expedition.currentHP = gameState.expedition.stats.hp; gameState.expedition.currentAP = gameState.expedition.stats.ap; gameState.expedition.maxAP = gameState.expedition.stats.ap; gameState.expedition.currentMP = gameState.expedition.stats.speed; gameState.expedition.maxMP = gameState.expedition.stats.speed; gameState.expedition.resourcesFound = {}; gameState.expedition.revealedHexes.clear(); gameState.expedition.startTime = Date.now();
        DOM.game.log.innerHTML = ''; logMessage("--- DAY 1 START ---", 'day');
        renderImageMap(); revealAdjacentHexes(gameState.expedition.playerPos); updateFogOfWar(); updatePlayerHexPosition(); renderGameStatusPanel();
        showScreen('game-screen');
    }

    function renderImageMap() {
        const mapAreas = DOM.game.mapAreas; const fogOverlay = DOM.game.fogOverlay; mapAreas.innerHTML = ''; fogOverlay.innerHTML = '';
        let minX = Infinity, minY = Infinity;
        DB.MAP.forEach((cell, key) => { const [q, r] = key.split(',').map(Number); const { x, y } = axialToPixelCenter(q, r, HEX_SIZE_VISUAL); minX = Math.min(minX, x); minY = Math.min(minY, y); });
        DB.MAP.forEach((cell, key) => {
            const [q, r] = key.split(',').map(Number); const { x: centerX, y: centerY } = axialToPixelCenter(q, r, HEX_SIZE_VISUAL);
            const mapX = centerX - minX + HEX_SIZE_VISUAL; const mapY = centerY - minY + HEX_SIZE_VISUAL;
            const areaTag = document.createElement('area'); areaTag.shape = "poly"; areaTag.coords = getHexVertices(HEX_SIZE_VISUAL, mapX, mapY).join(','); areaTag.href = "#";
            areaTag.addEventListener('click', (e) => { e.preventDefault(); handleHexMoveAttempt(q, r); });
            mapAreas.appendChild(areaTag);
            const fogDiv = document.createElement('div'); fogDiv.className = 'hex-fog'; fogDiv.dataset.key = key; fogDiv.style.left = `${mapX}px`; fogDiv.style.top = `${mapY}px`;
            DOM.game.fogOverlay.appendChild(fogDiv);
        });
    }
    function updateFogOfWar() { document.querySelectorAll('.hex-fog').forEach(d => { if(gameState.expedition.revealedHexes.has(d.dataset.key)) d.classList.add('revealed'); else d.classList.remove('revealed'); }); }
    function updatePlayerHexPosition() {
        document.querySelectorAll('.kid-marker').forEach(m => m.remove());
        const target = DOM.game.fogOverlay.querySelector(`.hex-fog[data-key="${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}"]`);
        if (target) { const m = document.createElement('div'); m.className = 'kid-marker'; m.style.left = target.style.left; m.style.top = target.style.top; m.style.transform = 'translate(-50%, -100%)'; m.textContent = '🤖'; DOM.game.mapContainer.appendChild(m); }
    }
    function handleHexMoveAttempt(q, r) {
        if (gameState.combat.isActive) return;
        if (axialDistance(gameState.expedition.playerPos.q, gameState.expedition.playerPos.r, q, r) === 1) {
            if (gameState.expedition.currentMP < 1) { logMessage("No MP!", 'error'); return; }
            gameState.expedition.currentMP--; gameState.expedition.playerPos = { q, r };
            revealAdjacentHexes({q,r}); updateFogOfWar(); updatePlayerHexPosition(); renderGameStatusPanel();
        }
    }
    function renderGameStatusPanel() {
        const kid = gameState.expedition.kid; const stats = gameState.expedition.stats;
        DOM.game.kidImage.innerHTML = `<img src="${kid.placeholderImg}">`;
        DOM.game.hpBarFill.style.width = `${(gameState.expedition.currentHP / stats.hp) * 100}%`; DOM.game.hpBarText.textContent = `${gameState.expedition.currentHP}/${stats.hp}`;
        DOM.game.apDisplay.textContent = `AP: ${gameState.expedition.currentAP}/${gameState.expedition.maxAP}`; DOM.game.mpDisplay.textContent = `MP: ${gameState.expedition.currentMP}/${gameState.expedition.maxMP}`;
        DOM.game.turnCounter.textContent = gameState.expedition.currentDay;
        const inCombat = gameState.combat.isActive;
        DOM.game.collectBtn.disabled = gameState.expedition.currentAP < 1 || inCombat; DOM.game.investigateBtn.disabled = gameState.expedition.currentAP < 1 || inCombat;
        DOM.game.searchEnemyBtn.disabled = gameState.expedition.currentAP < 2 || inCombat;
        DOM.game.endTurnBtn.disabled = inCombat; DOM.game.exitExpeditionBtn.disabled = inCombat;
    }
    function revealAdjacentHexes({ q, r }) {
        const neighbors = [ [q, r], [q + 1, r], [q - 1, r], [q, r + 1], [q, r - 1], [q + 1, r - 1], [q - 1, r + 1] ];
        neighbors.forEach(([nq, nr]) => {
            const key = `${nq},${nr}`;
            if (DB.MAP.has(key)) { gameState.expedition.revealedHexes.add(key); }
        });
    }
    function handleCollect() {
        gameState.expedition.currentAP--;
        const key = `${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`; const biome = DB.MAP.get(key).biome;
        const table = DB.DROP[biome].collect;
        table.forEach(drop => {
            const amount = Math.floor(Math.random() * (drop.quantity[1] - drop.quantity[0] + 1)) + drop.quantity[0];
            if(!gameState.expedition.resourcesFound[drop.item]) gameState.expedition.resourcesFound[drop.item] = 0;
            gameState.expedition.resourcesFound[drop.item] += amount;
            logMessage(`Collected ${amount}x ${ITEM_DB[drop.item].name}`, 'reward');
        });
        renderGameStatusPanel();
    }
    function handleInvestigate() {
        gameState.expedition.currentAP--;
        const enemy = getRandomEnemy("Investigate"); if(enemy) { startCombat(enemy); return; }
        const key = `${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`; const biome = DB.MAP.get(key).biome;
        const table = DB.DROP[biome].investigate;
        const roll = Math.random() * 100 + gameState.expedition.stats.luck;
        for(const drop of table) {
            if(roll <= drop.chance) {
                if(drop.type === 'nothing') { logMessage("Nothing found.", 'action'); }
                else {
                    const amount = Math.floor(Math.random() * (drop.quantity[1] - drop.quantity[0] + 1)) + drop.quantity[0];
                    if(!gameState.expedition.resourcesFound[drop.item]) gameState.expedition.resourcesFound[drop.item] = 0;
                    gameState.expedition.resourcesFound[drop.item] += amount;
                    logMessage(`Stash! +${amount}x ${ITEM_DB[drop.item].name}`, 'reward');
                }
                break;
            }
        }
        renderGameStatusPanel();
    }
    function handleSearchEnemy() { gameState.expedition.currentAP-=2; const enemy = getRandomEnemy("Search Enemy"); if(enemy) startCombat(enemy); else logMessage("No enemy.", 'action'); renderGameStatusPanel(); }
    function getRandomEnemy(action) {
        const logic = DB.SPAWN[action]; if(!logic) return null;
        const roll = Math.random() * 100; let sum = 0;
        for(const tier of logic.chances) {
            sum += tier.chance;
            if(roll < sum) {
                if(tier.type === 'nothing') return null;
                const key = `${gameState.expedition.playerPos.q},${gameState.expedition.playerPos.r}`;
                const biome = DB.MAP.get(key).biome;
                return (DB.ENEMY[biome] && DB.ENEMY[biome][tier.type]) ? JSON.parse(JSON.stringify(DB.ENEMY[biome][tier.type])) : null;
            }
        }
        return null;
    }
    function endDay() { if(gameState.expedition.currentDay >= MAX_DAYS) { gameOver(true); return; } gameState.expedition.currentDay++; gameState.expedition.currentAP = gameState.expedition.maxAP; gameState.expedition.currentMP = gameState.expedition.maxMP; renderGameStatusPanel(); logMessage("New Day.", 'day'); }
    function gameOver(win) { showEndExpeditionModal(win); }
    function showEndExpeditionModal(isSuccess) {
        DOM.modals.endExpeditionTitle.textContent = isSuccess ? "Success" : "Failed";
        const durationMs = Date.now() - gameState.expedition.startTime;
        const minutes = Math.floor(durationMs / 60000); const seconds = ((durationMs % 60000) / 1000).toFixed(0);
        DOM.modals.endExpeditionDuration.textContent = `Duration: ${minutes}m ${seconds}s`;
        DOM.modals.endExpeditionList.innerHTML = '';
        for (const resId in gameState.expedition.resourcesFound) {
            const amount = gameState.expedition.resourcesFound[resId]; const itemDB = ITEM_DB[resId]; 
            if (amount > 0 && itemDB) DOM.modals.endExpeditionList.innerHTML += `<li><img src="${itemDB.icon}" width="20"><span>${amount}x ${itemDB.name}</span></li>`;
        }
        DOM.modals.endExpedition.style.display = 'flex';
    }
    function handleReturnToHub(isSuccess) {
        if (isSuccess) {
            for (const resId in gameState.expedition.resourcesFound) {
                if (DB.MAT[resId]) { if (!gameState.player.inventory.materials[resId]) gameState.player.inventory.materials[resId] = 0; gameState.player.inventory.materials[resId] += gameState.expedition.resourcesFound[resId]; } 
                else if (DB.COMP[resId]) { if (!gameState.player.inventory.components[resId]) gameState.player.inventory.components[resId] = 0; gameState.player.inventory.components[resId] += gameState.expedition.resourcesFound[resId]; }
            }
            const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (kid) kid.expeditions++;
        }
        DOM.modals.endExpedition.style.display = 'none';
        renderHubPreparationScreen(); 
        showScreen('hub-preparation-screen');
    }

    function startCombat(e) { gameState.combat.isActive = true; gameState.combat.enemy = { ...e, currentHp: e.stats.hp }; DOM.modals.combat.style.display = 'flex'; renderGameStatusPanel(); }
    function handleCombatAttack() { 
        if(!gameState.combat.isActive) return;
        gameState.combat.enemy.currentHp -= 5; 
        if(gameState.combat.enemy.currentHp <= 0) { gameState.combat.isActive = false; DOM.modals.combat.style.display = 'none'; renderGameStatusPanel(); logMessage("Victory!", 'reward'); endCombat(true); }
        else { setTimeout(runEnemyTurn, 1000); }
    }
    function runEnemyTurn() {
        if(!gameState.combat.isActive) return;
        gameState.expedition.currentHP -= 2; 
        if(gameState.expedition.currentHP <= 0) { endCombat(false); }
        else { renderGameStatusPanel(); }
    }
    function endCombat(win) { DOM.modals.combat.style.display = 'none'; gameState.combat.isActive = false; if(win) { /* Rewards logic could be here */ } }
    function handleCombatFlee() { DOM.modals.combat.style.display = 'none'; gameState.combat.isActive = false; }
    function closeCombatModal() { DOM.modals.combat.style.display = 'none'; gameState.combat.isActive = false; }
    function toggleAutoAttack() { /* Stub */ }

    /* ==================================================================== */
    /* 8. LISTENERS
    /* ==================================================================== */
    function initialize() {
        console.log("CyberKidz V7.1 Init.");
        
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);

        DOM.hubSelection.nftGrid.addEventListener('click', (e) => {
            if (e.target.closest('.select-kid-btn')) { handleKidSelect(e.target.closest('.select-kid-btn').dataset.kidId); }
        });
        DOM.hubSelection.paginationNext.addEventListener('click', () => { gameState.hub.pagination.currentPage++; renderHubSelectionScreen(); });
        DOM.hubSelection.paginationPrev.addEventListener('click', () => { gameState.hub.pagination.currentPage--; renderHubSelectionScreen(); });

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
        DOM.hubPreparation.embedUi.addEventListener('click', (e) => {
            if (e.target.closest('.embed-remove-btn')) clearEmbedSlot(e.target.closest('.embed-remove-btn').dataset.slotType);
            else if (e.target.closest('#embed-slot-gear')) openItemSelectionModal('embed_gear');
            else if (e.target.closest('#embed-slot-component')) { if (gameState.hub.embed.slotGear) openItemSelectionModal('embed_component'); }
        });
        DOM.hubPreparation.embedBtn.addEventListener('click', openEmbedConfirmModal);
        DOM.modals.embedCancelBtn.addEventListener('click', () => DOM.modals.embedConfirm.style.display = 'none');
        DOM.modals.embedConfirmBtn.addEventListener('click', performEmbedAction);
        
        DOM.modals.itemSelectCloseBtn.addEventListener('click', closeItemSelectionModal);
        DOM.modals.itemSelectFilterBar.addEventListener('click', (e) => { if (e.target.dataset.filter) renderItemModalGrid(e.target.dataset.filter); });
        DOM.modals.itemSelectGrid.addEventListener('click', (e) => { const btn = e.target.closest('.select-item-btn'); if(btn) handleItemSelect(btn.dataset.itemId); });
        
        const autoBtn = document.getElementById('auto-equip-btn'); if(autoBtn) autoBtn.addEventListener('click', autoEquip);
        const removeBtn = document.getElementById('remove-all-btn'); if(removeBtn) removeBtn.addEventListener('click', removeAllEquipment);
        
        DOM.hubPreparation.editNameBtn.addEventListener('click', openEditNameModal);
        DOM.modals.editNameCancel.addEventListener('click', closeEditNameModal);
        DOM.modals.editNameSave.addEventListener('click', saveEditName);

        DOM.game.exitExpeditionBtn.addEventListener('click', () => gameOver(true));
        DOM.game.collectBtn.addEventListener('click', handleCollect);
        DOM.game.investigateBtn.addEventListener('click', handleInvestigate);
        DOM.game.searchEnemyBtn.addEventListener('click', handleSearchEnemy);
        DOM.game.endTurnBtn.addEventListener('click', endDay);

        DOM.modals.combatAttackBtn.addEventListener('click', handleCombatAttack);
        DOM.modals.combatAutoBtn.addEventListener('click', toggleAutoAttack);
        DOM.modals.combatFleeBtn.addEventListener('click', handleCombatFlee);
        DOM.modals.combatCloseVictoryBtn.addEventListener('click', closeCombatModal);
        DOM.modals.combatReturnHubBtn.addEventListener('click', () => { closeCombatModal(); handleReturnToHub(false); });

        DOM.modals.feedbackCloseBtn.addEventListener('click', closeActionFeedbackModal);
        DOM.modals.endDayCloseBtn.addEventListener('click', closeEndDayModal);
        DOM.modals.endExpeditionReturnBtn.addEventListener('click', () => handleReturnToHub(DOM.modals.endExpeditionTitle.textContent.includes("Successful")));
        DOM.modals.endExpeditionCloseBtn.addEventListener('click', () => handleReturnToHub(DOM.modals.endExpeditionTitle.textContent.includes("Successful")));

        initializeMockWallet();
        showScreen('logged-out-screen');
    }

    initialize();
});
