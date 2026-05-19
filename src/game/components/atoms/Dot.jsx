import { GC, GD } from '../../constants';

export default function Dot({ col, sz = 9 }) {
  return (
    <div
      style={{
        width: sz,
        height: sz,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'inline-block',
        background: `radial-gradient(circle at 33% 28%, rgba(255,255,255,0.75), ${GC[col]} 50%, ${GD[col]})`,
      }}
    />
  );
}
