/**
 * Camera selector hook
 */
import { useGame } from './GameContext';

export function useCamera() {
    const { state } = useGame();
    return state.camera;
}
