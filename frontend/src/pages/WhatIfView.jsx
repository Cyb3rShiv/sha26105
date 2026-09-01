import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck, 
  Coins, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Layers,
  ArrowDownRight
} from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';

export default function WhatIfView({ onNavigate }) {
  const [controls, setControls] = useState([]);
  const [enabledIds, setEnabledIds] = useState(['CTRL-001']); // Default to patching primary Payment Server
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const allCtrl = await api.getControls();
      if (allCtrl && allCtrl.length > 0) {
        setControls(allCtrl);
      }
      runWhatIf(['CTRL-001']);
    }
    init();
  }, []);

  const runWhatIf = async (ids) => {
    setLoading(true);
    try {
      const res = await api.evaluateWhatIf(ids);
      if (res) {
        setSimulationResult(res);
      }
    } catch (err) {
      console.error('What-If evaluation failed', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleControl = (id) => {
    const updated = enabledIds.includes(id)
      ? enabledIds.filter(x => x !== id)
      : [...enabledIds, id];
    setEnabledIds(updated);
    runWhatIf(updated);
  };

  const selectPreset = (presetType) => {
    let ids = [];
    if (presetType === 'patch_mfa') {
      ids = ['CTRL-001', 'CTRL-002'];
    } else if (presetType === 'all') {
      ids = controls.map(c => c.id);
    } else if (presetType === 'budget25') {
      ids = ['CTRL-001', 'CTRL-002', 'CTRL-008']; // optimal ₹25L combo
    } else {
      ids = [];
    }
    setEnabledIds(ids);
    runWhatIf(ids);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">What-If Security Control Simulator</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toggle security investments in real-time to simulate instantaneous changes in Enterprise Risk Score, EAL, and ROSI.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Quick Scenarios:</span>
          <button
            onClick={() => selectPreset('patch_mfa')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 font-mono"
          >
            Patch + MFA (Primary)
          </button>
          <button
            onClick={() => selectPreset('budget25')}
            className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-xs text-emerald-300 border border-emerald-700/60 font-mono"
          >
            Optimal ₹25L Portfolio
          </button>
          <button
            onClick={() => selectPreset('all')}
            className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-xs text-purple-300 border border-purple-700/60 font-mono"
          >
            All Controls (100%)
          </button>
        </div>
      </div>

      {/* BEFORE VS AFTER DUAL COMPARISON BANNER */}
      {simulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* BEFORE CARD */}
          <div className="cyber-card lg:col-span-4 border-rose-500/40 bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-rose-400 uppercase font-bold tracking-wider">BEFORE (Baseline Risk)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">UNMITIGATED</span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <span className="text-xs text-slate-400">Enterprise Risk Score</span>
                  <div className="text-3xl font-bold font-mono text-rose-400 mt-1">
                    {simulationResult.baseline_risk_score} <span className="text-sm text-slate-500">/ 100</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400">Expected Annual Loss (EAL)</span>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    <CurrencyFormatter value={simulationResult.baseline_eal} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
              Includes unpatched KEV CVE-2024-3094 on Payment Server.
            </div>
          </div>

          {/* DELTA METRICS (CENTER) */}
          <div className="cyber-card lg:col-span-4 border-cyan-500/40 bg-slate-900/90 p-6 flex flex-col justify-between text-center">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
                SIMULATION DELTA & ROSI
              </span>

              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/50">
                  <span className="text-[10px] text-emerald-400 uppercase font-mono">Total Risk Reduction</span>
                  <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">
                    <CurrencyFormatter value={simulationResult.risk_reduction} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Required Control Cost</span>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">
                    <CurrencyFormatter value={simulationResult.total_control_cost} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-700/50">
                  <span className="text-[10px] text-cyan-300 uppercase font-mono">Return on Security Investment (ROSI)</span>
                  <div className="text-2xl font-bold font-mono text-cyan-300 mt-0.5">
                    {simulationResult.rosi}x Multiplier
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-400 font-mono">
              Net Financial Value: <strong className="text-emerald-400">{formatINR(simulationResult.net_benefit)}</strong>
            </div>
          </div>

          {/* AFTER CARD */}
          <div className="cyber-card lg:col-span-4 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">AFTER (Simulated Posture)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {simulationResult.active_controls_count} CONTROLS ACTIVE
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <span className="text-xs text-slate-400">Simulated Risk Score</span>
                  <div className="text-3xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-2">
                    {simulationResult.simulated_risk_score} <span className="text-sm text-slate-500">/ 100</span>
                    <span className="text-xs text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                      -{simulationResult.baseline_risk_score - simulationResult.simulated_risk_score} pts
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400">Residual Expected Annual Loss</span>
                  <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                    <CurrencyFormatter value={simulationResult.simulated_eal} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Financial exposure mitigated by {((simulationResult.risk_reduction / simulationResult.baseline_eal) * 100).toFixed(0)}%.</span>
            </div>
          </div>
        </div>
      )}

      {/* Control Checkbox Selection Grid */}
      <div className="cyber-card p-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-cyan-400" />
          Interactive Control Selection Sandbox (Click to toggle)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {controls.map((ctrl) => {
            const isChecked = enabledIds.includes(ctrl.id);

            return (
              <div
                key={ctrl.id}
                onClick={() => toggleControl(ctrl.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all select-none flex flex-col justify-between ${
                  isChecked
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-glow-cyan/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-white text-xs flex-1">{ctrl.name}</div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                      isChecked ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-600 bg-slate-800'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    {ctrl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Cost:</span>
                    <strong className="text-white">{formatINR(ctrl.cost)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Risk Reduction:</span>
                    <strong className="text-emerald-400">{formatINR(ctrl.risk_reduction)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ROSI:</span>
                    <strong className="text-cyan-400">{ctrl.rosi}x</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
