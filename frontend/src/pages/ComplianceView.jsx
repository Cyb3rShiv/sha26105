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
    tint: 'text-info-400 border-info-900/70',
    scopeCls: 'bg-info-950 text-info-300 border-info-800',
    checkCls: 'text-info-400',
    description: 'Mandates multi-factor authentication, perimeter defense, and 24x7 SOC log telemetry.',
    footnote: '100% Mapped Controls',
  },
  {
    name: 'SEBI CSCRF 2024',
    scope: 'CAPITAL MKTS',
    icon: Scale,
    tint: 'text-warn-400 border-warn-900/70',
    scopeCls: 'bg-warn-950 text-warn-300 border-warn-800',
    checkCls: 'text-warn-400',
    description: 'Cybersecurity & Cyber Resilience Framework covering air-gapped backups and Zero Trust.',
    footnote: '100% Mapped Controls',
  },
  {
    name: 'ISO/IEC 27001:2022',
    scope: 'GLOBAL',
    icon: Globe2,
    tint: 'text-brass-400 border-brass-900/70',
    scopeCls: 'bg-brass-950 text-brass-300 border-brass-800',
    checkCls: 'text-brass-400',
    description: 'Annex A controls for vulnerability management, cryptography, and access governance.',
    footnote: 'Annex A Aligned',
  },
  {
    name: 'NIST CSF 2.0',
    scope: 'STANDARD',
    icon: ClipboardList,
    tint: 'text-ok-400 border-ok-900/70',
    scopeCls: 'bg-ok-950 text-ok-300 border-ok-800',
    checkCls: 'text-ok-400',
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
        eyebrow="Governance / Regulatory Mapping"
        title="Regulatory & Compliance Framework Mapping"
        description="Automated compliance linkage to RBI Banking Guidelines, SEBI CSCRF, ISO 27001, and NIST CSF 2.0."
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-900 border border-ink-800 text-[11px] font-mono text-ink-200">
            <Award className="w-3.5 h-3.5 text-brass-400" />
            <span>Prototype Mapping (RBI &amp; SEBI Certified)</span>
          </div>
        }
      />

      {/* Framework overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FRAMEWORKS.map((fw, idx) => {
          const Icon = fw.icon;
          return (
            <Reveal key={fw.name} delay={idx * 70}>
              <div className={`panel panel-hover h-full p-5 border ${fw.tint}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="font-semibold text-[12.5px] text-ink-50 leading-tight">{fw.name}</span>
                  </div>
                  <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded border shrink-0 tracking-wider ${fw.scopeCls}`}>
                    {fw.scope}
                  </span>
                </div>
                <p className="text-[11px] text-ink-400 mt-2.5 leading-relaxed">{fw.description}</p>
                <div className={`mt-3.5 pt-3 border-t border-ink-800 text-[11px] font-mono font-semibold ${fw.checkCls}`}>
                  {fw.footnote}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Cross-mapping matrix */}
      <Reveal delay={120}>
        <Panel
          flush
          title="Security Controls & Regulatory Cross-Mapping Matrix"
          icon={ShieldCheck}
          actions={
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search regulatory clauses"
                placeholder="Search regulatory clause…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-9 w-52 md:w-64"
              />
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="data-table min-w-[820px]">
              <thead>
                <tr>
                  <th>Control & Category</th>
                  <th>RBI Banking</th>
                  <th>SEBI CSCRF</th>
                  <th>ISO 27001</th>
                  <th>NIST CSF 2.0</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={idx} className="hover:bg-ink-850">
                    <td>
                      <div className="font-semibold text-ink-50">{item.control_name}</div>
                      <div className="text-[10.5px] text-ink-400 font-mono mt-0.5">{item.category}</div>
                    </td>
                    <td className="font-mono text-info-300 text-[11px]">{item.rbi_framework}</td>
                    <td className="font-mono text-warn-300 text-[11px]">{item.sebi_cscrf}</td>
                    <td className="font-mono text-brass-300 text-[11px]">{item.iso27001}</td>
                    <td className="font-mono text-ok-300 text-[11px]">{item.nist_csf}</td>
                    <td>
                      <span className="chip border-ok-800 bg-ok-950 text-ok-300">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <EmptyState
              icon={Inbox}
              title="No clauses match your search"
              message="Search across control names, categories, RBI, SEBI CSCRF, ISO 27001 and NIST CSF clauses."
              action={
                <button onClick={() => setSearchTerm('')} className="btn btn-ghost">
                  Clear search
                </button>
              }
            />
          )}
        </Panel>
      </Reveal>
    </div>
  );
}
