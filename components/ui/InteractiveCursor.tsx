"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";

export function InteractiveCursor() {
    const { characterAurasEnabled } = useSettingsStore();
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        if (!characterAurasEnabled) return;

        const updateMouse = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            
            // Very simple hit-test approximation: check what elements the user hovers
            const target = e.target as HTMLElement;
            // E.g., buttons, tiles, nodes
            if (target && (target.tagName === 'BUTTON' || target.closest('button') || target.classList.contains('cursor-pointer'))) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', updateMouse);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updateMouse);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [characterAurasEnabled]);

    if (!characterAurasEnabled) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[999] mix-blend-screen flex items-center justify-center"
                animate={{
                    x: mousePos.x - 16,
                    y: mousePos.y - 16,
                    scale: isClicking ? 0.5 : isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0.8 : 0.4
                }}
                transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
            >
                {/* The main glowing core */}
                <div className={`w-3 h-3 rounded-full bg-white transition-all duration-300 ${isHovering ? 'shadow-[0_0_15px_rgba(125,211,252,1)] bg-blue-200' : 'shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`}></div>
                
                {/* Outer ring on hover */}
                {isHovering && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="absolute w-8 h-8 rounded-full border border-blue-400 opacity-50"
                        transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
                    />
                )}

                {/* Interaction burst on click */}
                {isClicking && (
                    <motion.div 
                        initial={{ opacity: 0.8, scale: 1 }}
                        animate={{ opacity: 0, scale: 3 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-6 h-6 rounded-full bg-yellow-300 blur-[2px]"
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
}
