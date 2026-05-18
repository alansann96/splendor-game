import { useState, useEffect, useRef } from "react";

const GEMS = ['white','blue','green','red','black'];
const GC = { white:'#e8dcc8', blue:'#6ab4f8', green:'#52cf7a', red:'#f06060', black:'#b0a8c8', gold:'#f0c840' };
const GD = { white:'#a09070', blue:'#1850b0', green:'#148040', red:'#901828', black:'#282040', gold:'#a07800' };
const GB = { white:'#1e180c', blue:'#080e28', green:'#061410', red:'#200808', black:'#0c0c18', gold:'#1c1600' };
const GNAME = { white:'Diamond', blue:'Sapphire', green:'Emerald', red:'Ruby', black:'Onyx', gold:'Gold' };
const NOBLE_SYM = ['♛','♞','⚜','⚔','☽','✦','♜','♝','⚖','☯'];

const ALL_NOBLES = [
  {id:1,pts:3,req:{white:4,red:4}},{id:2,pts:3,req:{white:3,blue:3,black:3}},
  {id:3,pts:3,req:{blue:4,green:4}},{id:4,pts:3,req:{green:3,red:3,black:3}},
  {id:5,pts:3,req:{white:4,blue:4}},{id:6,pts:3,req:{red:4,black:4}},
  {id:7,pts:3,req:{white:3,green:3,red:3}},{id:8,pts:3,req:{blue:3,green:3,white:3}},
  {id:9,pts:3,req:{blue:3,red:3,black:3}},{id:10,pts:3,req:{green:4,black:4}},
];
const ALL_CARDS = [
  {id:1,t:1,b:'black',p:0,c:{blue:1,green:1,red:1,white:1}},{id:2,t:1,b:'black',p:0,c:{blue:1,red:2,white:1}},
  {id:3,t:1,b:'black',p:0,c:{green:2,blue:1}},{id:4,t:1,b:'black',p:0,c:{red:2,green:1}},
  {id:5,t:1,b:'black',p:0,c:{black:3}},{id:6,t:1,b:'black',p:0,c:{white:1,blue:1,green:1,black:1}},
  {id:7,t:1,b:'black',p:0,c:{green:2,red:1}},{id:8,t:1,b:'black',p:1,c:{red:3,blue:1,white:1}},
  {id:9,t:1,b:'blue',p:0,c:{white:1,green:1,red:1,black:1}},{id:10,t:1,b:'blue',p:0,c:{white:2,red:1,black:1}},
  {id:11,t:1,b:'blue',p:0,c:{blue:2,white:1}},{id:12,t:1,b:'blue',p:0,c:{green:1,red:2}},
  {id:13,t:1,b:'blue',p:0,c:{blue:3}},{id:14,t:1,b:'blue',p:0,c:{white:1,blue:1,black:1,red:1}},
  {id:15,t:1,b:'blue',p:0,c:{white:2,black:1}},{id:16,t:1,b:'blue',p:1,c:{white:3,green:1,black:1}},
  {id:17,t:1,b:'green',p:0,c:{white:1,blue:1,red:1,black:1}},{id:18,t:1,b:'green',p:0,c:{blue:2,white:1,black:1}},
  {id:19,t:1,b:'green',p:0,c:{red:2,black:1}},{id:20,t:1,b:'green',p:0,c:{white:1,blue:2}},
  {id:21,t:1,b:'green',p:0,c:{green:3}},{id:22,t:1,b:'green',p:0,c:{green:1,red:1,white:1,black:1}},
  {id:23,t:1,b:'green',p:0,c:{blue:1,black:2}},{id:24,t:1,b:'green',p:1,c:{blue:3,black:1,red:1}},
  {id:25,t:1,b:'red',p:0,c:{blue:1,green:1,white:1,black:1}},{id:26,t:1,b:'red',p:0,c:{green:2,blue:1,black:1}},
  {id:27,t:1,b:'red',p:0,c:{black:2,white:1}},{id:28,t:1,b:'red',p:0,c:{green:1,white:2}},
  {id:29,t:1,b:'red',p:0,c:{red:3}},{id:30,t:1,b:'red',p:0,c:{red:1,green:1,blue:1,white:1}},
  {id:31,t:1,b:'red',p:0,c:{black:1,white:2}},{id:32,t:1,b:'red',p:1,c:{black:3,white:1,green:1}},
  {id:33,t:1,b:'white',p:0,c:{green:1,red:1,blue:1,black:1}},{id:34,t:1,b:'white',p:0,c:{red:2,green:1,white:1}},
  {id:35,t:1,b:'white',p:0,c:{blue:2,green:1}},{id:36,t:1,b:'white',p:0,c:{black:1,red:2}},
  {id:37,t:1,b:'white',p:0,c:{white:3}},{id:38,t:1,b:'white',p:0,c:{white:1,red:1,green:1,blue:1}},
  {id:39,t:1,b:'white',p:0,c:{red:2,black:1}},{id:40,t:1,b:'white',p:1,c:{green:3,red:1,blue:1}},
  {id:41,t:2,b:'black',p:1,c:{red:3,blue:2,white:2}},{id:42,t:2,b:'black',p:2,c:{blue:3,red:2,white:3}},
  {id:43,t:2,b:'black',p:2,c:{black:5}},{id:44,t:2,b:'black',p:2,c:{black:3,red:2,green:3}},
  {id:45,t:2,b:'black',p:3,c:{black:6}},{id:46,t:2,b:'black',p:1,c:{green:2,white:3,black:2}},
  {id:47,t:2,b:'blue',p:1,c:{white:3,green:2,black:2}},{id:48,t:2,b:'blue',p:2,c:{green:3,white:2,black:3}},
  {id:49,t:2,b:'blue',p:2,c:{blue:5}},{id:50,t:2,b:'blue',p:2,c:{blue:3,black:2,white:3}},
  {id:51,t:2,b:'blue',p:3,c:{blue:6}},{id:52,t:2,b:'blue',p:1,c:{black:2,red:3,blue:2}},
  {id:53,t:2,b:'green',p:1,c:{blue:3,red:2,black:2}},{id:54,t:2,b:'green',p:2,c:{red:3,blue:2,black:3}},
  {id:55,t:2,b:'green',p:2,c:{green:5}},{id:56,t:2,b:'green',p:2,c:{green:3,blue:2,red:3}},
  {id:57,t:2,b:'green',p:3,c:{green:6}},{id:58,t:2,b:'green',p:1,c:{white:2,blue:3,green:2}},
  {id:59,t:2,b:'red',p:1,c:{black:3,white:2,red:2}},{id:60,t:2,b:'red',p:2,c:{white:3,black:2,red:3}},
  {id:61,t:2,b:'red',p:2,c:{red:5}},{id:62,t:2,b:'red',p:2,c:{red:3,green:2,blue:3}},
  {id:63,t:2,b:'red',p:3,c:{red:6}},{id:64,t:2,b:'red',p:1,c:{red:2,green:3,white:2}},
  {id:65,t:2,b:'white',p:1,c:{green:3,black:2,blue:2}},{id:66,t:2,b:'white',p:2,c:{black:3,green:2,blue:3}},
  {id:67,t:2,b:'white',p:2,c:{white:5}},{id:68,t:2,b:'white',p:2,c:{white:3,red:2,black:3}},
  {id:69,t:2,b:'white',p:3,c:{white:6}},{id:70,t:2,b:'white',p:1,c:{blue:2,green:3,red:2}},
  {id:71,t:3,b:'black',p:3,c:{black:3,red:3,blue:3,white:5}},{id:72,t:3,b:'black',p:4,c:{blue:3,white:3,red:3,black:7}},
  {id:73,t:3,b:'black',p:5,c:{white:3,red:7}},{id:74,t:3,b:'black',p:3,c:{white:5,green:3,red:3,black:3}},
  {id:75,t:3,b:'blue',p:3,c:{white:3,blue:3,green:3,red:5}},{id:76,t:3,b:'blue',p:4,c:{black:3,red:3,white:3,blue:7}},
  {id:77,t:3,b:'blue',p:5,c:{black:3,green:7}},{id:78,t:3,b:'blue',p:3,c:{blue:5,black:3,white:3,green:3}},
  {id:79,t:3,b:'green',p:3,c:{blue:3,green:3,black:3,white:5}},{id:80,t:3,b:'green',p:4,c:{white:3,blue:3,black:3,green:7}},
  {id:81,t:3,b:'green',p:5,c:{blue:3,black:7}},{id:82,t:3,b:'green',p:3,c:{green:5,red:3,blue:3,white:3}},
  {id:83,t:3,b:'red',p:3,c:{red:3,black:3,white:3,blue:5}},{id:84,t:3,b:'red',p:4,c:{green:3,black:3,blue:3,red:7}},
  {id:85,t:3,b:'red',p:5,c:{green:3,white:7}},{id:86,t:3,b:'red',p:3,c:{red:5,white:3,black:3,green:3}},
  {id:87,t:3,b:'white',p:3,c:{green:3,white:3,red:3,black:5}},{id:88,t:3,b:'white',p:4,c:{red:3,green:3,black:3,white:7}},
  {id:89,t:3,b:'white',p:5,c:{red:3,blue:7}},{id:90,t:3,b:'white',p:3,c:{white:5,blue:3,red:3,green:3}},
];

