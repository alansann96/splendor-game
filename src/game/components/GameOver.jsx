import GemOrbs from '../../components/GemOrbs';

export default function GameOver({ game, myName, canRestart, onRestart }) {
  const won = game.winner === myName;
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        gap: 28,
        padding: 32,
        position: 'relative',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <GemOrbs />

      <div
        style={{
          fontSize: 88,
          animation: 'gp 2.5s ease-in-out infinite',
          filter: `drop-shadow(0 0 28px ${won ? 'rgba(240,200,64,0.9)' : 'rgba(120,120,120,0.6)'})`,
        }}
      >
        {won ? '♛' : '♟'}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          color: 'var(--accent-gold)',
          fontSize: 32,
          letterSpacing: 6,
          textAlign: 'center',
          textShadow: '0 0 24px rgba(240,200,64,0.35)',
        }}
      >
        {game.winner} WINS
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480 }}>
        {game.players.map((p, i) => {
          const isWinner = p.name === game.winner;
          return (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '20px 28px',
                borderRadius: 'var(--r-lg)',
                border: `1px solid ${isWinner ? 'rgba(240,200,64,0.55)' : 'var(--glass-border)'}`,
                background: isWinner ? 'rgba(34,24,8,0.55)' : 'var(--glass-bg)',
                backdropFilter: 'var(--blur-md)',
                WebkitBackdropFilter: 'var(--blur-md)',
                boxShadow: isWinner
                  ? '0 0 40px rgba(240,200,64,0.25), var(--glass-highlight)'
                  : 'var(--glass-highlight)',
                minWidth: 130,
              }}
            >
              <div
                style={{
                  color: isWinner ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontSize: 10,
                  letterSpacing: 2.5,
                  marginBottom: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: 60,
                  fontWeight: 900,
                  color: 'var(--accent-gold)',
                  lineHeight: 1,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {p.points}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 10, marginTop: 10, letterSpacing: 1 }}>
                {p.cards.length} cards
              </div>
            </div>
          );
        })}
      </div>

      {canRestart ? (
        <button
          onClick={onRestart}
          style={{
            padding: '14px 38px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--accent-gold)',
            background: 'rgba(240,200,64,0.12)',
            backdropFilter: 'var(--blur-sm)',
            WebkitBackdropFilter: 'var(--blur-sm)',
            color: 'var(--accent-gold)',
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 3,
            boxShadow: '0 0 32px rgba(240,200,64,0.25), var(--glass-highlight)',
          }}
        >
          PLAY AGAIN
        </button>
      ) : (
        <div style={{ color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 2 }}>
          Waiting for host to start a new game…
        </div>
      )}
    </div>
  );
}
