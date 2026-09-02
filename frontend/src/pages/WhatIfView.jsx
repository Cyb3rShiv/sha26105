import React, { useState, useEffect } from 'react';
import { Sliders, ArrowRight, ShieldCheck, Check, Layers, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import CountUp from '../components/ui/CountUp';

const PRESETS = [
  { type: 'patch_mfa', label: 'Patch + MFA (Primary)', isPrimary: false },
  { type: 'budget25', label: 'Optimal ₹25L Portfolio', isPrimary: true },
  { type: 'all', label: 'All Controls (100%)', isPrimary: false },
];

export default function WhatIfView() {
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

  const mitigatedPct =
    simulationResult && simulationResult.baseline_eal
      ? ((simulationResult.risk_reduction / simulationResult.baseline_eal) * 100).toFixed(0)
      : 0;
  const residualPct = Math.max(0, 100 - Number(mitigatedPct));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Sliders}
        index="06"
        eyebrow="Scenario Modeling & Sandbox"
        title="What-If Security Control Simulator"
        description="Interactively toggle hypothetical security controls in real-time to preview before-and-after reductions in Risk Score, EAL, and ROSI before spending capital."
        actions={
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick scenarios">
            <span className="text-[10.5px] font-mono text-slate-500 uppercase font-semibold mr-1 hidden lg:inline">Quick Scenarios:</span>
            {PRESETS.map((p) => (
              <button
                key={p.type}
                onClick={() => selectPreset(p.type)}
                className={`btn !py-1.5 !px-3 text-xs font-mono font-bold ${
                  p.isPrimary ? 'btn-primary shadow-sm' : 'btn-secondary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* ===== Before / Delta / After Comparison Row ===== */}
      {simulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          {/* BEFORE: Baseline */}
          <Reveal className="lg:col-span-4">
            <div className="panel h-full border-rose-200 bg-rose-50/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-rose-700">Before — Baseline Posture</span>
                  <span className="badge-rose">UNMITIGATED</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 font-mono">ENTERPRISE RISK SCORE</span>
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-rose-600 mt-1">
                      {simulationResult.baseline_risk_score}
                      <span className="text-sm text-slate-400 font-normal"> / 100</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-mono">EXPECTED ANNUAL LOSS</span>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1">
                      <CountUp value={simulationResult.baseline_eal} format={formatINR} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-100 text-[11px] text-slate-500 font-mono">
                Baseline exposure with unpatched KEV vulnerabilities and single-factor MFA gaps.
              </div>
            </div>
          </Reveal>

          {/* DELTA: Simulation Shift */}
          <Reveal delay={80} className="lg:col-span-4">
            <div className="panel h-full border-slate-200 bg-slate-50/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-teal-800 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    Simulation Delta &amp; ROSI
                  </span>
                  <span className="badge-emerald font-mono">−{mitigatedPct}% Exposure</span>
                </div>

                {/* Progress bar comparison */}
                <div className="mt-5 space-y-1.5" aria-hidden="true">
                  <div className="h-3 rounded-full bg-slate-200 relative overflow-hidden border border-slate-300">
                    <div
                      className="absolute inset-y-0 left-0 bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${residualPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Residual: {formatINR(simulationResult.simulated_eal)}</span>
                    <span>Baseline: {formatINR(simulationResult.baseline_eal)}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">Risk Reduction</span>
                    <span className="text-sm font-mono font-bold text-teal-700">
                      <CountUp value={simulationResult.risk_reduction} format={formatINR} />
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500">Total Investment Cost</span>
                    <span className="text-sm font-mono font-bold text-slate-900">
                      <CurrencyFormatter value={simulationResult.total_control_cost} />
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-800">Portfolio ROSI</span>
                    <span className="text-base font-mono font-bold text-teal-800">
                      {simulationResult.rosi}x
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-[11px] text-slate-500 font-mono">
                Net Economic Value: <strong className="text-teal-700">{formatINR(simulationResult.net_benefit)}</strong>
              </div>
            </div>
          </Reveal>

          {/* AFTER: Simulated Posture */}
          <Reveal delay={160} className="lg:col-span-4">
            <div className="panel h-full border-emerald-200 bg-emerald-50/30 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800">After — Simulated Posture</span>
                  <span className="badge-emerald font-bold">
                    {simulationResult.active_controls_count} CONTROLS ACTIVE
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 font-mono">SIMULATED RISK SCORE</span>
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-teal-700 mt-1 flex items-baseline gap-2.5">
                      <span>
                        {simulationResult.simulated_risk_score}
                        <span className="text-sm text-slate-400 font-normal"> / 100</span>
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 self-center">
                        −{simulationResult.baseline_risk_score - simulationResult.simulated_risk_score} pts
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 font-mono">RESIDUAL EXPECTED ANNUAL LOSS</span>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-teal-800 mt-1">
                      <CountUp value={simulationResult.simulated_eal} format={formatINR} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100 text-[11px] text-emerald-800 font-mono">
                Simulated financial risk with selected security treatment applied.
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {/* ===== Controls Interactive Selection Grid ===== */}
      <Reveal delay={200}>
        <Panel
          title="Interactive Security Control Toggles"
          subtitle="Click to enable or disable specific controls. Risk calculations recalculate instantaneously."
          icon={Layers}
          actions={
            <span className="text-xs font-mono text-slate-500">
              {enabledIds.length} of {controls.length} Enabled
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {controls.map((control) => {
              const isEnabled = enabledIds.includes(control.id);
              return (
                <div
                  key={control.id}
                  onClick={() => toggleControl(control.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isEnabled
                      ? 'bg-emerald-50/50 border-teal-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isEnabled
                            ? 'bg-teal-700 border-teal-700 text-white'
                            : 'bg-slate-100 border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 line-clamp-1">{control.name}</span>
                    </div>
                    <span className="badge-slate text-[10px] shrink-0 font-mono">
                      {control.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{control.description}</p>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Cost</div>
                      <div className="font-bold text-slate-900">{formatINR(control.cost)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Reduction</div>
                      <div className="font-bold text-teal-700">{formatINR(control.risk_reduction)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">ROSI</div>
                      <div className="font-bold text-teal-800">{control.rosi}x</div>
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
