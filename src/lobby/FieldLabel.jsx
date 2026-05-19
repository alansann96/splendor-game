export default function FieldLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 10,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        letterSpacing: 2,
        marginBottom: 8,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </div>
  );
}
