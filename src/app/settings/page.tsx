
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, RefreshCw, User, Music, Settings, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useSound } from '@/hooks/use-sound';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const FloatingIcon = ({ icon: Icon, className, duration = 10, delay = 0 }: { icon: React.ElementType, className: string, duration?: number, delay?: number }) => {
    return (
        <div className={`absolute text-amber-400/10 animate-bounce-slow ${className}`} style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
            <Icon className="w-full h-full" />
        </div>
    );
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { isMuted, toggleMute } = useSound();
  
  const [playerName, setPlayerName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get or create a unique user ID from localStorage. This ID will be the document ID in Firestore.
  useEffect(() => {
    let storedUserId = localStorage.getItem('ludoUserId');
    if (!storedUserId) {
      // A simple way to generate a pseudo-unique ID for guest users.
      // This will serve as the document ID in the 'leaderboard' collection.
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('ludoUserId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Fetch player data from Firestore when userId is available
  useEffect(() => {
    // If firebase isn't configured, fall back to localStorage.
    if (!db) {
        const storedName = localStorage.getItem('ludoPlayerName') || 'Player 1';
        setPlayerName(storedName);
        setLoading(false);
        return;
    }
      
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      const playerDocRef = doc(db, 'leaderboard', userId);
      try {
        const docSnap = await getDoc(playerDocRef);
        if (docSnap.exists()) {
          setPlayerName(docSnap.data().playerName || 'Player 1');
        } else {
          // If the document doesn't exist, create it with default data.
          const newPlayerData = {
            playerName: 'Player 1',
            gamesPlayed: 0,
            gamesWon: 0,
            averageTime: 'N/A',
            score: 0,
            avatarUrl: `https://placehold.co/40x40.png`,
            lastUpdated: Timestamp.now(),
          };
          await setDoc(playerDocRef, newPlayerData);
          setPlayerName(newPlayerData.playerName);
        }
      } catch (error) {
        console.error("Error fetching player data:", error);
        toast({ title: "Error", description: "Could not load player data.", variant: "destructive" });
        setPlayerName('Player 1'); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, toast]);
  
  const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setPlayerName(newName);
    // If firebase isn't configured, save to localStorage as a fallback.
    if (!db) {
      localStorage.setItem('ludoPlayerName', newName);
    }
  };

  const handleSavePlayerNameOnBlur = async () => {
    // Do not save if Firebase is not configured.
    if (!userId || !db) {
      return;
    }
    
    if (!playerName.trim()) {
        toast({ title: "Invalid Name", description: "Player name cannot be empty.", variant: "destructive" });
        return;
    }

    const playerDocRef = doc(db, 'leaderboard', userId);
    try {
      await setDoc(playerDocRef, { playerName: playerName.trim(), lastUpdated: Timestamp.now() }, { merge: true });
      toast({
        title: "Name Saved!",
        description: `Your name has been updated.`,
      });
    } catch (error) {
      console.error("Error updating player name:", error);
      toast({ title: "Error", description: "Could not save your name. Please try again.", variant: "destructive" });
    }
  };

  const handleReset = () => {
    const isConfirmed = window.confirm('Are you sure you want to reset your player profile? This will create a new player ID and cannot be undone.');
    if (isConfirmed) {
      localStorage.removeItem('ludoUserId');
      localStorage.removeItem('ludoGameState');
      localStorage.removeItem('ludoPlayerName');
      window.location.reload();
    }
  };
  
  // Render a loading state until we have a userId and have attempted to load data.
  const isReady = !!userId;

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
            {!isReady || loading ? (
                <Skeleton className="h-10 w-full" />
            ) : (
                <Input
                  id="player-name"
                  type="text"
                  value={playerName}
                  onChange={handlePlayerNameChange}
                  onBlur={handleSavePlayerNameOnBlur}
                  placeholder="Enter your name"
                  className="text-lg bg-white dark:bg-slate-700"
                  disabled={!db}
                />
            )}
            {!db && <p className="text-xs text-muted-foreground pt-1">Player name is stored on this device only.</p>}
          </div>
          
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-primary/20">
            <Label htmlFor="sound-music" className="text-lg sm:text-xl flex items-center gap-2 text-card-foreground">
              <Music className="h-5 w-5 sm:h-6 sm:w-6" />
              Sound/Music
            </Label>
            <Switch id="sound-music" checked={!isMuted} onCheckedChange={toggleMute} />
          </div>
          
          <Button
            variant="destructive"
            className="w-full h-12 sm:h-14 text-lg sm:text-xl rounded-2xl"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
            Reset & New Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
