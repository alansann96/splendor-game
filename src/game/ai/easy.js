import { GEMS } from '../constants';
import { canAfford, shuffle, totalTok } from '../engine/helpers';

export const aiDecideEasy = (g, pi) => {
  const ai = g.players[pi];
  const fu = [...g.board[1], ...g.board[2], ...g.board[3]].filter(Boolean);
  const tk = totalTok(ai);
  const r = Math.random();

  const buys = fu.filter((c) => canAfford(ai, c));
  if (buys.length && r < 0.5) {
    return { type: 'buy', card: buys[Math.floor(Math.random() * buys.length)], fromRes: false };
  }

  const av = shuffle(GEMS.filter((c) => g.bank[c] > 0));
  if (av.length >= 3 && tk <= 7 && r < 0.85) return { type: 'take', gems: { [av[0]]: 1, [av[1]]: 1, [av[2]]: 1 } };
  if (av.length >= 2 && tk <= 8) return { type: 'take', gems: { [av[0]]: 1, [av[1]]: 1 } };
  if (av.length >= 1 && tk <= 9) return { type: 'take', gems: { [av[0]]: 1 } };

  if (buys.length) return { type: 'buy', card: buys[0], fromRes: false };

  const buyR = ai.reserved.filter((c) => canAfford(ai, c));
  if (buyR.length) return { type: 'buy', card: buyR[0], fromRes: true };

  if (ai.reserved.length < 3 && fu.length) {
    return { type: 'reserve', card: fu[Math.floor(Math.random() * fu.length)] };
  }

  return { type: 'pass' };
};
