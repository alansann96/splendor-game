import { useEffect, useRef, useState } from 'react';
import GemOrbs from '../../components/GemOrbs';
import { aiDecide } from '../ai';
import { GEMS, GNAME, MAX_RESERVED, MAX_TOKENS, WIN_POINTS } from '../constants';
import { doBuy, doNobles, doReserve, doTake } from '../engine/actions';
import { canAfford, goldNeed, totalTok } from '../engine/helpers';
import { DEFAULT_SLOTS, initGame } from '../engine/init';
import { useAudio } from '../../audio/AudioProvider';
import { useIsMobile } from '../hooks/useIsMobile';
import ActionBar from './ActionBar';
import Bank from './Bank';
import Board from './Board';
import GameLog from './GameLog';
import GameOver from './GameOver';
import Header from './Header';
import OpponentStrip from './OpponentStrip';
import PinnedHand from './PinnedHand';
import Toast from './atoms/Toast';

export { DEFAULT_SLOTS, initGame };

const AI_TURN_DELAY_MS = 1100;
const FLASH_CARD_MS = 350;
const LOG_LIMIT = 14;
const TOAST_MS = 2500;

export default function Splendor({ initialSlots, myPlayerIndex = 0, syncedGame, onPublishGame, isHost = true, onOpenHelp, onBackToLobby } = {}) {
  const synced = !!onPublishGame;
  const [slots] = useState(initialSlots && initialSlots.length ? initialSlots : DEFAULT_SLOTS);
  const [gameLocal, setGameLocal] = useState(() => syncedGame || initGame(slots));

  const game = synced ? syncedGame || gameLocal : gameLocal;
  const setGame = (ng) => {
    const next = typeof ng === 'function' ? ng(game) : ng;
    if (synced) onPublishGame(next);
    else setGameLocal(next);
  };

  const [phase, setPhase] = useState('acting');
  const [mode, setMode] = useState(null);
  const [picked, setPicked] = useState({});
  const [discQ, setDiscQ] = useState({});
  const [log, setLog] = useState(['✦ Game started!']);
  const [flashCard, setFlashCard] = useState(null);
  const [toast, setToast] = useState(null);

  const { snd, musicMuted, toggleMusic, sndMuted, toggleSnd } = useAudio();
  const mob = useIsMobile();

  const gameRef = useRef(game);
  gameRef.current = game;
  const toastTimerRef = useRef(null);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ msg, id: Date.now() });
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_MS);
  };

  useEffect(() => {
    if (game.gameOver && phase !== 'over') setPhase('over');
  }, [game.gameOver, phase]);

  const me = game.players[myPlayerIndex];
  const cur = game.players[game.turn];
  const isMyTurn = phase === 'acting' && game.turn === myPlayerIndex && cur && cur.kind === 'human';
  const isAITurn = phase === 'acting' && cur && cur.kind === 'ai';

  const addLog = (msg) => setLog((p) => [msg, ...p.slice(0, LOG_LIMIT)]);

  const pickReason = (col) => {
    if (!isMyTurn) return cur && cur.kind === 'ai' ? `${cur.name} is taking their turn` : `Wait for ${cur?.name || 'other player'}`;
    if (mode !== 'gems') return 'Tap "Take Essences" to start picking';
    const tot = Object.values(picked).reduce((a, b) => a + b, 0);
    const c = picked[col] || 0;
    const bk = game.bank[col];
    if (bk - c <= 0) return `No ${GNAME[col]} left in the bank`;
    if (tot >= 3) return 'Max 3 essences per turn — confirm to take them';
    if (Object.values(picked).some((v) => v >= 2)) return 'You already took 2 of one color — confirm to finish';
    if (c === 1) {
      if (Object.keys(picked).some((x) => x !== col && (picked[x] || 0) > 0)) {
        return `Can't combine 2× ${GNAME[col]} with other colors`;
      }
      if (bk < 4) return `Need 4+ in the bank to take 2× ${GNAME[col]}`;
    }
    return null;
  };

  const canPick = (col) => pickReason(col) === null;

  const endTurn = (g) => {
    let ng = doNobles(g, g.turn);
    if (ng.nobles.length < g.nobles.length) {
      snd.noble();
      addLog(`✦ ${ng.players[g.turn].name} earned an archmage!`);
    }
    const justActed = ng.players[g.turn];
    if (justActed.points >= WIN_POINTS && !ng.finalRound) {
      ng = { ...ng, finalRound: true, finalTrigger: g.turn };
      addLog(`⚡ ${justActed.name} hit ${WIN_POINTS} — final round!`);
    }
    const nextTurn = (g.turn + 1) % ng.players.length;
    if (ng.finalRound && nextTurn === ng.finalTrigger) {
      const ranked = ng.players
        .map((p, i) => ({ p, i }))
        .sort((a, b) => b.p.points - a.p.points || a.p.cards.length - b.p.cards.length);
      const winner = ranked[0];
      winner.i === myPlayerIndex ? snd.gameWin() : snd.gameLose();
      setGame({ ...ng, turn: nextTurn, gameOver: true, winner: winner.p.name });
      setPhase('over');
      addLog(`👑 Game over — ${winner.p.name} wins!`);
      return;
    }
    setGame({ ...ng, turn: nextTurn });
    setPhase('acting');
    const nextP = ng.players[nextTurn];
    if (nextTurn === myPlayerIndex) addLog('✦ Your turn!');
    else if (nextP.kind === 'human') addLog(`⏳ ${nextP.name}'s turn`);
  };

  useEffect(() => {
    if (!isAITurn) return;
    if (synced && !isHost) return;
    const timer = setTimeout(() => {
      const g = gameRef.current;
      const pi = g.turn;
      const aiName = g.players[pi].name;
      const act = aiDecide(g, pi);
      let ng = g;
      snd.aiMove();
      if (act.type === 'buy') {
        ng = doBuy(g, pi, act.card, act.fromRes);
        addLog(`🤖 ${aiName} bought ${GNAME[act.card.b]} reagent (+${act.card.p}pts)`);
      } else if (act.type === 'take') {
        ng = doTake(g, pi, act.gems);
        addLog(`🤖 ${aiName} took: ${Object.entries(act.gems).map(([c, n]) => `${n}×${GNAME[c]}`).join(', ')}`);
        const tk = totalTok(ng.players[pi]);
        if (tk > MAX_TOKENS) {
          const tok = { ...ng.players[pi].tokens };
          const bank = { ...ng.bank };
          let ex = tk - MAX_TOKENS;
          for (const c of [...GEMS, 'gold']) {
            if (!ex) break;
            const d = Math.min(tok[c] || 0, ex);
            tok[c] -= d;
            bank[c] += d;
            ex -= d;
          }
          ng = { ...ng, bank, players: ng.players.map((p, i) => (i === pi ? { ...p, tokens: tok } : p)) };
        }
      } else if (act.type === 'reserve') {
        ng = doReserve(g, pi, act.card, false, null);
        addLog(`🤖 ${aiName} reserved a reagent`);
        if (totalTok(ng.players[pi]) > MAX_TOKENS) {
          const tok = { ...ng.players[pi].tokens };
          const bank = { ...ng.bank };
          tok.gold = Math.max(0, tok.gold - 1);
          bank.gold += 1;
          ng = { ...ng, bank, players: ng.players.map((p, i) => (i === pi ? { ...p, tokens: tok } : p)) };
        }
      } else {
        addLog(`🤖 ${aiName} passed`);
      }
      endTurn(ng);
    }, AI_TURN_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAITurn, game.turn]);

  const pickGem = (col) => {
    const reason = pickReason(col);
    if (reason) {
      showToast(reason);
      return;
    }
    snd.gemPick(col);
    setPicked((prev) => ({ ...prev, [col]: (prev[col] || 0) + 1 }));
  };

  const pickGoldAttempt = () => {
    if (!isMyTurn) {
      showToast(cur && cur.kind === 'ai' ? `${cur.name} is taking their turn` : `Wait for ${cur?.name || 'other player'}`);
      return;
    }
    showToast('Aurum is earned by reserving a reagent');
  };

  const confirmGems = () => {
    if (!Object.keys(picked).length) return;
    snd.click();
    const ng = doTake(game, myPlayerIndex, picked);
    addLog(`✦ ${me.name} took: ${Object.entries(picked).map(([c, n]) => `${n}×${GNAME[c]}`).join(', ')}`);
    setPicked({});
    setMode(null);
    if (totalTok(ng.players[myPlayerIndex]) > MAX_TOKENS) {
      setGame(ng);
      setPhase('discard');
      setDiscQ({});
    } else {
      endTurn(ng);
    }
  };

  const cancelGems = () => {
    snd.click();
    setMode(null);
    setPicked({});
  };

  const buyCard = (card, fromRes) => {
    if (!isMyTurn || mode) return;
    if (canAfford(me, card)) {
      snd.cardBuy();
      setFlashCard(card.id);
      setTimeout(() => setFlashCard(null), FLASH_CARD_MS);
      const ng = doBuy(game, myPlayerIndex, card, fromRes);
      addLog(`✦ ${me.name} bought ${GNAME[card.b]} reagent (+${card.p}pts)${fromRes ? ' [reserved]' : ''}`);
      endTurn(ng);
    } else {
      addLog(`✗ Need ${goldNeed(me, card)} more gold`);
    }
  };

  const reserveCard = (card, fromDeck, tier) => {
    if (!isMyTurn) return;
    if (me.reserved.length >= MAX_RESERVED) {
      addLog(`✗ Max ${MAX_RESERVED} reserved reagents`);
      return;
    }
    snd.reserve();
    const ng = doReserve(game, myPlayerIndex, card, fromDeck, tier);
    addLog(
      `✦ ${me.name} reserved ${fromDeck ? `tier-${tier} reagent` : GNAME[card.b] + ' reagent'}${
        ng.bank.gold !== game.bank.gold ? ' (+aurum)' : ''
      }`,
    );
    setMode(null);
    if (totalTok(ng.players[myPlayerIndex]) > MAX_TOKENS) {
      setGame(ng);
      setPhase('discard');
      setDiscQ({});
    } else {
      endTurn(ng);
    }
  };

  const pickDiscard = (col) => {
    setDiscQ((prev) => ({ ...prev, [col]: (prev[col] || 0) + 1 }));
  };

  const confirmDiscard = () => {
    const tk = totalTok(me);
    const nd = Object.values(discQ).reduce((a, b) => a + b, 0);
    if (tk - nd > MAX_TOKENS) {
      addLog(`✗ Discard ${tk - MAX_TOKENS - nd} more`);
      return;
    }
    const tok = { ...me.tokens };
    const bank = { ...game.bank };
    for (const [c, n] of Object.entries(discQ)) {
      tok[c] -= n;
      bank[c] += n;
    }
    snd.discard();
    const ng = { ...game, bank, players: game.players.map((p, i) => (i === myPlayerIndex ? { ...p, tokens: tok } : p)) };
    setDiscQ({});
    endTurn(ng);
  };

  const restart = () => {
    if (synced && !isHost) return;
    snd.click();
    const restartSlots =
      synced && game.players
        ? game.players.map((p) => ({ name: p.name, kind: p.kind, aiDifficulty: p.aiDifficulty }))
        : slots;
    setGame(initGame(restartSlots));
    setPhase('acting');
    setMode(null);
    setPicked({});
    setDiscQ({});
    setLog(['✦ New game started!']);
  };

  const onCardClick = (card) => {
    if (!isMyTurn) return;
    if (mode === 'reserve') reserveCard(card, false, null);
    else if (!mode) buyCard(card, false);
  };

  if (phase === 'over' || game.gameOver) {
    return <GameOver game={game} myName={me.name} canRestart={!synced || isHost} onRestart={restart} />;
  }

  const pickedTotal = Object.values(picked).reduce((a, b) => a + b, 0);
  const discTotal = Object.values(discQ).reduce((a, b) => a + b, 0);
  const overBy = totalTok(me) - MAX_TOKENS;
  const meIsActive = game.turn === myPlayerIndex && phase !== 'over';

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-ui)',
        color: 'var(--text-primary)',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      <GemOrbs />

      <Toast key={toast?.id} message={toast?.msg} />

      <Header
        game={game}
        phase={phase}
        mob={mob}
        muteState={sndMuted}
        onToggleMute={toggleSnd}
        musicMuted={musicMuted}
        onToggleMusic={toggleMusic}
        onRestart={restart}
        onOpenHelp={onOpenHelp}
        onBackToLobby={onBackToLobby}
      />

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          padding: '12px 14px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 760,
          width: '100%',
          margin: '0 auto',
          overflowX: 'hidden',
        }}
      >
        <OpponentStrip players={game.players} activeTurn={game.turn} myPlayerIndex={myPlayerIndex} />

        <Board
          game={game}
          mob={mob}
          mode={mode}
          isMyTurn={isMyTurn}
          me={me}
          flashCard={flashCard}
          onCardClick={onCardClick}
          onReserveFromDeck={(tier) => reserveCard(null, true, tier)}
        />

        <Bank
          game={game}
          mob={mob}
          mode={mode}
          picked={picked}
          canPick={canPick}
          onPickGem={pickGem}
          onPickGold={pickGoldAttempt}
        />

        <GameLog log={log} />
      </div>

      {/* Sticky bottom stack: hand + action bar */}
      <div style={{ position: 'sticky', bottom: 0, zIndex: 9 }}>
        <PinnedHand
          player={me}
          isActive={meIsActive}
          myTurn={isMyTurn}
          mode={mode}
          flashCard={flashCard}
          onBuyReserved={(card) => buyCard(card, true)}
        />
        <ActionBar
          phase={phase}
          mode={mode}
          isMyTurn={isMyTurn}
          isAITurn={isAITurn}
          cur={cur}
          me={me}
          picked={picked}
          pickedTotal={pickedTotal}
          discQ={discQ}
          overBy={overBy}
          discTotal={discTotal}
          onTakeMode={() => {
            snd.click();
            setMode('gems');
          }}
          onReserveMode={() => {
            snd.click();
            setMode('reserve');
          }}
          onConfirmGems={confirmGems}
          onCancelGems={cancelGems}
          onResetPicked={() => setPicked({})}
          onCancelReserve={() => setMode(null)}
          onPickDiscard={pickDiscard}
          onConfirmDiscard={confirmDiscard}
          onResetDiscard={() => setDiscQ({})}
        />
      </div>
    </div>
  );
}
