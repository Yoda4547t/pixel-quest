import { create } from 'zustand';
import { User } from 'firebase/auth';
import { RPGStats, PlayerEquipment, PlayerBase } from '@/lib/game-engine/types';
import { calculateLevelState } from '@/utils/xp';
import { audio } from '@/lib/soundEngine';
import { getEquipmentById } from '@/lib/equipment-data';
import { getSkillById } from '@/lib/skill-tree';
import { BUILDINGS_DATABASE, getBuildingDefinition, getBuildingPrice } from '@/lib/buildings';
import toast from 'react-hot-toast'; // Added toast import
export interface ActiveBoss {
    id: string;
    name: string;
    maxHp: number;
    currentHp: number;
    sprite: string;
    xpReward: number;
    coinReward: number;
}

export interface UserProfile {
    uid: string;
    email: string | null;
    username?: string;
    level: number;
    currentXP: number;
    totalXP: number;
    streakDays: number;
    lastActiveDate: string | null;
    unlockedAreas: string[];
    achievements: string[];
    coins: number;
    avatarColor: string;
    unlockedColors: string[];
    // RPG Extensions
    stats: RPGStats;
    equipment: PlayerEquipment;
    unlockedEquipment: string[];
    abilities: string[];
    playerBase: PlayerBase;
    activeBoss?: ActiveBoss | null;
    activePet?: string | null;
    unlockedPets?: string[];
}

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setProfile: (profile: UserProfile | null) => void;
    setLoading: (isLoading: boolean) => void;
    updateXP: (xpToAdd: number) => void;
    addCoins: (amount: number) => void;
    addStats: (stats: Partial<RPGStats>) => void;
    spendCoins: (amount: number, unlockId?: string) => boolean;
    equipColor: (colorId: string) => void;
    buyEquipment: (itemId: string) => boolean;
    equipItem: (itemId: string) => void;
    equipPet: (petId: string) => void;
    unlockSkill: (skillId: string) => boolean;
    upgradeBuilding: (buildingId: string) => boolean;
    setActiveBoss: (boss: ActiveBoss | null) => void;
    damageBoss: (amount: number) => boolean; // Returns true if defeated
    loginAsGuest: () => void;
}

