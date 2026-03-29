"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

interface FocusTimerProps {
    onCompleteProp?: () => void;
    overrideColors?: { primary: string; secondary: string };
}

export function FocusTimer({ onCompleteProp }: FocusTimerProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [showBurst, setShowBurst] = useState(false);
    const { updateXP, addStats } = useAuthStore();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const triggerBurst = () => {
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 2000);
    };

    const handleComplete = useCallback(() => {
        setIsActive(false);
        updateXP(15);
        addStats({ focus: 5 }); // Grant stat points
        triggerBurst();
        
        if (onCompleteProp) {
            onCompleteProp();
        } else {
            toast.success("Focus Session Complete! +15 XP, +5 Focus, +7 Coins!", { icon: "🎉" });
        }
        
        setTimeLeft(25 * 60); // Reset
    }, [updateXP, addStats, onCompleteProp]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            handleComplete();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft, handleComplete]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");

    // Generate random particles for the burst
    const particles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 1) * 200,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        type: Math.random() > 0.5 ? '🪙' : '✨'
    }));

    return (
        <div className={`relative bg-black/80 border-4 border-red-500 p-4 flex flex-col items-center transition-shadow duration-500 ${showBurst ? 'shadow-[0_0_40px_rgba(239,68,68,0.8)]' : 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}>
            <h3 className="text-red-400 font-pixel text-xs mb-2">FOCUS TIMER</h3>

            <div className="text-4xl text-white font-pixel my-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10">
                {minutes}:{seconds}
            </div>

            <div className="flex gap-2 z-10">
                <Button size="sm" onClick={toggleTimer} variant={isActive ? "secondary" : "danger"} className="text-[10px]">
                    {isActive ? "PAUSE" : "START"}
                </Button>
                <Button size="sm" onClick={resetTimer} variant="ghost" className="text-[10px] border-2 border-gray-600">
                    RESET
                </Button>
            </div>

            {/* Coin & Confetti Burst Effect */}
            <AnimatePresence>
                {showBurst && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                                animate={{ 
                                    x: p.x, 
                                    y: p.y, 
                                    scale: p.scale, 
                                    opacity: 0,
                                    rotate: p.rotation 
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute text-2xl drop-shadow-lg"
                            >
                                {p.type}
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
