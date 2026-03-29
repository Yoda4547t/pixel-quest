import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type Achievement = {
    id: string;
    name: string;
    description: string;
    requirement: (stats: any) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
    { id: "first_lvl", name: "LEVEL UP!", description: "Reach Level 2", requirement: (s) => s.level >= 2 },
    { id: "streak_7", name: "DEDICATION", description: "Reach a 7-day streak", requirement: (s) => s.streakDays >= 7 },
];

export const useAchievements = (profile: any, updateProfile: any) => {
    useEffect(() => {
        if (!profile) return;
        let unlockedAny = false;
        const newAchievements = [...profile.achievements];

        ACHIEVEMENTS.forEach(ach => {
            if (!newAchievements.includes(ach.id) && ach.requirement(profile)) {
                newAchievements.push(ach.id);
                unlockedAny = true;
                toast.success(`ACHIEVEMENT UNLOCKED: ${ach.name}!`);
            }
        });

        if (unlockedAny) {
            // Typically we'd call a store update holding the new profile here, 
            // but modifying Zustand from within a component effect should trigger carefully.
        }
    }, [profile?.level, profile?.streakDays]);
}
