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

const BUDGET_PRESETS = [1000000, 2000000, 2500000, 3500000, 5000000, 7500000];

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
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Coins}
        eyebrow="Decisions / Capital Allocation"
        title="Security Investment Optimizer"
        description="Solves the bounded 0/1 knapsack optimization problem to maximize enterprise cyber risk reduction within a strict CISO budget."
        actions={
          <button onClick={() => onNavigate('what_if')} className="btn btn-ghost">
            <Sliders className="w-4 h-4 text-brass-400" />
            <span>Manual What-If Sandbox</span>
          </button>
        }
      />

      {/* ===== Budget control ===== */}
      <Reveal delay={60} className="panel ledger-marks dot-grid p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <span className="eyebrow text-brass-400">Step 1 — Set Available Security Budget</span>
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="display-num text-[34px] md:text-[40px] leading-none text-ink-50">
                <CountUp value={budget} format={formatINR} duration={500} />
              </span>
              <span className="text-[11px] text-ink-400 font-mono">
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
                className={`btn !py-1.5 !px-3 text-[11px] font-mono ${
                  budget === preset ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                ₹{(preset / 100000).toFixed(0)}L
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <input
            type="range"
            aria-label="Security budget in rupees"
            min="500000"
            max="7500000"
            step="100000"
            value={budget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className="w-full cursor-pointer h-1.5 bg-ink-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9.5px] text-ink-500 font-mono">
            <span>₹5.0 Lakhs (Minimal)</span>
            <span className="text-brass-400 font-bold">STANDARD: ₹25.0 LAKHS</span>
            <span>₹75.0 Lakhs (Full Remediation)</span>
          </div>
        </div>
      </Reveal>

      {/* ===== Summary tiles ===== */}
      {loading && !optimizationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Loading optimization">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="panel p-5 space-y-3">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-2.5 w-full" />
            </div>
          ))}
        </div>
      )}

      {optimizationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryTile
            delay={0}
            label="Allocated Budget"
            value={<CountUp value={optimizationResult.budget} format={formatINR} />}
            tone="text-ink-50"
            footer={
              <>
                <span>Actual Spend:</span>
                <strong className="text-brass-300 font-mono">{formatINR(optimizationResult.total_cost)}</strong>
              </>
            }
          />
          <SummaryTile
            delay={60}
            label="Total Risk Reduction"
            value={<CountUp value={optimizationResult.total_risk_reduction} format={formatINR} />}
            tone="text-ok-400"
            accent="bg-ok-500"
            footer={
              <>
                <span>Selected Controls:</span>
                <strong className="font-mono">
                  {optimizationResult.selected_controls.length} of {allControls.length}
                </strong>
              </>
            }
            footerTone="text-ok-300"
          />
          <SummaryTile
            delay={120}
            label="Remaining Residual Risk"
            value={<CountUp value={optimizationResult.remaining_risk} format={formatINR} />}
            tone="text-warn-400"
            accent="bg-warn-500"
            footer={
              <>
                <span>Baseline EAL:</span>
                <strong className="font-mono">{formatINR(optimizationResult.baseline_eal)}</strong>
              </>
            }
            footerTone="text-warn-300"
          />
          <SummaryTile
            delay={180}
            label="Portfolio ROSI Multiplier"
            value={<span>{optimizationResult.overall_rosi}x</span>}
            tone="text-brass-300"
            accent="bg-brass-500"
            footer={
              <>
                <span>Risk Reduction / Cost</span>
                <Award className="w-3.5 h-3.5 text-brass-400" />
              </>
            }
            footerTone="text-brass-300"
          />
        </div>
      )}

      {/* ===== Knapsack proof banner ===== */}
      {optimizationResult && (
        <Reveal delay={100}>
          <div className="panel p-4 flex items-start gap-3 border-ink-700">
            <Sparkles className="w-4 h-4 text-brass-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong className="text-ink-50 font-mono">Knapsack Dynamic Optimization Proof: </strong>
              <span className="text-ink-300">{optimizationResult.optimization_summary}</span>
            </p>
          </div>
        </Reveal>
      )}

      {/* ===== Controls catalog ===== */}
      <Reveal delay={140}>
        <Panel
          flush
          title="Security Controls Catalog & Optimization Selection"
          subtitle={`Controls with green checkmarks are chosen by the algorithm to maximize ROSI within ₹${(budget / 100000).toFixed(0)}L.`}
          icon={ShieldCheck}
          actions={
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ink-500 hidden sm:inline">SORT BY</span>
              <select
                aria-label="Sort controls"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select !py-1.5 font-mono"
              >
                <option value="rosi">ROSI (Highest First)</option>
                <option value="reduction">Risk Reduction (Highest First)</option>
                <option value="cost">Cost (Lowest First)</option>
              </select>
            </div>
          }
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Security Control</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Risk Reduction</th>
                  <th>ROSI</th>
                  <th>Target Systems</th>
                  <th>RBI Alignment</th>
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
                          ? 'bg-ok-950/25 hover:bg-ok-950/40 border-l-2 border-l-ok-500'
                          : 'opacity-55 hover:opacity-90 hover:bg-ink-850'
                      }
                    >
                      <td>
                        {isOptimal ? (
                          <span className="severity-badge bg-ok-950 text-ok-400 border border-ok-800">
                            <CheckCircle2 className="w-3 h-3" />
                            SELECTED
                          </span>
                        ) : (
                          <span className="severity-badge bg-ink-900 text-ink-400 border border-ink-800">
                            <XCircle className="w-3 h-3" />
                            EXCLUDED
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold text-ink-50 max-w-[260px]">{control.name}</div>
                        <div className="text-[11px] text-ink-400 mt-0.5 line-clamp-1 max-w-[260px]">{control.description}</div>
                      </td>
                      <td><span className="chip">{control.category}</span></td>
                      <td className="font-mono font-semibold text-ink-100"><CurrencyFormatter value={control.cost} /></td>
                      <td className="font-mono font-semibold text-ok-400"><CurrencyFormatter value={control.risk_reduction} /></td>
                      <td>
                        <span className="px-2 py-1 rounded-md bg-brass-950 text-brass-300 border border-brass-800 font-mono font-bold text-[11px]">
                          {control.rosi}x
                        </span>
                      </td>
                      <td className="font-mono text-ink-400 text-[11px] max-w-[140px]">{control.target_asset_ids?.join(', ')}</td>
                      <td className="text-[10px] text-ink-400 font-mono max-w-[120px]">{control.rbi_mapping}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-ink-850">
            {sortedControls.map((control) => {
              const isOptimal = control.isOptimal;
              return (
                <div
                  key={control.id}
                  className={`p-4 ${isOptimal ? 'bg-ok-950/20 border-l-2 border-l-ok-500' : 'opacity-70'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-[13px] text-ink-50">{control.name}</div>
                    {isOptimal ? (
                      <span className="severity-badge bg-ok-950 text-ok-400 border border-ok-800 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        SELECTED
                      </span>
                    ) : (
                      <span className="severity-badge bg-ink-900 text-ink-400 border border-ink-800 shrink-0">
                        <XCircle className="w-3 h-3" />
                        EXCLUDED
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ink-400 mt-1 line-clamp-2">{control.description}</p>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-ink-800 text-center text-[11px] font-mono">
                    <div>
                      <div className="eyebrow">Cost</div>
                      <div className="text-ink-100 mt-0.5">{formatINR(control.cost)}</div>
                    </div>
                    <div>
                      <div className="eyebrow">Reduction</div>
                      <div className="text-ok-400 mt-0.5">{formatINR(control.risk_reduction)}</div>
                    </div>
                    <div>
                      <div className="eyebrow">ROSI</div>
                      <div className="text-brass-300 mt-0.5 font-bold">{control.rosi}x</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </Reveal>

      {/* Engine unreachable */}
      {!optimizationResult && !loading && (
        <Panel>
          <EmptyState
            tone="danger"
            icon={AlertTriangle}
            title="Optimizer unreachable"
            message="The optimization endpoint did not respond. Verify the risk engine backend is running on port 8000, then retry."
            action={
              <button onClick={() => runOptimization(budget)} className="btn btn-primary">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Optimization</span>
              </button>
            }
          />
        </Panel>
      )}
    </div>
  );
}

function SummaryTile({ label, value, tone, accent = 'bg-ink-600', footer, footerTone = 'text-ink-400', delay = 0 }) {
  return (
    <Reveal delay={delay} className="panel p-5 relative overflow-hidden">
      <span className={`absolute left-0 top-4 bottom-4 w-[2px] rounded-full ${accent} opacity-70`} />
      <span className="eyebrow">{label}</span>
      <div className={`display-num text-[26px] leading-none mt-2.5 ${tone}`}>{value}</div>
      <div className={`mt-3.5 pt-3 border-t border-ink-800 text-[11px] flex items-center justify-between gap-2 ${footerTone}`}>
        {footer}
      </div>
    </Reveal>
  );
}
