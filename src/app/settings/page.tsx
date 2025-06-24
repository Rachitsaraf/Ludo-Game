"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, RefreshCw, User, Paintbrush } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleReset = () => {
    const isConfirmed = window.confirm('Are you sure you want to reset all game data? This cannot be undone.');
    if (isConfirmed) {
      localStorage.removeItem('ludoGameState');
      toast({
        title: "Game Data Reset",
        description: "All saved progress has been cleared.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 font-headline flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 text-white hover:bg-white/70 hover:text-black">
            <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-lg rounded-4xl bg-white/90 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl text-center text-card-foreground">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20 opacity-50">
            <Label htmlFor="player-name" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
              Change Player Name
            </Label>
            <Switch id="player-name" disabled />
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20 opacity-50">
            <Label htmlFor="theme-mode" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <Paintbrush className="h-5 w-5 sm:h-6 sm:w-6" />
              Theme Mode
            </Label>
            <Switch id="theme-mode" disabled />
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="sound-music" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              🎵 Sound/Music
            </Label>
            <Switch id="sound-music" defaultChecked />
          </div>
          <Button
            variant="destructive"
            className="w-full h-12 sm:h-14 text-lg sm:text-xl rounded-2xl"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            Reset Game Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
