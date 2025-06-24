"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Using web URLs for sound files as a placeholder.
// For a production app, you would typically store these in `/public/sounds`
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
  const [isMuted, setIsMuted] = useState(true);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to load mute state from localStorage on initial client load
  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('ludoSoundEnabled');
    // Sound is enabled by default if no setting is saved
    const isSoundEnabled = savedSoundSetting ? JSON.parse(savedSoundSetting) : true;
    setIsMuted(!isSoundEnabled);
  }, []);

  const playSound = useCallback((type: SoundEffect) => {
    if (isMuted) return;
    try {
      const audio = new Audio(SOUND_FILES[type]);
      audio.volume = 0.5;
      audio.play().catch(e => console.error(`Error playing sound: ${type}`, e));
    } catch (error) {
      console.error("Could not play sound", error);
    }
  }, [isMuted]);

  const playBackgroundMusic = useCallback(() => {
    try {
      if (!backgroundAudioRef.current) {
        backgroundAudioRef.current = new Audio(SOUND_FILES.background);
        backgroundAudioRef.current.loop = true;
        backgroundAudioRef.current.volume = 0.2;
      }
      
      backgroundAudioRef.current.muted = isMuted;

      if (backgroundAudioRef.current.paused) {
        // Browser autoplay policies might prevent this, which is expected.
        // It will start on the first user interaction.
        backgroundAudioRef.current.play().catch(e => {});
      }
    } catch (error) {
       console.error("Could not play background music", error);
    }
  }, [isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
  }, []);

  // This effect ensures the background music's mute state is always in sync with the state.
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('ludoSoundEnabled', JSON.stringify(!newMutedState));
    
    if (backgroundAudioRef.current) {
        backgroundAudioRef.current.muted = newMutedState;
        // If unmuting, and music should be playing, try to play it.
        if(!newMutedState && backgroundAudioRef.current.paused) {
            backgroundAudioRef.current.play().catch(e => {});
        }
    }
  }, [isMuted]);

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
