import React from 'react';

/**
 * Severity / priority pill. Public API unchanged:
 * { level, priority, isKev, className }
 */
const PRIORITY_CONFIG = {
  P1: { cls: 'bg-danger-950 text-danger-400 border border-danger-800', dot: 'bg-danger-500 animate-pulse-dot-red' },
  P2: { cls: 'bg-warn-950 text-warn-400 border border-warn-800', dot: 'bg-warn-500' },
  P3: { cls: 'bg-info-950 text-info-300 border border-info-800', dot: 'bg-info-500' },
};

const LEVEL_STYLES = {
  critical: 'bg-danger-950 text-danger-400 border border-danger-800',
  high: 'bg-warn-950 text-warn-400 border border-warn-800',
  medium: 'bg-warn-950 text-warn-300 border border-warn-900',
  low: 'bg-ok-950 text-ok-400 border border-ok-800',
  info: 'bg-ok-950 text-ok-400 border border-ok-800',
  internet: 'bg-info-950 text-info-300 border border-info-800',
};

export default function RiskBadge({ level, priority, isKev, className = '' }) {
  if (isKev) {
    return (
      <span className={`severity-badge bg-danger-950 text-danger-400 border border-danger-800 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-danger-500 animate-pulse-dot-red" />
        CISA KEV
      </span>
    );
  }

  if (priority) {
    const conf = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.P3;
    return (
      <span className={`severity-badge ${conf.cls} ${className}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
        {priority}
      </span>
    );
  }

  const levelLower = (level || '').toLowerCase();
  let badgeStyle = 'bg-ink-850 text-ink-200 border border-ink-700';
  for (const key of Object.keys(LEVEL_STYLES)) {
    if (levelLower.includes(key)) {
      badgeStyle = LEVEL_STYLES[key];
      break;
    }
  }

  return <span className={`severity-badge ${badgeStyle} ${className}`}>{level}</span>;
}
