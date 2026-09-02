import React from 'react';
import { AlertTriangle, Building2, Menu, RefreshCw, Sparkles, Home, Search } from 'lucide-react';
import CurrencyFormatter from './CurrencyFormatter';

export default function Header({
  currentEal = 18400000,
  riskScore = 72,
  onSimulateEvent,
  onReset,
  isSimulating = false,
  onToggleNav,
  onGoToLanding,
  onOpenCommandPalette,
}) {
  const isHighRisk = riskScore > 70;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs gap-3">
      {/* Left: Mobile menu + Breadcrumbs/Organization context */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleNav}
          aria-label="Open navigation menu"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Home / Landing button */}
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Return to Product Landing Page"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline font-mono">Overview</span>
          </button>
        )}

        {/* Command Palette Trigger */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs"
            title="Open Command Palette (Ctrl+K or Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-teal-700" />
            <span>Search modules…</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Organization pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 min-w-0">
          <div className="w-5 h-5 rounded bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <Building2 className="w-3 h-3 text-teal-700" />
          </div>
          <span className="text-xs font-bold text-slate-800 truncate">FinTrust Bank Ltd.</span>
          <span className="hidden xl:inline-flex items-center gap-1 text-[10px] text-teal-800 font-mono bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
            LIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* Right: Live EAL Ticker + Action Buttons */}
      <div className="flex items-center gap-2.5 md:gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-3 pl-3.5 pr-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Enterprise EAL</div>
            <div className="flex items-center justify-end gap-2 mt-0.5">
              <span className="text-[13px] font-mono font-bold text-rose-600">
                <CurrencyFormatter value={currentEal} />
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                isHighRisk 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {riskScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onSimulateEvent}
          disabled={isSimulating}
          className="btn btn-primary text-xs shadow-sm"
          title="Inject real-time security telemetry event and trigger live FAIR risk recalculation"
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
          className="btn btn-secondary btn-icon text-slate-500 hover:text-slate-800"
          title="Reset back to initial baseline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
