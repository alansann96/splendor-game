import { useState } from 'react';
import Splendor from './game/components/Splendor';
import Lobby from './lobby/Lobby';
import OnlineGame from './lobby/OnlineGame';
import { LobbyBackBtn } from './lobby/RoomChips';
import WaitingRoom from './lobby/WaitingRoom';
import { fetchRoom, getClientId, newCode, publishRoom, publishSlots } from './useRoom';

export default function App() {
  const [view, setView] = useState('lobby');
  const [slots, setSlots] = useState(null);
  const [myIdx, setMyIdx] = useState(0);
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const startSolo = (humanName, aiList) => {
    const s = [{ name: humanName || 'You', kind: 'human' }];
    aiList.forEach((d, i) => s.push({ name: `AI ${i + 1} (${d})`, kind: 'ai', aiDifficulty: d }));
    setSlots(s);
    setMyIdx(0);
    setRoomCode(null);
    setIsHost(false);
    setView('game');
  };

  const handleCreate = async (myName, playerCount) => {
    const code = newCode();
    const clientId = getClientId();
    const rs = Array.from({ length: playerCount }, (_, i) =>
      i === 0 ? { kind: 'human', name: myName || 'Host', clientId } : { kind: 'open', name: `Slot ${i + 1}` },
    );
    await publishRoom(code, { hostClientId: clientId, slots: rs, started: false, createdAt: Date.now() });
    setRoomCode(code);
    setIsHost(true);
    setMyIdx(0);
    setView('waiting');
  };

  const handleJoin = async (code, name) => {
    const cu = code.toUpperCase().trim();
    const room = await fetchRoom(cu);
    if (!room) {
      alert('Room not found');
      return;
    }
    if (room.started) {
      alert('Game already started');
      return;
    }
    const rs = Array.isArray(room.slots) ? [...room.slots] : Object.values(room.slots || {});
    const openIdx = rs.findIndex((s) => s && s.kind === 'open');
    if (openIdx === -1) {
      alert('No open slots');
      return;
    }
    const clientId = getClientId();
    rs[openIdx] = { kind: 'human', name: name || 'Player', clientId };
    await publishSlots(cu, rs);
    setRoomCode(cu);
    setIsHost(false);
    setMyIdx(openIdx);
    setView('waiting');
  };

  const backToLobby = () => {
    setSlots(null);
    setRoomCode(null);
    setIsHost(false);
    setView('lobby');
  };

  if (view === 'game' && !roomCode) {
    return (
      <div style={{ position: 'relative' }}>
        <Splendor key={JSON.stringify(slots)} initialSlots={slots} myPlayerIndex={myIdx} />
        <LobbyBackBtn onClick={backToLobby} />
      </div>
    );
  }

  if (view === 'waiting') {
    return (
      <WaitingRoom
        code={roomCode}
        myIdx={myIdx}
        isHost={isHost}
        onStart={() => setView('game')}
        onLeave={backToLobby}
      />
    );
  }

  if (view === 'game' && roomCode) {
    return <OnlineGame code={roomCode} myIdx={myIdx} isHost={isHost} onLeave={backToLobby} />;
  }

  return <Lobby onStartSolo={startSolo} onCreate={handleCreate} onJoin={handleJoin} />;
}
