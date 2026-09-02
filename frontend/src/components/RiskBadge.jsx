import React from 'react';

const PRIORITY_CONFIG = {
  P1: { cls: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500 animate-pulse' },
  P2: { cls: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  P3: { cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
};

const LEVEL_STYLES = {
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
  high: 'bg-amber-50 text-amber-800 border-amber-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-100',
  low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  internet: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

export default function RiskBadge({ level, priority, isKev, className = '' }) {
  if (isKev) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
        CISA KEV
      </span>
    );
  }

  if (priority) {
    const conf = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.P3;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${conf.cls} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
        {priority}
      </span>
    );
  }

  const levelLower = (level || '').toLowerCase();
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  for (const key of Object.keys(LEVEL_STYLES)) {
    if (levelLower.includes(key)) {
      badgeStyle = LEVEL_STYLES[key];
      break;
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-semibold border ${badgeStyle} ${className}`}>
      {level}
    </span>
  );
}
