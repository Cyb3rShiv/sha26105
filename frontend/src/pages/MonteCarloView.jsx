import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Play,
  RefreshCw,
  Target,
  Layers,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  GitCompare,
  Plus,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import Skeleton from '../components/ui/Skeleton';
import ChartTooltip from '../components/charts/ChartTooltip';
import CountUp from '../components/ui/CountUp';

const ITERATION_PRESETS = [1000, 5000, 10000, 25000, 50000];

function StatTile({ label, value, sub, tone = 'text-slate-900', badge, badgeColor = 'bg-slate-100 text-slate-700' }) {
  return (
    <div className="panel p-4 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">{label}</span>
          {badge && (
            <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <div className={`text-xl font-bold tracking-tight mt-1.5 ${tone}`}>
          {typeof value === 'number' ? formatINR(value) : value}
        </div>
      </div>
      {sub && <div className="text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-100">{sub}</div>}
    </div>
  );
}

export default function MonteCarloView() {
  // Analytical Parameters
  const [iterations, setIterations] = useState(10000);
  const [volatilitySigma, setVolatilitySigma] = useState(0.35);
  const [lossMultiplier, setLossMultiplier] = useState(1.0);
  const [controlEffectiveness, setControlEffectiveness] = useState(0.0);
  const [probabilityModifier, setProbabilityModifier] = useState(1.0);
  const [timeHorizonYears, setTimeHorizonYears] = useState(1);

  // Execution State
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Scenario Comparison State
  const [baselineResults, setBaselineResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [lastSimulatedParams, setLastSimulatedParams] = useState({
    iterations: 10000,
    volatilitySigma: 0.35,
    lossMultiplier: 1.0,
    controlEffectiveness: 0.0,
    timeHorizonYears: 1
  });

  const runSimulation = async (
    count = iterations,
    sigma = volatilitySigma,
    mult = lossMultiplier,
    eff = controlEffectiveness,
    probMod = probabilityModifier,
    horizon = timeHorizonYears
  ) => {
    // Input Validation
    if (count < 100 || count > 50000) {
      setValidationError("Simulation count must be between 100 and 50,000 trials.");
      return;
    }
    if (sigma < 0.1 || sigma > 1.0) {
      setValidationError("Volatility factor must be between 0.10 and 1.00.");
      return;
    }
    if (mult < 0.1 || mult > 5.0) {
      setValidationError("Loss magnitude multiplier must be between 0.1x and 5.0x.");
      return;
    }

    setValidationError(null);
    setLoading(true);
    try {
      const data = await api.runMonteCarlo({
        iterations: count,
        volatility_sigma: sigma,
        loss_multiplier: mult,
        control_effectiveness: eff,
        probability_modifier: probMod,
        time_horizon_years: horizon,
      });
      if (data) {
        setResults(data);
        setLastSimulatedParams({
          iterations: count,
          volatilitySigma: sigma,
          lossMultiplier: mult,
          controlEffectiveness: eff,
          timeHorizonYears: horizon
        });
        // Save initial baseline if not set
        if (!baselineResults) {
          setBaselineResults(data);
        }
      }
    } catch (err) {
      console.error('Failed to run Monte Carlo simulation', err);
      setValidationError("Simulation engine encountered an issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(10000, 0.35, 1.0, 0.0, 1.0, 1);
  }, []);

  const handleSaveAsBaseline = () => {
    if (results) {
      setBaselineResults(results);
      setIsComparing(true);
    }
  };

  const handleResetBaseline = () => {
    setControlEffectiveness(0.0);
    setLossMultiplier(1.0);
    setProbabilityModifier(1.0);
    setTimeHorizonYears(1);
    setIsComparing(false);
    runSimulation(iterations, volatilitySigma, 1.0, 0.0, 1.0, 1);
  };

  const stats = results
    ? [
        { label: 'Mean Annual Loss', value: results.mean_loss, tone: 'text-slate-900', sub: 'Expected average outcome', badge: 'Mean' },
        { label: 'Median Loss (P50)', value: results.median_loss, tone: 'text-teal-700', sub: '50% of trials fall below', badge: 'P50' },
        { label: 'P10 Baseline', value: results.p10_loss, tone: 'text-slate-700', sub: 'Low exposure percentile', badge: 'P10' },
        { label: 'P90 Tail Loss', value: results.p90_loss, tone: 'text-amber-700', sub: '90th percentile worst-case', badge: 'P90', badgeColor: 'bg-amber-50 text-amber-800 border-amber-200' },
        { label: 'Value at Risk (95%)', value: results.var_95, tone: 'text-rose-600', sub: '1 in 20 year severe loss', badge: 'VaR 95%', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
        { label: 'P99 Catastrophe', value: results.p99_loss, tone: 'text-rose-800', sub: '1 in 100 year tail loss', badge: 'P99', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300' },
      ]
    : [];

  const hasParamChanges = Boolean(
    results && (
      iterations !== lastSimulatedParams.iterations ||
      volatilitySigma !== lastSimulatedParams.volatilitySigma ||
      lossMultiplier !== lastSimulatedParams.lossMultiplier ||
      controlEffectiveness !== lastSimulatedParams.controlEffectiveness ||
      timeHorizonYears !== lastSimulatedParams.timeHorizonYears
    )
  );

  // Scenario Comparison Metrics (Sign-Aware: handles both improvements and increased risk)
  const deltaLoss = baselineResults && results ? baselineResults.mean_loss - results.mean_loss : 0;
  const deltaVaR = baselineResults && results ? baselineResults.var_95 - results.var_95 : 0;
  const isBetter = deltaLoss > 0;
  const isWorse = deltaLoss < 0;
  const absDeltaLoss = Math.abs(deltaLoss);
  const shiftPct = baselineResults && baselineResults.mean_loss > 0
    ? ((absDeltaLoss / baselineResults.mean_loss) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={TrendingUp}
        index="05"
        eyebrow="Stochastic Loss Modeling"
        title="Monte Carlo Loss Distribution Engine"
        description="Executes up to 50,000 stochastic risk trials across enterprise banking assets to quantify probabilistic tail risk, P90 exposure, and 95% Value at Risk (VaR)."
        actions={
          <div className="flex items-center gap-2">
            {!isComparing ? (
              <button
                onClick={handleSaveAsBaseline}
                disabled={loading || !results}
                className="btn btn-secondary text-xs shadow-sm"
              >
                <GitCompare className="w-3.5 h-3.5 text-teal-700" />
                <span>Save Baseline &amp; Compare Scenario</span>
              </button>
            ) : (
              <button
                onClick={handleResetBaseline}
                className="btn btn-secondary text-xs shadow-sm text-slate-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Clean Baseline</span>
              </button>
            )}
          </div>
        }
      />

      {/* ===== STEP 1: CONFIGURE SIMULATION ASSUMPTIONS ===== */}
      <Reveal>
        <Panel
          title="Analytical Simulation Configuration"
          subtitle="Adjust assumptions, then run the simulation to see how the loss distribution changes."
          icon={Sliders}
          bodyClassName="p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Trial Volume Presets */}
            <div>
              <label className="text-xs font-mono font-semibold uppercase text-slate-600 block mb-2">
                Stochastic Trial Iterations
              </label>
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {ITERATION_PRESETS.map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      setIterations(count);
                      runSimulation(count, volatilitySigma, lossMultiplier, controlEffectiveness, probabilityModifier, timeHorizonYears);
                    }}
                    disabled={loading}
                    className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                      iterations === count
                        ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {count >= 1000 ? `${count / 1000}K` : count}
                  </button>
                ))}
              </div>
              <div className="text-[10.5px] font-mono text-slate-400 mt-1.5">
                Higher counts provide tighter tail percentile convergence.
              </div>
            </div>

            {/* 2. Control Effectiveness Factor */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-slate-600">
                  Control Mitigation Factor
                </label>
                <span className="text-xs font-mono font-bold text-teal-800">
                  {(controlEffectiveness * 100).toFixed(0)}% Mitigation
                </span>
              </div>
              <input
                type="range"
                aria-label="Control mitigation factor"
                aria-valuemin={0}
                aria-valuemax={80}
                aria-valuenow={Math.round(controlEffectiveness * 100)}
                aria-valuetext={`${(controlEffectiveness * 100).toFixed(0)}% mitigation`}
                min="0.0"
                max="0.80"
                step="0.05"
                value={controlEffectiveness}
                onChange={(e) => setControlEffectiveness(parseFloat(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0% (Unmitigated)</span>
                <span>40% (Optimal Portfolio)</span>
                <span>80% (Max Hardening)</span>
              </div>
            </div>

            {/* 3. Volatility Dispersion (Sigma) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-slate-600">
                  Loss Volatility (&sigma; dispersion)
                </label>
                <span className="text-xs font-mono font-bold text-teal-800">
                  {volatilitySigma.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                aria-label="Loss volatility dispersion sigma"
                aria-valuemin={0.15}
                aria-valuemax={0.65}
                aria-valuenow={volatilitySigma}
                aria-valuetext={`${volatilitySigma.toFixed(2)} sigma`}
                min="0.15"
                max="0.65"
                step="0.05"
                value={volatilitySigma}
                onChange={(e) => setVolatilitySigma(parseFloat(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.15 (Tight bounds)</span>
                <span>0.35 (Empirical Default)</span>
                <span>0.65 (High Uncertainty)</span>
              </div>
            </div>

            {/* 4. Financial Impact Multiplier */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-semibold uppercase text-slate-600">
                  Loss Severity Multiplier
                </label>
                <span className="text-xs font-mono font-bold text-slate-900">
                  {lossMultiplier.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                aria-label="Loss severity multiplier"
                aria-valuemin={0.5}
                aria-valuemax={2.5}
                aria-valuenow={lossMultiplier}
                aria-valuetext={`${lossMultiplier.toFixed(2)}x severity`}
                min="0.5"
                max="2.5"
                step="0.1"
                value={lossMultiplier}
                onChange={(e) => setLossMultiplier(parseFloat(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0.5x (Optimistic)</span>
                <span>1.0x (Standard)</span>
                <span>2.5x (Severe Stress)</span>
              </div>
            </div>

            {/* 5. Time Horizon */}
            <div>
              <label className="text-xs font-mono font-semibold uppercase text-slate-600 block mb-2">
                Time Horizon
              </label>
              <div className="flex items-center gap-2">
                {[
                  { label: '1 Year (Annual EAL)', val: 1 },
                  { label: '3 Years (Strategic)', val: 3 }
                ].map((h) => (
                  <button
                    key={h.val}
                    onClick={() => setTimeHorizonYears(h.val)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold border transition-all ${
                      timeHorizonYears === h.val
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Primary Action Trigger */}
            <div className="flex flex-col justify-end">
              <button
                onClick={() => runSimulation(iterations, volatilitySigma, lossMultiplier, controlEffectiveness, probabilityModifier, timeHorizonYears)}
                disabled={loading}
                className="btn btn-primary text-xs w-full py-3 shadow-sm justify-center"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>
                  {loading
                    ? `Simulating ${iterations.toLocaleString()} Trials…`
                    : hasParamChanges
                    ? 'Run Simulation (Updated Parameters)'
                    : 'Run Monte Carlo Simulation'}
                </span>
              </button>
            </div>
          </div>

          {hasParamChanges && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Simulation assumptions modified. Click "Run Simulation" to recalculate loss distribution.</span>
              </div>
              <span className="badge-amber font-mono font-bold text-[10px] shrink-0">Unsimulated Changes</span>
            </div>
          )}

          {validationError && (
            <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}
        </Panel>
      </Reveal>

      {/* ===== STEP 2: SCENARIO COMPARISON BANNER (IF ACTIVE) ===== */}
      {isComparing && baselineResults && results && (
        <Reveal>
          <div className={`p-5 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isBetter ? 'bg-teal-50/80 border-teal-300' : isWorse ? 'bg-rose-50/80 border-rose-300' : 'bg-slate-50 border-slate-300'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg text-white shrink-0 ${isBetter ? 'bg-teal-700' : isWorse ? 'bg-rose-700' : 'bg-slate-700'}`}>
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-950">Active Comparative Scenario Evaluation</span>
                  {isBetter && (
                    <span className="badge-emerald font-bold">↓ −{shiftPct}% Exposure Reduction</span>
                  )}
                  {isWorse && (
                    <span className="badge-rose font-bold">↑ +{shiftPct}% Additional Exposure</span>
                  )}
                  {!isBetter && !isWorse && (
                    <span className="badge-slate font-bold">No Material Exposure Change</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-mono text-slate-800 mt-1.5">
                  <span>Baseline Mean: <strong>{formatINR(baselineResults.mean_loss)}</strong></span>
                  <span>→</span>
                  <span>Scenario Mean: <strong>{formatINR(results.mean_loss)}</strong></span>
                  <span>•</span>
                  <span>
                    {isBetter ? 'Total Exposure Reduction: ' : isWorse ? 'Net Exposure Increase: ' : 'Net Delta: '}
                    <strong className={`font-bold ${isBetter ? 'text-teal-700' : isWorse ? 'text-rose-700' : 'text-slate-700'}`}>
                      {formatINR(absDeltaLoss)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10.5px] uppercase font-mono text-slate-600 font-semibold">95% VaR Shift</div>
              <div className="text-lg font-mono font-bold text-slate-900">
                {formatINR(baselineResults.var_95)} → {formatINR(results.var_95)}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ===== STEP 3: STATISTICAL METRICS LADDER ===== */}
      {results && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      )}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="panel p-4 space-y-2.5">
              <Skeleton className="h-2.5 w-20 bg-slate-200" />
              <Skeleton className="h-6 w-24 bg-slate-200" />
              <Skeleton className="h-2.5 w-16 bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {/* ===== STEP 4: LOSS DISTRIBUTION HISTOGRAM & THRESHOLD MARKERS ===== */}
      <Reveal delay={100}>
        <Panel
          title={`Loss Exceedance Distribution (${iterations.toLocaleString()} Stochastic Trials)`}
          subtitle="Relative probability density of enterprise loss modeled via compound Bernoulli-LogNormal processes."
          icon={Layers}
          actions={
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-600" />
                Standard Loss Range
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" />
                P90+ Extreme Tail Risk
              </span>
            </div>
          }
          bodyClassName="p-6 pt-4"
        >
          {results && !loading && (
            <div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.distribution_bins} margin={{ top: 16, right: 16, left: 0, bottom: 30 }}>
                    <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      tick={{ fontSize: 9.5, fontFamily: 'JetBrains Mono' }}
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      dy={6}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      tickFormatter={(v) => `${v}%`}
                      width={48}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={
                        <ChartTooltip
                          formatter={(val, name, item) => [
                            `${val}% probability (${item.payload.count.toLocaleString()} trials in range ${item.payload.label})`,
                            'Simulation Frequency',
                          ]}
                        />
                      }
                      cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                    />
                    <Bar dataKey="probability" radius={[3, 3, 0, 0]}>
                      {results.distribution_bins.map((entry, index) => (
                        <Cell
                          key={`bin-${index}`}
                          fill={entry.is_tail ? '#dc2626' : '#0f766e'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ===== "SO WHAT?" ANALYTICAL INSIGHT STATEMENT ===== */}
              <div className="mt-5 p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Executive Interpretation: </strong>
                    {results.summary_statement}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-teal-700 font-semibold shrink-0">
                  Computed at {new Date(results.run_timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </Panel>
      </Reveal>

      {/* ===== STEP 5: WHAT DRIVES THE RESULT? & EXCEEDANCE PROBABILITIES ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* What Drives The Result? (Top Risk Drivers Breakdown) */}
        <Reveal delay={140} className="lg:col-span-6">
          <Panel
            title="What Drives The Result? (Simulated Asset Contributions)"
            subtitle="Ranked percentage of aggregate expected annual loss driven by individual enterprise assets."
            icon={BarChart3}
            bodyClassName="p-5 space-y-4"
          >
            <div className="space-y-3">
              {results?.top_risk_drivers?.map((driver, idx) => (
                <div key={driver.asset_id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-slate-400 font-normal">#{idx + 1}</span>
                      {driver.asset_name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatINR(driver.simulated_mean_loss)} ({driver.contribution_pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${driver.contribution_pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        {/* Exceedance Probabilities Table */}
        <Reveal delay={180} className="lg:col-span-6">
          <Panel
            title="Balance-Sheet Threshold Exceedance Probabilities"
            subtitle="Calculated probability of aggregate losses breaking key corporate solvency barriers."
            icon={Target}
            bodyClassName="p-0"
          >
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Loss Threshold</th>
                    <th>Probability</th>
                    <th>Simulated Hits</th>
                  </tr>
                </thead>
                <tbody>
                  {results?.exceedance_stats?.map((stat, i) => (
                    <tr key={i}>
                      <td className="font-mono font-bold text-slate-900">{stat.threshold_label}</td>
                      <td>
                        <span className={`font-mono font-bold ${
                          stat.probability_pct > 50 ? 'text-rose-600' : stat.probability_pct > 20 ? 'text-amber-700' : 'text-teal-700'
                        }`}>
                          {stat.probability_pct}%
                        </span>
                      </td>
                      <td className="font-mono text-slate-500 text-xs">
                        {stat.occurrences.toLocaleString()} / {iterations.toLocaleString()} trials
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </Reveal>
      </div>

      {/* ===== STEP 6: REALIZED TRIAL DRILL-DOWN ===== */}
      <Reveal delay={200}>
        <Panel
          title="Stochastic Scenario Realizations (Random Sample Drill-Down)"
          subtitle="5 individual multi-asset attack realizations sampled directly from the simulation universe."
          icon={ShieldAlert}
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trial Identifier</th>
                  <th>Simulated Financial Loss</th>
                  <th>Simulated Incidents</th>
                  <th>Compromised Asset Combination</th>
                </tr>
              </thead>
              <tbody>
                {results?.sample_scenarios?.map((scenario, i) => (
                  <tr key={i}>
                    <td className="font-mono font-bold text-slate-900 text-xs">{scenario.scenario_id}</td>
                    <td className="font-mono font-bold text-slate-900">
                      {formatINR(scenario.simulated_loss)}
                    </td>
                    <td className="font-mono text-xs text-slate-600">
                      {scenario.incidents_count} Systems Breached
                    </td>
                    <td className="text-xs text-slate-600 font-mono">
                      {Array.isArray(scenario.compromised_assets)
                        ? scenario.compromised_assets.join(', ')
                        : scenario.compromised_assets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </Reveal>
    </div>
  );
}
