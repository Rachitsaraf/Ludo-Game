
"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, RefreshCw, User, Music, Paintbrush, Settings, Star, Vibrate } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useSound } from '@/hooks/use-sound';

const FloatingIcon = ({ icon: Icon, className, duration = 10, delay = 0 }: { icon: React.ElementType, className: string, duration?: number, delay?: number }) => {
    return (
        <div className={`absolute text-amber-400/10 animate-bounce-slow ${className}`} style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
            <Icon className="w-full h-full" />
        </div>
    );
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { isMuted, toggleMute } = useSound();
  
  const [playerName, setPlayerName] = useState("Player 1");
  const [isVibrationOn, setIsVibrationOn] = useState(true);
  
  useEffect(() => {
    const savedName = localStorage.getItem('ludoPlayerName');
    if (savedName) {
      setPlayerName(savedName);
    }
    const savedVibration = localStorage.getItem('ludoVibrationOn');
    if (savedVibration !== null) {
      setIsVibrationOn(JSON.parse(savedVibration));
    } else {
        // Default to true if not set
        setIsVibrationOn(true);
    }
  }, []);

  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setPlayerName(newName);
    localStorage.setItem('ludoPlayerName', newName);
  };
  
  const toggleVibration = () => {
    const newState = !isVibrationOn;
    setIsVibrationOn(newState);
    localStorage.setItem('ludoVibrationOn', JSON.stringify(newState));
    if (newState && typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(200);
    }
  };

  const handleReset = () => {
    const isConfirmed = window.confirm('Are you sure you want to reset all data? This cannot be undone.');
    if (isConfirmed) {
      localStorage.clear();
      toast({
        title: "Data Reset",
        description: "All application data has been cleared.",
      });
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-950 font-headline flex flex-col items-center justify-center p-4">
      <FloatingIcon icon={Settings} className="w-16 h-16 top-[15%] left-[10%] rotate-12" duration={8} />
      <FloatingIcon icon={Music} className="w-12 h-12 top-[70%] left-[20%] -rotate-12" duration={12} delay={1} />
      <FloatingIcon icon={User} className="w-14 h-14 top-[20%] right-[15%] rotate-6" duration={10} delay={0.5} />
      <FloatingIcon icon={Star} className="w-10 h-10 bottom-[10%] right-[12%] -rotate-10" duration={9} delay={1.8} />
      <FloatingIcon icon={Paintbrush} className="w-11 h-11 bottom-[20%] left-[8%] rotate-8" duration={14} delay={0.2} />
      
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 text-white hover:bg-white/70 hover:text-black">
            <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-lg rounded-4xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 z-10">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl text-center text-card-foreground">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
           <div className="space-y-2 p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="player-name" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                Player Name
            </Label>
            <Input
              id="player-name"
              type="text"
              value={playerName}
              onChange={handlePlayerNameChange}
              placeholder="Enter your name"
              className="text-lg bg-white dark:bg-slate-700"
            />
          </div>
          
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="sound-music" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <Music className="h-5 w-5 sm:h-6 sm:w-6" />
              Sound & Music
            </Label>
            <Switch id="sound-music" checked={!isMuted} onCheckedChange={toggleMute} />
          </div>

          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="vibration" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <Vibrate className="h-5 w-5 sm:h-6 sm:w-6" />
              Vibration (Mobile)
            </Label>
            <Switch id="vibration" checked={isVibrationOn} onCheckedChange={toggleVibration} />
          </div>
          
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="dark-mode" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <Paintbrush className="h-5 w-5 sm:h-6 sm:w-6" />
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
          </div>

          <Button
            variant="destructive"
            className="w-full h-12 sm:h-14 text-lg sm:text-xl rounded-2xl"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            Reset All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
