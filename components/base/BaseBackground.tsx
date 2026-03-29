"use client";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { BUILDINGS_DATABASE } from "@/lib/buildings";

export function BaseBackground() {
    const { profile } = useAuthStore();
    
    // Default visually pleasing layout for all possible buildings in the game
    const buildingPositions = {
        'town_hall': { top: '30%', left: '50%' },
        'library': { top: '45%', left: '30%' },
        'vault': { top: '40%', left: '70%' },
        'training_ground': { top: '65%', left: '45%' },
    };

    return (
        <div className="fixed inset-0 z-[-10] overflow-hidden bg-[#0d1421] pointer-events-none transition-colors duration-1000">
            {/* Ambient Background Glow / Sky */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black via-[#0f172a] to-[#1e3a8a] blur-[50px] opacity-80"
                animate={{ opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            
            {/* A subtle floor/plane to give the illusion of ground */}
            <div className="absolute bottom-0 w-full h-[60%] bg-[#064e3b] blur-[80px] opacity-30"></div>

            {/* Decorative Stars / Fireflies */}
            <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute top-[20%] left-[20%] w-2 h-2 bg-yellow-200 rounded-full blur-[2px]"></motion.div>
            <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="absolute top-[30%] left-[80%] w-2 h-2 bg-yellow-200 rounded-full blur-[2px]"></motion.div>
            
            {/* Clouds */}
            <motion.div 
                className="absolute top-10 text-6xl opacity-10 blur-xl"
                initial={{ left: '-20%' }}
                animate={{ left: '120%' }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >☁️</motion.div>
            <motion.div 
                className="absolute top-32 text-8xl opacity-10 blur-xl"
                initial={{ left: '-20%' }}
                animate={{ left: '120%' }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            >☁️</motion.div>

            {/* The Buildings Layer (clearer so user can see their progress!) */}
            <div className="relative w-full h-full blur-[2px] opacity-70">
                {BUILDINGS_DATABASE.map(bDef => {
                    const leveledBuilding = profile?.playerBase?.buildings[bDef.id];
                    const level = leveledBuilding ? leveledBuilding.level : 0;
                    
                    // Show a faint silhouette if level 0, otherwise full emoji
                    if (!profile && level === 0) return null;

                    const pos = buildingPositions[bDef.id as keyof typeof buildingPositions] || { top: '50%', left: '50%' };
                    
                    let displaySprite = bDef.sprite;
                    if (bDef.id === 'town_hall') {
                        if (level < 3) displaySprite = '⛺';
                        else if (level < 5) displaySprite = '🛖';
                        else if (level < 10) displaySprite = '🏠';
                        else displaySprite = '🏰';
                    } else if (bDef.id === 'library') {
                        if (level < 3) displaySprite = '📜';
                        else if (level < 7) displaySprite = '📚';
                        else displaySprite = '🏛️';
                    } else if (bDef.id === 'vault') {
                        if (level < 3) displaySprite = '💰';
                        else if (level < 7) displaySprite = '🏦';
                        else displaySprite = '💎';
                    } else if (bDef.id === 'training_ground') {
                        if (level < 3) displaySprite = '🎯';
                        else if (level < 7) displaySprite = '⚔️';
                        else displaySprite = '🏟️';
                    }

                    return (
                        <motion.div 
                            key={`${bDef.id}-${level}`} // Force re-mount animation on level up
                            initial={{ scale: 0, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
                            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 ${level > 0 ? 'opacity-100 scale-100' : 'opacity-20 grayscale brightness-50 scale-90'}`}
                            style={{ top: pos.top, left: pos.left }}
                        >
                            {/* Level Up Burst Effect Component */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 1 }}
                                animate={{ scale: 2.5, opacity: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="absolute inset-0 bg-yellow-400 rounded-full blur-[30px] z-[-1]"
                            />
                            
                            <span className="text-8xl md:text-[180px] drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform cursor-pointer">
                                {displaySprite}
                            </span>
                            
                            {/* Torches/lights if leveled up */}
                            {level > 0 && (
                                <motion.div 
                                    className="absolute bottom-4 w-full h-[50%] bg-orange-500 rounded-t-full blur-[40px] opacity-50 z-[-1]"
                                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
