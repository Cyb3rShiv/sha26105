import React, { useState } from 'react';
import { FileCheck2, Search, ShieldCheck, Award, Scale, Landmark, Globe2, ClipboardList, Inbox } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import EmptyState from '../components/ui/EmptyState';

const FRAMEWORKS = [
  {
    name: 'RBI Cyber Security Framework',
    scope: 'BANKS',
    icon: Landmark,
    tint: 'border-blue-200 bg-blue-50/20 text-blue-700',
    scopeCls: 'badge-blue',
    checkCls: 'text-blue-700',
    description: 'Mandates multi-factor authentication, perimeter defense, and 24x7 SOC log telemetry.',
    footnote: '100% Mapped Controls',
  },
  {
    name: 'SEBI CSCRF 2024',
    scope: 'CAPITAL MKTS',
    icon: Scale,
    tint: 'border-amber-200 bg-amber-50/20 text-amber-800',
    scopeCls: 'badge-amber',
    checkCls: 'text-amber-800',
    description: 'Cybersecurity & Cyber Resilience Framework covering air-gapped backups and Zero Trust.',
    footnote: '100% Mapped Controls',
  },
  {
    name: 'ISO/IEC 27001:2022',
    scope: 'GLOBAL',
    icon: Globe2,
    tint: 'border-teal-200 bg-teal-50/20 text-teal-800',
    scopeCls: 'badge-emerald',
    checkCls: 'text-teal-800',
    description: 'Annex A controls for vulnerability management, cryptography, and access governance.',
    footnote: 'Annex A Aligned',
  },
  {
    name: 'NIST CSF 2.0',
    scope: 'STANDARD',
    icon: ClipboardList,
    tint: 'border-slate-200 bg-slate-50 text-slate-700',
    scopeCls: 'badge-slate',
    checkCls: 'text-slate-800',
    description: 'Govern, Identify, Protect, Detect, Respond, Recover functions with ROSI validation.',
    footnote: 'NIST 2.0 Verified',
  },
];

export default function ComplianceView({ complianceMappings = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={FileCheck2}
        index="08"
        eyebrow="Governance & Regulatory Frameworks"
        title="Regulatory Matrix & Audit Mapping"
        description="Automated compliance traceability cross-mapped to RBI Banking Guidelines, SEBI CSCRF 2024, ISO 27001, and NIST CSF 2.0."
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-mono font-bold text-teal-800">
            <Award className="w-3.5 h-3.5 text-teal-700" />
            <span>Audit-Ready Cross-Mapping</span>
          </div>
        }
      />

      {/* Framework overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FRAMEWORKS.map((fw, idx) => {
          const Icon = fw.icon;
          return (
            <Reveal key={fw.name} delay={idx * 50}>
              <div className={`panel h-full p-5 border ${fw.tint}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="font-bold text-xs text-slate-900 leading-tight">{fw.name}</span>
                  </div>
                  <span className={`${fw.scopeCls} text-[9.5px] shrink-0`}>
                    {fw.scope}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{fw.description}</p>
                <div className={`mt-3.5 pt-3 border-t border-slate-200 text-xs font-mono font-bold ${fw.checkCls}`}>
                  ✓ {fw.footnote}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Search Bar */}
      <Reveal delay={100} className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search compliance controls"
            placeholder="Search control name, section, ISO, RBI clause…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-teal-700 shadow-sm"
          />
        </div>
        <span className="text-xs font-mono text-slate-500 sm:ml-auto">
          {filtered.length} of {complianceMappings.length} Controls Mapped
        </span>
      </Reveal>

      {/* Compliance Mapping Table */}
      <Reveal delay={140}>
        <Panel flush>
          <div className="overflow-x-auto">
            <table className="data-table min-w-[700px]">
              <thead>
                <tr>
                  <th>Security Control</th>
                  <th>Category</th>
                  <th>RBI Cyber Security</th>
                  <th>SEBI CSCRF 2024</th>
                  <th>ISO 27001:2022</th>
                  <th>NIST CSF 2.0</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td>
                      <div className="font-bold text-slate-900">{item.control_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.control_id}</div>
                    </td>
                    <td>
                      <span className="badge-slate font-mono text-[10.5px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-blue-700 font-semibold">{item.rbi_framework}</td>
                    <td className="font-mono text-xs text-amber-800 font-semibold">{item.sebi_cscrf}</td>
                    <td className="font-mono text-xs text-teal-800 font-semibold">{item.iso27001}</td>
                    <td className="font-mono text-xs text-slate-700 font-semibold">{item.nist_csf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </Reveal>

      {filtered.length === 0 && (
        <Panel>
          <EmptyState
            icon={Inbox}
            title="No regulatory mappings found"
            message="Try searching for a different clause, control name, or framework standard."
            action={
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary text-xs"
              >
                Clear Search
              </button>
            }
          />
        </Panel>
      )}
    </div>
  );
}