const DEFAULT_RPG_STATE = {
    stats: { strength: 5, intelligence: 5, focus: 5, resilience: 5 },
    equipment: { weapon: null, armor: null, accessory: null },
    unlockedEquipment: [],
    abilities: [],
    playerBase: { level: 1, buildings: {} },
    activePet: null,
    unlockedPets: []
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (isLoading) => set({ isLoading }),
    loginAsGuest: () => set({
        user: { uid: 'guest', email: 'guest@pixel.quest' } as unknown as User,
        profile: {
            uid: 'guest',
            email: 'guest@pixel.quest',
            username: 'Guest Hero',
            level: 1,
            currentXP: 0,
            totalXP: 0,
            streakDays: 0,
            lastActiveDate: new Date().toISOString(),
            unlockedAreas: ['Town'],
            achievements: [],
            coins: 0,
            avatarColor: 'default',
            unlockedColors: ['default'],
            ...DEFAULT_RPG_STATE,
            activePet: null,
            unlockedPets: []
        },
        isLoading: false
    }),
    updateXP: (xpToAdd: number) =>
        set((state) => {
            if (!state.profile) return state;

            // Apply XP multipliers from Equipment
            let multiplier = 1.0;
            if (state.profile.equipment.weapon) {
                const wpn = getEquipmentById(state.profile.equipment.weapon);
                if (wpn?.xpBonusMultiplier) multiplier *= wpn.xpBonusMultiplier;
            }
            if (state.profile.equipment.armor) {
                const amr = getEquipmentById(state.profile.equipment.armor);
                if (amr?.xpBonusMultiplier) multiplier *= amr.xpBonusMultiplier;
            }
            if (state.profile.equipment.accessory) {
                const acc = getEquipmentById(state.profile.equipment.accessory);
                if (acc?.xpBonusMultiplier) multiplier *= acc.xpBonusMultiplier;
            }

            // Apply Skill multipliers
            state.profile.abilities.forEach(skillId => {
                const s = getSkillById(skillId);
                if (s?.xpBonusMultiplier) multiplier *= s.xpBonusMultiplier;
            });

            // Apply Base Building XP multipliers
            Object.values(state.profile.playerBase.buildings).forEach((building) => {
                const bDef = getBuildingDefinition(building.id);
                if (bDef?.xpBonusPerLevel) {
                    multiplier += (bDef.xpBonusPerLevel * building.level);
                }
            });

            // Pet Passive: XP
            if (state.profile.activePet === 'fox') multiplier *= 1.10;
            if (state.profile.activePet === 'orb') multiplier *= 1.05;

            // Apply Coin multipliers
            let coinMultiplier = 1.0;
            if (state.profile.equipment.accessory) {
                const acc = getEquipmentById(state.profile.equipment.accessory);
                if (acc?.coinBonusMultiplier) coinMultiplier *= acc.coinBonusMultiplier;
            }
            state.profile.abilities.forEach(skillId => {
                const s = getSkillById(skillId);
                if (s?.coinBonusMultiplier) coinMultiplier *= s.coinBonusMultiplier;
            });

            // Apply Base Building Coin multipliers
            Object.values(state.profile.playerBase.buildings).forEach((building) => {
                const bDef = getBuildingDefinition(building.id);
                if (bDef?.coinBonusPerLevel) {
                    coinMultiplier += (bDef.coinBonusPerLevel * building.level);
                }
            });

            // Pet Passive: Coins
            if (state.profile.activePet === 'drone') coinMultiplier *= 1.10;
            if (state.profile.activePet === 'orb') coinMultiplier *= 1.05;

            const effectiveXpToAdd = Math.floor(xpToAdd * multiplier);
            const coinsEarned = Math.floor((effectiveXpToAdd / 2) * coinMultiplier);
            const newTotalXP = state.profile.totalXP + effectiveXpToAdd;
            const updatedProfileData = calculateLevelState(state.profile.level, state.profile.currentXP, effectiveXpToAdd);

            const newUnlockedAreas = [...state.profile.unlockedAreas];
            if (updatedProfileData.level >= 5 && !newUnlockedAreas.includes('Forest')) newUnlockedAreas.push('Forest');
            if (updatedProfileData.level >= 10 && !newUnlockedAreas.includes('Dungeon')) newUnlockedAreas.push('Dungeon');
            
            audio?.playCoin();

            if (updatedProfileData.leveledUp) {
                audio?.playLevelUp();
                toast.success(`Level Up! You are now Level ${updatedProfileData.level}`, {
                    icon: '🌟',
                    duration: 4000,
                });
            }

            return {
                profile: {
                    ...state.profile,
                    level: updatedProfileData.level,
                    currentXP: updatedProfileData.currentXP,
                    totalXP: newTotalXP,
                    coins: state.profile.coins + coinsEarned,
                    unlockedAreas: newUnlockedAreas
                }
            };
        }),
    addCoins: (amount: number) =>
        set((state) => {
            if (!state.profile) return state;
            return {
                profile: {
                    ...state.profile,
                    coins: state.profile.coins + amount
                }
            }
        }),
    addStats: (stats: Partial<RPGStats>) =>
        set((state) => {
            if (!state.profile) return state;
            return {
                profile: {
                    ...state.profile,
                    stats: {
                        strength: state.profile.stats.strength + (stats.strength || 0),
                        intelligence: state.profile.stats.intelligence + (stats.intelligence || 0),
                        focus: state.profile.stats.focus + (stats.focus || 0),
                        resilience: state.profile.stats.resilience + (stats.resilience || 0),
                    }
                }
            };
        }),
    spendCoins: (amount, unlockId) => {
        let success = false;
        set((state) => {
            if (!state.profile || state.profile.coins < amount) return state;

            const newUnlocked = unlockId && !state.profile.unlockedColors.includes(unlockId)
                ? [...state.profile.unlockedColors, unlockId]
                : state.profile.unlockedColors;

            success = true;
            return {
                profile: {
                    ...state.profile,
                    coins: state.profile.coins - amount,
                    unlockedColors: newUnlocked,
                }
            };
        });
        return success;
    },
    equipColor: (colorId) => set((state) => {
        if (!state.profile || !state.profile.unlockedColors.includes(colorId)) return state;
        return {
            profile: {
                ...state.profile,
                avatarColor: colorId
            }
        };
    }),
    buyEquipment: (itemId) => {
        let success = false;
        set((state) => {
            if (!state.profile) return state;
            const item = getEquipmentById(itemId);
            if (!item) return state;

            if (state.profile.coins >= item.price && !state.profile.unlockedEquipment.includes(itemId)) {
                success = true;
                return {
                    profile: {
                        ...state.profile,
                        coins: state.profile.coins - item.price,
                        unlockedEquipment: [...state.profile.unlockedEquipment, itemId]
                    }
                };
            }
            return state;
        });
        return success;
    },
    equipItem: (itemId) => set((state) => {
        if (!state.profile || !state.profile.unlockedEquipment.includes(itemId)) return state;
        const item = getEquipmentById(itemId);
        if (!item) return state;

        const newEq = { ...state.profile.equipment };
        switch(item.type) {
            case 'weapon': newEq.weapon = itemId; break;
            case 'armor': newEq.armor = itemId; break;
            case 'accessory': newEq.accessory = itemId; break;
        }

        return {
            profile: { ...state.profile, equipment: newEq }
        };
    }),
    equipPet: (petId) => set((state) => {
        if (!state.profile || !state.profile.unlockedPets?.includes(petId)) return state;
        return {
            profile: { ...state.profile, activePet: petId }
        };
    }),

    unlockSkill: (skillId) => {
        let success = false;
        set((state) => {
            if (!state.profile) return state;
            const skill = getSkillById(skillId);
            if (!skill) return state;
            if (state.profile.abilities.includes(skillId)) return state;

            // Apply stat changes directly since they are passive buffs always active once unlocked
            const newStats = { ...state.profile.stats };
            if (skill.statBonus) {
                if (skill.statBonus.strength) newStats.strength += skill.statBonus.strength;
                if (skill.statBonus.intelligence) newStats.intelligence += skill.statBonus.intelligence;
                if (skill.statBonus.focus) newStats.focus += skill.statBonus.focus;
                if (skill.statBonus.resilience) newStats.resilience += skill.statBonus.resilience;
            }

            success = true;
            return {
                profile: {
                    ...state.profile,
                    abilities: [...state.profile.abilities, skillId],
                    stats: newStats
                }
            };
        });
        return success;
    },
    upgradeBuilding: (buildingId) => {
        let success = false;
        set((state) => {
            if (!state.profile) return state;

            const bDef = getBuildingDefinition(buildingId);
            if (!bDef) return state;

            const currentBuilding = state.profile.playerBase.buildings[buildingId];
            const currentLevel = currentBuilding ? currentBuilding.level : 0;
            const price = getBuildingPrice(bDef.basePrice, bDef.priceMultiplier, currentLevel);

            if (state.profile.coins >= price) {
                // Determine if Town Hall blocks upgrade
                const townHall = state.profile.playerBase.buildings['town_hall'];
                const townHallLevel = townHall ? townHall.level : 0;
                if (buildingId !== 'town_hall' && currentLevel >= townHallLevel) {
                    return state; // Requires higher Town Hall level
                }

                success = true;
                return {
                    profile: {
                        ...state.profile,
                        coins: state.profile.coins - price,
                        playerBase: {
                            ...state.profile.playerBase,
                            buildings: {
                                ...state.profile.playerBase.buildings,
                                [buildingId]: { id: buildingId, level: currentLevel + 1 }
                            }
                        }
                    }
                };
            }
            return state;
        });
        return success;
    },
    setActiveBoss: (boss) => {
        set((state) => {
            if (!state.profile) return state;
            return { profile: { ...state.profile, activeBoss: boss } };
        });
    },
    damageBoss: (amount) => {
        let isDefeated = false;
        set((state) => {
            if (!state.profile || !state.profile.activeBoss) return state;
            const newHp = Math.max(0, state.profile.activeBoss.currentHp - amount);
            isDefeated = newHp === 0;

            if (isDefeated) {
                // Return state with boss still there but HP 0 so components can animate explosion before clearing
                return {
                    profile: {
                        ...state.profile,
                        activeBoss: { ...state.profile.activeBoss, currentHp: 0 }
                    }
                };
            }

            return {
                profile: {
                    ...state.profile,
                    activeBoss: { ...state.profile.activeBoss, currentHp: newHp }
                }
            };
        });
        return isDefeated;
    }
}));
