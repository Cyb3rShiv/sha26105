import React, { useState } from 'react';
import { ShieldAlert, Search, ArrowRight, Inbox } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import Reveal from '../components/ui/Reveal';
import EmptyState from '../components/ui/EmptyState';

const DRIVER_ROWS = [
  { key: 'kev_weight', label: 'CISA KEV Exploit', cls: 'bg-danger-500', text: 'text-danger-400' },
  { key: 'internet_exposure', label: 'Internet Exposure', cls: 'bg-warn-500', text: 'text-warn-400' },
  { key: 'weak_mfa', label: 'Weak / Missing MFA', cls: 'bg-warn-400', text: 'text-warn-300' },
  { key: 'asset_criticality', label: 'Asset Criticality', cls: 'bg-brass-500', text: 'text-brass-300' },
  { key: 'patch_gap', label: 'Patch Age / Gap', cls: 'bg-info-500', text: 'text-info-400' },
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
        eyebrow="Exposure / Threat Signals"
        title="Vulnerabilities & Threat Signals"
        description="Active CVEs correlated with CISA KEV threat intelligence and explainable risk driver weights."
        actions={
          <div className="flex items-center gap-2">
            <span className="chip border-danger-800 bg-danger-950 text-danger-300">
              <span className="w-1.5 h-1.5 rounded-full bg-danger-500" />
              {kevCount} ACTIVE KEV
            </span>
            <span className="chip">{vulnerabilities.length} TOTAL CVES</span>
          </div>
        }
      />

      {/* Search & KEV filter */}
      <Reveal delay={60} className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            aria-label="Search vulnerabilities"
            placeholder="Search CVE ID or name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <select
          aria-label="Filter by KEV status"
          value={filterKev}
          onChange={(e) => setFilterKev(e.target.value)}
          className="select"
        >
          <option value="ALL">All CVEs</option>
          <option value="KEV">Active KEV Only</option>
          <option value="NON_KEV">Standard CVEs</option>
        </select>
        <span className="text-[11px] font-mono text-ink-500 sm:ml-auto">
          {filtered.length} shown
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
            <Reveal key={vuln.cve_id} delay={Math.min(idx * 60, 360)}>
              <div
                className={`panel panel-hover h-full flex flex-col justify-between relative overflow-hidden ${
                  isPrimary ? 'border-danger-800' : ''
                }`}
              >
                {isPrimary && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-danger-500" />}

                <div className="p-5 pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-[13px] text-ink-50">{vuln.cve_id}</span>
                        <RiskBadge level={vuln.severity} />
                        {vuln.is_kev && <RiskBadge isKev={true} />}
                      </div>
                      <h3 className="text-xs font-semibold text-ink-200 mt-1.5">{vuln.title}</h3>
                    </div>
                    <div className="text-right whitespace-nowrap shrink-0">
                      <span className="text-[13px] font-mono font-bold text-danger-400">CVSS {vuln.cvss_score}</span>
                      <div className="text-[10px] text-ink-500 font-mono mt-0.5">
                        EPSS: {(vuln.epss_score * 100).toFixed(0)}% Exploit Prob.
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-ink-400 mt-2.5 leading-relaxed line-clamp-2">{vuln.description}</p>
                </div>

                {/* Explainable driver weights */}
                <div className="p-5">
                  <div className="tile p-3.5 space-y-2.5">
                    <span className="eyebrow text-brass-400 block">Explainable Risk Driver Weights</span>
                    {DRIVER_ROWS.map((row) => (
                      <div key={row.key} className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-ink-400 w-36 shrink-0">{row.label}:</span>
                        <div className="flex-1 meter !h-1.5">
                          <span className={row.cls} style={{ width: `${weights[row.key]}%`, animationDelay: `${idx * 60}ms` }} />
                        </div>
                        <span className={`${row.text} text-[10px] font-bold w-8 text-right`}>{weights[row.key]}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-ink-800 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-ink-400 font-mono min-w-0 truncate">
                      Affected: <strong className="text-ink-200">{vuln.affected_asset_ids?.join(', ')}</strong>
                    </span>
                    <button
                      onClick={() => onNavigate('optimizer')}
                      className="text-brass-400 hover:text-brass-300 font-mono flex items-center gap-1 text-[11px] shrink-0"
                    >
                      Remediate in Optimizer <ArrowRight className="w-3 h-3" />
                    </button>
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
            title="No vulnerabilities match your filters"
            message="Adjust the search term or KEV filter to see correlated CVEs and their risk driver weights."
            action={
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterKev('ALL');
                }}
                className="btn btn-ghost"
              >
                Clear filters
              </button>
            }
          />
        </Panel>
      )}
    </div>
  );
}
