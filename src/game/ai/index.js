import { aiDecideEasy } from './easy';
import { aiDecideMedium } from './medium';
import { aiDecideHard } from './hard';

export const aiDecide = (g, pi) => {
  const d = g.players[pi].aiDifficulty || 'medium';
  if (d === 'easy') return aiDecideEasy(g, pi);
  if (d === 'hard') return aiDecideHard(g, pi);
  return aiDecideMedium(g, pi);
};
