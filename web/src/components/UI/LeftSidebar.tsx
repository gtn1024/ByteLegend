/**
 * Left Sidebar - Menu buttons and navigation
 */
interface LeftSidebarProps {
    onMenuClick: (menu: string) => void;
}

export function LeftSidebar({ onMenuClick }: LeftSidebarProps) {
    const menuItems = [
        { id: 'menu', icon: '☰', label: 'Menu' },
        { id: 'achievements', icon: '🏆', label: 'Achievements' },
        { id: 'items', icon: '🎒', label: 'Items' },
        { id: 'leaderboard', icon: '📊', label: 'Leaderboard' },
        { id: 'credits', icon: '🙏', label: 'Credits' },
    ];

    return (
        <div className="flex flex-col gap-2 border-r border-gray-700 bg-gray-900/90 p-2">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    className="rounded p-2 text-2xl text-white transition-colors hover:bg-gray-700"
                    title={item.label}
                    onClick={() => onMenuClick(item.id)}
                >
                    {item.icon}
                </button>
            ))}
        </div>
    );
}
