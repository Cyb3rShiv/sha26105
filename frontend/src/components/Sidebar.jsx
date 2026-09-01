import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  ShieldAlert, 
  TrendingUp, 
  Coins, 
  Sliders, 
  Network, 
  FileCheck2, 
  Radio, 
  Activity,
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'assets', label: 'Asset Risk Inventory', icon: Server, badge: '6' },
  { id: 'vulnerabilities', label: 'Threats & CVEs', icon: ShieldAlert, badge: '10' },
  { id: 'monte_carlo', label: 'Monte Carlo Simulation', icon: TrendingUp, badge: '10K' },
  { id: 'optimizer', label: 'Investment Optimizer', icon: Coins, badge: 'ROSI' },
  { id: 'what_if', label: 'What-If Simulator', icon: Sliders, badge: 'Live' },
  { id: 'attack_path', label: 'Attack Path Graph', icon: Network, badge: null },
  { id: 'compliance', label: 'Regulatory Frameworks', icon: FileCheck2, badge: 'RBI' },
  { id: 'ingestion', label: 'Live Telemetry Stream', icon: Radio, badge: 'Pulse' },
];

export default function Sidebar({ activeTab, setActiveTab, liveEventsCount = 0 }) {
  return (
    <aside className="w-64 bg-cyber-surface/95 border-r border-cyber-border flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-cyber-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
            CYBER-QUANT <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-700/50">PS 26105</span>
          </div>
          <div className="text-[11px] text-cyber-textMuted tracking-wider font-mono">FinTrust Bank SOC</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Risk & Decisions
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-glow-cyan/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge === 'Pulse' && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                  )}
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live Ingestion Health Status Indicator */}
      <div className="p-4 border-t border-cyber-border bg-cyber-bg/60">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium text-[11px]">Telemetry Engine</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">ONLINE</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 font-mono flex justify-between">
          <span>Continuous Ingest</span>
          <span>100% Normalized</span>
        </div>
      </div>
    </aside>
  );
}
