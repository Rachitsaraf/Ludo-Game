
"use client";

import Image from 'next/image';
import { Dice5, Gamepad2, Star, Trophy } from 'lucide-react';

const FloatingIcon = ({ icon: Icon, className, duration = 4, delay = 0 }: { icon: React.ElementType, className: string, duration?: number, delay?: number }) => {
    return (
        <div className={`absolute text-amber-400/10 animate-bounce-slow ${className}`} style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
            <Icon className="w-full h-full" />
        </div>
    );
};

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between py-16 bg-gradient-to-b from-purple-900 to-indigo-950 font-headline text-white animate-in fade-in-0 duration-500">
      {/* Background Decorative Icons */}
      <FloatingIcon icon={Dice5} className="w-16 h-16 top-[10%] left-[10%] rotate-12" duration={5} delay={0.5} />
      <FloatingIcon icon={Star} className="w-10 h-10 top-[20%] right-[8%] -rotate-12" duration={6} />
      <FloatingIcon icon={Gamepad2} className="w-12 h-12 bottom-[15%] left-[12%] rotate-6" duration={4} delay={1}/>
      <FloatingIcon icon={Trophy} className="w-11 h-11 bottom-[25%] right-[10%] -rotate-6" duration={5.5} delay={0.2} />
      <FloatingIcon icon={Dice5} className="w-8 h-8 top-[50%] right-[15%] rotate-10" duration={7} delay={0.8}/>
      <FloatingIcon icon={Star} className="w-9 h-9 bottom-[55%] left-[5%] -rotate-8" duration={8} delay={0.1}/>
      <FloatingIcon icon={Gamepad2} className="w-14 h-14 top-[5%] left-[30%]" duration={6.5} />
      
      {/* Top section with logo */}
      <div className="animate-pop-in" style={{animationDelay: '200ms'}}>
        <Image 
          src="https://placehold.co/150x150.png"
          alt="Company Logo"
          width={150}
          height={150}
          className="rounded-full shadow-2xl shadow-black/50"
          data-ai-hint="game studio logo"
        />
      </div>

      {/* Middle section with title */}
      <div className="flex flex-col items-center justify-center text-center">
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

      {/* Bottom section with loader */}
      <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-loading-bar"></div>
      </div>
    </div>
  );
};
