"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";

export type ParticleType = 'dust' | 'fireflies' | 'embers';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

export function AmbientParticles({ type = 'dust' }: { type?: ParticleType }) {
    const { particlesEnabled } = useSettingsStore();
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!particlesEnabled) {
            setParticles([]);
            return;
        }

        const pCount = type === 'dust' ? 20 : type === 'fireflies' ? 15 : 30;
        const newParticles = Array.from({ length: pCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 5
        }));
        setParticles(newParticles);
    }, [type, particlesEnabled]);

    if (!particlesEnabled || particles.length === 0) return null;

    const getConfig = () => {
        switch(type) {
            case 'fireflies': return { color: 'bg-green-300 shadow-[0_0_8px_rgba(134,239,172,0.8)]', driftY: [0, -20, 0] };
            case 'embers': return { color: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]', driftY: [0, -100] };
            case 'dust': default: return { color: 'bg-white opacity-20 blur-[1px]', driftY: [0, 20, 0] };
        }
    };

    const config = getConfig();

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={`absolute rounded-full ${config.color}`}
                    style={{ 
                        left: `${p.x}%`, 
                        top: `${p.y}%`, 
                        width: p.size, 
                        height: p.size 
                    }}
                    animate={{
                        y: config.driftY,
                        x: [0, (Math.random() > 0.5 ? 20 : -20), 0],
                        opacity: type === 'embers' ? [0, 1, 0] : [0.1, 0.8, 0.1]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}
