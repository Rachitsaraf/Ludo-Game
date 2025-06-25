"use server";

import { db } from '@/lib/firebase';
import type { Player, LeaderboardEntry } from '@/lib/types';
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

// Function to calculate score. Wins are +100, losses are -10.
const calculateScore = (wins: number, played: number) => {
    return (wins * 100) + ((played - wins) * -10);
}

export async function updateLeaderboard(player: Player) {
  if (!db) {
    console.error("Firebase not configured, can't update leaderboard.");
    return { error: "Firebase not configured." };
  }
  
  // Use the player's color ID ('red', 'green', etc.) as the unique document ID.
  const playerDocRef = doc(db, 'leaderboard', player.id);
  
  try {
    const docSnap = await getDoc(playerDocRef);

    if (docSnap.exists()) {
      // If player exists, update their stats
      const currentData = docSnap.data() as LeaderboardEntry;
      const newGamesPlayed = currentData.gamesPlayed + 1;
      const newGamesWon = currentData.gamesWon + 1;
      
      await setDoc(playerDocRef, {
        ...currentData,
        gamesPlayed: newGamesPlayed,
        gamesWon: newGamesWon,
        score: calculateScore(newGamesWon, newGamesPlayed),
        lastUpdated: Timestamp.now(),
      }, { merge: true }); // Use merge to safely update
    } else {
      // If it's a new player, create their entry
      const newEntry: Omit<LeaderboardEntry, 'id'> = {
        playerName: player.name,
        avatarUrl: player.characterImage,
        gamesPlayed: 1,
        gamesWon: 1,
        score: calculateScore(1, 1),
        averageTime: '0s', // Placeholder for now
        lastUpdated: Timestamp.now(),
      };
      await setDoc(playerDocRef, newEntry);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating leaderboard: ", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred." };
  }
}
