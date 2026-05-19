import { getBonus } from './helpers';
import { MAX_RESERVED } from '../constants';

export const doTake = (g, pi, gems) => {
  const p = g.players[pi];
  const tok = { ...p.tokens };
  const bank = { ...g.bank };
  for (const [c, n] of Object.entries(gems)) {
    tok[c] = (tok[c] || 0) + n;
    bank[c] -= n;
  }
  return {
    ...g,
    bank,
    players: g.players.map((pl, i) => (i === pi ? { ...pl, tokens: tok } : pl)),
  };
};

export const doBuy = (g, pi, card, fromRes) => {
  const p = g.players[pi];
  const tok = { ...p.tokens };
  const bank = { ...g.bank };
  let gold = 0;
  for (const [c, v] of Object.entries(card.c)) {
    const after = Math.max(0, v - getBonus(p, c));
    const from = Math.min(tok[c] || 0, after);
    tok[c] = (tok[c] || 0) - from;
    bank[c] += from;
    gold += after - from;
  }
  tok.gold -= gold;
  bank.gold += gold;

  const cards = [...p.cards, card];
  const reserved = fromRes ? p.reserved.filter((c) => c.id !== card.id) : p.reserved;
  const noblePts = p.points - p.cards.reduce((s, c) => s + c.p, 0);
  const cardPts = cards.reduce((s, c) => s + c.p, 0);

  let board = g.board;
  let deck = g.deck;
  if (!fromRes) {
    const t = card.t;
    const fu = g.board[t].filter((c) => c.id !== card.id);
    if (g.deck[t].length > 0) {
      fu.push(g.deck[t][0]);
      deck = { ...deck, [t]: g.deck[t].slice(1) };
    }
    board = { ...board, [t]: fu };
  }

  return {
    ...g,
    bank,
    board,
    deck,
    players: g.players.map((pl, i) =>
      i === pi ? { ...pl, tokens: tok, cards, reserved, points: cardPts + noblePts } : pl,
    ),
  };
};

export const doReserve = (g, pi, card, fromDeck, tier) => {
  const p = g.players[pi];
  if (p.reserved.length >= MAX_RESERVED) return g;

  let actual = card;
  let board = g.board;
  let deck = g.deck;

  if (fromDeck) {
    if (!g.deck[tier] || !g.deck[tier].length) return g;
    actual = g.deck[tier][0];
    deck = { ...deck, [tier]: g.deck[tier].slice(1) };
  } else {
    const t = card.t;
    const fu = g.board[t].filter((c) => c.id !== card.id);
    if (g.deck[t].length > 0) {
      fu.push(g.deck[t][0]);
      deck = { ...deck, [t]: g.deck[t].slice(1) };
    }
    board = { ...board, [t]: fu };
  }

  const tok = { ...p.tokens };
  const bank = { ...g.bank };
  if (g.bank.gold > 0) {
    tok.gold += 1;
    bank.gold -= 1;
  }

  return {
    ...g,
    bank,
    board,
    deck,
    players: g.players.map((pl, i) =>
      i === pi ? { ...pl, tokens: tok, reserved: [...p.reserved, actual] } : pl,
    ),
  };
};

export const doNobles = (g, pi) => {
  let ng = g;
  for (const n of [...ng.nobles]) {
    const earned = Object.entries(n.req).every(([c, cnt]) => getBonus(ng.players[pi], c) >= cnt);
    if (earned) {
      const nobles = ng.nobles.filter((x) => x.id !== n.id);
      const np = { ...ng.players[pi], points: ng.players[pi].points + n.pts };
      ng = { ...ng, nobles, players: ng.players.map((pl, i) => (i === pi ? np : pl)) };
      break;
    }
  }
  return ng;
};
