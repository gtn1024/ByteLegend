/**
 * Top Status Bar - Player info, coins, reputation, etc.
 */
import { usePlayer } from '@/context/usePlayer';
import { useOnlineCount } from '@/context/useOnlineCount';

export function TopBar() {
    const player = usePlayer();
    const onlineCount = useOnlineCount();

    return (
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900/90 px-4 py-2 text-white">
            {/* Left section - Player info */}
            <div className="flex items-center gap-4">
                {player && (
                    <>
                        {player.avatarUrl && (
                            <img
                                src={player.avatarUrl}
                                alt={player.nickname}
                                className="h-8 w-8 rounded-full"
                            />
                        )}
                        <span className="font-medium">{player.nickname || player.username}</span>
                    </>
                )}
            </div>

            {/* Center section - Stats */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-yellow-400">🪙</span>
                    <span>{player?.coin ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-blue-400">⭐</span>
                    <span>{player?.star ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-purple-400">💎</span>
                    <span>{player?.reputation ?? 0}</span>
                </div>
            </div>

            {/* Right section - Online count */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>🟢</span>
                <span>{onlineCount} online</span>
            </div>
        </div>
    );
}
