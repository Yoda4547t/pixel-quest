"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

let feedbackIdCounter = 0;

interface FeedbackEvent {
    id: number;
    x: number;
    y: number;
    text: string;
    type: 'xp' | 'coin' | 'text' | 'sparkle';
}

// Global emitter array listener pattern
type Listener = (event: FeedbackEvent) => void;
const listeners: Listener[] = [];

export const emitFeedback = (x: number, y: number, text: string, type: FeedbackEvent['type'] = 'text') => {
    const event: FeedbackEvent = { id: feedbackIdCounter++, x, y, text, type };
    listeners.forEach(l => l(event));
};

export function FeedbackEffects() {
    const [events, setEvents] = useState<FeedbackEvent[]>([]);

    useEffect(() => {
        const listener = (event: FeedbackEvent) => {
            setEvents(prev => [...prev, event]);
            
            // Auto clean up event after animation finishes
            setTimeout(() => {
                setEvents(prev => prev.filter(e => e.id !== event.id));
            }, 2000); 
        };
        
        listeners.push(listener);
        return () => {
            const idx = listeners.indexOf(listener);
            if (idx > -1) listeners.splice(idx, 1);
        };
    }, []);

    if (events.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
            <AnimatePresence>
                {events.map(ev => {
                    const isXp = ev.type === 'xp';
                    const isCoin = ev.type === 'coin';
                    const isSparkle = ev.type === 'sparkle';

                    return (
                        <motion.div
                            key={ev.id}
                            className={`absolute font-pixel drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] select-none ${
                                isXp ? 'text-blue-400 text-sm' : 
                                isCoin ? 'text-yellow-400 text-sm' : 
                                isSparkle ? 'text-2xl' : 'text-white text-xs'
                            }`}
                            style={{ left: ev.x, top: ev.y }}
                            initial={{ opacity: 1, scale: 0.5, y: 0 }}
                            animate={{ opacity: 0, scale: 1.5, y: -50, x: (Math.random() - 0.5) * 40 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            {isCoin && "🪙 "}
                            {ev.text}
                            {isXp && " XP"}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
