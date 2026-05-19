import { GEMS } from '../constants';
import { canAfford, getBonus, goldNeed, totalTok } from '../engine/helpers';

export const aiDecideMedium = (g, pi) => {
  const ai = g.players[pi];
  const fu = [...g.board[3], ...g.board[2], ...g.board[1]].filter(Boolean);

  // 1. Buy the highest-point affordable card (prefer fewer gold spent on ties).
  const buy = fu.filter((c) => canAfford(ai, c));
  if (buy.length) {
    buy.sort((a, b) => b.p - a.p || goldNeed(ai, a) - goldNeed(ai, b));
    return { type: 'buy', card: buy[0], fromRes: false };
  }

  // 2. Buy from reserved if any are affordable.
  const buyR = ai.reserved.filter((c) => canAfford(ai, c));
  if (buyR.length) {
    buyR.sort((a, b) => b.p - a.p);
    return { type: 'buy', card: buyR[0], fromRes: true };
  }

  // 3. Pick gems toward the closest target card.
  const targs = [...fu, ...ai.reserved].filter(Boolean);
  targs.sort((a, b) => {
    const da = Object.entries(a.c).reduce((s, [c, v]) => s + Math.max(0, v - getBonus(ai, c) - (ai.tokens[c] || 0)), 0);
    const db = Object.entries(b.c).reduce((s, [c, v]) => s + Math.max(0, v - getBonus(ai, c) - (ai.tokens[c] || 0)), 0);
    return da - db || b.p - a.p;
  });
  const tk = totalTok(ai);
  if (targs.length && tk <= 8) {
    const tg = targs[0];
    const need = {};
    for (const [c, v] of Object.entries(tg.c)) {
      const n = Math.max(0, v - getBonus(ai, c) - (ai.tokens[c] || 0));
      if (n > 0 && g.bank[c] > 0) need[c] = n;
    }
    const wc = Object.keys(need);
    if (wc.length >= 3) return { type: 'take', gems: { [wc[0]]: 1, [wc[1]]: 1, [wc[2]]: 1 } };
    if (wc.length === 2) return { type: 'take', gems: { [wc[0]]: 1, [wc[1]]: 1 } };
    if (wc.length === 1) {
      if (g.bank[wc[0]] >= 4) return { type: 'take', gems: { [wc[0]]: 2 } };
      return { type: 'take', gems: { [wc[0]]: 1 } };
    }
  }

  // 4. Otherwise grab any available gems.
  const av = GEMS.filter((c) => g.bank[c] > 0);
  if (av.length >= 3 && tk <= 7) return { type: 'take', gems: { [av[0]]: 1, [av[1]]: 1, [av[2]]: 1 } };
  if (av.length >= 2 && tk <= 8) return { type: 'take', gems: { [av[0]]: 1, [av[1]]: 1 } };
  if (av.length >= 1 && tk <= 9) return { type: 'take', gems: { [av[0]]: 1 } };

  // 5. Reserve the top card if anything is available.
  if (ai.reserved.length < 3 && fu.length > 0) {
    const best = [...fu].sort((a, b) => b.p - a.p)[0];
    if (best) return { type: 'reserve', card: best };
  }

  return { type: 'pass' };
};
