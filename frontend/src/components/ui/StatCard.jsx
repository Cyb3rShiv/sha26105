import React from 'react';
import Reveal from './Reveal';

const TONES = {
  neutral: { value: 'text-slate-900', dot: 'bg-slate-400' },
  brass: { value: 'text-teal-700', dot: 'bg-teal-600' },
  danger: { value: 'text-rose-700', dot: 'bg-rose-500' },
  warn: { value: 'text-amber-700', dot: 'bg-amber-500' },
  ok: { value: 'text-emerald-700', dot: 'bg-emerald-500' },
  info: { value: 'text-blue-700', dot: 'bg-blue-500' },
};

export default function StatCard({ label, value, sub, badge, badgeTone, tone = 'neutral', delay = 0, className = '' }) {
  const t = TONES[tone] || TONES.neutral;
  const badgeClasses = {
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warn: 'bg-amber-50 text-amber-800 border-amber-200',
    ok: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    brass: 'bg-teal-50 text-teal-800 border-teal-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <Reveal
      delay={delay}
      className={`panel panel-hover p-5 flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${t.dot}`} />
            <span className="text-[11.5px] font-mono font-semibold uppercase tracking-wider text-slate-500">{label}</span>
          </div>
          {badge && (
            <span className={`text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${badgeClasses[badgeTone] || badgeClasses.neutral}`}>
              {badge}
            </span>
          )}
        </div>
        <div className={`text-[25px] font-bold tracking-tight mt-2.5 ${t.value}`}>{value}</div>
      </div>
      {sub && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-[11.5px] text-slate-500 font-mono">{sub}</div>
      )}
    </Reveal>
  );
}
