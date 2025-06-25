"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlayerSelectionDialog } from '@/components/game/PlayerSelectionDialog';
import { DevelopersDialog } from '@/components/DevelopersDialog';
import Link from 'next/link';
import { Settings, Info, Trophy, Users, Gamepad2, Star, Dice5 } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';
import { SplashScreen } from '@/components/SplashScreen';

// A component for decorative floating icons that gently bob and fade
const FloatingIcon = ({ icon: Icon, className, duration = 4, delay = 0 }: { icon: React.ElementType, className: string, duration?: number, delay?: number }) => {
    return (
        <div className={`absolute text-amber-400/10 animate-bounce-slow ${className}`} style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
            <Icon className="w-full h-full" />
        </div>
    );
};

export default function Home() {
  const [isPlayerSelectionOpen, setPlayerSelectionOpen] = useState(false);
  const [isDevelopersOpen, setDevelopersOpen] = useState(false);
  const { playSound } = useSound();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const handleOpenPlayerSelection = () => {
    playSound('click');
    setPlayerSelectionOpen(true);
  };
  
  const handleOpenDevelopers = () => {
    playSound('click');
    setDevelopersOpen(true);
  };

  // Base classes for the 3D-style buttons
  const buttonBaseClasses = "flex flex-col items-center justify-center gap-2 p-2 text-white font-semibold rounded-2xl shadow-lg border-b-4 transform transition-all duration-150 ease-in-out hover:-translate-y-1 active:translate-y-0 active:border-b-2 active:brightness-90";

  return (
    <>
      {showSplash ? <SplashScreen /> : (
        <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-950 font-headline flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in-0">
          {/* Background Decorative Icons */}
          <FloatingIcon icon={Dice5} className="w-16 h-16 top-[10%] left-[10%] rotate-12" duration={5} delay={0.5} />
          <FloatingIcon icon={Star} className="w-10 h-10 top-[20%] right-[8%] -rotate-12" duration={6} />
          <FloatingIcon icon={Gamepad2} className="w-12 h-12 bottom-[15%] left-[12%] rotate-6" duration={4} delay={1}/>
          <FloatingIcon icon={Trophy} className="w-11 h-11 bottom-[25%] right-[10%] -rotate-6" duration={5.5} delay={0.2} />
          <FloatingIcon icon={Dice5} className="w-8 h-8 top-[50%] right-[15%] rotate-10" duration={7} delay={0.8}/>
          <FloatingIcon icon={Star} className="w-9 h-9 bottom-[55%] left-[5%] -rotate-8" duration={8} delay={0.1}/>
          <FloatingIcon icon={Gamepad2} className="w-14 h-14 top-[5%] left-[30%]" duration={6.5} />
          
          <div className="z-10 flex flex-col items-center justify-center gap-8 w-full">
            <div className="flex flex-col items-center gap-4 mb-4">
              <h1 className="font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                <span
                  className="block text-7xl sm:text-8xl bg-gradient-to-b from-yellow-400 to-amber-500 bg-clip-text text-transparent opacity-0 animate-title-drop"
                  style={{ WebkitTextStroke: '2px #c2331a' }}
                >
                  Ludo
                </span>
                <span
                  className="block text-4xl sm:text-5xl bg-gradient-to-b from-yellow-300 to-amber-400 bg-clip-text text-transparent opacity-0 animate-pop-in"
                  style={{ WebkitTextStroke: '1px #c2331a', animationDelay: '200ms' }}
                >
                  Learn & Play
                </span>
              </h1>
            </div>

            <div className="flex flex-col items-center gap-6 w-full max-w-xs sm:max-w-sm">
              {/* Start Game button */}
              <div className="w-full px-4 sm:px-0 opacity-0 animate-pop-in" style={{ animationDelay: '400ms' }}>
                <button
                  className={`${buttonBaseClasses} w-full h-24 text-3xl bg-green-500 border-green-700 hover:bg-green-400`}
                  onClick={handleOpenPlayerSelection}
                >
                  <div className="flex items-center gap-4">
                    <Gamepad2 className="h-10 w-10 drop-shadow-md" />
                    <span>Start Game</span>
                  </div>
                </button>
              </div>
              
              {/* 2x2 Grid for other options */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full">
                <div className="opacity-0 animate-pop-in" style={{ animationDelay: '600ms' }}>
                  <Link href="/leaderboard" onClick={() => playSound('click')} className={`${buttonBaseClasses} w-full h-28 sm:h-32 text-xl bg-blue-500 border-blue-700 hover:bg-blue-400`}>
                      <Trophy className="h-10 w-10" />
                      <span>Leaderboard</span>
                  </Link>
                </div>

                <div className="opacity-0 animate-pop-in" style={{ animationDelay: '700ms' }}>
                  <Link href="/instructions" onClick={() => playSound('click')} className={`${buttonBaseClasses} w-full h-28 sm:h-32 text-xl text-black bg-yellow-400 border-yellow-600 hover:bg-yellow-300`}>
                      <Info className="h-10 w-10" />
                      <span>Instructions</span>
                  </Link>
                </div>

                <div className="opacity-0 animate-pop-in" style={{ animationDelay: '800ms' }}>
                    <Link href="/settings" onClick={() => playSound('click')} className={`${buttonBaseClasses} w-full h-28 sm:h-32 text-xl bg-red-500 border-red-700 hover:bg-red-400`}>
                        <Settings className="h-10 w-10" />
                        <span>Settings</span>
                    </Link>
                </div>

                <div className="opacity-0 animate-pop-in" style={{ animationDelay: '900ms' }}>
                    <button
                      className={`${buttonBaseClasses} w-full h-28 sm:h-32 text-xl bg-pink-500 border-pink-700 hover:bg-pink-400`}
                      onClick={handleOpenDevelopers}
                    >
                      <Users className="h-10 w-10" />
                      <span>Developers</span>
                    </button>
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
      )}
    </>
  );
}
