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
  liveEventsCount = 0,
  isOpen = false,
  onClose,
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
                <span className="text-sm font-bold tracking-tight text-slate-900">CyberQuant</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-mono font-bold">
                  PS 26105
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                FinTrust Bank SOC
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto bg-slate-50/50">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-500 px-3 mb-1.5">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const badge =
                    item.badge === 'Pulse' ? (liveEventsCount > 0 ? `${liveEventsCount} evt` : 'Live') : item.badge;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSelect(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                          isActive
                            ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-200 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {badge && (
                          <span
                            className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${
                              isActive
                                ? 'bg-teal-100 text-teal-900 border-teal-300'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer: System Status */}
        <div className="p-3 border-t border-slate-200 shrink-0 bg-white">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-700">Continuous Engine</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">99.9%</span>
            </div>
            <div className="text-[10.5px] text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-teal-600" />
              <span>FAIR + Knapsack Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
