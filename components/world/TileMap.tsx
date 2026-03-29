"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapData, TileType } from '@/lib/maps/types';
import { Tile, INTERACTIVE_TILES, OBSTACLE_TILES } from './Tile';
import { PlayerCharacter } from '../game/PlayerCharacter';
import { motion, AnimatePresence } from 'framer-motion';
import { getTileInteraction } from '@/lib/mapInteractions';

interface TileMapProps {
    mapData: MapData;
    onInteract: (tileType: TileType, x: number, y: number) => void;
    // Controlled from outside if scenes want to lock movement (e.g., when modal open)
    isLocked?: boolean;
}

export function TileMap({ mapData, onInteract, isLocked = false }: TileMapProps) {
    const [playerPos, setPlayerPos] = useState({ x: mapData.spawnX, y: mapData.spawnY });
    const [facing, setFacing] = useState<'left'|'right'>('right');
    const [isMoving, setIsMoving] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate tile currently under player
    const tileUnderPlayer = mapData.tiles[playerPos.y]?.[playerPos.x] ?? TileType.GRASS;
    
    // Check neighbors for interactive tiles to show prompt
    const interactiveNeighbor = (() => {
        const neighbors = [
            { x: playerPos.x, y: playerPos.y - 1 },
            { x: playerPos.x, y: playerPos.y + 1 },
            { x: playerPos.x - 1, y: playerPos.y },
            { x: playerPos.x + 1, y: playerPos.y },
            { x: playerPos.x, y: playerPos.y } // also check current tile just in case
        ];
        
        for (const n of neighbors) {
            if (n.y >= 0 && n.y < mapData.height && n.x >= 0 && n.x < mapData.width) {
                const t = mapData.tiles[n.y][n.x];
                if (INTERACTIVE_TILES.includes(t)) {
                    return { type: t, x: n.x, y: n.y };
                }
            }
        }
        return null;
    })();

    const handleMovement = useCallback((e: KeyboardEvent) => {
        if (isLocked) {
            setIsMoving(false);
            return;
        }

        // Handle interactions
        if (e.key === "Enter" || e.key === " ") {
            if (interactiveNeighbor) {
                onInteract(interactiveNeighbor.type, interactiveNeighbor.x, interactiveNeighbor.y);
            }
            return;
        }

        let newX = playerPos.x;
        let newY = playerPos.y;
        let moved = false;

        if ((e.key === "ArrowUp" || e.key === "w") && newY > 0) { newY -= 1; moved = true; }
        else if ((e.key === "ArrowDown" || e.key === "s") && newY < mapData.height - 1) { newY += 1; moved = true; }
        else if ((e.key === "ArrowLeft" || e.key === "a") && newX > 0) { newX -= 1; moved = true; setFacing('left'); }
        else if ((e.key === "ArrowRight" || e.key === "d") && newX < mapData.width - 1) { newX += 1; moved = true; setFacing('right'); }

        if (moved) {
            const targetTile = mapData.tiles[newY][newX];
            if (!OBSTACLE_TILES.includes(targetTile)) {
                setPlayerPos({ x: newX, y: newY });
                setIsMoving(true);
                // Reset moving state shortly after to return to idle
                setTimeout(() => setIsMoving(false), 200);
            }
        }
    }, [isLocked, playerPos, mapData, interactiveNeighbor, onInteract]);

    useEffect(() => {
        window.addEventListener("keydown", handleMovement);
        return () => window.removeEventListener("keydown", handleMovement);
    }, [handleMovement]);

    // FAKE CAMERA: Calculate the container transform based on player position
    // We want the player to be roughly centered.
    // Tile size is standard 48px or responsive. We use a relative percentage-based transform.
    // If grid is 10x10, each tile is 10%. 
    // We shift the container by translating it opposite to the player's percentage.
    const xOffset = -((playerPos.x / mapData.width) * 100) + 50 - (50 / mapData.width);
    const yOffset = -((playerPos.y / mapData.height) * 100) + 50 - (50 / mapData.height);

    // Limit offsets so we don't pan past the map edges (Camera clamps)
    // Wait, simple clamp doesn't work perfectly with percentage translations without exact PX known.
    // For a simple pixel RPG feel, letting it freely center on player is usually fine.
    // We will just apply the transform.
    
    return (
        <div className="relative w-full h-[60vh] max-h-[600px] overflow-hidden bg-slate-950 border-4 border-slate-700 rounded-lg shadow-2xl">
            
            {/* The Camera Container */}
            <motion.div 
                ref={containerRef}
                className="absolute w-[200%] h-[200%] md:w-[150%] md:h-[150%] transform-gpu"
                animate={{ x: `${xOffset}%`, y: `${yOffset}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${mapData.width}, 1fr)`,
                    gridTemplateRows: `repeat(${mapData.height}, 1fr)`
                }}
            >
                {/* Render Tiles */}
                {mapData.tiles.map((row, y) => 
                    row.map((tileType, x) => (
                        <Tile 
                            key={`${x}-${y}`} 
                            type={tileType} 
                            x={x} 
                            y={y} 
                            isPlayerHere={x === playerPos.x && y === playerPos.y}
                            isInteractive={INTERACTIVE_TILES.includes(tileType)}
                        />
                    ))
                )}
                
                {/* Render Player Sprite overlayed exactly on the tile */}
                <motion.div 
                    className="absolute z-20 pointer-events-none flex items-center justify-center pointer-events-none"
                    initial={false}
                    animate={{ 
                        left: `${(playerPos.x / mapData.width) * 100}%`, 
                        top: `${(playerPos.y / mapData.height) * 100}%`,
                        width: `${100 / mapData.width}%`,
                        height: `${100 / mapData.height}%`
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                    <div className="relative">
                        <PlayerCharacter isMoving={isMoving} facing={facing} />
                    </div>
                </motion.div>
            </motion.div>

            {/* UI Overlay for Interaction Prompts */}
            <AnimatePresence>
                {interactiveNeighbor && !isLocked && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 z-50 left-1/2 -translate-x-1/2 bg-black/80 border-2 border-yellow-400 text-yellow-400 px-4 py-2 font-pixel text-[10px] md:text-sm rounded pointer-events-none animate-pulse text-center min-w-[300px]"
                    >
                        {getTileInteraction(interactiveNeighbor.type)?.prompt || "PRESS [ENTER] TO INTERACT"}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
