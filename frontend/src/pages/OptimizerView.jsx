import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Sliders, 
  Info,
  ArrowRight,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';

export default function OptimizerView({ onNavigate }) {
  const [budget, setBudget] = useState(2500000); // ₹25 Lakhs
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [sortBy, setSortBy] = useState('rosi'); // 'rosi', 'reduction', 'cost'

  const runOptimization = async (customBudget = budget) => {
    setLoading(true);
    try {
      const res = await api.optimizeBudget(customBudget);
      if (res) {
        setOptimizationResult(res);
      }
    } catch (err) {
      console.error('Optimization failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization(2500000);
  }, []);

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
    runOptimization(newBudget);
  };

  const selectedControls = optimizationResult?.selected_controls || [];
  const unselectedControls = optimizationResult?.unselected_controls || [];
  const allControls = [...selectedControls.map(c => ({ ...c, isOptimal: true })), ...unselectedControls.map(c => ({ ...c, isOptimal: false }))];

  const sortedControls = [...allControls].sort((a, b) => {
    if (sortBy === 'rosi') return b.rosi - a.rosi;
    if (sortBy === 'reduction') return b.risk_reduction - a.risk_reduction;
    if (sortBy === 'cost') return a.cost - b.cost;
    return 0;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Security Investment Optimizer (0/1 Knapsack & ROSI)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Solves the bounded 0/1 knapsack optimization problem to maximize enterprise cyber risk reduction within a strict CISO budget.
          </p>
        </div>

        <button
          onClick={() => onNavigate('what_if')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Manual What-If Sandbox →</span>
        </button>
      </div>

      {/* Interactive Budget Control Section */}
      <div className="cyber-card bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 border-emerald-500/40 p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              Step 1: Set Available Security Budget
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white font-mono">
                {formatINR(budget)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (₹{(budget / 100000).toFixed(1)} Lakhs)
              </span>
            </div>
          </div>

          {/* Budget Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {[1000000, 2000000, 2500000, 3500000, 5000000, 7500000].map((preset) => (
              <button
                key={preset}
                onClick={() => handleBudgetChange(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  budget === preset
                    ? 'bg-emerald-600 text-white shadow-glow-emerald border border-emerald-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                ₹{(preset / 100000).toFixed(0)}L
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="500000"
            max="7500000"
            step="100000"
            value={budget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>₹5.0 Lakhs (Minimal)</span>
            <span className="text-emerald-400 font-bold">Standard: ₹25.0 Lakhs</span>
            <span>₹75.0 Lakhs (Full Remediation)</span>
          </div>
        </div>
      </div>

      {/* Optimization Results Summary Cards */}
      {optimizationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="cyber-card border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Allocated Budget</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              <CurrencyFormatter value={optimizationResult.budget} />
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
              <span>Actual Spend:</span>
              <strong className="text-cyan-300 font-mono">{formatINR(optimizationResult.total_cost)}</strong>
            </div>
          </div>

          <div className="cyber-card border-emerald-500/40 bg-emerald-950/20">
            <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Total Risk Reduction</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              <CurrencyFormatter value={optimizationResult.total_risk_reduction} />
            </div>
            <div className="mt-2 text-xs text-emerald-300 flex items-center justify-between border-t border-emerald-800/40 pt-2">
              <span>Selected Controls:</span>
              <strong className="font-mono">{optimizationResult.selected_controls.length} of {allControls.length}</strong>
            </div>
          </div>

          <div className="cyber-card border-amber-500/40 bg-amber-950/20">
            <span className="text-[10px] text-amber-400 uppercase font-mono font-bold">Remaining Residual Risk</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              <CurrencyFormatter value={optimizationResult.remaining_risk} />
            </div>
            <div className="mt-2 text-xs text-amber-300 flex items-center justify-between border-t border-amber-800/40 pt-2">
              <span>Baseline EAL:</span>
              <strong className="font-mono">{formatINR(optimizationResult.baseline_eal)}</strong>
            </div>
          </div>

          <div className="cyber-card border-cyan-500/40 bg-cyan-950/20">
            <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold">Portfolio ROSI Multiplier</span>
            <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
              {optimizationResult.overall_rosi}x Return
            </div>
            <div className="mt-2 text-xs text-cyan-200 flex items-center justify-between border-t border-cyan-800/40 pt-2">
              <span>Risk Reduction / Cost</span>
              <Award className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
        </div>
      )}

      {/* Recommended Strategy Explainer Banner */}
      {optimizationResult && (
        <div className="cyber-card bg-slate-900 border-cyan-500/30 flex items-start gap-3 p-4">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-white font-mono">Knapsack Dynamic Optimization Proof: </strong>
            <span className="text-slate-300">{optimizationResult.optimization_summary}</span>
          </div>
        </div>
      )}

      {/* Controls Comparison & Selection Table */}
      <div className="cyber-card p-0 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security Controls Catalog & Optimization Selection
            </h2>
            <p className="text-xs text-slate-400">Controls with green checkmarks are chosen by the algorithm to maximize ROSI within ₹{(budget/100000).toFixed(0)}L.</p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="rosi">ROSI Multiplier (Highest First)</option>
              <option value="reduction">Risk Reduction (Highest First)</option>
              <option value="cost">Cost (Lowest First)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-cyber-border text-slate-400 font-mono uppercase tracking-wider">
                <th className="p-4">Status</th>
                <th className="p-4">Security Control</th>
                <th className="p-4">Category</th>
                <th className="p-4">Implementation Cost</th>
                <th className="p-4">Risk Reduction (EAL)</th>
                <th className="p-4">ROSI Return</th>
                <th className="p-4">Target Systems</th>
                <th className="p-4">Regulatory Alignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {sortedControls.map((control) => {
                const isOptimal = control.isOptimal;

                return (
                  <tr 
                    key={control.id}
                    className={`transition-colors ${
                      isOptimal 
                        ? 'bg-emerald-950/20 hover:bg-emerald-950/30 border-l-4 border-l-emerald-500' 
                        : 'opacity-60 hover:opacity-90 hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="p-4">
                      {isOptimal ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 w-fit text-[10px] font-mono font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          SELECTED
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 w-fit text-[10px] font-mono">
                          <XCircle className="w-3.5 h-3.5" />
                          EXCLUDED
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-white text-xs">{control.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{control.description}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {control.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">
                      <CurrencyFormatter value={control.cost} />
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      <CurrencyFormatter value={control.risk_reduction} />
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono font-bold text-xs">
                        {control.rosi}x
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">
                      {control.target_asset_ids?.join(', ')}
                    </td>
                    <td className="p-4 text-[10px] text-slate-400 font-mono">
                      {control.rbi_mapping}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
