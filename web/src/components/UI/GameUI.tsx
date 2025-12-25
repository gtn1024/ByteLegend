/**
 * Game UI Layer - Overlays on top of the canvas
 */
import { TopBar } from './TopBar';
import { LeftSidebar } from './LeftSidebar';
import { MapSelector } from './MapSelector';
import type { GameMapDefinition } from '@/types';

interface GameUIProps {
    maps: GameMapDefinition[];
    currentMapId: string;
    onMapSelect: (mapId: string) => void;
    onMenuOpen: (menu: string) => void;
}

export function GameUI({ maps, currentMapId, onMapSelect, onMenuOpen }: GameUIProps) {
    return (
        <>
            {/* Top bar */}
            <TopBar />

            {/* Main game area layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                <LeftSidebar onMenuClick={onMenuOpen} />

                {/* Game canvas takes remaining space */}
                <div className="relative flex-1">
                    {/* Map selector - positioned absolutely in top-left of canvas */}
                    <div className="absolute left-4 top-4 z-10">
                        <MapSelector
                            maps={maps}
                            currentMapId={currentMapId}
                            onMapSelect={onMapSelect}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
