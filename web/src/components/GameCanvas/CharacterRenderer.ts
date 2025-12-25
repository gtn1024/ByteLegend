/**
 * Character Renderer - Handles character sprites and animations
 */
import type { CharacterState, AnimationSet } from '@/types';
import { gridToPixel } from '@/types';
import { getCachedImage } from '@/services/resourceLoader';

export interface CharacterRenderState extends CharacterState {
    spriteUrl: string;
    animationSet: AnimationSet;
}

export class CharacterRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private character: CharacterRenderState | null = null;
    private frameIndex = 0;
    private lastFrameTime = 0;
    private animationId: number | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get canvas context');
        }
        this.ctx = ctx;
    }

    setCharacter(character: CharacterRenderState): void {
        this.character = character;
    }

    startAnimation(): void {
        if (this.animationId) return;

        const animate = (timestamp: number) => {
            if (!this.character) {
                this.animationId = null;
                return;
            }

            const frameDuration = 150; // ms per frame
            if (timestamp - this.lastFrameTime >= frameDuration) {
                this.frameIndex = (this.frameIndex + 1) % this.character.animationSet.frames;
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

    render(): void {
        if (!this.character) return;

        const { ctx, canvas, character } = this;
        const image = getCachedImage(character.spriteUrl);

        if (!image) return;

        const pixel = gridToPixel(character.gridCoordinate, { width: 32, height: 32 });
        const frameWidth = image.width / character.animationSet.frames;
        const frameHeight = image.height / character.animationSet.directions;

        // Calculate source position based on direction and frame
        const srcX = this.frameIndex * frameWidth;
        const srcY = character.direction * frameHeight;

        // Clear previous character position
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw character sprite
        ctx.drawImage(
            image,
            srcX,
            srcY,
            frameWidth,
            frameHeight,
            pixel.x,
            pixel.y,
            frameWidth,
            frameHeight
        );
    }

    destroy(): void {
        this.stopAnimation();
    }
}

// Helper to load character sprite
export async function loadCharacterSprite(characterId: string, baseUrl: string): Promise<string> {
    const spriteId = `player-${characterId}`;
    const spriteUrl = `${baseUrl}/img/player/${spriteId}.png`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = spriteUrl;

    await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load character sprite: ${spriteUrl}`));
    });

    return spriteUrl;
}
