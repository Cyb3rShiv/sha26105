import Reveal from './Reveal';

const TONES = {
  neutral: { value: 'text-ink-50', accent: 'bg-ink-600' },
  brass: { value: 'text-brass-300', accent: 'bg-brass-500' },
  danger: { value: 'text-danger-400', accent: 'bg-danger-500' },
  warn: { value: 'text-warn-400', accent: 'bg-warn-500' },
  ok: { value: 'text-ok-400', accent: 'bg-ok-500' },
  info: { value: 'text-info-400', accent: 'bg-info-500' },
};

/**
 * KPI stat tile: mono uppercase label, serif display value,
 * hairline footer with sub-label + badge.
 */
export default function StatCard({ label, value, sub, badge, badgeTone, tone = 'neutral', delay = 0, className = '' }) {
  const t = TONES[tone] || TONES.neutral;
  const badgeClasses = {
    danger: 'bg-danger-950 text-danger-300 border-danger-800',
    warn: 'bg-warn-950 text-warn-300 border-warn-800',
    ok: 'bg-ok-950 text-ok-300 border-ok-800',
    brass: 'bg-brass-950 text-brass-300 border-brass-800',
    info: 'bg-info-950 text-info-300 border-info-800',
    neutral: 'bg-ink-850 text-ink-300 border-ink-700',
  };

  return (
    <Reveal
      delay={delay}
      className={`panel panel-hover relative overflow-hidden p-5 flex flex-col ${className}`}
    >
      <span className={`absolute left-0 top-5 bottom-5 w-[2px] rounded-full ${t.accent} opacity-70`} />
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow">{label}</span>
        {badge && (
          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${badgeClasses[badgeTone] || badgeClasses.neutral}`}>
            {badge}
          </span>
        )}
      </div>
      <div className={`display-num text-[28px] leading-none mt-3 ${t.value}`}>{value}</div>
      {sub && (
        <div className="mt-3.5 pt-3 border-t border-ink-800 text-[11px] text-ink-400 font-mono">{sub}</div>
      )}
    </Reveal>
  );
}
