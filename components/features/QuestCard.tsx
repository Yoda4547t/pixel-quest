"use client";

import { motion } from "framer-motion";
import { Quest, TaskDifficulty } from "@/store/useQuestStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuestCardProps {
    quest: Quest;
    onComplete: (quest: Quest) => void;
    onDelete: (id: string) => void;
}

const difficultyColors: Record<TaskDifficulty, string> = {
    Easy: "text-green-400 font-pixel",
    Medium: "text-yellow-400 font-pixel",
    Hard: "text-red-500 font-pixel"
};

export function QuestCard({ quest, onComplete, onDelete }: QuestCardProps) {
    if (quest.completed) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
        >
            <Card variant="bordered" className="flex justify-between items-center p-3 bg-gray-900 border-gray-600">
                <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-pixel text-white">{quest.title}</h4>
                    <span className="text-[10px] text-gray-400 capitalize">
                        [{quest.category}] <span className={difficultyColors[quest.difficulty]}>{quest.difficulty}</span> (+{quest.xpReward} XP)
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="text-[10px] px-2 py-1"
                        onClick={() => onComplete(quest)}
                    >
                        DONE
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        className="text-[10px] px-2 py-1"
                        onClick={() => onDelete(quest.id)}
                    >
                        DEL
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
