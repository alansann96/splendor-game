import { GB, GC, GEMS } from '../constants';
import { getBonus, totalTok } from '../engine/helpers';
import Dot from './atoms/Dot';

export default function OpponentStrip({ players, activeTurn, myPlayerIndex }) {
  const opponents = players.map((p, i) => ({ p, i })).filter((x) => x.i !== myPlayerIndex);
  if (!opponents.length) return null;

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        padding: '2px 2px',
      }}
    >
      {opponents.map(({ p, i }) => {
        const active = i === activeTurn;
        const bonuses = GEMS.reduce((a, c) => ({ ...a, [c]: getBonus(p, c) }), {});
        const hasBonuses = Object.values(bonuses).some((v) => v > 0);
        return (
          <div
            key={i}
            style={{
              flexShrink: 0,
              minWidth: 160,
              maxWidth: 220,
              padding: '8px 10px',
              borderRadius: 'var(--r-md)',
              background: active ? 'rgba(19,16,42,0.7)' : 'var(--glass-bg)',
              border: `1px solid ${active ? 'rgba(240,200,64,0.4)' : 'var(--glass-border)'}`,
              backdropFilter: 'var(--blur-sm)',
              WebkitBackdropFilter: 'var(--blur-sm)',
              boxShadow: active ? '0 0 18px rgba(240,200,64,0.10)' : 'var(--glass-highlight)',
              transition: 'all var(--dur-slow) var(--ease-out)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: 1.5,
                  color: active ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 110,
                }}
              >
                {p.name}
                {p.kind === 'ai' && ' (AI)'}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--accent-gold)',
                    fontWeight: 900,
                    fontSize: 16,
                    lineHeight: 1,
                  }}
                >
                  {p.points}
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 9 }}>/15</span>
              </div>
            </div>

            {hasBonuses && (
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: 4 }}>
                {GEMS.filter((c) => bonuses[c] > 0).map((c) => (
                  <div
                    key={c}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: 4,
                      padding: '1px 5px',
                      background: GB[c],
                      border: `1px solid ${GC[c]}40`,
                    }}
                  >
                    <Dot col={c} sz={6} />
                    <span style={{ color: GC[c], fontSize: 9, fontWeight: 700 }}>+{bonuses[c]}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: 'var(--text-tertiary)' }}>
              <span>{totalTok(p)} tokens</span>
              {p.reserved.length > 0 && <span>{p.reserved.length} reserved</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
