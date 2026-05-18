import { useEffect, useState } from 'react';
import Splendor, { initGame } from '../splendor.jsx';
import { isFirebaseConfigured } from './firebase';
import { useRoom, newCode, getClientId, fetchRoom, publishRoom, publishSlots, publishStarted, publishGame } from './useRoom';

const DIFFS = ['easy', 'medium', 'hard'];
const DIFF_COL = { easy: '#52cf7a', medium: '#f0c840', hard: '#f06060' };

export default function App() {
  const [view, setView] = useState('lobby');
  const [slots, setSlots] = useState(null);
  const [myIdx, setMyIdx] = useState(0);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const startSolo = (humanName, aiList) => {
    const s = [{ name: humanName || 'You', kind: 'human' }];
    aiList.forEach((d, i) => s.push({ name: `AI ${i + 1} (${d})`, kind: 'ai', aiDifficulty: d }));
    setSlots(s); setMyIdx(0); setRoomCode(null); setIsHost(false); setView('game');
  };

  const handleCreate = async (myName, playerCount) => {
    const code = newCode();
    const clientId = getClientId();
    const rs = Array.from({ length: playerCount }, (_, i) =>
      i === 0 ? { kind: 'human', name: myName || 'Host', clientId } : { kind: 'open', name: `Slot ${i + 1}` }
    );
    await publishRoom(code, { hostClientId: clientId, slots: rs, started: false, createdAt: Date.now() });
    setRoomCode(code); setIsHost(true); setMyIdx(0); setView('waiting');
  };

  const handleJoin = async (code, name) => {
    const cu = code.toUpperCase().trim();
    const room = await fetchRoom(cu);
    if (!room) { alert('Room not found'); return; }
    if (room.started) { alert('Game already started'); return; }
    const rs = Array.isArray(room.slots) ? [...room.slots] : Object.values(room.slots || {});
    const openIdx = rs.findIndex(s => s && s.kind === 'open');
    if (openIdx === -1) { alert('No open slots'); return; }
    const clientId = getClientId();
    rs[openIdx] = { kind: 'human', name: name || 'Player', clientId };
    await publishSlots(cu, rs);
    setRoomCode(cu); setIsHost(false); setMyIdx(openIdx); setView('waiting');
  };

  const backToLobby = () => { setSlots(null); setRoomCode(null); setIsHost(false); setView('lobby'); };

  if (view === 'game' && !roomCode) {
    return (
      <div style={{ position: 'relative' }}>
        <Splendor key={JSON.stringify(slots)} initialSlots={slots} myPlayerIndex={myIdx} />
        <LobbyBackBtn onClick={backToLobby} />
      </div>
    );
  }

  if (view === 'waiting') return <WaitingRoom code={roomCode} myIdx={myIdx} isHost={isHost} onStart={() => setView('game')} onLeave={backToLobby} />;
  if (view === 'game' && roomCode) return <OnlineGame code={roomCode} myIdx={myIdx} isHost={isHost} onLeave={backToLobby} />;
  return <Lobby onStartSolo={startSolo} onCreate={handleCreate} onJoin={handleJoin} />;
}

function OnlineHeaderChips({ code, onLeave }) {
  const mob = typeof window !== 'undefined' && window.innerWidth < 760;
  return (
    <div style={{ position: 'fixed', top: 6, [mob?'left':'right']: mob?40:200, display: 'flex', gap: 6, zIndex: 10 }}>
      <span style={{ background: '#07050dcc', border: '1px solid #ffffff12', color: '#f0c840bb', fontSize: 8, padding: '3px 8px', letterSpacing: 2, fontFamily: 'Georgia,serif', borderRadius: 4 }}>ROOM {code}</span>
      <button onClick={onLeave}
        style={{ background: '#07050dcc', border: '1px solid #ffffff12', color: '#ffffff66', fontSize: 8, cursor: 'pointer', borderRadius: 4, padding: '3px 8px', letterSpacing: 1, fontFamily: 'Georgia,serif' }}>
        ← LOBBY
      </button>
    </div>
  );
}

function LobbyBackBtn({ onClick }) {
  const mob = typeof window !== 'undefined' && window.innerWidth < 760;
  return (
    <button onClick={onClick}
      style={{ position: 'fixed', top: 6, [mob?'left':'right']: mob?40:200, background: '#07050dcc', border: '1px solid #ffffff12', color: '#ffffff66', fontSize: 8, cursor: 'pointer', borderRadius: 4, padding: '3px 8px', letterSpacing: 1, fontFamily: 'Georgia,serif', zIndex: 10 }}>
      ← LOBBY
    </button>
  );
}

