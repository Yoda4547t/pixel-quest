import ProtectedRoute from "@/components/features/ProtectedRoute";
import { LevelUpModal } from "@/components/features/LevelUpModal";
import { BaseBackground } from "@/components/base/BaseBackground";
import { AtmosphereBackground } from "@/components/world/AtmosphereBackground";
import { DayNightCycle } from "@/components/world/DayNightCycle";
import { SceneTransition } from "@/components/ui/SceneTransition";
import { FeedbackEffects } from "@/components/effects/FeedbackEffects";
export const dynamic = "force-dynamic";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <FeedbackEffects />
            <AtmosphereBackground />
            <DayNightCycle />
            <BaseBackground />
            <div className="relative z-0 min-h-screen">
                <SceneTransition type="cinematic">
                    {children}
                </SceneTransition>
            </div>
            <LevelUpModal />
        </ProtectedRoute>
    );
}
