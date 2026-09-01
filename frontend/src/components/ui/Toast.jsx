import { Sparkles, CheckCircle2, X } from 'lucide-react';

/**
 * Global toast. Auto-dismiss timing stays owned by App state
 * (unchanged logic) — this only restyles presentation.
 */
export default function Toast({ message, tone = 'info', onClose }) {
  const Icon = tone === 'ok' ? CheckCircle2 : Sparkles;
  const accent = tone === 'ok' ? 'text-ok-400 border-ok-800' : 'text-brass-400 border-brass-800';

  return (
    <div className="fixed top-20 right-4 md:right-6 z-50 toast-enter pointer-events-none">
      <div className="pointer-events-auto panel ledger-marks flex items-start gap-3 pl-4 pr-2 py-3 max-w-md shadow-2xl shadow-black/50 bg-ink-850">
        <span className={`flex items-center justify-center w-7 h-7 rounded-md border bg-ink-900 shrink-0 ${accent}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <p className="text-xs text-ink-100 leading-relaxed pt-1 flex-1">{message}</p>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="p-1.5 rounded-md text-ink-400 hover:text-ink-50 hover:bg-ink-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
