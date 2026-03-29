"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TaskDifficulty, useQuestStore } from "@/store/useQuestStore";
import toast from "react-hot-toast";

interface NewQuestModalProps {
    onClose: () => void;
}

export function NewQuestModal({ onClose }: NewQuestModalProps) {
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState<TaskDifficulty>("Easy");
    const [category, setCategory] = useState<string>("coding");

    const { addQuest } = useQuestStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Quest title cannot be empty!");
            return;
        }
        addQuest({
            title,
            difficulty,
            category,
        });
        toast.success("New Quest added!");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm"
            >
                <Card variant="bordered" className="flex flex-col gap-4 bg-gray-900 border-primary relative">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-white font-pixel text-xs"
                    >
                        X
                    </button>

                    <h2 className="text-xl text-primary font-pixel drop-shadow-md pb-2 border-b-2 border-gray-700">NEW QUEST</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-[10px] text-gray-400 font-pixel mb-1 block">QUEST TITLE</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g. Defeat the essay boss..."
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-400 font-pixel mb-1 block">DIFFICULTY</label>
                            <div className="flex gap-2">
                                {(['Easy', 'Medium', 'Hard'] as TaskDifficulty[]).map((d) => (
                                    <Button
                                        key={d}
                                        type="button"
                                        variant={difficulty === d ? 'primary' : 'ghost'}
                                        size="sm"
                                        className={`flex-1 text-[10px] ${difficulty !== d && 'border-2 border-gray-700 bg-gray-800 text-gray-400'}`}
                                        onClick={() => setDifficulty(d)}
                                    >
                                        {d}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-400 font-pixel mb-1 block">CATEGORY (AFFECTS STATS)</label>
                            <div className="flex flex-wrap gap-2">
                                {(['coding', 'study', 'fitness', 'daily'] as const).map((c) => (
                                    <Button
                                        key={c}
                                        type="button"
                                        variant={category === c ? 'primary' : 'ghost'}
                                        size="sm"
                                        className={`flex-1 text-[10px] capitalize ${category !== c && 'border-2 border-gray-700 bg-gray-800 text-gray-400'}`}
                                        onClick={() => setCategory(c)}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" className="mt-2 w-full">ADD QUEST</Button>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
