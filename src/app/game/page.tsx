import { GameClient } from '@/components/game/GameClient';
import type { PlayerColor } from '@/lib/types';

export default function GamePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const humanColorsParam = searchParams?.humanColors as string | undefined;
  
  // Default to 2 players (red, green) if no params are passed for direct access/testing
  const humanColors = humanColorsParam 
    ? humanColorsParam.split(',') as PlayerColor[]
    : ['red', 'green'] as PlayerColor[];

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 p-1">
          <GameClient humanColors={humanColors} />
      </div>
  );
}
