export const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export const getBonus = (pl, col) => pl.cards.filter((c) => c.b === col).length;

export const totalTok = (pl) => Object.values(pl.tokens).reduce((a, b) => a + b, 0);

export const canAfford = (pl, card) => {
  let g = 0;
  for (const [c, v] of Object.entries(card.c)) {
    g += Math.max(0, v - getBonus(pl, c) - (pl.tokens[c] || 0));
  }
  return g <= pl.tokens.gold;
};

export const goldNeed = (pl, card) => {
  let g = 0;
  for (const [c, v] of Object.entries(card.c)) {
    g += Math.max(0, v - getBonus(pl, c) - (pl.tokens[c] || 0));
  }
  return g;
};
