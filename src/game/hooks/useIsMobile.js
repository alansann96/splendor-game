import { useEffect, useState } from 'react';

export function useIsMobile(threshold = 760) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < threshold);
  useEffect(() => {
    const on = () => setM(window.innerWidth < threshold);
    window.addEventListener('resize', on);
    on();
    return () => window.removeEventListener('resize', on);
  }, [threshold]);
  return m;
}
