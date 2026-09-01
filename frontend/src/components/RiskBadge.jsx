import React from 'react';

export default function RiskBadge({ level, priority, isKev, className = "" }) {
  if (isKev) {
    return (
      <span className={`cyber-badge bg-rose-950/80 text-rose-400 border border-rose-600/50 shadow-sm ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        CISA KEV
      </span>
    );
  }

  if (priority) {
    const priorityConfig = {
      P1: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-600/50', dot: 'bg-red-500 animate-ping' },
      P2: { bg: 'bg-amber-950/80', text: 'text-amber-400', border: 'border-amber-600/50', dot: 'bg-amber-500' },
      P3: { bg: 'bg-blue-950/80', text: 'text-blue-400', border: 'border-blue-600/50', dot: 'bg-blue-500' },
    };
    const conf = priorityConfig[priority] || priorityConfig.P3;
    return (
      <span className={`cyber-badge ${conf.bg} ${conf.text} border ${conf.border} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`}></span>
        {priority}
      </span>
    );
  }

  const levelLower = (level || '').toLowerCase();
  let badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";

  if (levelLower.includes('critical')) {
    badgeStyle = "bg-red-950/80 text-red-400 border-red-600/50 shadow-glow-crimson/20";
  } else if (levelLower.includes('high')) {
    badgeStyle = "bg-amber-950/80 text-amber-400 border-amber-600/50";
  } else if (levelLower.includes('medium')) {
    badgeStyle = "bg-yellow-950/80 text-yellow-400 border-yellow-600/40";
  } else if (levelLower.includes('low') || levelLower.includes('info')) {
    badgeStyle = "bg-emerald-950/80 text-emerald-400 border-emerald-600/40";
  } else if (levelLower.includes('internet')) {
    badgeStyle = "bg-purple-950/80 text-purple-300 border-purple-500/50";
  }

  return (
    <span className={`cyber-badge ${badgeStyle} border ${className}`}>
      {level}
    </span>
  );
}
