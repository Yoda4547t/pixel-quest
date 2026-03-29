"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";

export function LevelUpModal() {
    const { profile } = useAuthStore();
    const [show, setShow] = useState(false);
    const [prevLevel, setPrevLevel] = useState(profile?.level || 1);

    useEffect(() => {
        if (profile && profile.level > prevLevel) {
            setShow(true);
            setPrevLevel(profile.level);
        }
    }, [profile?.level, prevLevel, profile]);

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <ReactConfetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={400}
                        colors={['#4ecca3', '#ff4a4a', '#ffffff', '#ffd700']}
                    />
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                        className="bg-black border-4 border-primary p-8 max-w-sm w-full text-center relative overflow-hidden flex flex-col items-center shadow-[0_0_40px_rgba(78,204,163,0.5)]"
                    >
                        {/* Inner scanline decoration */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none" />

                        <h2 className="text-4xl text-primary font-pixel drop-shadow-lg mb-4 animate-pulse">
                            LEVEL UP!
                        </h2>

                        <div className="font-pixel text-white text-6xl my-6 drop-shadow-[0_0_15px_white]">
                            {profile?.level}
                        </div>

                        <p className="text-xs text-gray-300 font-pixel mb-8">
                            YOU HAVE GROWN STRONGER.<br /><br />
                            KEEP COMPLETING QUESTS!
                        </p>

                        <Button onClick={() => setShow(false)} className="w-full text-lg">
                            CONTINUE
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
