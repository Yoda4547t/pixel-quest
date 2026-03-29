import { PlayerBaseBuilding } from './game-engine/types';

export interface BuildingDefinition {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    priceMultiplier: number;
    sprite: string;
    xpBonusPerLevel?: number;
    coinBonusPerLevel?: number;
}

export const BUILDINGS_DATABASE: BuildingDefinition[] = [
    {
        id: 'town_hall',
        name: 'Town Hall',
        description: 'The heart of your base. Upgrading this allows other buildings to reach higher levels.',
        basePrice: 500,
        priceMultiplier: 1.5,
        sprite: '🏰',
    },
    {
        id: 'library',
        name: 'Grand Library',
        description: 'A place of knowledge. Grants +5% Global XP Gain per level.',
        basePrice: 200,
        priceMultiplier: 1.8,
        sprite: '📚',
        xpBonusPerLevel: 0.05
    },
    {
        id: 'vault',
        name: 'Gold Vault',
        description: 'Secure storage for wealth. Grants +5% Coin Gain per level.',
        basePrice: 300,
        priceMultiplier: 1.6,
        sprite: '🏦',
        coinBonusPerLevel: 0.05
    },
    {
        id: 'training_ground',
        name: 'Training Ground',
        description: 'A place to hone physical skills. (Stat boosts in future updates)',
        basePrice: 400,
        priceMultiplier: 1.5,
        sprite: '⚔️',
    }
];

export function getBuildingDefinition(id: string): BuildingDefinition | undefined {
    return BUILDINGS_DATABASE.find(b => b.id === id);
}

export function getBuildingPrice(basePrice: number, multiplier: number, currentLevel: number): number {
    return Math.floor(basePrice * Math.pow(multiplier, currentLevel));
}
