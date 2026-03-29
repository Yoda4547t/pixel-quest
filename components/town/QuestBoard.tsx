"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuestStore } from "@/store/useQuestStore";
import { useAuthStore } from "@/store/useAuthStore";
import { emitFeedback } from "@/components/effects/FeedbackEffects";
import { audio } from "@/lib/soundEngine";
import toast from "react-hot-toast";

interface QuestBoardProps {
    onClose: () => void;
}

export function QuestBoard({ onClose }: QuestBoardProps) {
    const { dailyMissions, refreshDailyMissions, claimDailyMission } = useQuestStore();
    const { profile, addCoins, updateXP } = useAuthStore();

    useEffect(() => {
        refreshDailyMissions();
    }, [refreshDailyMissions]);

    const handleClaim = (mission: typeof dailyMissions[0], e: React.MouseEvent) => {
        if (!mission.isCompleted && mission.currentCount >= mission.targetCount) {
            claimDailyMission(mission.id);
            addCoins(mission.coinReward);
            updateXP(mission.xpReward);
            
            audio?.playLevelUp(); // Short fanfare
            
            // Visual feedback
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            emitFeedback(rect.left + rect.width / 2, rect.top, `+${mission.xpReward}`, 'xp');
            setTimeout(() => {
                emitFeedback(rect.left + rect.width / 2, rect.top + 20, `+${mission.coinReward}`, 'coin');
            }, 300);
            
            toast.success("Reward Claimed!", { icon: "🏆" });
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 50 }}
                    className="w-full max-w-2xl"
                >
                    <Card variant="bordered" className="bg-[url('/wood-texture-placeholder.png')] bg-[#3d2314] border-8 border-[#5c3a21] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative p-6 pt-12 overflow-hidden">
                        
                        {/* Title Plaque */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#5c3a21] border-b-4 border-[#2a1a11] px-8 py-2 rounded-b-lg shadow-md">
                            <h2 className="text-xl md:text-2xl text-yellow-500 font-pixel drop-shadow-[0_2px_0_rgba(0,0,0,1)] text-center">DAILY MISSIONS</h2>
                        </div>

                        <Button 
                            variant="ghost" 
                            onClick={onClose} 
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        >
                            CLOSE
                        </Button>

                        <div className="mt-8 flex flex-col gap-4">
                            {dailyMissions.length === 0 ? (
                                <p className="text-center font-pixel text-gray-400">Loading missions...</p>
                            ) : (
                                dailyMissions.map(mission => {
                                    const isDone = mission.currentCount >= mission.targetCount;
                                    const isClaimed = mission.isCompleted;

                                    return (
                                        <div key={mission.id} className="bg-[#facc15]/10 border-2 border-yellow-700/50 p-4 relative overflow-hidden group">
                                            {/* Paper texture overlay */}
                                            <div className="absolute inset-0 bg-yellow-900/10 pointer-events-none mix-blend-overlay"></div>
                                            
                                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-yellow-400 font-pixel text-sm md:text-base drop-shadow-md flex items-center gap-2">
                                                        {isClaimed ? '✅' : '📜'} {mission.title}
                                                    </h3>
                                                    <p className="text-xs text-yellow-200/70 font-pixel mt-2 leading-relaxed">
                                                        {mission.description}
                                                    </p>
                                                    
                                                    {/* Progress Bar */}
                                                    <div className="mt-3 w-full bg-black/50 h-2 rounded-full overflow-hidden border border-yellow-900/50">
                                                        <motion.div 
                                                            className={`h-full ${isClaimed ? 'bg-green-500' : isDone ? 'bg-yellow-400' : 'bg-blue-500'}`}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min((mission.currentCount / mission.targetCount) * 100, 100)}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                        />
                                                    </div>
                                                    <p className="text-[8px] text-right font-pixel text-yellow-500/50 mt-1">
                                                        {Math.min(mission.currentCount, mission.targetCount)} / {mission.targetCount}
                                                    </p>
                                                </div>

                                                <div className="flex flex-row md:flex-col items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                                                    <div className="flex gap-2 text-xs font-pixel drop-shadow-md">
                                                        <span className="text-yellow-400">🪙 {mission.coinReward}</span>
                                                        <span className="text-blue-400">⚡ {mission.xpReward}</span>
                                                    </div>
                                                    
                                                    <Button
                                                        onClick={(e) => handleClaim(mission, e)}
                                                        disabled={!isDone || isClaimed}
                                                        variant={isClaimed ? 'ghost' : isDone ? 'primary' : 'secondary'}
                                                        className={`w-full text-[10px] md:text-xs font-pixel py-2 shadow-md ${
                                                            isClaimed ? 'bg-[#2a1a11] text-gray-500 border-gray-700' : 
                                                            isDone ? 'bg-green-600 border-green-400 text-white hover:bg-green-500 hover:scale-105' : 
                                                            'bg-slate-800 text-gray-400 border-slate-700'
                                                        }`}
                                                    >
                                                        {isClaimed ? 'CLAIMED' : isDone ? 'CLAIM REWARD' : 'IN PROGRESS'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
