"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { PlayerCharacter } from "@/components/game/PlayerCharacter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { TileMap } from "@/components/world/TileMap";
import { AmbientParticles } from "@/components/effects/AmbientParticles";
import { forestMap } from "@/lib/maps/forestMap";
import { TileType } from "@/lib/maps/types";
import { audio } from "@/lib/soundEngine";
import { useSettingsStore } from "@/store/useSettingsStore";

// Mock Data for Guild
const GUILD_MEMBERS = [
    { id: '1', name: 'CodeWizard', level: 12, className: 'Mage', status: 'online' },
    { id: '2', name: 'BugSmasher', level: 8, className: 'Warrior', status: 'offline' },
    { id: '3', name: 'PixelNinja', level: 15, className: 'Rogue', status: 'online' },
];

export default function ForestPage() {
    const { profile } = useAuthStore();
    const { ambientEnabled } = useSettingsStore();
    const router = useRouter();

    const [isGuildOpen, setIsGuildOpen] = useState(false);

    useEffect(() => {
        if (ambientEnabled) audio?.playAmbient('forest');
        else audio?.stopAmbient();
        return () => { audio?.stopAmbient(); };
    }, [ambientEnabled]);

    const handleInteract = (type: TileType, x: number, y: number) => {
        if (type === TileType.GUILD_TENT) setIsGuildOpen(true);
        // Note: NPCs aren't explicitly typed yet, but we'll leave room
        toast("Hello traveler! The Guild Tent is just north of here.", { icon: "🧙‍♂️" });
    };

    if (!profile) return null;

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto h-full flex flex-col gap-4 relative">
            {/* Mystic Forest Atmospheric Overlay & Particles */}
            <div className="fixed inset-0 pointer-events-none z-30 mix-blend-multiply bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,35,15,0.85)_100%)]"></div>
            <AmbientParticles type="fireflies" />

            <div className="flex justify-between items-center bg-green-950/40 p-4 border-4 border-green-800 rounded-lg shrink-0 relative z-40">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.push('/dashboard')} className="border-green-800 hover:bg-green-900/50 hover:text-white text-green-400">&lt; BACK TO MAP</Button>
                    <h1 className="text-xl md:text-2xl text-green-500 font-pixel drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">MYSTIC FOREST</h1>
                </div>
            </div>

            <div className="bg-black/80 border-4 border-green-900 p-2 text-center flex flex-col items-center justify-center gap-1 text-green-400 font-pixel text-[10px]">
                <p>USE W,A,S,D OR ARROWS TO MOVE. WATCH OUT FOR WATER.</p>
                <p className="animate-pulse flex items-center gap-2">FIND THE GUILD TENT ⛺ AND PRESS SPACE TO ENTER!</p>
            </div>

            {/* Game Grid via TileMap Engine */}
            <TileMap 
                mapData={forestMap} 
                onInteract={handleInteract} 
                isLocked={isGuildOpen}
            />

            {/* Guild Interation Modal */}
            <AnimatePresence>
                {isGuildOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    >
                        <Card variant="bordered" className="bg-green-950/90 border-green-700 border-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-[0_0_50px_rgba(21,128,61,0.2)] p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl text-green-400 font-pixel drop-shadow-md">GUILD HALL</h2>
                                <Button variant="ghost" onClick={() => setIsGuildOpen(false)} className="text-green-500 border-green-800">LEAVE TENT</Button>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 font-pixel leading-relaxed">
                                Welcome to the adventurer's guild! Here you will be able to form parties, trade items, and tackle co-op raids.
                                <br /><br />
                                <span className="text-yellow-400 text-xs">(MULTIPLAYER FEATURES COMING IN V2)</span>
                            </p>

                            <h3 className="font-pixel text-sm text-green-300 mb-4 border-b-2 border-green-800 pb-2">ONLINE MEMBERS</h3>

                            <div className="grid gap-4">
                                {GUILD_MEMBERS.map((member) => (
                                    <div key={member.id} className="bg-black/60 border-2 border-green-900 p-4 flex justify-between items-center group hover:border-green-500 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                                                    <span className="text-2xl opacity-50">👤</span>
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            </div>

                                            <div>
                                                <h4 className="font-pixel text-white text-sm group-hover:text-green-400 transition-colors">{member.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-pixel mt-1">Lvl {member.level} {member.className}</p>
                                            </div>
                                        </div>

                                        <Button variant="secondary" className="text-xs" disabled={member.status !== 'online'}>
                                            {member.status === 'online' ? 'INVITE' : 'OFFLINE'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
