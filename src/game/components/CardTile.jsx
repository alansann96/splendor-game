import { GB, GC, GD, GNAME } from '../constants';
import { useIsMobile } from '../hooks/useIsMobile';
import CardArt from './atoms/CardArt';
import Dot from './atoms/Dot';

export default function CardTile({ card, onClick, canBuy, mode, small, flash }) {
  const mob = useIsMobile();
  const cmp = small || mob;
  // Bumped mobile size from 62x78 → 78x104; small variant stays compact for reserved rail.
  const w = small ? 64 : cmp ? 78 : 92;
  const h = small ? 84 : cmp ? 104 : 118;
  const artH = small ? 36 : cmp ? 46 : 56;

  if (!card) {
    return (
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 'var(--r-md)',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      />
    );
  }

  const tint = GC[card.b];
  const borderColor = mode === 'reserve' ? '#c858e0' : canBuy ? tint : 'rgba(255,255,255,0.10)';
  const borderWidth = canBuy && !mode ? 1.5 : 1;

  return (
    <div
      onClick={onClick}
      style={{
        width: w,
        height: h,
        borderRadius: 'var(--r-md)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        background: `linear-gradient(165deg, ${GB[card.b]}cc 0%, rgba(8,4,18,0.92) 100%)`,
        border: `${borderWidth}px solid ${borderColor}`,
        backdropFilter: 'var(--blur-sm)',
        WebkitBackdropFilter: 'var(--blur-sm)',
        boxShadow:
          canBuy && !mode
            ? `0 0 18px ${tint}55, var(--glass-highlight)`
            : mode === 'reserve'
              ? '0 0 14px #c858e055, var(--glass-highlight)'
              : 'var(--glass-highlight)',
        transform: flash ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform var(--dur-base) var(--ease-out), border-color var(--dur-base), box-shadow var(--dur-base)',
      }}
    >
      <div
        style={{
          height: artH,
          position: 'relative',
          background: `${tint}0d`,
          borderBottom: `1px solid ${tint}26`,
        }}
      >
        <CardArt col={card.b} w={w} h={artH} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: cmp ? '4px 5px' : '5px 7px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 2,
          }}
        >
          {card.p > 0 && (
            <span
              style={{
                color: tint,
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: small ? 16 : cmp ? 19 : 22,
                lineHeight: 1,
                textShadow: `0 0 10px ${tint}99, 0 1px 3px rgba(0,0,0,0.9)`,
              }}
            >
              {card.p}
            </span>
          )}
          <div
            style={{
              width: small ? 12 : 16,
              height: small ? 12 : 16,
              borderRadius: '50%',
              background: `radial-gradient(circle at 33% 28%, rgba(255,255,255,0.85), ${tint} 55%, ${GD[card.b]})`,
              boxShadow: `0 0 8px ${tint}bb`,
              border: '1.5px solid rgba(255,255,255,0.28)',
            }}
          />
        </div>
        {!small && (
          <span
            style={{
              position: 'absolute',
              bottom: 3,
              left: 5,
              color: tint,
              fontSize: 7,
              letterSpacing: 2,
              opacity: 0.55,
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
            }}
          >
            {GNAME[card.b].toUpperCase()}
          </span>
        )}
      </div>
      <div
        style={{
          padding: cmp ? '4px 5px' : '5px 7px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3px 6px',
        }}
      >
        {Object.entries(card.c).map(([c, n]) => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot col={c} sz={small ? 8 : 9} />
            <span
              style={{
                color: GC[c],
                fontFamily: 'var(--font-display)',
                fontSize: small ? 10 : cmp ? 11 : 12,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
