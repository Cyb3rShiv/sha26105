import React, { useState } from 'react';
import { 
  Network, 
  Globe, 
  Server, 
  ShieldAlert, 
  Database, 
  Flame, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  ChevronDown,
  AlertTriangle,
  Lock
} from 'lucide-react';
import CurrencyFormatter, { formatINR } from '../components/CurrencyFormatter';
import RiskBadge from '../components/RiskBadge';

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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Visual Multi-Stage Attack Path</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end adversary progression from initial internet discovery to core database exfiltration and financial impact.
          </p>
        </div>

        <button
          onClick={() => onNavigate('optimizer')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow-emerald transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Remediate Attack Chain in Optimizer</span>
        </button>
      </div>

      {/* Interactive Horizontal Flow Pipeline */}
      <div className="cyber-card p-6 bg-slate-950/80 border-cyan-500/30 overflow-x-auto">
        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mb-4 flex items-center justify-between">
          <span>Adversary Kill Chain (Click any stage node to inspect risk & mitigations)</span>
          <span className="text-rose-400 font-bold">● CRITICAL INGRESS: PAYMENT SERVER</span>
        </div>

        <div className="flex items-center justify-between min-w-[850px] gap-2 py-4">
          {attackNodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNodeIndex === index;
            const isLast = index === attackNodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div 
                  onClick={() => setSelectedNodeIndex(index)}
                  className={`cursor-pointer flex-1 p-3.5 rounded-xl border transition-all select-none flex flex-col items-center text-center ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-glow-cyan transform -translate-y-1'
                      : node.risk_level === 'Critical'
                        ? 'bg-rose-950/30 border-rose-800/60 hover:border-rose-600'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-2 ${
                    isSelected 
                      ? 'bg-cyan-500 text-black' 
                      : node.risk_level === 'Critical' 
                        ? 'bg-rose-950 text-rose-400 border border-rose-700' 
                        : 'bg-slate-800 text-slate-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="font-bold text-white text-xs leading-tight">
                    {node.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {node.subtitle}
                  </div>

                  <div className="mt-2">
                    <RiskBadge level={node.risk_level} />
                  </div>
                </div>

                {/* Connecting Arrow */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center px-1 text-slate-600">
                    <ArrowRight className="w-4 h-4 text-cyan-500/70" />
                    <span className="text-[8px] font-mono text-slate-500 mt-0.5">ATT&CK</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspection Card */}
      {activeNode && (
        <div className="cyber-card p-6 border-cyan-500/40 bg-gradient-to-r from-slate-900 via-cyber-card to-slate-900 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                <activeNode.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">{activeNode.title}</h2>
                  <RiskBadge level={activeNode.risk_level} />
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  MITRE ATT&CK Technique: <strong className="text-cyan-300">{activeNode.technique}</strong>
                </p>
              </div>
            </div>

            {activeNode.eal && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Stage Financial Risk (EAL)</span>
                <div className="text-xl font-bold font-mono text-rose-400">
                  <CurrencyFormatter value={activeNode.eal} />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                Threat Mechanics & Exposure Details
              </span>
              <p className="text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono">
                {activeNode.description}
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                Target Environment Exposure: <strong className="text-white">{activeNode.exposure}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                Required Security Control & Mitigation
              </span>
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-700/40 text-slate-200 font-mono">
                {activeNode.mitigation}
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigate('optimizer')}
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  Apply Fix in Budget Optimizer →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
