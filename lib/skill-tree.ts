import { RPGStats } from './game-engine/types';

export type SkillBranch = 'Warrior' | 'Scholar' | 'Explorer';

export interface SkillNode {
    id: string;
    branch: SkillBranch;
    name: string;
    description: string;
    requiredLevel: number;
    requires?: string[]; // Prerequisite skill IDs
    statBonus?: Partial<RPGStats>;
    coinBonusMultiplier?: number;
    xpBonusMultiplier?: number;
}

export const SKILL_TREE: SkillNode[] = [
    // WARRIOR BRANCH
    {
        id: "wr_1",
        branch: "Warrior",
        name: "Basic Training",
        description: "+2 Strength. A solid foundation for physical tasks.",
        requiredLevel: 2,
        statBonus: { strength: 2 }
    },
    {
        id: "wr_2",
        branch: "Warrior",
        name: "Iron Will",
        description: "+3 Resilience. You never give up.",
        requiredLevel: 4,
        requires: ["wr_1"],
        statBonus: { resilience: 3 }
    },
    {
        id: "wr_3",
        branch: "Warrior",
        name: "Juggernaut",
        description: "+5 Strength, +5 Resilience. Absolute unit.",
        requiredLevel: 8,
        requires: ["wr_2"],
        statBonus: { strength: 5, resilience: 5 }
    },

    // SCHOLAR BRANCH
    {
        id: "sc_1",
        branch: "Scholar",
        name: "Bookworm",
        description: "+2 Intelligence. You read the manual.",
        requiredLevel: 2,
        statBonus: { intelligence: 2 }
    },
    {
        id: "sc_2",
        branch: "Scholar",
        name: "Deep Work",
        description: "+3 Focus. Unbreakable concentration.",
        requiredLevel: 4,
        requires: ["sc_1"],
        statBonus: { focus: 3 }
    },
    {
        id: "sc_3",
        branch: "Scholar",
        name: "Archmage",
        description: "+5 Intelligence, +10% XP Gain.",
        requiredLevel: 8,
        requires: ["sc_2"],
        statBonus: { intelligence: 5 },
        xpBonusMultiplier: 1.10
    },

    // EXPLORER BRANCH
    {
        id: "ex_1",
        branch: "Explorer",
        name: "Wayfarer",
        description: "+2 Resilience. Accustomed to the road.",
        requiredLevel: 2,
        statBonus: { resilience: 2 }
    },
    {
        id: "ex_2",
        branch: "Explorer",
        name: "Treasure Hunter",
        description: "+15% Coin Gain from quests.",
        requiredLevel: 4,
        requires: ["ex_1"],
        coinBonusMultiplier: 1.15
    },
    {
        id: "ex_3",
        branch: "Explorer",
        name: "Master Cartographer",
        description: "+2 to all stats. True mastery of the world.",
        requiredLevel: 8,
        requires: ["ex_2"],
        statBonus: { strength: 2, intelligence: 2, focus: 2, resilience: 2 }
    }
];

export function getSkillById(id: string): SkillNode | undefined {
    return SKILL_TREE.find(s => s.id === id);
}
