export interface DailyMission {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    coinReward: number;
    targetCount: number;
    currentCount: number;
    isCompleted: boolean;
    type: 'pomodoro' | 'study' | 'general_quest' | 'streak';
}

export const generateDailyMissions = (): DailyMission[] => {
    return [
        {
            id: `mission_pomo_${new Date().toISOString().split('T')[0]}`,
            title: "Focus Master",
            description: "Complete 3 Pomodoro sessions.",
            xpReward: 50,
            coinReward: 25,
            targetCount: 3,
            currentCount: 0,
            isCompleted: false,
            type: 'pomodoro',
        },
        {
            id: `mission_quest_${new Date().toISOString().split('T')[0]}`,
            title: "Task Crusher",
            description: "Complete 2 regular quests.",
            xpReward: 30,
            coinReward: 10,
            targetCount: 2,
            currentCount: 0,
            isCompleted: false,
            type: 'general_quest',
        },
        {
            id: `mission_streak_${new Date().toISOString().split('T')[0]}`,
            title: "Stay Consistent",
            description: "Maintain a streak of 3 days.",
            xpReward: 100,
            coinReward: 50,
            targetCount: 3,
            currentCount: 0, // This will be calculated from authStore
            isCompleted: false,
            type: 'streak',
        }
    ];
};
