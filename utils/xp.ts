export const INITIAL_LEVEL_XP = 100;

export const getXPForNextLevel = (level: number): number => {
    if (level === 1) return 100;
    if (level === 2) return 250;
    if (level === 3) return 450;
    return Math.floor(INITIAL_LEVEL_XP * Math.pow(level, 1.5));
};

export const calculateLevelState = (currentLevel: number, currentXP: number, xpToAdd: number) => {
    const newTotalXP = currentXP + xpToAdd; // This implies currentXP here might mean total if we change architecture, but assuming currentXP acts as progress in current level here... wait!
    // It's safer to just do absolute calculations.
    // Actually, we do remainder tracking!
    let level = currentLevel;
    let remainingXP = currentXP + xpToAdd;

    let nextLevelXP = getXPForNextLevel(level);

    while (remainingXP >= nextLevelXP) {
        remainingXP -= nextLevelXP;
        level++;
        nextLevelXP = getXPForNextLevel(level);
    }

    return { level, currentXP: remainingXP, leveledUp: level > currentLevel };
};
