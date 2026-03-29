export interface RPGStats {
    strength: number;     // Gained from fitness
    intelligence: number; // Gained from coding/study
    focus: number;        // Gained from pomodoro timer
    resilience: number;   // Gained from daily streak/habits
}

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface Equipment {
    id: string;
    name: string;
    type: EquipmentSlot;
    description: string;
    statBonus?: Partial<RPGStats>;
    xpBonusMultiplier?: number;
    coinBonusMultiplier?: number;
    price: number;
}

export interface PlayerEquipment {
    weapon: string | null;     // Equipment ID
    armor: string | null;      // Equipment ID
    accessory: string | null;  // Equipment ID
}

export interface PlayerBaseBuilding {
    id: string;
    level: number;
}

export interface PlayerBase {
    level: number;
    buildings: Record<string, PlayerBaseBuilding>;
}

export type SceneId = 'base' | 'town' | 'forest' | 'dungeon';

export interface WorldState {
    currentScene: SceneId;
}

export interface PlayerState {
    stats: RPGStats;
    equipment: PlayerEquipment;
    abilities: string[];
    playerBase: PlayerBase;
    unlockedScenes: SceneId[];
}
