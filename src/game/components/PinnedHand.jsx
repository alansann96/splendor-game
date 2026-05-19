import { GB, GC, GEMS, WIN_POINTS } from '../constants';
import { canAfford, getBonus, totalTok } from '../engine/helpers';
import CardTile from './CardTile';
import Dot from './atoms/Dot';
import Gem from './atoms/Gem';

export default function PinnedHand({ player, isActive, myTurn, mode, flashCard, onBuyReserved }) {
  const bonuses = GEMS.reduce((a, c) => ({ ...a, [c]: getBonus(player, c) }), {});
  const hasBonuses = Object.values(bonuses).some((v) => v > 0);

  return (
    <div
      style={{
        background: 'rgba(11,9,24,0.62)',
        borderTop: '1px solid var(--glass-border)',
        backdropFilter: 'var(--blur-lg)',
        WebkitBackdropFilter: 'var(--blur-lg)',
        padding: '10px 14px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        boxShadow: isActive ? '0 -8px 28px rgba(240,200,64,0.08)' : 'none',
      }}
    >
      {/* Header row: name + points */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {player.name} <span style={{ color: 'var(--text-tertiary)' }}>· you</span>
          </span>
          {isActive && (
            <span
              style={{
                color: 'var(--accent-gold)',
                fontSize: 8,
                letterSpacing: 2,
                fontWeight: 700,
                animation: 'pu 1s infinite',
              }}
            >
              ACTIVE
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, flexShrink: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--accent-gold)',
              fontWeight: 900,
              fontSize: 22,
              lineHeight: 1,
            }}
          >
            {player.points}
          </span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 11, fontWeight: 500 }}>/{WIN_POINTS}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, (player.points / WIN_POINTS) * 100)}%`,
            background: 'linear-gradient(90deg, var(--accent-gold), #f0a040)',
            transition: 'width 0.6s var(--ease-out)',
          }}
        />
      </div>

      {/* Tokens row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
        {[...GEMS, 'gold'].map(
          (c) =>
            (player.tokens[c] || 0) > 0 && (
              <div
                key={c}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  borderRadius: 'var(--r-sm)',
                  padding: '3px 7px',
                  background: GB[c] || '#1a1a28',
                  border: `1px solid ${GC[c]}33`,
                }}
              >
                <Gem col={c} size={14} />
                <span
                  style={{
                    color: GC[c],
                    fontFamily: 'var(--font-display)',
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {player.tokens[c]}
                </span>
              </div>
            ),
        )}
        <span style={{ color: 'var(--text-tertiary)', fontSize: 9, alignSelf: 'center', marginLeft: 2 }}>
          ({totalTok(player)}/10)
        </span>

        {hasBonuses && (
          <>
            <span
              style={{
                color: 'var(--text-tertiary)',
                fontSize: 9,
                margin: '0 4px',
                opacity: 0.4,
              }}
            >
              |
            </span>
            {GEMS.filter((c) => bonuses[c] > 0).map((c) => (
              <div
                key={c}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  borderRadius: 'var(--r-sm)',
                  padding: '2px 6px',
                  background: 'transparent',
                  border: `1px solid ${GC[c]}55`,
                }}
              >
                <Dot col={c} sz={8} />
                <span
                  style={{
                    color: GC[c],
                    fontFamily: 'var(--font-display)',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  +{bonuses[c]}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Reserved cards strip */}
      {player.reserved.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            paddingTop: 4,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: 'var(--text-tertiary)',
              letterSpacing: 1,
              alignSelf: 'center',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            RES
          </span>
          {player.reserved.map((card) => (
            <CardTile
              key={card.id}
              card={card}
              small
              onClick={() => onBuyReserved(card)}
              canBuy={myTurn && !mode && canAfford(player, card)}
              mode={null}
              flash={flashCard === card.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
