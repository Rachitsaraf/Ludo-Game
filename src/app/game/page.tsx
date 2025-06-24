import { GameClient } from '@/components/game/GameClient';

export default function GamePage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 p-1">
            <GameClient />
        </div>
    );
}
