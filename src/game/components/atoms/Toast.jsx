export default function Toast({ message, tone = 'warn' }) {
  if (!message) return null;
  const palette =
    tone === 'warn'
      ? { color: 'var(--accent-ruby)', bg: 'rgba(240,96,96,0.18)', border: 'rgba(240,96,96,0.55)' }
      : { color: 'var(--accent-sapphire)', bg: 'rgba(106,180,248,0.18)', border: 'rgba(106,180,248,0.55)' };
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'calc(64px + env(safe-area-inset-top))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        padding: '10px 16px',
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 'var(--r-md)',
        backdropFilter: 'var(--blur-md)',
        WebkitBackdropFilter: 'var(--blur-md)',
        color: palette.color,
        fontFamily: 'var(--font-ui)',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.3,
        boxShadow: '0 10px 28px rgba(0,0,0,0.45), var(--glass-highlight)',
        animation: 'toast-in var(--dur-base) var(--ease-out) both',
        maxWidth: 'calc(100% - 32px)',
        textAlign: 'center',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {message}
    </div>
  );
}
