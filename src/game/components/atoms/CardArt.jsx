import { GC } from '../../constants';

export default function CardArt({ col, w, h }) {
  const cx = w / 2;
  const cy = h / 2;
  const s = Math.min(w, h);
  const c = GC[col];

  const arts = {
    white: (
      <g opacity="0.5">
        <circle cx={cx} cy={cy} r={s * 0.3} fill="none" stroke={c} strokeWidth="1.2" />
        <circle cx={cx} cy={cy} r={s * 0.17} fill={c} fillOpacity="0.28" />
        <line x1={cx} y1={cy - s * 0.4} x2={cx} y2={cy + s * 0.4} stroke={c} strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1={cx - s * 0.4} y1={cy} x2={cx + s * 0.4} y2={cy} stroke={c} strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx={cx} cy={cy} r={s * 0.06} fill={c} />
      </g>
    ),
    blue: (
      <g opacity="0.55">
        <path d={`M${cx - s * 0.4},${cy + s * 0.08} Q${cx},${cy - s * 0.28} ${cx + s * 0.4},${cy + s * 0.08}`} fill="none" stroke={c} strokeWidth="1.8" />
        <path d={`M${cx - s * 0.4},${cy + s * 0.22} Q${cx},${cy - s * 0.12} ${cx + s * 0.4},${cy + s * 0.22}`} fill="none" stroke={c} strokeWidth="1.1" opacity="0.5" />
        <path d={`M${cx - s * 0.3},${cy - s * 0.1} Q${cx},${cy + s * 0.18} ${cx + s * 0.3},${cy - s * 0.1}`} fill="none" stroke={c} strokeWidth="0.7" opacity="0.35" />
      </g>
    ),
    green: (
      <g opacity="0.5">
        <ellipse cx={cx} cy={cy} rx={s * 0.28} ry={s * 0.35} fill={c} fillOpacity="0.14" stroke={c} strokeWidth="1.2" />
        <line x1={cx} y1={cy - s * 0.36} x2={cx} y2={cy + s * 0.38} stroke={c} strokeWidth="1.5" />
        <line x1={cx - s * 0.25} y1={cy - s * 0.06} x2={cx + s * 0.25} y2={cy - s * 0.06} stroke={c} strokeWidth="0.9" opacity="0.6" />
        <line x1={cx - s * 0.18} y1={cy + s * 0.1} x2={cx + s * 0.18} y2={cy + s * 0.1} stroke={c} strokeWidth="0.7" opacity="0.4" />
      </g>
    ),
    red: (
      <g opacity="0.55">
        <path
          d={`M${cx},${cy - s * 0.32} L${cx - s * 0.22},${cy + s * 0.04} L${cx - s * 0.38},${cy - s * 0.05} L${cx},${cy + s * 0.36} L${cx + s * 0.38},${cy - s * 0.05} L${cx + s * 0.22},${cy + s * 0.04}Z`}
          fill={c}
          fillOpacity="0.22"
          stroke={c}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
    ),
    black: (
      <g opacity="0.5">
        <circle cx={cx} cy={cy} r={s * 0.3} fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="4 3" />
        <circle cx={cx} cy={cy - s * 0.15} r={s * 0.16} fill="none" stroke={c} strokeWidth="1.6" />
        <circle cx={cx} cy={cy} r={s * 0.07} fill={c} opacity="0.6" />
      </g>
    ),
  };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      {arts[col] || arts.black}
    </svg>
  );
}