const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
const getBonus = (pl,col) => pl.cards.filter(c=>c.b===col).length;
const totalTok = pl => Object.values(pl.tokens).reduce((a,b)=>a+b,0);
const canAfford = (pl,card) => { let g=0; for(const[c,v]of Object.entries(card.c))g+=Math.max(0,v-getBonus(pl,c)-(pl.tokens[c]||0)); return g<=pl.tokens.gold; };
const goldNeed = (pl,card) => { let g=0; for(const[c,v]of Object.entries(card.c))g+=Math.max(0,v-getBonus(pl,c)-(pl.tokens[c]||0)); return g; };
export const DEFAULT_SLOTS = [{name:'You',kind:'human'},{name:'AI',kind:'ai',aiDifficulty:'medium'}];
const mkPlayer = (name,kind,aiDifficulty) => ({name,kind,aiDifficulty:aiDifficulty||null,tokens:{white:0,blue:0,green:0,red:0,black:0,gold:0},cards:[],reserved:[],points:0});

export const initGame = (slots) => {
  const cfg = slots && slots.length ? slots : DEFAULT_SLOTS;
  const n = cfg.length;
  const perColor = n<=2?4:n===3?5:7;
  const mk = tier => { const s=shuffle(ALL_CARDS.filter(c=>c.t===tier)); return {board:s.slice(0,4),deck:s.slice(4)}; };
  const t1=mk(1), t2=mk(2), t3=mk(3);
  return {
    bank:{white:perColor,blue:perColor,green:perColor,red:perColor,black:perColor,gold:5},
    board:{1:t1.board,2:t2.board,3:t3.board},
    deck:{1:t1.deck,2:t2.deck,3:t3.deck},
    nobles:shuffle(ALL_NOBLES).slice(0,n+1),
    players:cfg.map(c=>mkPlayer(c.name,c.kind,c.aiDifficulty)),
    turn:0,
    gameOver:false,winner:null,finalRound:false,finalTrigger:null,
  };
};

const doTake = (g,pi,gems) => { const p=g.players[pi],tok={...p.tokens},bank={...g.bank}; for(const[c,n]of Object.entries(gems)){tok[c]=(tok[c]||0)+n;bank[c]-=n;} return{...g,bank,players:g.players.map((pl,i)=>i===pi?{...pl,tokens:tok}:pl)}; };
const doBuy = (g,pi,card,fromRes) => { const p=g.players[pi],tok={...p.tokens},bank={...g.bank};let gold=0; for(const[c,v]of Object.entries(card.c)){const after=Math.max(0,v-getBonus(p,c)),from=Math.min(tok[c]||0,after);tok[c]=(tok[c]||0)-from;bank[c]+=from;gold+=after-from;} tok.gold-=gold;bank.gold+=gold; const cards=[...p.cards,card]; const reserved=fromRes?p.reserved.filter(c=>c.id!==card.id):p.reserved; const noblePts=p.points-p.cards.reduce((s,c)=>s+c.p,0); const cardPts=cards.reduce((s,c)=>s+c.p,0); let board=g.board,deck=g.deck; if(!fromRes){const t=card.t,fu=g.board[t].filter(c=>c.id!==card.id);if(g.deck[t].length>0){fu.push(g.deck[t][0]);deck={...deck,[t]:g.deck[t].slice(1)};}board={...board,[t]:fu};} return{...g,bank,board,deck,players:g.players.map((pl,i)=>i===pi?{...pl,tokens:tok,cards,reserved,points:cardPts+noblePts}:pl)}; };
const doReserve = (g,pi,card,fromDeck,tier) => { const p=g.players[pi]; if(p.reserved.length>=3)return g; let actual=card,board=g.board,deck=g.deck; if(fromDeck){if(!g.deck[tier]||!g.deck[tier].length)return g;actual=g.deck[tier][0];deck={...deck,[tier]:g.deck[tier].slice(1)};}else{const t=card.t,fu=g.board[t].filter(c=>c.id!==card.id);if(g.deck[t].length>0){fu.push(g.deck[t][0]);deck={...deck,[t]:g.deck[t].slice(1)};}board={...board,[t]:fu};} const tok={...p.tokens},bank={...g.bank}; if(g.bank.gold>0){tok.gold+=1;bank.gold-=1;} return{...g,bank,board,deck,players:g.players.map((pl,i)=>i===pi?{...pl,tokens:tok,reserved:[...p.reserved,actual]}:pl)}; };
const doNobles = (g,pi) => { let ng=g; for(const n of[...ng.nobles]){if(Object.entries(n.req).every(([c,cnt])=>getBonus(ng.players[pi],c)>=cnt)){const nobles=ng.nobles.filter(x=>x.id!==n.id);const np={...ng.players[pi],points:ng.players[pi].points+n.pts};ng={...ng,nobles,players:ng.players.map((pl,i)=>i===pi?np:pl)};break;}} return ng; };
const aiDecideMedium = (g, pi) => { const ai=g.players[pi]; const fu=[...g.board[3],...g.board[2],...g.board[1]].filter(Boolean); const buy=fu.filter(c=>canAfford(ai,c)); if(buy.length){buy.sort((a,b)=>b.p-a.p||goldNeed(ai,a)-goldNeed(ai,b));return{type:'buy',card:buy[0],fromRes:false};} const buyR=ai.reserved.filter(c=>canAfford(ai,c)); if(buyR.length){buyR.sort((a,b)=>b.p-a.p);return{type:'buy',card:buyR[0],fromRes:true};} const targs=[...fu,...ai.reserved].filter(Boolean); targs.sort((a,b)=>{const da=Object.entries(a.c).reduce((s,[c,v])=>s+Math.max(0,v-getBonus(ai,c)-(ai.tokens[c]||0)),0),db=Object.entries(b.c).reduce((s,[c,v])=>s+Math.max(0,v-getBonus(ai,c)-(ai.tokens[c]||0)),0);return da-db||b.p-a.p;}); const tk=totalTok(ai); if(targs.length&&tk<=8){const tg=targs[0],need={};for(const[c,v]of Object.entries(tg.c)){const n=Math.max(0,v-getBonus(ai,c)-(ai.tokens[c]||0));if(n>0&&g.bank[c]>0)need[c]=n;}const wc=Object.keys(need);if(wc.length>=3)return{type:'take',gems:{[wc[0]]:1,[wc[1]]:1,[wc[2]]:1}};if(wc.length===2)return{type:'take',gems:{[wc[0]]:1,[wc[1]]:1}};if(wc.length===1){if(g.bank[wc[0]]>=4)return{type:'take',gems:{[wc[0]]:2}};return{type:'take',gems:{[wc[0]]:1}};}} const av=GEMS.filter(c=>g.bank[c]>0); if(av.length>=3&&tk<=7)return{type:'take',gems:{[av[0]]:1,[av[1]]:1,[av[2]]:1}};if(av.length>=2&&tk<=8)return{type:'take',gems:{[av[0]]:1,[av[1]]:1}};if(av.length>=1&&tk<=9)return{type:'take',gems:{[av[0]]:1}};if(ai.reserved.length<3&&fu.length>0){const best=[...fu].sort((a,b)=>b.p-a.p)[0];if(best)return{type:'reserve',card:best};}return{type:'pass'}; };

