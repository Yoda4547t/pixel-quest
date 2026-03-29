import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyMission, generateDailyMissions } from '@/lib/dailyMissions';

export type TaskDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Quest {
    id: string;
    title: string;
    difficulty: TaskDifficulty;
    category: string; // 'coding' | 'study' | 'fitness' | 'daily' | 'focus' | legacy generic strings
    completed: boolean;
    xpReward: number;
    createdAt: string;
    isBoss?: boolean;
}

interface QuestState {
    quests: Quest[];
    dailyMissions: DailyMission[];
    lastDailyReset: string;
    isLoading: boolean;
    setQuests: (quests: Quest[]) => void;
    addQuest: (quest: Omit<Quest, 'id' | 'completed' | 'createdAt' | 'xpReward'>) => void;
    completeQuest: (id: string) => void;
    deleteQuest: (id: string) => void;
    
    // Daily Missions
    refreshDailyMissions: () => void;
    incrementDailyMission: (type: DailyMission['type'], amount?: number) => void;
    claimDailyMission: (id: string) => void;
}

const getXpByDifficulty = (difficulty: TaskDifficulty) => {
    switch (difficulty) {
        case 'Easy': return 10;
        case 'Medium': return 25;
        case 'Hard': return 50;
        default: return 10;
    }
};

export const useQuestStore = create<QuestState>()(
    persist(
        (set, get) => ({
            quests: [],
            dailyMissions: [],
            lastDailyReset: new Date(0).toISOString(),
            isLoading: false,
            
            setQuests: (quests) => set({ quests }),
            
            addQuest: (questInput) => set((state) => {
                const newQuest: Quest = {
                    ...questInput,
                    id: Math.random().toString(36).substring(7),
                    completed: false,
                    xpReward: getXpByDifficulty(questInput.difficulty),
                    createdAt: new Date().toISOString()
                };
                return { quests: [...state.quests, newQuest] };
            }),
            
            completeQuest: (id) => set((state) => ({
                quests: state.quests.map(q => q.id === id ? { ...q, completed: true } : q)
            })),
            
            deleteQuest: (id) => set((state) => ({
                quests: state.quests.filter(q => q.id !== id)
            })),

            refreshDailyMissions: () => {
                const today = new Date().toISOString().split('T')[0];
                const state = get();
                if (state.lastDailyReset.split('T')[0] !== today) {
                    set({
                        dailyMissions: generateDailyMissions(),
                        lastDailyReset: new Date().toISOString()
                    });
                }
            },

            incrementDailyMission: (type, amount = 1) => set((state) => ({
                dailyMissions: state.dailyMissions.map(m => {
                    if (m.type === type && !m.isCompleted) {
                        return { ...m, currentCount: Math.min(m.currentCount + amount, m.targetCount) };
                    }
                    return m;
                })
            })),

            claimDailyMission: (id) => set((state) => ({
                dailyMissions: state.dailyMissions.map(m => m.id === id ? { ...m, isCompleted: true } : m)
            })),
        }),
        {
            name: 'pixelquest-quests',
        }
    )
);
