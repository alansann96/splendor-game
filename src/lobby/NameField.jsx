import FieldLabel from './FieldLabel';

export default function NameField({ value, onChange }) {
  return (
    <div>
      <FieldLabel>Your name</FieldLabel>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={16}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 'var(--r-md)',
          background: 'var(--glass-bg-tint)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'var(--blur-sm)',
          WebkitBackdropFilter: 'var(--blur-sm)',
          color: 'var(--accent-gold)',
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 700,
          outline: 'none',
          transition: 'border-color var(--dur-base)',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--glass-border-lit)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--glass-border)')}
      />
    </div>
  );
}
