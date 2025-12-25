/**
 * Player and game initialization types
 */

export interface BasePlayer {
    id: string;
    username: string;
    nickname: string;
    map: string;
    x: number;
    y: number;
    characterId: string;
    server: number;
    star: number;
    avatarUrl: string | null;
}

export interface Player extends BasePlayer {
    // Currency
    coin: number;
    reputation: number;

    // Inventory
    items: string[];
    usedItems: string[];
    achievements: string[];
    states: Record<string, string>;

    // Session
    locale: string | null;
    online: boolean;
    createdAt: string | null;
    lastLogInAt: string | null;
}

export interface GameMapDefinition {
    id: string;
    frames: number;
    children: GameMapDefinition[];
    roadmap: boolean;
}

export interface LocalizedText {
    id: string;
    localeToText: Record<string, string>;
}

export interface GameInitData {
    initMapId: string;
    onlineCount: number;
    rrbd: string; // Resource base URL
    enjoyProgrammingText: string;
    player: Player;
    maps: GameMapDefinition[];
    localizedTexts: LocalizedText[];
    joinQQGroupSecret: string;

    resolve(path: string): string;
}

// Anonymous player placeholder
export const ANONYMOUS_PLAYER: Player = {
    id: '',
    username: '',
    nickname: '',
    map: '',
    x: 0,
    y: 0,
    characterId: '',
    server: 0,
    star: 0,
    avatarUrl: null,
    coin: 0,
    reputation: 0,
    items: [],
    usedItems: [],
    achievements: [],
    states: {},
    locale: null,
    online: false,
    createdAt: null,
    lastLogInAt: null,
};
