/**
 * Online count selector hook
 */
import { useGame } from './GameContext';

export function useOnlineCount() {
    const { state } = useGame();
    return state.onlineCount;
}
