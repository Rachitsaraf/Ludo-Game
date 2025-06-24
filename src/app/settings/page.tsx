"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, RefreshCw, User, Paintbrush } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState("Player 1");

  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem('ludoPlayerName');
    if (storedName) {
      setPlayerName(storedName);
    }
    const soundSetting = localStorage.getItem('ludoSoundEnabled');
    setIsSoundEnabled(soundSetting ? JSON.parse(soundSetting) : true);
  }, []);

  const handleReset = () => {
    const isConfirmed = window.confirm('Are you sure you want to reset all game data? This cannot be undone.');
    if (isConfirmed) {
      localStorage.removeItem('ludoGameState');
      localStorage.removeItem('ludoPlayerName');
      setPlayerName("Player 1");
      toast({
        title: "Game Data Reset",
        description: "All saved progress has been cleared.",
      });
    }
  };
  
  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setPlayerName(newName);
    localStorage.setItem('ludoPlayerName', newName);
  };

  const handleSoundToggle = (checked: boolean) => {
    setIsSoundEnabled(checked);
    localStorage.setItem('ludoSoundEnabled', JSON.stringify(checked));
  };

  if (!isMounted) {
    return null; 
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 font-headline flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 text-white hover:bg-white/70 hover:text-black">
            <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-lg rounded-4xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl text-center text-card-foreground">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="player-name-toggle" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
              Change Player Name
            </Label>
            <Switch id="player-name-toggle" checked={showNameInput} onCheckedChange={setShowNameInput} />
          </div>
          {showNameInput && (
            <div className="pl-4 pr-4 pb-2 animate-accordion-down">
              <Input
                type="text"
                value={playerName}
                onChange={handlePlayerNameChange}
                placeholder="Enter player name"
                className="text-lg bg-white dark:bg-slate-700"
              />
            </div>
          )}
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="theme-mode" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <Paintbrush className="h-5 w-5 sm:h-6 sm:w-6" />
              Dark Mode
            </Label>
            <Switch id="theme-mode" checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
          </div>
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="sound-music" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              🎵 Sound/Music
            </Label>
            <Switch id="sound-music" checked={isSoundEnabled} onCheckedChange={handleSoundToggle} />
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
