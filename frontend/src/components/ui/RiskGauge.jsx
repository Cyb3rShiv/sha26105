import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLOR = {
  danger: '#e05260',
  warn: '#e39b3d',
  ok: '#46a873',
};

/**
 * Semicircular SVG gauge for the 0–100 enterprise risk score.
 * Sweep animation on mount / value change (respects reduced motion).
 */
export default function RiskGauge({ score = 0, size = 196, caption = 'Enterprise Risk Score' }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = Math.min(100, Math.max(0, Number(score) || 0));
    prevRef.current = to;

    if (prefersReducedMotion() || from === to) {
      setDisplay(to);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [score]);

  const strokeW = 9;
  const r = (size - strokeW * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const arc = Math.PI * r;
  const progress = Math.min(100, Math.max(0, display)) / 100;

  const tone = display >= 70 ? 'danger' : display >= 40 ? 'warn' : 'ok';
  const color = COLOR[tone];
  const trackD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  const polar = (deg) => {
    const rad = (Math.PI * deg) / 180;
    return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
  };
  const tickAt = (deg, len = 5) => {
    const [x1, y1] = polar(deg);
    const rad = (Math.PI * deg) / 180;
    const x2 = cx + (r + len) * Math.cos(rad);
    const y2 = cy - (r + len) * Math.sin(rad);
    return { x1, y1, x2, y2 };
  };

  return (
    <div className="relative inline-flex flex-col items-center" role="img" aria-label={`${caption}: ${score} out of 100`}>
      <svg width={size} height={size / 2 + 26} viewBox={`0 0 ${size} ${size / 2 + 26}`}>
        {/* end ticks */}
        {[0, 45, 90, 135, 180].map((deg) => {
          const t = tickAt(deg);
          return (
            <line
              key={deg}
              x1={t.x1}
              y1={t.y1 + 6}
              x2={t.x2}
              y2={t.y2 + 6}
              stroke="#303850"
              strokeWidth="1"
            />
          );
        })}
        <path d={trackD} fill="none" stroke="#242b3d" strokeWidth={strokeW} strokeLinecap="round" transform={`translate(0 ${strokeW / 2 + 4})`} />
        <path
          d={trackD}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={arc}
          strokeDashoffset={arc * (1 - progress)}
          transform={`translate(0 ${strokeW / 2 + 4})`}
          style={{ transition: 'stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <div className="display-num text-[40px] leading-none" style={{ color }}>
          {Math.round(display)}
        </div>
        <div className="text-[10px] font-mono text-ink-400 mt-1 tracking-wider">/ 100</div>
      </div>
      <div className="eyebrow mt-1.5">{caption}</div>
    </div>
  );
}
