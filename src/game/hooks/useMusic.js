import { useEffect, useRef, useState } from 'react';

const TRACK_URL = '/assets/music/painting-room.mp3';
const VOLUME = 0.22;
const STORAGE_KEY = 'splendor.musicMuted';

const readMuted = () => {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
};

export function useMusic() {
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const [muted, setMuted] = useState(readMuted);

  useEffect(() => {
    const a = new Audio(TRACK_URL);
    a.loop = true;
    a.preload = 'auto';
    a.volume = readMuted() ? 0 : VOLUME;
    audioRef.current = a;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (a.paused && a.volume > 0) a.play().catch(() => {});
    };
    const evts = ['pointerdown', 'keydown', 'touchstart'];
    evts.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));

    const onVis = () => {
      if (!startedRef.current) return;
      if (document.hidden) {
        try { a.pause(); } catch { /* noop */ }
      } else if (!readMuted()) {
        a.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      evts.forEach((e) => window.removeEventListener(e, start));
      document.removeEventListener('visibilitychange', onVis);
      try { a.pause(); } catch { /* noop */ }
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : VOLUME;
    if (muted) {
      a.pause();
    } else if (startedRef.current) {
      a.play().catch(() => {});
    }
    try { localStorage.setItem(STORAGE_KEY, muted ? '1' : '0'); } catch { /* noop */ }
  }, [muted]);

  return {
    musicMuted: muted,
    toggleMusic: () => setMuted((m) => !m),
  };
}
