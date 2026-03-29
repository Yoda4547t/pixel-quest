"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PetSelectionProps {
    onClose: () => void;
}

const PETS_DB = [
    { id: 'fox', name: 'Scout Fox', sprite: '🦊', description: '+10% bonus to all XP gains.' },
    { id: 'drone', name: 'Coin Drone', sprite: '🛸', description: '+10% bonus to all Coin gains.' },
    { id: 'orb', name: 'Magic Orb', sprite: '🔮', description: '+5% bonus to both XP and Coins.' },
];

export function PetSelectionModal({ onClose }: PetSelectionProps) {
    const { profile, equipPet } = useAuthStore();
    
    if (!profile) return null;

    const handleEquip = (petId: string) => {
        equipPet(petId);
        onClose();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-lg"
                >
                    <Card variant="bordered" className="bg-slate-900 border-4 border-yellow-600 p-6 shadow-[0_0_30px_rgba(202,138,4,0.3)]">
                        <div className="flex justify-between items-start mb-6 border-b-2 border-yellow-900 pb-4">
                            <div>
                                <h2 className="text-xl md:text-2xl font-pixel text-yellow-400 drop-shadow-md">COMPANION SELECT</h2>
                                <p className="font-pixel text-[10px] text-gray-400 mt-2">"A trusty friend for your journey."</p>
                            </div>
                            <Button variant="ghost" onClick={onClose} className="text-yellow-600 hover:text-yellow-400 hover:bg-yellow-900/30">X</Button>
                        </div>

                        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {PETS_DB.map(pet => {
                                const isUnlocked = profile.unlockedPets?.includes(pet.id);
                                const isEquipped = profile.activePet === pet.id;

                                return (
                                    <div 
                                        key={pet.id} 
                                        className={`p-3 border-2 flex items-center gap-4 transition-colors ${
                                            isEquipped ? 'bg-yellow-950/40 border-yellow-500 shadow-[inset_0_0_20px_rgba(234,179,8,0.2)]' : 
                                            isUnlocked ? 'bg-slate-800 border-slate-600 hover:border-yellow-700' :
                                            'bg-slate-900 border-slate-800 opacity-50 grayscale'
                                        }`}
                                    >
                                        <div className="w-16 h-16 shrink-0 bg-black/60 rounded flex items-center justify-center text-4xl shadow-inner border border-slate-700">
                                            {pet.sprite}
                                        </div>
                                        <div className="flex-1 font-pixel">
                                            <h3 className={`text-sm ${isEquipped ? 'text-yellow-400' : 'text-gray-300'}`}>{pet.name}</h3>
                                            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">{isUnlocked ? pet.description : 'Locked'}</p>
                                        </div>
                                        <div className="shrink-0 flex flex-col justify-center">
                                            <Button 
                                                variant={isEquipped ? 'ghost' : isUnlocked ? 'primary' : 'secondary'}
                                                disabled={!isUnlocked || isEquipped}
                                                onClick={() => handleEquip(pet.id)}
                                                className={`text-xs px-4 py-2 ${isEquipped ? 'text-yellow-500 border-yellow-700 bg-black/50 hover:bg-black/50' : isUnlocked ? 'bg-yellow-600 text-black hover:bg-yellow-500 border-yellow-400' : ''}`}
                                            >
                                                {isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : 'LOCKED'}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
