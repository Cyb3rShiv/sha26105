import React, { useState, useEffect } from 'react';
import { Coins, Sparkles, CheckCircle2, XCircle, Sliders, ShieldCheck, Award, RotateCcw, AlertTriangle } from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import CountUp from '../components/ui/CountUp';

const BUDGET_PRESETS = [500000, 1000000, 2000000, 2500000, 3500000, 5000000, 7500000];

function SummaryTile({ label, value, tone = 'text-slate-900', accent = 'bg-slate-400', footer, footerTone = 'text-slate-500', delay = 0 }) {
  return (
    <Reveal delay={delay} className="panel p-5 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accent}`} />
          <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">{label}</span>
        </div>
        <div className={`text-2xl font-bold tracking-tight mt-2 ${tone}`}>{value}</div>
      </div>
      <div className={`mt-3.5 pt-3 border-t border-slate-100 text-[11.5px] flex items-center justify-between gap-2 ${footerTone}`}>
        {footer}
      </div>
    </Reveal>
  );
}

export default function OptimizerView({ onNavigate }) {
  const [budget, setBudget] = useState(2500000); // ₹25 Lakhs
  const [loading, setLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [sortBy, setSortBy] = useState('rosi'); // 'rosi', 'reduction', 'cost'
  const [error, setError] = useState(null);

  const runOptimization = async (customBudget = budget) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.optimizeBudget(customBudget);
      if (res) {
        setOptimizationResult(res);
      }
    } catch (err) {
      console.error('Optimization failed', err);
      setError('Failed to compute optimization on backend; using local solver.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization(2500000);
  }, []);

  // Debounced slider handler to avoid request flooding
  useEffect(() => {
    const handler = setTimeout(() => {
      runOptimization(budget);
    }, 180);
    return () => clearTimeout(handler);
  }, [budget]);

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
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
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Coins}
        index="07"
        eyebrow="Capital Allocation & ROI"
        title="0/1 Knapsack Security Investment Optimizer"
        description="Solves the bounded 0/1 knapsack dynamic programming problem to maximize bank risk reduction under a strict CISO budget."
        actions={
          <button onClick={() => onNavigate('what_if')} className="btn btn-secondary text-xs">
            <Sliders className="w-3.5 h-3.5 text-teal-700" />
            <span>Open What-If Sandbox</span>
          </button>
        }
      />

      {/* ===== Budget Control Panel ===== */}
      <Reveal delay={60}>
        <Panel
          title="Step 1 — Set Available Security Budget"
          subtitle="Adjust the CISO capital allocation slider or select quick presets to run the 0/1 Knapsack optimizer."
          icon={Coins}
          bodyClassName="p-6 space-y-5"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="text-xs font-mono font-semibold uppercase text-slate-500">
                Target Budget Limit
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  <CountUp value={budget} format={formatINR} duration={400} />
                </span>
                <span className="text-xs text-slate-500 font-mono font-bold">
                  (₹{(budget / 100000).toFixed(1)} Lakhs)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Budget presets">
              {BUDGET_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleBudgetChange(preset)}
                  aria-pressed={budget === preset}
                  className={`btn !py-1.5 !px-3 text-xs font-mono font-bold ${
                    budget === preset ? 'btn-primary shadow-sm' : 'btn-secondary'
                  }`}
                >
                  ₹{(preset / 100000).toFixed(0)}L
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              aria-label="Security budget in rupees"
              min="500000"
              max="7500000"
              step="100000"
              value={budget}
              onChange={(e) => handleBudgetChange(Number(e.target.value))}
              className="w-full cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[10.5px] text-slate-500 font-mono">
              <span>₹5.0 Lakhs (Minimal)</span>
              <span className="text-teal-800 font-bold">DEFAULT: ₹25.0 LAKHS</span>
              <span>₹75.0 Lakhs (Full Portfolio)</span>
            </div>
          </div>
        </Panel>
      </Reveal>

      {/* ===== Summary Tiles ===== */}
      {loading && !optimizationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Loading optimization">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="panel p-5 space-y-3">
              <Skeleton className="h-3 w-24 bg-slate-200" />
              <Skeleton className="h-7 w-28 bg-slate-200" />
              <Skeleton className="h-3 w-full bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {optimizationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryTile
            delay={0}
            label="Target Budget"
            value={<CountUp value={optimizationResult.budget} format={formatINR} />}
            tone="text-slate-900"
            accent="bg-slate-500"
            footer={
              <>
                <span>Optimal Spend:</span>
                <strong className="text-teal-800 font-mono">{formatINR(optimizationResult.total_cost)}</strong>
              </>
            }
          />
          <SummaryTile
            delay={40}
            label="Total Risk Reduction"
            value={<CountUp value={optimizationResult.total_risk_reduction} format={formatINR} />}
            tone="text-teal-700"
            accent="bg-teal-600"
            footer={
              <>
                <span>Selected Controls:</span>
                <strong className="font-mono text-teal-800">
                  {optimizationResult.selected_controls.length} of {allControls.length}
                </strong>
              </>
            }
            footerTone="text-teal-800"
          />
          <SummaryTile
            delay={80}
            label="Remaining Residual Risk"
            value={<CountUp value={optimizationResult.remaining_risk} format={formatINR} />}
            tone="text-amber-800"
            accent="bg-amber-500"
            footer={
              <>
                <span>Baseline EAL:</span>
                <strong className="font-mono">{formatINR(optimizationResult.baseline_eal)}</strong>
              </>
            }
            footerTone="text-slate-500"
          />
          <SummaryTile
            delay={120}
            label="Portfolio ROSI Multiplier"
            value={<span>{optimizationResult.overall_rosi}x</span>}
            tone="text-teal-700"
            accent="bg-teal-600"
            footer={
              <>
                <span>Risk Reduction / Spend</span>
                <Award className="w-3.5 h-3.5 text-teal-700" />
              </>
            }
            footerTone="text-teal-800"
          />
        </div>
      )}

      {/* ===== Knapsack Dynamic Programming Proof ===== */}
      {optimizationResult && (
        <Reveal delay={100}>
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-teal-900">
              <strong className="font-mono font-bold">Knapsack Dynamic Optimization Proof: </strong>
              <span>{optimizationResult.optimization_summary}</span>
            </p>
          </div>
        </Reveal>
      )}

      {/* ===== Controls Catalog & Table ===== */}
      <Reveal delay={140}>
        <Panel
          flush
          title="Security Controls Catalog & Knapsack Allocation"
          subtitle={`Green highlighted rows are mathematically selected by the 0/1 Knapsack algorithm to maximize risk reduction within ₹${(budget / 100000).toFixed(0)}L.`}
          icon={ShieldCheck}
          actions={
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-mono text-slate-500 uppercase font-semibold hidden sm:inline">Sort By:</span>
              <select
                aria-label="Sort controls"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 focus:outline-teal-700"
              >
                <option value="rosi">ROSI Multiplier (Highest First)</option>
                <option value="reduction">Risk Reduction (Highest First)</option>
                <option value="cost">Cost (Lowest First)</option>
              </select>
            </div>
          }
        >
          {/* Desktop Data Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Algorithm Decision</th>
                  <th>Security Control</th>
                  <th>Category</th>
                  <th>Implementation Cost</th>
                  <th>Risk Reduction</th>
                  <th>ROSI</th>
                  <th>Target Assets</th>
                  <th>Regulatory Mapping</th>
                </tr>
              </thead>
              <tbody>
                {sortedControls.map((control) => {
                  const isOptimal = control.isOptimal;
                  return (
                    <tr
                      key={control.id}
                      className={
                        isOptimal
                          ? 'bg-emerald-50/50 hover:bg-emerald-50 font-medium'
                          : 'opacity-60 hover:opacity-100 hover:bg-slate-50'
                      }
                    >
                      <td>
                        {isOptimal ? (
                          <span className="badge-emerald font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            SELECTED
                          </span>
                        ) : (
                          <span className="badge-slate font-semibold">
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            EXCLUDED
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="font-bold text-slate-900 max-w-[260px]">{control.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-[260px]">{control.description}</div>
                      </td>
                      <td>
                        <span className="inline-block px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {control.category}
                        </span>
                      </td>
                      <td className="font-mono font-semibold text-slate-900">
                        <CurrencyFormatter value={control.cost} />
                      </td>
                      <td className="font-mono font-bold text-teal-700">
                        <CurrencyFormatter value={control.risk_reduction} />
                      </td>
                      <td>
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold text-xs">
                          {control.rosi}x
                        </span>
                      </td>
                      <td className="font-mono text-slate-500 text-[11px] max-w-[140px]">
                        {control.target_asset_ids?.join(', ')}
                      </td>
                      <td className="text-[10.5px] text-slate-600 font-mono max-w-[120px]">
                        {control.rbi_mapping}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {sortedControls.map((control) => {
              const isOptimal = control.isOptimal;
              return (
                <div
                  key={control.id}
                  className={`p-4 ${isOptimal ? 'bg-emerald-50/60' : 'opacity-70'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm text-slate-900">{control.name}</div>
                    {isOptimal ? (
                      <span className="badge-emerald shrink-0 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SELECTED
                      </span>
                    ) : (
                      <span className="badge-slate shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        EXCLUDED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{control.description}</p>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200 text-center text-xs font-mono">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Cost</div>
                      <div className="text-slate-900 mt-0.5 font-bold">{formatINR(control.cost)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Reduction</div>
                      <div className="text-teal-700 mt-0.5 font-bold">{formatINR(control.risk_reduction)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">ROSI</div>
                      <div className="text-teal-800 mt-0.5 font-bold">{control.rosi}x</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </Reveal>
    </div>
  );
}
