import Splendor from '../game/components/Splendor';
import { publishGame, useRoom } from '../useRoom';
import CenterMessage from './CenterMessage';
import { OnlineHeaderChips } from './RoomChips';

function normalizeGame(g) {
  if (!g) return g;
  const arr = (v) => (Array.isArray(v) ? v : v ? Object.values(v) : []);
  return {
    ...g,
    bank: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0, ...(g.bank || {}) },
    board: { 1: arr(g.board?.[1]), 2: arr(g.board?.[2]), 3: arr(g.board?.[3]) },
    deck: { 1: arr(g.deck?.[1]), 2: arr(g.deck?.[2]), 3: arr(g.deck?.[3]) },
    nobles: arr(g.nobles),
    players: arr(g.players).map((p) => ({
      ...p,
      cards: arr(p?.cards),
      reserved: arr(p?.reserved),
      tokens: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0, ...(p?.tokens || {}) },
      points: p?.points || 0,
    })),
    turn: g.turn || 0,
    gameOver: !!g.gameOver,
    finalRound: !!g.finalRound,
  };
}

export default function OnlineGame({ code, myIdx, isHost, onLeave, onOpenHelp }) {
  const { room, error } = useRoom(code);

  if (error) return <CenterMessage title="Connection lost" body={error} actionLabel="BACK TO LOBBY" onAction={onLeave} />;
  if (!room || !room.state) return <CenterMessage title="Loading game…" body={`Code: ${code}`} />;

  const rawSlots = Array.isArray(room.slots) ? room.slots : Object.values(room.slots || {});
  const cleanSlots = rawSlots
    .filter(Boolean)
    .map((s) => ({ name: s.name, kind: s.kind, aiDifficulty: s.aiDifficulty || null }));

  const onPublishGame = (ng) => publishGame(code, ng);
  const syncedGame = normalizeGame(room.state);

  return (
    <div style={{ position: 'relative' }}>
      <Splendor
        key={code}
        syncedGame={syncedGame}
        onPublishGame={onPublishGame}
        isHost={isHost}
        myPlayerIndex={myIdx}
        initialSlots={cleanSlots}
        onOpenHelp={onOpenHelp}
      />
      <OnlineHeaderChips code={code} onLeave={onLeave} />
    </div>
  );
}
