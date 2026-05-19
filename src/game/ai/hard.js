import { GEMS } from '../constants';
import { canAfford, getBonus, totalTok } from '../engine/helpers';
import { doBuy, doNobles, doReserve, doTake } from '../engine/actions';

const evalPlayer = (g, p) => {
  let s = p.points * 100 + p.cards.length * 3;
  for (const c of GEMS) s += getBonus(p, c) * 2;
  s += Object.values(p.tokens).reduce((a, b) => a + b, 0) * 0.3;
  for (const n of g.nobles) {
    const need = Object.entries(n.req).reduce((a, [c, v]) => a + Math.max(0, v - getBonus(p, c)), 0);
    if (need === 0) s += n.pts * 100;
    else s += Math.max(0, 6 - need) * 4;
  }
  return s;
};

export const aiDecideHard = (g, pi) => {
  const ai = g.players[pi];
  const fu = [...g.board[1], ...g.board[2], ...g.board[3]].filter(Boolean);
  const tk = totalTok(ai);

  const cands = [];
  for (const card of fu) if (canAfford(ai, card)) cands.push({ type: 'buy', card, fromRes: false });
  for (const card of ai.reserved) if (canAfford(ai, card)) cands.push({ type: 'buy', card, fromRes: true });

  const av = GEMS.filter((c) => g.bank[c] > 0);
  if (tk <= 7) {
    for (let i = 0; i < av.length; i++) {
      for (let j = i + 1; j < av.length; j++) {
        for (let k = j + 1; k < av.length; k++) {
          cands.push({ type: 'take', gems: { [av[i]]: 1, [av[j]]: 1, [av[k]]: 1 } });
        }
      }
    }
  }
  if (tk <= 8) {
    for (let i = 0; i < av.length; i++) {
      for (let j = i + 1; j < av.length; j++) {
        cands.push({ type: 'take', gems: { [av[i]]: 1, [av[j]]: 1 } });
      }
    }
    for (const c of av) if (g.bank[c] >= 4) cands.push({ type: 'take', gems: { [c]: 2 } });
  }
  if (tk <= 9) for (const c of av) cands.push({ type: 'take', gems: { [c]: 1 } });
  if (ai.reserved.length < 3) for (const card of fu) cands.push({ type: 'reserve', card });

  if (!cands.length) return { type: 'pass' };

  let best = null;
  let bestScore = -Infinity;
  for (const cand of cands) {
    let ng = g;
    if (cand.type === 'buy') ng = doBuy(g, pi, cand.card, cand.fromRes);
    else if (cand.type === 'take') ng = doTake(g, pi, cand.gems);
    else if (cand.type === 'reserve') ng = doReserve(g, pi, cand.card, false, null);
    ng = doNobles(ng, pi);
    const sc = evalPlayer(ng, ng.players[pi]);
    if (sc > bestScore) {
      bestScore = sc;
      best = cand;
    }
  }
  return best;
};