const aiDecideEasy = (g, pi) => {
  const ai = g.players[pi];
  const fu = [...g.board[1],...g.board[2],...g.board[3]].filter(Boolean);
  const tk = totalTok(ai);
  const r = Math.random();
  const buys = fu.filter(c => canAfford(ai, c));
  if (buys.length && r < 0.5) return { type:'buy', card: buys[Math.floor(Math.random()*buys.length)], fromRes:false };
  const av = shuffle(GEMS.filter(c => g.bank[c] > 0));
  if (av.length >= 3 && tk <= 7 && r < 0.85) return { type:'take', gems:{[av[0]]:1,[av[1]]:1,[av[2]]:1} };
  if (av.length >= 2 && tk <= 8) return { type:'take', gems:{[av[0]]:1,[av[1]]:1} };
  if (av.length >= 1 && tk <= 9) return { type:'take', gems:{[av[0]]:1} };
  if (buys.length) return { type:'buy', card: buys[0], fromRes:false };
  const buyR = ai.reserved.filter(c => canAfford(ai, c));
  if (buyR.length) return { type:'buy', card: buyR[0], fromRes:true };
  if (ai.reserved.length < 3 && fu.length) return { type:'reserve', card: fu[Math.floor(Math.random()*fu.length)] };
  return { type:'pass' };
};

const aiDecideHard = (g, pi) => {
  const ai = g.players[pi];
  const fu = [...g.board[1],...g.board[2],...g.board[3]].filter(Boolean);
  const tk = totalTok(ai);
  const evalP = p => {
    let s = p.points * 100 + p.cards.length * 3;
    for (const c of GEMS) s += getBonus(p, c) * 2;
    s += Object.values(p.tokens).reduce((a,b)=>a+b,0) * 0.3;
    for (const n of g.nobles) {
      const need = Object.entries(n.req).reduce((a,[c,v])=>a+Math.max(0,v-getBonus(p,c)),0);
      if (need === 0) s += n.pts * 100;
      else s += Math.max(0, 6 - need) * 4;
    }
    return s;
  };
  const cands = [];
  for (const card of fu) if (canAfford(ai, card)) cands.push({ type:'buy', card, fromRes:false });
  for (const card of ai.reserved) if (canAfford(ai, card)) cands.push({ type:'buy', card, fromRes:true });
  const av = GEMS.filter(c => g.bank[c] > 0);
  if (tk <= 7) {
    for (let i=0;i<av.length;i++) for (let j=i+1;j<av.length;j++) for (let k=j+1;k<av.length;k++) cands.push({ type:'take', gems:{[av[i]]:1,[av[j]]:1,[av[k]]:1} });
  }
  if (tk <= 8) {
    for (let i=0;i<av.length;i++) for (let j=i+1;j<av.length;j++) cands.push({ type:'take', gems:{[av[i]]:1,[av[j]]:1} });
    for (const c of av) if (g.bank[c] >= 4) cands.push({ type:'take', gems:{[c]:2} });
  }
  if (tk <= 9) for (const c of av) cands.push({ type:'take', gems:{[c]:1} });
  if (ai.reserved.length < 3) for (const card of fu) cands.push({ type:'reserve', card });
  if (!cands.length) return { type:'pass' };
  let best = null, bestScore = -Infinity;
  for (const cand of cands) {
    let ng = g;
    if (cand.type === 'buy') ng = doBuy(g, pi, cand.card, cand.fromRes);
    else if (cand.type === 'take') ng = doTake(g, pi, cand.gems);
    else if (cand.type === 'reserve') ng = doReserve(g, pi, cand.card, false, null);
    ng = doNobles(ng, pi);
    const sc = evalP(ng.players[pi]);
    if (sc > bestScore) { bestScore = sc; best = cand; }
  }
  return best;
};

const aiDecide = (g, pi) => {
  const d = g.players[pi].aiDifficulty || 'medium';
  if (d === 'easy') return aiDecideEasy(g, pi);
  if (d === 'hard') return aiDecideHard(g, pi);
  return aiDecideMedium(g, pi);
};

function useSound() {
  const ctxRef = useRef(null);
  const mutedRef = useRef(false);

  const getCtx = () => {
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      return ctxRef.current;
    } catch(e) { return null; }
  };

  const tone = (freq, type, dur, vol, delay) => {
    if (mutedRef.current) return;
    const d = delay || 0;
    try {
      const ac = getCtx(); if (!ac) return;
      const osc = ac.createOscillator(), gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = type; osc.frequency.value = freq;
      const t = ac.currentTime + d;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t); osc.stop(t + dur + 0.06);
    } catch(e) {}
  };

  const PITCH = {white:1318, blue:880, green:988, red:698, black:622, gold:1174};

  return {
    mutedRef,
    gemPick: (col) => { const f=PITCH[col]||880; tone(f,'sine',0.28,0.18,0); tone(f*1.5,'sine',0.16,0.07,0.05); },
    cardBuy: () => { [[523,0],[659,0.07],[784,0.14],[1046,0.22]].forEach(([f,d])=>tone(f,'sine',0.5,0.14,d)); },
    reserve: () => { tone(440,'triangle',0.2,0.12,0); tone(554,'triangle',0.15,0.06,0.1); },
    noble: () => { [[523,0],[659,0.09],[784,0.18],[1046,0.28],[1318,0.38]].forEach(([f,d])=>tone(f,'sine',0.6,0.2,d)); },
    gameWin: () => { [[523,0],[659,0.1],[784,0.2],[880,0.3],[1046,0.4],[1318,0.5]].forEach(([f,d])=>tone(f,'sine',0.8,0.22,d)); },
    gameLose: () => { [[523,0],[494,0.12],[466,0.24],[440,0.36]].forEach(([f,d])=>tone(f,'triangle',0.6,0.14,d)); },
    click: () => tone(700,'sine',0.08,0.06,0),
    aiMove: () => tone(330,'sine',0.22,0.06,0),
    discard: () => { tone(220,'sawtooth',0.12,0.1,0); tone(180,'sawtooth',0.1,0.07,0.06); },
  };
}

