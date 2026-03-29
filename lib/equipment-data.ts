import { Equipment } from "./game-engine/types";

export const EQUIPMENT_DATABASE: Equipment[] = [
    // Weapons
    {
        id: "wpn_novice_sword",
        name: "Novice Sword",
        type: "weapon",
        description: "A simple wooden sword. Great for battling procrastination.",
        price: 50,
        statBonus: { strength: 2 }
    },
    {
        id: "wpn_sword_discipline",
        name: "Sword of Discipline",
        type: "weapon",
        description: "A glowing blade that rewards consistency. +10% Global XP gain.",
        price: 250,
        statBonus: { strength: 5, resilience: 2 },
        xpBonusMultiplier: 1.10
    },

    // Armor
    {
        id: "amr_scholar_hat",
        name: "Scholar Hat",
        type: "armor",
        description: "A pointy hat that makes you think faster. Boosts Intelligence.",
        price: 150,
        statBonus: { intelligence: 10 }
    },
    {
        id: "amr_iron_plate",
        name: "Iron Plate",
        type: "armor",
        description: "Heavy armor that builds endurance. Boosts Resilience and Strength.",
        price: 300,
        statBonus: { resilience: 8, strength: 4 }
    },

    // Accessories
    {
        id: "acc_focus_amulet",
        name: "Focus Amulet",
        type: "accessory",
        description: "A glowing blue crystal. Boosts Focus profoundly.",
        price: 200,
        statBonus: { focus: 15 }
    },
    {
        id: "acc_lucky_coin",
        name: "Lucky Coin",
        type: "accessory",
        description: "A shiny golden coin that magically attracts wealth. +50% Coin gain.",
        price: 500,
        coinBonusMultiplier: 1.50
    }
];

export function getEquipmentById(id: string): Equipment | undefined {
    return EQUIPMENT_DATABASE.find(eq => eq.id === id);
}
