import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

export default function CountUp({
  to = 0,
  duration = 1.4,
  delay = 0,
  suffix = '',
  decimals = 0,
  comma = false,
  className = '',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Number(v.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [inView, to, duration, delay, decimals]);

  const display = comma ? val.toLocaleString() : String(val);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}