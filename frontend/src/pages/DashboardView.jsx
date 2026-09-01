import React from 'react';
import { 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Coins, 
  Target, 
  Layers, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Flame,
  Globe,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import RiskBadge from '../components/RiskBadge';

export default function DashboardView({ dashboardData, onNavigate, onSimulateEvent, isSimulating }) {
  if (!dashboardData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400 font-mono">Aggregating Enterprise Cyber Risk Telemetry...</p>
        </div>
      </div>
    );
  }

  const {
    enterprise_risk_score,
    expected_annual_loss,
    p90_loss,
    var_95,
    security_budget,
    potential_risk_reduction,
    risk_trend_12m = [],
    eal_by_asset = [],
    top_risk_drivers = [],
    top_vulnerabilities = [],
    recommended_portfolio_summary = {}
  } = dashboardData;

  const kpis = [
    {
      title: "Enterprise Risk Score",
      value: `${enterprise_risk_score} / 100`,
      sub: "Aggregated Likelihood × Impact",
      icon: ShieldAlert,
      color: enterprise_risk_score > 70 ? "text-rose-400" : "text-amber-400",
      borderColor: enterprise_risk_score > 70 ? "border-rose-500/30" : "border-amber-500/30",
      badge: enterprise_risk_score > 70 ? "CRITICAL (P1)" : "ELEVATED",
      badgeBg: enterprise_risk_score > 70 ? "bg-rose-950 text-rose-300" : "bg-amber-950 text-amber-300"
    },
    {
      title: "Expected Annual Loss (EAL)",
      value: <CurrencyFormatter value={expected_annual_loss} />,
      sub: "Mean Probabilistic Exposure",
      icon: Flame,
      color: "text-rose-400",
      borderColor: "border-rose-500/30",
      badge: "INR / YEAR",
      badgeBg: "bg-rose-950/80 text-rose-300"
    },
    {
      title: "P90 Tail Loss",
      value: <CurrencyFormatter value={p90_loss} />,
      sub: "90% Worst-Case Scenario",
      icon: TrendingUp,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      badge: "MONTE CARLO",
      badgeBg: "bg-orange-950/80 text-orange-300"
    },
    {
      title: "Value at Risk (VaR 95%)",
      value: <CurrencyFormatter value={var_95} />,
      sub: "Loss Exceeded in 1 of 20 Years",
      icon: Target,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      badge: "95% CONFIDENCE",
      badgeBg: "bg-purple-950/80 text-purple-300"
    },
    {
      title: "Security Budget",
      value: <CurrencyFormatter value={security_budget} />,
      sub: "Board Approved Allocation",
      icon: Coins,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      badge: "FY 2026-27",
      badgeBg: "bg-cyan-950/80 text-cyan-300"
    },
    {
      title: "Potential Risk Reduction",
      value: <CurrencyFormatter value={potential_risk_reduction} />,
      sub: "Knapsack Optimized Control Mix",
      icon: TrendingDown,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      badge: `${recommended_portfolio_summary.overall_rosi || '2.36'}x ROSI`,
      badgeBg: "bg-emerald-950/80 text-emerald-300"
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* CISO Question Header Banner */}
      <div className="cyber-card bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">Continuous Risk Quantification Engine</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
            FinTrust Bank — Executive Risk Quantification & Budget Optimizer
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Translating technical security telemetry (KEV exploits, IAM gaps, attack paths) into <strong className="text-slate-200">Rupee-denominated financial risk</strong> and calculating the optimal <strong className="text-slate-200">₹25L budget allocation</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('optimizer')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow-emerald transition-all transform active:scale-95"
          >
            <span>Optimize ₹25L Budget</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`cyber-card ${kpi.borderColor} relative overflow-hidden group`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 tracking-wide uppercase font-mono">{kpi.title}</span>
                  <div className={`text-2xl font-bold mt-1 ${kpi.color} flex items-center gap-2`}>
                    {kpi.value}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 font-mono">{kpi.sub}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${kpi.badgeBg}`}>
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Section: 12M Trend + EAL by Asset */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Trend Chart */}
        <div className="cyber-card lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  12-Month Financial Exposure & Risk Trend
                </h2>
                <p className="text-xs text-slate-400">Monthly Expected Annual Loss (EAL) trajectory</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                CURRENT: ₹1.84 Cr
              </span>
            </div>

            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={risk_trend_12m} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis 
                    stroke="#64748b" 
                    tick={{ fontSize: 11 }} 
                    tickFormatter={(v) => `₹${(v/10000000).toFixed(1)}Cr`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val) => [formatINR(val), "Expected Loss (EAL)"]}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="eal" 
                    stroke="#ef4444" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#ealGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Critical increase in Q4 due to unpatched KEV vulnerabilities on Payment Gateway.</span>
            <button 
              onClick={() => onNavigate('monte_carlo')}
              className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 text-[11px]"
            >
              Run Monte Carlo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* EAL by Asset Bar Chart */}
        <div className="cyber-card lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  EAL by Critical Banking Asset
                </h2>
                <p className="text-xs text-slate-400">Financial exposure concentration</p>
              </div>
              <button
                onClick={() => onNavigate('assets')}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                All 6 Assets <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eal_by_asset} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <XAxis 
                    type="number" 
                    stroke="#64748b" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="short_name" 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 10 }} 
                    width={90}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val, name, item) => [
                      `${formatINR(val)} (Likelihood: ${(item.payload.incident_probability * 100).toFixed(1)}%)`, 
                      "Expected Annual Loss"
                    ]}
                  />
                  <Bar dataKey="eal" radius={[0, 4, 4, 0]}>
                    {eal_by_asset.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.eal >= 7000000 ? '#ef4444' : entry.eal >= 3000000 ? '#f59e0b' : '#06b6d4'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 text-xs text-rose-400 font-mono bg-rose-950/40 p-2 rounded border border-rose-900/40 flex items-center justify-between">
            <span>Primary Driver: Payment Server accounts for 39.1% of total bank cyber risk.</span>
          </div>
        </div>
      </div>

      {/* Second Row: Top Risk Drivers & Top Vulnerabilities & Investment Portfolio Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Risk Drivers */}
        <div className="cyber-card">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-rose-400" />
            Top Risk Drivers
          </h2>
          <div className="space-y-3.5">
            {top_risk_drivers.map((driver, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{driver.driver}</span>
                  <span className="text-slate-400 font-mono">{driver.weight}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${driver.weight >= 90 ? 'bg-gradient-to-r from-red-500 to-rose-600' : driver.weight >= 80 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-cyan-500'}`}
                    style={{ width: `${driver.weight}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Affects: {driver.affected_assets}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Critical CVEs */}
        <div className="cyber-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Active High-Risk Vulnerabilities
            </h2>
            <button 
              onClick={() => onNavigate('vulnerabilities')}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
            >
              View 10 CVEs
            </button>
          </div>
          <div className="space-y-2.5">
            {top_vulnerabilities.map((vuln, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-200">{vuln.cve_id}</span>
                    {vuln.is_kev && <RiskBadge isKev={true} />}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[220px]">{vuln.title}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-rose-400">CVSS {vuln.cvss_score}</span>
                  <div className="text-[10px] text-slate-500 font-mono">EPSS: {(vuln.epss_score * 100).toFixed(0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimal Investment Portfolio Card */}
        <div className="cyber-card border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Optimal Security Investment
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                0/1 KNAPSACK
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              With your approved <strong className="text-cyan-300">₹25.0 Lakh</strong> budget, the algorithm selects the maximum financial risk reduction:
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400">Recommended Spend:</span>
                <CurrencyFormatter value={recommended_portfolio_summary.total_cost || 2100000} className="text-cyan-300" />
              </div>
              <div className="flex justify-between text-xs p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400">Risk Reduction:</span>
                <CurrencyFormatter value={recommended_portfolio_summary.total_risk_reduction || 5300000} className="text-emerald-400" />
              </div>
              <div className="flex justify-between text-xs p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400">Remaining Residual Risk:</span>
                <CurrencyFormatter value={recommended_portfolio_summary.remaining_risk || 13100000} className="text-amber-400" />
              </div>
              <div className="flex justify-between text-xs p-2 rounded bg-emerald-950/60 border border-emerald-700/60">
                <span className="text-emerald-300 font-medium">Portfolio ROSI:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {recommended_portfolio_summary.overall_rosi || '2.52'}x Return
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('optimizer')}
            className="w-full mt-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-glow-emerald transition-all"
          >
            <span>Launch Investment Optimizer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
