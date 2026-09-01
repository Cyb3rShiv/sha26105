import React from 'react';
import {
  ShieldAlert,
  TrendingUp,
  Layers,
  ArrowRight,
  Flame,
  ShieldCheck,
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
  Cell,
  CartesianGrid,
} from 'recharts';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import RiskBadge from '../components/RiskBadge';
import CountUp from '../components/ui/CountUp';
import Reveal from '../components/ui/Reveal';
import Skeleton from '../components/ui/Skeleton';
import StatCard from '../components/ui/StatCard';
import Panel from '../components/ui/Panel';
import RiskGauge from '../components/ui/RiskGauge';
import ChartTooltip from '../components/charts/ChartTooltip';
import { CHART } from '../components/charts/chartTheme';

function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="panel ledger-marks dot-grid p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8 justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-2.5 w-56" />
          <Skeleton className="h-7 w-full max-w-xl" />
          <Skeleton className="h-3.5 w-full max-w-2xl" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <Skeleton className="h-28 w-48 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel p-5 space-y-3">
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-2.5 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="panel p-5 lg:col-span-7 space-y-4">
          <Skeleton className="h-3.5 w-64" />
          <Skeleton className="h-60 w-full" />
        </div>
        <div className="panel p-5 lg:col-span-5 space-y-4">
          <Skeleton className="h-3.5 w-52" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardView({ dashboardData, onNavigate, onSimulateEvent, isSimulating }) {
  if (!dashboardData) {
    return <DashboardSkeleton />;
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
      value: <CountUp value={enterprise_risk_score} format={(v) => `${Math.round(v)} / 100`} />,
      sub: "Aggregated Likelihood × Impact",
      tone: enterprise_risk_score > 70 ? 'danger' : 'warn',
      badge: enterprise_risk_score > 70 ? "CRITICAL (P1)" : "ELEVATED",
      badgeTone: enterprise_risk_score > 70 ? "danger" : "warn",
    },
    {
      title: "Expected Annual Loss (EAL)",
      value: <CountUp value={expected_annual_loss} format={formatINR} />,
      sub: "Mean Probabilistic Exposure",
      tone: 'danger',
      badge: "INR / YEAR",
      badgeTone: "danger",
    },
    {
      title: "P90 Tail Loss",
      value: <CountUp value={p90_loss} format={formatINR} />,
      sub: "90% Worst-Case Scenario",
      tone: 'warn',
      badge: "MONTE CARLO",
      badgeTone: "warn",
    },
    {
      title: "Value at Risk (VaR 95%)",
      value: <CountUp value={var_95} format={formatINR} />,
      sub: "Loss Exceeded in 1 of 20 Years",
      tone: 'info',
      badge: "95% CONFIDENCE",
      badgeTone: "info",
    },
    {
      title: "Security Budget",
      value: <CountUp value={security_budget} format={formatINR} />,
      sub: "Board Approved Allocation",
      tone: 'brass',
      badge: "FY 2026-27",
      badgeTone: "brass",
    },
    {
      title: "Potential Risk Reduction",
      value: <CountUp value={potential_risk_reduction} format={formatINR} />,
      sub: "Knapsack Optimized Control Mix",
      tone: 'ok',
      badge: `${recommended_portfolio_summary.overall_rosi || '2.36'}x ROSI`,
      badgeTone: "ok",
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* ===== Executive hero ===== */}
      <Reveal className="panel ledger-marks dot-grid p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="live-dot" />
            <span className="eyebrow text-brass-400">Continuous Risk Quantification Engine</span>
          </div>
          <h1 className="font-display text-[26px] md:text-[32px] leading-tight font-medium text-ink-50 mt-3">
            FinTrust Bank — Executive Risk Quantification &amp; Budget Optimizer
          </h1>
          <p className="text-[13px] text-ink-300 mt-3 leading-relaxed">
            Translating technical security telemetry (KEV exploits, IAM gaps, attack paths) into{' '}
            <strong className="text-ink-100 font-semibold">Rupee-denominated financial risk</strong> and calculating
            the optimal <strong className="text-ink-100 font-semibold">₹25L budget allocation</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button onClick={() => onNavigate('optimizer')} className="btn btn-ok">
              <span>Optimize ₹25L Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSimulateEvent}
              disabled={isSimulating}
              className="btn btn-ghost"
              title="Inject a realistic synthetic security telemetry event and trigger live risk recalculation"
            >
              {isSimulating ? 'Recalculating…' : 'Ingest New Event'}
            </button>
          </div>
        </div>

        <div className="shrink-0 mx-auto lg:mx-0 tile px-8 pt-5 pb-4 flex flex-col items-center">
          <RiskGauge score={enterprise_risk_score} />
          <div className="text-[10px] font-mono text-ink-400 mt-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3" />
            Aggregated across {eal_by_asset.length || 6} critical assets
          </div>
        </div>
      </Reveal>

      {/* ===== KPI grid ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <StatCard
            key={kpi.title}
            label={kpi.title}
            value={kpi.value}
            sub={kpi.sub}
            badge={kpi.badge}
            badgeTone={kpi.badgeTone}
            tone={kpi.tone}
            delay={80 + idx * 60}
          />
        ))}
      </div>

      {/* ===== Charts row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 12-month trend */}
        <Reveal delay={140} className="lg:col-span-7">
          <Panel
            title="12-Month Financial Exposure & Risk Trend"
            subtitle="Monthly Expected Annual Loss (EAL) trajectory"
            icon={TrendingUp}
            actions={
              <span className="chip border-brass-800 bg-brass-950 text-brass-300">CURRENT: {formatINR(expected_annual_loss)}</span>
            }
            bodyClassName="px-3 pt-4 pb-1"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={risk_trend_12m} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART.danger} stopOpacity={0.32} />
                      <stop offset="95%" stopColor={CHART.danger} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={CHART.grid} strokeDasharray="2 6" vertical={false} />
                  <XAxis dataKey="month" stroke={CHART.axis} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: CHART.grid }} dy={6} />
                  <YAxis
                    stroke={CHART.axis}
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`}
                    tickLine={false}
                    axisLine={false}
                    width={62}
                  />
                  <Tooltip
                    content={<ChartTooltip formatter={(val) => [formatINR(val), 'Expected Loss (EAL)']} />}
                    cursor={{ stroke: CHART.slate, strokeDasharray: '3 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="eal"
                    stroke={CHART.danger}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#ealGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: CHART.danger, stroke: '#0b0e14', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-ink-400 border-t border-ink-800 mx-2 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Critical increase in Q4 due to unpatched KEV vulnerabilities on Payment Gateway.</span>
              <button
                onClick={() => onNavigate('monte_carlo')}
                className="text-brass-400 hover:text-brass-300 font-mono flex items-center gap-1 text-[11px] shrink-0"
              >
                Run Monte Carlo <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </Panel>
        </Reveal>

        {/* EAL by asset */}
        <Reveal delay={200} className="lg:col-span-5">
          <Panel
            title="EAL by Critical Banking Asset"
            subtitle="Financial exposure concentration"
            icon={Layers}
            actions={
              <button
                onClick={() => onNavigate('assets')}
                className="text-[11px] font-mono text-brass-400 hover:text-brass-300 flex items-center gap-1"
              >
                All {eal_by_asset.length || 6} Assets <ArrowRight className="w-3 h-3" />
              </button>
            }
            bodyClassName="px-3 pt-4 pb-1"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eal_by_asset} layout="vertical" margin={{ top: 5, right: 22, left: 8, bottom: 5 }}>
                  <CartesianGrid stroke={CHART.grid} strokeDasharray="2 6" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke={CHART.axis}
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    tickLine={false}
                    axisLine={{ stroke: CHART.grid }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short_name"
                    stroke={CHART.axis}
                    tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    width={92}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip
                        formatter={(val, name, item) => [
                          `${formatINR(val)} (Likelihood: ${(item.payload.incident_probability * 100).toFixed(1)}%)`,
                          'Expected Annual Loss',
                        ]}
                      />
                    }
                    cursor={{ fill: 'rgba(217, 168, 78, 0.05)' }}
                  />
                  <Bar dataKey="eal" radius={[0, 4, 4, 0]} barSize={16}>
                    {eal_by_asset.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.eal >= 7000000 ? CHART.danger : entry.eal >= 3000000 ? CHART.warn : CHART.slate}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 mx-2 mb-2 text-[11px] text-danger-300 font-mono bg-danger-950/50 p-2.5 rounded-md border border-danger-900 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 shrink-0 text-danger-400" />
              <span>Primary Driver: Payment Server accounts for 39.1% of total bank cyber risk.</span>
            </div>
          </Panel>
        </Reveal>
      </div>

      {/* ===== Drivers / CVEs / Portfolio ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal delay={120}>
          <Panel title="Top Risk Drivers" icon={Flame} bodyClassName="p-5 pt-4">
            <div className="space-y-4">
              {top_risk_drivers.map((driver, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline text-xs mb-1.5">
                    <span className="text-ink-200 font-medium pr-3">{driver.driver}</span>
                    <span className="text-ink-300 font-mono text-[11px] shrink-0">{driver.weight}%</span>
                  </div>
                  <div className="meter">
                    <span
                      className={driver.weight >= 90 ? 'bg-danger-500' : driver.weight >= 80 ? 'bg-warn-500' : 'bg-brass-500'}
                      style={{ width: `${driver.weight}%`, animationDelay: `${idx * 90}ms` }}
                    />
                  </div>
                  <div className="text-[10px] text-ink-500 font-mono mt-1">Affects: {driver.affected_assets}</div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={180}>
          <Panel
            title="Active High-Risk Vulnerabilities"
            icon={ShieldAlert}
            actions={
              <button
                onClick={() => onNavigate('vulnerabilities')}
                className="text-[11px] font-mono text-brass-400 hover:text-brass-300"
              >
                View {dashboardData.vulnerability_count || 10} CVEs
              </button>
            }
          >
            <div className="space-y-2">
              {top_vulnerabilities.map((vuln, idx) => (
                <div
                  key={idx}
                  className="tile p-3 flex items-center justify-between gap-3 hover:border-ink-700 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-ink-100">{vuln.cve_id}</span>
                      {vuln.is_kev && <RiskBadge isKev={true} />}
                    </div>
                    <div className="text-[11px] text-ink-400 truncate max-w-[240px] mt-0.5">{vuln.title}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-danger-400">CVSS {vuln.cvss_score}</span>
                    <div className="text-[10px] text-ink-500 font-mono">EPSS: {(vuln.epss_score * 100).toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={240}>
          <Panel
            title="Optimal Security Investment"
            icon={ShieldCheck}
            actions={<span className="chip border-ok-800 bg-ok-950 text-ok-300">0/1 KNAPSACK</span>}
            className="border-ok-900/80"
            bodyClassName="p-5 pt-4 flex flex-col flex-1"
          >
            <p className="text-xs text-ink-300 leading-relaxed mb-4">
              With your approved <strong className="text-brass-300 font-semibold">₹25.0 Lakh</strong> budget, the
              algorithm selects the maximum financial risk reduction:
            </p>

            <div className="space-y-2 text-xs flex-1">
              <div className="tile flex justify-between items-center px-3 py-2.5">
                <span className="text-ink-400">Recommended Spend:</span>
                <CurrencyFormatter value={recommended_portfolio_summary.total_cost || 2100000} className="text-brass-300" />
              </div>
              <div className="tile flex justify-between items-center px-3 py-2.5">
                <span className="text-ink-400">Risk Reduction:</span>
                <CurrencyFormatter value={recommended_portfolio_summary.total_risk_reduction || 5300000} className="text-ok-400" />
              </div>
              <div className="tile flex justify-between items-center px-3 py-2.5">
                <span className="text-ink-400">Remaining Residual Risk:</span>
                <CurrencyFormatter value={recommended_portfolio_summary.remaining_risk || 13100000} className="text-warn-400" />
              </div>
              <div className="flex justify-between items-center px-3 py-2.5 rounded-lg bg-ok-950/70 border border-ok-800">
                <span className="text-ok-300 font-medium">Portfolio ROSI:</span>
                <span className="display-num text-ok-300 text-lg leading-none">
                  {recommended_portfolio_summary.overall_rosi || '2.52'}x
                </span>
              </div>
            </div>

            <button onClick={() => onNavigate('optimizer')} className="btn btn-ok w-full mt-4">
              <span>Launch Investment Optimizer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
