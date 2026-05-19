import { GC, GD } from '../../constants';

export default function Gem({ col, size = 44, count, picked, glow, dimmed }) {
  const highlight = `radial-gradient(circle at 33% 28%, rgba(255,255,255,0.88) 0%, ${GC[col]} 35%, ${GD[col]} 100%)`;
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        background: highlight,
        boxShadow: glow
          ? `0 0 ${size * 0.45}px ${GC[col]}99, 0 0 ${size * 0.2}px ${GC[col]}cc, inset 0 -${size * 0.08}px ${size * 0.12}px ${GD[col]}66`
          : `inset 0 -${size * 0.08}px ${size * 0.1}px ${GD[col]}55`,
        border: `${size * 0.04}px solid rgba(255,255,255,0.22)`,
        transform: picked ? 'scale(1.14)' : 'scale(1)',
        opacity: dimmed ? 0.2 : 1,
        transition: 'transform 0.15s, box-shadow 0.2s, opacity 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '18%',
          width: '30%',
          height: '20%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.7)',
          transform: 'rotate(-30deg)',
        }}
      />
      {count != null && (
        <span
          style={{
            position: 'relative',
            zIndex: 1,
            color: '#fff',
            fontWeight: 900,
            fontSize: size * 0.36,
            lineHeight: 1,
            fontFamily: 'Georgia,serif',
            textShadow: '0 1px 3px rgba(0,0,0,0.85)',
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
