import React, { memo } from 'react';
import { TileType } from '@/lib/maps/types';
import { motion } from 'framer-motion';

interface TileProps {
    type: TileType;
    x: number;
    y: number;
    isPlayerHere: boolean;
    isInteractive: boolean;
}

const TILE_DATA: Record<TileType, { char: string; bg: string; anim?: string }> = {
    [TileType.GRASS]: { char: '', bg: 'bg-[#86c06c]' },
    [TileType.WALL]: { char: '🧱', bg: 'bg-stone-800' },
    [TileType.TREE]: { char: '🌲', bg: 'bg-[#5a8645]', anim: 'animate-sway origin-bottom' },
    [TileType.WATER]: { char: '🌊', bg: 'bg-blue-500', anim: 'animate-pulse' },
    [TileType.LAVA]: { char: '🌋', bg: 'bg-orange-600', anim: 'animate-pulse shadow-[0_0_15px_rgba(234,88,12,0.8)]' },
    [TileType.PATH]: { char: '', bg: 'bg-[#d2b48c]' },
    [TileType.STONE]: { char: '', bg: 'bg-gray-600' },
    [TileType.DUNGEON_GATE]: { char: '⛩️', bg: 'bg-stone-900', anim: 'shadow-[0_0_20px_rgba(255,0,0,0.5)]' },
    [TileType.SHOP]: { char: '🏪', bg: 'bg-[#d2b48c]' },
    [TileType.QUEST_BOARD]: { char: '📜', bg: 'bg-[#d2b48c]' },
    [TileType.SKIN_SHOP]: { char: '🎽', bg: 'bg-[#d2b48c]' },
    [TileType.UPGRADE_SHOP]: { char: '⚒️', bg: 'bg-[#d2b48c]' },
    [TileType.HOSPITAL]: { char: '🏥', bg: 'bg-[#d2b48c]' },
    [TileType.GUILD_TENT]: { char: '🏕️', bg: 'bg-[#86c06c]' },
    [TileType.BOSS_STATUE]: { char: '👺', bg: 'bg-stone-800', anim: 'animate-bounce drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]' },
    [TileType.DIRT]: { char: '', bg: 'bg-[#6b5428]' }
};

export const INTERACTIVE_TILES = [
    TileType.SHOP, TileType.SKIN_SHOP, TileType.UPGRADE_SHOP, 
    TileType.HOSPITAL, TileType.QUEST_BOARD, TileType.DUNGEON_GATE, 
    TileType.GUILD_TENT, TileType.BOSS_STATUE
];

export const OBSTACLE_TILES = [
    TileType.WALL, TileType.TREE, TileType.WATER, TileType.LAVA, 
    TileType.DUNGEON_GATE, TileType.SHOP, TileType.SKIN_SHOP, 
    TileType.UPGRADE_SHOP, TileType.HOSPITAL, TileType.GUILD_TENT, 
    TileType.BOSS_STATUE, TileType.QUEST_BOARD
];

export const Tile = memo(function Tile({ type, x, y, isPlayerHere, isInteractive }: TileProps) {
    const data = TILE_DATA[type] || TILE_DATA[TileType.GRASS];
    
    return (
        <div 
            className={`relative w-full h-full flex items-center justify-center transition-colors duration-300 ${data.bg} ${isInteractive && !isPlayerHere ? 'ring-2 ring-yellow-400 ring-inset animate-pulse' : ''} ${isPlayerHere ? 'ring-2 ring-white ring-inset z-10' : ''}`}
            data-x={x}
            data-y={y}
        >
            {/* Tile Character Content */}
            {data.char && (
                <span className={`text-2xl md:text-3xl select-none ${data.anim || ''}`}>
                    {data.char}
                </span>
            )}
            
            {/* Darken/Lighten pattern overlay for visual texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
});
