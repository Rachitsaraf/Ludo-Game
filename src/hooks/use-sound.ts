
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
  const [isMuted, setIsMuted] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load mute state from localStorage on initial client load
  useEffect(() => {
    const savedMuteState = localStorage.getItem('ludoMuted');
    if (savedMuteState !== null) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);
  
  const playBackgroundMusic = useCallback(() => {
    if (isMuted) return;

    if (!backgroundAudioRef.current) {
        try {
            backgroundAudioRef.current = new Audio(SOUND_FILES.background);
            backgroundAudioRef.current.loop = true;
            backgroundAudioRef.current.volume = 0.2;
        } catch (error) {
            console.error("Could not create background audio element", error);
            return;
        }
    }

    if (backgroundAudioRef.current.paused) {
        backgroundAudioRef.current.play().catch(e => {
            // This error is expected on first load before user interaction
            console.log("Browser prevented audio from playing automatically. Waiting for user interaction.");
        });
    }
  }, [isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundAudioRef.current && !backgroundAudioRef.current.paused) {
      backgroundAudioRef.current.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('ludoMuted', JSON.stringify(newMutedState));

    if (newMutedState) {
      stopBackgroundMusic();
    } else {
      // If unmuting, try to play music. It will only play if user has interacted.
      playBackgroundMusic();
    }
  }, [isMuted, playBackgroundMusic, stopBackgroundMusic]);

  // Effect to handle the first user interaction to enable audio
  useEffect(() => {
    const handleFirstInteraction = () => {
        // Now that the user has interacted, we can safely play our music
        if (!isMuted) {
            playBackgroundMusic();
        }
        // Remove the event listener so it only runs once
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
        window.removeEventListener('click', handleFirstInteraction);
        window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isMuted, playBackgroundMusic]);


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
