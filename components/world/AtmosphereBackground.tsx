"use client";

import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";

export function AtmosphereBackground() {
    const { atmosphereEnabled } = useSettingsStore();

    if (!atmosphereEnabled) return null;

    return (
        <div className="fixed inset-0 z-[-20] pointer-events-none overflow-hidden bg-transparent">
            {/* Layer 1: Distant Sky/Mountains (Very slow) */}
            <motion.div 
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 to-transparent opacity-50"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Layer 2: Drifting Clouds/Fog (Medium speed) */}
            <motion.div 
                className="absolute top-[10%] text-[200px] opacity-5 blur-[20px]"
                initial={{ left: '-50%' }}
                animate={{ left: '150%' }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
                ☁️☁️
            </motion.div>
            <motion.div 
                className="absolute top-[30%] text-[300px] opacity-[0.03] blur-[30px]"
                initial={{ left: '-60%' }}
                animate={{ left: '120%' }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
            >
                ☁️
            </motion.div>

            {/* Layer 3: Glowing ambient atmosphere wash */}
            <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(125,211,252,0.1),transparent_70%)]"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
