const ORBS = [
  { color: '#6ab4f8', size: 320, anim: 'orb-drift-a', dur: 58 },
  { color: '#8a6fd0', size: 360, anim: 'orb-drift-b', dur: 64 },
  { color: '#f0c840', size: 260, anim: 'orb-drift-c', dur: 70 },
];

export default function GemOrbs() {
  return (
    <>
      {ORBS.map((o, i) => (
        <div
          key={i}
          className="gem-orb"
          style={{
            width: o.size,
            height: o.size,
            background: o.color,
            animation: `${o.anim} ${o.dur}s ease-in-out infinite`,
            animationDelay: `${i * -9}s`,
          }}
        />
      ))}
    </>
  );
}
