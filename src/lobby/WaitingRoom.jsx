import { useEffect, useState } from 'react';
import GemOrbs from '../components/GemOrbs';
import { initGame } from '../game/engine/init';
import { publishGame, publishSlots, publishStarted, useRoom } from '../useRoom';
import CenterMessage from './CenterMessage';
import DifficultyToggle from './DifficultyToggle';
import FieldLabel from './FieldLabel';
import Title from './Title';
import { shellStyle, slotRowStyle } from './styles';

export default function WaitingRoom({ code, myIdx, isHost, onStart, onLeave }) {
  const { room, error } = useRoom(code);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (room?.started && room?.state) onStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.started, !!room?.state]);

  if (error) return <CenterMessage title="Room error" body={error} actionLabel="BACK TO LOBBY" onAction={onLeave} />;
  if (!room) return <CenterMessage title="Loading room…" body={`Code: ${code}`} />;

  const rawSlots = Array.isArray(room.slots) ? room.slots : Object.values(room.slots || {});
  const slots = rawSlots.filter(Boolean);
  const canStart = slots.every((s) => s.kind === 'human' || s.kind === 'ai');

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
    const cleanSlots = slots.map((s) => ({ name: s.name, kind: s.kind, aiDifficulty: s.aiDifficulty || null }));
    const state = initGame(cleanSlots);
    await publishGame(code, state);
    await publishStarted(code, true);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div
      style={{
        ...shellStyle,
        alignItems: 'flex-start',
        padding: '24px 16px 100px',
        flexDirection: 'column',
        minHeight: '100dvh',
      }}
    >
      <GemOrbs />

      <div
        style={{
          width: '100%',
          maxWidth: 520,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          flex: 1,
        }}
      >
        <Title size="sm" />

        {/* Hero room code */}
        <div
          style={{
            background: 'var(--glass-bg-strong)',
            border: '1px solid rgba(240,200,64,0.30)',
            borderRadius: 'var(--r-xl)',
            backdropFilter: 'var(--blur-md)',
            WebkitBackdropFilter: 'var(--blur-md)',
            padding: '22px 20px 20px',
            textAlign: 'center',
            boxShadow: '0 0 48px rgba(240,200,64,0.12), var(--glass-highlight)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: 'var(--text-tertiary)',
              letterSpacing: 4,
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            ROOM CODE
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 56,
              color: 'var(--accent-gold)',
              letterSpacing: 16,
              lineHeight: 1,
              paddingLeft: 16, // optical centering against letter-spacing
              textShadow: '0 0 32px rgba(240,200,64,0.35)',
            }}
          >
            {code}
          </div>
          <button
            onClick={copyCode}
            style={{
              marginTop: 14,
              padding: '7px 18px',
              borderRadius: 'var(--r-sm)',
              background: copied ? 'rgba(82,207,122,0.15)' : 'var(--glass-bg)',
              border: `1px solid ${copied ? 'var(--accent-emerald)' : 'var(--glass-border)'}`,
              color: copied ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 2,
              cursor: 'pointer',
              transition: 'all var(--dur-base)',
            }}
          >
            {copied ? '✓ COPIED' : 'COPY'}
          </button>
        </div>

        {/* Players */}
        <div>
          <FieldLabel>{isHost ? 'Players (host)' : `Players — you are slot ${myIdx + 1}`}</FieldLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {slots.map((s, i) => {
              const isMe = i === myIdx;
              const isOpen = s.kind === 'open';
              return (
                <div
                  key={i}
                  style={{
                    ...slotRowStyle,
                    opacity: isOpen ? 0.75 : 1,
                    border: `1px solid ${
                      isMe ? 'rgba(240,200,64,0.45)' : isOpen ? 'rgba(255,255,255,0.08)' : 'var(--glass-border)'
                    }`,
                    boxShadow: isMe ? '0 0 18px rgba(240,200,64,0.14)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 16 }}>
                    {s.kind === 'human' ? '👤' : s.kind === 'ai' ? '🤖' : '◯'}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: isMe ? 'var(--accent-gold)' : 'var(--text-primary)',
                      flex: 1,
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 500,
                    }}
                  >
                    {isOpen ? (
                      <em
                        style={{
                          color: 'var(--text-tertiary)',
                          fontStyle: 'italic',
                          animation: 'pu 1.6s infinite',
                        }}
                      >
                        open — waiting…
                      </em>
                    ) : (
                      s.name
                    )}
                    {isMe && (
                      <span
                        style={{
                          marginLeft: 8,
                          color: 'var(--accent-gold)',
                          fontSize: 9,
                          letterSpacing: 2,
                          fontWeight: 700,
                        }}
                      >
                        (YOU)
                      </span>
                    )}
                  </span>
                  {s.kind === 'ai' && isHost && (
                    <DifficultyToggle current={s.aiDifficulty} onSet={(d) => setAiDiff(i, d)} />
                  )}
                  {isHost && i !== 0 && (s.kind === 'open' || s.kind === 'ai') && (
                    <button
                      onClick={() => toggleOpen(i)}
                      style={{
                        padding: '5px 9px',
                        borderRadius: 'var(--r-sm)',
                        fontSize: 9,
                        letterSpacing: 1,
                        fontFamily: 'var(--font-ui)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: '1px solid var(--glass-border-lit)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {s.kind === 'open' ? 'FILL W/ AI' : 'OPEN UP'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!isHost && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              animation: 'pu 1.6s infinite',
              fontFamily: 'var(--font-ui)',
            }}
          >
            Waiting for host to start…
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 16px calc(14px + env(safe-area-inset-bottom))',
          background: 'rgba(6,4,14,0.55)',
          borderTop: '1px solid var(--glass-border)',
          backdropFilter: 'var(--blur-lg)',
          WebkitBackdropFilter: 'var(--blur-lg)',
          zIndex: 5,
        }}
      >
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', gap: 10 }}>
          <button
            onClick={onLeave}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 2,
              cursor: 'pointer',
            }}
          >
            LEAVE
          </button>
          {isHost && (
            <button
              onClick={startGame}
              disabled={!canStart}
              style={{
                flex: 2,
                padding: '13px',
                borderRadius: 'var(--r-md)',
                border: `1px solid ${canStart ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)'}`,
                background: canStart ? 'rgba(240,200,64,0.12)' : 'rgba(255,255,255,0.02)',
                color: canStart ? 'var(--accent-gold)' : 'rgba(255,255,255,0.18)',
                fontFamily: 'var(--font-ui)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 3,
                cursor: canStart ? 'pointer' : 'not-allowed',
                boxShadow: canStart ? '0 0 24px rgba(240,200,64,0.25)' : 'none',
                transition: 'all var(--dur-base)',
              }}
            >
              START GAME →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
