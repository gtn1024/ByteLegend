/**
 * Game Canvas Renderer - Core rendering engine using HTML5 Canvas
 */
import type { GameMap, PixelCoordinate, GridCoordinate } from '@/types';
import { calculateMapPixelSize, GameMapObjectType } from '@/types';

export class GameCanvasRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private map: GameMap | null = null;
    private camera: PixelCoordinate = { x: 0, y: 0 };
    private tileImages: Map<string, HTMLImageElement> = new Map();
    private animationFrame = 0;
    private lastFrameTime = 0;
    private animationId: number | null = null;

    // Callbacks
    private onRender?: () => void;
    private onClick?: (grid: GridCoordinate) => void;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }
        this.ctx = ctx;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.canvas.addEventListener('click', (e) => {
            if (!this.map) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left + this.camera.x;
            const y = e.clientY - rect.top + this.camera.y;
            const grid: GridCoordinate = {
                x: Math.floor(x / this.map.tileSize.width),
                y: Math.floor(y / this.map.tileSize.height),
            };
            this.onClick?.(grid);
        });
    }

    async loadMap(map: GameMap, tilesetUrl: string): Promise<void> {
        this.map = map;
        const pixelSize = calculateMapPixelSize(map);
        this.canvas.width = pixelSize.width;
        this.canvas.height = pixelSize.height;

        // Load tileset image (assuming spritesheet format)
        const tilesetImage = await preloadImage(`tileset-${map.id}`, tilesetUrl);

        // Extract individual tiles from spritesheet
        // This is a simplified version - real implementation would need proper tile extraction
        this.tileImages.set('default', tilesetImage);

        this.render();
    }

    setCamera(camera: PixelCoordinate): void {
        this.camera = camera;
        this.render();
    }

    setClickCallback(callback: (grid: GridCoordinate) => void): void {
        this.onClick = callback;
    }

    setRenderCallback(callback: () => void): void {
        this.onRender = callback;
    }

    startAnimation(): void {
        if (this.animationId) return;

        const animate = (timestamp: number) => {
            if (timestamp - this.lastFrameTime >= 100) {
                // 10 FPS for animations
                this.animationFrame++;
                this.lastFrameTime = timestamp;
                this.render();
            }
            this.animationId = requestAnimationFrame(animate);
        };

        this.lastFrameTime = performance.now();
        this.animationId = requestAnimationFrame(animate);
    }

    stopAnimation(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private render(): void {
        if (!this.map) return;

        const { ctx, canvas, map, camera } = this;

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate visible tiles
        const startCol = Math.floor(camera.x / map.tileSize.width);
        const endCol = startCol + Math.ceil(canvas.width / map.tileSize.width) + 1;
        const startRow = Math.floor(camera.y / map.tileSize.height);
        const endRow = startRow + Math.ceil(canvas.height / map.tileSize.height) + 1;

        // Draw visible tiles
        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y >= 0 && y < map.size.height && x >= 0 && x < map.size.width) {
                    this.drawTile(x, y);
                }
            }
        }

        // Draw map objects
        this.drawMapObjects();

        this.onRender?.();
    }

    private drawTile(gridX: number, gridY: number): void {
        if (!this.map) return;

        const tile = this.map.rawTiles[gridY]?.[gridX];
        if (!tile) return;

        const destX = gridX * this.map.tileSize.width - this.camera.x;
        const destY = gridY * this.map.tileSize.height - this.camera.y;

        tile.layers.forEach((layer) => {
            // Draw layer based on type
            if ('coordinate' in layer) {
                const staticLayer = layer as { coordinate: GridCoordinate };
                const srcX = staticLayer.coordinate.x * this.map!.tileSize.width;
                const srcY = staticLayer.coordinate.y * this.map!.tileSize.height;

                const image = this.tileImages.get('default');
                if (image) {
                    this.ctx.drawImage(
                        image,
                        srcX,
                        srcY,
                        this.map!.tileSize.width,
                        this.map!.tileSize.height,
                        destX,
                        destY,
                        this.map!.tileSize.width,
                        this.map!.tileSize.height
                    );
                }
            }
        });
    }

    private drawMapObjects(): void {
        if (!this.map) return;

        this.map.objects.forEach((obj) => {
            switch (obj.type) {
                case GameMapObjectType.GameMapText:
                    this.drawText(
                        obj as {
                            gridCoordinate: GridCoordinate;
                            textId: string;
                            color: string;
                        }
                    );
                    break;
                case GameMapObjectType.GameMapPoint:
                    this.drawPoint(obj as { gridCoordinate: GridCoordinate });
                    break;
                case GameMapObjectType.GameMapCurve:
                    this.drawCurve(
                        obj as {
                            points: GridCoordinate[];
                            color: string;
                        }
                    );
                    break;
                // Add more object types as needed
            }
        });
    }

    private drawText(obj: { gridCoordinate: GridCoordinate; textId: string; color: string }): void {
        const pixel = {
            x: obj.gridCoordinate.x * this.map!.tileSize.width - this.camera.x,
            y: obj.gridCoordinate.y * this.map!.tileSize.height - this.camera.y,
        };

        this.ctx.fillStyle = obj.color;
        this.ctx.font = '16px sans-serif';
        this.ctx.fillText(obj.textId, pixel.x, pixel.y);
    }

    private drawPoint(obj: { gridCoordinate: GridCoordinate }): void {
        const pixel = {
            x: obj.gridCoordinate.x * this.map!.tileSize.width - this.camera.x,
            y: obj.gridCoordinate.y * this.map!.tileSize.height - this.camera.y,
        };

        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(pixel.x + 16, pixel.y + 16, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private drawCurve(obj: { points: GridCoordinate[]; color: string }): void {
        if (obj.points.length < 2) return;

        this.ctx.strokeStyle = obj.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        const first = obj.points[0];
        this.ctx.moveTo(
            first.x * this.map!.tileSize.width - this.camera.x + 16,
            first.y * this.map!.tileSize.height - this.camera.y + 16
        );

        for (let i = 1; i < obj.points.length; i++) {
            const p = obj.points[i];
            this.ctx.lineTo(
                p.x * this.map!.tileSize.width - this.camera.x + 16,
                p.y * this.map!.tileSize.height - this.camera.y + 16
            );
        }

        this.ctx.stroke();
    }

    destroy(): void {
        this.stopAnimation();
    }
}

// Helper function
function preloadImage(_id: string, url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
    });
}
