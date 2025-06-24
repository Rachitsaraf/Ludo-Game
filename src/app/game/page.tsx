import { GameClient } from '@/components/game/GameClient';

export default function GamePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const playerCountStr = searchParams?.players as string | undefined;
  let playerCount = playerCountStr ? parseInt(playerCountStr, 10) : 4;

  if (isNaN(playerCount) || playerCount < 2 || playerCount > 4) {
    playerCount = 4;
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 p-1">
          <GameClient playerCount={playerCount} />
      </div>
  );
}
