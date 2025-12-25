/**
 * Player selector hook
 */
import { useGame } from './GameContext';

export function usePlayer() {
    const { state } = useGame();
    return state.player;
}
