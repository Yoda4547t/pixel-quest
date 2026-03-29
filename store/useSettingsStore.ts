import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
    // Audio Options
    masterVolume: number;
    musicEnabled: boolean;
    ambientEnabled: boolean;
    sfxEnabled: boolean;

    // Visual Options
    atmosphereEnabled: boolean;
    particlesEnabled: boolean;
    dayNightCycleEnabled: boolean;
    characterAurasEnabled: boolean;
    screenShakeEnabled: boolean;

    // Actions
    toggleMusic: () => void;
    toggleAmbient: () => void;
    toggleSfx: () => void;
    toggleAtmosphere: () => void;
    toggleParticles: () => void;
    toggleDayNight: () => void;
    toggleAuras: () => void;
    toggleScreenShake: () => void;
    setMasterVolume: (val: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            masterVolume: 100,
            musicEnabled: true,
            ambientEnabled: true,
            sfxEnabled: true,
            atmosphereEnabled: true,
            particlesEnabled: true,
            dayNightCycleEnabled: true,
            characterAurasEnabled: true,
            screenShakeEnabled: true,

            toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
            toggleAmbient: () => set((state) => ({ ambientEnabled: !state.ambientEnabled })),
            toggleSfx: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),
            toggleAtmosphere: () => set((state) => ({ atmosphereEnabled: !state.atmosphereEnabled })),
            toggleParticles: () => set((state) => ({ particlesEnabled: !state.particlesEnabled })),
            toggleDayNight: () => set((state) => ({ dayNightCycleEnabled: !state.dayNightCycleEnabled })),
            toggleAuras: () => set((state) => ({ characterAurasEnabled: !state.characterAurasEnabled })),
            toggleScreenShake: () => set((state) => ({ screenShakeEnabled: !state.screenShakeEnabled })),
            setMasterVolume: (val) => set({ masterVolume: val }),
        }),
        {
            name: 'pixelquest-settings',
        }
    )
);
