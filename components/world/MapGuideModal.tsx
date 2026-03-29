"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Map as MapIcon, MousePointer2, ZoomIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export function MapGuideModal() {
    const { profile } = useAuthStore();
    const [isVisible, setIsVisible] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!profile?.uid) return;
        
        const storageKey = `pixelquest_skip_guide_${profile.uid}`;
        const hideGuide = localStorage.getItem(storageKey);
        
        if (profile?.uid === 'guest') {
            // Wait for the guest warning to be dismissed before showing the map guide
            const handleGuestDismissed = () => {
                if (!hideGuide) setIsVisible(true);
            };
            window.addEventListener('guestWarningDismissed', handleGuestDismissed);
            return () => window.removeEventListener('guestWarningDismissed', handleGuestDismissed);
        } else if (profile && !profile.username) {
            // Wait for Username Onboarding to finish before showing the map guide!
            const handleUsernameFinished = () => {
                if (!hideGuide) setIsVisible(true);
            };
            window.addEventListener('usernameOnboardingFinished', handleUsernameFinished);
            return () => window.removeEventListener('usernameOnboardingFinished', handleUsernameFinished);
        } else {
            // Show immediately for registered users who already have a username
            if (!hideGuide) {
                setIsVisible(true);
            }
        }
    }, [profile?.uid]);

    const handleDismiss = () => {
        if (dontShowAgain && profile?.uid) {
            localStorage.setItem(`pixelquest_skip_guide_${profile.uid}`, "true");
        }
        setIsVisible(false);
    };

    if (!mounted) return null; // Hydration safety lock

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#1a1c29] border-4 border-yellow-600 rounded-xl p-6 max-w-md w-full shadow-[0_0_30px_rgba(0,0,0,0.8)] relative"
                    >
                <button 
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                    <div className="p-3 bg-blue-900/50 rounded-lg text-blue-400">
                        <MapIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-pixel text-yellow-400">WORLD MAP GUIDE</h2>
                        <p className="text-xs text-slate-400 font-pixel mt-1">Welcome to the Overworld</p>
                    </div>
                </div>

                <div className="space-y-4 font-pixel text-sm text-slate-300">
                    <p className="leading-relaxed">
                        This is your interactive realm. You can explore different locations to complete quests, train up, and manage your Base!
                    </p>

                    <div className="bg-black/40 rounded p-4 space-y-3 border border-white/5">
                        <div className="flex items-center gap-3">
                            <MousePointer2 size={16} className="text-emerald-400" />
                            <p className="text-xs"><strong>CLICK & DRAG</strong> any blank space to pan the camera across the world.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <ZoomIn size={16} className="text-emerald-400" />
                            <p className="text-xs"><strong>SCROLL WHEEL</strong> up or down to zoom in and out of the map.</p>
                        </div>
                    </div>

                    <p className="text-xs text-yellow-500/80">
                        * Locations will unlock automatically as you gain XP and level up!
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 bg-black/50 text-yellow-500 focus:ring-yellow-500/20"
                        />
                        <span className="text-xs font-pixel text-slate-400 group-hover:text-slate-200 transition-colors">
                            Don't show this again
                        </span>
                    </label>

                    <button 
                        onClick={handleDismiss}
                        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-pixel text-sm rounded transition-colors"
                    >
                        GOT IT
                    </button>
                </div>
            </motion.div>
        </div>
        )}
        </AnimatePresence>
    );
}
