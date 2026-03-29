"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Settings, Volume2, VolumeX, Eye, EyeOff, Monitor, LogOut, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function AccountSettings({ onClose }: { onClose: () => void }) {
    const settings = useSettingsStore();
    const { profile } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    const handleDeleteAccount = () => {
        // Just a stub for visual representation as deleting an account requires reauthentication in Firebase
        alert("This feature requires re-authentication. Account deletion locked for safety.");
    };

    const SettingToggle = ({ 
        label, 
        value, 
        onToggle, 
        iconOn, 
        iconOff 
    }: { 
        label: string, 
        value: boolean, 
        onToggle: () => void,
        iconOn: React.ReactNode,
        iconOff: React.ReactNode
    }) => (
        <div className="flex items-center justify-between bg-black/40 p-2 rounded border-2 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer" onClick={onToggle}>
            <span className="font-pixel text-[10px] text-gray-300 pointer-events-none">{label}</span>
            <button className={`p-1 rounded transition-colors ${value ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30'}`}>
                {value ? iconOn : iconOff}
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                className="bg-[#0f172a] border-4 border-slate-500 rounded-lg p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-700">
                    <div className="flex items-center gap-3">
                        <Settings className="text-slate-300 w-8 h-8" />
                        <h2 className="text-2xl font-pixel text-slate-100 drop-shadow-md">SYSTEM SETTINGS</h2>
                    </div>
                    <Button variant="ghost" onClick={onClose} className="text-red-500 hover:bg-red-900/50">X</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Audio Settings */}
                        <section>
                            <h3 className="font-pixel text-xs text-blue-400 mb-3 flex items-center gap-2">
                                <Volume2 className="w-4 h-4" /> AUDIO CONTROLS
                            </h3>
                            <div className="flex flex-col gap-2">
                                <SettingToggle 
                                    label="Master Music" 
                                    value={settings.musicEnabled} 
                                    onToggle={settings.toggleMusic} 
                                    iconOn={<Volume2 size={16} />} 
                                    iconOff={<VolumeX size={16} />} 
                                />
                                <SettingToggle 
                                    label="Ambient Sounds" 
                                    value={settings.ambientEnabled} 
                                    onToggle={settings.toggleAmbient} 
                                    iconOn={<Volume2 size={16} />} 
                                    iconOff={<VolumeX size={16} />} 
                                />
                                <SettingToggle 
                                    label="Sound Effects (SFX)" 
                                    value={settings.sfxEnabled} 
                                    onToggle={settings.toggleSfx} 
                                    iconOn={<Volume2 size={16} />} 
                                    iconOff={<VolumeX size={16} />} 
                                />
                            </div>
                        </section>

                        {/* Visual Settings */}
                        <section>
                            <h3 className="font-pixel text-xs text-purple-400 mb-3 flex items-center gap-2">
                                <Eye className="w-4 h-4" /> VISUAL EFFECTS
                            </h3>
                            <div className="flex flex-col gap-2">
                                <SettingToggle 
                                    label="Atmosphere (Sky/Clouds)" 
                                    value={settings.atmosphereEnabled} 
                                    onToggle={settings.toggleAtmosphere} 
                                    iconOn={<Eye size={16} />} 
                                    iconOff={<EyeOff size={16} />} 
                                />
                                <SettingToggle 
                                    label="Ambient Particles" 
                                    value={settings.particlesEnabled} 
                                    onToggle={settings.toggleParticles} 
                                    iconOn={<Monitor size={16} />} 
                                    iconOff={<Monitor size={16} className="opacity-50" />} 
                                />
                                <SettingToggle 
                                    label="Day / Night Cycle" 
                                    value={settings.dayNightCycleEnabled} 
                                    onToggle={settings.toggleDayNight} 
                                    iconOn={<Monitor size={16} />} 
                                    iconOff={<Monitor size={16} className="opacity-50" />} 
                                />
                                <SettingToggle 
                                    label="Character Auras & Light" 
                                    value={settings.characterAurasEnabled} 
                                    onToggle={settings.toggleAuras} 
                                    iconOn={<Eye size={16} />} 
                                    iconOff={<EyeOff size={16} />} 
                                />
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">
                        {/* Account Info */}
                        <section className="bg-black/30 border-2 border-slate-700 p-4 rounded-lg">
                            <h3 className="font-pixel text-xs text-green-400 mb-4 flex items-center gap-2">
                                🛡️ ACCOUNT STATUS
                            </h3>
                            <div className="text-sm font-pixel text-slate-300 break-words mb-4">
                                [ID] <span className="text-gray-500">{profile?.uid || "GUEST"}</span>
                            </div>
                            <div className="text-[10px] font-pixel text-slate-400 break-words bg-black/50 p-2 rounded mb-6">
                                EMAIL: {profile?.email || "guest@pixelquest.local"}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button 
                                    variant="secondary" 
                                    onClick={handleLogout}
                                    className="w-full justify-center flex gap-2 items-center bg-blue-900 border-blue-600 hover:bg-blue-800"
                                >
                                    <LogOut size={16} /> LOGOUT
                                </Button>
                                <Button 
                                    variant="danger" 
                                    onClick={handleDeleteAccount}
                                    className="w-full justify-center flex gap-2 items-center text-[10px]"
                                >
                                    <Trash2 size={16} /> DELETE ACCOUNT
                                </Button>
                            </div>
                        </section>

                        <div className="flex-1 flex flex-col items-center justify-end gap-2 mt-4">
                            <div className="bg-black/40 border border-slate-700 p-3 rounded-lg text-center w-full">
                                <h4 className="font-pixel text-[10px] text-yellow-500 mb-2">ABOUT THE CREATOR</h4>
                                <p className="font-pixel text-[8px] text-slate-300 mb-2">KUNAL SINGH</p>
                                <div className="border-t border-slate-700 pt-2 px-1">
                                    <p className="font-pixel text-[6px] text-slate-400 leading-relaxed uppercase">
                                        A gamified productivity dashboard transforming daily tasks into an epic retro RPG adventure.
                                    </p>
                                </div>
                            </div>
                            <p className="font-pixel text-[8px] text-slate-600 text-center mt-2">
                                PIXEL QUEST ENGINE V1.0.0
                                <br/>SYSTEM RUNNING NOMINAL
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
