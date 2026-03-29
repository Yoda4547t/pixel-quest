"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, LogIn, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export function GuestWarningModal() {
    const router = useRouter();
    const { profile } = useAuthStore();
    const [isDismissed, setIsDismissed] = useState(false);

    // Only show if the user is a guest AND hasn't manually dismissed it this session
    const isVisible = profile?.uid === 'guest' && !isDismissed;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <motion.div 
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#1a1c29] border-2 border-red-500/80 rounded-xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.3)] relative overflow-hidden"
                    >
                        {/* Red danger gradient background accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-400" />

                        <div className="flex items-center gap-4 mb-4 border-b border-red-500/20 pb-4">
                            <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                <AlertOctagon size={28} className="animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-xl font-pixel text-red-400">GUEST MODE WARNING</h2>
                                <p className="text-[10px] text-slate-400 font-pixel mt-2">Temporary Session Active</p>
                            </div>
                        </div>

                        <div className="space-y-4 font-pixel text-xs text-slate-300 leading-relaxed text-center py-4 bg-black/40 rounded-lg border border-slate-800">
                            <p className="text-red-300">
                                Progress and data will <span className="text-red-500 font-bold underline">NOT</span> be saved in Guest Mode.
                            </p>
                            <p className="text-slate-400 text-[9px]">
                                Your Levels, Coins, and Items will be permanently lost when you close this window.
                            </p>
                            <p className="text-yellow-500/90 text-sm py-2">
                                Login to save your progress!
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                            <button 
                                onClick={() => {
                                    setIsDismissed(true);
                                    window.dispatchEvent(new Event('guestWarningDismissed'));
                                }}
                                className="w-full sm:w-auto flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-pixel text-[10px] rounded transition-colors flex items-center justify-center gap-2 group"
                            >
                                CONTINUE AS GUEST
                                <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <button 
                                onClick={() => {
                                    useAuthStore.getState().setProfile(null);
                                    router.push('/login');
                                }}
                                className="w-full sm:w-auto flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-pixel text-[10px] rounded shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                <LogIn size={14} />
                                LOGIN INSTEAD
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
