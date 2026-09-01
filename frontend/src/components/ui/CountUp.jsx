import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animates a numeric value from its previous value to the new one
 * using requestAnimationFrame. Formatting is delegated to `format`
 * so monetary figures keep their ₹ Cr/L/K rendering untouched.
 */
export default function CountUp({ value, format = (v) => v, duration = 850, className = '' }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const frameRef = useRef(null);

  useEffect(() => {
    const from = Number(prevRef.current) || 0;
    const to = Number(value) || 0;
    prevRef.current = value;

    if (prefersReducedMotion() || from === to) {
      setDisplay(to);
      return;
    }

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span className={className}>{format(display)}</span>;
}
