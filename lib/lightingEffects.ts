export type LightType = 'aura' | 'torch' | 'lava' | 'portal';

export const getLightingEffect = (type: LightType, intensity: 'low' | 'medium' | 'high' = 'medium') => {
    switch (type) {
        case 'aura':
            if (intensity === 'low') return 'shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)]';
            if (intensity === 'medium') return 'shadow-[0_0_25px_rgba(125,211,252,0.4)] bg-[radial-gradient(circle,rgba(125,211,252,0.2)_0%,transparent_70%)]';
            return 'shadow-[0_0_40px_rgba(250,204,21,0.6)] bg-[radial-gradient(circle,rgba(250,204,21,0.3)_0%,transparent_80%)]';
            
        case 'torch':
            return 'shadow-[0_0_30px_rgba(251,146,60,0.8)] bg-[radial-gradient(circle,rgba(251,146,60,0.4)_0%,transparent_70%)] animate-pulse';
            
        case 'lava':
            return 'shadow-[0_0_40px_rgba(239,68,68,0.7)] bg-[radial-gradient(circle,rgba(239,68,68,0.5)_0%,transparent_80%)] mix-blend-screen';
            
        case 'portal':
            return 'shadow-[0_0_35px_rgba(168,85,247,0.8)] bg-[radial-gradient(circle,rgba(168,85,247,0.5)_0%,transparent_70%)] animate-pulse';
            
        default:
            return '';
    }
};
