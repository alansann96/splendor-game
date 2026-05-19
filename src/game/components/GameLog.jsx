import { useState } from 'react';

export default function GameLog({ log }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? log : log.slice(0, 1);

  return (
    <div
      style={{
        padding: '8px 12px',
        background: 'var(--glass-bg)',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--glass-border)',
        backdropFilter: 'var(--blur-sm)',
        WebkitBackdropFilter: 'var(--blur-sm)',
      }}
    >
      <div
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: visible.length ? 4 : 0,
        }}
      >
        <span
          style={{
            fontSize: 8,
            color: 'var(--text-tertiary)',
            letterSpacing: 2,
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          Game log
        </span>
        <span
          style={{
            color: 'var(--text-tertiary)',
            fontSize: 11,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--dur-base)',
          }}
        >
          ▾
        </span>
      </div>
      {visible.map((msg, i) => (
        <div
          key={i}
          style={{
            fontSize: 10,
            color: i === 0 ? 'rgba(255,255,255,0.78)' : 'var(--text-tertiary)',
            lineHeight: 1.6,
            paddingBottom: i === 0 && expanded ? 3 : 0,
            borderBottom: i === 0 && expanded ? '1px solid rgba(255,255,255,0.05)' : 'none',
            marginBottom: i === 0 && expanded ? 4 : 0,
          }}
        >
          {msg}
        </div>
      ))}
    </div>
  );
}