const Gem = ({ col, size=44, count, picked, glow, dimmed }) => {
  const highlight = `radial-gradient(circle at 33% 28%, rgba(255,255,255,0.88) 0%, ${GC[col]} 35%, ${GD[col]} 100%)`;
  return (
    <div style={{
      position:'relative', width:size, height:size, flexShrink:0,
      borderRadius:'50%',
      background: highlight,
      boxShadow: glow
        ? `0 0 ${size*0.45}px ${GC[col]}99, 0 0 ${size*0.2}px ${GC[col]}cc, inset 0 -${size*0.08}px ${size*0.12}px ${GD[col]}66`
        : `inset 0 -${size*0.08}px ${size*0.1}px ${GD[col]}55`,
      border: `${size*0.04}px solid rgba(255,255,255,0.22)`,
      transform: picked ? 'scale(1.14)' : 'scale(1)',
      opacity: dimmed ? 0.2 : 1,
      transition: 'transform 0.15s, box-shadow 0.2s, opacity 0.2s',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        position:'absolute', top:'12%', left:'18%',
        width:'30%', height:'20%',
        borderRadius:'50%',
        background:'rgba(255,255,255,0.7)',
        transform:'rotate(-30deg)',
      }}/>
      {count != null && (
        <span style={{
          position:'relative', zIndex:1,
          color:'#fff', fontWeight:900,
          fontSize:size*0.36, lineHeight:1,
          fontFamily:'Georgia,serif',
          textShadow:'0 1px 3px rgba(0,0,0,0.85)',
        }}>{count}</span>
      )}
    </div>
  );
};

const Dot = ({ col, sz=9 }) => (
  <div style={{
    width:sz, height:sz, flexShrink:0,
    borderRadius:'50%', display:'inline-block',
    background:`radial-gradient(circle at 33% 28%, rgba(255,255,255,0.75), ${GC[col]} 50%, ${GD[col]})`,
  }}/>
);

const CardArt = ({ col, w, h }) => {
  const cx=w/2, cy=h/2, s=Math.min(w,h);
  const c = GC[col];
  const arts = {
    white: (
      <g opacity="0.5">
        <circle cx={cx} cy={cy} r={s*0.3} fill="none" stroke={c} strokeWidth="1.2"/>
        <circle cx={cx} cy={cy} r={s*0.17} fill={c} fillOpacity="0.28"/>
        <line x1={cx} y1={cy-s*0.4} x2={cx} y2={cy+s*0.4} stroke={c} strokeWidth="0.8" strokeDasharray="3 3"/>
        <line x1={cx-s*0.4} y1={cy} x2={cx+s*0.4} y2={cy} stroke={c} strokeWidth="0.8" strokeDasharray="3 3"/>
        <circle cx={cx} cy={cy} r={s*0.06} fill={c}/>
      </g>
    ),
    blue: (
      <g opacity="0.55">
        <path d={`M${cx-s*0.4},${cy+s*0.08} Q${cx},${cy-s*0.28} ${cx+s*0.4},${cy+s*0.08}`} fill="none" stroke={c} strokeWidth="1.8"/>
        <path d={`M${cx-s*0.4},${cy+s*0.22} Q${cx},${cy-s*0.12} ${cx+s*0.4},${cy+s*0.22}`} fill="none" stroke={c} strokeWidth="1.1" opacity="0.5"/>
        <path d={`M${cx-s*0.3},${cy-s*0.1} Q${cx},${cy+s*0.18} ${cx+s*0.3},${cy-s*0.1}`} fill="none" stroke={c} strokeWidth="0.7" opacity="0.35"/>
      </g>
    ),
    green: (
      <g opacity="0.5">
        <ellipse cx={cx} cy={cy} rx={s*0.28} ry={s*0.35} fill={c} fillOpacity="0.14" stroke={c} strokeWidth="1.2"/>
        <line x1={cx} y1={cy-s*0.36} x2={cx} y2={cy+s*0.38} stroke={c} strokeWidth="1.5"/>
        <line x1={cx-s*0.25} y1={cy-s*0.06} x2={cx+s*0.25} y2={cy-s*0.06} stroke={c} strokeWidth="0.9" opacity="0.6"/>
        <line x1={cx-s*0.18} y1={cy+s*0.1} x2={cx+s*0.18} y2={cy+s*0.1} stroke={c} strokeWidth="0.7" opacity="0.4"/>
      </g>
    ),
    red: (
      <g opacity="0.55">
        <path d={`M${cx},${cy-s*0.32} L${cx-s*0.22},${cy+s*0.04} L${cx-s*0.38},${cy-s*0.05} L${cx},${cy+s*0.36} L${cx+s*0.38},${cy-s*0.05} L${cx+s*0.22},${cy+s*0.04}Z`} fill={c} fillOpacity="0.22" stroke={c} strokeWidth="1.2" strokeLinejoin="round"/>
      </g>
    ),
    black: (
      <g opacity="0.5">
        <circle cx={cx} cy={cy} r={s*0.3} fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="4 3"/>
        <circle cx={cx} cy={cy-s*0.15} r={s*0.16} fill="none" stroke={c} strokeWidth="1.6"/>
        <circle cx={cx} cy={cy} r={s*0.07} fill={c} opacity="0.6"/>
      </g>
    ),
  };
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position:'absolute',top:0,left:0,pointerEvents:'none'}}>
      {arts[col] || arts.black}
    </svg>
  );
};

