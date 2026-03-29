import { MapData, TileType as T } from "./types";

// W=Wall, F=Floor(Stone), L=Lava, P=Pillar(Wall), B=Boss Statue
export const dungeonMap: MapData = {
    width: 10,
    height: 10,
    spawnX: 4,
    spawnY: 8,
    tiles: [
        [T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL],
        [T.WALL, T.LAVA, T.LAVA, T.STONE, T.BOSS_STATUE, T.STONE, T.LAVA, T.LAVA, T.LAVA, T.WALL],
        [T.WALL, T.LAVA, T.WALL, T.STONE, T.STONE, T.STONE, T.WALL, T.WALL, T.LAVA, T.WALL],
        [T.WALL, T.STONE, T.STONE, T.STONE, T.WALL, T.STONE, T.STONE, T.STONE, T.LAVA, T.WALL],
        [T.WALL, T.STONE, T.WALL, T.STONE, T.STONE, T.STONE, T.WALL, T.STONE, T.STONE, T.WALL],
        [T.WALL, T.STONE, T.STONE, T.LAVA, T.LAVA, T.STONE, T.STONE, T.STONE, T.STONE, T.WALL],
        [T.WALL, T.WALL, T.STONE, T.STONE, T.STONE, T.STONE, T.WALL, T.WALL, T.STONE, T.WALL],
        [T.LAVA, T.WALL, T.WALL, T.STONE, T.STONE, T.STONE, T.STONE, T.STONE, T.STONE, T.WALL],
        [T.LAVA, T.LAVA, T.WALL, T.WALL, T.STONE, T.WALL, T.WALL, T.WALL, T.WALL, T.WALL],
        [T.LAVA, T.LAVA, T.LAVA, T.WALL, T.PATH, T.WALL, T.LAVA, T.LAVA, T.LAVA, T.LAVA],
    ]
};
