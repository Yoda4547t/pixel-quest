import { RPGStats } from './types';
import { TaskDifficulty } from '@/store/useQuestStore';

export type QuestCategory = 'coding' | 'study' | 'fitness' | 'daily' | 'focus';

export function getStatReward(category: string, difficulty: TaskDifficulty): Partial<RPGStats> {
    const amount = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 3 : 5;
    
    switch (category) {
        case 'coding':
        case 'study':
            return { intelligence: amount };
        case 'fitness':
            return { strength: amount };
        case 'daily':
            return { resilience: amount };
        case 'focus':
            return { focus: amount };
        default:
            return {};
    }
}

export function getStatName(stats: Partial<RPGStats>): string | null {
    if (stats.intelligence) return 'Intelligence';
    if (stats.strength) return 'Strength';
    if (stats.resilience) return 'Resilience';
    if (stats.focus) return 'Focus';
    return null;
}
