"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { BUILDINGS_DATABASE, getBuildingPrice } from "@/lib/buildings";
import toast from "react-hot-toast";

interface BaseManagerProps {
    onClose: () => void;
}

export function BaseManagerModal({ onClose }: BaseManagerProps) {
    const { profile, upgradeBuilding } = useAuthStore();
    
    if (!profile) return null;

    const handleUpgrade = (bId: string, price: number) => {
        if (profile.coins < price) {
            toast.error("Not enough Coins!");
            return;
        }

        const success = upgradeBuilding(bId);
        if (success) {
            toast.success("Building Upgraded!", { icon: "🏗️" });
        } else {
            toast.error("Upgrade failed. You may need a higher Town Hall level.");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
            >
                <Card variant="bordered" className="bg-slate-950/80 border-emerald-600 border-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6 shadow-[0_0_50px_rgba(5,150,105,0.5)] backdrop-blur-md">
                    <div className="flex justify-between items-start mb-6 border-b-4 border-emerald-900 pb-4">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl drop-shadow-md">🏰</span>
                            <div>
                                <h2 className="text-2xl text-emerald-400 font-pixel drop-shadow-md">BASE MANAGEMENT</h2>
                                <p className="text-[10px] text-emerald-300 font-pixel mt-1">"Your sanctuary of productivity."</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <Button variant="ghost" onClick={onClose} className="text-emerald-300 border-emerald-800">CLOSE</Button>
                            <span className="text-yellow-400 font-pixel text-xs mt-2">
                                🪙 {profile.coins} COINS
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BUILDINGS_DATABASE.map(bDef => {
                            const level = profile.playerBase.buildings[bDef.id]?.level || 0;
                            const price = getBuildingPrice(bDef.basePrice, bDef.priceMultiplier, level);
                            const isTownHall = bDef.id === 'town_hall';
                            const townHallLvl = profile.playerBase.buildings['town_hall']?.level || 0;
                            const levelCapped = (!isTownHall && level >= townHallLvl);
                            
                            return (
                                <Card key={bDef.id} variant="bordered" className={`bg-slate-900 border-emerald-800 p-4 flex flex-col justify-between ${level > 0 ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl drop-shadow-md">{bDef.sprite}</span>
                                            <div>
                                                <h3 className="text-sm font-pixel text-emerald-300">{bDef.name}</h3>
                                                <p className="text-[10px] text-emerald-500 font-pixel">Level {level}</p>
                                            </div>
                                        </div>
                                        {level > 0 && <span className="text-xs bg-emerald-900 text-emerald-300 px-2 rounded-full font-pixel py-1 text-[8px]">ACTIVE</span>}
                                    </div>
                                    
                                    <p className="text-gray-400 text-xs mb-4 min-h-[40px] flex items-center">{bDef.description}</p>
                                    
                                    <Button 
                                        onClick={() => handleUpgrade(bDef.id, price)} 
                                        disabled={profile.coins < price || levelCapped}
                                        className={`w-full text-[10px] font-pixel mt-2 border-2 min-h-[40px] ${(profile.coins < price || levelCapped) ? 'bg-slate-800 text-gray-500 border-slate-700' : 'bg-emerald-700 text-white border-emerald-500 hover:bg-emerald-600'}`}
                                    >
                                        {levelCapped ? `REQUIRES TOWN HALL LVL ${level + 1}` : `UPGRADE (🪙 ${price})`}
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
