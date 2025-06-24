
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import type { LeaderboardEntry } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, RefreshCw, Share2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SortOption = 'score' | 'gamesWon' | 'gamesPlayed';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('score');
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    const leaderboardCollection = collection(db, 'leaderboard');
    const q = query(
      leaderboardCollection,
      orderBy(sortOption, 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
      });
      setLeaderboardData(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard: ", error);
      toast({
        title: "Error",
        description: "Could not fetch leaderboard data. Make sure you have configured Firebase in your .env file.",
        variant: "destructive",
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortOption, toast]);

  const handleRefresh = () => {
    // The onSnapshot listener already provides real-time updates.
    // This button can provide user feedback that they are viewing the latest data.
    setLoading(true);
    // A short delay to simulate a refresh action and show skeleton loaders
    setTimeout(() => {
        setLoading(false);
        toast({
          title: "Leaderboard Updated",
          description: "Showing the latest rankings.",
        });
    }, 500);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'LudoMath Leaderboard',
      text: 'Check out my rank on the LudoMath leaderboard!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(shareData.url);
        toast({
          title: 'Link Copied!',
          description: 'Leaderboard URL copied to your clipboard.',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
       toast({
          title: 'Error',
          description: 'Could not share the leaderboard.',
          variant: 'destructive'
        });
    }
  };
  
  const rankEmojis = ['🥇', '🥈', '🥉'];

  const getRankClass = (rank: number) => {
    if (rank === 0) return 'bg-yellow-400/30 dark:bg-yellow-600/30';
    if (rank === 1) return 'bg-gray-400/30 dark:bg-gray-500/30';
    if (rank === 2) return 'bg-orange-400/30 dark:bg-orange-700/30';
    return 'bg-transparent';
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-red-600 font-headline flex flex-col items-center p-4">
      <div className="absolute top-4 left-4 z-10">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/50 text-white hover:bg-white/70 hover:text-black transition-colors">
            <ArrowLeft className="h-6 w-6 sm:h-8 sm:w-8" />
          </Button>
        </Link>
      </div>
      
      <Card className="w-full max-w-2xl mt-16 mb-4 shadow-lg rounded-4xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-sm border-white/20">
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-3xl sm:text-4xl text-card-foreground flex items-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500"/>
                Leaderboard
            </CardTitle>
            <Select onValueChange={(value: SortOption) => setSortOption(value)} defaultValue={sortOption}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Sort by Score</SelectItem>
                <SelectItem value="gamesWon">Sort by Wins</SelectItem>
                <SelectItem value="gamesPlayed">Sort by Games</SelectItem>
              </SelectContent>
            </Select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">Wins</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">Games</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Avg Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                            <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-6 w-32" /></div></TableCell>
                            <TableCell><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                    ) : (
                        leaderboardData.map((player, index) => (
                            <TableRow key={player.id} className={cn('transition-colors', getRankClass(index))}>
                                <TableCell className="font-bold text-lg text-center w-[50px]">{rankEmojis[index] || index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Image src={player.avatarUrl || 'https://placehold.co/40x40.png'} alt={player.playerName} width={40} height={40} className="rounded-full" data-ai-hint="player avatar"/>
                                        <span className="font-medium">{player.playerName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-lg">{player.score}</TableCell>
                                <TableCell className="text-right hidden sm:table-cell">{player.gamesWon}</TableCell>
                                <TableCell className="text-right hidden sm:table-cell">{player.gamesPlayed}</TableCell>
                                <TableCell className="text-right hidden md:table-cell">{player.averageTime}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
         <CardFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
