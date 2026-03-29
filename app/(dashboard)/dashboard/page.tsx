"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuestStore } from "@/store/useQuestStore";
import { NewQuestModal } from "@/components/features/NewQuestModal";
import { SkillTreeModal } from "@/components/game/SkillTree";
import { getXPForNextLevel } from "@/utils/xp";
import { BossEncounter } from "@/components/dungeon/BossEncounter";
import { CharacterProfileModal } from "@/components/ui/CharacterProfile";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { WorldMap } from "@/components/map/WorldMap";
import { MapOverlay } from "@/components/map/MapOverlay";
import { BaseWorld } from "@/components/base/BaseWorld";
import { MapGuideModal } from "@/components/world/MapGuideModal";
import { GuestWarningModal } from "@/components/world/GuestWarningModal";
import { UsernameOnboardingModal } from "@/components/world/UsernameOnboardingModal";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getStatReward, getStatName } from "@/lib/game-engine/quest-engine";
import { Quest } from "@/store/useQuestStore";

export default function DashboardPage() {
    const { profile, updateXP, addStats } = useAuthStore();
    const { quests, completeQuest, deleteQuest } = useQuestStore();
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSkillTreeOpen, setIsSkillTreeOpen] = useState(false);
    const [isBaseManagerOpen, setIsBaseManagerOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!profile) return null;

    const handleCompleteQuest = (quest: Quest) => {
        completeQuest(quest.id);
        updateXP(quest.xpReward);
        
        const statReward = getStatReward(quest.category, quest.difficulty);
        addStats(statReward);

        const statName = getStatName(statReward);
        const statVal = Object.values(statReward)[0];
        const statMsg = statName && statVal ? ` & +${statVal} ${statName}` : "";

        toast.success(`Quest Completed! +${quest.xpReward} XP${statMsg}`);
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'black' }}>
            <WorldMap onOpenBaseManager={() => setIsBaseManagerOpen(true)} />
            
            <MapOverlay 
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenNewQuest={() => setIsModalOpen(true)}
                onCompleteQuest={(id) => {
                    const q = quests.find(qu => qu.id === id);
                    if (q) handleCompleteQuest(q);
                }}
                onDeleteQuest={deleteQuest}
            />

            <AnimatePresence>
                {isModalOpen && <NewQuestModal onClose={() => setIsModalOpen(false)} />}
                {isSkillTreeOpen && <SkillTreeModal onClose={() => setIsSkillTreeOpen(false)} />}
                {isBaseManagerOpen && <BaseWorld onClose={() => setIsBaseManagerOpen(false)} />}
                {isProfileOpen && <CharacterProfileModal onClose={() => setIsProfileOpen(false)} />}
                {isSettingsOpen && <AccountSettings onClose={() => setIsSettingsOpen(false)} />}
                <MapGuideModal />
                <GuestWarningModal />
                <UsernameOnboardingModal />
            </AnimatePresence>
        </div>
    );
}
