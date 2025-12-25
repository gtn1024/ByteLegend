/**
 * Game Page - Main game entry point
 */
import { useState, useEffect, useCallback } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import { GameCanvas } from '@/components/GameCanvas';
import { GameUI } from '@/components/UI';
import type { GameInitData, GameMap, GridCoordinate } from '@/types';

// Mock function to load map data - replace with real API call
async function loadMap(mapId: string, rrbd: string): Promise<GameMap> {
    const response = await fetch(`${rrbd}/map/${mapId}.json`);
    if (!response.ok) {
        throw new Error(`Failed to load map: ${mapId}`);
    }
    return response.json();
}

interface GamePageProps {
    initData: GameInitData;
}

function GameContent({ initData }: GamePageProps) {
    const { dispatch, on } = useGame();
    const [currentMap, setCurrentMap] = useState<GameMap | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize game
    useEffect(() => {
        dispatch({ type: 'SET_PLAYER', payload: initData.player });
        dispatch({ type: 'SET_ONLINE_COUNT', payload: initData.onlineCount });
        dispatch({ type: 'SET_INITIALIZED' });
    }, [initData, dispatch]);

    // Load initial map
    useEffect(() => {
        if (!initData.initMapId) return;

        loadMap(initData.initMapId, initData.rrbd)
            .then((map) => {
                setIsLoading(false);
                setCurrentMap(map);
                dispatch({ type: 'SET_CURRENT_MAP', payload: map });
            })
            .catch((error) => {
                console.error('Failed to load map:', error);
                setIsLoading(false);
            });
    }, [initData.initMapId, initData.rrbd, dispatch]);

    // Subscribe to events
    useEffect(() => {
        const unsubAnimation = on('animation', () => {
            // Handle animation frame
        });

        const unsubUiUpdate = on('ui-update', () => {
            // Force re-render on UI updates
        });

        return () => {
            unsubAnimation();
            unsubUiUpdate();
        };
    }, [on]);

    const handleMapSelect = useCallback(
        (mapId: string) => {
            setCurrentMap(null);
            loadMap(mapId, initData.rrbd)
                .then((map) => {
                    setCurrentMap(map);
                    dispatch({ type: 'SET_CURRENT_MAP', payload: map });
                })
                .catch((error) => {
                    console.error('Failed to load map:', error);
                });
        },
        [initData.rrbd, dispatch]
    );

    const handleTileClick = useCallback((grid: GridCoordinate) => {
        console.log('Tile clicked:', grid);
        // TODO: Handle tile click (move player, interact with objects, etc.)
    }, []);

    const handleMenuOpen = useCallback((menu: string) => {
        console.log('Menu opened:', menu);
        // TODO: Open menu modal
    }, []);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-gray-900 text-white">
            {/* Game UI Layer */}
            <GameUI
                maps={initData.maps}
                currentMapId={currentMap?.id ?? initData.initMapId}
                onMapSelect={handleMapSelect}
                onMenuOpen={handleMenuOpen}
            />

            {/* Game Canvas */}
            <div className="relative flex-1">
                <GameCanvas
                    map={currentMap}
                    tilesetBaseUrl={initData.rrbd}
                    camera={{ x: 0, y: 0 }}
                    onTileClick={handleTileClick}
                    className="absolute inset-0"
                />

                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="text-center">
                            <div className="mb-2 text-2xl">Loading...</div>
                            <div className="text-gray-400">
                                {currentMap?.id ?? initData.initMapId}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function GamePage({ initData }: GamePageProps) {
    return (
        <GameProvider initData={initData}>
            <GameContent initData={initData} />
        </GameProvider>
    );
}
