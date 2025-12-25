/**
 * Game Context - Global game state management
 */
import { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { GameInitData, Player, GameMap, GridCoordinate } from '@/types';

// Event types
export type GameEventType =
    | 'animation'
    | 'scene-loading-start'
    | 'scene-loading-end'
    | 'clock-60s'
    | 'clock-1s'
    | 'clock-100ms'
    | 'clock-20ms'
    | 'ui-update';

export interface GameEvent {
    type: GameEventType;
    payload?: unknown;
}

type EventHandler = (event: GameEvent) => void;

// State
interface GameState {
    initialized: boolean;
    loading: boolean;
    currentMap: GameMap | null;
    player: Player | null;
    camera: { x: number; y: number };
    onlineCount: number;
}

type GameAction =
    | { type: 'SET_INITIALIZED' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_CURRENT_MAP'; payload: GameMap }
    | { type: 'SET_PLAYER'; payload: Player }
    | { type: 'SET_CAMERA'; payload: { x: number; y: number } }
    | { type: 'SET_ONLINE_COUNT'; payload: number };

const initialState: GameState = {
    initialized: false,
    loading: true,
    currentMap: null,
    player: null,
    camera: { x: 0, y: 0 },
    onlineCount: 0,
};

function reducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'SET_INITIALIZED':
            return { ...state, initialized: true };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_CURRENT_MAP':
            return { ...state, currentMap: action.payload };
        case 'SET_PLAYER':
            return { ...state, player: action.payload };
        case 'SET_CAMERA':
            return { ...state, camera: action.payload };
        case 'SET_ONLINE_COUNT':
            return { ...state, onlineCount: action.payload };
        default:
            return state;
    }
}

// Context
interface GameContextValue {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
    // Event bus methods
    on: (type: GameEventType, handler: EventHandler) => () => void;
    emit: (type: GameEventType, payload?: unknown) => void;
    // Game control methods
    movePlayer: (grid: GridCoordinate) => void;
    switchMap: (mapId: string) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// Event bus implementation (simple version)
const eventHandlers = new Map<GameEventType, Set<EventHandler>>();

function onEvent(type: GameEventType, handler: EventHandler): () => void {
    const handlers = eventHandlers.get(type) ?? new Set();
    handlers.add(handler);
    eventHandlers.set(type, handlers);
    return () => handlers.delete(handler);
}

function emitEvent(type: GameEventType, payload?: unknown): void {
    const handlers = eventHandlers.get(type);
    if (handlers) {
        handlers.forEach((handler) => handler({ type, payload }));
    }
}

// Provider
export function GameProvider({
    children,
    initData,
}: {
    children: ReactNode;
    initData: GameInitData;
}) {
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        player: initData.player,
        onlineCount: initData.onlineCount,
    });

    const movePlayer = useCallback((_grid: GridCoordinate) => {
        // TODO: Implement player movement via WebSocket
        emitEvent('ui-update');
    }, []);

    const switchMap = useCallback((_mapId: string) => {
        // TODO: Implement map switching
        emitEvent('ui-update');
    }, []);

    const value: GameContextValue = {
        state,
        dispatch,
        on: onEvent,
        emit: emitEvent,
        movePlayer,
        switchMap,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): GameContextValue {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
}
