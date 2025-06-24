'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSound } from '@/hooks/use-sound';

// Define which pages should have background music
const musicPages = ['/', '/game', '/select-color', '/instructions', '/leaderboard', '/settings'];

export function BackgroundMusicManager() {
  const pathname = usePathname();
  const { playBackgroundMusic, stopBackgroundMusic, isMuted } = useSound();

  useEffect(() => {
    // This function handles starting the music, but respects the muted state.
    // It's safe to call even if music is already playing.
    const startMusicIfNeeded = () => {
      if (musicPages.some(page => pathname.startsWith(page) && (page !== '/' || pathname === '/'))) {
        playBackgroundMusic();
      } else {
        stopBackgroundMusic();
      }
    };
    
    // A small delay can help ensure the sound context is fully initialized
    const timer = setTimeout(startMusicIfNeeded, 100);
    
    // Also add a listener for the first user interaction to help with autoplay policies
    const handleFirstInteraction = () => {
      startMusicIfNeeded();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    }
    
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);


    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [pathname, playBackgroundMusic, stopBackgroundMusic]);

  // This component does not render anything
  return null;
};
