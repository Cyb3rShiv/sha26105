import React, { useState, useEffect } from 'react';
import { TrendingUp, Play, RefreshCw, Target, Layers, RotateCcw, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import CountUp from '../components/ui/CountUp';
import ChartTooltip from '../components/charts/ChartTooltip';
import { CHART } from '../components/charts/chartTheme';

const ITERATION_PRESETS = [1000, 5000, 10000, 25000];

export default function MonteCarloView() {
  const [iterations, setIterations] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const runSimulation = async (count = iterations) => {
    setLoading(true);
    try {
      const data = await api.runMonteCarlo(count);
      if (data) {
        setResults(data);
      }
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(10000);
  }, []);

  const stats = results
    ? [
        { label: 'Mean Annual Loss', value: results.mean_loss, tone: 'text-ink-50', sub: 'Expected baseline', hot: false },
        { label: 'Median Loss', value: results.median_loss, tone: 'text-brass-300', sub: '50th percentile', hot: false },
        { label: 'P90 Tail Loss', value: results.p90_loss, tone: 'text-warn-400', sub: '90% worst scenario', hot: true },
        { label: 'P95 Loss', value: results.p95_loss, tone: 'text-info-400', sub: '95% worst scenario', hot: true },
        { label: 'VaR (95% Confidence)', value: results.var_95, tone: 'text-danger-400', sub: '1 in 20 year event', hot: true },
        { label: 'Std. Deviation', value: results.std_dev, tone: 'text-ink-200', sub: 'Loss volatility (σ)', hot: false },
      ]
    : [];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={TrendingUp}
        eyebrow="Modeling / Loss Distribution"
        title="Monte Carlo Loss Distribution Engine"
        description="Simulates 10,000 stochastic attack scenarios across FinTrust Bank's assets to quantify tail risk, P90, and Value at Risk (VaR)."
        actions={
          <>
            {/* Iteration presets */}
            <div className="flex items-center bg-ink-900 p-1 rounded-lg border border-ink-800" role="group" aria-label="Iteration count">
              {ITERATION_PRESETS.map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setIterations(count);
                    runSimulation(count);
                  }}
                  disabled={loading}
                  aria-pressed={iterations === count}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-colors disabled:opacity-50 ${
                    iterations === count
                      ? 'bg-brass-500 text-ink-1000'
                      : 'text-ink-400 hover:text-ink-100'
                  }`}
                >
                  {count >= 1000 ? `${count / 1000}K` : count}
                </button>
              ))}
            </div>
            <button onClick={() => runSimulation(iterations)} disabled={loading} className="btn btn-primary">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{loading ? 'Simulating…' : 'Run Simulation'}</span>
            </button>
          </>
        }
      />

      {/* ===== Statistical summary ===== */}
      {results && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s, idx) => (
            <StatTile key={s.label} {...s} delay={idx * 60} />
          ))}
        </div>
      )}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" aria-label="Loading statistics">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="panel p-4 space-y-2.5">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-2 w-16" />
            </div>
          ))}
        </div>
      )}

      {/* ===== Histogram ===== */}
      <Reveal delay={100}>
        <Panel
          title={`Loss Exceedance Probability Distribution (${iterations.toLocaleString()} Runs)`}
          subtitle="Frequency of simulated financial losses across log-normal impact distributions."
          icon={Layers}
          actions={
            <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-ink-300">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: CHART.brass }} />
                Standard Loss
              </span>
              <span className="flex items-center gap-1.5 text-danger-300">
                <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: CHART.danger }} />
                P90+ Extreme Tail
              </span>
            </div>
          }
          bodyClassName="p-5 pt-4"
        >
          {results && !loading && (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.distribution_bins} margin={{ top: 16, right: 16, left: 0, bottom: 30 }}>
                  <CartesianGrid stroke={CHART.grid} strokeDasharray="2 6" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke={CHART.axis}
                    tick={{ fontSize: 9.5, fontFamily: 'JetBrains Mono' }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    tickLine={false}
                    axisLine={{ stroke: CHART.grid }}
                  />
                  <YAxis
                    stroke={CHART.axis}
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(val, name, item) => [`${val} scenarios (${item.payload.probability}% probability)`, 'Frequency']}
                      />
                    }
                    cursor={{ fill: 'rgba(217, 168, 78, 0.05)' }}
                  />
                  <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                    {results.distribution_bins.map((bin, index) => {
                      const isTail = bin.loss_min >= results.p90_loss * 0.9;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={isTail ? CHART.danger : CHART.brass}
                          fillOpacity={isTail ? 0.95 : 0.75}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {loading && <Skeleton className="h-80 w-full" />}
        </Panel>
      </Reveal>

      {/* ===== Sample scenarios ===== */}
      {results && results.sample_scenarios && !loading && (
        <Reveal delay={160}>
          <Panel
            title="Sample Scenario Realizations"
            subtitle="Random trial drill-down — representative outcomes"
            icon={Target}
          >
            <div className="overflow-x-auto -mx-5 -mb-5">
              <table className="data-table min-w-[640px]">
                <thead>
                  <tr>
                    <th>Scenario ID</th>
                    <th>Breaches Occurred</th>
                    <th>Compromised Assets</th>
                    <th>Simulated Enterprise Loss</th>
                    <th>Severity Category</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {results.sample_scenarios.map((scen, idx) => (
                    <tr key={idx} className="hover:bg-ink-850">
                      <td className="font-bold text-ink-100">{scen.scenario_id}</td>
                      <td className="text-brass-300">{scen.incidents_count} Asset(s)</td>
                      <td className="text-ink-300">{scen.compromised_assets.join(', ')}</td>
                      <td className="font-bold text-danger-400 text-[13px]">
                        <CurrencyFormatter value={scen.simulated_loss} />
                      </td>
                      <td>
                        <span
                          className={`severity-badge ${
                            scen.simulated_loss >= results.p90_loss
                              ? 'bg-danger-950 text-danger-300 border border-danger-800'
                              : scen.simulated_loss >= results.mean_loss
                                ? 'bg-warn-950 text-warn-300 border border-warn-800'
                                : 'bg-ok-950 text-ok-300 border border-ok-800'
                          }`}
                        >
                          {scen.simulated_loss >= results.p90_loss
                            ? 'EXTREME TAIL'
                            : scen.simulated_loss >= results.mean_loss
                              ? 'MODERATE BREACH'
                              : 'CONTAINED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </Reveal>
      )}

      {/* ===== Engine unreachable (api returned null) ===== */}
      {!results && !loading && (
        <Panel>
          <EmptyState
            tone="danger"
            icon={AlertTriangle}
            title="Simulation engine unreachable"
            message="The Monte Carlo endpoint did not respond. Verify the risk engine backend is running on port 8000, then retry."
            action={
              <button onClick={() => runSimulation(iterations)} className="btn btn-primary">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Simulation</span>
              </button>
            }
          />
        </Panel>
      )}
    </div>
  );
}

function StatTile({ label, value, tone, sub, hot, delay }) {
  return (
    <Reveal delay={delay} className={`panel p-4 ${hot ? 'border-ink-700' : ''}`}>
      <span className={`eyebrow ${hot ? 'text-ink-300' : ''}`}>{label}</span>
      <div className={`text-[17px] font-bold font-mono mt-1.5 ${tone}`}>
        <CountUp value={value} format={formatINR} />
      </div>
      <span className="text-[10px] text-ink-500 mt-1 block">{sub}</span>
    </Reveal>
  );
}
