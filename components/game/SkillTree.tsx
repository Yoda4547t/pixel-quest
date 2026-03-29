"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SKILL_TREE, SkillNode, SkillBranch } from "@/lib/skill-tree";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface SkillTreeProps {
    onClose: () => void;
}

export function SkillTreeModal({ onClose }: SkillTreeProps) {
    const { profile, unlockSkill } = useAuthStore();
    const [selectedBranch, setSelectedBranch] = useState<SkillBranch>("Warrior");

    if (!profile) return null;

    const availablePoints = profile.level - 1 - profile.abilities.length;
    const branchNodes = SKILL_TREE.filter(node => node.branch === selectedBranch);

    const handleUnlock = (node: SkillNode) => {
        if (availablePoints <= 0) {
            toast.error("Not enough Skill Points! Level up to get more.");
            return;
        }
        
        if (profile.level < node.requiredLevel) {
            toast.error(`Requires Level ${node.requiredLevel}`);
            return;
        }

        if (node.requires) {
            const hasPrereq = node.requires.every(req => profile.abilities.includes(req));
            if (!hasPrereq) {
                toast.error("You need the prerequisite skills first!");
                return;
            }
        }

        const success = unlockSkill(node.id);
        if (success) {
            toast.success(`Unlocked ${node.name}!`, { icon: "✨" });
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            >
                <Card variant="bordered" className="bg-slate-950 border-blue-600 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                    <div className="flex justify-between items-start mb-6 border-b-4 border-blue-900 pb-4">
                        <div className="flex items-center gap-4">
                            <span className="text-4xl drop-shadow-md">🌟</span>
                            <div>
                                <h2 className="text-2xl text-blue-400 font-pixel drop-shadow-md">SKILL TREE</h2>
                                <p className="text-[10px] text-blue-300 font-pixel mt-1">"Forge your destiny, pixel by pixel."</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <Button variant="ghost" onClick={onClose} className="text-blue-300 border-blue-800">CLOSE</Button>
                            <span className="text-yellow-400 font-pixel text-xs mt-2 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">
                                {availablePoints} SP AVAILABLE
                            </span>
                            <span className="text-gray-500 font-pixel text-[8px] mt-1">Gain 1 SP every Levelup</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6 border-b-2 border-blue-900 pb-2">
                        {(["Warrior", "Scholar", "Explorer"] as SkillBranch[]).map(branch => (
                            <Button
                                key={branch}
                                variant={selectedBranch === branch ? "primary" : "ghost"}
                                size="sm"
                                className={`text-[10px] flex-1 capitalize transition-colors ${selectedBranch === branch ? 'bg-blue-600 border-blue-400 text-white' : 'text-gray-400 border-2 border-blue-900 bg-black/40 hover:border-blue-700'}`}
                                onClick={() => setSelectedBranch(branch)}
                            >
                                {branch} PATH
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4 relative py-4">
                        {/* Render simple downward tree manually for 3 items */}
                        {branchNodes.map((node, index) => {
                            const isUnlocked = profile.abilities.includes(node.id);
                            const hasPrereq = !node.requires || node.requires.every(req => profile.abilities.includes(req));
                            const canUnlock = !isUnlocked && profile.level >= node.requiredLevel && hasPrereq && availablePoints > 0;
                            const reasonLocked = profile.level < node.requiredLevel ? `Lvl ${node.requiredLevel} req` : (!hasPrereq ? `Missing prereqs` : "");

                            return (
                                <div key={node.id} className="w-full max-w-sm relative z-10 flex flex-col items-center select-none">
                                    <Card 
                                        variant="bordered" 
                                        className={`w-full p-4 flex flex-col items-center justify-center text-center transition-all duration-300 ${isUnlocked ? 'bg-blue-900/40 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]' : (canUnlock ? 'bg-slate-800 border-gray-500 hover:border-blue-400 cursor-pointer' : 'bg-slate-900 border-slate-700 opacity-70')}`}
                                        onClick={() => canUnlock && handleUnlock(node)}
                                    >
                                        <h3 className={`font-pixel text-sm mb-1 ${isUnlocked ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>
                                            {node.name}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 min-h-[40px] flex items-center justify-center">{node.description}</p>
                                        
                                        <div className="mt-3 w-full">
                                            {isUnlocked ? (
                                                <div className="text-[10px] font-pixel text-blue-300 drop-shadow-md">UNLOCKED</div>
                                            ) : (
                                                <Button 
                                                    size="sm" 
                                                    variant={canUnlock ? "primary" : "ghost"} 
                                                    className="w-full text-[10px] h-6" 
                                                    disabled={!canUnlock}
                                                >
                                                    {canUnlock ? "UNLOCK (1 SP)" : (reasonLocked || "NO SP")}
                                                </Button>
                                            )}
                                        </div>
                                    </Card>

                                    {/* Line connecting to the next node */}
                                    {index < branchNodes.length - 1 && (
                                        <div className={`w-1 h-8 ${isUnlocked ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-slate-700'} my-2`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>
        </AnimatePresence>
    );
}
