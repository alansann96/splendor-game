const ORBS = [
  { color: '#6ab4f8', size: 460, anim: 'orb-drift-a', dur: 52 }, // sapphire
  { color: '#8a6fd0', size: 520, anim: 'orb-drift-b', dur: 64 }, // onyx
  { color: '#f06060', size: 380, anim: 'orb-drift-c', dur: 58 }, // ruby
  { color: '#52cf7a', size: 340, anim: 'orb-drift-a', dur: 70 }, // emerald
  { color: '#f0c840', size: 300, anim: 'orb-drift-b', dur: 48 }, // gold
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
            animationDelay: `${i * -7}s`,
          }}
        />
      ))}
    </>
  );
}
