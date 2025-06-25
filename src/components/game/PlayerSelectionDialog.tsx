"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useSound } from '@/hooks/use-sound';

interface PlayerSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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
      <Card className="w-full max-w-sm rounded-4xl shadow-2xl text-center bg-white/10 backdrop-blur-md border-2 border-white/20 animate-in zoom-in-95 duration-300">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-3">
            <Users className="h-8 w-8" />
            How many players?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          {[2, 3, 4].map((count) => (
            <Button
              key={count}
              onClick={() => handlePlayerSelect(count)}
              size="lg"
              className="w-full h-16 text-2xl rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out bg-purple-600 hover:bg-purple-700 border-2 border-purple-400/50"
            >
              {count} {count === 1 ? 'Player' : 'Players'}
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={handleClose}
            className="mt-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
