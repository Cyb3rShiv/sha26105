import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  AlertOctagon,
  Flame,
  Globe,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function VulnerabilitiesView({ vulnerabilities = [], onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKev, setFilterKev] = useState('ALL');
  const [selectedCve, setSelectedCve] = useState(null);

  const filtered = vulnerabilities.filter(v => {
    const matchesSearch = v.cve_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKev = filterKev === 'ALL' || (filterKev === 'KEV' ? v.is_kev : !v.is_kev);
    return matchesSearch && matchesKev;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Vulnerabilities & Threat Signals</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active CVEs correlated with CISA KEV threat intelligence and explainable risk driver weights.
          </p>
        </div>

        {/* Search & KEV Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search CVE ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
            />
          </div>

          <select
            value={filterKev}
            onChange={(e) => setFilterKev(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All CVEs</option>
            <option value="KEV">Active KEV Only</option>
            <option value="NON_KEV">Standard CVEs</option>
          </select>
        </div>
      </div>

      {/* Main Grid: CVE Cards with Risk Driver Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((vuln) => {
          const isPrimary = vuln.cve_id === 'CVE-2024-3094';
          const weights = vuln.risk_driver_weights || {
            kev_weight: 90,
            internet_exposure: 85,
            weak_mfa: 80,
            asset_criticality: 90,
            patch_gap: 75
          };

          return (
            <div 
              key={vuln.cve_id}
              className={`cyber-card flex flex-col justify-between ${
                isPrimary ? 'border-rose-500/60 bg-rose-950/10' : ''
              }`}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">{vuln.cve_id}</span>
                      <RiskBadge level={vuln.severity} />
                      {vuln.is_kev && <RiskBadge isKev={true} />}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-200 mt-1">{vuln.title}</h3>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span className="text-sm font-mono font-bold text-rose-400">CVSS {vuln.cvss_score}</span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      EPSS: {(vuln.epss_score * 100).toFixed(0)}% Exploit Prob.
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {vuln.description}
                </p>

                {/* Risk Driver Bar Visualization */}
                <div className="mt-4 p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold block">
                    Explainable Risk Driver Weights
                  </span>

                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 w-36">CISA KEV Exploit:</span>
                      <div className="flex-1 mx-2 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${weights.kev_weight}%` }}></div>
                      </div>
                      <span className="text-rose-400 text-[10px] font-bold">{weights.kev_weight}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 w-36">Internet Exposure:</span>
                      <div className="flex-1 mx-2 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${weights.internet_exposure}%` }}></div>
                      </div>
                      <span className="text-amber-400 text-[10px] font-bold">{weights.internet_exposure}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 w-36">Weak / Missing MFA:</span>
                      <div className="flex-1 mx-2 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: `${weights.weak_mfa}%` }}></div>
                      </div>
                      <span className="text-orange-400 text-[10px] font-bold">{weights.weak_mfa}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 w-36">Asset Criticality:</span>
                      <div className="flex-1 mx-2 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${weights.asset_criticality}%` }}></div>
                      </div>
                      <span className="text-cyan-400 text-[10px] font-bold">{weights.asset_criticality}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 w-36">Patch Age / Gap:</span>
                      <div className="flex-1 mx-2 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${weights.patch_gap}%` }}></div>
                      </div>
                      <span className="text-blue-400 text-[10px] font-bold">{weights.patch_gap}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Affected: <strong className="text-slate-200">{vuln.affected_asset_ids?.join(', ')}</strong>
                </span>
                <button
                  onClick={() => onNavigate('optimizer')}
                  className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 text-[11px]"
                >
                  Remediate in Optimizer →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
