
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Using web URLs for sound files as a placeholder.
const SOUND_FILES = {
  dice: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c35f8e5f8f.mp3',
  move: 'https://cdn.pixabay.com/audio/2021/08/04/audio_a47d2f3148.mp3',
  win: 'https://cdn.pixabay.com/audio/2022/11/22/audio_1e37267e78.mp3',
  click: 'https://cdn.pixabay.com/audio/2022/03/15/audio_76538ae2b6.mp3',
  background: 'https://cdn.pixabay.com/audio/2022/08/18/audio_253018e6be.mp3',
};

type SoundEffect = keyof Omit<typeof SOUND_FILES, 'background'>;

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: SoundEffect) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  // Default to unmuted state, which is more intuitive for a game.
  const [isMuted, setIsMuted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to load mute state from localStorage on initial client load
  useEffect(() => {
    setIsMounted(true);
    const savedMuteState = localStorage.getItem('ludoMuted');
    if (savedMuteState !== null) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);

  // Effect to sync the actual audio element's muted property with our state
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const playSound = useCallback((type: SoundEffect) => {
    if (isMuted || !isMounted) return;
    try {
      const audio = new Audio(SOUND_FILES[type]);
      audio.volume = 0.5;
      audio.play().catch(e => console.error(`Error playing sound: ${type}`, e));
    } catch (error) {
      console.error("Could not play sound", error);
    }
  }, [isMuted, isMounted]);

  const playBackgroundMusic = useCallback(() => {
    // Top-level guard to prevent playing when muted.
    if (isMuted || !isMounted) return;

    try {
      if (!backgroundAudioRef.current) {
        backgroundAudioRef.current = new Audio(SOUND_FILES.background);
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = 0.2;
      }
      
      // Always try to play if not muted. The browser will prevent it if there's
      // no interaction, and calling play() on an already playing element is a no-op.
      backgroundAudioRef.current.play().catch(e => {
        // This catch is expected to fire on first load until user interaction.
      });

    } catch (error) {
       console.error("Could not play background music", error);
    }
  }, [isMuted, isMounted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current && !backgroundAudioRef.current.paused) {
      backgroundAudioRef.current.pause();
    }
  }, []);
  
  const toggleMute = useCallback(() => {
    if (!isMounted) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('ludoMuted', JSON.stringify(newMutedState));

    // Explicitly stop or start music based on the new state
    if (newMutedState) {
      stopBackgroundMusic();
    } else {
      // When un-muting, always try to play the music.
      playBackgroundMusic();
    }
  }, [isMuted, isMounted, playBackgroundMusic, stopBackgroundMusic]);

  const value = { isMuted, toggleMute, playSound, playBackgroundMusic, stopBackgroundMusic };

  return React.createElement(SoundContext.Provider, { value }, children);
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
