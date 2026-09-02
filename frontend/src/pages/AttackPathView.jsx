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
      subtitle: "Public Internet Recon",
      icon: Globe,
      type: "threat_actor",
      risk_level: "High",
      technique: "T1595 - Active Scanning",
      description: "Adversary probes FinTrust Bank external IP ranges for exposed SSH and perimeter web ports.",
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
      technique: "T1003 / T1021 - OS Credential Dumping",
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
      title: "6. Balance Sheet Impact",
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
        index="04"
        eyebrow="Exposure & Kill Chain"
        title="Visual Multi-Stage Attack Path"
        description="End-to-end adversary lateral progression from initial internet discovery to core database exfiltration and financial impact."
        actions={
          <button onClick={() => onNavigate('optimizer')} className="btn btn-primary text-xs shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Remediate Attack Chain</span>
          </button>
        }
      />

      {/* ===== Kill Chain Pipeline ===== */}
      <Reveal delay={60}>
        <Panel
          title="Adversary Lateral Kill Chain Pipeline"
          subtitle="Click any stage node to inspect attack mechanics, MITRE ATT&CK techniques, and specific mitigations."
          actions={
            <span className="badge-rose font-bold">
              CRITICAL INGRESS: PAYMENT SERVER
            </span>
          }
          bodyClassName="p-5 pt-4"
        >
          <div className="overflow-x-auto -mx-5 px-5 pb-2">
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
                      className={`flex-1 min-w-[140px] p-3.5 rounded-xl border text-center flex flex-col items-center transition-all select-none ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-600 shadow-md -translate-y-1'
                          : isCritical
                            ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-lg mb-2 border ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-800'
                            : isCritical
                              ? 'bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-slate-900 text-xs leading-tight">{node.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">{node.subtitle}</div>
                      <div className="mt-2.5">
                        <RiskBadge level={node.risk_level} />
                      </div>
                    </button>

                    {!isLast && (
                      <div className="w-8 shrink-0 flex flex-col items-center justify-center pb-1" aria-hidden="true">
                        <div className="w-full h-0.5 bg-slate-300 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t-2 border-r-2 border-slate-400 rotate-45" />
                        </div>
                        <span className="text-[7.5px] font-mono text-slate-400 font-bold uppercase tracking-wider mt-1">ATT&amp;CK</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </Panel>
      </Reveal>

      {/* ===== Selected Stage Detail ===== */}
      {activeNode && (
        <Reveal delay={120}>
          <Panel bodyClassName="p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900">{activeNode.title}</h2>
                    <RiskBadge level={activeNode.risk_level} />
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    MITRE ATT&amp;CK: <strong className="text-teal-800">{activeNode.technique}</strong>
                  </p>
                </div>
              </div>

              {activeNode.eal && (
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono uppercase text-slate-400 font-semibold">Stage Financial Risk</div>
                  <div className="text-xl font-mono font-bold text-rose-600 mt-0.5">
                    <CurrencyFormatter value={activeNode.eal} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-slate-500">Threat Mechanics &amp; Exposure</div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-mono">
                  {activeNode.description}
                </p>
                <div className="text-xs text-slate-500 font-mono pt-1">
                  Target Exposure: <strong className="text-slate-800">{activeNode.exposure}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-teal-800">Required Mitigation Control</div>
                <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-mono text-xs leading-relaxed font-medium">
                  {activeNode.mitigation}
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('optimizer')}
                    className="btn btn-primary text-xs shadow-sm"
                  >
                    <span>Allocate Mitigation in Optimizer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
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
