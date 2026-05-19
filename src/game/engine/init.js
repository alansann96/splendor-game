import { ALL_CARDS } from '../data/cards';
import { ALL_NOBLES } from '../data/nobles';
import { shuffle } from './helpers';

export const DEFAULT_SLOTS = [
  { name: 'You', kind: 'human' },
  { name: 'AI', kind: 'ai', aiDifficulty: 'medium' },
];

const mkPlayer = (name, kind, aiDifficulty) => ({
  name,
  kind,
  aiDifficulty: aiDifficulty || null,
  tokens: { white: 0, blue: 0, green: 0, red: 0, black: 0, gold: 0 },
  cards: [],
  reserved: [],
  points: 0,
});

export const initGame = (slots) => {
  const cfg = slots && slots.length ? slots : DEFAULT_SLOTS;
  const n = cfg.length;
  const perColor = n <= 2 ? 4 : n === 3 ? 5 : 7;
  const mk = (tier) => {
    const s = shuffle(ALL_CARDS.filter((c) => c.t === tier));
    return { board: s.slice(0, 4), deck: s.slice(4) };
  };
  const t1 = mk(1);
  const t2 = mk(2);
  const t3 = mk(3);
  return {
    bank: { white: perColor, blue: perColor, green: perColor, red: perColor, black: perColor, gold: 5 },
    board: { 1: t1.board, 2: t2.board, 3: t3.board },
    deck: { 1: t1.deck, 2: t2.deck, 3: t3.deck },
    nobles: shuffle(ALL_NOBLES).slice(0, n + 1),
    players: cfg.map((c) => mkPlayer(c.name, c.kind, c.aiDifficulty)),
    turn: 0,
    gameOver: false,
    winner: null,
    finalRound: false,
    finalTrigger: null,
  };
};
