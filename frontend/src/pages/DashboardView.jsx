import React, { Suspense, lazy, Component } from 'react';
import {
  ShieldAlert,
  TrendingUp,
  Layers,
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Sparkles,
  Server,
  Lock,
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
import { getRiskLevel } from '../utils/riskScoring';

// WebGL instrument — lazy so `three` stays out of the critical bundle
const ExposureConstellation = lazy(() => import('../components/graphics/ExposureConstellation'));

class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('Constellation scene failed to load', err);
  }
  render() {
    return this.state.failed
      ? <div className="h-full flex items-center justify-center text-slate-400 font-mono text-xs">
          exposure topology · static mode
        </div>
      : this.props.children;
  }
}

function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="panel p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-3">
          <Skeleton className="h-4 w-48 bg-slate-200" />
          <Skeleton className="h-10 w-full max-w-xl bg-slate-200" />
          <Skeleton className="h-4 w-full max-w-2xl bg-slate-200" />
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-[280px] w-full bg-slate-200" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="panel p-5 space-y-3">
            <Skeleton className="h-3 w-28 bg-slate-200" />
            <Skeleton className="h-8 w-36 bg-slate-200" />
          </div>
        ))}
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

  const totalEal = eal_by_asset.reduce((sum, a) => sum + (a.eal || 0), 0);
  const primaryAsset = eal_by_asset.reduce(
    (top, a) => ((a.eal || 0) > (top.eal || 0) ? a : top),
    { eal: 0 }
  );
  const primaryShare = totalEal > 0 ? ((primaryAsset.eal / totalEal) * 100).toFixed(1) : '0';

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const peakMonthObj = risk_trend_12m.length > 0
    ? risk_trend_12m.reduce((max, m) => (m.eal > max.eal ? m : max), risk_trend_12m[0])
    : { month: 'Live', eal: expected_annual_loss };
  const peakMonthInsight = `Peak exposure was ${formatINR(peakMonthObj.eal)} (${peakMonthObj.month}), driven by unpatched KEV vulnerabilities.`;

  const riskLevelInfo = getRiskLevel(enterprise_risk_score);

  const kpis = [
    {
      title: "Enterprise Risk Score",
      value: <CountUp value={enterprise_risk_score} format={(v) => `${Math.round(v)} / 100`} />,
      sub: "Aggregated Likelihood × Impact",
      tone: riskLevelInfo.tone,
      badge: riskLevelInfo.level,
      badgeTone: riskLevelInfo.badgeTone,
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
      badge: "10K SIMS",
      badgeTone: "warn",
    },
    {
      title: "Value at Risk (VaR 95%)",
      value: <CountUp value={var_95} format={formatINR} />,
      sub: "Loss in 1-in-20 Year Event",
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
      sub: "0/1 Knapsack (128% Net ROSI)",
      tone: 'ok',
      badge: `${recommended_portfolio_summary.bcr || recommended_portfolio_summary.overall_rosi || recommended_portfolio_summary.rosi || '2.28'}x BCR`,
      badgeTone: "ok",
    }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Offline / Demo Data Fallback Warning Banner */}
      {(dashboardData?.is_fallback || !isOnline) && (
        <Reveal className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>DEMO DATA — BACKEND UNREACHABLE (Operating on Local Precision Engine)</span>
          </div>
          <div className="text-amber-800 text-[11px]">
            Baseline Fallback Quant · Last verified: {dashboardData?.last_updated ? new Date(dashboardData.last_updated).toLocaleTimeString() : 'Local Engine'}
          </div>
        </Reveal>
      )}

      {/* ===== Executive Overview Hero Card ===== */}
      <Reveal className="panel p-6 md:p-8 relative overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Narrative column */}
          <div className="lg:col-span-7 max-w-2xl">
            {/* System Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-emerald">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                FAIR RISK ENGINE ACTIVE
              </span>
              <span className="badge-slate">
                0/1 KNAPSACK OPTIMIZER
              </span>
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                PS 26105 · Tech Crafters
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mt-1 leading-[1.2]">
              {greeting}, CISO.{' '}
              <span className="text-teal-700 block sm:inline">
                Here's your live financial risk posture.
              </span>
            </h1>

            <p className="text-[13.5px] text-slate-600 mt-3 leading-relaxed">
              Translating real-time security signals (exploits, IAM gaps, attack paths) into a continuous{' '}
              <strong className="text-slate-900 font-semibold">Expected Annual Loss (₹)</strong> and solving the optimal{' '}
              <strong className="text-teal-800 font-semibold">₹25L budget allocation</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button onClick={() => onNavigate('optimizer')} className="btn btn-primary text-xs shadow-sm">
                <span>Solve ₹25L Budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onSimulateEvent}
                disabled={isSimulating}
                className="btn btn-secondary text-xs"
                title="Inject real-time telemetry signal (threat detection or automated remediation) and trigger live risk recalculation"
              >
                {isSimulating ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin text-teal-700" />
                    <span>Recalculating…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Ingest Telemetry Signal</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Concentration Indicators */}
            <div className="grid grid-cols-2 gap-3 mt-6 max-w-lg">
              <button
                onClick={() => onNavigate('assets')}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/40 text-left transition-all group"
                title="Open asset inventory"
              >
                <div className="text-[10.5px] font-mono uppercase tracking-wider text-rose-700 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Primary Risk Asset
                </div>
                <div className="text-[13px] font-bold text-slate-900 mt-1 truncate">
                  {primaryAsset.short_name || 'Payment Server'}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  {primaryShare}% of total bank loss
                </div>
              </button>

              <button
                onClick={() => onNavigate('vulnerabilities')}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 text-left transition-all group"
                title="Open threats"
              >
                <div className="text-[10.5px] font-mono uppercase tracking-wider text-teal-800 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                  Under Active Watch
                </div>
                <div className="text-[13px] font-bold text-slate-900 mt-1">
                  {eal_by_asset.length} Assets · {dashboardData.vulnerability_count || 10} CVEs
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Event-driven re-scoring
                </div>
              </button>
            </div>
          </div>

          {/* Instrument column — 3D exposure topology + risk gauge */}
          <div className="lg:col-span-5 flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <SceneBoundary>
              <Suspense
                fallback={
                  <div className="h-[240px] flex items-center justify-center text-slate-400 text-xs font-mono">
                    Loading 3D Topology…
                  </div>
                }
              >
                <ExposureConstellation
                  assets={eal_by_asset}
                  onSelect={() => onNavigate('assets')}
                  className="h-[220px] md:h-[240px]"
                />
              </Suspense>
            </SceneBoundary>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <RiskGauge score={enterprise_risk_score} size={140} caption="" />
              <div className="text-right min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-teal-800 font-bold">
                  Enterprise Risk Score
                </div>
                <div className="text-[11px] text-slate-600 font-mono mt-1">
                  FAIR Multi-Factor Formula
                  <br />
                  across {eal_by_asset.length || 6} critical assets
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-2 text-[10.5px] text-slate-500 font-mono">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Recalculated upon telemetry events</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== 6 Clean KPI Metric Cards ===== */}
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
            delay={60 + idx * 30}
          />
        ))}
      </div>

      {/* ===== Charts row ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 12-month trend */}
        <Reveal delay={100} className="lg:col-span-7">
          <Panel
            title="12-Month Financial Exposure & Risk Trajectory"
            subtitle="Monthly Expected Annual Loss (EAL) in ₹ INR"
            icon={TrendingUp}
            actions={
              <span className="badge-rose">
                CURRENT: {formatINR(expected_annual_loss)}
              </span>
            }
            bodyClassName="px-3 pt-4 pb-2"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={risk_trend_12m} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ealLightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity={0.16} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 10.5, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} dy={6} />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                    tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip
                    content={<ChartTooltip formatter={(val) => [formatINR(val), 'Expected Loss (EAL)']} />}
                    cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="eal"
                    stroke="#dc2626"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#ealLightGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11.5px] text-slate-500 border-t border-slate-100 mx-2 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>{peakMonthInsight}</span>
              <button
                onClick={() => onNavigate('monte_carlo')}
                className="text-teal-700 hover:text-teal-900 font-mono flex items-center gap-1 text-[11.5px] font-bold shrink-0"
              >
                Run Monte Carlo <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Panel>
        </Reveal>

        {/* EAL by asset */}
        <Reveal delay={140} className="lg:col-span-5">
          <Panel
            title="EAL by Critical Banking Asset"
            subtitle="Financial exposure concentration"
            icon={Layers}
            actions={
              <button
                onClick={() => onNavigate('assets')}
                className="text-[11.5px] font-mono text-teal-700 hover:text-teal-900 flex items-center gap-1 font-bold"
              >
                All {eal_by_asset.length || 6} Assets <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
            bodyClassName="px-3 pt-4 pb-2"
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eal_by_asset} layout="vertical" margin={{ top: 5, right: 22, left: 8, bottom: 5 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    tick={{ fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="short_name"
                    stroke="#94a3b8"
                    tick={{ fontSize: 10.5, fontFamily: 'JetBrains Mono' }}
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
                    cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                  />
                  <Bar dataKey="eal" radius={[0, 4, 4, 0]} barSize={14}>
                    {eal_by_asset.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.eal >= 7000000 ? '#dc2626' : entry.eal >= 3000000 ? '#d97706' : '#64748b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 mx-2 mb-2 text-[11px] text-rose-800 font-mono bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span>Primary Driver: Payment Server accounts for 39.1% of total bank cyber risk.</span>
            </div>
          </Panel>
        </Reveal>
      </div>

      {/* ===== Drivers / CVEs / Portfolio ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal delay={100}>
          <Panel title="Top Risk Drivers" icon={Flame} bodyClassName="p-5 pt-4">
            <div className="space-y-4">
              {top_risk_drivers.map((driver, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline text-xs mb-1.5">
                    <span className="text-slate-700 font-semibold pr-3">{driver.driver}</span>
                    <span className="text-slate-500 font-mono text-[11px] shrink-0 font-bold">{driver.weight}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        driver.weight >= 90 ? 'bg-rose-500' : driver.weight >= 80 ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${driver.weight}%` }}
                    />
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-1">Affects: {driver.affected_assets}</div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={140}>
          <Panel
            title="Active High-Risk CVEs"
            icon={ShieldAlert}
            actions={
              <button
                onClick={() => onNavigate('vulnerabilities')}
                className="text-[11.5px] font-mono text-teal-700 hover:text-teal-900 flex items-center gap-1 font-bold"
              >
                View Catalog <ArrowRight className="w-3 h-3" />
              </button>
            }
            bodyClassName="p-3"
          >
            <div className="space-y-2">
              {top_vulnerabilities.map((vuln, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{vuln.cve_id}</span>
                      <RiskBadge level={vuln.severity} priority={vuln.priority} isKev={vuln.is_kev} />
                    </div>
                    <span className="text-[11.5px] font-mono font-bold text-rose-600">
                      CVSS {vuln.cvss ?? vuln.cvss_score ?? '—'}
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-700 mt-1 font-medium truncate">{vuln.title}</div>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-mono mt-1.5 pt-1.5 border-t border-slate-200">
                    <span>Driver: {vuln.risk_driver || (vuln.is_kev ? 'CISA Known Exploited' : 'Elevated Exposure')}</span>
                    <span>Threat: {vuln.threat_factor ? `${vuln.threat_factor}x` : '1.0x'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={180}>
          <Panel
            title="Knapsack Recommended Portfolio"
            icon={ShieldCheck}
            actions={
              <span className="badge-emerald" title="2.28x Benefit-Cost Ratio (128% Net ROSI)">
                {recommended_portfolio_summary.bcr || recommended_portfolio_summary.overall_rosi || '2.28'}x BCR
              </span>
            }
            bodyClassName="p-5 pt-4"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-900 font-medium">Optimal Spend</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatINR(recommended_portfolio_summary.total_cost || 2500000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-900 font-medium">Risk Reduction</span>
                  <span className="font-mono font-bold text-teal-700">
                    {formatINR(recommended_portfolio_summary.total_risk_reduction || 5700000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-teal-200">
                  <span className="text-teal-900 font-medium">Remaining Budget</span>
                  <span className="font-mono font-bold text-slate-600">
                    {formatINR(recommended_portfolio_summary.remaining_budget || 0)}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
                  Selected Optimal Controls:
                </div>
                <div className="space-y-1.5">
                  {(recommended_portfolio_summary.selected_controls || [
                    "Automated Patch Management (KEV Priority)",
                    "FIDO2 Phishing-Resistant MFA",
                    "Immutable Offline Backup Architecture"
                  ]).map((c, i) => {
                    const name = typeof c === 'object' ? (c.name || c.id || 'Security Control') : c;
                    return (
                      <div
                        key={i}
                        className="text-xs text-slate-800 flex items-center gap-2 p-2 rounded-md bg-slate-50 border border-slate-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => onNavigate('optimizer')}
                className="w-full btn btn-primary text-xs justify-center shadow-sm"
              >
                <span>Open 0/1 Knapsack Optimizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
