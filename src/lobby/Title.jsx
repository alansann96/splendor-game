export default function Title({ size = 'lg' }) {
  const titleFs = size === 'sm' ? 20 : 34;
  const subFs = size === 'sm' ? 8 : 10;
  const sparkFs = size === 'sm' ? 32 : 56;
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: sparkFs,
          color: 'var(--accent-gold)',
          animation: 'sh 3s ease-in-out infinite',
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        ✦
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          color: 'var(--accent-gold)',
          fontSize: titleFs,
          letterSpacing: size === 'sm' ? 2 : 4,
          lineHeight: 1,
        }}
      >
        ARCANE ESSENCES
      </div>
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          color: 'rgba(240,200,64,0.55)',
          fontSize: subFs,
          letterSpacing: 4,
          marginTop: 4,
          fontWeight: 500,
        }}
      >
        A GAME OF PRESTIGE
      </div>
    </div>
  );
}
