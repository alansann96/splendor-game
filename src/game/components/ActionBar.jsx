import { MAX_RESERVED } from '../constants';
import Btn from './atoms/Btn';
import DiscardPanel from './DiscardPanel';

export default function ActionBar({
  phase,
  mode,
  isMyTurn,
  isAITurn,
  cur,
  me,
  picked,
  pickedTotal,
  discQ,
  overBy,
  discTotal,
  onTakeMode,
  onReserveMode,
  onConfirmGems,
  onCancelGems,
  onResetPicked,
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
            {pickedTotal > 0 && (
              <span
                onClick={onResetPicked}
                style={{
                  color: 'var(--text-tertiary)',
                  fontSize: 11,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                reset
              </span>
            )}
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

  // My turn — default (no mode)
  if (isMyTurn) {
    const reserveFull = me.reserved.length >= MAX_RESERVED;
    return (
      <div style={wrapStyle}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
          <PrimaryActionBtn label="TAKE ESSENCES" col="#6ab4f8" onClick={onTakeMode} icon="◆" />
          <PrimaryActionBtn
            label="RESERVE"
            sublabel={`${me.reserved.length}/${MAX_RESERVED}`}
            col="#c858e0"
            onClick={reserveFull ? undefined : onReserveMode}
            icon="⊟"
            disabled={reserveFull}
          />
        </div>
      </div>
    );
  }

  return null;
}

function PrimaryActionBtn({ label, sublabel, col, onClick, icon, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: '12px 14px',
        borderRadius: 'var(--r-md)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : col + '99'}`,
        background: disabled ? 'rgba(255,255,255,0.02)' : `${col}18`,
        backdropFilter: 'var(--blur-sm)',
        WebkitBackdropFilter: 'var(--blur-sm)',
        color: disabled ? 'rgba(255,255,255,0.22)' : col,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : `0 0 22px ${col}28, var(--glass-highlight)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 48,
        transition: 'transform var(--dur-fast) var(--ease-std), box-shadow var(--dur-base), background var(--dur-base)',
        touchAction: 'manipulation',
      }}
      onTouchStart={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <span style={{ fontSize: 16, opacity: 0.9 }}>{icon}</span>
      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            style={{
              fontSize: 9,
              opacity: 0.65,
              letterSpacing: 1,
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            {sublabel}
          </span>
        )}
      </span>
    </button>
  );
}
