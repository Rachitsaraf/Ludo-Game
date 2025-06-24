
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayerSelectionDialog } from '@/components/game/PlayerSelectionDialog';
import { DevelopersDialog } from '@/components/DevelopersDialog';
import Link from 'next/link';
import { Settings, Info, Trophy, Users, Gamepad2 } from 'lucide-react';
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
        {/* Background animations or images can be placed here */}
      </div>

      <div className="z-10 flex flex-col items-center justify-center gap-8 w-full">
        <div className="flex flex-col items-center gap-4 mb-4 animate-in fade-in-0 zoom-in-95 duration-500">
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

        <div className="flex flex-col items-center gap-6 w-full max-w-sm sm:max-w-md">
          {/* Start Game button - centered and larger */}
          <div className="w-full px-4 sm:px-0 animate-in fade-in-0 zoom-in-90 delay-100 duration-500">
            <Button
              size="lg"
              className="w-full h-20 text-3xl rounded-3xl shadow-2xl bg-purple-600 hover:bg-purple-700 border-4 border-purple-400/50 transform hover:scale-105 transition-transform duration-300 ease-in-out flex items-center justify-center gap-4"
              onClick={handleOpenPlayerSelection}
            >
              <Gamepad2 className="h-8 w-8" />
              Start Game
            </Button>
          </div>
          
          {/* 2x2 Grid for other options */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
            
            <div className="animate-in slide-in-from-left-20 duration-700 ease-out delay-200">
              <Button asChild size="lg" variant="outline" className="w-full h-28 sm:h-32 text-xl rounded-2xl shadow-xl bg-green-500/80 hover:bg-green-600/80 text-white border-2 border-green-300/50 transform hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-sm">
                <Link href="/leaderboard" onClick={() => playSound('click')}>
                    <Trophy className="h-8 w-8" />
                    <span className="font-semibold">Leaderboard</span>
                </Link>
              </Button>
            </div>

            <div className="animate-in slide-in-from-right-20 duration-700 ease-out delay-200">
              <Button asChild size="lg" variant="outline" className="w-full h-28 sm:h-32 text-xl rounded-2xl shadow-xl bg-yellow-500/80 hover:bg-yellow-600/80 text-black border-2 border-yellow-300/50 transform hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-sm">
                <Link href="/instructions" onClick={() => playSound('click')}>
                    <Info className="h-8 w-8" />
                    <span className="font-semibold">Instructions</span>
                </Link>
              </Button>
            </div>

            <div className="animate-in slide-in-from-left-20 duration-700 ease-out delay-300">
                <Button asChild size="lg" variant="outline" className="w-full h-28 sm:h-32 text-xl rounded-2xl shadow-xl bg-blue-600/80 hover:bg-blue-700/80 text-white border-2 border-blue-400/50 transform hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-sm">
                    <Link href="/settings" onClick={() => playSound('click')}>
                        <Settings className="h-8 w-8" />
                        <span className="font-semibold">Settings</span>
                    </Link>
                </Button>
            </div>

            <div className="animate-in slide-in-from-right-20 duration-700 ease-out delay-300">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-28 sm:h-32 text-xl rounded-2xl shadow-xl bg-pink-500/80 hover:bg-pink-600/80 text-white border-2 border-pink-300/50 transform hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-sm"
                  onClick={handleOpenDevelopers}
                >
                  <Users className="h-8 w-8" />
                  <span className="font-semibold">Developers</span>
                </Button>
            </div>
          </div>
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
