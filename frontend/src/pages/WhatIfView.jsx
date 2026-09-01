import React, { useState, useEffect } from 'react';
import { Sliders, ArrowRight, ShieldCheck, Check, Layers, RotateCcw, AlertTriangle } from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import CountUp from '../components/ui/CountUp';

const PRESETS = [
  { type: 'patch_mfa', label: 'Patch + MFA (Primary)', cls: 'btn-ghost' },
  { type: 'budget25', label: 'Optimal ₹25L Portfolio', cls: 'btn-ok' },
  { type: 'all', label: 'All Controls (100%)', cls: 'btn-ghost' },
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
        eyebrow="Modeling / Scenario Sandbox"
        title="What-If Security Control Simulator"
        description="Toggle security investments in real-time to simulate instantaneous changes in Enterprise Risk Score, EAL, and ROSI."
        actions={
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quick scenarios">
            <span className="text-[10px] font-mono text-ink-500 mr-1 hidden lg:inline">QUICK SCENARIOS:</span>
            {PRESETS.map((p) => (
              <button key={p.type} onClick={() => selectPreset(p.type)} className={`btn !py-1.5 !px-2.5 text-[11px] font-mono ${p.cls}`}>
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* ===== Before / Delta / After ===== */}
      {simulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          {/* BEFORE */}
          <Reveal className="lg:col-span-4">
            <div className="panel h-full border-danger-900/80 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="eyebrow text-danger-400">Before — Baseline Risk</span>
                  <span className="chip border-danger-800 bg-danger-950 text-danger-300">UNMITIGATED</span>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <span className="text-[11px] text-ink-400 font-mono">ENTERPRISE RISK SCORE</span>
                    <div className="display-num text-[38px] leading-none text-danger-400 mt-1.5">
                      {simulationResult.baseline_risk_score}
                      <span className="text-sm text-ink-500 font-sans font-normal"> / 100</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-ink-400 font-mono">EXPECTED ANNUAL LOSS</span>
                    <div className="text-[22px] font-mono font-bold text-ink-50 mt-1">
                      <CountUp value={simulationResult.baseline_eal} format={formatINR} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-800 text-[11px] text-ink-400 font-mono leading-relaxed">
                Includes unpatched KEV CVE-2024-3094 on Payment Server.
              </div>
            </div>
          </Reveal>

          {/* DELTA */}
          <Reveal delay={80} className="lg:col-span-4">
            <div className="panel h-full border-brass-900/80 p-6 flex flex-col justify-between">
              <div>
                <span className="eyebrow text-brass-400 flex items-center gap-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Simulation Delta &amp; ROSI
                </span>

                {/* Proportional EAL shift bar */}
                <div className="mt-6 space-y-2" aria-hidden="true">
                  <div className="flex justify-between text-[9.5px] font-mono text-ink-500">
                    <span>EXPOSURE SHIFT</span>
                    <span className="text-ok-400">−{mitigatedPct}%</span>
                  </div>
                  <div className="h-3 rounded-md bg-danger-950 border border-danger-900 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-ok-800/80 border-r border-ok-600 transition-all duration-700 ease-out"
                      style={{ width: `${residualPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-ink-500">
                    <span>Residual: {formatINR(simulationResult.simulated_eal)}</span>
                    <span>Baseline: {formatINR(simulationResult.baseline_eal)}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="tile px-3.5 py-3 flex items-center justify-between gap-2">
                    <span className="eyebrow">Risk Reduction</span>
                    <span className="text-[17px] font-mono font-bold text-ok-300">
                      <CountUp value={simulationResult.risk_reduction} format={formatINR} />
                    </span>
                  </div>
                  <div className="tile px-3.5 py-3 flex items-center justify-between gap-2">
                    <span className="eyebrow">Control Cost</span>
                    <span className="text-[15px] font-mono font-bold text-brass-300">
                      <CurrencyFormatter value={simulationResult.total_control_cost} />
                    </span>
                  </div>
                  <div className="px-3.5 py-3 flex items-center justify-between gap-2 rounded-lg bg-brass-950/60 border border-brass-800">
                    <span className="eyebrow text-brass-300">ROSI</span>
                    <span className="display-num text-[22px] leading-none text-brass-300">
                      {simulationResult.rosi}x
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-[11px] text-ink-400 font-mono">
                Net Financial Value: <strong className="text-ok-400">{formatINR(simulationResult.net_benefit)}</strong>
              </div>
            </div>
          </Reveal>

          {/* AFTER */}
          <Reveal delay={160} className="lg:col-span-4">
            <div className="panel h-full border-ok-800/60 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="eyebrow text-ok-400">After — Simulated Posture</span>
                  <span className="chip border-ok-800 bg-ok-950 text-ok-300">
                    {simulationResult.active_controls_count} CONTROLS ACTIVE
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <span className="text-[11px] text-ink-400 font-mono">SIMULATED RISK SCORE</span>
                    <div className="display-num text-[38px] leading-none text-ok-400 mt-1.5 flex items-baseline gap-2.5">
                      <span>
                        {simulationResult.simulated_risk_score}
                        <span className="text-sm text-ink-500 font-sans font-normal"> / 100</span>
                      </span>
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-ok-950 border border-ok-800 text-ok-300 self-center">
                        −{simulationResult.baseline_risk_score - simulationResult.simulated_risk_score} pts
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-ink-400 font-mono">RESIDUAL EXPECTED ANNUAL LOSS</span>
                    <div className="text-[22px] font-mono font-bold text-ok-300 mt-1">
                      <CountUp value={simulationResult.simulated_eal} format={formatINR} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-800 text-[11px] text-ok-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Financial exposure mitigated by {mitigatedPct}%.</span>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {loading && !simulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" aria-label="Loading simulation">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="panel p-6 space-y-4">
              <Skeleton className="h-2.5 w-32" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* ===== Control sandbox ===== */}
      <Reveal delay={120}>
        <Panel
          title="Interactive Control Selection Sandbox"
          subtitle="Click a control to toggle it — the simulation recalculates instantly."
          icon={Layers}
          actions={
            <span className="text-[10px] font-mono text-ink-500">
              {enabledIds.length}/{controls.length} ENABLED
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {controls.map((ctrl) => {
              const isChecked = enabledIds.includes(ctrl.id);
              return (
                <button
                  key={ctrl.id}
                  onClick={() => toggleControl(ctrl.id)}
                  role="switch"
                  aria-checked={isChecked}
                  aria-label={`${isChecked ? 'Disable' : 'Enable'} ${ctrl.name}`}
                  className={`text-left p-4 rounded-lg border transition-all select-none flex flex-col justify-between min-h-[150px] ${
                    isChecked
                      ? 'bg-brass-950/40 border-brass-700 shadow-[0_0_0_1px_rgba(217,168,78,0.08)]'
                      : 'bg-ink-950 border-ink-800 hover:border-ink-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-ink-50 text-xs flex-1 leading-snug">{ctrl.name}</div>
                      <span
                        className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-colors shrink-0 mt-0.5 ${
                          isChecked ? 'bg-brass-500 border-brass-400 text-ink-1000' : 'border-ink-600 bg-ink-900'
                        }`}
                        aria-hidden="true"
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3.5]" />}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-ink-400 mt-2 line-clamp-2 leading-relaxed">{ctrl.description}</p>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-ink-800 space-y-1 text-[10.5px] font-mono">
                    <div className="flex justify-between text-ink-400">
                      <span>Cost:</span>
                      <strong className="text-ink-100">{formatINR(ctrl.cost)}</strong>
                    </div>
                    <div className="flex justify-between text-ink-400">
                      <span>Risk Reduction:</span>
                      <strong className="text-ok-400">{formatINR(ctrl.risk_reduction)}</strong>
                    </div>
                    <div className="flex justify-between text-ink-400">
                      <span>ROSI:</span>
                      <strong className="text-brass-300">{ctrl.rosi}x</strong>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {controls.length === 0 && !loading && (
            <EmptyState
              tone="danger"
              icon={AlertTriangle}
              title="Control catalog unavailable"
              message="The controls endpoint did not respond. Verify the backend is running, then retry."
              action={
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reload</span>
                </button>
              }
            />
          )}
        </Panel>
      </Reveal>
    </div>
  );
}
