import React from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, tone = 'info', onClose }) {
  const Icon = tone === 'ok' ? CheckCircle2 : Sparkles;
  const accent = tone === 'ok' ? 'text-emerald-400 border-emerald-500/30' : 'text-emerald-400 border-emerald-500/30';

  return (
    <div className="fixed top-20 right-4 md:right-6 z-50 pointer-events-none transition-all duration-300">
      <div className="pointer-events-auto panel flex items-start gap-3 pl-4 pr-2 py-3 max-w-md shadow-2xl shadow-black/80 bg-[#141724] border border-white/[0.1] border-t-emerald-500/40">
        <span className={`flex items-center justify-center w-7 h-7 rounded-lg border bg-[#0c0e15] shrink-0 ${accent}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <p className="text-xs text-slate-100 font-medium leading-relaxed pt-1 flex-1">{message}</p>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
