import { useEffect, useState } from 'react';
import { ref, onValue, set, get, onDisconnect, serverTimestamp } from 'firebase/database';
import { db } from './firebase';

const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const newCode = () => Array.from({ length: 4 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join('');

export const getClientId = () => {
  let id = localStorage.getItem('splendor.clientId');
  if (!id) { id = Math.random().toString(36).slice(2, 12); localStorage.setItem('splendor.clientId', id); }
  return id;
};

export function useRoom(code) {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!code || !db) { setRoom(null); return; }
    const r = ref(db, `rooms/${code}`);
    const unsub = onValue(r, snap => {
      const v = snap.val();
      setRoom(v);
      if (!v) setError('Room not found');
      else setError(null);
    }, err => setError(err.message));
    return () => unsub();
  }, [code]);
  return { room, error };
}

export const publishRoom = (code, payload) => set(ref(db, `rooms/${code}`), payload);
export const publishGame = (code, game) => set(ref(db, `rooms/${code}/state`), game);
export const publishSlots = (code, slots) => set(ref(db, `rooms/${code}/slots`), slots);
export const publishStarted = (code, started) => set(ref(db, `rooms/${code}/started`), started);
export const fetchRoom = async (code) => (await get(ref(db, `rooms/${code}`))).val();

export const heartbeat = (code, slotIdx, clientId) => {
  if (!db || !code) return () => {};
  const path = `rooms/${code}/slots/${slotIdx}/lastSeen`;
  const r = ref(db, path);
  set(r, serverTimestamp());
  const interval = setInterval(() => set(r, serverTimestamp()), 15000);
  return () => clearInterval(interval);
};

export { serverTimestamp };
