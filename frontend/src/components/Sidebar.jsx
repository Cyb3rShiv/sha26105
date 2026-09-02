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

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const getBadge = (item) => {
    if (item.id === 'assets') return assetCount ? String(assetCount) : '6';
    if (item.id === 'vulnerabilities') return vulnCount ? String(vulnCount) : '10';
    return item.badge;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-200 flex flex-col h-full select-none
          transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className="px-5 h-16 flex items-center justify-between border-b border-slate-200 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-slate-900">Cyber-Quant</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold">
                  PS 26105
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono">FinTrust Bank Console</div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Console Modules">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="px-2.5 mb-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const count = item.id === 'ingestion' ? liveEventsCount : null;
                  const badgeText = getBadge(item);

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSelect(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-teal-50 text-teal-900 font-bold shadow-xs border border-teal-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-600'}`} />
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
                                ? 'bg-teal-200 text-teal-900'
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
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="text-[11px] font-semibold text-slate-700">
                  {isOnline ? 'Live Risk Engine' : 'Local Simulation'}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isOnline ? 'Live API' : 'Fallback'}
              </span>
            </div>
            <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
              <Zap className={`w-3 h-3 ${isOnline ? 'text-teal-600' : 'text-amber-600'}`} />
              <span>{isOnline ? 'FAIR + Knapsack Active' : 'Offline Precision Engine'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
