import GemOrbs from '../components/GemOrbs';
import { shellStyle } from './styles';

export default function CenterMessage({ title, body, actionLabel, onAction }) {
  return (
    <div style={shellStyle}>
      <GemOrbs />
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          alignItems: 'center',
          padding: '28px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--r-lg)',
          backdropFilter: 'var(--blur-md)',
          WebkitBackdropFilter: 'var(--blur-md)',
          boxShadow: 'var(--glass-highlight), var(--glass-shadow)',
          maxWidth: 380,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 22,
            color: 'var(--accent-gold)',
            letterSpacing: 2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
            lineHeight: 1.55,
          }}
        >
          {body}
        </div>
        {actionLabel && (
          <button
            onClick={onAction}
            style={{
              padding: '10px 22px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--accent-gold)',
              background: 'rgba(240,200,64,0.10)',
              color: 'var(--accent-gold)',
              fontFamily: 'var(--font-ui)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2.5,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(240,200,64,0.18)',
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
