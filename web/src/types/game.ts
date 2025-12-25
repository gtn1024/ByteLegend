/**
 * Core game types - TypeScript port of Kotlin shared models
 */

// Coordinate types
export interface GridCoordinate {
    x: number;
    y: number;
}

export interface PixelCoordinate {
    x: number;
    y: number;
}

export interface GridSize {
    width: number;
    height: number;
}

export interface PixelSize {
    width: number;
    height: number;
}

// Map types
export interface RawTileAnimationFrame {
    coordinate: GridCoordinate;
    duration: number; // milliseconds
}

export type BlockerType = 0 | 1; // 0 = NON_BLOCKER, 1 = BLOCKER

export interface RawGameMapTileLayer {
    layer: number;
}

export interface RawStaticImageLayer extends RawGameMapTileLayer {
    coordinate: GridCoordinate;
}

export interface RawAnimationLayer extends RawGameMapTileLayer {
    frames: RawTileAnimationFrame[];
}

export interface RawGameMapTile {
    layers: RawGameMapTileLayer[];
    blocker: BlockerType;
}

// Use const object instead of enum for erasableSyntaxOnly compatibility
export const GameMapObjectType = {
    GameMapText: 0,
    GameMapRegion: 1,
    GameMapPoint: 2,
    GameMapCurve: 3,
    GameMapDynamicSprite: 4,
    GameMapMission: 5,
    GameMapEntrancePoint: 6,
    GameMapEntranceDestinationPoint: 7,
    GameMapAnimation: 8,
} as const;

export type GameMapObjectType = (typeof GameMapObjectType)[keyof typeof GameMapObjectType];

export interface GameMap {
    id: string;
    size: GridSize;
    tileSize: PixelSize;
    rawTiles: RawGameMapTile[][];
    objects: GameMapObject[];
    // Computed property for pixel size
    pixelSize?: PixelSize;
}

// Map objects
export interface GameMapText {
    type: typeof GameMapObjectType.GameMapText;
    id: string;
    gridCoordinate: GridCoordinate;
    textId: string;
    color: string;
    backgroundColor: string | null;
}

export interface GameMapRegion {
    type: typeof GameMapObjectType.GameMapRegion;
    id: string;
    tiles: GridCoordinate[];
}

export interface GameMapPoint {
    type: typeof GameMapObjectType.GameMapPoint;
    id: string;
    gridCoordinate: GridCoordinate;
}

export interface GameMapCurve {
    type: typeof GameMapObjectType.GameMapCurve;
    id: string;
    points: GridCoordinate[];
    color: string;
}

export interface GameMapDynamicSprite {
    type: typeof GameMapObjectType.GameMapDynamicSprite;
    id: string;
    gridCoordinate: GridCoordinate;
    spriteId: string;
    animationSetId: string | null;
}

export interface GameMapMission {
    type: typeof GameMapObjectType.GameMapMission;
    id: string;
    gridCoordinate: GridCoordinate;
    sprite: string;
    missionId: string;
}

export interface GameMapEntrancePoint {
    type:
        | typeof GameMapObjectType.GameMapEntrancePoint
        | typeof GameMapObjectType.GameMapEntranceDestinationPoint;
    id: string;
    gridCoordinate: GridCoordinate;
    srcMap: string;
    destMap: string;
    destGridCoordinate: GridCoordinate;
}

export interface GameMapAnimation {
    type: typeof GameMapObjectType.GameMapAnimation;
    id: string;
    gridCoordinate: GridCoordinate;
    animationId: string;
    layer: number;
}

export type GameMapObject =
    | GameMapText
    | GameMapRegion
    | GameMapPoint
    | GameMapCurve
    | GameMapDynamicSprite
    | GameMapMission
    | GameMapEntrancePoint
    | GameMapAnimation;

// Character types
export interface AnimationSet {
    id: string;
    frames: number;
    directions: number;
}

export type Direction = 0 | 1 | 2 | 3; // Up, Right, Down, Left

export interface CharacterState {
    gridCoordinate: GridCoordinate;
    direction: Direction;
    isMoving: boolean;
    animationFrame: number;
}

// Helper functions
export function pixelToGrid(pixel: PixelCoordinate, tileSize: PixelSize): GridCoordinate {
    return {
        x: Math.floor(pixel.x / tileSize.width),
        y: Math.floor(pixel.y / tileSize.height),
    };
}

export function gridToPixel(grid: GridCoordinate, tileSize: PixelSize): PixelCoordinate {
    return {
        x: grid.x * tileSize.width,
        y: grid.y * tileSize.height,
    };
}

export function isValidGrid(grid: GridCoordinate, size: GridSize): boolean {
    return grid.x >= 0 && grid.x < size.width && grid.y >= 0 && grid.y < size.height;
}

// Calculate pixel size for a map
export function calculateMapPixelSize(map: Pick<GameMap, 'size' | 'tileSize'>): PixelSize {
    return {
        width: map.size.width * map.tileSize.width,
        height: map.size.height * map.tileSize.height,
    };
}
