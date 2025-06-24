"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayerSelectionDialog } from '@/components/game/PlayerSelectionDialog';
import { DevelopersDialog } from '@/components/DevelopersDialog';
import Link from 'next/link';
import { Settings, Info, Trophy, Users } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';

export default function Home() {
  const [isPlayerSelectionOpen, setPlayerSelectionOpen] = useState(false);
  const [isDevelopersOpen, setDevelopersOpen] = useState(false);
  const { playSound } = useSound();

  const handleOpenPlayerSelection = () => {
    playSound('click');
    setPlayerSelectionOpen(true);
  };
  
  const handleOpenDevelopers = () => {
    playSound('click');
    setDevelopersOpen(true);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 font-headline flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="absolute inset-0 z-0">
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-8 flex-grow">
        <div className="flex flex-col items-center gap-4">
          <h1 className="font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            <span
              className="block text-7xl sm:text-8xl bg-gradient-to-b from-yellow-400 to-amber-500 bg-clip-text text-transparent"
              style={{ WebkitTextStroke: '2px #c2331a' }}
            >
              Ludo
            </span>
            <span
              className="block text-4xl sm:text-5xl bg-gradient-to-b from-yellow-300 to-amber-400 bg-clip-text text-transparent"
              style={{ WebkitTextStroke: '1px #c2331a' }}
            >
              Learn & Play
            </span>
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full h-16 text-2xl rounded-2xl shadow-2xl bg-purple-600 hover:bg-purple-700 border-2 border-purple-400/50 transform hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={handleOpenPlayerSelection}
          >
            Start Game
          </Button>
          <Link href="/leaderboard" passHref className="w-full" onClick={() => playSound('click')}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full h-16 text-2xl rounded-2xl shadow-xl bg-green-500 hover:bg-green-600 text-black border-2 border-green-300/50 transform hover:scale-105 transition-transform duration-200"
            >
              <div>
                <Trophy className="mr-2" />
                Leaderboard
              </div>
            </Button>
          </Link>
          <Link href="/instructions" passHref className="w-full" onClick={() => playSound('click')}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full h-16 text-2xl rounded-2xl shadow-xl bg-yellow-500 hover:bg-yellow-600 text-black border-2 border-yellow-300/50 transform hover:scale-105 transition-transform duration-200"
            >
              <div>
                <Info className="mr-2" />
                Instructions
              </div>
            </Button>
          </Link>
          <Link href="/settings" passHref className="w-full" onClick={() => playSound('click')}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full h-16 text-2xl rounded-2xl shadow-xl bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-400/50 transform hover:scale-105 transition-transform duration-200"
            >
              <div>
                <Settings className="mr-2" />
                Settings
              </div>
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-16 text-2xl rounded-2xl shadow-xl bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-300/50 transform hover:scale-105 transition-transform duration-200"
            onClick={handleOpenDevelopers}
          >
            <Users className="mr-2" />
            Developers
          </Button>
        </div>
      </div>
      
      <PlayerSelectionDialog 
        isOpen={isPlayerSelectionOpen} 
        onClose={() => setPlayerSelectionOpen(false)} 
      />
      <DevelopersDialog
        isOpen={isDevelopersOpen}
        onClose={() => setDevelopersOpen(false)}
      />
    </main>
  );
}
