export const DIFFS = ['easy', 'medium', 'hard'];
export const DIFF_COL = {
  easy: 'var(--accent-emerald)',
  medium: 'var(--accent-gold)',
  hard: 'var(--accent-ruby)',
};
export const DIFF_HEX = { easy: '#52cf7a', medium: '#f0c840', hard: '#f06060' };

export const shellStyle = {
  minHeight: '100dvh',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--font-ui)',
  color: 'var(--text-primary)',
  padding: '24px 16px',
  position: 'relative',
};

export const slotRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 14px',
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  borderRadius: 'var(--r-md)',
  backdropFilter: 'var(--blur-sm)',
  WebkitBackdropFilter: 'var(--blur-sm)',
};
