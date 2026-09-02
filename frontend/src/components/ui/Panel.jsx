import React from 'react';

/**
 * Koyeb developer console elevated panel with crisp header & top specular highlight
 */
export default function Panel({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  className = '',
  bodyClassName = 'p-5',
  flush = false,
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-start gap-2.5 min-w-0">
            {Icon && <Icon className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />}
            <div className="min-w-0">
              <h2 className="text-[13px] font-semibold text-white leading-tight">{title}</h2>
              {subtitle && <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-normal">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div className={flush ? '' : bodyClassName}>{children}</div>
    </section>
  );
}
