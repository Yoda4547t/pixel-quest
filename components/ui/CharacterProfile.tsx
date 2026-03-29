"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { PlayerCharacter } from "@/components/game/PlayerCharacter";
import { getEquipmentById } from "@/lib/equipment-data";
import { motion, AnimatePresence } from "framer-motion";
import { PetSelectionModal } from "@/components/game/PetSelection";

export function CharacterProfileModal({ onClose }: { onClose: () => void }) {
    const { profile } = useAuthStore();
    const [isSelectingPet, setIsSelectingPet] = useState(false);

    if (!profile) return null;

    const weapon = profile.equipment.weapon ? getEquipmentById(profile.equipment.weapon) : null;
    const armor = profile.equipment.armor ? getEquipmentById(profile.equipment.armor) : null;
    const accessory = profile.equipment.accessory ? getEquipmentById(profile.equipment.accessory) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-900 border-4 border-blue-600 rounded-lg p-6 max-w-md w-full relative"
            >
                <div className="flex justify-between items-start mb-6 border-b-2 border-blue-900 pb-4">
                    <div>
                        <h2 className="text-2xl font-pixel text-blue-400 drop-shadow-md">HERO PROFILE</h2>
                        <p className="font-pixel text-[10px] text-gray-400 mt-2">LVL {profile.level} {profile.username?.toUpperCase() || profile.email?.split('@')[0].toUpperCase()}</p>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="text-red-500 hover:bg-red-900/50">X</Button>
                </div>

                <div className="flex gap-6 mb-6">
                    {/* Character Preview */}
                    <div className="flex flex-col items-center justify-center p-4 bg-black/50 border-4 border-slate-700 rounded w-1/2 relative min-h-[160px]">
                        <PlayerCharacter scale={1.5} />
                    </div>

                    {/* Stats List */}
                    <div className="w-1/2 flex flex-col gap-3 font-pixel text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-red-400">STRUCT</span>
                            <span>{profile.stats.strength}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-blue-400">INTEL</span>
                            <span>{profile.stats.intelligence}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-yellow-400">FOCUS</span>
                            <span>{profile.stats.focus}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-green-400">RESIL</span>
                            <span>{profile.stats.resilience}</span>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t-2 border-slate-700">
                            <div className="flex justify-between text-yellow-500">
                                <span>COINS</span>
                                <span>🪙 {profile.coins}</span>
                            </div>
                            <div className="flex justify-between text-purple-400 mt-2">
                                <span>TOTAL XP</span>
                                <span>{profile.totalXP}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Equipment Loadout */}
                <h3 className="font-pixel text-[10px] text-gray-400 mb-2">EQUIPPED GEAR</h3>
                <div className="grid grid-cols-3 gap-2 mb-6 cursor-default">
                    <div className="bg-black/50 border-2 border-slate-700 p-2 text-center flex flex-col items-center">
                        <span className="text-xl mb-1">{weapon ? (weapon.id === "wpn_sword_discipline" ? "⚔️" : "🗡️") : "❌"}</span>
                        <span className="font-pixel text-[8px] text-gray-500 truncate w-full">{weapon ? weapon.name : "None"}</span>
                    </div>
                    <div className="bg-black/50 border-2 border-slate-700 p-2 text-center flex flex-col items-center">
                        <span className="text-xl mb-1">{armor ? (armor.id === "amr_scholar_hat" ? "🧙‍♂️" : "🛡️") : "❌"}</span>
                        <span className="font-pixel text-[8px] text-gray-500 truncate w-full">{armor ? armor.name : "None"}</span>
                    </div>
                    <div className="bg-black/50 border-2 border-slate-700 p-2 text-center flex flex-col items-center">
                        <span className="text-xl mb-1">{accessory ? (accessory.id === "acc_focus_amulet" ? "🧿" : "🪙") : "❌"}</span>
                        <span className="font-pixel text-[8px] text-gray-500 truncate w-full">{accessory ? accessory.name : "None"}</span>
                    </div>
                </div>

                {/* Active Pet & Abilities */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-pixel text-[10px] text-gray-400">COMPANION</h3>
                            <Button 
                                variant="ghost" 
                                className="h-4 text-[8px] px-2 py-0 border border-blue-800 text-blue-400 hover:text-blue-300"
                                onClick={() => setIsSelectingPet(true)}
                            >
                                CHANGE
                            </Button>
                        </div>
                        <div className="bg-black/50 border-2 border-slate-700 p-3 font-pixel text-xs text-center flex items-center justify-center gap-2">
                           {profile.activePet === 'fox' && <><span className="text-2xl">🦊</span> Scout Fox</>}
                           {profile.activePet === 'drone' && <><span className="text-2xl animate-pulse">🛸</span> Coin Drone</>}
                           {profile.activePet === 'orb' && <><span className="text-2xl">🔮</span> Magic Orb</>}
                           {!profile.activePet && <span className="text-gray-600">No Pet</span>}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-pixel text-[10px] text-gray-400 mb-2">SKILLS ({profile.abilities.length})</h3>
                        <div className="bg-black/50 border-2 border-slate-700 p-1 font-pixel flex items-center justify-center flex-wrap gap-1 min-h-[52px]">
                            {profile.abilities.map(ab => (
                               <span key={ab} className="text-[8px] bg-blue-900/50 text-blue-300 px-1 py-0.5 rounded border border-blue-700">{ab.split("_").join(" ")}</span>
                            ))}
                            {profile.abilities.length === 0 && <span className="text-[8px] text-gray-600">No skills</span>}
                        </div>
                    </div>
                </div>
            </motion.div>

            {isSelectingPet && <PetSelectionModal onClose={() => setIsSelectingPet(false)} />}
        </div>
    );
}
