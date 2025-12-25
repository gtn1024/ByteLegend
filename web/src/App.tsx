/**
 * Main App Component - Game entry point
 */
import type { GameInitData } from '@/types';
import { GamePage } from '@/pages';

// Mock init data - in production this comes from the server via window.gameInitData
const mockInitData: GameInitData = {
    initMapId: 'JavaIsland',
    onlineCount: 42,
    rrbd: '/rrbd',
    enjoyProgrammingText: 'Enjoy Programming!',
    player: {
        id: 'test-player',
        username: 'TestPlayer',
        nickname: 'Test Player',
        map: 'JavaIsland',
        x: 10,
        y: 10,
        characterId: 'default',
        server: 1,
        star: 100,
        avatarUrl: null,
        coin: 500,
        reputation: 50,
        items: [],
        usedItems: [],
        achievements: [],
        states: {},
        locale: 'en',
        online: true,
        createdAt: new Date().toISOString(),
        lastLogInAt: new Date().toISOString(),
    },
    maps: [
        {
            id: 'JavaIsland',
            frames: 1,
            children: [
                { id: 'NewbieVillage', frames: 1, children: [], roadmap: true },
                { id: 'JavaIslandSeniorJavaCastle', frames: 1, children: [], roadmap: true },
            ],
            roadmap: true,
        },
        { id: 'KotlinIsland', frames: 1, children: [], roadmap: true },
        { id: 'GitIsland', frames: 1, children: [], roadmap: true },
    ],
    localizedTexts: [],
    joinQQGroupSecret: '',
    resolve(path: string) {
        return `${this.rrbd}${path}`;
    },
};

function App() {
    // In production, get init data from window
    const initData =
        (window as unknown as { gameInitData?: GameInitData }).gameInitData ?? mockInitData;

    return <GamePage initData={initData} />;
}

export default App;
