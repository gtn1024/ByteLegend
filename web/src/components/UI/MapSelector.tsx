/**
 * Map Selector - Dropdown to switch between maps
 */
import { useState } from 'react';
import type { GameMapDefinition } from '@/types';

interface MapSelectorProps {
    maps: GameMapDefinition[];
    currentMapId: string;
    onMapSelect: (mapId: string) => void;
}

export function MapSelector({ maps, currentMapId, onMapSelect }: MapSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const currentMap = findMapById(maps, currentMapId);

    const renderMapOption = (map: GameMapDefinition, depth = 0) => (
        <button
            key={map.id}
            className={`w-full px-3 py-2 text-left hover:bg-gray-700 ${
                map.id === currentMapId ? 'bg-blue-900' : ''
            }`}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
            onClick={() => {
                onMapSelect(map.id);
                setIsOpen(false);
            }}
        >
            {map.id}
        </button>
    );

    return (
        <div className="relative">
            <button
                className="rounded bg-gray-800 px-3 py-1 text-white hover:bg-gray-700"
                onClick={() => setIsOpen(!isOpen)}
            >
                {currentMap?.id ?? currentMapId} ▼
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded bg-gray-800 shadow-lg">
                        {maps.map((map) => renderMapOption(map))}
                    </div>
                </>
            )}
        </div>
    );
}

function findMapById(maps: GameMapDefinition[], id: string): GameMapDefinition | null {
    for (const map of maps) {
        if (map.id === id) return map;
        if (map.children.length > 0) {
            const found = findMapById(map.children, id);
            if (found) return found;
        }
    }
    return null;
}
