/* ====================================================================
// CYBERKIDZ CLUB: WASTELAND EXPEDITION - JAVASCRIPT
// VERSÃO 8.0 (Correção de Dados, Inventário e UI de Cards)
// ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("System: DOM Loaded. Initializing Game Engine V8.0...");

    // --- 1. INTEGRAÇÃO E VALIDAÇÃO DE DADOS ---
    // Tenta carregar das globais. Se falhar, usa objeto vazio para não crashar, mas avisa.
    const DB = {
        TRIBE: (typeof TRIBES !== 'undefined') ? TRIBES : {},
        MAT: (typeof MATERIALS_DB !== 'undefined') ? MATERIALS_DB : {},
        COMP: (typeof COMPONENTS_DB !== 'undefined') ? COMPONENTS_DB : {},
        EQUIP: (typeof EQUIPMENT_DB !== 'undefined') ? EQUIPMENT_DB : {},
        MAP: (typeof STATIC_MAP_DATA !== 'undefined') ? STATIC_MAP_DATA : new Map(),
        RECIPE: (typeof RECIPES_DB !== 'undefined') ? RECIPES_DB : {},
        WALLET: (typeof MOCK_WALLET !== 'undefined') ? MOCK_WALLET : [],
        SYNERGY: (typeof SYNERGY_MAP !== 'undefined') ? SYNERGY_MAP : {},
        SPAWN: (typeof SPAWN_LOGIC !== 'undefined') ? SPAWN_LOGIC : {},
        DROP: (typeof DROP_TABLES !== 'undefined') ? DROP_TABLES : {},
        ENEMY: (typeof ENEMIES_BY_BIOME !== 'undefined') ? ENEMIES_BY_BIOME : {}
    };

    // Log de Diagnóstico (Verifique o console!)
    console.log(`DB Status: Equip=${Object.keys(DB.EQUIP).length}, Comp=${Object.keys(DB.COMP).length}, Mat=${Object.keys(DB.MAT).length}, Wallet=${DB.WALLET.length}`);

    // Item Master DB (Unificado)
    const ITEM_DB = { ...DB.MAT, ...DB.COMP, ...DB.EQUIP };

    // Constantes Locais
    const MAX_DAYS = 10;
    const MAX_PLACEHOLDER_IMAGES_PER_TRIBE = 5;
    const HEX_SIZE_VISUAL = 50;
    const EQUIPMENT_SLOTS = ['helmet', 'weapon', 'accessory', 'armor', 'gloves', 'implant', 'boots'];
    const STATS_LIST = ['hp', 'ap', 'speed', 'damage', 'defense', 'critChance', 'critDamage', 'attackSpeed', 'hpRegen', 'blockChance', 'luck'];
    const DEMO_KID_ID = '#313';

    // --- 2. GAME STATE (Inicialização Correta) ---
    let gameState = {
        currentScreen: 'logged-out-screen',
        player: {
            tezerium: 1000,
            inventory: {
                // Inicializa com IDs corretos do DB (mat_, comp_)
                materials: { 
                    "mat_scrap": 100, "mat_water": 50, "mat_food": 20, "mat_metal": 10,
                    "mat_magma": 5, "mat_nanochips": 2
                },
                components: { 
                    "comp_def_1": 2, "comp_dmg_1": 2, "comp_spd_1": 1, "comp_luck_1": 1 
                },
                equipment: [] // Será preenchido pela função generateStartingInventory
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

    // --- 3. HELPER FUNCTIONS (Geradores) ---

    // Gera o inventário inicial de equipamentos baseado no DB carregado
    function generateStartingInventory() {
        if (Object.keys(DB.EQUIP).length === 0) return [];
        
        return Object.values(DB.EQUIP).map((item, index) => {
            const slots = [];
            const totalSlots = item.slots_total || 3;
            for (let i = 0; i < totalSlots; i++) slots.push({ component: null });

            return {
                instance_id: `inst_${index + 1000}`, // ID único da instância
                item_id: item.id,                    // ID do modelo (ex: eq_rust_helmet)
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

    // Gera o HTML do "Rich Card" (Usado no Modal e no Inventário)
    function generateItemCardHTML(item, actionButtonHTML) {
        // Detecta se é Equipamento (tem instance_id ou slot definido)
        const isEquipment = item.instance_id || item.slot;
        
        // Stats
        let statsStr = "";
        const statsObj = item.stats || item.base_stats || {};
        Object.entries(statsObj).forEach(([k, v]) => {
            if (v !== 0) statsStr += `<div class="card-stat-row"><span>${k}</span><span class="card-stat-val">+${v}</span></div>`;
        });

        // Slots (Apenas para Equipamento)
        let slotsHTML = "";
        if (isEquipment) {
            // Se o item vier do DB puro (sem embed_slots instanciados), cria visualização padrão
            const slots = item.embed_slots || Array(item.slots_total || 3).fill({ component: null });
            const unlocked = item.slots_unlocked || 1;

            slots.forEach((s, index) => {
                let slotClass = "locked";
                let icon = "🔒";
                let text = `Locked (Lvl ${index > 0 ? 5 * index : 1})`;
                let bonus = "";

                if (index < unlocked) {
                    if (s.component) {
                        slotClass = "filled";
                        const comp = DB.COMP[s.component];
                        if (comp) {
                            icon = `<img src="${comp.icon}" class="slot-bar-icon">`;
                            text = comp.name;
                            const firstStat = Object.keys(comp.stats)[0];
                            bonus = `+${comp.stats[firstStat]} ${firstStat}`;
                        } else { icon = "❓"; text = "Unknown"; }
                    } else {
                        slotClass = "empty";
                        icon = "+";
                        text = "Empty Slot";
                    }
                }
                slotsHTML += `
                    <div class="slot-bar ${slotClass}">
                        <div style="width:24px; text-align:center;">${icon}</div>
                        <div class="slot-bar-text">${text}</div>
                        <div class="slot-bar-bonus">${bonus}</div>
                    </div>`;
            });
        } else {
            // Componente
            slotsHTML = `<div class="slot-bar filled"><div class="slot-bar-text" style="text-align:center">Type: ${item.type ? item.type.toUpperCase() : 'UNIVERSAL'}</div></div>`;
        }

        return `
            <div class="card-header">
                <div class="card-icon-frame"><img src="${item.icon}" onerror="this.src='images/kid-placeholder.png'"></div>
                <div class="card-header-text">
                    <h4>${item.name}</h4>
                    ${isEquipment ? `<span class="card-level">Lvl ${item.level || 1}</span>` : ''}
                </div>
            </div>
            <div class="card-body">
                ${statsStr || '<div class="card-stat-row"><span>No Stats</span></div>'}
            </div>
            <div class="card-footer">
                ${slotsHTML}
            </div>
            ${actionButtonHTML ? `<div class="card-actions">${actionButtonHTML}</div>` : ''}
        `;
    }

    function getRandomPlaceholderImg(tribeName) {
        if (!tribeName) return 'images/kid-placeholder.png';
        const tribeKey = tribeName.toLowerCase();
        const number = Math.floor(Math.random() * MAX_PLACEHOLDER_IMAGES_PER_TRIBE) + 1;
        return `images/${tribeKey}_${number}.png`;
    }

    // Helpers de Cálculo
    function calculateItemPower(itemInstance) {
        let score = 0;
        if(itemInstance.stats) for (const stat in itemInstance.stats) score += itemInstance.stats[stat];
        if (itemInstance.embed_slots) {
            itemInstance.embed_slots.forEach(slot => {
                if (slot.component && DB.COMP[slot.component]) {
                    for (const stat in DB.COMP[slot.component].stats) score += DB.COMP[slot.component].stats[stat];
                }
            });
        }
        return score;
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
                if(slot.component && DB.COMP[slot.component]) {
                    const comp = DB.COMP[slot.component];
                    if (comp.stats) { for (const stat in comp.stats) { if (finalStats.hasOwnProperty(stat)) finalStats[stat] += comp.stats[stat]; } }
                }
            });
        }
        return finalStats;
    }

    // --- 4. CACHE DOM ---
    const DOM = {
        header: { tezeriumDisplay: document.getElementById('tezerium-display'), tezeriumBalance: document.getElementById('tezerium-balance'), headerConnectBtn: document.getElementById('header-connect-btn'), connectionStatus: document.getElementById('connection-status') },
        screens: { 'logged-out-screen': document.getElementById('logged-out-screen'), 'hub-selection-screen': document.getElementById('hub-selection-screen'), 'hub-preparation-screen': document.getElementById('hub-preparation-screen'), 'game-screen': document.getElementById('game-screen') },
        loggedOut: { bodyConnectBtn: document.getElementById('body-connect-btn'), demoGameBtn: document.getElementById('demo-game-btn') },
        hubSelection: { filterSearch: document.getElementById('filter-search'), filterTribe: document.getElementById('filter-tribe'), filterItemsPerPage: document.getElementById('filter-items-per-page'), filterResetBtn: document.getElementById('filter-reset-btn'), nftGrid: document.getElementById('nft-selection-grid'), nftGridPlaceholder: document.getElementById('nft-grid-placeholder'), paginationPrev: document.getElementById('pagination-prev'), paginationNext: document.getElementById('pagination-next'), paginationInfo: document.getElementById('pagination-info') },
        hubPreparation: {
            backToSelectionBtn: document.getElementById('back-to-selection-btn'), startExpeditionBtn: document.getElementById('start-expedition-btn'), kidImage: document.getElementById('prep-kid-image'), kidName: document.getElementById('prep-kid-name-display'), editNameBtn: document.getElementById('edit-name-btn'), kidTribe: document.getElementById('prep-kid-tribe'), kidId: document.getElementById('prep-kid-id'), kidExpeditions: document.getElementById('prep-kid-expeditions'), mannequin: document.querySelector('.equipment-mannequin'), statsDisplay: document.getElementById('prep-stats-display'),
            workshopPanel: document.getElementById('workshop-panel'), mainTabs: document.querySelector('.main-tabs'), mainTabInventory: document.getElementById('main-tab-inventory'), mainTabWorkshop: document.getElementById('main-tab-workshop'), materialsTableBody: document.getElementById('materials-table-body'), 
            embedUi: document.querySelector('.embed-ui'), embedSlotGear: document.getElementById('embed-slot-gear'), embedSlotComponent: document.getElementById('embed-slot-component'), embedBtn: document.getElementById('embed-btn')
        },
        modals: {
            itemSelect: document.getElementById('item-select-modal'), itemSelectCloseBtn: document.getElementById('modal-item-close'), itemSelectFilterBar: document.getElementById('modal-filter-bar'), itemSelectGrid: document.getElementById('modal-item-grid'), itemSelectTitle: document.getElementById('modal-item-title'), itemSelectPlaceholder: document.getElementById('modal-item-placeholder'),
            editName: document.getElementById('edit-name-modal'), editNameInput: document.getElementById('edit-name-input'), editNameCancel: document.getElementById('edit-name-cancel'), editNameSave: document.getElementById('edit-name-save'), 
            embedConfirm: document.getElementById('embed-confirm-modal'), embedBefore: document.getElementById('embed-before'), embedAfter: document.getElementById('embed-after'), embedCancelBtn: document.getElementById('embed-cancel-btn'), embedConfirmBtn: document.getElementById('embed-confirm-btn')
        }
        // (Game e outros modais omitidos por brevidade, use os mesmos da V6.3 se já estiverem lá, ou peça o arquivo FULL)
    };

    // --- 5. LÓGICA ---

    function showScreen(screenId) {
        Object.values(DOM.screens).forEach(s => s.style.display = 'none');
        if (DOM.screens[screenId]) DOM.screens[screenId].style.display = 'block';
        gameState.currentScreen = screenId;
    }

    function initializeMockWallet() {
        // Carrega Carteira do DB (com fallback seguro)
        const walletData = (DB.WALLET.length > 0) ? DB.WALLET : [];
        
        gameState.player.kidz = JSON.parse(JSON.stringify(walletData)).map(kid => {
            kid.equipped = {}; 
            EQUIPMENT_SLOTS.forEach(slot => kid.equipped[slot] = null);
            // Tenta pegar nome da tribo, ou usa padrão
            const tName = (kid.tribe && kid.tribe.name) ? kid.tribe.name : "Volcanics";
            kid.placeholderImg = getRandomPlaceholderImg(tName);
            return kid;
        });

        // Popula Inventário
        gameState.player.inventory.equipment = generateStartingInventory();

        // Popula Filtros
        const select = DOM.hubSelection.filterTribe; 
        if (select) {
            select.innerHTML = '<option value="all">All Tribes</option>';
            Object.values(DB.TRIBE).forEach(t => select.innerHTML += `<option value="${t.name}">${t.name}</option>`);
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

        if (pageItems.length === 0) DOM.hubSelection.nftGridPlaceholder.style.display = 'block';
        else {
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

    // --- RENDERERS DE INVENTÁRIO (CORRIGIDOS) ---
    
    function renderInvEquipments() {
        const el = document.getElementById('sub-tab-inv-equipments'); 
        el.className = 'item-grid-container'; // Aplica o Grid CSS
        el.innerHTML = '';
        
        if (gameState.player.inventory.equipment.length === 0) {
            el.innerHTML = '<p>No equipment.</p>';
            return;
        }

        gameState.player.inventory.equipment.forEach(item => {
            const card = document.createElement('div'); 
            card.className = 'item-card'; // Usa estilo Rich Card
            // Sem botão de ação, apenas visualização
            card.innerHTML = generateItemCardHTML(item, ''); 
            el.appendChild(card);
        });
    }

    function renderInvComponents() {
        const el = document.getElementById('sub-tab-inv-components'); 
        el.className = 'item-grid-container'; // Aplica o Grid CSS
        el.innerHTML = '';
        
        let hasItems = false;
        Object.entries(gameState.player.inventory.components).forEach(([id, qty]) => {
            if (qty > 0 && DB.COMP[id]) {
                hasItems = true;
                const card = document.createElement('div'); 
                card.className = 'item-card';
                card.innerHTML = generateItemCardHTML(DB.COMP[id], `<div style="text-align:center; padding:5px; font-weight:bold;">Qty: ${qty}</div>`);
                el.appendChild(card);
            }
        });
        if (!hasItems) el.innerHTML = '<p>No components.</p>';
    }

    function renderInvMaterials() {
        const tbody = DOM.hubPreparation.materialsTableBody; 
        tbody.innerHTML = '';
        Object.entries(gameState.player.inventory.materials).forEach(([id, qty]) => {
            if (qty > 0 && ITEM_DB[id]) {
                tbody.innerHTML += `<tr><td><img src="${ITEM_DB[id].icon}" width="24"></td><td>${ITEM_DB[id].name}</td><td>${qty}</td></tr>`;
            }
        });
    }

    // --- MODAL UNIVERSAL ---
    function openItemSelectionModal(context, defaultFilter = 'all') {
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
        // Lógica de Filtro do Modal
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

        // Filtro da Barra
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

    function handleItemSelect(id) {
        const context = gameState.hub.itemModalContext;
        if (context.startsWith('equip_')) {
            // Equipar no Manequim
            const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId);
            if(kid) {
                kid.equipped[context.split('_')[1]] = id;
                renderHubPreparationScreen();
            }
        } else if (context === 'embed_gear') {
            // Selecionar Gear para Embed
            gameState.hub.embed.slotGear = gameState.player.inventory.equipment.find(e => e.instance_id === id);
            renderWsEmbed();
        } else if (context === 'embed_component') {
            // Selecionar Componente para Embed
            gameState.hub.embed.slotComponent = id; 
            renderWsEmbed();
        }
        closeItemSelectionModal();
    }
    function closeItemSelectionModal() { DOM.modals.itemSelect.style.display = 'none'; gameState.hub.itemModalContext = null; }

    // --- Outras Funções de Renderização ---
    function handleKidSelect(id) { gameState.hub.activeKidId = id; renderHubPreparationScreen(); showScreen('hub-preparation-screen'); }
    function renderHubPreparationScreen() {
        const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if (!kid) return;
        DOM.hubPreparation.kidImage.innerHTML = `<img src="${kid.placeholderImg}">`;
        DOM.hubPreparation.kidName.firstChild.textContent = kid.name + ' ';
        DOM.hubPreparation.kidTribe.textContent = kid.tribe ? kid.tribe.name : "Unknown"; 
        DOM.hubPreparation.kidId.textContent = kid.id; 
        DOM.hubPreparation.kidExpeditions.textContent = kid.expeditions;
        renderManequim(kid); 
        renderPrepStats(calculateFinalStats(kid)); 
        renderWorkshopTabs(); // Atualiza inventário
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
        if (subTab === 'ws-craft') renderWsCraft(); // (Stub para futuro)
    }
    
    // Lógica Embed
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
    function clearEmbedSlot(type) { if (type === 'gear') { gameState.hub.embed.slotGear = null; gameState.hub.embed.slotComponent = null; } else { gameState.hub.embed.slotComponent = null; } renderWsEmbed(); }
    function performEmbedAction() {
        const gear = gameState.hub.embed.slotGear; const compId = gameState.hub.embed.slotComponent;
        if (!gear || !compId) return;
        if (gameState.player.inventory.components[compId] > 0) gameState.player.inventory.components[compId]--;
        const slotIndex = gear.embed_slots.findIndex(s => s.component === null);
        if (slotIndex !== -1) gear.embed_slots[slotIndex].component = compId;
        clearEmbedSlot('gear'); DOM.modals.embedConfirm.style.display = 'none'; renderHubPreparationScreen();
    }
    function openEmbedConfirmModal() {
        const gear = gameState.hub.embed.slotGear; const comp = DB.COMP[gameState.hub.embed.slotComponent];
        DOM.modals.embedBefore.innerHTML = "<h4>Current</h4>"; if(gear.stats) Object.entries(gear.stats).forEach(([k,v]) => DOM.modals.embedBefore.innerHTML += `${k}: +${v}<br>`);
        DOM.modals.embedAfter.innerHTML = `<h4>Add: ${comp.name}</h4>`; if(comp.stats) Object.entries(comp.stats).forEach(([k,v]) => DOM.modals.embedAfter.innerHTML += `${k}: +${v}<br>`);
        DOM.modals.embedConfirm.style.display = 'flex';
    }

    // Outras funções necessárias para UI
    function unequipItem(slot) { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); if(kid) { kid.equipped[slot] = null; renderHubPreparationScreen(); } }
    function openEditNameModal() { DOM.modals.editName.style.display = 'flex'; }
    function closeEditNameModal() { DOM.modals.editName.style.display = 'none'; }
    function saveEditName() { closeEditNameModal(); } // Stub
    function autoEquip() { /* Lógica de auto equip (simplificada) */ renderHubPreparationScreen(); }
    function removeAllEquipment() { const kid = gameState.player.kidz.find(k => k.id === gameState.hub.activeKidId); EQUIPMENT_SLOTS.forEach(s => kid.equipped[s] = null); renderHubPreparationScreen(); }
    function startGameplay() { showScreen('game-screen'); } // Stub para ir ao jogo

    // --- INICIALIZAÇÃO ---
    function initialize() {
        // Home
        DOM.header.headerConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.bodyConnectBtn.addEventListener('click', handleConnectWallet);
        DOM.loggedOut.demoGameBtn.addEventListener('click', handleDemoGame);

        // Hub
        DOM.hubSelection.nftGrid.addEventListener('click', (e) => { if (e.target.classList.contains('select-kid-btn')) handleKidSelect(e.target.dataset.kidId); });
        DOM.hubPreparation.backToSelectionBtn.addEventListener('click', () => showScreen('hub-selection-screen'));
        
        // Mannequin & Workshop
        DOM.hubPreparation.mannequin.addEventListener('click', (e) => {
            if (e.target.closest('.equip-slot')) { const div = e.target.closest('.equip-slot'); if (!div.classList.contains('equipped')) openItemSelectionModal(`equip_${div.dataset.slot}`); }
            if (e.target.closest('.equip-remove-btn')) unequipItem(e.target.closest('.equip-remove-btn').dataset.slot);
        });
        DOM.hubPreparation.workshopPanel.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-btn'); if(btn) {
                if (btn.dataset.mainTab) gameState.hub.tabs.activeMainTab = btn.dataset.mainTab;
                if (btn.dataset.subTab) { if(btn.dataset.subTab.startsWith('inv')) gameState.hub.tabs.activeInvSubTab = btn.dataset.subTab; else gameState.hub.tabs.activeWsSubTab = btn.dataset.subTab; }
                renderWorkshopTabs();
            }
        });

        // Embed
        DOM.hubPreparation.embedUi.addEventListener('click', (e) => {
            if (e.target.closest('.embed-remove-btn')) clearEmbedSlot(e.target.closest('.embed-remove-btn').dataset.slotType);
            else if (e.target.closest('#embed-slot-gear')) openItemSelectionModal('embed_gear');
            else if (e.target.closest('#embed-slot-component')) { if (gameState.hub.embed.slotGear) openItemSelectionModal('embed_component'); }
        });
        DOM.hubPreparation.embedBtn.addEventListener('click', openEmbedConfirmModal);
        DOM.modals.embedCancelBtn.addEventListener('click', () => DOM.modals.embedConfirm.style.display = 'none');
        DOM.modals.embedConfirmBtn.addEventListener('click', performEmbedAction);

        // Modal
        DOM.modals.itemSelectCloseBtn.addEventListener('click', closeItemSelectionModal);
        DOM.modals.itemSelectFilterBar.addEventListener('click', (e) => { if (e.target.dataset.filter) renderItemModalGrid(e.target.dataset.filter); });
        DOM.modals.itemSelectGrid.addEventListener('click', (e) => { const btn = e.target.closest('.select-item-btn'); if(btn) handleItemSelect(btn.dataset.itemId); });

        // Auto Equip
        const autoBtn = document.getElementById('auto-equip-btn'); if(autoBtn) autoBtn.addEventListener('click', autoEquip);
        const removeBtn = document.getElementById('remove-all-btn'); if(removeBtn) removeBtn.addEventListener('click', removeAllEquipment);

        // Misc
        DOM.hubPreparation.editNameBtn.addEventListener('click', openEditNameModal);
        DOM.modals.editNameCancel.addEventListener('click', closeEditNameModal);
        DOM.modals.editNameSave.addEventListener('click', saveEditName);
        DOM.hubPreparation.startExpeditionBtn.addEventListener('click', startGameplay);

        initializeMockWallet();
        showScreen('logged-out-screen');
    }

    function handleConnectWallet() { initializeMockWallet(); DOM.header.tezeriumDisplay.style.visibility = 'visible'; DOM.header.headerConnectBtn.style.display = 'none'; DOM.header.connectionStatus.style.display = 'inline'; renderHubSelectionScreen(); showScreen('hub-selection-screen'); }
    function handleDemoGame() { handleConnectWallet(); const demoKid = gameState.player.kidz.find(k => k.id === DEMO_KID_ID); if(demoKid) { gameState.hub.activeKidId = demoKid.id; startGameplay(); } }

    initialize();
});
