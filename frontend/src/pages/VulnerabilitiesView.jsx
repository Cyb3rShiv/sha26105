import React, { useState } from 'react';
import { ShieldAlert, Search, ArrowRight, Inbox } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import EmptyState from '../components/ui/EmptyState';

const DRIVER_ROWS = [
  { key: 'kev_weight', label: 'CISA KEV Exploit', cls: 'bg-rose-500', text: 'text-rose-700' },
  { key: 'internet_exposure', label: 'Internet Exposure', cls: 'bg-amber-500', text: 'text-amber-800' },
  { key: 'weak_mfa', label: 'Weak / Missing MFA', cls: 'bg-amber-400', text: 'text-amber-700' },
  { key: 'asset_criticality', label: 'Asset Criticality', cls: 'bg-teal-600', text: 'text-teal-800' },
  { key: 'patch_gap', label: 'Patch Age / Gap', cls: 'bg-blue-500', text: 'text-blue-700' },
];

export default function VulnerabilitiesView({ vulnerabilities = [], onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKev, setFilterKev] = useState('ALL');

  const filtered = vulnerabilities.filter(v => {
    const matchesSearch = v.cve_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKev = filterKev === 'ALL' || (filterKev === 'KEV' ? v.is_kev : !v.is_kev);
    return matchesSearch && matchesKev;
  });

  const kevCount = vulnerabilities.filter(v => v.is_kev).length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={ShieldAlert}
        index="03"
        eyebrow="Exposure & Threat Signals"
        title="Vulnerabilities & Exploit Signals"
        description="Active CVE catalog mapped directly to CISA Known Exploited Vulnerabilities (KEV) and multi-factor risk driver weights."
        actions={
          <div className="flex items-center gap-2">
            <span className="badge-rose font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {kevCount} ACTIVE KEV
            </span>
            <span className="badge-slate font-bold">{vulnerabilities.length} TOTAL CVES</span>
          </div>
        }
      />

      {/* Search & KEV filter */}
      <Reveal delay={60} className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search vulnerabilities"
            placeholder="Search CVE ID, title, keyword…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-teal-700 shadow-sm"
          />
        </div>
        <select
          aria-label="Filter by KEV status"
          value={filterKev}
          onChange={(e) => setFilterKev(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono focus:outline-teal-700 shadow-sm"
        >
          <option value="ALL">All Vulnerabilities</option>
          <option value="KEV">Active KEV Exploits Only</option>
          <option value="NON_KEV">Standard CVEs</option>
        </select>
        <span className="text-xs font-mono text-slate-500 sm:ml-auto">
          {filtered.length} of {vulnerabilities.length} Shown
        </span>
      </Reveal>

      {/* CVE cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((vuln, idx) => {
          const isPrimary = vuln.cve_id === 'CVE-2024-3094';
          const weights = vuln.risk_driver_weights || {
            kev_weight: 90,
            internet_exposure: 85,
            weak_mfa: 80,
            asset_criticality: 90,
            patch_gap: 75
          };

          return (
            <Reveal key={vuln.cve_id} delay={Math.min(idx * 40, 240)}>
              <div
                className={`panel panel-hover h-full flex flex-col justify-between relative overflow-hidden ${
                  isPrimary ? 'border-rose-300 bg-rose-50/20' : ''
                }`}
              >
                {isPrimary && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-rose-500" />}

                <div className="p-5 pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-slate-900">{vuln.cve_id}</span>
                        <RiskBadge level={vuln.severity} isKev={vuln.is_kev} />
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 mt-1">{vuln.title}</h2>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono uppercase text-slate-400 font-semibold">CVSS Score</div>
                      <div className="text-lg font-bold font-mono text-rose-600 leading-none mt-1">
                        {vuln.cvss_score || vuln.cvss}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{vuln.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500">
                    <span>Attack Vector: <strong className="text-slate-800">{vuln.attack_vector || 'Network'}</strong></span>
                    <span>•</span>
                    <span>EPSS Score: <strong className="text-slate-800">{((vuln.epss_score || 0.85) * 100).toFixed(0)}%</strong></span>
                  </div>
                </div>

                {/* Risk driver weights meter */}
                <div className="p-5 pt-4">
                  <div className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold mb-2">
                    Multi-Factor Risk Contribution Weights
                  </div>
                  <div className="space-y-1.5">
                    {DRIVER_ROWS.map((d) => {
                      const val = weights[d.key] || 75;
                      return (
                        <div key={d.key} className="flex items-center gap-3 text-[11px] font-mono">
                          <span className="w-36 text-slate-600 truncate">{d.label}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full ${d.cls}`}
                              style={{ width: `${val}%` }}
                            />
                          </div>
                          <span className={`w-9 text-right font-bold ${d.text}`}>{val}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Panel>
          <EmptyState
            icon={Inbox}
            title="No vulnerabilities found"
            message="Try searching for a different CVE identifier or clearing the filter."
            action={
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterKev('ALL');
                }}
                className="btn btn-secondary text-xs"
              >
                Reset filters
              </button>
            }
          />
        </Panel>
      )}
    </div>
  );
}
