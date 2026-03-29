"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuestStore } from "@/store/useQuestStore";
import { PlayerCharacter } from "@/components/game/PlayerCharacter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { TileMap } from "@/components/world/TileMap";
import { AmbientParticles } from "@/components/effects/AmbientParticles";
import { dungeonMap } from "@/lib/maps/dungeonMap";
import { TileType } from "@/lib/maps/types";
import { audio } from "@/lib/soundEngine";
import { useSettingsStore } from "@/store/useSettingsStore";

const BOSS_QUESTS = [
    {
        id: 'B1',
        title: 'SLAY THE SPAGHETTI CODE MONSTER',
        difficulty: 'Hard' as const,
        xpReward: 500,
        description: 'Refactor an old component without breaking tests.'
    },
    {
        id: 'B2',
        title: 'THE FINAL DEPLOYMENT',
        difficulty: 'Hard' as const,
        xpReward: 1000,
        description: 'Push a major feature to production safely.'
    },
    {
        id: 'B3',
        title: 'SUMMON THE DEMON BUG',
        difficulty: 'Medium' as const,
        xpReward: 250,
        description: 'Find and fix a Heisenbug that only happens in prod.'
    }
];

export default function DungeonPage() {
    const { profile } = useAuthStore();
    const { quests, addQuest } = useQuestStore();
    const { ambientEnabled } = useSettingsStore();
    const router = useRouter();

    const [selectedBoss, setSelectedBoss] = useState<typeof BOSS_QUESTS[0] | null>(null);

    useEffect(() => {
        if (ambientEnabled) audio?.playAmbient('dungeon');
        else audio?.stopAmbient();
        return () => { audio?.stopAmbient(); };
    }, [ambientEnabled]);

    const handleInteract = (type: TileType, x: number, y: number) => {
        if (type === TileType.BOSS_STATUE) {
            const randomBoss = BOSS_QUESTS[Math.floor(Math.random() * BOSS_QUESTS.length)];
            setSelectedBoss(randomBoss);
        }
    };

    if (!profile) return null;

    const handleAcceptQuest = () => {
        if (!selectedBoss) return;

        const isAlreadyActive = quests.some(q => q.title === selectedBoss.title && !q.completed);
        if (isAlreadyActive) {
            toast.error("You are already fighting this boss!");
            return;
        }

        addQuest({
            title: selectedBoss.title,
            difficulty: selectedBoss.difficulty,
            category: 'Dungeon',
            isBoss: true
        });

        useQuestStore.setState(state => {
            const newlyAdded = state.quests[state.quests.length - 1];
            if (newlyAdded && newlyAdded.title === selectedBoss.title) {
                newlyAdded.xpReward = selectedBoss.xpReward;
            }
            return { quests: state.quests };
        });

        toast.success("Boss Quest Accepted!", { icon: "⚔️" });
        setSelectedBoss(null);
        router.push("/dashboard");
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto h-full flex flex-col gap-4 relative">
            {/* Hellish Dungeon Atmospheric Overlay & Embers */}
            <div className="fixed inset-0 pointer-events-none z-30 mix-blend-multiply bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(60,10,10,0.9)_100%)]"></div>
            <AmbientParticles type="embers" />

            <div className="flex justify-between items-center bg-red-950/40 p-4 border-4 border-red-800 rounded-lg shrink-0 relative z-40">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push('/dashboard')} className="border-red-800 hover:bg-red-900/50 hover:text-white text-red-400">&lt; FLEE</Button>
                    <h1 className="text-xl md:text-2xl text-red-500 font-pixel drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">THE DUNGEON</h1>
                </div>
            </div>

            <div className="bg-black/80 border-4 border-red-900 p-2 text-center flex flex-col items-center justify-center gap-1 text-red-400 font-pixel text-[10px]">
                <p>USE W,A,S,D OR ARROWS TO MOVE. AVOID THE LAVA.</p>
                <p className="animate-pulse">APPROACH A BOSS STATUE AND PRESS SPACE TO CHALLENGE IT!</p>
            </div>

            {/* Game Grid via TileMap Engine */}
            <TileMap 
                mapData={dungeonMap} 
                onInteract={handleInteract} 
                isLocked={!!selectedBoss}
            />

            {/* Boss Interaction Modal */}
            <AnimatePresence>
                {selectedBoss && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    >
                        <Card variant="bordered" className="bg-gray-950 border-red-900 border-4 w-full max-w-lg shadow-[0_0_50px_rgba(239,68,68,0.3)] p-6">
                            <h2 className="text-3xl text-red-500 font-pixel drop-shadow-md mb-2">{selectedBoss.title}</h2>
                            <p className="text-gray-400 mb-6 min-h-[60px]">{selectedBoss.description}</p>

                            <div className="flex justify-between items-center bg-black/50 border-2 border-red-900 p-4 mb-6 text-sm font-pixel">
                                <div><span className="text-gray-500">REWARD:</span> <span className="text-blue-400">{selectedBoss.xpReward} XP</span></div>
                                <div><span className="text-gray-500">LOOT:</span> <span className="text-yellow-400">🪙 {selectedBoss.xpReward / 2}</span></div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="w-full flex-1" variant="ghost" onClick={() => setSelectedBoss(null)}>RUN AWAY</Button>
                                <Button className="w-full flex-1" variant="danger" onClick={handleAcceptQuest}>ACCEPT QUEST</Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
