import React from 'react';
import Reveal from './Reveal';

export default function PageHeader({ icon: Icon, eyebrow, index, title, description, actions }) {
  return (
    <Reveal className="relative mb-6">
      <div className="flex items-start gap-4">
        {index && (
          <span className="font-mono text-xs font-bold text-slate-400 hidden sm:block pt-1 shrink-0" aria-hidden="true">
            [{index}]
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              {eyebrow && (
                <div className="flex items-center gap-2 mb-1.5">
                  {Icon && (
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
                      <Icon className="w-3 h-3" />
                    </span>
                  )}
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-800">{eyebrow}</span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
              {description && (
                <p className="text-[13px] text-slate-600 mt-1.5 max-w-2xl leading-relaxed">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
          </div>
        </div>
      </div>
      <div className="mt-5 h-px bg-slate-200" aria-hidden="true" />
    </Reveal>
  );
}
