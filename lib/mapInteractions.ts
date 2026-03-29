import { TileType } from "./maps/types";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export type InteractionAction = 
    | { type: 'OPEN_MODAL', modalId: string }
    | { type: 'GIVE_REWARD', xp: number, coins: number, message: string }
    | { type: 'TRIGGER_BOSS' }
    | { type: 'ROUTING', path: string }
    | { type: 'NONE' };

export const getTileInteraction = (tileId: TileType): { prompt: string, action: InteractionAction } | null => {
    switch (tileId) {
        case TileType.SHOP:
            return { prompt: "Press ENTER to open Shop", action: { type: 'OPEN_MODAL', modalId: 'shop' }};
        case TileType.DUNGEON_GATE:
            return { prompt: "Press ENTER to engage Boss", action: { type: 'TRIGGER_BOSS' }};
        case TileType.QUEST_BOARD:
            return { prompt: "Press ENTER to open Quests", action: { type: 'OPEN_MODAL', modalId: 'guild' }};
        default:
            return null; // Not interactive
    }
};

// Global handler function
export const processInteraction = (action: InteractionAction, openModalFunc: (id: string) => void) => {
    if (action.type === 'OPEN_MODAL') {
        openModalFunc(action.modalId);
    } else if (action.type === 'GIVE_REWARD') {
        useAuthStore.getState().updateXP(action.xp);
        useAuthStore.setState(s => ({
            profile: s.profile ? { ...s.profile, coins: s.profile.coins + action.coins } : null
        }));
        toast.success(action.message, { icon: "🎁" });
    } else if (action.type === 'TRIGGER_BOSS') {
        openModalFunc('boss');
    }
};
