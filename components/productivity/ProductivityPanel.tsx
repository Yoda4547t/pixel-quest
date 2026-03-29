"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown' | 'custom';

interface ModeConfig {
    id: TimerMode;
    label: string;
    xpReward: number;
    initialSeconds: number;
}

const MODES: ModeConfig[] = [
    { id: 'pomodoro', label: 'Pomodoro', xpReward: 25, initialSeconds: 25 * 60 },
    { id: 'stopwatch', label: 'Stopwatch', xpReward: 15, initialSeconds: 0 },
    { id: 'countdown', label: 'Focus 15m', xpReward: 15, initialSeconds: 15 * 60 },
    { id: 'custom', label: 'Endurance', xpReward: 50, initialSeconds: 50 * 60 },
];

export function ProductivityPanel() {
    const { updateXP, addStats, spendCoins, profile } = useAuthStore();
    const [mode, setMode] = useState<ModeConfig>(MODES[0]);
    const [seconds, setSeconds] = useState(mode.initialSeconds);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setSeconds(mode.initialSeconds);
        setIsActive(false);
    }, [mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => {
                    if (mode.id === 'stopwatch') return s + 1;
                    if (s <= 1) {
                        handleComplete();
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, mode]);

    const handleComplete = () => {
        setIsActive(false);
        // Reward mapping 
        let statBonus = {};
        if (mode.id === 'pomodoro') statBonus = { focus: 5 };
        if (mode.id === 'custom') statBonus = { focus: 10, resilience: 5 };
        if (mode.id === 'countdown') statBonus = { focus: 3 };

        // For Stopwatch, give XP based on time passed
        let finalXP = mode.xpReward;
        if (mode.id === 'stopwatch') {
            const minutesPassed = Math.floor(seconds / 60);
            finalXP = Math.max(5, minutesPassed * 2); // 2 XP per minute
            statBonus = { focus: Math.max(1, Math.floor(minutesPassed / 10)) };
        }

        updateXP(finalXP);
        addStats(statBonus);

        toast.success(`Session Complete! +${finalXP} XP`, { icon: '🏆' });
        
        // Custom coin burst
        if (profile?.activePet === 'drone') {
            useAuthStore.setState(s => ({
                profile: s.profile ? { ...s.profile, coins: s.profile.coins + 10 } : null
            }));
            toast.success(`Drone gathered +10 Coins!`, { icon: '🛸' });
        }
    };

    const toggleTimer = () => {
        if (!isActive && mode.id === 'stopwatch') {
            // Starting stopwatch
            setIsActive(true);
        } else if (!isActive && seconds > 0) {
            setIsActive(true);
        } else if (isActive) {
            setIsActive(false);
            if (mode.id === 'stopwatch') {
                handleComplete(); // Completing stopwatch
            }
        }
    };

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-black/50 border-4 border-blue-900 rounded flex-1 flex flex-col p-2 h-full min-h-[192px]">
            <div className="flex justify-between items-center mb-2 px-2 border-b-2 border-blue-900/50 pb-2">
                <h3 className="text-blue-400 font-pixel text-xs">TOOLKIT</h3>
                <div className="flex gap-1 justify-end">
                    {MODES.map(m => (
                        <button 
                            key={m.id}
                            onClick={() => setMode(m)}
                            className={`text-[8px] font-pixel px-2 py-1 rounded transition-colors ${mode.id === m.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-4xl text-white font-pixel drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] tracking-widest mb-4">
                    {formatTime(seconds)}
                </div>

                <div className="flex gap-4">
                    <Button 
                        variant={isActive ? (mode.id === 'stopwatch' ? 'primary' : 'danger') : 'secondary'} 
                        onClick={toggleTimer}
                        className={`font-pixel text-xs ${isActive ? (mode.id === 'stopwatch' ? 'bg-blue-600 border-blue-400' : '') : 'border-blue-700 text-blue-300 hover:bg-blue-900/50'}`}
                    >
                        {isActive ? (mode.id === 'stopwatch' ? 'STOP & CLAIM' : 'PAUSE') : 'START'}
                    </Button>
                    
                    {!isActive && mode.id !== 'stopwatch' && seconds !== mode.initialSeconds && (
                        <Button 
                            variant="ghost" 
                            onClick={() => setSeconds(mode.initialSeconds)}
                            className="text-gray-400 text-xs font-pixel"
                        >
                            RESET
                        </Button>
                    )}
                </div>
            </div>
            
            <div className="flex justify-between mt-auto pt-2 border-t-2 border-blue-900/30 text-[8px] font-pixel text-gray-500">
                <span>MODE: {mode.id.toUpperCase()}</span>
                <span className="text-yellow-500">REWARD: {mode.id === 'stopwatch' ? 'DYNAMIC' : `${mode.xpReward} XP`}</span>
            </div>
        </div>
    );
}
