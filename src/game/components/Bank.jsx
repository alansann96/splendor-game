import { GC, GEMS, GNAME } from '../constants';
import Gem from './atoms/Gem';

export default function Bank({ game, mob, mode, picked, canPick, onPickGem }) {
  return (
    <div
      style={{
        padding: mob ? '10px 12px' : '12px 14px',
        background: 'var(--glass-bg)',
        border: `1px solid ${mode === 'gems' ? 'rgba(106,180,248,0.45)' : 'var(--glass-border)'}`,
        borderRadius: 'var(--r-lg)',
        backdropFilter: 'var(--blur-md)',
        WebkitBackdropFilter: 'var(--blur-md)',
        boxShadow: mode === 'gems' ? '0 0 24px rgba(106,180,248,0.12), var(--glass-highlight)' : 'var(--glass-highlight)',
        transition: 'all var(--dur-base)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 9,
          color: mode === 'gems' ? 'var(--accent-sapphire)' : 'var(--text-tertiary)',
          letterSpacing: 2,
          marginBottom: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        {mode === 'gems' ? 'Tap gems · up to 3 different, or 2 same (need 4+)' : 'Gem Bank'}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'center' }}>
        {GEMS.map((col) => {
          const canP = canPick(col);
          const p = picked[col] || 0;
          const avail = game.bank[col] - p;
          return (
            <div
              key={col}
              onClick={canP ? () => onPickGem(col) : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                cursor: canP ? 'pointer' : 'default',
                opacity: avail <= 0 && !p ? 0.18 : 1,
                transition: 'opacity 0.2s, transform var(--dur-fast)',
                padding: 4,
                borderRadius: 'var(--r-sm)',
              }}
              onMouseDown={(e) => canP && (e.currentTarget.style.transform = 'scale(0.93)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onTouchStart={(e) => canP && (e.currentTarget.style.transform = 'scale(0.93)')}
              onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Gem col={col} size={50} count={p || null} picked={p > 0} glow={canP || p > 0} dimmed={!canP && !p && mode === 'gems'} />
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: GC[col],
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {avail}
                </div>
                <div
                  style={{
                    color: 'var(--text-tertiary)',
                    fontSize: 8,
                    letterSpacing: 1.5,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  {GNAME[col].slice(0, 3).toUpperCase()}
                </div>
              </div>
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            opacity: game.bank.gold ? 1 : 0.18,
            padding: 4,
          }}
        >
          <div style={{ position: 'relative', width: 50, height: 50 }}>
            <Gem col="gold" size={50} />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 900,
                color: '#fff',
                textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                lineHeight: 1,
              }}
            >
              ★
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: GC.gold,
                fontFamily: 'var(--font-display)',
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {game.bank.gold}
            </div>
            <div
              style={{
                color: 'var(--text-tertiary)',
                fontSize: 8,
                letterSpacing: 1.5,
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              WILD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
