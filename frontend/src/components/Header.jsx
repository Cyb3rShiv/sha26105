import React from 'react';
import { AlertTriangle, Building2, Menu, RefreshCw, Sparkles } from 'lucide-react';
import CurrencyFormatter from './CurrencyFormatter';

export default function Header({
  currentEal = 18400000,
  riskScore = 72,
  onSimulateEvent,
  onReset,
  isSimulating = false,
  onToggleNav,
}) {
  const scoreTone =
    riskScore > 70 ? 'text-danger-400 bg-danger-950 border-danger-800' : 'text-warn-400 bg-warn-950 border-warn-800';

  return (
    <header className="h-16 bg-ink-950/90 border-b border-ink-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md gap-3">
      {/* Left: mobile menu + entity */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleNav}
          aria-label="Open navigation menu"
          className="p-2 rounded-lg text-ink-300 hover:text-ink-50 hover:bg-ink-850 border border-ink-800 transition-colors lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-ink-900 border border-ink-800 min-w-0">
          <Building2 className="w-4 h-4 text-brass-400 shrink-0" />
          <span className="text-xs font-semibold text-ink-100 truncate">FinTrust Bank Ltd.</span>
          <span className="hidden xl:inline text-[10px] text-ink-400 font-mono border-l border-ink-700 pl-2.5">
            Retail &amp; Core Banking
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warn-950/60 border border-warn-800/60 text-warn-400 text-[10.5px] font-medium whitespace-nowrap">
          <AlertTriangle className="w-3 h-3" />
          <span>Synthetic Demo Data</span>
        </div>
      </div>

      {/* Right: live ticker + actions */}
      <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-3 pl-3.5 pr-2.5 py-1.5 rounded-lg bg-ink-900 border border-ink-800">
          <div className="text-right">
            <div className="eyebrow">Live Enterprise EAL</div>
            <div className="flex items-center justify-end gap-2 mt-0.5">
              <span className="text-[13px] text-danger-400">
                <CurrencyFormatter value={currentEal} />
              </span>
              <span className={`text-[9px] px-1.5 py-px rounded border font-mono font-bold ${scoreTone}`}>
                {riskScore}/100
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onSimulateEvent}
          disabled={isSimulating}
          className="btn btn-primary"
          title="Inject a realistic synthetic security telemetry event and trigger live risk recalculation"
        >
          {isSimulating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isSimulating ? 'Recalculating…' : 'Simulate Security Event'}</span>
          <span className="sm:hidden">{isSimulating ? '…' : 'Simulate'}</span>
        </button>

        <button
          onClick={onReset}
          aria-label="Reset to initial seed state"
          className="btn btn-ghost btn-icon"
          title="Reset back to initial seed state"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
