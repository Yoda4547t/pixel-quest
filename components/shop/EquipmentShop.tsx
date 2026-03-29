"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EQUIPMENT_DATABASE } from "@/lib/equipment-data";
import { Equipment } from "@/lib/game-engine/types";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface EquipmentShopProps {
    onClose: () => void;
}

export function EquipmentShop({ onClose }: EquipmentShopProps) {
    const { profile, buyEquipment, equipItem } = useAuthStore();
    const [selectedTab, setSelectedTab] = useState<'weapon' | 'armor' | 'accessory'>('weapon');

    if (!profile) return null;

    const filteredItems = EQUIPMENT_DATABASE.filter(item => item.type === selectedTab);

    const handlePurchase = (item: Equipment) => {
        const isOwned = profile.unlockedEquipment.includes(item.id);

        if (isOwned) {
            equipItem(item.id);
            toast.success(`Equipped ${item.name}!`);
        } else {
            const success = buyEquipment(item.id);
            if (success) {
                toast.success(`Bought ${item.name}!`, { icon: "🛒" });
                equipItem(item.id);
            } else {
                toast.error("Not enough coins!");
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            >
                <Card variant="bordered" className="bg-orange-950 border-orange-600 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6 shadow-[0_0_50px_rgba(234,88,12,0.3)]">
                    <div className="flex justify-between items-center mb-6 border-b-4 border-orange-800 pb-4">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl drop-shadow-md">🏤</span>
                            <div>
                                <h2 className="text-2xl text-orange-400 font-pixel drop-shadow-md">THE BLACKSMITH</h2>
                                <p className="text-[10px] text-orange-300 font-pixel mt-1">"Best gear this side of the code repo."</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <Button variant="ghost" onClick={onClose} className="text-orange-300">LEAVE SHOP</Button>
                            <span className="text-yellow-400 font-pixel text-xs mt-2 drop-shadow-md">🪙 {profile.coins} COINS</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6 border-b-2 border-orange-900 pb-2">
                        {(['weapon', 'armor', 'accessory'] as const).map(tab => (
                            <Button
                                key={tab}
                                variant={selectedTab === tab ? "primary" : "ghost"}
                                size="sm"
                                className={`text-[10px] flex-1 capitalize ${selectedTab === tab ? 'bg-orange-600 border-orange-400 text-white' : 'text-gray-400 border-2 border-orange-900 bg-black/40'}`}
                                onClick={() => setSelectedTab(tab)}
                            >
                                {tab}S
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredItems.map((item) => {
                            const isOwned = profile.unlockedEquipment.includes(item.id);
                            const isEquipped = profile.equipment[item.type] === item.id;

                            return (
                                <Card key={item.id} variant="bordered" className="bg-black/60 border-orange-800 p-4 flex flex-col justify-between hover:border-orange-500 transition-colors w-full">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-pixel text-sm text-white mb-2">{item.name}</h4>
                                            <p className="text-xs text-yellow-400 font-pixel drop-shadow-md">
                                                {isOwned ? "OWNED" : `🪙 ${item.price}`}
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
                                            {item.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 text-[8px] font-pixel text-green-300">
                                            {item.statBonus?.strength && <span>+STR {item.statBonus.strength}</span>}
                                            {item.statBonus?.intelligence && <span>+INT {item.statBonus.intelligence}</span>}
                                            {item.statBonus?.focus && <span>+FCS {item.statBonus.focus}</span>}
                                            {item.statBonus?.resilience && <span>+RES {item.statBonus.resilience}</span>}
                                            {item.xpBonusMultiplier && <span className="text-blue-300">+{Math.round((item.xpBonusMultiplier - 1) * 100)}% XP</span>}
                                            {item.coinBonusMultiplier && <span className="text-yellow-300">+{Math.round((item.coinBonusMultiplier - 1) * 100)}% COINS</span>}
                                        </div>
                                    </div>

                                    <Button
                                        className={`mt-auto text-xs py-2 w-full ${isEquipped ? 'opacity-50' : ''}`}
                                        variant={isEquipped ? "ghost" : (isOwned ? "primary" : "secondary")}
                                        onClick={() => handlePurchase(item)}
                                        disabled={isEquipped}
                                    >
                                        {isEquipped ? "EQUIPPED" : (isOwned ? "EQUIP " + item.type.toUpperCase() : "BUY " + item.type.toUpperCase())}
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