function Lobby({ onStartSolo, onCreate, onJoin }) {
  const [mode, setMode] = useState(null);
  const [humanName, setHumanName] = useState(localStorage.getItem('splendor.name') || 'You');
  const [aiList, setAiList] = useState(['medium']);
  const [createCount, setCreateCount] = useState(2);
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);
  const fbReady = isFirebaseConfigured;

  const saveName = (n) => { setHumanName(n); localStorage.setItem('splendor.name', n); };

  const addAi = () => aiList.length < 3 && setAiList([...aiList, 'medium']);
  const removeAi = i => setAiList(aiList.filter((_, j) => j !== i));
  const setAi = (i, d) => setAiList(aiList.map((x, j) => j === i ? d : x));

  return (
    <div style={shellStyle}>
      <style>{`@keyframes sh{0%,100%{opacity:0.55}50%{opacity:1}}`}</style>
      <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Title />

        {!mode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ModeBtn label="SOLO VS AI" desc="Play offline against 1–3 AI opponents" onClick={() => setMode('solo')} color="#6ab4f8" />
            <ModeBtn label="CREATE ONLINE ROOM" desc={fbReady ? "Generate a code; friends join with it" : "⚠ Firebase not configured — see README"} onClick={() => fbReady && setMode('create')} color="#52cf7a" disabled={!fbReady} />
            <ModeBtn label="JOIN ONLINE ROOM" desc={fbReady ? "Enter a code your friend shared" : "⚠ Firebase not configured — see README"} onClick={() => fbReady && setMode('join')} color="#c858e0" disabled={!fbReady} />
          </div>
        )}

        {mode === 'solo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <NameField value={humanName} onChange={saveName} />
            <div>
              <FieldLabel>AI OPPONENTS ({aiList.length})</FieldLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {aiList.map((d, i) => (
                  <div key={i} style={slotRowStyle}>
                    <span style={{ fontSize: 11, color: '#e0d8f0', flex: 1 }}>🤖 AI {i + 1}</span>
                    <DifficultyToggle current={d} onSet={dd => setAi(i, dd)} />
                    {aiList.length > 1 && <RemoveBtn onClick={() => removeAi(i)} />}
                  </div>
                ))}
              </div>
              {aiList.length < 3 && <AddBtn onClick={addAi} label="+ ADD AI OPPONENT" />}
            </div>
            <ActionRow onBack={() => setMode(null)} primaryLabel="START GAME" onPrimary={() => onStartSolo(humanName, aiList)} />
          </div>
        )}

        {mode === 'create' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <NameField value={humanName} onChange={saveName} />
            <div>
              <FieldLabel>PLAYER COUNT</FieldLabel>
              <div style={{ display: 'flex', gap: 6 }}>
                {[2, 3, 4].map(n => (
                  <button key={n} onClick={() => setCreateCount(n)}
                    style={{ flex: 1, padding: '8px', borderRadius: 6, border: `1.5px solid ${createCount === n ? '#52cf7a' : '#ffffff14'}`, background: createCount === n ? '#52cf7a14' : 'transparent', color: createCount === n ? '#52cf7a' : '#ffffff44', fontSize: 12, fontWeight: 700, fontFamily: 'Georgia,serif', cursor: 'pointer' }}>
                    {n} PLAYERS
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 9, color: '#ffffff33', marginTop: 6, lineHeight: 1.5 }}>
                Slot 1 is you. Other slots will be marked "open" — your friends can join with the room code, or you can fill any open slot with an AI from the waiting room.
              </div>
            </div>
            <ActionRow onBack={() => setMode(null)} primaryLabel={busy ? 'CREATING…' : 'CREATE ROOM'} primaryDis={busy}
              onPrimary={async () => { setBusy(true); try { await onCreate(humanName, createCount); } catch (e) { alert(e.message); } setBusy(false); }} />
          </div>
        )}

        {mode === 'join' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <NameField value={humanName} onChange={saveName} />
            <div>
              <FieldLabel>ROOM CODE</FieldLabel>
              <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 4))} maxLength={4} placeholder="ABCD"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 6, background: '#0b0918', border: '1px solid #ffffff22', color: '#c858e0', fontSize: 22, fontFamily: 'Georgia,serif', letterSpacing: 8, textAlign: 'center', textTransform: 'uppercase' }} />
            </div>
            <ActionRow onBack={() => setMode(null)} primaryLabel={busy ? 'JOINING…' : 'JOIN ROOM'} primaryDis={busy || joinCode.length !== 4}
              onPrimary={async () => { setBusy(true); try { await onJoin(joinCode, humanName); } catch (e) { alert(e.message); } setBusy(false); }} />
          </div>
        )}
      </div>
    </div>
  );
}

