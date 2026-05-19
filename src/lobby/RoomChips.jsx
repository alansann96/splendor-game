const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 760;

const chipBase = {
  background: '#07050dcc',
  border: '1px solid #ffffff12',
  fontSize: 8,
  borderRadius: 4,
  padding: '3px 8px',
  letterSpacing: 1,
  fontFamily: 'Georgia,serif',
};

export function OnlineHeaderChips({ code }) {
  const mob = isMobile();
  return (
    <div
      style={{
        position: 'fixed',
        top: mob ? 'calc(6px + env(safe-area-inset-top))' : 6,
        right: 12,
        display: 'flex',
        gap: 6,
        zIndex: 11,
        pointerEvents: 'none',
      }}
    >
      <span style={{ ...chipBase, color: '#f0c840bb', letterSpacing: 2 }}>ROOM {code}</span>
    </div>
  );
}
