/**
 * Current map selector hook
 */
import { useGame } from './GameContext';

export function useCurrentMap() {
    const { state } = useGame();
    return state.currentMap;
}
