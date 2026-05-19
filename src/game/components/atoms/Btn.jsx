export default function Btn({ label, col, onClick, disabled, fullWidth, size = 'md' }) {
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '7px 12px' : '11px 18px';
  const fs = size === 'lg' ? 12 : size === 'sm' ? 9 : 10;
  const minH = size === 'lg' ? 48 : size === 'sm' ? 32 : 44;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        padding: pad,
        minHeight: minH,
        borderRadius: 'var(--r-md)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : col + '88'}`,
        background: disabled ? 'rgba(255,255,255,0.02)' : `${col}14`,
        backdropFilter: 'var(--blur-sm)',
        WebkitBackdropFilter: 'var(--blur-sm)',
        color: disabled ? 'rgba(255,255,255,0.18)' : col,
        fontFamily: 'var(--font-ui)',
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: 1.5,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : `0 0 18px ${col}22, var(--glass-highlight)`,
        transition: 'transform var(--dur-fast) var(--ease-std), box-shadow var(--dur-base), background var(--dur-base)',
        width: fullWidth ? '100%' : undefined,
        touchAction: 'manipulation',
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onTouchStart={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {label}
    </button>
  );
}