const CardTile = ({ card, onClick, canBuy, mode, small, flash }) => {
  const w=small?62:88, h=small?78:112, artH=small?34:54;
  if (!card) return <div style={{width:w,height:h,borderRadius:8,background:'#ffffff04',border:'1px dashed #ffffff0e',flexShrink:0}}/>;
  const bc = mode==='reserve' ? '#c858e0' : canBuy ? GC[card.b] : '#ffffff18';
  const bw = canBuy&&!mode ? 2 : 1.5;
  return (
    <div onClick={onClick} style={{
      width:w, height:h, borderRadius:8, cursor:'pointer',
      position:'relative', overflow:'hidden', flexShrink:0,
      background:`linear-gradient(165deg,${GB[card.b]}f0 0%,#050310 100%)`,
      border:`${bw}px solid ${bc}`,
      boxShadow: canBuy&&!mode ? `0 0 16px ${GC[card.b]}55` : mode==='reserve' ? '0 0 12px #c858e055' : 'none',
      transform: flash ? 'scale(1.08)' : 'scale(1)',
      transition:'border-color 0.2s,box-shadow 0.2s,transform 0.18s',
    }}>
      <div style={{height:artH, position:'relative', background:`${GC[card.b]}0a`, borderBottom:`1px solid ${GC[card.b]}28`}}>
        <CardArt col={card.b} w={w} h={artH}/>
        <div style={{position:'absolute',top:0,right:0,padding:small?'3px 4px':'4px 6px',display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}>
          {card.p>0 && <span style={{color:GC[card.b],fontWeight:900,fontSize:small?14:18,lineHeight:1,fontFamily:'Georgia,serif',textShadow:`0 0 10px ${GC[card.b]},0 1px 3px rgba(0,0,0,0.9)`}}>{card.p}</span>}
          <div style={{width:small?12:16,height:small?12:16,borderRadius:'50%',background:`radial-gradient(circle at 33% 28%,rgba(255,255,255,0.7),${GC[card.b]},${GD[card.b]})`,boxShadow:`0 0 6px ${GC[card.b]}aa`,border:'1.5px solid rgba(255,255,255,0.25)'}}/>
        </div>
        {!small && <span style={{position:'absolute',bottom:3,left:5,color:GC[card.b],fontSize:7,letterSpacing:1,opacity:0.45,fontFamily:'Georgia,serif'}}>{GNAME[card.b].toUpperCase()}</span>}
      </div>
      <div style={{padding:small?'3px 4px':'4px 6px',display:'flex',flexWrap:'wrap',gap:'2px 4px'}}>
        {Object.entries(card.c).map(([c,n])=>(
          <div key={c} style={{display:'flex',alignItems:'center',gap:2}}>
            <Dot col={c} sz={small?7:8}/>
            <span style={{color:GC[c],fontSize:small?8:9,fontWeight:700,lineHeight:1}}>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NobleTile = ({ noble }) => (
  <div style={{padding:'6px 8px',borderRadius:8,background:'linear-gradient(145deg,#221808,#140e04)',border:'1.5px solid #f0c84055',minWidth:82,position:'relative',overflow:'hidden',flexShrink:0,boxShadow:'0 2px 14px #f0c84011'}}>
    <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#f0c840,transparent)'}}/>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
      <span style={{fontSize:20,lineHeight:1}}>{NOBLE_SYM[(noble.id-1)%NOBLE_SYM.length]}</span>
      <span style={{color:'#f0c840',fontWeight:700,fontSize:17,fontFamily:'Georgia,serif'}}>{noble.pts}</span>
    </div>
    <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
      {Object.entries(noble.req).map(([c,cnt])=>(
        <div key={c} style={{display:'flex',alignItems:'center',gap:2,borderRadius:4,padding:'1px 4px',background:GB[c],border:`1px solid ${GC[c]}33`}}>
          <Dot col={c} sz={8}/><span style={{color:GC[c],fontSize:9,fontWeight:700}}>{cnt}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function Splendor({ initialSlots, myPlayerIndex = 0, syncedGame, onPublishGame, isHost = true } = {}) {
  const synced = !!onPublishGame;
  const [slots] = useState(initialSlots && initialSlots.length ? initialSlots : DEFAULT_SLOTS);
  const [gameLocal, setGameLocal] = useState(() => syncedGame || initGame(slots));
  const game = synced ? (syncedGame || gameLocal) : gameLocal;
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
  const [muteState, setMuteState] = useState(false);
  const snd = useSound();
  const gameRef = useRef(game);
  gameRef.current = game;

  useEffect(() => {
    if (game.gameOver && phase !== 'over') setPhase('over');
  }, [game.gameOver]);

  const me = game.players[myPlayerIndex];
  const cur = game.players[game.turn];
  const isMyTurn = phase==='acting' && game.turn === myPlayerIndex && cur && cur.kind === 'human';
  const isAITurn = phase==='acting' && cur && cur.kind === 'ai';

  const addLog = msg => setLog(p => [msg, ...p.slice(0,14)]);
  const toggleMute = () => { snd.mutedRef.current = !snd.mutedRef.current; setMuteState(snd.mutedRef.current); };

  const canPick = col => {
    if (!isMyTurn || mode!=='gems') return false;
    const tot=Object.values(picked).reduce((a,b)=>a+b,0), c=picked[col]||0, bk=game.bank[col];
    if (bk<=c || tot>=3) return false;
    if (Object.values(picked).some(v=>v>=2)) return false;
    if (c===1) { if (Object.keys(picked).some(x=>x!==col&&(picked[x]||0)>0) || bk<4) return false; }
    return true;
  };

  const endTurn = (g) => {
    let ng = doNobles(g, g.turn);
    if (ng.nobles.length < g.nobles.length) { snd.noble(); addLog(`✦ ${ng.players[g.turn].name} earned a noble!`); }
    const justActed = ng.players[g.turn];
    if (justActed.points >= 15 && !ng.finalRound) {
      ng = { ...ng, finalRound: true, finalTrigger: g.turn };
      addLog(`⚡ ${justActed.name} hit 15 — final round!`);
    }
    const nextTurn = (g.turn + 1) % ng.players.length;
    if (ng.finalRound && nextTurn === ng.finalTrigger) {
      const ranked = ng.players.map((p,i)=>({p,i})).sort((a,b) => b.p.points - a.p.points || a.p.cards.length - b.p.cards.length);
      const winner = ranked[0];
      (winner.i === myPlayerIndex) ? snd.gameWin() : snd.gameLose();
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
      if (act.type==='buy') {
        ng = doBuy(g, pi, act.card, act.fromRes);
        addLog(`🤖 ${aiName} bought ${GNAME[act.card.b]} card (+${act.card.p}pts)`);
      } else if (act.type==='take') {
        ng = doTake(g, pi, act.gems);
        addLog(`🤖 ${aiName} took: ${Object.entries(act.gems).map(([c,n])=>`${n}×${GNAME[c]}`).join(', ')}`);
        const tk = totalTok(ng.players[pi]);
        if (tk > 10) {
          const tok = {...ng.players[pi].tokens}, bank = {...ng.bank};
          let ex = tk - 10;
          for (const c of [...GEMS,'gold']) { if (!ex) break; const d = Math.min(tok[c]||0, ex); tok[c]-=d; bank[c]+=d; ex-=d; }
          ng = { ...ng, bank, players: ng.players.map((p,i)=>i===pi?{...p,tokens:tok}:p) };
        }
      } else if (act.type==='reserve') {
        ng = doReserve(g, pi, act.card, false, null);
        addLog(`🤖 ${aiName} reserved a card`);
        if (totalTok(ng.players[pi]) > 10) {
          const tok = {...ng.players[pi].tokens}, bank = {...ng.bank};
          tok.gold = Math.max(0, tok.gold-1); bank.gold += 1;
          ng = { ...ng, bank, players: ng.players.map((p,i)=>i===pi?{...p,tokens:tok}:p) };
        }
      } else addLog(`🤖 ${aiName} passed`);
      endTurn(ng);
    }, 1100);
    return () => clearTimeout(timer);
  }, [isAITurn, game.turn]);

  const confirmGems = () => {
    if (!Object.keys(picked).length) return;
    const ng = doTake(game, myPlayerIndex, picked);
    addLog(`✦ ${me.name} took: ${Object.entries(picked).map(([c,n])=>`${n}×${GNAME[c]}`).join(', ')}`);
    setPicked({}); setMode(null);
    if (totalTok(ng.players[myPlayerIndex]) > 10) { setGame(ng); setPhase('discard'); setDiscQ({}); }
    else endTurn(ng);
  };

  const buyCard = (card, fromRes) => {
    if (!isMyTurn || mode) return;
    if (canAfford(game.players[myPlayerIndex], card)) {
      snd.cardBuy(); setFlashCard(card.id); setTimeout(()=>setFlashCard(null), 350);
      const ng = doBuy(game, myPlayerIndex, card, fromRes);
      addLog(`✦ ${me.name} bought ${GNAME[card.b]} card (+${card.p}pts)${fromRes?' [reserved]':''}`);
      endTurn(ng);
    } else addLog(`✗ Need ${goldNeed(game.players[myPlayerIndex],card)} more gold`);
  };

  const reserveCard = (card, fromDeck, tier) => {
    if (!isMyTurn) return;
    if (game.players[myPlayerIndex].reserved.length>=3) { addLog('✗ Max 3 reserved cards'); return; }
    snd.reserve();
    const ng = doReserve(game, myPlayerIndex, card, fromDeck, tier);
    addLog(`✦ ${me.name} reserved ${fromDeck?`tier-${tier} card`:GNAME[card.b]+' card'}${ng.bank.gold!==game.bank.gold?' (+gold)':''}`);
    setMode(null);
    if (totalTok(ng.players[myPlayerIndex]) > 10) { setGame(ng); setPhase('discard'); setDiscQ({}); }
    else endTurn(ng);
  };

  const confirmDiscard = () => {
    const tk = totalTok(game.players[myPlayerIndex]), nd = Object.values(discQ).reduce((a,b)=>a+b,0);
    if (tk - nd > 10) { addLog(`✗ Discard ${tk - 10 - nd} more`); return; }
    const tok = {...game.players[myPlayerIndex].tokens}, bank = {...game.bank};
    for (const [c,n] of Object.entries(discQ)) { tok[c]-=n; bank[c]+=n; }
    snd.discard();
    const ng = { ...game, bank, players: game.players.map((p,i) => i===myPlayerIndex ? {...p,tokens:tok} : p) };
    setDiscQ({}); endTurn(ng);
  };

  const restart = () => {
    if (synced && !isHost) return;
    snd.click();
    const restartSlots = synced && game.players ? game.players.map(p => ({ name: p.name, kind: p.kind, aiDifficulty: p.aiDifficulty })) : slots;
    setGame(initGame(restartSlots));
    setPhase('acting'); setMode(null); setPicked({}); setDiscQ({});
    setLog(['✦ New game started!']);
  };

  const h = me;
  const pickedTotal = Object.values(picked).reduce((a,b)=>a+b,0);
  const discTotal = Object.values(discQ).reduce((a,b)=>a+b,0);
  const overBy = totalTok(h) - 10;
  const tierC = {1:'#4caf78',2:'#5ba3f5',3:'#c858e0'};

  const Btn = ({label, col, cb, dis}) => (
    <button onClick={dis?undefined:()=>{snd.click();cb();}} style={{
      padding:'7px 14px', borderRadius:6,
      border:`1.5px solid ${dis?'#1e1e2e':col}`,
      background:'transparent', color:dis?'#1e1e2e':col,
      fontSize:10, fontWeight:700, cursor:dis?'not-allowed':'pointer',
      letterSpacing:1, fontFamily:'Georgia,serif',
      boxShadow:dis?'none':`0 0 8px ${col}22`,
    }}>{label}</button>
  );

  if (phase==='over' || game.gameOver) {
    const won = game.winner === me.name;
    return (
      <div style={{minHeight:'100vh',background:'radial-gradient(ellipse at 40% 30%,#1e1228,#040210)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Georgia,serif',color:'#fff',gap:24,padding:32}}>
        <style>{`@keyframes gp{0%,100%{opacity:0.8;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}`}</style>
        <div style={{fontSize:80,animation:'gp 2.5s ease-in-out infinite',filter:`drop-shadow(0 0 24px ${won?'#f0c840':'#888'})`}}>{won?'♛':'♟'}</div>
        <div style={{color:'#f0c840',fontSize:26,letterSpacing:6,textAlign:'center'}}>{game.winner} Wins</div>
        <div style={{display:'flex',gap:20}}>
          {game.players.map((p,i)=>(
            <div key={i} style={{textAlign:'center',padding:'20px 32px',borderRadius:12,border:`2px solid ${p.name===game.winner?'#f0c840':'#222'}`,background:p.name===game.winner?'#1e1508':'#0e0e1a',boxShadow:p.name===game.winner?'0 0 32px #f0c84033':'none'}}>
              <div style={{color:p.name===game.winner?'#f0c840':'#333',fontSize:9,letterSpacing:3,marginBottom:8}}>{p.name.toUpperCase()}</div>
              <div style={{fontSize:56,fontWeight:700,color:'#f0c840',lineHeight:1,fontFamily:'Georgia,serif'}}>{p.points}</div>
              <div style={{color:'#333',fontSize:9,marginTop:8}}>{p.cards.length} cards</div>
            </div>
          ))}
        </div>
        {(!synced || isHost) ? (
          <button onClick={restart} style={{padding:'12px 36px',borderRadius:8,border:'2px solid #f0c840',background:'transparent',color:'#f0c840',fontSize:12,fontWeight:700,cursor:'pointer',letterSpacing:3,fontFamily:'Georgia,serif'}}>PLAY AGAIN</button>
        ) : (
          <div style={{color:'#ffffff44',fontSize:10,letterSpacing:2,fontFamily:'Georgia,serif'}}>Waiting for host to start a new game…</div>
        )}
      </div>
    );
  }

  return (
    <div style={{background:'#07060d',minHeight:'100vh',fontFamily:'Georgia,serif',color:'#e0d8f0',userSelect:'none',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes sh{0%,100%{opacity:0.55}50%{opacity:1}} @keyframes pu{0%,100%{opacity:0.35}50%{opacity:1}} @keyframes pi{0%{transform:scale(0.85);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}`}</style>

      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 14px',borderBottom:'1px solid #ffffff0c',background:'linear-gradient(90deg,#07050d,#0d0718,#07050d)',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{color:'#f0c840',fontSize:22,animation:'sh 3s ease-in-out infinite'}}>✦</span>
          <div>
            <div style={{color:'#f0c840',fontSize:14,letterSpacing:5,lineHeight:1}}>SPLENDOR</div>
            <div style={{color:'#f0c84033',fontSize:7,letterSpacing:3}}>RENAISSANCE</div>
          </div>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          {game.players.map((p,i)=>{
            const active = i === game.turn && phase !== 'over';
            const pct = Math.min(100, (p.points/15)*100);
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'3px 10px',borderRadius:20,background:active?'#f0c84014':'transparent',border:`1px solid ${active?'#f0c84044':'transparent'}`,transition:'all 0.4s'}}>
                {active && <span style={{color:'#f0c840',fontSize:7,animation:'pu 1s infinite'}}>▶</span>}
                <span style={{color:active?'#e0c080':'#444',fontSize:10,letterSpacing:1}}>{p.name.toUpperCase()}</span>
                <svg width="30" height="30" viewBox="0 0 30 30">
                  <circle cx="15" cy="15" r="11" fill="none" stroke="#ffffff0c" strokeWidth="2.5"/>
                  <circle cx="15" cy="15" r="11" fill="none" stroke={active?'#f0c840':'#333'} strokeWidth="2.5"
                    strokeDasharray={`${2*Math.PI*11}`}
                    strokeDashoffset={`${2*Math.PI*11*(1-pct/100)}`}
                    transform="rotate(-90 15 15)"
                    style={{transition:'stroke-dashoffset 0.7s ease'}}/>
                  <text x="15" y="19" textAnchor="middle" fontSize="9" fontWeight="700" fill={active?'#f0c840':'#444'} fontFamily="Georgia,serif">{p.points}</text>
                </svg>
              </div>
            );
          })}
          {game.finalRound && <span style={{color:'#f06060',fontSize:8,letterSpacing:2,animation:'pu 0.8s infinite'}}>FINAL ROUND</span>}
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <button onClick={toggleMute} style={{border:'1px solid #ffffff12',background:'transparent',color:muteState?'#333':'#ffffff44',fontSize:13,cursor:'pointer',borderRadius:4,padding:'2px 8px'}}>{muteState?'🔇':'🔊'}</button>
          <button onClick={restart} style={{border:'1px solid #ffffff12',background:'transparent',color:'#ffffff28',fontSize:8,cursor:'pointer',borderRadius:4,padding:'3px 8px',letterSpacing:1,fontFamily:'Georgia,serif'}}>NEW GAME</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* BOARD */}
        <div style={{flex:1,padding:'10px 12px',overflowY:'auto',minWidth:0,display:'flex',flexDirection:'column',gap:8}}>
          {/* Nobles */}
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <div style={{width:36,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'#f0c84030',fontSize:7,letterSpacing:1,textAlign:'center',writingMode:'vertical-lr',transform:'rotate(180deg)'}}>NOBLES</span>
            </div>
            {game.nobles.map(n => <NobleTile key={n.id} noble={n}/>)}
          </div>
          <div style={{height:1,background:'linear-gradient(90deg,transparent,#ffffff08,transparent)'}}/>

          {/* Tiers */}
          {[3,2,1].map(tier=>(
            <div key={tier} style={{display:'flex',gap:6,alignItems:'center'}}>
              <div onClick={()=>{if(mode==='reserve'&&game.deck[tier].length>0)reserveCard(null,true,tier);}}
                style={{width:36,minWidth:36,height:112,borderRadius:8,flexShrink:0,cursor:mode==='reserve'&&game.deck[tier].length>0?'pointer':'default',
                  background:`linear-gradient(160deg,${tierC[tier]}12,#06040e)`,
                  border:`1.5px solid ${mode==='reserve'&&game.deck[tier].length>0?tierC[tier]+'cc':tierC[tier]+'28'}`,
                  boxShadow:mode==='reserve'&&game.deck[tier].length>0?`0 0 14px ${tierC[tier]}55`:'none',
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,transition:'all 0.2s'}}>
                <span style={{color:tierC[tier],fontSize:11,fontWeight:700,fontFamily:'Georgia,serif'}}>{['I','II','III'][tier-1]}</span>
                <div style={{width:18,height:1,background:`${tierC[tier]}44`}}/>
                <span style={{color:'#ffffff44',fontSize:11}}>{game.deck[tier].length}</span>
                {mode==='reserve'&&game.deck[tier].length>0 && <span style={{color:tierC[tier],fontSize:7,letterSpacing:1}}>TAKE</span>}
              </div>
              {Array.from({length:4}).map((_,i)=>{
                const card = game.board[tier][i];
                return <CardTile key={card?card.id:`e${tier}${i}`} card={card}
                  onClick={card?()=>{if(!isMyTurn)return;if(mode==='reserve')reserveCard(card,false,null);else if(!mode)buyCard(card,false);}:undefined}
                  canBuy={!!card&&isMyTurn&&!mode&&canAfford(h,card)}
                  mode={isMyTurn?mode:null}
                  flash={flashCard===card?.id}/>;
              })}
            </div>
          ))}
          <div style={{height:1,background:'linear-gradient(90deg,transparent,#ffffff08,transparent)'}}/>

          {/* Bank */}
          <div style={{padding:'10px 12px',background:'linear-gradient(145deg,#0a0818,#070612)',borderRadius:10,border:'1px solid #ffffff0c'}}>
            <div style={{fontSize:8,color:'#ffffff22',letterSpacing:2,marginBottom:10}}>{mode==='gems'?'SELECT GEMS — UP TO 3 DIFFERENT, OR 2 SAME (NEED 4+)':'GEM BANK'}</div>
            <div style={{display:'flex',gap:10,alignItems:'flex-end',flexWrap:'wrap'}}>
              {GEMS.map(col=>{
                const canP=canPick(col), p=picked[col]||0, avail=game.bank[col]-p;
                return (
                  <div key={col} onClick={canP?()=>{snd.gemPick(col);setPicked(prev=>({...prev,[col]:(prev[col]||0)+1}))}:undefined}
                    style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:canP?'pointer':'default',opacity:avail<=0&&!p?0.12:1,transition:'opacity 0.2s'}}>
                    <Gem col={col} size={46} count={p||null} picked={p>0} glow={canP||p>0} dimmed={!canP&&!p&&mode==='gems'}/>
                    <div style={{textAlign:'center'}}>
                      <div style={{color:GC[col],fontSize:13,fontWeight:700,lineHeight:1}}>{avail}</div>
                      <div style={{color:'#ffffff1e',fontSize:7,letterSpacing:1}}>{GNAME[col].slice(0,3).toUpperCase()}</div>
                    </div>
                  </div>
                );
              })}
              {/* Gold wild */}
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,opacity:game.bank.gold?1:0.15}}>
                <div style={{position:'relative',width:46,height:46}}>
                  <Gem col="gold" size={46}/>
                  <span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#fff',textShadow:'0 1px 4px rgba(0,0,0,0.9)',lineHeight:1}}>★</span>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{color:GC.gold,fontSize:13,fontWeight:700,lineHeight:1}}>{game.bank.gold}</div>
                  <div style={{color:'#ffffff1e',fontSize:7,letterSpacing:1}}>WILD</div>
                </div>
              </div>
            </div>
            {mode==='gems' && (
              <div style={{marginTop:10,display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <span style={{color:'#ffffff33',fontSize:9,letterSpacing:1}}>{pickedTotal}/3 selected</span>
                {pickedTotal>0 && <Btn label="CONFIRM TAKE" col="#4caf78" cb={confirmGems} dis={false}/>}
                <Btn label="CANCEL" col="#ffffff33" cb={()=>{setMode(null);setPicked({});}} dis={false}/>
                {pickedTotal>0 && <span onClick={()=>setPicked({})} style={{color:'#ffffff1e',fontSize:9,cursor:'pointer'}}>reset</span>}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{width:215,background:'linear-gradient(180deg,#06050c,#07060e)',borderLeft:'1px solid #ffffff08',padding:'8px 10px',display:'flex',flexDirection:'column',gap:7,overflowY:'auto',flexShrink:0}}>
          {game.players.map((p,i)=>{
            const active = i === game.turn && phase !== 'over';
            const bonuses = GEMS.reduce((a,c)=>({...a,[c]:getBonus(p,c)}),{});
            return (
              <div key={i} style={{borderRadius:8,padding:'8px 10px',background:active?'#13102a':'#0b0918',border:`1px solid ${active?'#f0c84044':'#ffffff08'}`,transition:'all 0.4s',boxShadow:active?'0 0 18px #f0c84010':'none'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <div>
                    <div style={{color:active?'#c0a860':'#333',fontSize:8,letterSpacing:2}}>{p.name.toUpperCase()}{i===myPlayerIndex?' (YOU)':p.kind==='ai'?' (AI)':''}</div>
                    {active && <div style={{color:'#f0c840',fontSize:7,letterSpacing:2,animation:'pu 1s infinite'}}>ACTIVE</div>}
                  </div>
                  <div style={{display:'flex',alignItems:'baseline',gap:3}}>
                    <span style={{color:'#f0c840',fontWeight:700,fontSize:22,fontFamily:'Georgia,serif',lineHeight:1}}>{p.points}</span>
                    <span style={{color:'#ffffff18',fontSize:9}}>/15</span>
                  </div>
                </div>
                {/* Points bar */}
                <div style={{height:2,background:'#ffffff08',borderRadius:1,marginBottom:7,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${Math.min(100,(p.points/15)*100)}%`,background:'linear-gradient(90deg,#f0c840,#f0a040)',borderRadius:1,transition:'width 0.6s ease'}}/>
                </div>
                {/* Tokens */}
                <div style={{display:'flex',flexWrap:'wrap',gap:3,marginBottom:5}}>
                  {[...GEMS,'gold'].map(c=>(p.tokens[c]||0)>0&&(
                    <div key={c} style={{display:'flex',alignItems:'center',gap:3,borderRadius:5,padding:'2px 6px',background:GB[c]||'#1a1a28',border:`1px solid ${GC[c]}30`}}>
                      <Gem col={c} size={14}/><span style={{color:GC[c],fontSize:10,fontWeight:700}}>{p.tokens[c]}</span>
                    </div>
                  ))}
                  <span style={{color:'#ffffff18',fontSize:8,alignSelf:'center'}}>({totalTok(p)})</span>
                </div>
                {/* Card bonuses */}
                {Object.values(bonuses).some(v=>v>0) && (
                  <div style={{display:'flex',flexWrap:'wrap',gap:3,paddingTop:5,borderTop:'1px solid #ffffff08'}}>
                    {GEMS.filter(c=>bonuses[c]>0).map(c=>(
                      <div key={c} style={{display:'flex',alignItems:'center',gap:2,borderRadius:4,padding:'1px 5px',background:GB[c],border:`1px solid ${GC[c]}40`}}>
                        <Dot col={c} sz={7}/><span style={{color:GC[c],fontSize:9,fontWeight:700}}>+{bonuses[c]}</span>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reserved (local player only) */}
                {i===myPlayerIndex && p.reserved.length>0 && (
                  <div style={{paddingTop:6,borderTop:'1px solid #ffffff08',marginTop:5}}>
                    <div style={{fontSize:8,color:'#ffffff22',letterSpacing:1,marginBottom:4}}>RESERVED</div>
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      {p.reserved.map(card=><CardTile key={card.id} card={card} small onClick={()=>buyCard(card,true)} canBuy={isMyTurn&&!mode&&canAfford(p,card)} mode={null} flash={flashCard===card.id}/>)}
                    </div>
                  </div>
                )}
                {i!==myPlayerIndex && p.reserved.length>0 && <div style={{fontSize:8,color:'#ffffff20',marginTop:4,paddingTop:4,borderTop:'1px solid #ffffff08'}}>{p.reserved.length} reserved</div>}
              </div>
            );
          })}

          {/* Actions */}
          {isMyTurn && !mode && (
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <div onClick={()=>{snd.click();setMode('gems');}} style={{padding:'9px 12px',borderRadius:7,border:'1.5px solid #6ab4f8',background:'#6ab4f808',cursor:'pointer',display:'flex',alignItems:'center',gap:8,boxShadow:'0 0 10px #6ab4f811',transition:'background 0.2s'}}>
                <Gem col="blue" size={22} glow/>
                <span style={{color:'#6ab4f8',fontSize:10,fontWeight:700,letterSpacing:1}}>TAKE GEMS</span>
              </div>
              <div onClick={h.reserved.length<3?()=>{snd.click();setMode('reserve');}:undefined}
                style={{padding:'9px 12px',borderRadius:7,border:`1.5px solid ${h.reserved.length>=3?'#1e1e2e':'#c858e0'}`,background:h.reserved.length>=3?'transparent':'#c858e008',cursor:h.reserved.length>=3?'not-allowed':'pointer',display:'flex',alignItems:'center',gap:8,opacity:h.reserved.length>=3?0.35:1,boxShadow:h.reserved.length<3?'0 0 10px #c858e011':'none'}}>
                <span style={{fontSize:16}}>📋</span>
                <div>
                  <div style={{color:h.reserved.length>=3?'#1e1e2e':'#c858e0',fontSize:10,fontWeight:700,letterSpacing:1}}>RESERVE CARD</div>
                  <div style={{color:'#c858e044',fontSize:7}}>{h.reserved.length}/3 reserved</div>
                </div>
              </div>
            </div>
          )}

          {mode==='reserve' && (
            <div style={{padding:'8px 10px',background:'#140820',borderRadius:7,border:'1px solid #c858e055',animation:'pi 0.2s ease'}}>
              <div style={{color:'#c858e0',fontSize:9,lineHeight:1.6,marginBottom:7}}>Click any visible card or a deck pile to reserve it. You receive a gold (wild) token.</div>
              <Btn label="CANCEL" col="#ffffff33" cb={()=>setMode(null)} dis={false}/>
            </div>
          )}

          {phase==='discard' && (
            <div style={{padding:'10px',background:'#1c0808',borderRadius:8,border:'1px solid #f0606055',animation:'pi 0.2s ease'}}>
              <div style={{color:'#f06060',fontSize:10,fontWeight:700,marginBottom:7}}>⚠ Discard {Math.max(0,overBy-discTotal)} gem(s)</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>
                {[...GEMS,'gold'].map(c=>{
                  const have=h.tokens[c]||0, disc=discQ[c]||0;
                  if (!have) return null;
                  return (
                    <div key={c} onClick={()=>have-disc>0&&setDiscQ(prev=>({...prev,[c]:(prev[c]||0)+1}))}
                      style={{display:'flex',alignItems:'center',gap:3,padding:'3px 7px',borderRadius:5,cursor:have-disc>0?'pointer':'default',background:disc?'#380a0a':'#181628',border:`1px solid ${GC[c]}44`}}>
                      <Gem col={c} size={16}/><span style={{color:GC[c],fontSize:10}}>{have-disc}</span>
                      {disc>0&&<span style={{color:'#f06060',fontSize:8}}>-{disc}</span>}
                    </div>
                  );
                })}
              </div>
              <div style={{display:'flex',gap:6}}>
                {overBy-discTotal===0 && <Btn label="CONFIRM" col="#4caf78" cb={confirmDiscard} dis={false}/>}
                <Btn label="RESET" col="#ffffff30" cb={()=>setDiscQ({})} dis={false}/>
              </div>
            </div>
          )}

          {isAITurn && (
            <div style={{padding:'9px 12px',background:'#0c0a1e',borderRadius:7,border:'1px solid #ffffff0c',display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#6ab4f8',animation:'pu 0.9s infinite'}}/>
              <span style={{color:'#ffffff40',fontSize:9,letterSpacing:1}}>{cur && cur.name.toUpperCase()} IS THINKING...</span>
            </div>
          )}
          {phase==='acting' && !isMyTurn && !isAITurn && (
            <div style={{padding:'9px 12px',background:'#0c0a1e',borderRadius:7,border:'1px solid #ffffff0c',display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:'#c858e0',animation:'pu 0.9s infinite'}}/>
              <span style={{color:'#ffffff40',fontSize:9,letterSpacing:1}}>WAITING FOR {cur && cur.name.toUpperCase()}...</span>
            </div>
          )}

          {/* Log */}
          <div style={{flex:1,padding:'8px',background:'#040310',borderRadius:7,border:'1px solid #ffffff06',overflowY:'auto',minHeight:80}}>
            <div style={{fontSize:7,color:'#ffffff18',letterSpacing:2,marginBottom:5}}>GAME LOG</div>
            {log.map((msg,i)=>(
              <div key={i} style={{fontSize:9,color:i===0?'#ffffff77':'#ffffff1e',marginBottom:3,lineHeight:1.6,paddingBottom:i===0?4:0,borderBottom:i===0?'1px solid #ffffff08':'none'}}>{msg}</div>
            ))}
          </div>

          <div style={{fontSize:8,color:'#ffffff13',lineHeight:1.7}}>
            Click card to buy · Take Gems · Reserve = block + gold · 15 pts wins
          </div>
        </div>
      </div>
    </div>
  );
}
