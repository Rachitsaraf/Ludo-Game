import { GameClient } from '@/components/game/GameClient';
import type { PlayerColor } from '@/lib/types';

export default function GamePage({
  searchParams: searchParamsPromise,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  // Await searchParams if it's a Promise
  const humanColorsParam = searchParamsPromise && 'then' in searchParamsPromise ? (searchParamsPromise as any).humanColors as string | undefined : (searchParamsPromise as any)?.humanColors as string | undefined;
  
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
