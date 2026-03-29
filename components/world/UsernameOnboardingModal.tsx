"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export function UsernameOnboardingModal() {
    const { profile, setProfile } = useAuthStore();
    const [username, setUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Only show if the user is registered (not guest) AND missing a username
    const isVisible = profile && profile.uid !== 'guest' && !profile.username;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmed = username.trim();
        
        // Validation: 3-15 chars, alphanumeric only
        const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
        if (!usernameRegex.test(trimmed)) {
            toast.error("Username must be 3-15 alphanumeric characters!");
            return;
        }

        if (!profile) return;

        try {
            setIsSubmitting(true);
            const userRef = doc(db, 'users', profile.uid);
            await updateDoc(userRef, { username: trimmed });
            
            // Instantly update Zustand store to unlock the dashboard
            setProfile({ ...profile, username: trimmed });
            toast.success(`Welcome to the realm, ${trimmed}!`);
            window.dispatchEvent(new Event('usernameOnboardingFinished'));
            
        } catch (error: any) {
            console.error("Failed to save username:", error);
            toast.error("Failed to save username. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
                    <motion.div 
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#0b0f19] border-4 border-blue-600/80 rounded-xl p-8 max-w-md w-full shadow-[0_0_80px_rgba(37,99,235,0.3)] relative overflow-hidden"
                    >
                        {/* Glow accent */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-600/20 blur-3xl rounded-full" />

                        <div className="relative flex flex-col items-center z-10 text-center">
                            <div className="w-16 h-16 bg-blue-900/30 border-2 border-blue-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <UserCircle size={32} className="text-blue-400" />
                            </div>

                            <h2 className="text-2xl font-pixel text-blue-400 mb-2 drop-shadow-md">CLAIM YOUR NAME</h2>
                            <p className="text-xs text-slate-400 font-pixel mb-8 leading-relaxed">
                                Choose the name you will be known by in the Overworld.
                            </p>

                            {/* Live Preview */}
                            <div className="w-full bg-black/50 border border-slate-800 rounded-md p-4 mb-6 relative">
                                <p className="text-[9px] text-slate-500 font-pixel absolute -top-2 bg-[#0b0f19] px-2 left-4">LIVE PREVIEW</p>
                                <p className="text-sm font-pixel text-yellow-400">
                                    ⚔️ {username.trim().toUpperCase() || "HERO"} <span className="text-slate-500">| LVL 1 Adventurer</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full space-y-6">
                                <div className="space-y-2">
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter Username..."
                                        className="w-full bg-[#131b2d] border-2 border-slate-700 text-white font-pixel text-sm p-4 rounded focus:outline-none focus:border-blue-500 text-center transition-colors shadow-inner"
                                        maxLength={15}
                                    />
                                    <p className="text-[9px] text-slate-500 font-pixel">Alphanumeric, 3-15 characters allowed</p>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting || username.trim().length < 3}
                                    className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-pixel text-sm rounded shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? "SAVING..." : "ENTER REALM"}
                                    {!isSubmitting && <Check size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
