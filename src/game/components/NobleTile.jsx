import { GB, GC, NOBLE_SYM } from '../constants';
import Dot from './atoms/Dot';

export default function NobleTile({ noble }) {
  return (
    <div
      style={{
        padding: '8px 10px',
        borderRadius: 'var(--r-md)',
        background: 'linear-gradient(150deg, #221808, #140e04)',
        border: '1px solid rgba(240,200,64,0.35)',
        minWidth: 88,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 8px 22px rgba(240,200,64,0.10), var(--glass-highlight)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>{NOBLE_SYM[(noble.id - 1) % NOBLE_SYM.length]}</span>
        <span
          style={{
            color: 'var(--accent-gold)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 19,
            lineHeight: 1,
          }}
        >
          {noble.pts}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {Object.entries(noble.req).map(([c, cnt]) => (
          <div
            key={c}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              borderRadius: 'var(--r-sm)',
              padding: '2px 5px',
              background: GB[c],
              border: `1px solid ${GC[c]}33`,
            }}
          >
            <Dot col={c} sz={8} />
            <span
              style={{
                color: GC[c],
                fontFamily: 'var(--font-display)',
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {cnt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
