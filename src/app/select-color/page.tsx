
'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlayerColor } from '@/lib/types';
import { CheckCircle, Circle, Palette, Users, Gamepad2, Star } from 'lucide-react';
import { CHARACTER_DATA, CHARACTER_HINTS } from '@/lib/characters';
import Image from 'next/image';

const colorOptions: { id: PlayerColor; hex: string; name: string; image: string; hint: string }[] = [
  { id: 'red',    hex: '#ef4444', name: CHARACTER_DATA.red.name, image: CHARACTER_DATA.red.image, hint: CHARACTER_HINTS.red },
  { id: 'green',  hex: '#22c55e', name: CHARACTER_DATA.green.name, image: CHARACTER_DATA.green.image, hint: CHARACTER_HINTS.green },
  { id: 'blue',   hex: '#3b82f6', name: CHARACTER_DATA.blue.name, image: CHARACTER_DATA.blue.image, hint: CHARACTER_HINTS.blue },
  { id: 'yellow', hex: '#eab308', name: CHARACTER_DATA.yellow.name, image: CHARACTER_DATA.yellow.image, hint: CHARACTER_HINTS.yellow },
];

const FloatingIcon = ({ icon: Icon, className, duration = 10, delay = 0 }: { icon: React.ElementType, className: string, duration?: number, delay?: number }) => {
    return (
        <div className={`absolute text-amber-400/10 animate-bounce-slow ${className}`} style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
            <Icon className="w-full h-full" />
        </div>
    );
};

export default function SelectColorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const humanPlayerCount = parseInt(searchParams.get('humans') || '2', 10);

  const [selectedColors, setSelectedColors] = useState<PlayerColor[]>([]);

  const handleColorSelect = (color: PlayerColor) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      }
      if (prev.length < humanPlayerCount) {
        return [...prev, color];
      }
      return prev;
    });
  };

  const handleStartGame = () => {
    if (selectedColors.length !== humanPlayerCount) return;
    
    const humanColorsStr = selectedColors.join(',');
    router.push(`/game?humanColors=${humanColorsStr}`);
  };

  const selectionPrompt = useMemo(() => {
    if (selectedColors.length < humanPlayerCount) {
        const remaining = humanPlayerCount - selectedColors.length;
        return `Select ${remaining} more character${remaining > 1 ? 's' : ''}`;
    }
    return 'All characters selected!';
  }, [humanPlayerCount, selectedColors]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-950 font-headline flex flex-col items-center justify-center p-6 text-center text-white">
      <FloatingIcon icon={Palette} className="w-16 h-16 top-[15%] left-[10%] rotate-12" duration={8} />
      <FloatingIcon icon={Users} className="w-12 h-12 top-[70%] left-[20%] -rotate-12" duration={12} delay={1} />
      <FloatingIcon icon={Gamepad2} className="w-14 h-14 top-[20%] right-[15%] rotate-6" duration={10} delay={0.5} />
      <FloatingIcon icon={Star} className="w-10 h-10 bottom-[10%] right-[12%] -rotate-10" duration={9} delay={1.8} />
      <FloatingIcon icon={Palette} className="w-11 h-11 bottom-[20%] left-[8%] rotate-8" duration={14} delay={0.2} />

      <Card className="w-full max-w-lg rounded-4xl shadow-2xl text-center bg-white/10 backdrop-blur-md border-2 border-white/20 z-10">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Palette className="h-8 w-8" />
            Select Your Character
          </CardTitle>
          <p className="text-white/80 pt-2">{selectionPrompt}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          {colorOptions.map(({ id, hex, name, image, hint }) => {
            const isSelected = selectedColors.includes(id);
            return (
              <button
                key={id}
                onClick={() => handleColorSelect(id)}
                className={`group relative flex flex-col items-center justify-center p-4 w-full h-40 rounded-2xl shadow-lg transform transition-all duration-300 ease-in-out
                  ${isSelected ? 'ring-4 ring-white scale-105 shadow-2xl' : 'hover:scale-105'}`}
                style={{ backgroundColor: hex }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl z-0"></div>
                <Image src={image} alt={name} width={80} height={80} className="rounded-full object-cover mb-2 border-2 border-white/75 shadow-md z-10" data-ai-hint={hint} />
                <span className="text-xl font-bold text-white z-10" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>{name}</span>
                <div className="absolute top-3 right-3 bg-white/30 rounded-full p-0.5 z-20">
                    {isSelected ? <CheckCircle className="h-7 w-7 text-white" /> : <Circle className="h-7 w-7 text-white/40" />}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
      <Button
        onClick={handleStartGame}
        disabled={selectedColors.length !== humanPlayerCount}
        size="lg"
        className="mt-6 w-full max-w-lg h-16 text-2xl rounded-2xl shadow-2xl bg-purple-600 hover:bg-purple-700 border-2 border-purple-400/50 transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        Start Game
      </Button>
    </div>
  );
}
