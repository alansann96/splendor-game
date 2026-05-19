import { canAfford } from '../engine/helpers';
import CardTile from './CardTile';
import NobleTile from './NobleTile';

const TIER_COLORS = { 1: '#52cf7a', 2: '#6ab4f8', 3: '#c858e0' };

export default function Board({ game, mob, mode, isMyTurn, me, flashCard, onCardClick, onReserveFromDeck }) {
  return (
    <>
      {/* Nobles */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div
          style={{
            width: 38,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: 'rgba(240,200,64,0.55)',
              fontSize: 9,
              letterSpacing: 2,
              textAlign: 'center',
              writingMode: 'vertical-lr',
              transform: 'rotate(180deg)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
            }}
          >
            ARCHMAGES
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', flex: 1 }}>
          {game.nobles.map((n) => (
            <NobleTile key={n.id} noble={n} />
          ))}
        </div>
      </div>

      {/* Subtle divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

      {/* Tiers */}
      {[3, 2, 1].map((tier) => {
        const deckLen = game.deck[tier].length;
        const canTakeDeck = mode === 'reserve' && deckLen > 0;
        const tierColor = TIER_COLORS[tier];
        return (
          <div
            key={tier}
            style={{
              display: 'flex',
              gap: mob ? 6 : 8,
              alignItems: 'center',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: 2,
            }}
          >
            <div
              onClick={canTakeDeck ? () => onReserveFromDeck(tier) : undefined}
              style={{
                width: mob ? 32 : 40,
                minWidth: mob ? 32 : 40,
                height: mob ? 104 : 118,
                borderRadius: 'var(--r-md)',
                flexShrink: 0,
                cursor: canTakeDeck ? 'pointer' : 'default',
                background: `linear-gradient(160deg, ${tierColor}1f, #06040e)`,
                border: `1px solid ${canTakeDeck ? tierColor + 'cc' : tierColor + '40'}`,
                boxShadow: canTakeDeck ? `0 0 16px ${tierColor}55` : 'var(--glass-highlight)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                transition: 'border-color var(--dur-base), box-shadow var(--dur-base)',
              }}
            >
              <span
                style={{
                  color: tierColor,
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 1,
                }}
              >
                {['I', 'II', 'III'][tier - 1]}
              </span>
              <div style={{ width: 18, height: 1, background: `${tierColor}55` }} />
              <span
                style={{
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {deckLen}
              </span>
              {canTakeDeck && (
                <span
                  style={{
                    color: tierColor,
                    fontSize: 8,
                    letterSpacing: 1.5,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Tap
                </span>
              )}
            </div>
            {Array.from({ length: 4 }).map((_, i) => {
              const card = game.board[tier][i];
              return (
                <CardTile
                  key={card ? card.id : `e${tier}${i}`}
                  card={card}
                  onClick={card ? () => onCardClick(card) : undefined}
                  canBuy={!!card && isMyTurn && !mode && canAfford(me, card)}
                  mode={isMyTurn ? mode : null}
                  flash={flashCard === card?.id}
                />
              );
            })}
          </div>
        );
      })}

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
    </>
  );
}
