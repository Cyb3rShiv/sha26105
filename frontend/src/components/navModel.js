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
} from 'lucide-react';

/**
 * Single source of truth for primary navigation — consumed by the
 * Sidebar, the ⌘K command palette, and anywhere else that needs to
 * mirror the app map. Presentation data only; no behavior.
 */
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Executive Dashboard',
        icon: LayoutDashboard,
        keywords: ['home', 'eal', 'kpi', 'overview', 'risk score'],
      },
    ],
  },
  {
    label: 'Exposure',
    items: [
      { id: 'assets', label: 'Asset Risk Inventory', icon: Server, badge: '6', keywords: ['infrastructure', 'servers', 'inventory', 'eal'] },
      { id: 'vulnerabilities', label: 'Threats & CVEs', icon: ShieldAlert, badge: '10', keywords: ['cve', 'kev', 'cvss', 'epss', 'patch'] },
      { id: 'attack_path', label: 'Attack Path Graph', icon: Network, keywords: ['kill chain', 'mitre', 'att&ck', 'lateral'] },
    ],
  },
  {
    label: 'Modeling',
    items: [
      { id: 'monte_carlo', label: 'Monte Carlo Simulation', icon: TrendingUp, badge: '10K', keywords: ['simulation', 'var', 'tail', 'distribution', 'p90'] },
      { id: 'what_if', label: 'What-If Simulator', icon: Sliders, badge: 'Live', keywords: ['controls', 'sandbox', 'scenario', 'rosi'] },
    ],
  },
  {
    label: 'Decisions',
    items: [
      { id: 'optimizer', label: 'Investment Optimizer', icon: Coins, badge: 'ROSI', keywords: ['budget', 'knapsack', 'allocation', 'rosi', 'spend'] },
    ],
  },
  {
    label: 'Governance',
    items: [
      { id: 'compliance', label: 'Regulatory Frameworks', icon: FileCheck2, badge: 'RBI', keywords: ['rbi', 'sebi', 'iso', 'nist', 'audit'] },
      { id: 'ingestion', label: 'Live Telemetry Stream', icon: Radio, badge: 'Pulse', keywords: ['siem', 'edr', 'events', 'stream', 'ocsf'] },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) =>
  g.items.map((item) => ({ ...item, group: g.label }))
);
