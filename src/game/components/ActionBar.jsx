import Btn from './atoms/Btn';
import DiscardPanel from './DiscardPanel';

export default function ActionBar({
  phase,
  mode,
  isMyTurn,
  isAITurn,
  cur,
  me,
  pickedTotal,
  discQ,
  overBy,
  discTotal,
  onConfirmGems,
  onCancelGems,
  onCancelReserve,
  onPickDiscard,
  onConfirmDiscard,
  onResetDiscard,
}) {
  const wrapStyle = {
    position: 'sticky',
    bottom: 0,
    background: 'rgba(6,4,14,0.78)',
    borderTop: '1px solid var(--glass-border)',
    backdropFilter: 'var(--blur-lg)',
    WebkitBackdropFilter: 'var(--blur-lg)',
    padding: '12px 14px calc(12px + env(safe-area-inset-bottom))',
    zIndex: 8,
    boxShadow: '0 -12px 36px rgba(0,0,0,0.4)',
    willChange: 'transform',
  };

  // Discard phase has its own dedicated UI
  if (phase === 'discard') {
    return (
      <div style={wrapStyle}>
        <DiscardPanel
          me={me}
          discQ={discQ}
          overBy={overBy}
          discTotal={discTotal}
          onPick={onPickDiscard}
          onConfirm={onConfirmDiscard}
          onReset={onResetDiscard}
        />
      </div>
    );
  }

  // AI turn
  if (isAITurn) {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 4px',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--accent-sapphire)',
              animation: 'pu 0.9s infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            {cur && cur.name.toUpperCase()} is thinking…
          </span>
        </div>
      </div>
    );
  }

  // Not my turn, not AI (waiting for another human)
  if (!isMyTurn && phase === 'acting') {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 4px',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--accent-violet)',
              animation: 'pu 0.9s infinite',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: 'var(--text-secondary)',
              fontSize: 12,
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            Waiting for {cur && cur.name}…
          </span>
        </div>
      </div>
    );
  }

  // My turn — gems mode
  if (mode === 'gems') {
    return (
      <div style={wrapStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-sapphire)',
                fontSize: 16,
              }}
            >
              {pickedTotal}
              <span style={{ color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }}>/3</span>
            </span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>essences selected</span>
          </div>
          <Btn label="CANCEL" col="#9a8ea8" onClick={onCancelGems} size="md" />
          <Btn label="CONFIRM" col="#52cf7a" onClick={onConfirmGems} disabled={pickedTotal === 0} size="md" />
        </div>
      </div>
    );
  }

  // My turn — reserve mode
  if (mode === 'reserve') {
    return (
      <div style={wrapStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              color: 'var(--accent-violet)',
              fontSize: 11,
              fontFamily: 'var(--font-ui)',
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            Tap any reagent or a deck pile to reserve it. You receive an aurum (wild) token.
          </span>
          <Btn label="CANCEL" col="#9a8ea8" onClick={onCancelReserve} size="md" />
        </div>
      </div>
    );
  }

  // My turn — default (no mode): subtle hint
  if (isMyTurn) {
    return (
      <div style={wrapStyle}>
        <span
          style={{
            color: 'var(--text-tertiary)',
            fontSize: 11,
            fontFamily: 'var(--font-ui)',
            fontWeight: 500,
            letterSpacing: 1,
            padding: '2px 4px',
          }}
        >
          Tap an essence to take · tap ★ to reserve · tap a card to buy
        </span>
      </div>
    );
  }

  return null;
}
