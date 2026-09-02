import React, { useState } from 'react';
import {
  Coins,
  ShieldCheck,
  TrendingDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { formatINR } from '../CurrencyFormatter';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const ALLOCATION_STEPS = [
  {
    budget: 0,
    label: '₹0 (Zero Security Spend)',
    eal: 18400000,
    var95: 75900000,
    residualRisk: 18400000,
    rosi: 0,
    activeControls: 0,
    controls: [],
    curve: [
      { x: 'P10', loss: 0 },
      { x: 'P25', loss: 1200000 },
      { x: 'P50', loss: 8500000 },
      { x: 'P75', loss: 24000000 },
      { x: 'P90', loss: 59000000 },
      { x: 'P95', loss: 75900000 },
      { x: 'P99', loss: 110000000 },
    ],
  },
  {
    budget: 1000000,
    label: '₹10 Lakhs (Emergency Patching)',
    eal: 13600000,
    var95: 54000000,
    residualRisk: 13600000,
    rosi: 4.8,
    activeControls: 1,
    controls: ['Emergency Patching for CVE-2024-3094 (Payment Server)'],
    curve: [
      { x: 'P10', loss: 0 },
      { x: 'P25', loss: 800000 },
      { x: 'P50', loss: 5200000 },
      { x: 'P75', loss: 16000000 },
      { x: 'P90', loss: 41000000 },
      { x: 'P95', loss: 54000000 },
      { x: 'P99', loss: 82000000 },
    ],
  },
  {
    budget: 2500000,
    label: '₹25 Lakhs (Optimal Knapsack Portfolio)',
    eal: 7900000,
    var95: 32000000,
    residualRisk: 7900000,
    rosi: 4.2,
    activeControls: 3,
    controls: [
      'Emergency Patching (CVE-2024-3094)',
      'Phishing-Resistant FIDO2 MFA on IAM',
      'Database Activity Monitoring (DAM)',
    ],
    curve: [
      { x: 'P10', loss: 0 },
      { x: 'P25', loss: 400000 },
      { x: 'P50', loss: 2800000 },
      { x: 'P75', loss: 9200000 },
      { x: 'P90', loss: 24000000 },
      { x: 'P95', loss: 32000000 },
      { x: 'P99', loss: 48000000 },
    ],
  },
  {
    budget: 5000000,
    label: '₹50 Lakhs (Advanced Hardening)',
    eal: 4800000,
    var95: 18500000,
    residualRisk: 4800000,
    rosi: 2.7,
    activeControls: 5,
    controls: [
      'Emergency Patching (CVE-2024-3094)',
      'FIDO2 MFA on IAM & Web Apps',
      'Database Activity Monitoring & Tokenization',
      'Zero Trust Subnet Microsegmentation',
      'Automated Threat Intelligence Feeds',
    ],
    curve: [
      { x: 'P10', loss: 0 },
      { x: 'P25', loss: 200000 },
      { x: 'P50', loss: 1500000 },
      { x: 'P75', loss: 4800000 },
      { x: 'P90', loss: 13000000 },
      { x: 'P95', loss: 18500000 },
      { x: 'P99', loss: 28000000 },
    ],
  },
];

export default function LiveUniverseSandbox({ onLaunchConsole }) {
  const [stepIndex, setStepIndex] = useState(2); // Default to ₹25 Lakhs
  const current = ALLOCATION_STEPS[stepIndex];

  return (
    <div className="w-full bg-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
      {/* Background Subtle Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-transparent to-slate-950/60 pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Decision Universe</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
              See the risk before it happens.
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Drag the capital allocation slider below. Watch how the 0/1 Knapsack optimizer shifts the tail loss probability distribution in real time.
            </p>
          </div>

          <button
            onClick={() => onLaunchConsole('optimizer')}
            className="btn bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg shadow-lg self-start lg:self-auto transition-all"
          >
            <span>Open in Full 0/1 Knapsack Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Interactive Capital Slider */}
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Security Investment Capital:
            </span>
            <span className="text-base font-mono font-bold text-teal-300">
              {current.label}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={stepIndex}
            onChange={(e) => setStepIndex(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>₹0 (Unmitigated)</span>
            <span>₹10L</span>
            <span className="text-teal-400 font-bold">₹25L (Optimal)</span>
            <span>₹50L (Max Protection)</span>
          </div>
        </div>

        {/* Live Metrics Grid & Area Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="text-[11px] font-mono uppercase text-slate-400">Expected Annual Loss</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {formatINR(current.eal)}
              </div>
              <div className="text-[10px] text-teal-400 font-mono mt-1">
                {current.budget > 0 ? `−₹${((18400000 - current.eal)/100000).toFixed(0)}L avoided` : 'Baseline Exposure'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="text-[11px] font-mono uppercase text-slate-400">95% Value at Risk (VaR)</div>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                {formatINR(current.var95)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                1 in 20-year worst-case
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="text-[11px] font-mono uppercase text-slate-400">Portfolio ROSI Multiplier</div>
              <div className="text-xl font-bold font-mono text-teal-400 mt-1">
                {current.rosi > 0 ? `${current.rosi}x` : '—'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Risk Reduction / Spend
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="text-[11px] font-mono uppercase text-slate-400">Active Controls</div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {current.activeControls} Controls
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Allocated via 0/1 Knapsack
              </div>
            </div>
          </div>

          {/* Probability Distribution Area Chart */}
          <div className="lg:col-span-7 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 h-64">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Loss Exceedance Curve (Tail Risk)</span>
              <span className="text-teal-400 font-bold">Shift: {current.budget > 0 ? 'Compressing Toward Zero' : 'Unbounded Risk'}</span>
            </div>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={current.curve}>
                <defs>
                  <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tickFormatter={(v) => `₹${(v/10000000).toFixed(0)}Cr`} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  formatter={(val) => [formatINR(val), 'Simulated Loss']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="loss" stroke="#2dd4bf" strokeWidth={2.5} fillOpacity={1} fill="url(#lossGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamically Activated Knapsack Controls */}
        {current.controls.length > 0 && (
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="text-slate-400 uppercase font-semibold">Active Defenses:</span>
            {current.controls.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-950 border border-teal-800 text-teal-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
