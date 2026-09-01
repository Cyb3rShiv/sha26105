import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink,
  BookOpen,
  Award
} from 'lucide-react';

export default function ComplianceView({ complianceMappings = [], onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('ALL');

  const filtered = complianceMappings.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = item.control_name.toLowerCase().includes(term) ||
                          item.category.toLowerCase().includes(term) ||
                          item.rbi_framework.toLowerCase().includes(term) ||
                          item.sebi_cscrf.toLowerCase().includes(term) ||
                          item.iso27001.toLowerCase().includes(term) ||
                          item.nist_csf.toLowerCase().includes(term);
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Regulatory & Compliance Framework Mapping</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated compliance linkage to RBI Banking Guidelines, SEBI CSCRF, ISO 27001, and NIST CSF 2.0.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Prototype Mapping (RBI & SEBI Certified)</span>
        </div>
      </div>

      {/* Compliance Framework Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card border-blue-500/30 p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-white">RBI Cyber Security Framework</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300">BANKS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Mandates multi-factor authentication, perimeter defense, and 24x7 SOC log telemetry.
          </p>
          <div className="mt-3 text-xs font-mono text-blue-400 font-semibold">100% Mapped Controls</div>
        </div>

        <div className="cyber-card border-purple-500/30 p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-white">SEBI CSCRF 2024</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300">CAPITAL MKTS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Cybersecurity & Cyber Resilience Framework covering air-gapped backups and Zero Trust.
          </p>
          <div className="mt-3 text-xs font-mono text-purple-400 font-semibold">100% Mapped Controls</div>
        </div>

        <div className="cyber-card border-cyan-500/30 p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-white">ISO/IEC 27001:2022</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">GLOBAL</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Annex A controls for vulnerability management, cryptography, and access governance.
          </p>
          <div className="mt-3 text-xs font-mono text-cyan-400 font-semibold">Annex A Aligned</div>
        </div>

        <div className="cyber-card border-emerald-500/30 p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-white">NIST CSF 2.0</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">STANDARD</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Govern, Identify, Protect, Detect, Respond, Recover functions with ROSI validation.
          </p>
          <div className="mt-3 text-xs font-mono text-emerald-400 font-semibold">NIST 2.0 Verified</div>
        </div>
      </div>

      {/* Compliance Mapping Matrix Table */}
      <div className="cyber-card p-0 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Security Controls & Regulatory Cross-Mapping Matrix
          </h2>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search regulatory clause..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-cyber-border text-slate-400 font-mono uppercase tracking-wider">
                <th className="p-4">Control & Category</th>
                <th className="p-4">RBI Banking Framework</th>
                <th className="p-4">SEBI CSCRF</th>
                <th className="p-4">ISO 27001 (Annex A)</th>
                <th className="p-4">NIST CSF 2.0</th>
                <th className="p-4">Remediation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{item.control_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.category}</div>
                  </td>
                  <td className="p-4 font-mono text-blue-300 text-[11px]">
                    {item.rbi_framework}
                  </td>
                  <td className="p-4 font-mono text-purple-300 text-[11px]">
                    {item.sebi_cscrf}
                  </td>
                  <td className="p-4 font-mono text-cyan-300 text-[11px]">
                    {item.iso27001}
                  </td>
                  <td className="p-4 font-mono text-emerald-300 text-[11px]">
                    {item.nist_csf}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
