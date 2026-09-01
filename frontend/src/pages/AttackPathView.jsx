import React, { useState } from 'react';
import {
  Network,
  Globe,
  Server,
  ShieldAlert,
  Database,
  Flame,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import CurrencyFormatter from '../components/CurrencyFormatter';
import RiskBadge from '../components/RiskBadge';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';

export default function AttackPathView({ onNavigate }) {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(1); // Default to Payment Server (Node 2)

  const attackNodes = [
    {
      id: "node-1",
      title: "1. External Threat Actor",
      subtitle: "Public Internet Scanning",
      icon: Globe,
      type: "threat_actor",
      risk_level: "High",
      technique: "T1595 - Active Scanning",
      description: "Adversary probes FinTrust Bank external IP ranges for exposed SSH and web ports.",
      exposure: "Internet",
      mitigation: "Geo-blocking & automated threat feed perimeter filtering"
    },
    {
      id: "node-2",
      title: "2. Internet Payment Server",
      subtitle: "Target: 103.21.144.12",
      icon: Server,
      type: "entry_point",
      risk_level: "Critical",
      technique: "T1190 - Exploit Public-Facing App",
      description: "Directly internet-facing Linux host running unpatched OpenSSH and single-factor credentials.",
      exposure: "Internet",
      eal: 7200000.0,
      mitigation: "Apply Emergency Patch (CTRL-001) & Mandate FIDO2 MFA (CTRL-002)"
    },
    {
      id: "node-3",
      title: "3. Remote Code Execution",
      subtitle: "Backdoor: CVE-2024-3094",
      icon: ShieldAlert,
      type: "vulnerability",
      risk_level: "Critical",
      technique: "T1059 - Command & Scripting Interpreter",
      description: "Adversary exploits upstream XZ backdoor to bypass authentication and spawn a root reverse shell.",
      exposure: "Network Service",
      eal: 7200000.0,
      mitigation: "Next-Gen EDR agent process termination & automated isolation"
    },
    {
      id: "node-4",
      title: "4. Lateral Pivot & Dumping",
      subtitle: "Unsegmented VLAN Hop",
      icon: Network,
      type: "intermediate_pivot",
      risk_level: "High",
      technique: "T1003 / T1021 - OS Credential Dumping & Remote Services",
      description: "Threat actor harvests database connection tokens from memory and traverses unsegmented internal subnet.",
      exposure: "Internal Subnet",
      mitigation: "Deploy Zero-Trust Micro-segmentation (CTRL-004)"
    },
    {
      id: "node-5",
      title: "5. Customer Core Database",
      subtitle: "Target: 172.16.20.45",
      icon: Database,
      type: "target_asset",
      risk_level: "Critical",
      technique: "T1048 - Exfiltration Over Alternative Protocol",
      description: "Compromise of 1.2M KYC records, transaction histories, and customer deposit account balances.",
      exposure: "Internal Vault",
      eal: 4800000.0,
      mitigation: "Database Activity Monitoring (DAM) & Field Encryption (CTRL-006)"
    },
    {
      id: "node-6",
      title: "6. Business & Regulatory Impact",
      subtitle: "Total Financial Damage",
      icon: Flame,
      type: "impact",
      risk_level: "Critical",
      technique: "Financial Loss / DPDP & RBI Penalties",
      description: "Estimated ₹4.0 Cr financial loss across server downtime, regulatory fines, customer compensation, and forensic recovery.",
      exposure: "Enterprise Wide",
      eal: 40000000.0,
      mitigation: "Optimal ₹25L Knapsack Security Control Portfolio"
    }
  ];

  const activeNode = attackNodes[selectedNodeIndex];
  const ActiveIcon = activeNode.icon;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Network}
        eyebrow="Exposure / Kill Chain"
        title="Visual Multi-Stage Attack Path"
        description="End-to-end adversary progression from initial internet discovery to core database exfiltration and financial impact."
        actions={
          <button onClick={() => onNavigate('optimizer')} className="btn btn-ok">
            <ShieldCheck className="w-4 h-4" />
            <span>Remediate Attack Chain</span>
          </button>
        }
      />

      {/* ===== Kill chain pipeline ===== */}
      <Reveal delay={60}>
        <Panel
          title="Adversary Kill Chain"
          subtitle="Click any stage node to inspect risk & mitigations"
          actions={
            <span className="chip border-danger-800 bg-danger-950 text-danger-300">
              <span className="live-dot-red !w-[6px] !h-[6px]" />
              CRITICAL INGRESS: PAYMENT SERVER
            </span>
          }
          bodyClassName="p-5 pt-4"
        >
          <div className="overflow-x-auto -mx-5 px-5 pb-1">
            <div className="flex items-stretch min-w-[980px] gap-0 py-2">
              {attackNodes.map((node, index) => {
                const Icon = node.icon;
                const isSelected = selectedNodeIndex === index;
                const isLast = index === attackNodes.length - 1;
                const isCritical = node.risk_level === 'Critical';

                return (
                  <React.Fragment key={node.id}>
                    <button
                      onClick={() => setSelectedNodeIndex(index)}
                      aria-pressed={isSelected}
                      aria-label={`Inspect ${node.title}`}
                      className={`flex-1 min-w-[136px] p-3 rounded-lg border text-center flex flex-col items-center transition-all select-none ${
                        isSelected
                          ? 'bg-brass-950/50 border-brass-500 -translate-y-1 shadow-[0_4px_18px_-6px_rgba(217,168,78,0.35)]'
                          : isCritical
                            ? 'bg-danger-950/25 border-danger-900 hover:border-danger-800'
                            : 'bg-ink-950 border-ink-800 hover:border-ink-700'
                      }`}
                    >
                      <span className="flex items-center justify-center w-7 h-7 rounded-md mb-2 border text-[10px] font-mono font-bold absolute-reference">
                        {index + 1}
                      </span>
                      <div
                        className={`p-2 rounded-md mb-2 border ${
                          isSelected
                            ? 'bg-brass-500 border-brass-400 text-ink-1000'
                            : isCritical
                              ? 'bg-danger-950 text-danger-400 border-danger-800'
                              : 'bg-ink-900 text-ink-300 border-ink-800'
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      <div className="font-semibold text-ink-50 text-[11px] leading-tight">{node.title}</div>
                      <div className="text-[9px] text-ink-400 font-mono mt-1">{node.subtitle}</div>
                      <div className="mt-2">
                        <RiskBadge level={node.risk_level} />
                      </div>
                    </button>

                    {!isLast && (
                      <div className="w-9 shrink-0 flex flex-col items-center justify-center pb-1" aria-hidden="true">
                        <svg width="30" height="10" viewBox="0 0 30 10" className="overflow-visible">
                          <line x1="0" y1="5" x2="30" y2="5" stroke="#5a6478" strokeWidth="1.5" className="flow-line" />
                        </svg>
                        <span className="text-[6.5px] font-mono text-ink-500 tracking-[0.18em] mt-1">ATT&amp;CK</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </Panel>
      </Reveal>

      {/* ===== Selected stage detail ===== */}
      {activeNode && (
        <Reveal delay={120}>
          <Panel className="border-ink-700" bodyClassName="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ink-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-brass-950 text-brass-400 border border-brass-800 shrink-0">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[15px] font-semibold text-ink-50">{activeNode.title}</h2>
                    <RiskBadge level={activeNode.risk_level} />
                  </div>
                  <p className="text-[11px] text-ink-400 font-mono mt-1">
                    MITRE ATT&amp;CK Technique: <strong className="text-brass-300">{activeNode.technique}</strong>
                  </p>
                </div>
              </div>

              {activeNode.eal && (
                <div className="text-right shrink-0">
                  <span className="eyebrow">Stage Financial Risk (EAL)</span>
                  <div className="text-xl font-mono font-bold text-danger-400 mt-0.5">
                    <CurrencyFormatter value={activeNode.eal} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <span className="eyebrow">Threat Mechanics &amp; Exposure Details</span>
                <p className="text-[12.5px] text-ink-200 leading-relaxed tile p-3.5 font-mono">
                  {activeNode.description}
                </p>
                <div className="text-[11px] text-ink-400 font-mono pt-1">
                  Target Environment Exposure: <strong className="text-ink-100">{activeNode.exposure}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="eyebrow text-ok-400">Required Security Control &amp; Mitigation</span>
                <div className="p-3.5 rounded-lg bg-ok-950/40 border border-ok-800/60 text-ink-100 font-mono text-[12px] leading-relaxed">
                  {activeNode.mitigation}
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('optimizer')}
                    className="btn btn-ok"
                  >
                    <span>Apply Fix in Budget Optimizer</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </Reveal>
      )}
    </div>
  );
}
