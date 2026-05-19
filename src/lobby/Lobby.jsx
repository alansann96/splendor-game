import { useState } from 'react';
import GemOrbs from '../components/GemOrbs';
import { isFirebaseConfigured } from '../firebase';
import ActionRow from './ActionRow';
import DifficultyToggle from './DifficultyToggle';
import FieldLabel from './FieldLabel';
import NameField from './NameField';
import Title from './Title';
import { shellStyle, slotRowStyle } from './styles';

const MODE_THEME = {
  solo:   { color: '#6ab4f8', icon: '⚔︎', label: 'Solo vs AI',     hint: 'Play offline against 1–3 AI opponents.' },
  create: { color: '#52cf7a', icon: '⊕',  label: 'Create room',    hint: 'Generate a code; friends join with it.' },
  join:   { color: '#c858e0', icon: '⇲',  label: 'Join room',      hint: 'Enter a 4-letter code from a friend.' },
};

export default function Lobby({ onStartSolo, onCreate, onJoin }) {
  const [expanded, setExpanded] = useState('solo');
  const [humanName, setHumanName] = useState(localStorage.getItem('splendor.name') || 'You');
  const [aiList, setAiList] = useState(['medium']);
  const [createCount, setCreateCount] = useState(2);
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);
  const fbReady = isFirebaseConfigured;

  const saveName = (n) => {
    setHumanName(n);
    localStorage.setItem('splendor.name', n);
  };

  const addAi = () => aiList.length < 3 && setAiList([...aiList, 'medium']);
  const removeAi = (i) => setAiList(aiList.filter((_, j) => j !== i));
  const setAi = (i, d) => setAiList(aiList.map((x, j) => (j === i ? d : x)));

  return (
    <div style={shellStyle}>
      <GemOrbs />
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <Title />

        <ModeCard
          mode="solo"
          expanded={expanded === 'solo'}
          onToggle={() => setExpanded(expanded === 'solo' ? null : 'solo')}
          enabled
        >
          <NameField value={humanName} onChange={saveName} />
          <div>
            <FieldLabel>AI opponents ({aiList.length})</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {aiList.map((d, i) => (
                <div key={i} style={slotRowStyle}>
                  <span style={{ fontSize: 14 }}>🤖</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      flex: 1,
                      fontWeight: 500,
                    }}
                  >
                    AI {i + 1}
                  </span>
                  <DifficultyToggle current={d} onSet={(dd) => setAi(i, dd)} />
                  {aiList.length > 1 && (
                    <button
                      onClick={() => removeAi(i)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-ruby)',
                        fontSize: 16,
                        cursor: 'pointer',
                        padding: '0 4px',
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {aiList.length < 3 && (
              <button
                onClick={addAi}
                style={{
                  marginTop: 8,
                  padding: '7px 12px',
                  borderRadius: 'var(--r-sm)',
                  border: '1px dashed var(--glass-border-lit)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 10,
                  letterSpacing: 2,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                + ADD AI OPPONENT
              </button>
            )}
          </div>
          <ActionRow
            onBack={() => setExpanded(null)}
            primaryLabel="START GAME"
            onPrimary={() => onStartSolo(humanName, aiList)}
          />
        </ModeCard>

        <ModeCard
          mode="create"
          expanded={expanded === 'create'}
          onToggle={() => fbReady && setExpanded(expanded === 'create' ? null : 'create')}
          enabled={fbReady}
          disabledHint={!fbReady && '⚠ Firebase not configured — see README'}
        >
          <NameField value={humanName} onChange={saveName} />
          <div>
            <FieldLabel>Player count</FieldLabel>
            <div style={{ display: 'flex', gap: 6 }}>
              {[2, 3, 4].map((n) => {
                const active = createCount === n;
                return (
                  <button
                    key={n}
                    onClick={() => setCreateCount(n)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 'var(--r-md)',
                      border: `1px solid ${active ? '#52cf7a' : 'var(--glass-border)'}`,
                      background: active ? 'rgba(82,207,122,0.12)' : 'var(--glass-bg)',
                      backdropFilter: 'var(--blur-sm)',
                      WebkitBackdropFilter: 'var(--blur-sm)',
                      color: active ? '#52cf7a' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all var(--dur-base)',
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-tertiary)',
                marginTop: 8,
                lineHeight: 1.55,
              }}
            >
              Slot 1 is you. Other slots will be marked "open" — friends join with the room code, or fill any open slot with an AI from the waiting room.
            </div>
          </div>
          <ActionRow
            onBack={() => setExpanded(null)}
            primaryLabel={busy ? 'CREATING…' : 'CREATE ROOM'}
            primaryDis={busy}
            onPrimary={async () => {
              setBusy(true);
              try {
                await onCreate(humanName, createCount);
              } catch (e) {
                alert(e.message);
              }
              setBusy(false);
            }}
          />
        </ModeCard>

        <ModeCard
          mode="join"
          expanded={expanded === 'join'}
          onToggle={() => fbReady && setExpanded(expanded === 'join' ? null : 'join')}
          enabled={fbReady}
          disabledHint={!fbReady && '⚠ Firebase not configured — see README'}
        >
          <NameField value={humanName} onChange={saveName} />
          <div>
            <FieldLabel>Room code</FieldLabel>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
              maxLength={4}
              placeholder="ABCD"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--r-md)',
                background: 'var(--glass-bg-tint)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'var(--blur-sm)',
                WebkitBackdropFilter: 'var(--blur-sm)',
                color: '#c858e0',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 28,
                letterSpacing: 12,
                textAlign: 'center',
                textTransform: 'uppercase',
                outline: 'none',
              }}
            />
          </div>
          <ActionRow
            onBack={() => setExpanded(null)}
            primaryLabel={busy ? 'JOINING…' : 'JOIN ROOM'}
            primaryDis={busy || joinCode.length !== 4}
            onPrimary={async () => {
              setBusy(true);
              try {
                await onJoin(joinCode, humanName);
              } catch (e) {
                alert(e.message);
              }
              setBusy(false);
            }}
          />
        </ModeCard>
      </div>
    </div>
  );
}

function ModeCard({ mode, expanded, onToggle, enabled, disabledHint, children }) {
  const theme = MODE_THEME[mode];
  return (
    <div
      style={{
        background: expanded ? 'var(--glass-bg-strong)' : 'var(--glass-bg)',
        border: `1px solid ${expanded ? theme.color + '88' : 'var(--glass-border)'}`,
        borderRadius: 'var(--r-lg)',
        backdropFilter: 'var(--blur-md)',
        WebkitBackdropFilter: 'var(--blur-md)',
        boxShadow: expanded
          ? `0 0 32px ${theme.color}22, var(--glass-highlight), var(--glass-shadow)`
          : 'var(--glass-highlight)',
        overflow: 'hidden',
        opacity: enabled ? 1 : 0.5,
        transition: 'all var(--dur-base) var(--ease-out)',
      }}
    >
      <button
        onClick={onToggle}
        disabled={!enabled}
        style={{
          width: '100%',
          padding: '16px 18px',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: enabled ? 'pointer' : 'not-allowed',
          textAlign: 'left',
          color: theme.color,
          minHeight: 56,
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--r-md)',
            background: `${theme.color}22`,
            border: `1px solid ${theme.color}44`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 18,
            color: theme.color,
            flexShrink: 0,
          }}
        >
          {theme.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              color: theme.color,
              lineHeight: 1.2,
            }}
          >
            {theme.label}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
            {disabledHint || theme.hint}
          </div>
        </div>
        <span
          style={{
            color: theme.color,
            fontSize: 14,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--dur-base) var(--ease-out)',
            opacity: 0.7,
          }}
        >
          ▾
        </span>
      </button>
      {expanded && (
        <div
          style={{
            padding: '4px 18px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            animation: 'pi var(--dur-slow) var(--ease-out)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
