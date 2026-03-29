"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";

export function DayNightCycle() {
    const { dayNightCycleEnabled } = useSettingsStore();
    const [timePhase, setTimePhase] = useState<'morning' | 'day' | 'evening' | 'night'>('day');

    useEffect(() => {
        if (!dayNightCycleEnabled) return;

        const updateTime = () => {
            const hour = new Date().getHours();
            if (hour >= 6 && hour < 10) setTimePhase('morning');
            else if (hour >= 10 && hour < 17) setTimePhase('day');
            else if (hour >= 17 && hour < 20) setTimePhase('evening');
            else setTimePhase('night');
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [dayNightCycleEnabled]);

    if (!dayNightCycleEnabled) return null;

    const overlays = {
        morning: 'bg-orange-200/10 mix-blend-overlay',
        day: 'bg-transparent',
        evening: 'bg-orange-600/20 mix-blend-multiply',
        night: 'bg-blue-900/30 mix-blend-multiply'
    };

    return (
        <motion.div 
            className={`fixed inset-0 z-40 pointer-events-none transition-colors duration-[5000ms] ${overlays[timePhase]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        />
    );
}
