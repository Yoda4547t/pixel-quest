"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { PlayerCharacter } from "@/components/game/PlayerCharacter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { EquipmentShop } from "@/components/shop/EquipmentShop";
import { QuestBoard } from "@/components/town/QuestBoard";
import { TileMap } from "@/components/world/TileMap";
import { AmbientParticles } from "@/components/effects/AmbientParticles";
import { townMap } from "@/lib/maps/townMap";
import { TileType } from "@/lib/maps/types";
import { audio } from "@/lib/soundEngine";
import { useSettingsStore } from "@/store/useSettingsStore";

const SHOP_ITEMS = [
    { id: 'red', name: 'RED SLIME', price: 50 },
    { id: 'blue', name: 'AQUA MAGE', price: 100 },
    { id: 'green', name: 'TOXIC GOBLIN', price: 150 },
    { id: 'gold', name: 'GOLD KNIGHT', price: 500 },
    { id: 'obsidian', name: 'DARK LORD', price: 1000 },
];

export default function TownPage() {
    const { profile, spendCoins, equipColor } = useAuthStore();
    const { ambientEnabled } = useSettingsStore();
    const router = useRouter();
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isGearShopOpen, setIsGearShopOpen] = useState(false);
    const [isQuestBoardOpen, setIsQuestBoardOpen] = useState(false);

    useEffect(() => {
        if (ambientEnabled) audio?.playAmbient('town');
        else audio?.stopAmbient();
        return () => { audio?.stopAmbient(); };
    }, [ambientEnabled]);

    const handleInteract = (type: TileType, x: number, y: number) => {
        if (type === TileType.SKIN_SHOP) setIsShopOpen(true);
        if (type === TileType.UPGRADE_SHOP) setIsGearShopOpen(true);
        if (type === TileType.QUEST_BOARD) setIsQuestBoardOpen(true);
        if (type === TileType.HOSPITAL) toast("You rested at the Hospital. Health restored!", { icon: "🏥", id: "heal-toast" });
    };

    if (!profile) return null;

    const handlePurchase = (item: typeof SHOP_ITEMS[0]) => {
        const hasItem = profile.unlockedColors.includes(item.id);

        if (hasItem) {
            equipColor(item.id);
            toast.success(`Equipped ${item.name}!`);
        } else {
            const success = spendCoins(item.price, item.id);
            if (success) {
                toast.success(`Bought ${item.name}!`, { icon: "🛒" });
                equipColor(item.id);
            } else {
                toast.error("Not enough coins!");
            }
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto h-full flex flex-col gap-4 relative">
            {/* Atmospheric Overlay & Particles */}
            <div className="fixed inset-0 pointer-events-none z-30 mix-blend-multiply bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>
            <AmbientParticles type="dust" />
            
            <div className="flex justify-between items-center bg-black/50 p-4 border-4 border-secondary rounded-lg shrink-0 overflow-hidden relative z-40">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push('/dashboard')}>&lt; WORLD MAP</Button>
                    <h1 className="text-xl md:text-2xl text-primary font-pixel drop-shadow-md">TOWN SQUARE</h1>
                </div>
                <div className="flex flex-col items-end font-pixel text-yellow-400">
                    <span className="text-[10px] text-gray-400">YOUR WALLET</span>
                    <span className="text-sm md:text-lg drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">🪙 {profile.coins}</span>
                </div>
            </div>

            <div className="bg-black/80 border-4 border-gray-700 p-2 text-center flex flex-col items-center justify-center gap-1">
                <p className="text-[10px] text-gray-400 font-pixel">USE W,A,S,D OR ARROWS TO MOVE.</p>
                <p className="text-[10px] text-yellow-400 font-pixel animate-pulse">STAND NEXT TO A BUILDING AND PRESS SPACE/ENTER TO INTERACT!</p>
            </div>

            {/* Game Grid via TileMap Engine */}
            <TileMap 
                mapData={townMap} 
                onInteract={handleInteract} 
                isLocked={isShopOpen || isGearShopOpen}
            />

            {/* Shop Overlay Modal */}
            <AnimatePresence>
                {isShopOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    >
                        <Card variant="bordered" className="bg-gray-900 border-primary w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl text-primary font-pixel drop-shadow-md">SKIN SHOP</h2>
                                <Button variant="ghost" onClick={() => setIsShopOpen(false)}>CLOSE</Button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/3">
                                    <Card variant="bordered" className="bg-black/60 p-6 flex flex-col items-center justify-center gap-4 h-full border-gray-700">
                                        <h3 className="font-pixel text-sm text-gray-300">AVATAR PREVIEW</h3>
                                        <div className="scale-150 my-12 pointer-events-none">
                                            <PlayerCharacter scale={1} />
                                        </div>
                                    </Card>
                                </div>

                                <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {SHOP_ITEMS.map((item) => {
                                        const isOwned = profile.unlockedColors.includes(item.id);
                                        const isEquipped = profile.avatarColor === item.id;

                                        return (
                                            <Card key={item.id} variant="bordered" className="bg-black/40 border-gray-700 p-4 flex flex-col justify-between hover:border-primary transition-colors">
                                                <div>
                                                    <h4 className="font-pixel text-sm text-white">{item.name}</h4>
                                                    <p className="text-xs text-yellow-400 font-pixel mt-2">
                                                        {isOwned ? "OWNED" : `🪙 ${item.price}`}
                                                    </p>
                                                </div>

                                                <Button
                                                    className="mt-4 text-xs py-2 w-full"
                                                    variant={isEquipped ? "ghost" : (isOwned ? "primary" : "secondary")}
                                                    onClick={() => handlePurchase(item)}
                                                >
                                                    {isEquipped ? "EQUIPPED" : (isOwned ? "EQUIP" : "BUY")}
                                                </Button>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {isGearShopOpen && <EquipmentShop onClose={() => setIsGearShopOpen(false)} />}
            {isQuestBoardOpen && <QuestBoard onClose={() => setIsQuestBoardOpen(false)} />}
        </div>
    );
}
