/**
 * Game Canvas Component - React wrapper for the canvas renderer
 */
import { useEffect, useRef, useState } from 'react';
import { GameCanvasRenderer } from './GameCanvasRenderer';
import type { GameMap, PixelCoordinate, GridCoordinate } from '@/types';

export interface GameCanvasProps {
    map: GameMap | null;
    tilesetBaseUrl: string;
    camera: PixelCoordinate;
    onTileClick?: (grid: GridCoordinate) => void;
    className?: string;
}

export function GameCanvas({
    map,
    tilesetBaseUrl,
    camera,
    onTileClick,
    className = '',
}: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<GameCanvasRenderer | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize renderer
    useEffect(() => {
        if (!canvasRef.current) return;

        const renderer = new GameCanvasRenderer(canvasRef.current);
        renderer.setClickCallback((grid) => onTileClick?.(grid));
        rendererRef.current = renderer;

        return () => {
            renderer.destroy();
            rendererRef.current = null;
        };
    }, [onTileClick]);

    // Load map when it changes
    useEffect(() => {
        if (!map || !rendererRef.current) return;

        const tilesetUrl = `${tilesetBaseUrl}/tileset-${map.id}.png`;
        rendererRef.current
            .loadMap(map, tilesetUrl)
            .then(() => setIsLoaded(true))
            .catch((error) => {
                console.error('Failed to load map:', error);
                setIsLoaded(false);
            });
    }, [map, tilesetBaseUrl]);

    // Update camera when it changes
    useEffect(() => {
        if (rendererRef.current) {
            rendererRef.current.setCamera(camera);
        }
    }, [camera]);

    // Start/stop animation
    useEffect(() => {
        if (rendererRef.current && isLoaded) {
            rendererRef.current.startAnimation();
            return () => rendererRef.current?.stopAnimation();
        }
    }, [isLoaded]);

    return (
        <div className={`relative ${className}`}>
            <canvas
                ref={canvasRef}
                className="block h-full w-full"
                style={{ imageRendering: 'pixelated' }}
            />
            {!isLoaded && map && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white">Loading...</div>
                </div>
            )}
        </div>
    );
}
