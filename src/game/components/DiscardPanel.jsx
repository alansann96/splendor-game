import { GC, GEMS } from '../constants';
import Btn from './atoms/Btn';
import Gem from './atoms/Gem';

export default function DiscardPanel({ me, discQ, overBy, discTotal, onPick, onConfirm, onReset }) {
  const remaining = Math.max(0, overBy - discTotal);
  return (
    <div>
      <div
        style={{
          color: 'var(--accent-ruby)',
          fontSize: 11,
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          letterSpacing: 1.5,
          marginBottom: 8,
          textTransform: 'uppercase',
        }}
      >
        ⚠ Discard {remaining} gem{remaining === 1 ? '' : 's'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {[...GEMS, 'gold'].map((c) => {
          const have = me.tokens[c] || 0;
          const disc = discQ[c] || 0;
          if (!have) return null;
          const can = have - disc > 0;
          return (
            <div
              key={c}
              onClick={() => can && onPick(c)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 9px',
                borderRadius: 'var(--r-sm)',
                cursor: can ? 'pointer' : 'default',
                background: disc ? 'rgba(240,96,96,0.18)' : 'var(--glass-bg)',
                border: `1px solid ${disc ? 'rgba(240,96,96,0.5)' : GC[c] + '33'}`,
                transition: 'all var(--dur-base)',
              }}
            >
              <Gem col={c} size={18} />
              <span style={{ color: GC[c], fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700 }}>{have - disc}</span>
              {disc > 0 && <span style={{ color: 'var(--accent-ruby)', fontSize: 9, fontWeight: 700 }}>−{disc}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {remaining === 0 && <Btn label="CONFIRM" col="#52cf7a" onClick={onConfirm} size="md" />}
        <Btn label="RESET" col="#9a8ea8" onClick={onReset} size="md" />
      </div>
    </div>
  );
}
