import React, { useEffect } from 'react';
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
  X,
  Shield,
  Zap,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Risk & Topology',
    items: [
      { id: 'assets', label: 'Asset Risk Inventory', icon: Server, badge: '6' },
      { id: 'vulnerabilities', label: 'Threats & CVEs', icon: ShieldAlert, badge: '10' },
      { id: 'attack_path', label: 'Attack Path Graph', icon: Network },
    ],
  },
  {
    label: 'Simulations & AI',
    items: [
      { id: 'monte_carlo', label: 'Monte Carlo Simulation', icon: TrendingUp, badge: '10K' },
      { id: 'what_if', label: 'What-If Simulator', icon: Sliders, badge: 'Live' },
    ],
  },
  {
    label: 'Economics & Budget',
    items: [{ id: 'optimizer', label: 'Investment Optimizer', icon: Coins, badge: 'ROSI' }],
  },
  {
    label: 'Compliance & Logs',
    items: [
      { id: 'compliance', label: 'Regulatory Matrix', icon: FileCheck2, badge: 'RBI' },
      { id: 'ingestion', label: 'Live Telemetry Stream', icon: Radio, badge: 'Pulse' },
    ],
  },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  assetCount = 6,
  vulnCount = 10,
  liveEventsCount = 0,
  isOpen = false,
  onClose,
  isOnline = true,
  connectionInfo = { state: 'ONLINE' },
}) {
  // Escape closes the mobile drawer
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const navItems = [
    {
      group: 'Core Quantification',
      items: [
        { id: 'dashboard', label: 'CISO Overview', icon: LayoutDashboard, badge: null },
        { id: 'monte_carlo', label: 'Monte Carlo Simulation', icon: TrendingUp, badge: 'FAIR' },
        { id: 'optimizer', label: 'Knapsack Optimizer', icon: Coins, badge: 'ROSI' },
        { id: 'what_if', label: 'What-If Sandbox', icon: Sliders, badge: 'Live' },
      ]
    },
    {
      group: 'Enterprise Telemetry',
      items: [
        { id: 'assets', label: 'Banking Assets', icon: Server, badge: '6' },
        { id: 'vulnerabilities', label: 'Active CVEs', icon: ShieldAlert, badge: '10' },
        { id: 'attack_path', label: 'Attack Path Graph', icon: Network, badge: null },
        { id: 'ingestion', label: 'Live Telemetry Stream', icon: Radio, badge: 'OCSF' },
      ]
    },
    {
      group: 'Governance & Audit',
      items: [
        { id: 'compliance', label: 'Compliance Frameworks', icon: FileCheck2, badge: '100%' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="navigation-sidebar"
        aria-label="Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1">
                <span>Cyber-Quant</span>
                <span className="text-[10px] font-mono text-teal-800 px-1 py-0.2 rounded bg-teal-50 border border-teal-200">
                  v2.0
                </span>
              </div>
              <div className="text-[10.5px] text-slate-500 font-mono">FinTrust Bank CISO Console</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation sidebar"
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navItems.map((section) => (
            <div key={section.group}>
              <div className="px-3 mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                {section.group}
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const badgeText = item.id === 'assets' ? assetCount : (item.id === 'vulnerabilities' ? vulnCount : item.badge);
                  const count = item.id === 'ingestion' ? liveEventsCount : null;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          if (onClose) onClose();
                        }}
                        aria-current={isActive ? 'page' : undefined}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none ${
                          isActive
                            ? 'bg-teal-50 text-teal-950 font-semibold border border-teal-200 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-teal-700' : 'text-slate-500'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {count !== null && count > 0 ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold shrink-0">
                            {count} evt
                          </span>
                        ) : badgeText ? (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                              isActive
                                ? 'bg-teal-200 text-teal-950'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {badgeText}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer: Dynamic System Status */}
        <div className="p-3 border-t border-slate-200 shrink-0 bg-white">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  isOnline 
                    ? 'bg-emerald-500 animate-pulse' 
                    : connectionInfo?.state === 'CONNECTING' || connectionInfo?.state === 'BACKEND STARTING'
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-rose-500'
                }`} />
                <span className="text-[11px] font-semibold text-slate-800">
                  {isOnline 
                    ? 'Live Risk Engine' 
                    : connectionInfo?.state === 'BACKEND STARTING'
                    ? 'Backend Starting'
                    : connectionInfo?.state === 'CONNECTING'
                    ? 'Connecting...'
                    : 'Local Demo Engine'}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                isOnline 
                  ? 'text-emerald-700' 
                  : connectionInfo?.state === 'CONNECTING' || connectionInfo?.state === 'BACKEND STARTING'
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}>
                {isOnline 
                  ? 'Live API' 
                  : connectionInfo?.state === 'BACKEND STARTING'
                  ? 'Cold Spin (~30s)'
                  : connectionInfo?.state === 'CONNECTING'
                  ? 'Connecting'
                  : 'API Unavailable'}
              </span>
            </div>
            <div className="text-[10.5px] text-slate-600 flex items-center gap-1">
              <Zap className={`w-3 h-3 ${isOnline ? 'text-teal-600' : 'text-amber-600'}`} />
              <span>{isOnline ? 'FAIR + Knapsack Active' : 'Demo Mode — Standalone Engine'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
