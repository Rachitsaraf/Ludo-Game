'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSound } from '@/hooks/use-sound';

// Define which pages should have background music
const musicPages = ['/', '/game', '/select-color', '/instructions', '/leaderboard', '/settings'];

export function BackgroundMusicManager() {
  const pathname = usePathname();
  const { playBackgroundMusic, stopBackgroundMusic, isMuted } = useSound();
  const hasInteracted = useRef(false);

  useEffect(() => {
    const shouldPlayMusic = musicPages.some(page => pathname.startsWith(page) && (page !== '/' || pathname === '/'));

    if (!shouldPlayMusic) {
      stopBackgroundMusic();
      return;
    }

    const handleFirstInteraction = () => {
      if (hasInteracted.current) return;
      hasInteracted.current = true;
      playBackgroundMusic();
      // Clean up listeners after first interaction
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    // If we have already interacted, we can try to play music immediately.
    // The hook itself will check the mute state.
    if (hasInteracted.current) {
      playBackgroundMusic();
    } else {
      // Otherwise, we wait for the user to interact.
      window.addEventListener('click', handleFirstInteraction);
      window.addEventListener('keydown', handleFirstInteraction);
    }

    // The cleanup function will remove listeners if the component unmounts
    // before the user has a chance to interact.
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [pathname, playBackgroundMusic, stopBackgroundMusic, isMuted]);

  // This component does not render anything
  return null;
};
