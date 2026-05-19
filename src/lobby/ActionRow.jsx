export default function ActionRow({ onBack, primaryLabel, onPrimary, primaryDis }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
      <button
        onClick={onBack}
        style={{
          flex: 1,
          padding: '13px 14px',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--blur-sm)',
          WebkitBackdropFilter: 'var(--blur-sm)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2,
          cursor: 'pointer',
          transition: 'border-color var(--dur-base)',
        }}
      >
        BACK
      </button>
      <button
        onClick={onPrimary}
        disabled={primaryDis}
        style={{
          flex: 2,
          padding: '13px 14px',
          borderRadius: 'var(--r-md)',
          border: `1px solid ${primaryDis ? 'rgba(255,255,255,0.06)' : 'var(--accent-gold)'}`,
          background: primaryDis ? 'rgba(255,255,255,0.02)' : 'rgba(240,200,64,0.10)',
          backdropFilter: 'var(--blur-sm)',
          WebkitBackdropFilter: 'var(--blur-sm)',
          color: primaryDis ? 'rgba(255,255,255,0.18)' : 'var(--accent-gold)',
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 3,
          cursor: primaryDis ? 'not-allowed' : 'pointer',
          boxShadow: primaryDis ? 'none' : '0 0 24px rgba(240,200,64,0.20), var(--glass-highlight)',
          transition: 'all var(--dur-base) var(--ease-std)',
        }}
      >
        {primaryLabel}
      </button>
    </div>
  );
}
