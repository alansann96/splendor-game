import { DIFFS, DIFF_HEX } from './styles';

export default function DifficultyToggle({ current, onSet }) {
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {DIFFS.map((dd) => {
        const active = current === dd;
        const col = DIFF_HEX[dd];
        return (
          <button
            key={dd}
            onClick={() => onSet(dd)}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--r-sm)',
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1,
              cursor: 'pointer',
              border: `1px solid ${active ? col : 'rgba(255,255,255,0.10)'}`,
              background: active ? `${col}22` : 'transparent',
              color: active ? col : 'var(--text-tertiary)',
              transition: 'all var(--dur-base) var(--ease-std)',
            }}
          >
            {dd.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
