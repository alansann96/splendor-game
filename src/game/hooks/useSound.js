import { useRef } from 'react';

const PITCH = { white: 1318, blue: 880, green: 988, red: 698, black: 622, gold: 1174 };

export function useSound() {
  const ctxRef = useRef(null);
  const mutedRef = useRef(false);

  const getCtx = () => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      return ctxRef.current;
    } catch (e) {
      return null;
    }
  };

  const tone = (freq, type, dur, vol, delay) => {
    if (mutedRef.current) return;
    const d = delay || 0;
    try {
      const ac = getCtx();
      if (!ac) return;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type;
      osc.frequency.value = freq;
      const t = ac.currentTime + d;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.06);
    } catch (e) {}
  };

  return {
    mutedRef,
    gemPick: (col) => {
      const f = PITCH[col] || 880;
      tone(f, 'sine', 0.28, 0.18, 0);
      tone(f * 1.5, 'sine', 0.16, 0.07, 0.05);
    },
    cardBuy: () => {
      [[523, 0], [659, 0.07], [784, 0.14], [1046, 0.22]].forEach(([f, d]) => tone(f, 'sine', 0.5, 0.14, d));
    },
    reserve: () => {
      tone(440, 'triangle', 0.2, 0.12, 0);
      tone(554, 'triangle', 0.15, 0.06, 0.1);
    },
    noble: () => {
      [[523, 0], [659, 0.09], [784, 0.18], [1046, 0.28], [1318, 0.38]].forEach(([f, d]) => tone(f, 'sine', 0.6, 0.2, d));
    },
    gameWin: () => {
      [[523, 0], [659, 0.1], [784, 0.2], [880, 0.3], [1046, 0.4], [1318, 0.5]].forEach(([f, d]) => tone(f, 'sine', 0.8, 0.22, d));
    },
    gameLose: () => {
      [[523, 0], [494, 0.12], [466, 0.24], [440, 0.36]].forEach(([f, d]) => tone(f, 'triangle', 0.6, 0.14, d));
    },
    click: () => tone(700, 'sine', 0.08, 0.06, 0),
    aiMove: () => tone(330, 'sine', 0.22, 0.06, 0),
    discard: () => {
      tone(220, 'sawtooth', 0.12, 0.1, 0);
      tone(180, 'sawtooth', 0.1, 0.07, 0.06);
    },
  };
}
