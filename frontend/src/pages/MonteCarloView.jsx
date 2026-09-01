import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Play, 
  RefreshCw, 
  Target, 
  Layers, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  Cell 
} from 'recharts';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import { api } from '../services/api';

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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Monte Carlo Loss Distribution Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulates 10,000 stochastic attack scenarios across FinTrust Bank's assets to quantify tail risk, P90, and Value at Risk (VaR).
          </p>
        </div>

        {/* Iteration Selector & Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {[1000, 5000, 10000, 25000].map((count) => (
              <button
                key={count}
                onClick={() => {
                  setIterations(count);
                  runSimulation(count);
                }}
                disabled={loading}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                  iterations === count 
                    ? 'bg-purple-600 text-white shadow-glow-purple' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {count >= 1000 ? `${count / 1000}K` : count} Runs
              </button>
            ))}
          </div>

          <button
            onClick={() => runSimulation(iterations)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{loading ? 'Simulating Trials...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Statistical Summary Cards */}
      {results && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="cyber-card p-4 border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Mean Annual Loss</span>
            <div className="text-lg font-bold font-mono text-white mt-1">
              <CurrencyFormatter value={results.mean_loss} />
            </div>
            <span className="text-[10px] text-slate-500">Expected baseline</span>
          </div>

          <div className="cyber-card p-4 border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Median Loss</span>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
              <CurrencyFormatter value={results.median_loss} />
            </div>
            <span className="text-[10px] text-slate-500">50th percentile</span>
          </div>

          <div className="cyber-card p-4 border-orange-500/40 bg-orange-950/20">
            <span className="text-[10px] text-orange-400 uppercase font-mono font-bold">P90 Tail Loss</span>
            <div className="text-xl font-bold font-mono text-orange-400 mt-1">
              <CurrencyFormatter value={results.p90_loss} />
            </div>
            <span className="text-[10px] text-orange-300/80">90% worst scenario</span>
          </div>

          <div className="cyber-card p-4 border-purple-500/40 bg-purple-950/20">
            <span className="text-[10px] text-purple-400 uppercase font-mono font-bold">P95 Loss</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">
              <CurrencyFormatter value={results.p95_loss} />
            </div>
            <span className="text-[10px] text-purple-300/80">95% worst scenario</span>
          </div>

          <div className="cyber-card p-4 border-rose-500/40 bg-rose-950/20">
            <span className="text-[10px] text-rose-400 uppercase font-mono font-bold">VaR (95% Confidence)</span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              <CurrencyFormatter value={results.var_95} />
            </div>
            <span className="text-[10px] text-rose-300/80">1 in 20 year event</span>
          </div>

          <div className="cyber-card p-4 border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Std. Deviation</span>
            <div className="text-lg font-bold font-mono text-slate-300 mt-1">
              <CurrencyFormatter value={results.std_dev} />
            </div>
            <span className="text-[10px] text-slate-500">Loss volatility (σ)</span>
          </div>
        </div>
      )}

      {/* Main Histogram Chart */}
      <div className="cyber-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Loss Exceedance Probability Distribution ({iterations.toLocaleString()} Runs)
            </h2>
            <p className="text-xs text-slate-400">
              Frequency of simulated financial losses across log-normal impact distributions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
              <span className="text-slate-300">Standard Loss</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
              <span className="text-rose-300">P90+ Extreme Tail</span>
            </div>
          </div>
        </div>

        {results && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.distribution_bins} margin={{ top: 20, right: 30, left: 10, bottom: 25 }}>
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  tick={{ fontSize: 10 }} 
                  angle={-35}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val, name, item) => [
                    `${val} scenarios (${item.payload.probability}% probability)`, 
                    "Frequency"
                  ]}
                  labelStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {results.distribution_bins.map((bin, index) => {
                    const isTail = bin.loss_min >= (results.p90_loss * 0.9);
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={isTail ? '#ef4444' : '#8b5cf6'} 
                        fillOpacity={isTail ? 0.9 : 0.75}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 5 Sample Scenario Runs Table */}
      {results && results.sample_scenarios && (
        <div className="cyber-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Sample Scenario Realizations (Random Trial Drill-down)
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Representative outcomes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                  <th className="p-3">Scenario ID</th>
                  <th className="p-3">Breaches Occurred</th>
                  <th className="p-3">Compromised Assets</th>
                  <th className="p-3">Simulated Enterprise Loss</th>
                  <th className="p-3">Severity Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {results.sample_scenarios.map((scen, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-200">{scen.scenario_id}</td>
                    <td className="p-3 text-cyan-400">{scen.incidents_count} Asset(s)</td>
                    <td className="p-3 text-slate-300">{scen.compromised_assets.join(', ')}</td>
                    <td className="p-3 font-bold text-rose-400 text-sm">
                      <CurrencyFormatter value={scen.simulated_loss} />
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        scen.simulated_loss >= results.p90_loss 
                          ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                          : scen.simulated_loss >= results.mean_loss 
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {scen.simulated_loss >= results.p90_loss ? 'EXTREME TAIL' : scen.simulated_loss >= results.mean_loss ? 'MODERATE BREACH' : 'CONTAINED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
