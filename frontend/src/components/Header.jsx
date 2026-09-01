import React from 'react';
import { Radio, RefreshCw, AlertTriangle, Building, Sparkles } from 'lucide-react';
import CurrencyFormatter from './CurrencyFormatter';

export default function Header({ 
  currentEal = 18400000, 
  riskScore = 72, 
  onSimulateEvent, 
  onReset,
  isSimulating = false 
}) {
  return (
    <header className="h-16 bg-cyber-surface/90 border-b border-cyber-border px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      {/* Left: Entity & Mode Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
          <Building className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">FinTrust Bank Ltd.</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">| Retail & Core Banking</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/40 text-amber-400 text-[11px] font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Synthetic Demo Data</span>
        </div>
      </div>

      {/* Right: Live Ticker & Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Live EAL Ticker */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg bg-cyber-card border border-cyber-border">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Live Enterprise EAL</div>
            <div className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <CurrencyFormatter value={currentEal} />
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-mono">
                Score {riskScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Simulate New Security Event Quick Trigger */}
        <button
          onClick={onSimulateEvent}
          disabled={isSimulating}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-glow-cyan transition-all transform active:scale-95 disabled:opacity-50"
          title="Inject a realistic synthetic security telemetry event and trigger live risk recalculation"
        >
          {isSimulating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isSimulating ? 'Recalculating...' : 'Simulate Security Event'}</span>
        </button>

        {/* Reset State */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border border-slate-700/50 transition-colors"
          title="Reset back to initial seed state"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
