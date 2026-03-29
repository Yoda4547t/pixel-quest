"use client";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { getEquipmentById } from "@/lib/equipment-data";
import { PetCompanion } from "./PetCompanion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { getLightingEffect } from "@/lib/lightingEffects";

export const PlayerCharacter = ({ 
    scale = 1,
    isMoving = false,
    facing = 'right'
}: { 
    scale?: number,
    isMoving?: boolean,
    facing?: 'left' | 'right'
}) => {
    const { profile } = useAuthStore();
    const { characterAurasEnabled } = useSettingsStore();
    
    if (!profile) return null;

    const colorId = profile.avatarColor || 'default';
    
    // Determine base colors
    const getBgColor = () => {
        switch (colorId) {
            case 'red': return 'bg-red-500 text-white';
            case 'blue': return 'bg-blue-500 text-white';
            case 'green': return 'bg-green-500 text-black';
            case 'gold': return 'bg-yellow-400 text-black border-yellow-200';
            case 'obsidian': return 'bg-gray-900 text-purple-400 border-purple-500';
            default: return 'bg-white text-black border-black';
        }
    };

    const weapon = profile.equipment.weapon ? getEquipmentById(profile.equipment.weapon) : null;
    const armor = profile.equipment.armor ? getEquipmentById(profile.equipment.armor) : null;
    const accessory = profile.equipment.accessory ? getEquipmentById(profile.equipment.accessory) : null;

    // Visual progression tiers
    const hasArmorUpgrade = profile.level >= 3;
    const hasGlowingWeapon = profile.level >= 5;
    const hasAura = profile.level >= 7;
    const isEliteHero = profile.level >= 10;

    // Morph the face based on tiers
    const getFaceSprite = () => {
        if (isEliteHero) return "(⌐■_■)";
        if (hasAura) return "(✦_✦)";
        return "(>_<)";
    };

    const auraClass = characterAurasEnabled && hasAura ? getLightingEffect('aura', isEliteHero ? 'high' : 'medium') : '';

    return (
        <div 
            className="flex flex-col items-center justify-center overflow-visible shadow-none border-none bg-transparent m-0 p-0"
            style={{ transform: `scale(${scale})` }}
        >
            <div className={`relative w-16 h-16 flex items-center justify-center transform transition-transform duration-200 ${facing === 'left' ? '-scale-x-100' : 'scale-x-100'}`}>
                {/* Motion Dust Trail */}
                {isMoving && (
                    <motion.div
                        initial={{ opacity: 0.8, scale: 0.5, y: 10 }}
                        animate={{ opacity: 0, scale: 1.5, y: -5, x: facing === 'right' ? -15 : 15 }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                        className="absolute bottom-0 bg-white/40 w-4 h-4 rounded-full blur-[2px] z-0"
                    />
                )}

                {characterAurasEnabled && hasAura && (
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute inset-0 rounded-full blur-xl z-0 ${auraClass}`}
                    />
                )}
                
                <motion.div
                    animate={isMoving ? { y: [0, -8, 0], rotateZ: [0, 5, -5, 0] } : { y: [0, -2, 0] }}
                    transition={{ duration: isMoving ? 0.3 : 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`font-pixel relative w-12 h-12 flex items-center justify-center border-4 box-border z-10 ${getBgColor()} ${isEliteHero ? 'shadow-[0_0_15px_rgba(255,255,255,0.8)]' : ''}`}
                >
                    {/* Face */}
                    <span className="leading-tight shrink-0 flex items-center justify-center w-full h-full text-[8px] z-10 transition-all">
                        {getFaceSprite()}
                    </span>

                    {/* Armor (Hat) */}
                    {armor && (
                        <div className="absolute -top-7 text-2xl drop-shadow-md z-20">
                            {armor.id === "amr_scholar_hat" ? "🧙‍♂️" : "🛡️"}
                        </div>
                    )}

                    {/* Weapon */}
                    {(weapon || hasGlowingWeapon) && (
                        <div className={`absolute -right-6 text-2xl z-20 hover:scale-110 transition-transform origin-bottom-left ${hasGlowingWeapon || (weapon && weapon.id === "wpn_sword_discipline") ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'drop-shadow-md'}`}>
                            {weapon ? (weapon.id === "wpn_sword_discipline" ? "⚔️" : "🗡️") : "🗡️"}
                        </div>
                    )}

                    {/* Accessory */}
                    {accessory && (
                        <div className="absolute -bottom-4 -left-3 text-xl drop-shadow-md z-20">
                            {accessory.id === "acc_focus_amulet" ? "🧿" : "🪙"}
                        </div>
                    )}
                </motion.div>
            </div>
            
            {/* Companion Pet */}
            <PetCompanion isMoving={isMoving} facing={facing} />

            {/* Shadow Base */}
            <div className="w-10 h-2 bg-black/40 rounded-[50%] blur-[2px] mt-2 translate-y-1 z-0"></div>
        </div>
    );
};
