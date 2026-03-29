"use client";

import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuestStore } from "@/store/useQuestStore";
import { XPBar } from "@/components/features/XPBar";
import { ProductivityPanel } from "@/components/productivity/ProductivityPanel";
import { PlayerCharacter } from "@/components/game/PlayerCharacter";
import { QuestCard } from "@/components/features/QuestCard";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameHUDProps {
    onOpenProfile: () => void;
    onOpenSettings: () => void;
    onOpenNewQuest: () => void;
    onCompleteQuest: (questId: string) => void;
    onDeleteQuest: (questId: string) => void;
}

export function GameHUD({
    onOpenProfile,
    onOpenSettings,
    onOpenNewQuest,
    onCompleteQuest,
    onDeleteQuest
}: GameHUDProps) {
    const { profile } = useAuthStore();
    const { quests } = useQuestStore();

    if (!profile) return null;

    const activeQuests = quests.filter((q) => !q.completed);
    const nextXP = profile.level * 100 * 1.5; // Stub for getXPForNextLevel if needed

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-30">
            {/* Top Bar */}
            <div className="pointer-events-auto flex justify-between items-start">
                <div 
                    onClick={onOpenProfile}
                    className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-md border border-[rgba(0,255,200,0.3)] shadow-lg cursor-pointer transform hover:scale-105 transition"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <div className="bg-black/40 rounded-full p-2 border border-slate-600">
                        <PlayerCharacter scale={0.7} />
                    </div>
                    <div>
                        <h2 className="text-white font-pixel text-sm drop-shadow-md">{profile.email?.split("@")[0]}</h2>
                        <p className="text-yellow-400 font-pixel text-xs drop-shadow-md">LVL {profile.level}</p>
                    </div>
                </div>

                <div 
                    className="flex flex-col items-end gap-2 p-3 rounded-xl backdrop-blur-md border border-[rgba(0,255,200,0.3)] shadow-lg"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <div className="flex gap-4 items-center">
                        <span className="font-pixel text-yellow-400 text-sm drop-shadow-md">🪙 {profile.coins}</span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white hover:text-emerald-300 pointer-events-auto transition p-0 shrink-0 h-6"
                            onClick={onOpenSettings}
                        >
                            <Settings size={20} />
                        </Button>
                    </div>
                    <div className="w-40 pointer-events-auto">
                        <XPBar currentXP={profile.currentXP} maxXP={nextXP} level={profile.level} />
                    </div>
                </div>
            </div>

            {/* Middle Section (Left/Right panels) */}
            <div className="flex-1 flex justify-end items-center my-4">
                {/* Right Panel: Quests */}
                <div 
                    className="w-80 pointer-events-auto rounded-xl backdrop-blur-md border border-[rgba(0,255,200,0.3)] shadow-lg p-4 flex flex-col max-h-[60vh]"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <div className="flex justify-between items-center mb-4 border-b border-[rgba(0,255,200,0.3)] pb-2">
                        <h3 className="text-emerald-400 font-pixel text-lg drop-shadow-md">QUEST LOG</h3>
                        <span className="text-xs text-emerald-200 font-pixel bg-emerald-900/50 px-2 py-1 rounded">
                            {profile.streakDays}🔥 STREAK
                        </span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                        {activeQuests.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center font-pixel py-4">No active quests.</p>
                        ) : (
                            activeQuests.map(q => (
                                <QuestCard
                                    key={q.id}
                                    quest={q}
                                    onComplete={() => onCompleteQuest(q.id)}
                                    onDelete={() => onDeleteQuest(q.id)}
                                />
                            ))
                        )}
                    </div>
                    <Button
                        onClick={onOpenNewQuest}
                        className="mt-4 w-full pointer-events-auto border border-emerald-500 bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 transition"
                    >
                        + NEW QUEST
                    </Button>
                </div>
            </div>

            {/* Bottom Panel: Productivity Toolkit */}
            <div className="pointer-events-auto flex justify-center">
                <div 
                    className="w-full max-w-2xl rounded-xl backdrop-blur-md border border-[rgba(0,255,200,0.3)] shadow-lg p-1"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <ProductivityPanel />
                </div>
            </div>
        </div>
    );
}
