"use client";

import React, { useState, useEffect } from "react";
import { PlayerCharacter } from "@/components/game/PlayerCharacter";
import { QuestCard } from "@/components/features/QuestCard";
import { useQuestStore } from "@/store/useQuestStore";
import { Settings } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface MapOverlayProps {
    onOpenSettings?: () => void;
    onOpenNewQuest?: () => void;
    onOpenProfile?: () => void;
    onCompleteQuest?: (id: string) => void;
    onDeleteQuest?: (id: string) => void;
}

export function MapOverlay({ onOpenSettings, onOpenNewQuest, onOpenProfile, onCompleteQuest, onDeleteQuest }: MapOverlayProps) {
    const { profile } = useAuthStore();
    const { quests } = useQuestStore();
    
    // Timer Logic
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState("Pomodoro");
    const [isCountUp, setIsCountUp] = useState(false);

    const switchMode = (newMode: string, minutes: number, countUp = false) => {
        setMode(newMode);
        setTimeLeft(minutes * 60);
        setIsActive(false);
        setIsCountUp(countUp);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            if (isCountUp) {
                interval = setInterval(() => setTimeLeft(t => t + 1), 1000);
            } else if (timeLeft > 0) {
                interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
            } else {
                setIsActive(false);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, isCountUp]);

    const toggleTimer = () => setIsActive(!isActive);

    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');

    if (!profile) return null;

    const nextXP = profile.level * 100 * 1.5;
    const fillPercent = Math.min(100, (profile.currentXP / nextXP) * 100);
    const activeQuests = quests.filter(q => !q.completed);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none p-4 font-pixel">
            
            {/* TOP LEFT — Player Card */}
            <div 
                onClick={onOpenProfile}
                className="absolute top-4 left-4 pointer-events-auto rounded-md p-2 flex items-center gap-3 w-64 hover:scale-105 cursor-pointer transition-transform"
                style={{ background: "rgba(4,10,26,0.93)", border: "1px solid rgba(240,192,64,0.6)" }}
            >
                <div 
                    className="w-[52px] h-[52px] rounded-sm flex justify-center items-center overflow-hidden"
                    style={{ border: "1px solid #f0c040", background: "rgba(0,0,0,0.5)" }}
                >
                    <PlayerCharacter scale={0.7} />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-200 uppercase">{profile.username || profile.email?.split("@")[0] || "Hero"}</span>
                    <span className="text-[10px] text-yellow-400">LVL {profile.level}</span>
                </div>
            </div>

            {/* TOP RIGHT — Currency + XP Bar */}
            <div className="absolute top-4 right-4 pointer-events-auto flex gap-2">
                
                <div 
                    className="rounded-md px-3 flex items-center gap-2 h-10"
                    style={{ background: "rgba(4,10,26,0.93)", border: "1px solid rgba(240,192,64,0.6)" }}
                >
                    <span className="text-yellow-400 text-xs">🪙 {profile.coins}</span>
                    <Settings size={14} className="text-gray-400 hover:text-white cursor-pointer ml-1" onClick={onOpenSettings} />
                </div>

                <div 
                    className="rounded-md px-3 py-1 flex flex-col justify-center h-10 min-w-[180px]"
                    style={{ background: "rgba(4,10,26,0.93)", border: "1px solid rgba(240,192,64,0.6)" }}
                >
                    <div className="flex justify-between text-[8px] mb-1.5 text-gray-300">
                        <span>LVL {profile.level}</span>
                        <span>{profile.currentXP} / {nextXP} XP</span>
                    </div>
                    <div className="w-full bg-black h-1.5 border border-stone-700 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-[#b8860b] to-[#f0c040]" 
                            style={{ width: `${fillPercent}%` }}
                        />
                    </div>
                </div>

            </div>

            {/* RIGHT CENTER — Quest Log Panel */}
            <div 
                className="absolute top-1/2 right-4 transform -translate-y-1/2 pointer-events-auto rounded-md p-3 w-[200px] flex flex-col gap-3"
                style={{ background: "rgba(4,10,26,0.93)", border: "1px solid rgba(240,192,64,0.6)" }}
            >
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-yellow-400 text-[10px]">QUEST LOG</span>
                    <span className="text-[7px] bg-red-900/50 text-red-300 px-1 py-0.5 rounded border border-red-800 whitespace-nowrap">
                        {profile.streakDays || 1}🔥 STREAK
                    </span>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[40vh] custom-scrollbar pr-1">
                    {activeQuests.length === 0 ? (
                        <div className="text-[8px] text-gray-400 py-4 text-center">
                            No active quests.
                        </div>
                    ) : (
                        activeQuests.map((q) => (
                            <div key={q.id} className="scale-90 origin-top">
                                <QuestCard 
                                    quest={q} 
                                    onComplete={() => onCompleteQuest?.(q.id)} 
                                    onDelete={() => onDeleteQuest?.(q.id)} 
                                />
                            </div>
                        ))
                    )}
                </div>
                <button 
                    onClick={onOpenNewQuest}
                    className="w-full py-1.5 text-[8px] font-bold text-yellow-400 border border-yellow-600 bg-transparent hover:bg-yellow-900/40 transition"
                >
                    + NEW QUEST
                </button>
            </div>

            {/* BOTTOM CENTER — Toolkit / Pomodoro Timer */}
            <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto rounded-md w-[340px] flex flex-col overflow-hidden"
                style={{ background: "#050c1e", border: "2px solid #2a4a8a" }}
            >
                <div className="flex justify-between px-3 py-2 text-[8px] text-gray-400 bg-[#030713]">
                    <span className={`cursor-pointer transition ${mode === 'Pomodoro' ? 'text-[#a0d8f0]' : 'hover:text-white'}`} onClick={() => switchMode('Pomodoro', 25)}>Pomodoro</span>
                    <span className={`cursor-pointer transition ${mode === 'Stopwatch' ? 'text-[#a0d8f0]' : 'hover:text-white'}`} onClick={() => switchMode('Stopwatch', 0, true)}>Stopwatch</span>
                    <span className={`cursor-pointer transition ${mode === 'Focus 15m' ? 'text-[#a0d8f0]' : 'hover:text-white'}`} onClick={() => switchMode('Focus 15m', 15)}>Focus 15m</span>
                    <span className={`cursor-pointer transition ${mode === 'Endurance' ? 'text-[#a0d8f0]' : 'hover:text-white'}`} onClick={() => switchMode('Endurance', 60)}>Endurance</span>
                </div>
                
                <div className="py-5 flex flex-col items-center gap-3">
                    <div className="text-4xl text-white tracking-widest">{mins}:{secs}</div>
                    <button 
                        onClick={toggleTimer}
                        className={`mt-1 px-8 py-2 rounded text-[10px] border tracking-wider transition-colors ${isActive ? 'bg-red-900/40 border-red-600 text-red-200 hover:bg-red-900' : 'bg-transparent border-yellow-500 text-yellow-500 hover:bg-yellow-900/30'}`}
                    >
                        {isActive ? 'PAUSE' : 'START'}
                    </button>
                </div>
                
                <div className="flex justify-between px-3 py-1.5 text-[7.5px] bg-[#030713] text-gray-400 border-t border-[#1a386a]">
                    <span>MODE: {mode.toUpperCase()}</span>
                    <span className="text-yellow-500">REWARD: {mode === 'Pomodoro' ? 25 : mode === 'Focus 15m' ? 15 : mode === 'Endurance' ? 100 : 0} XP</span>
                </div>
            </div>

        </div>
    );
}
