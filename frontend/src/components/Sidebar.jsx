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
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Exposure',
    items: [
      { id: 'assets', label: 'Asset Risk Inventory', icon: Server, badge: '6' },
      { id: 'vulnerabilities', label: 'Threats & CVEs', icon: ShieldAlert, badge: '10' },
      { id: 'attack_path', label: 'Attack Path Graph', icon: Network },
    ],
  },
  {
    label: 'Modeling',
    items: [
      { id: 'monte_carlo', label: 'Monte Carlo Simulation', icon: TrendingUp, badge: '10K' },
      { id: 'what_if', label: 'What-If Simulator', icon: Sliders, badge: 'Live' },
    ],
  },
  {
    label: 'Decisions',
    items: [{ id: 'optimizer', label: 'Investment Optimizer', icon: Coins, badge: 'ROSI' }],
  },
  {
    label: 'Governance',
    items: [
      { id: 'compliance', label: 'Regulatory Frameworks', icon: FileCheck2, badge: 'RBI' },
      { id: 'ingestion', label: 'Live Telemetry Stream', icon: Radio, badge: 'Pulse' },
    ],
  },
];

function BrandMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#d9a84e"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 8.2h5.2M9.4 10.6h5.2M11.8 8.2c1.9 0 3.1 1 3.1 2.4 0 1.4-1.2 2.4-3.1 2.4h-.4l3.2 3.2M11.4 13v3"
        stroke="#e5bc63"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          className="fixed inset-0 z-40 bg-ink-1000/75 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-50 w-[270px] bg-ink-950 border-r border-ink-800 flex flex-col h-full select-none
          transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/60' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="px-5 h-16 flex items-center justify-between border-b border-ink-800 shrink-0">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold tracking-[0.08em] text-ink-50">CYBER-QUANT</span>
                <span className="text-[9px] px-1.5 py-px rounded bg-brass-950 text-brass-300 border border-brass-800 font-mono">
                  PS 26105
                </span>
              </div>
              <div className="text-[10px] text-ink-400 tracking-wider font-mono mt-0.5">
                FinTrust Bank SOC
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="p-1.5 rounded-md text-ink-400 hover:text-ink-50 hover:bg-ink-850 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grouped navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="eyebrow px-3 mb-1.5">{group.label}</div>
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
                        className={`group relative w-full flex items-center justify-between pl-4 pr-3 py-2 rounded-lg text-[12.5px] font-medium transition-colors ${
                          isActive
                            ? 'bg-ink-850 text-ink-50'
                            : 'text-ink-300 hover:text-ink-100 hover:bg-ink-900'
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-brass-500" />
                        )}
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-[15px] h-[15px] shrink-0 transition-colors ${
                              isActive ? 'text-brass-400' : 'text-ink-400 group-hover:text-ink-300'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap ${
                              isActive
                                ? 'bg-brass-950 text-brass-300 border-brass-800'
                                : 'bg-ink-900 text-ink-400 border-ink-800'
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

        {/* Telemetry engine status */}
        <div className="p-4 border-t border-ink-800 bg-ink-1000/60 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="text-[11px] font-medium text-ink-200">Telemetry Engine</span>
            </div>
            <span className="text-[9px] text-ok-400 font-mono bg-ok-950 px-1.5 py-0.5 rounded border border-ok-800 tracking-wider">
              ONLINE
            </span>
          </div>
          <div className="mt-2 text-[9.5px] text-ink-500 font-mono flex justify-between">
            <span>Continuous Ingest</span>
            <span>100% Normalized</span>
          </div>
        </div>
      </aside>
    </>
  );
}
