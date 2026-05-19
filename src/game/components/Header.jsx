export default function Header({ game, phase, mob, muteState, onToggleMute, musicMuted, onToggleMusic, onRestart, onOpenHelp, onBackToLobby }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: mob ? '8px 12px calc(8px + env(safe-area-inset-top))' : '10px 18px',
        paddingTop: mob ? 'calc(8px + env(safe-area-inset-top))' : 10,
        background: 'rgba(6,4,14,0.55)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'var(--blur-lg)',
        WebkitBackdropFilter: 'var(--blur-lg)',
        flexShrink: 0,
        gap: mob ? 8 : 14,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        willChange: 'transform',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: mob ? 6 : 10, flexShrink: 0 }}>
        {onBackToLobby && (
          <button
            onClick={onBackToLobby}
            aria-label="Back to lobby"
            title="Back to lobby"
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontSize: mob ? 9 : 10,
              fontWeight: 700,
              letterSpacing: 1.5,
              cursor: 'pointer',
              borderRadius: 'var(--r-sm)',
              padding: mob ? '5px 8px' : '6px 10px',
              minHeight: 32,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            ← {mob ? '' : 'LOBBY'}
          </button>
        )}
        <span style={{ color: 'var(--accent-gold)', fontSize: mob ? 18 : 24, animation: 'sh 3s ease-in-out infinite', lineHeight: 1 }}>✦</span>
        {!mob && (
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                color: 'var(--accent-gold)',
                fontSize: 16,
                letterSpacing: 4,
                lineHeight: 1,
              }}
            >
              ARCANE ESSENCES
            </div>
            <div style={{ color: 'rgba(240,200,64,0.45)', fontSize: 8, letterSpacing: 3, fontWeight: 500, marginTop: 2 }}>
              A GAME OF PRESTIGE
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: mob ? 6 : 14,
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          overflowX: 'auto',
          minWidth: 0,
          scrollbarWidth: 'none',
        }}
      >
        {game.players.map((p, i) => {
          const active = i === game.turn && phase !== 'over';
          const pct = Math.min(100, (p.points / 15) * 100);
          const sz = mob ? 28 : 34;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: mob ? 4 : 7,
                padding: mob ? '3px 6px' : '4px 12px',
                borderRadius: 99,
                background: active ? 'rgba(240,200,64,0.10)' : 'transparent',
                border: `1px solid ${active ? 'rgba(240,200,64,0.45)' : 'transparent'}`,
                transition: 'background var(--dur-slow), border-color var(--dur-slow)',
                flexShrink: 0,
              }}
            >
              {active && <span style={{ color: 'var(--accent-gold)', fontSize: 7, animation: 'pu 1s infinite' }}>▶</span>}
              {!mob && (
                <span
                  style={{
                    color: active ? '#e0c080' : 'var(--text-tertiary)',
                    fontSize: 10,
                    letterSpacing: 1,
                    fontWeight: 500,
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {p.name.toUpperCase()}
                </span>
              )}
              <svg width={sz} height={sz} viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="11" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                <circle
                  cx="15"
                  cy="15"
                  r="11"
                  fill="none"
                  stroke={active ? 'var(--accent-gold)' : 'rgba(154,142,168,0.55)'}
                  strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 11}`}
                  strokeDashoffset={`${2 * Math.PI * 11 * (1 - pct / 100)}`}
                  transform="rotate(-90 15 15)"
                  style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                />
                <text
                  x="15"
                  y="19"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={active ? 'var(--accent-gold)' : 'var(--text-secondary)'}
                  fontFamily="Playfair Display, Georgia, serif"
                >
                  {p.points}
                </text>
              </svg>
            </div>
          );
        })}
        {game.finalRound && (
          <span
            style={{
              color: 'var(--accent-ruby)',
              fontSize: 9,
              letterSpacing: 2,
              animation: 'pu 0.8s infinite',
              flexShrink: 0,
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
            }}
          >
            {mob ? 'FINAL' : 'FINAL ROUND'}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            aria-label="How to play"
            title="How to play"
            style={{
              border: '1px solid rgba(240,200,64,0.35)',
              background: 'rgba(240,200,64,0.08)',
              color: 'var(--accent-gold)',
              fontSize: mob ? 13 : 15,
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              cursor: 'pointer',
              borderRadius: 'var(--r-sm)',
              padding: mob ? '5px 8px' : '6px 10px',
              minWidth: 32,
              minHeight: 32,
              lineHeight: 1,
            }}
          >
            ?
          </button>
        )}
        <button
          onClick={onToggleMusic}
          aria-label={musicMuted ? 'Play music' : 'Pause music'}
          title={musicMuted ? 'Play music' : 'Pause music'}
          style={{
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            color: musicMuted ? 'var(--text-tertiary)' : 'var(--text-secondary)',
            fontSize: mob ? 12 : 14,
            cursor: 'pointer',
            borderRadius: 'var(--r-sm)',
            padding: mob ? '5px 8px' : '6px 10px',
            minWidth: 32,
            minHeight: 32,
            opacity: musicMuted ? 0.5 : 1,
          }}
        >
          {musicMuted ? '🎵̸' : '🎵'}
        </button>
        <button
          onClick={onToggleMute}
          aria-label={muteState ? 'Unmute sound effects' : 'Mute sound effects'}
          title={muteState ? 'Unmute sound effects' : 'Mute sound effects'}
          style={{
            border: '1px solid var(--glass-border)',
            background: 'var(--glass-bg)',
            color: muteState ? 'var(--text-tertiary)' : 'var(--text-secondary)',
            fontSize: mob ? 12 : 14,
            cursor: 'pointer',
            borderRadius: 'var(--r-sm)',
            padding: mob ? '5px 8px' : '6px 10px',
            minWidth: 32,
            minHeight: 32,
          }}
        >
          {muteState ? '🔇' : '🔊'}
        </button>
        {!mob && (
          <button
            onClick={onRestart}
            style={{
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              color: 'var(--text-secondary)',
              fontSize: 9,
              cursor: 'pointer',
              borderRadius: 'var(--r-sm)',
              padding: '6px 12px',
              letterSpacing: 1.5,
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
            }}
          >
            NEW GAME
          </button>
        )}
      </div>
    </div>
  );
}
