import { createContext, useContext, useState } from 'react';
import { useMusic } from '../game/hooks/useMusic';
import { useSound } from '../game/hooks/useSound';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const snd = useSound();
  const { musicMuted, toggleMusic } = useMusic();
  const [sndMuted, setSndMuted] = useState(false);

  const toggleSnd = () => {
    snd.mutedRef.current = !snd.mutedRef.current;
    setSndMuted(snd.mutedRef.current);
  };

  return (
    <AudioContext.Provider value={{ snd, musicMuted, toggleMusic, sndMuted, toggleSnd }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>');
  return ctx;
}
