"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface XPBarProps {
    currentXP: number;
    maxXP: number;
    level: number;
    className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, maxXP, level, className }) => {
    const percentage = Math.min(Math.max((currentXP / maxXP) * 100, 0), 100);

    return (
        <div className={cn("w-full flex-col flex gap-2 font-pixel text-xs", className)}>
            <div className="flex justify-between w-full uppercase text-[10px] md:text-xs">
                <span className="text-foreground">Lvl {level}</span>
                <span className="text-primary">{currentXP} / {maxXP} XP</span>
            </div>

            {/* Bar container */}
            <div className="w-full h-4 bg-secondary/50 border-2 border-secondary relative overflow-hidden">
                {/* Animated fill */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-primary animate-glow"
                />
                {/* Pixel highlights/scanline effect inside bar */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:4px_100%] pointer-events-none" />
            </div>
        </div>
    );
};
