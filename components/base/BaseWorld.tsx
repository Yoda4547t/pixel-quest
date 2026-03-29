"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { BUILDINGS_DATABASE, getBuildingPrice } from "@/lib/buildings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { InteractiveCursor } from "@/components/ui/InteractiveCursor";
import { audio } from "@/lib/soundEngine";
import { useSettingsStore } from "@/store/useSettingsStore";
import { emitFeedback } from "@/components/effects/FeedbackEffects";

export function BaseWorld({ onClose }: { onClose: () => void }) {
    const { profile, upgradeBuilding } = useAuthStore();
    const { ambientEnabled } = useSettingsStore();
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

    React.useEffect(() => {
        if (ambientEnabled) audio?.playAmbient('base');
        else audio?.stopAmbient();
        return () => { audio?.stopAmbient(); };
    }, [ambientEnabled]);

    if (!profile) return null;

    const handleUpgrade = (bId: string, price: number) => {
        if (profile.coins < price) {
            toast.error("Not enough Coins!");
            return;
        }

        const success = upgradeBuilding(bId);
        if (success) {
            toast.success("Building Upgraded!", { icon: "🏗️" });
            setSelectedBuildingId(null);
            audio?.playLevelUp();
            emitFeedback(window.innerWidth / 2, window.innerHeight / 2, `-${price}`, 'coin');
        } else {
            toast.error("Upgrade failed. You may need a higher Town Hall level.");
        }
    };

    // Hardcoded Clash of Clans style tile positioning on a 100x100 grid map
    const layout = {
        'town_hall': { x: 50, y: 30 },
        'library': { x: 30, y: 60 },
        'vault': { x: 70, y: 50 },
        'training_ground': { x: 50, y: 80 },
    };

    const getBuildingSprite = (id: string, level: number, defaultSprite: string) => {
        if (level === 0) return "➕"; // Build plot
        if (id === 'town_hall') return level < 3 ? '⛺' : level < 5 ? '🛖' : level < 10 ? '🏠' : '🏰';
        if (id === 'library') return level < 3 ? '📜' : level < 7 ? '📚' : '🏛️';
        if (id === 'vault') return level < 3 ? '💰' : level < 7 ? '🏦' : '💎';
        if (id === 'training_ground') return level < 3 ? '🎯' : level < 7 ? '⚔️' : '🏟️';
        return defaultSprite;
    };

    const activeBuilding = selectedBuildingId ? BUILDINGS_DATABASE.find(b => b.id === selectedBuildingId) : null;
    const activeLevel = activeBuilding ? (profile.playerBase.buildings[activeBuilding.id]?.level || 0) : 0;
    const activePrice = activeBuilding ? getBuildingPrice(activeBuilding.basePrice, activeBuilding.priceMultiplier, activeLevel) : 0;
    
    const townHallLvl = profile.playerBase.buildings['town_hall']?.level || 0;
    const levelCapped = activeBuilding && activeBuilding.id !== 'town_hall' && activeLevel >= townHallLvl;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md"
            >
                {/* Header Menu */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                    <div className="bg-emerald-950/80 border-2 border-emerald-700 p-3 rounded pointer-events-auto">
                        <h2 className="text-xl text-emerald-400 font-pixel drop-shadow-md">YOUR TILE BASE</h2>
                        <span className="text-yellow-400 font-pixel text-[10px] drop-shadow-md mt-1 block">🪙 {profile.coins} COINS</span>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="pointer-events-auto bg-emerald-900 border-emerald-600 text-white hover:bg-emerald-700">EXIT FIELD</Button>
                </div>

                {/* The Map Grid representation */}
                <div className="relative w-full max-w-4xl aspect-video bg-[#4ade80] rounded-xl border-8 border-emerald-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,0,0,0.2)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.2)_2px,transparent_2px)] bg-[size:40px_40px] pointer-events-none" />

                    {/* Plots & Buildings */}
                    {BUILDINGS_DATABASE.map(bDef => {
                        const level = profile.playerBase.buildings[bDef.id]?.level || 0;
                        const pos = layout[bDef.id as keyof typeof layout] || { x: 50, y: 50 };
                        const sprite = getBuildingSprite(bDef.id, level, bDef.sprite);

                        return (
                            <motion.div
                                key={bDef.id}
                                className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group ${level === 0 ? 'opacity-50' : ''}`}
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedBuildingId(bDef.id)}
                            >
                                <div className={`w-20 h-20 md:w-32 md:h-32 rounded-lg border-4 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-colors ${selectedBuildingId === bDef.id ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 'border-emerald-700 group-hover:border-emerald-400'}`}>
                                    <span className="text-4xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{sprite}</span>
                                </div>
                                <span className="bg-black/80 font-pixel text-[8px] md:text-[10px] text-white px-2 py-1 mt-2 rounded border border-gray-600 whitespace-nowrap">
                                    {level === 0 ? `Unbuilt ${bDef.name}` : `Lv.${level} ${bDef.name}`}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Upgrade Modal overlaying the bottom */}
                <AnimatePresence>
                    {activeBuilding && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 200, opacity: 0 }}
                            className="absolute bottom-4 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-xl bg-slate-900 border-4 border-emerald-600 p-4 rounded-xl shadow-[0_0_50px_rgba(5,150,105,0.4)] z-50 flex flex-col md:flex-row gap-4 items-center"
                        >
                            <div className="text-5xl md:text-7xl shrink-0 p-4 bg-black/50 rounded-lg border-2 border-slate-700 shadow-inner">
                                {getBuildingSprite(activeBuilding.id, activeLevel, activeBuilding.sprite)}
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-xl md:text-2xl text-emerald-400 font-pixel drop-shadow-sm">{activeBuilding.name} <span className="text-sm text-emerald-200">LV.{activeLevel}</span></h3>
                                <p className="text-xs text-gray-400 font-pixel mt-2 leading-relaxed">{activeBuilding.description}</p>
                                
                                <div className="mt-4 flex gap-3 w-full">
                                    <Button 
                                        onClick={() => handleUpgrade(activeBuilding.id, activePrice)}
                                        disabled={profile.coins < activePrice || !!levelCapped}
                                        className={`flex-1 font-pixel text-[10px] md:text-xs py-2 box-content border-2 ${profile.coins < activePrice || levelCapped ? 'bg-slate-800 border-slate-700 text-gray-500' : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500'}`}
                                    >
                                        {levelCapped ? `REQ TOWN HALL LV.${activeLevel + 1}` : activeLevel === 0 ? `BUILD (🪙 ${activePrice})` : `UPGRADE (🪙 ${activePrice})`}
                                    </Button>
                                    <Button variant="ghost" className="border-2 border-red-900 text-red-400 hover:bg-red-950 font-pixel text-[10px]" onClick={() => setSelectedBuildingId(null)}>CANCEL</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
