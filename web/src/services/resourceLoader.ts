/**
 * Resource Loader - Async image and audio loading
 */

export interface Resource {
    id: string;
    url: string;
    loaded: boolean;
}

interface ImageResource extends Resource {
    image: HTMLImageElement | null;
}

interface AudioResource extends Resource {
    audio: HTMLAudioElement | null;
}

// Cache for loaded resources
const imageCache = new Map<string, ImageResource>();
const audioCache = new Map<string, AudioResource>();

// Preload functions
export function preloadImage(id: string, url: string): Promise<HTMLImageElement> {
    const cached = imageCache.get(id);
    if (cached?.loaded && cached.image) {
        return Promise.resolve(cached.image);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            imageCache.set(id, { id, url, loaded: true, image: img });
            resolve(img);
        };

        img.onerror = () => {
            imageCache.set(id, { id, url, loaded: false, image: null });
            reject(new Error(`Failed to load image: ${url}`));
        };

        img.src = url;
    });
}

export function preloadAudio(id: string, url: string): Promise<HTMLAudioElement> {
    const cached = audioCache.get(id);
    if (cached?.loaded && cached.audio) {
        return Promise.resolve(cached.audio);
    }

    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';

        audio.oncanplaythrough = () => {
            audioCache.set(id, { id, url, loaded: true, audio });
            resolve(audio);
        };

        audio.onerror = () => {
            audioCache.set(id, { id, url, loaded: false, audio: null });
            reject(new Error(`Failed to load audio: ${url}`));
        };

        audio.src = url;
        audio.load();
    });
}

// Batch loading
export async function loadImages(
    resources: Array<{ id: string; url: string }>,
    onProgress?: (loaded: number, total: number) => void
): Promise<Map<string, HTMLImageElement>> {
    const results = new Map<string, HTMLImageElement>();
    let loaded = 0;

    await Promise.all(
        resources.map(async ({ id, url }) => {
            try {
                const img = await preloadImage(id, url);
                results.set(id, img);
            } catch (error) {
                console.error(`Failed to load image ${id}:`, error);
            }
            loaded++;
            onProgress?.(loaded, resources.length);
        })
    );

    return results;
}

// Get cached resource
export function getCachedImage(id: string): HTMLImageElement | null {
    return imageCache.get(id)?.image ?? null;
}

export function getCachedAudio(id: string): HTMLAudioElement | null {
    return audioCache.get(id)?.audio ?? null;
}

// Clear cache
export function clearResourceCache(): void {
    imageCache.clear();
    audioCache.clear();
}
