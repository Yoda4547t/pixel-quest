export enum TileType {
    GRASS = 0,
    WALL = 1,
    TREE = 2,
    WATER = 3,
    LAVA = 4,
    PATH = 5,
    STONE = 6,
    DUNGEON_GATE = 7,
    SHOP = 8,
    QUEST_BOARD = 9,
    
    // Extensions for specific interactive buildings/objects
    SKIN_SHOP = 10,
    UPGRADE_SHOP = 11,
    HOSPITAL = 12,
    GUILD_TENT = 13,
    BOSS_STATUE = 14,
    DIRT = 15,
}

export interface MapData {
    width: number;
    height: number;
    tiles: number[][];
    spawnX: number;
    spawnY: number;
}
