/* ====================================================================
// DATABASE: EQUIPMENT
// Define os stats base, slots e sinergia para cada equipamento.
// ==================================================================== */

const EQUIPMENT_DB = {
    "eq_rust_helmet": { id: "eq_rust_helmet", name: "Rustic Helmet", slot: "helmet", synergy: "defense", base_stats: { hp: 10, defense: 2 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_helmet.png' },
    "eq_rust_armor": { id: "eq_rust_armor", name: "Rustic Armor", slot: "armor", synergy: "defense", base_stats: { hp: 20, defense: 3 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_armor.png' },
    "eq_rust_weapon": { id: "eq_rust_weapon", name: "Rustic Club", slot: "weapon", synergy: "damage", base_stats: { damage: 7 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_weapon.png' },
    "eq_volcanic_blade": { id: "eq_volcanic_blade", name: "Volcanic Blade", slot: "weapon", synergy: "damage", base_stats: { damage: 20 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_volcanic_blade.png' },
    "eq_rust_boots": { id: "eq_rust_boots", name: "Rustic Boots", slot: "boots", synergy: "speed", base_stats: { hp: 5, defense: 1, speed: 2 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_boots.png' },
    "eq_rust_gloves": { id: "eq_rust_gloves", name: "Rustic Gloves", slot: "gloves", synergy: "damage", base_stats: { speed: 1, damage: 1, critChance: 1 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_gloves.png' },
    "eq_rust_implant": { id: "eq_rust_implant", name: "Rustic Implant", slot: "implant", synergy: "universal", base_stats: { hp: 5, ap: 1 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_implant.png' },
    "eq_rust_accessory": { id: "eq_rust_accessory", name: "Rustic Accessory", slot: "accessory", synergy: "universal", base_stats: { luck: 2 }, slots_total: 3, slots_unlocked: 1, icon: 'images/icons/equipment/eq_rust_accessory.png' }
};
