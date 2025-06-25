
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, Bot, X } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';

interface PlayerSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const selectionOptions = [
    { count: 1, label: '1 Player vs AI', icon: <div className="flex items-center gap-2"><User /><Bot /></div>, color: 'bg-green-500 hover:bg-green-600 border-green-700' },
    { count: 2, label: '2 Players', icon: <div className="flex items-center"><User /><User /></div>, color: 'bg-blue-500 hover:bg-blue-600 border-blue-700' },
    { count: 3, label: '3 Players', icon: <div className="flex items-center"><User /><User /><User /></div>, color: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-700' },
    { count: 4, label: '4 Players', icon: <Users />, color: 'bg-red-500 hover:bg-red-600 border-red-700' },
]

export const PlayerSelectionDialog = ({ isOpen, onClose }: PlayerSelectionDialogProps) => {
  const router = useRouter();
  const { playSound } = useSound();

  if (!isOpen) {
    return null;
  }

  const handlePlayerSelect = (count: number) => {
    playSound('click');
    router.push(`/select-color?humans=${count}`);
  };
  
  const handleClose = () => {
      playSound('click');
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <Card className="relative w-full max-w-md rounded-4xl shadow-2xl text-center bg-white/10 backdrop-blur-md border-2 border-white/20 animate-in zoom-in-95 duration-300">
        <Button variant="ghost" size="icon" onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/20 rounded-full z-10">
            <X className="h-6 w-6" />
        </Button>
        <CardHeader className="pt-8">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Users className="h-8 w-8" />
            Select a Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {selectionOptions.map(({ count, label, icon, color }) => (
            <button
              key={count}
              onClick={() => handlePlayerSelect(count)}
              className={`flex flex-col items-center justify-center gap-2 p-4 w-full h-32 text-white font-semibold rounded-2xl shadow-lg border-b-4 transform transition-all duration-150 ease-in-out hover:-translate-y-1 active:translate-y-0 active:border-b-2 active:brightness-90 ${color}`}
            >
              <div className="text-3xl [&>svg]:w-8 [&>svg]:h-8">{icon}</div>
              <span className="text-xl">{label}</span>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
