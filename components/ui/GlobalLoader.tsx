"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sword } from "lucide-react";

export function GlobalLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Enforce a minimum 1.5s loading screen for the "creative" experience
        const handleLoad = () => {
            setTimeout(() => setIsLoading(false), 1500);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#07111f] overflow-hidden"
                >
                    {/* Magical Ambient glow */}
                    <div className="absolute w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />

                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative"
                    >
                        <Sword size={64} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    </motion.div>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <motion.h1 
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="font-pixel text-xl text-yellow-500 tracking-widest drop-shadow-md text-center"
                        >
                            ENTERING REALM...
                        </motion.h1>

                        {/* Pixel progress bar loop container */}
                        <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative">
                            <motion.div 
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-1/2 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
