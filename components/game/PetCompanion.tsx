"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

interface PetCompanionProps {
    isMoving?: boolean;
    facing?: "left" | "right";
}

export const PetCompanion = ({ isMoving = false, facing = "right" }: PetCompanionProps) => {
    const { profile } = useAuthStore();

    if (!profile || !profile.activePet) return null;

    const petId = profile.activePet;

    // Define pets
    const getPetData = () => {
        switch (petId) {
            case "fox":
                return { 
                    sprite: "🦊", 
                    floatAnim: { y: [0, -3, 0] }, 
                    moveAnim: { x: facing === 'right' ? -20 : 20, y: [0, -6, 0], rotateZ: [0, 10, -10, 0] }, 
                    scale: 0.8 
                };
            case "drone":
                return { 
                    sprite: "🛸", 
                    floatAnim: { y: [0, -5, 0], x: [0, 2, -2, 0] }, 
                    moveAnim: { x: facing === 'right' ? -25 : 25, y: [0, -8, 0], rotateZ: [0, 5, -5, 0] }, 
                    scale: 0.9 
                };
            case "orb":
                return { 
                    sprite: "🔮", 
                    floatAnim: { y: [0, -4, 0], scale: [1, 1.1, 1], rotateZ: [0, 180, 360] }, 
                    moveAnim: { x: facing === 'right' ? -15 : 15, y: [0, -2, 0], rotateZ: [0, 180, 360] }, 
                    scale: 1 
                };
            default:
                return { sprite: "🐾", floatAnim: { y: [0, -2, 0] }, moveAnim: { y: [0, -5, 0] }, scale: 0.8 };
        }
    };

    const pet = getPetData();
    const isDroneOrOrb = petId === "drone" || petId === "orb";
    
    // Calculate positional offsets based on facing direction
    const offsetX = facing === 'right' ? -35 : 35; 
    const offsetY = isDroneOrOrb ? -25 : 10; // Drones/orbs fly higher, fox is on ground

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: pet.scale }}
            className={`absolute pointer-events-none z-20 flex items-center justify-center transform transition-all duration-300`}
            style={{
                left: `calc(50% + ${offsetX}px)`,
                top: `calc(50% + ${offsetY}px)`,
                transform: `translateX(-50%) translateY(-50%) ${facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)'}`
            }}
        >
            <motion.div
                animate={isMoving ? pet.moveAnim : pet.floatAnim}
                transition={{ 
                    duration: isMoving ? 0.3 : (petId === 'orb' ? 3 : 1.5), 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
                className={`text-2xl drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] ${isDroneOrOrb ? 'animate-pulse' : ''}`}
            >
                {pet.sprite}
            </motion.div>
        </motion.div>
    );
};
