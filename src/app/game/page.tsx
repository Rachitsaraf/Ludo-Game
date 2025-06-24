import { GameClient } from '@/components/game/GameClient';

export default function GamePage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <GameClient />
        </div>
    );
}
