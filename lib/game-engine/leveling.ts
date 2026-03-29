/**
 * Calculate the total XP required to REACH a specific level.
 * Scaling:
 * Lvl 1: 0 (Start)
 * Lvl 2: 100
 * Lvl 3: 250 (+150)
 * Lvl 4: 450 (+200)
 * Lvl 5: 700 (+250)
 */
export function getXPRequiredForLevel(level: number): number {
    if (level <= 1) return 0;
    
    // Formula: previous level requirement + (level * 50)
    // 2: 0 + 100 = 100
    // 3: 100 + 150 = 250
    // 4: 250 + 200 = 450
    
    let totalXp = 0;
    for (let currentLvl = 2; currentLvl <= level; currentLvl++) {
        totalXp += (currentLvl * 50);
    }
    
    return totalXp;
}

/**
 * Returns how much XP is needed specifically for the *next* level
 * (e.g., if you are level 1, you need 100 XP to get to level 2)
 */
export function getXPForNextLevel(currentLevel: number): number {
    return (currentLevel + 1) * 50;
}

/**
 * Recalculate level based on total accumulated XP.
 */
export function calculateLevelFromTotalXP(totalXP: number): number {
    let level = 1;
    let xpNeeded = getXPRequiredForLevel(level + 1);
    
    while (totalXP >= xpNeeded) {
        level++;
        xpNeeded = getXPRequiredForLevel(level + 1);
    }
    
    return level;
}