function WaitingRoom({ code, myIdx, isHost, onStart, onLeave }) {
  const { room, error } = useRoom(code);

  useEffect(() => {
    if (room?.started && room?.state) onStart();
  }, [room?.started, !!room?.state]);

  if (error) return <CenterMessage title="Room error" body={error} actionLabel="BACK TO LOBBY" onAction={onLeave} />;
  if (!room) return <CenterMessage title="Loading room…" body={`Code: ${code}`} />;

  const rawSlots = Array.isArray(room.slots) ? room.slots : Object.values(room.slots || {});
  const slots = rawSlots.filter(Boolean);
  const canStart = slots.every(s => s.kind === 'human' || s.kind === 'ai');

  const setSlot = (i, change) => {
    if (!isHost) return;
    const newSlots = [...slots];
    newSlots[i] = change === null ? newSlots[i] : { ...newSlots[i], ...change };
    publishSlots(code, newSlots);
  };

  const toggleOpen = (i) => {
    if (!isHost) return;
    const s = slots[i];
    if (s.kind === 'open') setSlot(i, { kind: 'ai', name: `AI ${i + 1}`, aiDifficulty: 'medium' });
    else if (s.kind === 'ai') setSlot(i, { kind: 'open', name: `Slot ${i + 1}`, aiDifficulty: null });
  };

  const setAiDiff = (i, d) => {
    if (!isHost) return;
    setSlot(i, { aiDifficulty: d, name: `AI ${i + 1} (${d})` });
  };

  const startGame = async () => {
    if (!isHost || !canStart) return;
    const cleanSlots = slots.map(s => ({ name: s.name, kind: s.kind, aiDifficulty: s.aiDifficulty || null }));
    const state = initGame(cleanSlots);
    await publishGame(code, state);
    await publishStarted(code, true);
  };

  return (
    <div style={shellStyle}>
      <style>{`@keyframes sh{0%,100%{opacity:0.55}50%{opacity:1}} @keyframes pu{0%,100%{opacity:0.45}50%{opacity:1}}`}</style>
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Title />

        <div style={{ background: '#0b0918', borderRadius: 10, padding: '16px 20px', border: '1px solid #ffffff14', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: '#ffffff44', letterSpacing: 3, marginBottom: 6 }}>ROOM CODE</div>
          <div style={{ fontSize: 42, color: '#f0c840', letterSpacing: 14, fontFamily: 'Georgia,serif', fontWeight: 700, paddingLeft: 14 }}>{code}</div>
          <button onClick={() => { navigator.clipboard.writeText(code); }} style={{ marginTop: 6, padding: '4px 12px', background: 'transparent', border: '1px solid #ffffff22', color: '#ffffff66', fontSize: 9, letterSpacing: 2, fontFamily: 'Georgia,serif', borderRadius: 4, cursor: 'pointer' }}>COPY</button>
        </div>

        <div>
          <FieldLabel>{isHost ? 'PLAYERS (host)' : `PLAYERS — you are slot ${myIdx + 1}`}</FieldLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {slots.map((s, i) => (
              <div key={i} style={{ ...slotRowStyle, opacity: s.kind === 'open' ? 0.65 : 1, border: `1px solid ${i === myIdx ? '#f0c84055' : '#ffffff14'}` }}>
                <span style={{ fontSize: 14 }}>{s.kind === 'human' ? '👤' : s.kind === 'ai' ? '🤖' : '○'}</span>
                <span style={{ fontSize: 11, color: i === myIdx ? '#f0c840' : '#e0d8f0', flex: 1 }}>
                  {s.kind === 'open' ? <em style={{ color: '#ffffff44' }}>open — waiting…</em> : s.name}
                  {i === myIdx && <span style={{ marginLeft: 6, color: '#f0c840', fontSize: 9, letterSpacing: 2 }}>(YOU)</span>}
                </span>
                {s.kind === 'ai' && isHost && <DifficultyToggle current={s.aiDifficulty} onSet={d => setAiDiff(i, d)} />}
                {isHost && i !== 0 && (s.kind === 'open' || s.kind === 'ai') && (
                  <button onClick={() => toggleOpen(i)} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 8, letterSpacing: 1, fontFamily: 'Georgia,serif', cursor: 'pointer', border: '1px solid #ffffff22', background: 'transparent', color: '#ffffff66' }}>
                    {s.kind === 'open' ? 'FILL W/ AI' : 'OPEN UP'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isHost && <div style={{ fontSize: 10, color: '#ffffff44', textAlign: 'center', animation: 'pu 1.2s infinite' }}>Waiting for host to start…</div>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onLeave}
            style={{ flex: 1, padding: '10px', borderRadius: 6, border: '1px solid #ffffff22', background: 'transparent', color: '#ffffff66', fontSize: 10, letterSpacing: 2, fontFamily: 'Georgia,serif', cursor: 'pointer' }}>
            LEAVE
          </button>
          {isHost && (
            <button onClick={startGame} disabled={!canStart}
              style={{ flex: 2, padding: '10px', borderRadius: 6, border: `2px solid ${canStart ? '#f0c840' : '#1e1e2e'}`, background: canStart ? '#f0c84012' : 'transparent', color: canStart ? '#f0c840' : '#1e1e2e', fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: 'Georgia,serif', cursor: canStart ? 'pointer' : 'not-allowed', boxShadow: canStart ? '0 0 16px #f0c84022' : 'none' }}>
              START GAME
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function normalizeGame(g) {
  if (!g) return g;
  const arr = v => Array.isArray(v) ? v : v ? Object.values(v) : [];
  return {
    ...g,
    bank: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0, ...(g.bank || {}) },
    board: { 1: arr(g.board?.[1]), 2: arr(g.board?.[2]), 3: arr(g.board?.[3]) },
    deck: { 1: arr(g.deck?.[1]), 2: arr(g.deck?.[2]), 3: arr(g.deck?.[3]) },
    nobles: arr(g.nobles),
    players: arr(g.players).map(p => ({
      ...p,
      cards: arr(p?.cards),
      reserved: arr(p?.reserved),
      tokens: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0, ...(p?.tokens || {}) },
      points: p?.points || 0,
    })),
    turn: g.turn || 0,
    gameOver: !!g.gameOver,
    finalRound: !!g.finalRound,
  };
}

function OnlineGame({ code, myIdx, isHost, onLeave }) {
  const { room, error } = useRoom(code);
  if (error) return <CenterMessage title="Connection lost" body={error} actionLabel="BACK TO LOBBY" onAction={onLeave} />;
  if (!room || !room.state) return <CenterMessage title="Loading game…" body={`Code: ${code}`} />;

  const rawSlots = Array.isArray(room.slots) ? room.slots : Object.values(room.slots || {});
  const cleanSlots = rawSlots.filter(Boolean).map(s => ({ name: s.name, kind: s.kind, aiDifficulty: s.aiDifficulty || null }));

  const onPublishGame = (ng) => publishGame(code, ng);
  const syncedGame = normalizeGame(room.state);

  return (
    <div style={{ position: 'relative' }}>
      <Splendor key={code} syncedGame={syncedGame} onPublishGame={onPublishGame} isHost={isHost} myPlayerIndex={myIdx} initialSlots={cleanSlots} />
      <OnlineHeaderChips code={code} onLeave={onLeave} />
    </div>
  );
}

// --- shared UI bits ---

function Title() {
  return (
    <div style={{ textAlign: 'center', marginBottom: 8 }}>
      <div style={{ fontSize: 60, color: '#f0c840', animation: 'sh 3s ease-in-out infinite', lineHeight: 1 }}>✦</div>
      <div style={{ color: '#f0c840', fontSize: 22, letterSpacing: 8, marginTop: 6 }}>SPLENDOR</div>
      <div style={{ color: '#f0c84033', fontSize: 9, letterSpacing: 4 }}>RENAISSANCE</div>
    </div>
  );
}

function NameField({ value, onChange }) {
  return (
    <div>
      <FieldLabel>YOUR NAME</FieldLabel>
      <input value={value} onChange={e => onChange(e.target.value)} maxLength={16}
        style={{ width: '100%', padding: '8px 10px', borderRadius: 6, background: '#0b0918', border: '1px solid #ffffff22', color: '#f0c840', fontSize: 13, fontFamily: 'Georgia,serif' }} />
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 9, color: '#ffffff44', letterSpacing: 2, marginBottom: 5 }}>{children}</div>;
}

function DifficultyToggle({ current, onSet }) {
  return (
    <>
      {DIFFS.map(dd => (
        <button key={dd} onClick={() => onSet(dd)}
          style={{ padding: '3px 9px', borderRadius: 4, fontSize: 9, letterSpacing: 1, fontFamily: 'Georgia,serif', cursor: 'pointer', border: `1px solid ${current === dd ? DIFF_COL[dd] : '#ffffff14'}`, background: current === dd ? `${DIFF_COL[dd]}22` : 'transparent', color: current === dd ? DIFF_COL[dd] : '#ffffff44' }}>
          {dd.toUpperCase()}
        </button>
      ))}
    </>
  );
}

function RemoveBtn({ onClick }) {
  return <button onClick={onClick} style={{ background: 'transparent', border: 'none', color: '#f06060', fontSize: 14, cursor: 'pointer', padding: '0 4px' }}>×</button>;
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick}
      style={{ marginTop: 6, padding: '5px 10px', borderRadius: 5, border: '1px dashed #ffffff22', background: 'transparent', color: '#ffffff44', fontSize: 9, letterSpacing: 2, fontFamily: 'Georgia,serif', cursor: 'pointer' }}>
      {label}
    </button>
  );
}

function ActionRow({ onBack, primaryLabel, onPrimary, primaryDis }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
      <button onClick={onBack}
        style={{ flex: 1, padding: '10px', borderRadius: 6, border: '1px solid #ffffff22', background: 'transparent', color: '#ffffff66', fontSize: 10, letterSpacing: 2, fontFamily: 'Georgia,serif', cursor: 'pointer' }}>
        BACK
      </button>
      <button onClick={onPrimary} disabled={primaryDis}
        style={{ flex: 2, padding: '10px', borderRadius: 6, border: `2px solid ${primaryDis ? '#1e1e2e' : '#f0c840'}`, background: primaryDis ? 'transparent' : '#f0c84012', color: primaryDis ? '#1e1e2e' : '#f0c840', fontSize: 11, fontWeight: 700, letterSpacing: 3, fontFamily: 'Georgia,serif', cursor: primaryDis ? 'not-allowed' : 'pointer', boxShadow: primaryDis ? 'none' : '0 0 16px #f0c84022' }}>
        {primaryLabel}
      </button>
    </div>
  );
}

function ModeBtn({ label, desc, onClick, color, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: '14px 18px', borderRadius: 10, textAlign: 'left',
        background: disabled ? '#08071068' : '#0b0918',
        border: `1px solid ${disabled ? '#ffffff0a' : color + '55'}`,
        color: disabled ? '#ffffff22' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Georgia,serif',
        boxShadow: disabled ? 'none' : `0 0 14px ${color}14`,
        transition: 'all 0.2s',
      }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3 }}>{label}</div>
      <div style={{ fontSize: 9, color: disabled ? '#ffffff14' : '#ffffff44', marginTop: 3 }}>{desc}</div>
    </button>
  );
}

function CenterMessage({ title, body, actionLabel, onAction }) {
  return (
    <div style={shellStyle}>
      <div style={{ textAlign: 'center', color: '#e0d8f0', fontFamily: 'Georgia,serif', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 18, color: '#f0c840', letterSpacing: 3 }}>{title}</div>
        <div style={{ fontSize: 11, color: '#ffffff66' }}>{body}</div>
        {actionLabel && <button onClick={onAction} style={{ padding: '8px 22px', borderRadius: 6, border: '1px solid #f0c840', background: 'transparent', color: '#f0c840', fontSize: 10, letterSpacing: 3, fontFamily: 'Georgia,serif', cursor: 'pointer' }}>{actionLabel}</button>}
      </div>
    </div>
  );
}

const shellStyle = { minHeight: '100vh', background: 'radial-gradient(ellipse at 40% 30%,#1e1228,#040210)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia,serif', color: '#e0d8f0', padding: 24 };
const slotRowStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#0b0918', borderRadius: 6, border: '1px solid #ffffff14' };
