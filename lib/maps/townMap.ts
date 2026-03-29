import { MapData, TileType as T } from "./types";

// Original: W=Water, G=Grass, T=Tree, P=Path, S=Skin Shop, U=Upgrade Shop, H=Hospital
// Converted to Numeric TileTypes
export const townMap: MapData = {
    width: 10,
    height: 10,
    spawnX: 4,
    spawnY: 8,
    tiles: [
        [T.WATER, T.WATER, T.WATER, T.GRASS, T.GRASS, T.GRASS, T.TREE, T.GRASS, T.WATER, T.WATER],
        [T.WATER, T.GRASS, T.TREE, T.GRASS, T.GRASS, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.WATER],
        [T.WATER, T.GRASS, T.GRASS, T.HOSPITAL, T.PATH, T.PATH, T.PATH, T.TREE, T.GRASS, T.WATER],
        [T.GRASS, T.GRASS, T.TREE, T.GRASS, T.PATH, T.TREE, T.PATH, T.GRASS, T.GRASS, T.GRASS],
        [T.GRASS, T.SKIN_SHOP, T.PATH, T.PATH, T.PATH, T.GRASS, T.PATH, T.UPGRADE_SHOP, T.GRASS, T.GRASS],
        [T.GRASS, T.GRASS, T.TREE, T.GRASS, T.PATH, T.GRASS, T.PATH, T.GRASS, T.TREE, T.GRASS],
        [T.WATER, T.GRASS, T.GRASS, T.GRASS, T.PATH, T.PATH, T.PATH, T.GRASS, T.GRASS, T.WATER],
        [T.WATER, T.WATER, T.TREE, T.GRASS, T.PATH, T.GRASS, T.TREE, T.GRASS, T.GRASS, T.WATER],
        [T.WATER, T.WATER, T.WATER, T.GRASS, T.PATH, T.GRASS, T.GRASS, T.GRASS, T.WATER, T.WATER],
        [T.WATER, T.WATER, T.WATER, T.WATER, T.PATH, T.WATER, T.WATER, T.WATER, T.WATER, T.WATER]
    ]
};
