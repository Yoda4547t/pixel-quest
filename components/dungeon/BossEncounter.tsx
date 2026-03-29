"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FocusTimer } from "@/components/game/FocusTimer";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export function BossEncounter() {
    const { profile, damageBoss, setActiveBoss, updateXP } = useAuthStore();
    const [isExploding, setIsExploding] = useState(false);

    if (!profile || !profile.activeBoss) return null;
    const boss = profile.activeBoss;

    const hpPercentage = (boss.currentHp / boss.maxHp) * 100;

    const handleFocusComplete = () => {
        // Focus completes, damage the boss!
        toast("You struck the boss!", { icon: "⚔️" });
        const isDefeated = damageBoss(34); // takes 3 Focus sessions roughly
        
        if (isDefeated) {
            setIsExploding(true);
            setTimeout(() => {
                // Grant massive rewards
                updateXP(boss.xpReward);
                // The coins are slightly tricky, we can just grant via updateXP which auto grants half coins, 
                // but since we want specific, we can also manually add coins using addStats or just rely on UpdateXP. 
                // Wait, useAuthStore updateXP deals with coins = xp/2 natively. So updateXP is fine.
                
                toast.success(`Defeated ${boss.name}! +${boss.xpReward} XP`, { icon: "🏆", duration: 5000 });
                setActiveBoss(null);
                setIsExploding(false);
            }, 3000); // Wait for explosion animation
        }
    };

    return (
        <Card variant="bordered" className={`relative bg-red-950/80 border-4 border-red-700 p-4 md:p-6 overflow-hidden ${isExploding ? 'animate-shake' : ''}`}>
            {/* Ambient Boss Glow */}
            <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-600/20 blur-2xl pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-xl md:text-2xl font-pixel text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] mb-2 text-center">
                    {boss.name}
                </h2>

                {/* HP Bar */}
                <div className="w-full max-w-xs bg-gray-900 border-2 border-gray-700 rounded-full h-4 mb-6 relative">
                    <motion.div 
                        className="h-full bg-red-600 rounded-full"
                        initial={{ width: `${hpPercentage}%` }}
                        animate={{ width: `${hpPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-pixel text-white drop-shadow-md">
                        {boss.currentHp} / {boss.maxHp} HP
                    </span>
                </div>

                {/* Boss Sprite */}
                <AnimatePresence>
                    {!isExploding ? (
                        <motion.div 
                            key="boss-sprite"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="text-8xl md:text-[120px] drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] mb-6 select-none"
                        >
                            {boss.sprite}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="explosion"
                            initial={{ scale: 0.5, opacity: 1 }}
                            animate={{ scale: [1, 3, 5], opacity: [1, 0.8, 0] }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-8xl md:text-[120px] absolute top-[30%] drop-shadow-[0_0_50px_rgba(250,204,21,1)]"
                        >
                            💥
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* The Weapon: Focus Timer */}
                <div className="w-full bg-black/60 border-2 border-red-900 rounded p-4">
                    <p className="text-center text-[10px] text-gray-400 font-pixel mb-4">COMPLETE FOCUS SESSIONS TO DEAL DAMAGE</p>
                    <FocusTimer onCompleteProp={handleFocusComplete} overrideColors={{ primary: 'red-500', secondary: 'red-900' }} />
                </div>
            </div>
            
            {/* Screen static/vignette overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </Card>
    );
}
