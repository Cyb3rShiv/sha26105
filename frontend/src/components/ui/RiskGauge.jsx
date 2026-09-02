import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const COLOR = {
  danger: '#dc2626',
  warn: '#d97706',
  ok: '#16a34a',
};

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

  const strokeW = 8;
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
  const tickAt = (deg, len = 4) => {
    const [x1, y1] = polar(deg);
    const rad = (Math.PI * deg) / 180;
    const x2 = cx + (r + len) * Math.cos(rad);
    const y2 = cy - (r + len) * Math.sin(rad);
    return { x1, y1, x2, y2 };
  };

  return (
    <div className="relative inline-flex flex-col items-center" role="img" aria-label={`${caption}: ${score} out of 100`}>
      <svg width={size} height={size / 2 + 24} viewBox={`0 0 ${size} ${size / 2 + 24}`}>
        {[0, 45, 90, 135, 180].map((deg) => {
          const t = tickAt(deg);
          return (
            <line
              key={deg}
              x1={t.x1}
              y1={t.y1 + 4}
              x2={t.x2}
              y2={t.y2 + 4}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}
        <path d={trackD} fill="none" stroke="#e2e8f0" strokeWidth={strokeW} strokeLinecap="round" transform={`translate(0 ${strokeW / 2 + 4})`} />
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
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <div className="text-[34px] font-bold font-sans tracking-tight leading-none" style={{ color }}>
          {Math.round(display)}
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-wider">/ 100</div>
      </div>
      {caption && <div className="text-[10.5px] font-mono uppercase text-slate-500 font-semibold mt-1">{caption}</div>}
    </div>
  );
}
