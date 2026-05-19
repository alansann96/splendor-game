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

export function OnlineHeaderChips({ code, onLeave }) {
  const mob = isMobile();
  return (
    <div
      style={{
        position: 'fixed',
        top: 6,
        [mob ? 'left' : 'right']: mob ? 40 : 200,
        display: 'flex',
        gap: 6,
        zIndex: 10,
      }}
    >
      <span style={{ ...chipBase, color: '#f0c840bb', letterSpacing: 2 }}>ROOM {code}</span>
      <button onClick={onLeave} style={{ ...chipBase, color: '#ffffff66', cursor: 'pointer' }}>
        ← LOBBY
      </button>
    </div>
  );
}

export function LobbyBackBtn({ onClick }) {
  const mob = isMobile();
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 6,
        [mob ? 'left' : 'right']: mob ? 40 : 200,
        ...chipBase,
        color: '#ffffff66',
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      ← LOBBY
    </button>
  );
}
