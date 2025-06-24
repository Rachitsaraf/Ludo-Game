'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlayerColor } from '@/lib/types';
import { CheckCircle, Circle, Palette } from 'lucide-react';

const colorOptions: { id: PlayerColor; hex: string; name: string }[] = [
  { id: 'red',    hex: '#f87171', name: 'Red' },
  { id: 'green',  hex: '#4ade80', name: 'Green' },
  { id: 'blue',   hex: '#60a5fa', name: 'Blue' },
  { id: 'yellow', hex: '#facc15', name: 'Yellow' },
];

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
        return `Select ${remaining} more color${remaining > 1 ? 's' : ''}`;
    }
    return 'All colors selected!';
  }, [humanPlayerCount, selectedColors]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 font-headline flex flex-col items-center justify-center p-6 text-center text-white">
      <Card className="w-full max-w-md rounded-4xl shadow-2xl text-center bg-white/10 backdrop-blur-md border-2 border-white/20">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Palette className="h-8 w-8" />
            Select Player Colors
          </CardTitle>
          <p className="text-white/80 pt-2">{selectionPrompt}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 p-6">
          {colorOptions.map(({ id, hex, name }) => {
            const isSelected = selectedColors.includes(id);
            return (
              <button
                key={id}
                onClick={() => handleColorSelect(id)}
                className={`relative flex items-center justify-center w-full h-24 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out border-4 ${isSelected ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: hex }}
              >
                <span className="text-2xl font-bold text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>{name}</span>
                <div className="absolute top-2 right-2 bg-white/30 rounded-full">
                    {isSelected ? <CheckCircle className="h-6 w-6 text-white" /> : <Circle className="h-6 w-6 text-white/50" />}
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
        className="mt-6 w-full max-w-md h-16 text-2xl rounded-2xl shadow-2xl bg-purple-600 hover:bg-purple-700 border-2 border-purple-400/50 transform hover:scale-105 transition-transform duration-300 ease-in-out disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Game
      </Button>
    </div>
  );
}
